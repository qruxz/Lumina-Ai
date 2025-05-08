'use client';

import { User } from "@clerk/nextjs/server";
import { motion } from "framer-motion";
import { 
  BookOpen, 
  Brain,
  Sparkles,
  FileText,
  TrendingUp,
  Clock,
  Layout,
  Plus,
  Search
} from 'lucide-react';
import { Button } from "@/components/ui/button";

interface DashboardContentProps {
  user: User | null;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: { 
    scale: 1, 
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
};

export function DashboardContent({ user }: DashboardContentProps) {
  const quickActions = [
    {
      icon: <FileText className="h-6 w-6" />,
      title: "Create Note",
      description: "Start a new note with AI assistance"
    },
    {
      icon: <BookOpen className="h-6 w-6" />,
      title: "Study Materials",
      description: "Access your learning resources"
    },
    {
      icon: <Brain className="h-6 w-6" />,
      title: "AI Insights",
      description: "Get AI-powered learning suggestions"
    },
    {
      icon: <Sparkles className="h-6 w-6" />,
      title: "Quick Review",
      description: "Review today's key concepts"
    }
  ];

  const recentActivity = [
    { title: 'Machine Learning Notes', type: 'Note', time: '2 hours ago' },
    { title: 'Physics Concepts', type: 'Study Set', time: '5 hours ago' },
    { title: 'Project Planning', type: 'Document', time: 'Yesterday' },
    { title: 'Research Summary', type: 'AI Analysis', time: 'Yesterday' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background p-8">
      <motion.div 
        className="max-w-7xl mx-auto w-full"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header Section */}
        <motion.div
          className="text-center mb-12"
          variants={itemVariants}
        >
          <div className="inline-block mb-8">
            <div className="px-4 py-2 rounded-full bg-secondary/30 backdrop-blur-sm border border-secondary">
              <span className="text-sm font-medium flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                Welcome to your workspace
              </span>
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Hello,{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/50">
              {user?.firstName || 'User'}
            </span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Your personal knowledge hub for smarter learning and organization
          </p>
        </motion.div>

        {/* Quick Actions Grid */}
        <motion.div 
          className="grid md:grid-cols-2 gap-6 mb-12"
          variants={containerVariants}
        >
          {quickActions.map((action, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              className="p-6 rounded-2xl bg-secondary/20 backdrop-blur-sm border border-secondary/30
                         hover:bg-secondary/30 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-4 mb-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  {action.icon}
                </div>
                <h3 className="text-xl font-semibold">{action.title}</h3>
              </div>
              <p className="text-muted-foreground">{action.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Recent Activity Section */}
        <motion.div
          variants={itemVariants}
          className="rounded-2xl bg-secondary/20 backdrop-blur-sm border border-secondary/30 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">Recent Activity</h2>
            <Button variant="outline" size="sm" className="gap-2">
              <Search className="h-4 w-4" />
              Search Activity
            </Button>
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="flex items-center justify-between p-4 rounded-xl hover:bg-secondary/30 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium">{activity.title}</h3>
                    <p className="text-sm text-muted-foreground">{activity.type}</p>
                  </div>
                </div>
                <span className="text-sm text-muted-foreground">{activity.time}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Create New Button */}
        <motion.div
          variants={itemVariants}
          className="fixed bottom-8 right-8"
        >
          <Button className="rounded-full w-14 h-14 shadow-lg" size="icon">
            <Plus className="h-6 w-6" />
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
