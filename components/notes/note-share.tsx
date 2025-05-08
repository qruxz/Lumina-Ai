'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Share2, 
  Link2, 
  Copy, 
  Mail, 
  Globe, 
  Lock,
  Users,
  Check,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface NoteShareProps {
  noteId: string;
  noteTitle: string;
}

type Visibility = 'private' | 'shared' | 'public';
type Permission = 'view' | 'comment' | 'edit';

interface SharedUser {
  email: string;
  permission: Permission;
}

export function NoteShare({ noteId, noteTitle }: NoteShareProps) {
  const [visibility, setVisibility] = useState<Visibility>('private');
  const [sharedUsers, setSharedUsers] = useState<SharedUser[]>([]);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPermission, setNewUserPermission] = useState<Permission>('view');
  const [linkCopied, setLinkCopied] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleShare = () => {
    if (newUserEmail && newUserPermission) {
      setSharedUsers([
        ...sharedUsers,
        { email: newUserEmail, permission: newUserPermission }
      ]);
      setNewUserEmail('');
      setNewUserPermission('view');
    }
  };

  const removeSharedUser = (email: string) => {
    setSharedUsers(sharedUsers.filter(user => user.email !== email));
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(`https://lumina.app/notes/${noteId}`);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Share2 className="h-4 w-4" />
          Share
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Share Note</DialogTitle>
          <DialogDescription>
            Share "{noteTitle}" with others
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="share" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="share">Share</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="share" className="space-y-4">
            {/* Add People */}
            <div className="flex gap-2">
              <Input
                placeholder="Enter email address"
                value={newUserEmail}
                onChange={(e) => setNewUserEmail(e.target.value)}
                className="flex-1"
              />
              <Select
                value={newUserPermission}
                onValueChange={(value: Permission) => setNewUserPermission(value)}
              >
                <SelectTrigger className="w-[100px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="view">View</SelectItem>
                  <SelectItem value="comment">Comment</SelectItem>
                  <SelectItem value="edit">Edit</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleShare}>Share</Button>
            </div>

            {/* Shared Users List */}
            <div className="space-y-2">
              {sharedUsers.map((user) => (
                <motion.div
                  key={user.email}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between p-2 rounded-lg bg-secondary/20"
                >
                  <span className="text-sm">{user.email}</span>
                  <div className="flex items-center gap-2">
                    <Select
                      value={user.permission}
                      onValueChange={(value: Permission) => {
                        setSharedUsers(
                          sharedUsers.map((u) =>
                            u.email === user.email
                              ? { ...u, permission: value }
                              : u
                          )
                        );
                      }}
                    >
                      <SelectTrigger className="h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="view">View</SelectItem>
                        <SelectItem value="comment">Comment</SelectItem>
                        <SelectItem value="edit">Edit</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSharedUser(user.email)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Share Link */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Share Link</label>
              <div className="flex gap-2">
                <Input
                  readOnly
                  value={`https://lumina.app/notes/${noteId}`}
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={copyLink}
                  className="relative"
                >
                  {linkCopied ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-green-500"
                    >
                      <Check className="h-4 w-4" />
                    </motion.div>
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            {/* Visibility Settings */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Note Visibility</label>
                <Select
                  value={visibility}
                  onValueChange={(value: Visibility) => setVisibility(value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="private">
                      <div className="flex items-center gap-2">
                        <Lock className="h-4 w-4" />
                        <span>Private</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="shared">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span>Shared</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="public">
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        <span>Public</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-sm font-medium">Allow Comments</div>
                  <div className="text-sm text-muted-foreground">
                    Let others comment on your note
                  </div>
                </div>
                <Switch />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-sm font-medium">Show Author</div>
                  <div className="text-sm text-muted-foreground">
                    Display your name as the author
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
