'use client';

import { motion } from "framer-motion";
import { RocketIcon } from "lucide-react";

interface ComingSoonProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

export function ComingSoon({ title, description, icon }: ComingSoonProps) {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-6xl mx-auto p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          <p className="text-zinc-400 mt-1">{description}</p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center h-[60vh] text-center"
        >
          <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mb-6">
            {icon || <RocketIcon className="w-8 h-8 text-white" />}
          </div>
          <h2 className="text-2xl font-bold mb-3">Coming Soon</h2>
          <p className="text-zinc-400 max-w-md">
            We're working hard to bring you this feature. Stay tuned for updates!
          </p>
        </motion.div>
      </div>
    </div>
  );
} 