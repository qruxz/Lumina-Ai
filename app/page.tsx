'use client';

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Brain, FileText, BookOpen, Sparkles, Link2, Layout } from 'lucide-react';

export default function Home() {
  const router = useRouter();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const bubbleVariants = {
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

  const features = [
    {
      icon: <FileText className="h-6 w-6" />,
      title: "Smart Notes",
      description: "AI-powered note-taking with real-time suggestions and connections"
    },
    {
      icon: <BookOpen className="h-6 w-6" />,
      title: "Interactive Flashcards",
      description: "Convert notes to flashcards with one click and master your content"
    },
    {
      icon: <Brain className="h-6 w-6" />,
      title: "Custom Quizzes",
      description: "AI-generated quizzes based on your study material"
    },
    {
      icon: <Link2 className="h-6 w-6" />,
      title: "Knowledge Graph",
      description: "Visualize connections between your notes and documents"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <motion.div 
        className="text-center max-w-4xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Development Badge */}
        <motion.div
          className="inline-block mb-8"
          variants={bubbleVariants}
        >
          <div className="px-4 py-2 rounded-full bg-secondary/30 backdrop-blur-sm border border-secondary">
            <span className="text-sm font-medium flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/50">
                Beta Access Now Available
              </span>
              <span className="px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary">
                v0.1.0
              </span>
            </span>
          </div>
        </motion.div>

        <motion.h1 
          className="text-4xl md:text-6xl font-bold mb-6 text-foreground"
          variants={bubbleVariants}
        >
          Welcome to{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/50">
            Lumina
          </span>
        </motion.h1>
        
        <motion.p 
          className="text-lg md:text-xl text-muted-foreground mb-12"
          variants={bubbleVariants}
        >
          Your AI-powered knowledge companion for smarter learning and organization
        </motion.p>

        {/* Feature Grid */}
        <motion.div 
          className="grid md:grid-cols-2 gap-6 mb-12"
          variants={containerVariants}
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              variants={bubbleVariants}
              whileHover={{ scale: 1.05 }}
              className="p-6 rounded-2xl bg-secondary/20 backdrop-blur-sm border border-secondary/30
                         hover:bg-secondary/30 transition-colors"
            >
              <div className="flex items-center gap-4 mb-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold">{feature.title}</h3>
              </div>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          variants={bubbleVariants}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <motion.button
            onClick={() => router.push('/dashboard')}
            className="group px-8 py-3 bg-primary text-primary-foreground rounded-lg
                     font-semibold transition-all duration-200
                     hover:bg-primary/90 hover:shadow-[0_0_15px_rgba(255,255,255,0.3)]
                     focus:outline-none focus:ring-2
                     focus:ring-primary focus:ring-offset-2
                     focus:ring-offset-background"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="flex items-center gap-2">
              <Layout className="h-4 w-4" />
              Enter Dashboard
              <motion.span
                className="inline-block"
                initial={{ x: 0 }}
                animate={{ x: 3 }}
                transition={{ 
                  repeat: Infinity, 
                  repeatType: "reverse", 
                  duration: 0.6 
                }}
              >
                →
              </motion.span>
            </span>
          </motion.button>
          
          <motion.button
            onClick={() => router.push('/about')}
            className="px-8 py-3 bg-secondary text-secondary-foreground rounded-lg
                     font-semibold transition-all duration-200
                     hover:bg-secondary/90
                     focus:outline-none focus:ring-2
                     focus:ring-secondary focus:ring-offset-2
                     focus:ring-offset-background
                     flex items-center justify-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Sparkles className="h-4 w-4" />
            Learn More
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}
