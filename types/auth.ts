export type UserRole = 'user' | 'admin' | 'moderator';

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  imageUrl: string;
  createdAt: Date;
  preferences: {
    theme: 'light' | 'dark';
    emailNotifications: boolean;
    studyReminders: boolean;
  };
}

export interface RolePermissions {
  canCreateContent: boolean;
  canEditContent: boolean;
  canDeleteContent: boolean;
  canManageUsers: boolean;
  canAccessAdmin: boolean;
}
