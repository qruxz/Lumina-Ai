'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, BookOpen, FileText, Brain, Menu, ArrowLeft, Settings, LinkIcon, UserCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { NoteEditor } from '@/components/notes/note-editor';
import { APISettings } from '@/components/settings/api-settings';
import { KnowledgeGraph } from '@/components/knowledge-graph/graph-view';
import { FlashcardCreator } from '@/components/flashcards/flashcard-creator';
import { QuizCreator } from '@/components/quiz/quiz-creator';
import { UserButton, useUser } from "@clerk/nextjs";
import { NoteShareProvider } from '@/components/notes/note-share-provider';

export default function DashboardComponent() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('notes');
  const router = useRouter();
  const { user } = useUser();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const sidebarVariants = {
    open: { x: 0, opacity: 1 },
    closed: { x: '-100%', opacity: 0 },
  };

  const contentVariants = {
    open: { marginLeft: '240px' },
    closed: { marginLeft: '0' },
  };

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
    }
  };

  return (
    <NoteShareProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Top Navigation */}
        <nav className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="icon" onClick={toggleSidebar}>
                  <Menu className="h-5 w-5" />
                </Button>
                <h1 className="text-xl font-semibold">Lumina</h1>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-600">
                  Welcome, {user?.firstName || 'User'}
                </div>
                <UserButton afterSignOutUrl="/" />
              </div>
            </div>
          </div>
        </nav>

        {/* Sidebar */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={sidebarVariants}
              className="fixed left-0 top-0 h-full w-60 bg-white shadow-lg z-50"
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold">Menu</h2>
                  <Button variant="ghost" size="icon" onClick={toggleSidebar}>
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <Button
                    variant={activeTab === 'notes' ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => setActiveTab('notes')}
                  >
                    <BookOpen className="mr-2 h-4 w-4" />
                    Notes
                  </Button>
                  <Button
                    variant={activeTab === 'documents' ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => setActiveTab('documents')}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Documents
                  </Button>
                  <Button
                    variant={activeTab === 'ai-insights' ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => setActiveTab('ai-insights')}
                  >
                    <Brain className="mr-2 h-4 w-4" />
                    AI Insights
                  </Button>
                  <Button
                    variant={activeTab === 'settings' ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => setActiveTab('settings')}
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Button>
                  <Button
                    variant={activeTab === 'flashcards' ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => setActiveTab('flashcards')}
                  >
                    <BookOpen className="mr-2 h-4 w-4" />
                    Flashcards
                  </Button>
                  <Button
                    variant={activeTab === 'quizzes' ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => setActiveTab('quizzes')}
                  >
                    <Brain className="mr-2 h-4 w-4" />
                    Quizzes
                  </Button>
                  <Button
                    variant={activeTab === 'graph' ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => setActiveTab('graph')}
                  >
                    <LinkIcon className="mr-2 h-4 w-4" />
                    Knowledge Graph
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <motion.main
          variants={contentVariants}
          animate={isSidebarOpen ? 'open' : 'closed'}
          className="transition-all duration-300 ease-in-out"
        >
          <div className="container mx-auto px-4 py-8">
            {activeTab === 'notes' && <NotesTab cardVariants={cardVariants} />}
            {activeTab === 'documents' && <DocumentsTab cardVariants={cardVariants} />}
            {activeTab === 'ai-insights' && <AIInsightsTab cardVariants={cardVariants} />}
            {activeTab === 'settings' && <APISettings />}
            {activeTab === 'flashcards' && <FlashcardCreator />}
            {activeTab === 'quizzes' && <QuizCreator />}
            {activeTab === 'graph' && <KnowledgeGraph />}
          </div>
        </motion.main>
      </div>
    </NoteShareProvider>
  );
}

interface TabProps {
  cardVariants: {
    hidden: { opacity: number; y: number };
    visible: { opacity: number; y: number };
  };
}

function NotesTab({ cardVariants }: TabProps) {
  return (
    <>
      {['Research Notes', 'Project Ideas', 'Literature Review'].map((title, index) => (
        <motion.div
          key={title}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          whileHover="hover"
          transition={{ delay: index * 0.1 }}
        >
          <Card className="bg-card border-border/50 h-full hover:border-primary/50 transition-colors">
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold mb-2">{title}</h3>
              <p className="text-muted-foreground">Latest updates and insights...</p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </>
  );
}

function DocumentsTab({ cardVariants }: TabProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {['Thesis Draft', 'Conference Paper', 'Research Proposal'].map((title, index) => (
        <motion.div
          key={title}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          whileHover="hover"
          transition={{ delay: index * 0.1 }}
          className="h-full"
        >
          <Card className="bg-card border-border/50 h-full hover:border-primary/50 transition-colors">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-3">{title}</h3>
              <p className="text-muted-foreground">Last edited: Recently</p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}

function AIInsightsTab({ cardVariants }: TabProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {['Content Connections', 'Summary Suggestions', 'Research Trends'].map((title, index) => (
        <motion.div
          key={title}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          whileHover="hover"
          transition={{ delay: index * 0.1 }}
          className="h-full"
        >
          <Card className="bg-card border-border/50 h-full hover:border-primary/50 transition-colors">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-3">{title}</h3>
              <p className="text-muted-foreground">AI-powered insights and analysis...</p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}

function SettingsTab({ cardVariants }: TabProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {['Profile Settings', 'Notification Settings', 'Privacy Settings'].map((title, index) => (
        <motion.div
          key={title}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          whileHover="hover"
          transition={{ delay: index * 0.1 }}
        >
          <Card className="bg-card border-border/50 h-full hover:border-primary/50 transition-colors">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-3">{title}</h3>
              <p className="text-muted-foreground">Settings related to {title.toLowerCase()}...</p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}