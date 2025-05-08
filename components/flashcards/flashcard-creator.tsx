'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { 
  BookOpen, 
  Plus, 
  X, 
  Tag, 
  Check, 
  ChevronLeft, 
  ChevronRight,
  Brain,
  Edit,
  Save
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface Flashcard {
  id: string;
  question: string;
  answer: string;
  tags: string[];
  mastered: boolean;
  lastReviewed?: Date;
}

interface FlashcardSet {
  id: string;
  title: string;
  cards: Flashcard[];
  createdAt: Date;
  tags: string[];
}

export function FlashcardCreator() {
  const [sets, setSets] = useState<FlashcardSet[]>([]);
  const [activeSet, setActiveSet] = useState<FlashcardSet | null>(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize GSAP flip animation
    if (!cardRef.current) return;

    gsap.set(cardRef.current, {
      transformPerspective: 1000,
    });
  }, []);

  const handleFlip = () => {
    if (!cardRef.current) return;

    setIsFlipped(!isFlipped);
    gsap.to(cardRef.current, {
      duration: 0.6,
      rotationY: isFlipped ? 0 : 180,
      ease: 'power2.inOut',
    });
  };

  const generateFlashcardsFromText = async (text: string) => {
    // Simulate AI processing
    const sampleCards: Flashcard[] = [
      {
        id: '1',
        question: 'What is the main concept discussed in the text?',
        answer: 'The text discusses key aspects of the topic...',
        tags: ['concept', 'overview'],
        mastered: false,
      },
      // Add more sample cards
    ];

    const newSet: FlashcardSet = {
      id: Date.now().toString(),
      title: 'New Flashcard Set',
      cards: sampleCards,
      createdAt: new Date(),
      tags: ['AI-generated'],
    };

    setSets([...sets, newSet]);
    setActiveSet(newSet);
  };

  const nextCard = () => {
    if (!activeSet) return;
    if (isFlipped) handleFlip();
    gsap.to(cardRef.current, {
      duration: 0.3,
      x: -50,
      opacity: 0,
      ease: 'power2.in',
      onComplete: () => {
        setCurrentCardIndex((prev) => 
          prev === activeSet.cards.length - 1 ? 0 : prev + 1
        );
        gsap.fromTo(cardRef.current,
          { x: 50, opacity: 0 },
          { duration: 0.3, x: 0, opacity: 1, ease: 'power2.out' }
        );
      }
    });
  };

  const prevCard = () => {
    if (!activeSet) return;
    if (isFlipped) handleFlip();
    gsap.to(cardRef.current, {
      duration: 0.3,
      x: 50,
      opacity: 0,
      ease: 'power2.in',
      onComplete: () => {
        setCurrentCardIndex((prev) => 
          prev === 0 ? activeSet.cards.length - 1 : prev - 1
        );
        gsap.fromTo(cardRef.current,
          { x: -50, opacity: 0 },
          { duration: 0.3, x: 0, opacity: 1, ease: 'power2.out' }
        );
      }
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Flashcards</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => generateFlashcardsFromText("")}>
            <Brain className="h-4 w-4 mr-2" />
            Generate from Notes
          </Button>
          <Button variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            New Set
          </Button>
        </div>
      </div>

      {activeSet ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h3 className="text-xl font-semibold">{activeSet.title}</h3>
              <div className="flex gap-2">
                {activeSet.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 text-xs rounded-full bg-secondary text-secondary-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setActiveSet(null)}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="relative h-[400px] flex items-center justify-center">
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-0 z-10"
              onClick={prevCard}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>

            <div
              ref={cardRef}
              className="w-full max-w-2xl aspect-video cursor-pointer"
              onClick={handleFlip}
            >
              <Card className="h-full bg-card border-border/50 relative">
                <CardContent className="absolute inset-0 flex flex-col items-center justify-center p-6 backface-hidden">
                  {!isFlipped ? (
                    <div className="text-center">
                      <h4 className="text-xl font-semibold mb-4">
                        {activeSet.cards[currentCardIndex].question}
                      </h4>
                      <p className="text-muted-foreground">Click to reveal answer</p>
                    </div>
                  ) : (
                    <div className="text-center [transform:rotateY(180deg)]">
                      <p className="text-lg">
                        {activeSet.cards[currentCardIndex].answer}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 z-10"
              onClick={nextCard}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Card {currentCardIndex + 1} of {activeSet.cards.length}
              </span>
              <div className="h-2 w-32 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{
                    width: `${((currentCardIndex + 1) / activeSet.cards.length) * 100}%`,
                  }}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button variant="outline" size="sm">
                <Save className="h-4 w-4 mr-2" />
                Save Progress
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sets.map((set) => (
            <Card
              key={set.id}
              className="bg-card border-border/50 cursor-pointer hover:border-primary/50 transition-colors"
              onClick={() => setActiveSet(set)}
            >
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold mb-2">{set.title}</h3>
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                  <span>{set.cards.length} cards</span>
                  <span>{new Date(set.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {set.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 text-xs rounded-full bg-secondary text-secondary-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 