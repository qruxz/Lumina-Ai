'use client';

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Clock, Pencil, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { notesService } from "@/lib/services/notes";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { Note } from "@/types/note";
import { motion } from 'framer-motion';
import { FileText, Trash2, Share2, Edit } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { NoteShare } from './note-share';

interface NoteCardProps {
  note: Note;
  onDelete?: () => void;
}

export function NoteCard({ note, onDelete }: NoteCardProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!confirm("Are you sure you want to delete this note?")) return;

    try {
      setIsDeleting(true);
      await notesService.delete(note.id, note.userId);
      toast.success("Note deleted successfully");
      onDelete?.();
      router.refresh();
    } catch (error) {
      console.error("Failed to delete note:", error);
      toast.error("Failed to delete note");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="group"
    >
      <Card className="h-full bg-card border-border/50 hover:border-border transition-colors">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              <h3 className="font-semibold text-lg">{note.title}</h3>
            </div>
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsShareModalOpen(true)}
                className="h-8 w-8"
              >
                <Share2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.preventDefault();
                  router.push(`/dashboard/notes/${note.id}/edit`);
                }}
                className="h-8 w-8"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDelete}
                disabled={isDeleting}
                className="h-8 w-8 text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div
            className="mt-2 text-sm text-muted-foreground line-clamp-3"
            dangerouslySetInnerHTML={{
              __html: note.content || '',
            }}
          />
        </CardContent>
        <CardFooter className="p-6 pt-0">
          <div className="flex items-center text-xs text-muted-foreground">
            <span>
              {new Date(note.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          </div>
        </CardFooter>
      </Card>
      <NoteShare
        noteId={note.id}
        noteTitle={note.title}
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />
    </motion.div>
  );
} 