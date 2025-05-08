'use client';

import { UserButton } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { Brain, FileText, BookOpen, Sparkles, Link2, Layout } from 'lucide-react';

interface UserData {
  id: string;
  firstName: string | null;
  lastName: string | null;
  emailAddress: string | undefined;
  imageUrl: string;
}

interface DashboardContentProps {
  userData: UserData | null;
}

export function DashboardContent({ userData }: DashboardContentProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  const quickActions = [
    {
      icon: <FileText className="h-6 w-6" />,
      title: "Create Note",
      description: "Start writing a new note with AI assistance"
    },
    {
      icon: <BookOpen className="h-6 w-6" />,
      title: "Flashcards",
      description: "Review your generated flashcards"
    },
    {
      icon: <Brain className="h-6 w-6" />,
      title: "Generate Quiz",
      description: "Create a quiz from your notes"
    },
    {
      icon: <Link2 className="h-6 w-6" />,
      title: "View Graph",
      description: "Explore your knowledge connections"
    }
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <motion.div 
          variants={itemVariants}
          className="flex justify-between items-center mb-12"
        >
          <div>
            <h1 className="text-4xl font-bold text-foreground">
              Welcome back, {" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/50">
                {userData?.firstName || 'User'}
              </span>
            </h1>
            <p className="text-muted-foreground mt-2">Your personal knowledge workspace awaits</p>
          </div>
          <UserButton afterSignOutUrl="/" />
        </motion.div>

        {/* Quick Actions Grid */}
        <motion.div 
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {quickActions.map((action, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="p-6 rounded-xl bg-secondary/30 backdrop-blur-sm border border-secondary hover:bg-secondary/40 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  {action.icon}
                </div>
                <h3 className="font-semibold text-lg">{action.title}</h3>
              </div>
              <p className="text-muted-foreground">{action.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Recent Activity Section */}
        <motion.div
          variants={itemVariants}
          className="rounded-xl bg-secondary/30 backdrop-blur-sm border border-secondary p-6"
        >
          <h2 className="text-2xl font-semibold mb-4">Recent Activity</h2>
          <div className="text-muted-foreground">
            Your recent notes and activities will appear here
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
