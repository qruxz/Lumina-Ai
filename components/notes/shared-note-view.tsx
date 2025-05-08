'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNoteShare } from './note-share-provider';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MessageSquare, ThumbsUp, Share2 } from 'lucide-react';

interface SharedNoteViewProps {
  noteId: string;
  noteTitle: string;
  noteContent: string;
  authorName: string;
  authorImage?: string;
  createdAt: Date;
}

interface Comment {
  id: string;
  authorName: string;
  authorImage?: string;
  content: string;
  createdAt: Date;
  likes: number;
}

export function SharedNoteView({
  noteId,
  noteTitle,
  noteContent,
  authorName,
  authorImage,
  createdAt,
}: SharedNoteViewProps) {
  const { getNoteShareState } = useNoteShare();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const shareState = getNoteShareState(noteId);

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      authorName: 'Current User', // Replace with actual user name
      content: newComment,
      createdAt: new Date(),
      likes: 0,
    };

    setComments([comment, ...comments]);
    setNewComment('');
  };

  const handleLikeComment = (commentId: string) => {
    setComments(
      comments.map(comment =>
        comment.id === commentId
          ? { ...comment, likes: comment.likes + 1 }
          : comment
      )
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Note Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-4">
          <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
            {authorImage ? (
              <img src={authorImage} alt={authorName} className="h-full w-full rounded-full object-cover" />
            ) : (
              <span className="text-sm font-medium">{authorName[0]}</span>
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold">{noteTitle}</h1>
            <div className="text-sm text-muted-foreground">
              By {authorName} • {createdAt.toLocaleDateString()}
            </div>
          </div>
        </div>
        <Button variant="outline" size="sm" className="gap-2">
          <Share2 className="h-4 w-4" />
          Share
        </Button>
      </div>

      {/* Note Content */}
      <Card className="p-6">
        <div
          className="prose dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: noteContent }}
        />
      </Card>

      {/* Comments Section */}
      {shareState.allowComments && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Comments</h2>

          {/* Add Comment */}
          <div className="space-y-2">
            <textarea
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewComment(e.target.value)}
              className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
            <Button onClick={handleAddComment}>Post Comment</Button>
          </div>

          {/* Comments List */}
          <div className="space-y-4">
            {comments.map((comment) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-lg bg-secondary/20"
              >
                <div className="flex items-start space-x-4">
                  <div className="flex items-start space-x-4">
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                      {comment.authorImage ? (
                        <img 
                          src={comment.authorImage} 
                          alt={comment.authorName}
                          className="h-full w-full rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-sm font-medium">
                          {comment.authorName[0]}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{comment.authorName}</span>
                      <span className="text-sm text-muted-foreground">
                        {comment.createdAt.toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm">{comment.content}</p>
                    <div className="flex items-center space-x-4 pt-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-2"
                        onClick={() => handleLikeComment(comment.id)}
                      >
                        <ThumbsUp className="h-4 w-4" />
                        {comment.likes}
                      </Button>
                      <Button variant="ghost" size="sm" className="gap-2">
                        <MessageSquare className="h-4 w-4" />
                        Reply
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
