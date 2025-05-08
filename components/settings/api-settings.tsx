'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Key, Lock, Server, Check, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';

interface ModelConfig {
  id: string;
  name: string;
  type: 'commercial' | 'opensource';
  isEnabled: boolean;
  apiKey?: string;
  endpoint?: string;
}

export function APISettings() {
  const [models, setModels] = useState<ModelConfig[]>([
    {
      id: 'openai',
      name: 'OpenAI GPT',
      type: 'commercial',
      isEnabled: false,
      apiKey: '',
    },
    {
      id: 'llama',
      name: 'Llama 2',
      type: 'opensource',
      isEnabled: false,
      apiKey: '',
      endpoint: 'http://localhost:3001/v1',
    },
    {
      id: 'mistral',
      name: 'Mistral AI',
      type: 'opensource',
      isEnabled: false,
      apiKey: '',
      endpoint: '',
    },
  ]);

  const [showApiKey, setShowApiKey] = useState<string | null>(null);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  const handleModelToggle = (modelId: string) => {
    setModels(models.map(model => 
      model.id === modelId ? { ...model, isEnabled: !model.isEnabled } : model
    ));
  };

  const handleApiKeyChange = (modelId: string, value: string) => {
    setModels(models.map(model => 
      model.id === modelId ? { ...model, apiKey: value } : model
    ));
  };

  const handleEndpointChange = (modelId: string, value: string) => {
    setModels(models.map(model => 
      model.id === modelId ? { ...model, endpoint: value } : model
    ));
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Settings className="h-6 w-6" />
          AI Model Settings
        </h2>
        <p className="text-muted-foreground mt-2">
          Configure your AI models and API keys. Support for both commercial and open-source models.
        </p>
      </motion.div>

      <motion.div
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.1
            }
          }
        }}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        {models.map((model) => (
          <motion.div key={model.id} variants={cardVariants}>
            <Card className="bg-card border-border/50">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      {model.name}
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        model.type === 'opensource' 
                          ? 'bg-green-500/10 text-green-500' 
                          : 'bg-blue-500/10 text-blue-500'
                      }`}>
                        {model.type === 'opensource' ? 'Open Source' : 'Commercial'}
                      </span>
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {model.type === 'opensource' 
                        ? 'Self-hosted open-source model' 
                        : 'Commercial API service'}
                    </p>
                  </div>
                  <Switch
                    checked={model.isEnabled}
                    onCheckedChange={() => handleModelToggle(model.id)}
                  />
                </div>

                <AnimatePresence>
                  {model.isEnabled && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-4"
                    >
                      <div>
                        <label className="text-sm font-medium flex items-center gap-2">
                          <Key className="h-4 w-4" />
                          API Key
                        </label>
                        <div className="mt-1.5 relative">
                          <Input
                            type={showApiKey === model.id ? "text" : "password"}
                            value={model.apiKey}
                            onChange={(e) => handleApiKeyChange(model.id, e.target.value)}
                            placeholder={`Enter your ${model.name} API key`}
                            className="pr-10"
                          />
                          <button
                            onClick={() => setShowApiKey(showApiKey === model.id ? null : model.id)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground
                                     hover:text-foreground transition-colors"
                          >
                            <Lock className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      {model.type === 'opensource' && (
                        <div>
                          <label className="text-sm font-medium flex items-center gap-2">
                            <Server className="h-4 w-4" />
                            API Endpoint
                          </label>
                          <Input
                            type="text"
                            value={model.endpoint}
                            onChange={(e) => handleEndpointChange(model.id, e.target.value)}
                            placeholder="Enter the model endpoint URL"
                            className="mt-1.5"
                          />
                        </div>
                      )}

                      <div className="flex items-center gap-2 text-sm">
                        {model.apiKey ? (
                          <span className="text-green-500 flex items-center gap-1">
                            <Check className="h-4 w-4" />
                            API key configured
                          </span>
                        ) : (
                          <span className="text-yellow-500 flex items-center gap-1">
                            <AlertCircle className="h-4 w-4" />
                            API key required
                          </span>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
} 