'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/use-auth';
import { useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { 
  Bell, 
  Moon, 
  Sun, 
  Mail,
  User,
  Shield,
  Save
} from 'lucide-react';

export default function ProfileSettings() {
  const { user } = useUser();
  const { role, permissions } = useAuth();
  const [preferences, setPreferences] = useState({
    theme: 'light',
    emailNotifications: true,
    studyReminders: true,
  });

  const handleSavePreferences = async () => {
    // Here you would typically save to your backend
    console.log('Saving preferences:', preferences);
  };

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        {/* Profile Information */}
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <User className="h-6 w-6" />
            Profile Information
          </h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">First Name</label>
                <Input 
                  value={user?.firstName || ''} 
                  disabled 
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Last Name</label>
                <Input 
                  value={user?.lastName || ''} 
                  disabled 
                  className="mt-1"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Email</label>
              <Input 
                value={user?.primaryEmailAddress?.emailAddress || ''} 
                disabled 
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Role</label>
              <div className="flex items-center gap-2 mt-1">
                <Shield className="h-4 w-4" />
                <span className="capitalize">{role}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Preferences */}
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Bell className="h-6 w-6" />
            Preferences
          </h2>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Moon className="h-4 w-4" />
                  <label className="text-sm font-medium">Dark Mode</label>
                </div>
                <p className="text-sm text-muted-foreground">
                  Enable dark mode for a better night-time experience
                </p>
              </div>
              <Switch
                checked={preferences.theme === 'dark'}
                onCheckedChange={(checked) =>
                  setPreferences(prev => ({ ...prev, theme: checked ? 'dark' : 'light' }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <label className="text-sm font-medium">Email Notifications</label>
                </div>
                <p className="text-sm text-muted-foreground">
                  Receive email notifications about your activity
                </p>
              </div>
              <Switch
                checked={preferences.emailNotifications}
                onCheckedChange={(checked) =>
                  setPreferences(prev => ({ ...prev, emailNotifications: checked }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  <label className="text-sm font-medium">Study Reminders</label>
                </div>
                <p className="text-sm text-muted-foreground">
                  Get reminders to review your study materials
                </p>
              </div>
              <Switch
                checked={preferences.studyReminders}
                onCheckedChange={(checked) =>
                  setPreferences(prev => ({ ...prev, studyReminders: checked }))
                }
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <Button onClick={handleSavePreferences} className="gap-2">
              <Save className="h-4 w-4" />
              Save Preferences
            </Button>
          </div>
        </Card>

        {/* Permissions */}
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Shield className="h-6 w-6" />
            Permissions
          </h2>
          <div className="space-y-4">
            {Object.entries(permissions).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-sm font-medium capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </span>
                <span className={`text-sm ${value ? 'text-green-500' : 'text-red-500'}`}>
                  {value ? 'Allowed' : 'Not Allowed'}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
