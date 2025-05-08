import Replicate from "replicate";
import { HfInference } from '@huggingface/inference';

// Safe environment variable access
const REPLICATE_API_TOKEN = process.env.NEXT_PUBLIC_REPLICATE_API_TOKEN;
const HUGGINGFACE_API_KEY = process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY;

// Initialize clients only if tokens are available
const replicate = REPLICATE_API_TOKEN ? new Replicate({
  auth: REPLICATE_API_TOKEN,
}) : null;

const hf = HUGGINGFACE_API_KEY ? new HfInference(HUGGINGFACE_API_KEY) : null;

// Model configurations
const LLAMA2_MODEL = "meta/llama-2-70b-chat:02e509c789964a7ea8736978a43525956ef40397be9033abf9fd2badfe68c9e3";
const MISTRAL_MODEL = "mistralai/mistral-7b-instruct-v0.1";

export async function generateSuggestions(content: string, preferredProvider: 'replicate' | 'huggingface' = 'replicate') {
  try {
    if (!replicate && !hf) {
      console.warn('AI services not configured. Please check your environment variables.');
      return null;
    }

    if (preferredProvider === 'replicate' && replicate) {
      return await generateReplicateSuggestions(content);
    } else if (hf) {
      return await generateHuggingFaceSuggestions(content);
    }
    
    // Fallback if preferred provider is not available
    if (replicate) {
      return await generateReplicateSuggestions(content);
    } else if (hf) {
      return await generateHuggingFaceSuggestions(content);
    }
    
    return null;
  } catch (error) {
    console.error('Error generating suggestions:', error);
    return null;
  }
}

async function generateReplicateSuggestions(content: string) {
  if (!replicate) return null;
  
  const prompt = `You are a helpful AI writing assistant. Please provide brief, relevant suggestions for improving or expanding the following text: "${content}"`;
  
  const output = await replicate.run(LLAMA2_MODEL, {
    input: {
      prompt,
      max_new_tokens: 150,
      temperature: 0.7,
      top_p: 0.9,
      repetition_penalty: 1.1,
    },
  });

  return Array.isArray(output) ? output.join(' ') : output;
}

async function generateHuggingFaceSuggestions(content: string) {
  if (!hf) return null;
  
  const prompt = `<s>[INST] You are a helpful AI writing assistant. Please provide brief, relevant suggestions for improving or expanding the following text: "${content}" [/INST]`;
  
  const response = await hf.textGeneration({
    model: MISTRAL_MODEL,
    inputs: prompt,
    parameters: {
      max_new_tokens: 150,
      temperature: 0.7,
      top_p: 0.9,
      repetition_penalty: 1.1,
    },
  });

  return response.generated_text;
}

export async function analyzeText(content: string) {
  if (!hf) return null;
  
  try {
    const response = await hf.textClassification({
      model: 'SamLowe/roberta-base-go_emotions',
      inputs: content,
    });

    return response;
  } catch (error) {
    console.error('Error analyzing text:', error);
    return null;
  }
}

export async function generateRelatedTopics(content: string) {
  if (!replicate) return null;
  
  try {
    const prompt = `Given the following text, suggest 3-5 related topics that might be interesting to explore: "${content}"`;
    
    const output = await replicate.run(LLAMA2_MODEL, {
      input: {
        prompt,
        max_new_tokens: 100,
        temperature: 0.7,
      },
    });

    return Array.isArray(output) ? output.join(' ') : output;
  } catch (error) {
    console.error('Error generating related topics:', error);
    return null;
  }
}
