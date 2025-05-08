'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserButton } from "@clerk/nextjs";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from "@/components/ui/button";
import { 
  Home, 
  BookOpen, 
  Brain,
  Settings, 
  Menu as MenuIcon,
  X as CloseIcon,
  Sparkles,
  FileText,
  PenTool,
  Network
} from 'lucide-react';

interface SidebarItem {
  icon: React.ElementType;
  label: string;
  href: string;
}

const sidebarItems: SidebarItem[] = [
  { icon: Home, label: 'Overview', href: '/dashboard' },
  { icon: PenTool, label: 'Notes', href: '/dashboard/notes' },
  { icon: BookOpen, label: 'Study Sets', href: '/dashboard/study' },
  { icon: Network, label: 'Knowledge Map', href: '/dashboard/knowledge' },
  { icon: Sparkles, label: 'AI Assistant', href: '/dashboard/ai' },
  { icon: FileText, label: 'Documents', href: '/dashboard/documents' },
  { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
];

export function DashboardSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <motion.div
      initial={false}
      animate={{ width: isCollapsed ? 80 : 280 }}
      className="relative h-full border-r border-secondary/30 bg-background flex flex-col"
    >
      <div className="p-6 flex items-center justify-between">
        <AnimatePresence initial={false}>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="font-bold text-2xl"
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/50">
                Lumina
              </span>
            </motion.div>
          )}
        </AnimatePresence>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="rounded-xl hover:bg-secondary/20"
        >
          {isCollapsed ? (
            <MenuIcon className="h-5 w-5" />
          ) : (
            <CloseIcon className="h-5 w-5" />
          )}
        </Button>
      </div>

      <div className="flex-1 px-3">
        <div className="space-y-1">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-x-3 px-3 py-2 rounded-xl transition-all duration-200",
                  "hover:bg-secondary/20 hover:shadow-sm",
                  isActive && "bg-secondary/30 shadow-sm",
                  !isCollapsed && "mx-2"
                )}
              >
                <div className={cn(
                  "p-2 rounded-lg transition-colors",
                  isActive ? "bg-primary/10" : "bg-transparent"
                )}>
                  <Icon className={cn(
                    "h-5 w-5",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )} />
                </div>
                <AnimatePresence initial={false}>
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      className={cn(
                        "flex-1 font-medium",
                        isActive ? "text-foreground" : "text-muted-foreground"
                      )}
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            );
          })}
        </div>
      </div>

      <div className={cn(
        "p-6 border-t border-secondary/30",
        !isCollapsed && "mx-4"
      )}>
        <UserButton
          afterSignOutUrl="/"
          appearance={{
            elements: {
              avatarBox: "w-10 h-10"
            }
          }}
        />
      </div>
    </motion.div>
  );
}
