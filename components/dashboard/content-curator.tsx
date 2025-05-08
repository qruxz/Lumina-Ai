'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, FileText, Link, BookOpen, X, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface ContentItem {
  id: string;
  title: string;
  type: 'article' | 'document' | 'url';
  summary: string;
  themes: string[];
  keywords: string[];
  dateAdded: Date;
}

export function ContentCurator() {
  const [items, setItems] = useState<ContentItem[]>([
    {
      id: '1',
      title: 'Understanding AI in Modern Applications',
      type: 'article',
      summary: 'An in-depth look at how artificial intelligence is shaping modern software development...',
      themes: ['AI/ML', 'Software Development', 'Technology Trends'],
      keywords: ['artificial intelligence', 'machine learning', 'software'],
      dateAdded: new Date(),
    },
    // Add more sample items as needed
  ]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

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
    },
    hover: {
      scale: 1.02,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    },
    expanded: {
      scale: 1,
      zIndex: 50,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25
      }
    }
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  return (
    <div className="relative">
      <div className="mb-6 flex items-center justify-between">
        <motion.h2 
          className="text-2xl font-bold"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Content Library
        </motion.h2>
        <motion.div 
          className="flex gap-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Content
          </Button>
          <Button variant="outline" size="sm">
            <Sparkles className="h-4 w-4 mr-2" />
            AI Analyze
          </Button>
        </motion.div>
      </div>

      <motion.div 
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.1
            }
          }
        }}
      >
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            variants={cardVariants}
            initial="hidden"
            animate={expandedId === item.id ? "expanded" : "visible"}
            whileHover={expandedId === null ? "hover" : undefined}
            onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
            className="cursor-pointer"
          >
            <Card className="bg-card border-border/50 h-full hover:border-primary/50 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                  {item.type === 'article' && <FileText className="h-4 w-4 text-muted-foreground" />}
                  {item.type === 'url' && <Link className="h-4 w-4 text-muted-foreground" />}
                  {item.type === 'document' && <BookOpen className="h-4 w-4 text-muted-foreground" />}
                </div>
                
                <AnimatePresence>
                  {expandedId === item.id ? (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <p className="text-muted-foreground mb-4">{item.summary}</p>
                      <div className="space-y-2">
                        <div>
                          <h4 className="text-sm font-semibold mb-1">Main Themes</h4>
                          <div className="flex flex-wrap gap-2">
                            {item.themes.map(theme => (
                              <span key={theme} className="px-2 py-1 text-xs rounded-full bg-secondary text-secondary-foreground">
                                {theme}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold mb-1">Keywords</h4>
                          <div className="flex flex-wrap gap-2">
                            {item.keywords.map(keyword => (
                              <span key={keyword} className="px-2 py-1 text-xs rounded-full bg-muted text-muted-foreground">
                                {keyword}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <p className="text-muted-foreground line-clamp-2">{item.summary}</p>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <AnimatePresence>
        {expandedId && (
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
            onClick={() => setExpandedId(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
} 