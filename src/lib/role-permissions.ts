// Role-based permission system
export type UserRole = "owner" | "admin" | "editor" | "viewer";

export interface RolePermissions {
  // Project management
  canInviteMembers: boolean;
  canRemoveMembers: boolean;
  canDeleteProject: boolean;
  canEditProjectSettings: boolean;
  
  // Task management
  canCreateTasks: boolean;
  canEditTasks: boolean;
  canDeleteTasks: boolean;
  canAssignTasks: boolean;
  canChangeTaskStatus: boolean;
  
  // General access
  canViewProject: boolean;
  canViewTasks: boolean;
}

export function getRolePermissions(role: UserRole): RolePermissions {
  switch (role) {
    case "owner":
      return {
        // Project management - full access
        canInviteMembers: true,
        canRemoveMembers: true,
        canDeleteProject: true,
        canEditProjectSettings: true,
        
        // Task management - full access
        canCreateTasks: true,
        canEditTasks: true,
        canDeleteTasks: true,
        canAssignTasks: true,
        canChangeTaskStatus: true,
        
        // General access
        canViewProject: true,
        canViewTasks: true,
      };
      
    case "admin":
      return {
        // Project management - limited
        canInviteMembers: false, // Only owners can invite
        canRemoveMembers: false,
        canDeleteProject: false,
        canEditProjectSettings: false,
        
        // Task management - full access
        canCreateTasks: true,
        canEditTasks: true,
        canDeleteTasks: true,
        canAssignTasks: true,
        canChangeTaskStatus: true,
        
        // General access
        canViewProject: true,
        canViewTasks: true,
      };
      
    case "editor":
      return {
        // Project management - no access
        canInviteMembers: false,
        canRemoveMembers: false,
        canDeleteProject: false,
        canEditProjectSettings: false,
        
        // Task management - CRUD only
        canCreateTasks: true,
        canEditTasks: true,
        canDeleteTasks: true,
        canAssignTasks: true,
        canChangeTaskStatus: true,
        
        // General access
        canViewProject: true,
        canViewTasks: true,
      };
      
    case "viewer":
      return {
        // Project management - no access
        canInviteMembers: false,
        canRemoveMembers: false,
        canDeleteProject: false,
        canEditProjectSettings: false,
        
        // Task management - view only
        canCreateTasks: false,
        canEditTasks: false,
        canDeleteTasks: false,
        canAssignTasks: false,
        canChangeTaskStatus: false,
        
        // General access
        canViewProject: true,
        canViewTasks: true,
      };
      
    default:
      // No permissions for unknown roles
      return {
        canInviteMembers: false,
        canRemoveMembers: false,
        canDeleteProject: false,
        canEditProjectSettings: false,
        canCreateTasks: false,
        canEditTasks: false,
        canDeleteTasks: false,
        canAssignTasks: false,
        canChangeTaskStatus: false,
        canViewProject: false,
        canViewTasks: false,
      };
  }
}

export function hasPermission(role: UserRole, permission: keyof RolePermissions): boolean {
  const permissions = getRolePermissions(role);
  return permissions[permission];
}

// Helper to check if user can perform action on a project
export async function checkProjectPermission(
  userId: string,
  projectKey: string,
  permission: keyof RolePermissions
): Promise<boolean> {
  try {
    const { getMyRoleForProject } = await import("@/actions/project-action");
    const role = await getMyRoleForProject({ projectKey, userId });
    if (!role) return false;
    return hasPermission(role as UserRole, permission);
  } catch {
    return false;
  }
}