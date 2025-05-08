'use client';

import { useState, useEffect } from 'react';
import Link from "next/link";
import { Plus, List, Grid2X2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NoteCard } from "./note-card";
import { notesService } from "@/lib/services/notes";
import { useAuth } from "@clerk/nextjs";
import { toast } from "sonner";
import type { Note } from "@/types/note";

interface NotesClientProps {
  initialNotes: Note[];
}

export function NotesClient({ initialNotes }: NotesClientProps) {
  const { userId } = useAuth();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshNotes = async () => {
    if (!userId) return;
    
    try {
      setIsLoading(true);
      setError(null);
      const updatedNotes = await notesService.getAllByUser(userId);
      setNotes(updatedNotes);
    } catch (error) {
      console.error('Failed to refresh notes:', error);
      setError('Failed to load notes');
      toast.error('Failed to load notes');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (noteId: string) => {
    const updatedNotes = notes.filter(note => note.id !== noteId);
    setNotes(updatedNotes);
  };

  useEffect(() => {
    refreshNotes();
  }, [userId]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h3 className="text-xl font-semibold mb-2">Failed to load notes</h3>
        <p className="text-zinc-400 mb-4">{error}</p>
        <Button 
          onClick={() => window.location.reload()}
          className="bg-zinc-800 hover:bg-zinc-700 text-white border-none"
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-6xl mx-auto p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Notes</h1>
            <p className="text-zinc-400 mt-1">Manage your notes and ideas</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-zinc-900/50 rounded-lg p-1">
              <Button
                variant="ghost"
                size="icon"
                className={`text-zinc-400 hover:text-white ${viewMode === 'grid' ? 'bg-zinc-800' : ''}`}
                onClick={() => setViewMode('grid')}
              >
                <Grid2X2 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={`text-zinc-400 hover:text-white ${viewMode === 'list' ? 'bg-zinc-800' : ''}`}
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
            <Link href="/dashboard/notes/new">
              <Button className="bg-zinc-800 hover:bg-zinc-700 text-white border-none">
                <Plus className="w-4 h-4 mr-2" />
                New Note
              </Button>
            </Link>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-[60vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-white mx-auto mb-4"></div>
              <p className="text-zinc-400">Loading notes...</p>
            </div>
          </div>
        ) : notes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center">
            <div className="text-5xl mb-4">📝</div>
            <h3 className="text-xl font-semibold mb-2">No notes yet</h3>
            <p className="text-zinc-400 mb-4">Create your first note to get started</p>
            <Link href="/dashboard/notes/new">
              <Button className="bg-zinc-800 hover:bg-zinc-700 text-white border-none">
                <Plus className="w-4 h-4 mr-2" />
                Create Note
              </Button>
            </Link>
          </div>
        ) : (
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
              : 'grid-cols-1'
          }`}>
            {notes.map((note) => (
              <NoteCard 
                key={note.id} 
                note={note} 
                onDelete={() => handleDelete(note.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 