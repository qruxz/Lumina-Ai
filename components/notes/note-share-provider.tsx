'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface SharedUser {
  email: string;
  permission: 'view' | 'comment' | 'edit';
}

interface NoteShareState {
  visibility: 'private' | 'shared' | 'public';
  sharedUsers: SharedUser[];
  allowComments: boolean;
  showAuthor: boolean;
}

interface NoteShareContextType {
  shareState: { [noteId: string]: NoteShareState };
  updateNoteShare: (noteId: string, updates: Partial<NoteShareState>) => void;
  addSharedUser: (noteId: string, user: SharedUser) => void;
  removeSharedUser: (noteId: string, email: string) => void;
  getNoteShareState: (noteId: string) => NoteShareState;
}

const defaultShareState: NoteShareState = {
  visibility: 'private',
  sharedUsers: [],
  allowComments: false,
  showAuthor: true,
};

const NoteShareContext = createContext<NoteShareContextType | undefined>(undefined);

export function NoteShareProvider({ children }: { children: ReactNode }) {
  const [shareState, setShareState] = useState<{ [noteId: string]: NoteShareState }>({});

  // Load share states from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('lumina-note-share-state');
    if (savedState) {
      try {
        setShareState(JSON.parse(savedState));
      } catch (error) {
        console.error('Failed to load share states:', error);
      }
    }
  }, []);

  // Save share states to localStorage when updated
  useEffect(() => {
    localStorage.setItem('lumina-note-share-state', JSON.stringify(shareState));
  }, [shareState]);

  const updateNoteShare = (noteId: string, updates: Partial<NoteShareState>) => {
    setShareState(prev => ({
      ...prev,
      [noteId]: {
        ...(prev[noteId] || defaultShareState),
        ...updates,
      },
    }));
  };

  const addSharedUser = (noteId: string, user: SharedUser) => {
    setShareState(prev => {
      const currentState = prev[noteId] || defaultShareState;
      const existingUsers = currentState.sharedUsers.filter(u => u.email !== user.email);
      
      return {
        ...prev,
        [noteId]: {
          ...currentState,
          sharedUsers: [...existingUsers, user],
        },
      };
    });
  };

  const removeSharedUser = (noteId: string, email: string) => {
    setShareState(prev => {
      const currentState = prev[noteId] || defaultShareState;
      return {
        ...prev,
        [noteId]: {
          ...currentState,
          sharedUsers: currentState.sharedUsers.filter(u => u.email !== email),
        },
      };
    });
  };

  const getNoteShareState = (noteId: string): NoteShareState => {
    return shareState[noteId] || defaultShareState;
  };

  return (
    <NoteShareContext.Provider
      value={{
        shareState,
        updateNoteShare,
        addSharedUser,
        removeSharedUser,
        getNoteShareState,
      }}
    >
      {children}
    </NoteShareContext.Provider>
  );
}

export function useNoteShare() {
  const context = useContext(NoteShareContext);
  if (context === undefined) {
    throw new Error('useNoteShare must be used within a NoteShareProvider');
  }
  return context;
}
