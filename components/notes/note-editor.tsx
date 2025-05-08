'use client';

import { useState, useEffect, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { FileText, Link as LinkIcon, X, Loader2, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { NoteShare } from './note-share';
import { notesService } from '@/lib/services/notes';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(Draggable);
}

interface Suggestion {
  id: string;
  title: string;
  type: 'note' | 'document' | 'topic';
  relevance: number;
}

interface Note {
  id?: string;
  title?: string;
  content?: string;
  userId?: string;
}

export function NoteEditor({ note = {} }: { note?: Note }) {
  const router = useRouter();
  const { userId } = useAuth();
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [title, setTitle] = useState(note?.title || '');
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const noteCardsRef = useRef<HTMLDivElement>(null);
  const initialContent = note?.content || '<p>Start writing your note here...</p>';

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
    ],
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none focus:outline-none min-h-[300px] p-4 bg-transparent',
      },
    },
    content: initialContent,
    onUpdate: ({ editor }) => {
      setHasChanges(true);
    },
  });

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasChanges]);

  useEffect(() => {
    if (noteCardsRef.current) {
      Draggable.create(noteCardsRef.current, {
        type: 'x,y',
        bounds: 'body',
        onDragStart: () => setIsDragging(true),
        onDragEnd: () => setIsDragging(false),
      });
    }
  }, []);

  if (!editor) {
    return null;
  }

  const handleSave = async () => {
    if (!userId) {
      toast.error('You must be signed in to save notes');
      return;
    }

    if (!title.trim()) {
      toast.error('Please enter a title for your note');
      return;
    }
    
    try {
      setIsSaving(true);
      if (note?.id) {
        // Update existing note
        await notesService.update(note.id, userId, {
          title: title.trim(),
          content: editor.getHTML(),
        });
        toast.success('Note updated successfully');
      } else {
        // Create new note
        await notesService.create({
          userId,
          title: title.trim(),
          content: editor.getHTML(),
        });
        toast.success('Note created successfully');
      }
      setHasChanges(false);
      router.refresh();
    } catch (error) {
      console.error('Failed to save note:', error);
      toast.error(
        note?.id 
          ? 'Failed to update note. Please try again.' 
          : 'Failed to create note. Please try again.'
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="relative space-y-4">
      <Card className="bg-card border-border/50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setHasChanges(true);
              }}
              placeholder="Note Title"
              className="text-2xl font-bold bg-transparent border-none outline-none w-full"
            />
            <div className="flex items-center gap-2">
              {note?.id && <NoteShare noteId={note.id} noteTitle={title} />}
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  editor.commands.clearContent();
                  setHasChanges(true);
                }}
              >
                <X className="h-4 w-4 mr-2" />
                Clear
              </Button>
              <Button 
                variant={hasChanges ? "default" : "outline"}
                size="sm"
                onClick={handleSave}
                disabled={isSaving || !hasChanges}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </>
                )}
              </Button>
            </div>
          </div>
          <div className={cn(
            "prose-container rounded-lg transition-colors",
            hasChanges && "ring-2 ring-primary/20"
          )}>
            <EditorContent editor={editor} />
          </div>
        </CardContent>
      </Card>

      <AnimatePresence>
        {suggestions.length > 0 && !isDragging && (
          <motion.div
            ref={noteCardsRef}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute top-4 right-[-320px] w-[300px] cursor-move"
          >
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold">Related Notes</h3>
                  <Button variant="ghost" size="sm" onClick={() => setSuggestions([])}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  {suggestions.map((suggestion) => (
                    <div
                      key={suggestion.id}
                      className="flex items-start gap-2 p-2 rounded-lg hover:bg-accent/50 transition-colors"
                    >
                      <div className="mt-0.5">
                        {suggestion.type === 'note' && <FileText className="h-4 w-4" />}
                        {suggestion.type === 'document' && <FileText className="h-4 w-4" />}
                        {suggestion.type === 'topic' && <LinkIcon className="h-4 w-4" />}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{suggestion.title}</p>
                        <p className="text-xs text-muted-foreground">
                          Relevance: {Math.round(suggestion.relevance * 100)}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {hasChanges && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-4 right-4 bg-primary text-primary-foreground px-4 py-2 rounded-lg shadow-lg"
        >
          <p className="text-sm">You have unsaved changes</p>
        </motion.div>
      )}
    </div>
  );
}