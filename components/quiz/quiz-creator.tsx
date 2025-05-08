'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  Brain, 
  Check, 
  X, 
  ChevronRight, 
  Trophy,
  Sparkles,
  Edit,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  difficulty: 'easy' | 'medium' | 'hard';
  type: 'multiple-choice' | 'true-false' | 'open-ended';
  topic: string;
  aiGenerated?: boolean;
}

interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
  timeLimit?: number;
  difficulty: 'easy' | 'medium' | 'hard';
  topics: string[];
  created: Date;
}

export function QuizCreator() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [progress, setProgress] = useState(0);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    },
    exit: { opacity: 0, y: -20 }
  };

  const questionVariants = {
    hidden: { x: 50, opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20
      }
    },
    exit: { 
      x: -50, 
      opacity: 0,
      transition: {
        duration: 0.2
      }
    }
  };

  const generateQuizFromNotes = async (content: string) => {
    // Simulate AI processing
    const sampleQuiz: Quiz = {
      id: Date.now().toString(),
      title: "Understanding Key Concepts",
      description: "Test your knowledge of the main topics",
      questions: [
        {
          id: "1",
          question: "What is the primary concept discussed in the notes?",
          options: ["Option A", "Option B", "Option C", "Option D"],
          correctAnswer: "Option A",
          difficulty: "medium",
          type: "multiple-choice",
          topic: "Main Concepts",
          aiGenerated: true
        },
        // Add more sample questions
      ],
      difficulty: "medium",
      topics: ["Main Concepts", "Key Ideas"],
      created: new Date()
    };

    setQuizzes([...quizzes, sampleQuiz]);
  };

  const handleAnswer = (answer: string) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = answer;
    setUserAnswers(newAnswers);

    // Update progress
    const newProgress = ((currentQuestionIndex + 1) / (activeQuiz?.questions.length || 1)) * 100;
    setProgress(newProgress);

    // Move to next question or show results
    if (currentQuestionIndex < (activeQuiz?.questions.length || 0) - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      }, 500);
    } else {
      setTimeout(() => {
        setShowResults(true);
      }, 500);
    }
  };

  const calculateScore = () => {
    if (!activeQuiz) return 0;
    const correctAnswers = userAnswers.filter(
      (answer, index) => answer === activeQuiz.questions[index].correctAnswer
    );
    return (correctAnswers.length / activeQuiz.questions.length) * 100;
  };

  return (
    <div className="container mx-auto p-4">
      <AnimatePresence mode="wait">
        {!activeQuiz && !isCreating ? (
          <motion.div
            key="quiz-list"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-6"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Quizzes</h2>
              <Button onClick={() => setIsCreating(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Quiz
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {quizzes.map((quiz) => (
                <motion.div
                  key={quiz.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card 
                    className="cursor-pointer hover:border-primary/50 transition-colors"
                    onClick={() => setActiveQuiz(quiz)}
                  >
                    <CardContent className="p-4">
                      <h3 className="text-lg font-semibold mb-2">{quiz.title}</h3>
                      <p className="text-muted-foreground text-sm mb-4">{quiz.description}</p>
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center">
                          <BookOpen className="h-4 w-4 mr-1" />
                          {quiz.questions.length} questions
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs
                          ${quiz.difficulty === 'easy' ? 'bg-green-500/20 text-green-500' :
                            quiz.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-500' :
                            'bg-red-500/20 text-red-500'}`}
                        >
                          {quiz.difficulty}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : activeQuiz && !showResults ? (
          <motion.div
            key="quiz-active"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="max-w-2xl mx-auto"
          >
            {/* Progress bar */}
            <div className="mb-8">
              <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-primary"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <div className="mt-2 text-sm text-muted-foreground">
                Question {currentQuestionIndex + 1} of {activeQuiz.questions.length}
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestionIndex}
                variants={questionVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <Card className="mb-6">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-4">
                      {activeQuiz.questions[currentQuestionIndex].question}
                    </h3>
                    <div className="space-y-3">
                      {activeQuiz.questions[currentQuestionIndex].options.map((option) => (
                        <Button
                          key={option}
                          variant="outline"
                          className="w-full justify-start text-left"
                          onClick={() => handleAnswer(option)}
                        >
                          {option}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        ) : showResults ? (
          <motion.div
            key="quiz-results"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="max-w-2xl mx-auto text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              <Trophy className="h-16 w-16 mx-auto mb-6 text-primary" />
            </motion.div>

            <h2 className="text-2xl font-bold mb-4">Quiz Complete!</h2>
            <p className="text-xl mb-8">
              Your score: {calculateScore()}%
            </p>

            <Card className="mb-6">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  AI Recommendations
                </h3>
                <div className="space-y-4 text-left">
                  <p className="text-muted-foreground">
                    Based on your performance, consider reviewing:
                  </p>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Topic A - Review fundamentals</li>
                    <li>Topic B - Practice more examples</li>
                    <li>Topic C - Deep dive into advanced concepts</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-4 justify-center">
              <Button onClick={() => {
                setActiveQuiz(null);
                setShowResults(false);
                setCurrentQuestionIndex(0);
                setUserAnswers([]);
                setProgress(0);
              }}>
                Back to Quizzes
              </Button>
              <Button variant="outline" onClick={() => {
                setShowResults(false);
                setCurrentQuestionIndex(0);
                setUserAnswers([]);
                setProgress(0);
              }}>
                Retry Quiz
              </Button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
} 