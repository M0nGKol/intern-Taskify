"use client";

import { useState, useEffect } from "react";
import { getRolePermissions, type UserRole, type RolePermissions } from "@/lib/role-permissions";
import { getMyRoleForProject } from "@/actions/project-action";

export function useRolePermissions(userId?: string, projectKey?: string) {
  const [role, setRole] = useState<UserRole | null>(null);
  const [permissions, setPermissions] = useState<RolePermissions | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRoleAndPermissions = async () => {
      if (!userId || !projectKey) {
        setRole(null);
        setPermissions(null);
        setLoading(false);
        return;
      }

      try {
        const userRole = await getMyRoleForProject({ projectKey, userId });
        const roleAsUserRole = userRole as UserRole;
        
        setRole(roleAsUserRole);
        setPermissions(userRole ? getRolePermissions(roleAsUserRole) : null);
      } catch (error) {
        console.error("Error loading role and permissions:", error);
        setRole(null);
        setPermissions(null);
      } finally {
        setLoading(false);
      }
    };

    loadRoleAndPermissions();
  }, [userId, projectKey]);

  return {
    role,
    permissions,
    loading,
    // Helper functions for common checks
    canInvite: permissions?.canInviteMembers ?? false,
    canCreateTasks: permissions?.canCreateTasks ?? false,
    canEditTasks: permissions?.canEditTasks ?? false,
    canDeleteTasks: permissions?.canDeleteTasks ?? false,
    canChangeTaskStatus: permissions?.canChangeTaskStatus ?? false,
    canAssignTasks: permissions?.canAssignTasks ?? false,
    canViewOnly: role === "viewer",
    isOwner: role === "owner",
    isEditor: role === "editor",
    isViewer: role === "viewer",
  };
}