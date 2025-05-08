import { useUser } from "@clerk/nextjs";
import { UserRole, RolePermissions } from "@/types/auth";

const rolePermissions: Record<UserRole, RolePermissions> = {
  user: {
    canCreateContent: true,
    canEditContent: true,
    canDeleteContent: false,
    canManageUsers: false,
    canAccessAdmin: false,
  },
  moderator: {
    canCreateContent: true,
    canEditContent: true,
    canDeleteContent: true,
    canManageUsers: false,
    canAccessAdmin: false,
  },
  admin: {
    canCreateContent: true,
    canEditContent: true,
    canDeleteContent: true,
    canManageUsers: true,
    canAccessAdmin: true,
  },
};

export function useAuth() {
  const { user } = useUser();
  
  // Get user's role from metadata (default to 'user' if not set)
  const role = (user?.publicMetadata?.role as UserRole) || 'user';
  
  // Get permissions for the role
  const permissions = rolePermissions[role];
  
  return {
    user,
    role,
    permissions,
    isAdmin: role === 'admin',
    isModerator: role === 'moderator',
    // Helper function to check if user has specific permission
    hasPermission: (permission: keyof RolePermissions) => permissions[permission],
  };
}
