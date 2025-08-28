"use server";

import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import {
  project,
  task,
  projectInvite,
  projectMember,
  type NewProject,
  type Project,
  type ProjectInvite,
  type ProjectMember,
} from "@/db/schema";
import { eq, and, inArray } from "drizzle-orm";
import { nanoid } from "nanoid";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { sendInviteEmail } from "@/lib/email";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool);

async function resolveProjectId(projectKey: string): Promise<string | null> {
  const byId = await db
    .select({ id: project.id })
    .from(project)
    .where(eq(project.id, projectKey));
  if (byId[0]?.id) return byId[0].id;
  const byTeam = await db
    .select({ id: project.id })
    .from(project)
    .where(eq(project.teamId, projectKey));
  return byTeam[0]?.id ?? null;
}

export async function getAllProjects(): Promise<Project[]> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      throw new Error("User not authenticated");
    }

    const userId = session.user.id;

    const userProjects = await db
      .select({
        id: project.id,
        name: project.name,
        teamId: project.teamId,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
      })
      .from(project)
      .innerJoin(projectMember, eq(project.id, projectMember.projectId))
      .where(eq(projectMember.userId, userId));

    return userProjects as Project[];
  } catch (error) {
    console.error("Error fetching user projects:", error);
    throw new Error("Failed to fetch projects");
  }
}

export async function getAllProjectsWithRoles(): Promise<(Project & { userRole: string })[]> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      throw new Error("User not authenticated");
    }

    const userId = session.user.id;

    const userProjects = await db
      .select({
        id: project.id,
        name: project.name,
        teamId: project.teamId,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
        userRole: projectMember.role,
      })
      .from(project)
      .innerJoin(projectMember, eq(project.id, projectMember.projectId))
      .where(eq(projectMember.userId, userId));

    return userProjects as (Project & { userRole: string })[];
  } catch (error) {
    console.error("Error fetching user projects with roles:", error);
    throw new Error("Failed to fetch projects with roles");
  }
}

export async function createProject(
  projectData: Omit<NewProject, "id" | "createdAt" | "updatedAt"> & {
    ownerUserId?: string;
  }
): Promise<Project> {
  try {
    const inserted = await db
      .insert(project)
      .values({
        id: nanoid(),
        name: projectData.name,
        teamId: projectData.teamId,
      })
      .returning();

    const newProject = inserted[0] as Project;

    if (projectData.ownerUserId) {
      await db.insert(projectMember).values({
        id: nanoid(),
        projectId: newProject.id,
        userId: projectData.ownerUserId,
        role: "owner",
      });
    }

    return newProject;
  } catch (error) {
    console.error("Error creating project:", error);
    throw new Error("Failed to create project");
  }
}

export async function getProjectsByTeam(teamId: string): Promise<Project[]> {
  try {
    const projects = await db
      .select()
      .from(project)
      .where(eq(project.teamId, teamId));
    return projects as Project[];
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw new Error("Failed to fetch projects");
  }
}

export async function getProjectByTeamId(
  teamId: string
): Promise<Project | null> {
  try {
    const rows = await db
      .select()
      .from(project)
      .where(eq(project.teamId, teamId));
    return (rows[0] as Project) ?? null;
  } catch (error) {
    console.error("Error fetching project by teamId:", error);
    throw new Error("Failed to fetch project");
  }
}

// Batch fetch projects by teamIds
export async function getProjectsByTeamIds(teamIds: string[]): Promise<Project[]> {
  try {
    const ids = Array.from(new Set((teamIds || []).filter(Boolean)));
    if (ids.length === 0) return [];
    const rows = await db
      .select()
      .from(project)
      .where(inArray(project.teamId, ids));
    return rows as Project[];
  } catch (error) {
    console.error("Error fetching projects by teamIds:", error);
    throw new Error("Failed to fetch projects by teamIds");
  }
}

export async function deleteProjectById(projectId: string): Promise<boolean> {
  try {
    const [existing] = await db
      .select()
      .from(project)
      .where(eq(project.id, projectId));

    if (!existing) {
      return false;
    }

    await db.delete(task).where(eq(task.teamId, existing.teamId));

    const deleted = await db.delete(project).where(eq(project.id, projectId));

    return Array.isArray(deleted) ? deleted.length > 0 : true;
  } catch (error) {
    console.error("Error deleting project:", error);
    throw new Error("Failed to delete project");
  }
}

export async function inviteToProject(params: {
  projectId: string;
  email: string;
  role:  "editor" | "viewer";
  invitedByUserId?: string;
  token: string;
}): Promise<ProjectInvite> {
  if (!params.invitedByUserId) {
    throw new Error("Not authorized");
  }

  const resolvedId = await resolveProjectId(params.projectId);
  if (!resolvedId) {
    throw new Error("Project not found");
  }

  const [inviter] = await db
    .select()
    .from(projectMember)
    .where(
      and(
        eq(projectMember.projectId, resolvedId),
        eq(projectMember.userId, params.invitedByUserId)
      )
    );

  if (!inviter || inviter.role !== "owner") {
    throw new Error("Only the project owner can invite members");
  }

  // const token = nanoid(24);
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7); // 7 days

  const inserted = await db
    .insert(projectInvite)
    .values({
      id: nanoid(),
      projectId: resolvedId,
      email: params.email.toLowerCase(),
      role: params.role,
      token: params.token,
      invitedByUserId: params.invitedByUserId,
      expiresAt,
    })
    .returning();

  const invite = inserted[0] as ProjectInvite;

  try {
    const [proj] = await db
      .select()
      .from(project)
      .where(eq(project.id, resolvedId));
    
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    // Use server route for robust redirect (handles auth + redirects appropriately)
    const acceptUrl = `${baseUrl}/api/accept-invite?token=${encodeURIComponent(params.token)}`;

    await sendInviteEmail(params.email, (proj as Project)?.name, params.role, acceptUrl);
  } catch (err) {
    console.error("Failed to send invite email:", err);
  }

  return invite;
}

export async function listProjectInvites(
  projectKey: string
): Promise<ProjectInvite[]> {
  const id = await resolveProjectId(projectKey);
  if (!id) return [];
  const invites = await db
    .select()
    .from(projectInvite)
    .where(eq(projectInvite.projectId, id));
  return invites as ProjectInvite[];
}

export async function listProjectMembers(
  projectKey: string
): Promise<ProjectMember[]> {
  const id = await resolveProjectId(projectKey);
  if (!id) return [];
  const members = await db
    .select()
    .from(projectMember)
    .where(eq(projectMember.projectId, id));
  return members as ProjectMember[];
}

export async function getMyRoleForProject(params: {
  projectKey: string;
  userId: string;
}): Promise<ProjectMember["role"] | null> {
  const id = await resolveProjectId(params.projectKey);
  if (!id) return null;
  const rows = await db
    .select({ role: projectMember.role })
    .from(projectMember)
    .where(
      and(
        eq(projectMember.projectId, id),
        eq(projectMember.userId, params.userId)
      )
    );
  return rows[0]?.role ?? null;
}

export async function listPendingInvitesForEmail(
  email: string
): Promise<Array<ProjectInvite & { projectName: string | null }>> {
  const all = await db
    .select()
    .from(projectInvite)
    .where(eq(projectInvite.email, email.toLowerCase()));
  const pending = all.filter(
    (i) => i.status === "pending" && (!i.expiresAt || i.expiresAt > new Date())
  );
  if (pending.length === 0) return [];
  const ids = Array.from(new Set(pending.map((i) => i.projectId)));
  const prows = await db.select().from(project).where(inArray(project.id, ids));
  const names = new Map((prows as Project[]).map((p) => [p.id, p.name]));
  return pending.map((i) => ({
    ...(i as ProjectInvite),
    projectName: names.get(i.projectId) ?? null,
  }));
}

export async function declineProjectInvite(
  params: { token: string }
): Promise<boolean> {
  try {
    await db.delete(projectInvite).where(eq(projectInvite.token, params.token));
    return true;
  } catch {
    return false;
  }
}

export async function acceptProjectInvite(params: {
  token: string;
  userId: string;
}): Promise<ProjectMember | null> {
  const [invite] = await db
    .select()
    .from(projectInvite)
    .where(eq(projectInvite.token, params.token));
  if (!invite) return null;
  if (invite.expiresAt && invite.expiresAt < new Date()) return null;

  const inserted = await db
    .insert(projectMember)
    .values({
      id: nanoid(),
      projectId: invite.projectId,
      userId: params.userId,
      role: (invite.role as ProjectMember["role"]) ?? "viewer",
    })
    .returning();

  const member = inserted[0] as ProjectMember;

  await db.delete(projectInvite).where(eq(projectInvite.id, invite.id));
  return member;
}

export async function joinProjectByTeamId(params: {
  teamId: string;
  userId: string;
  requestedRole?: "viewer" | "editor"; // Users can only request viewer or editor roles
}): Promise<{ project: Project; member: ProjectMember; isNewMember: boolean } | null> {
  try {
    console.log("joinProjectByTeamId called with params:", params);
    
    // First, find the project by team ID
    const project = await getProjectByTeamId(params.teamId);
    console.log("Found project:", project);
    
    if (!project) {
      throw new Error("Project not found with the provided Team ID");
    }
    const existingMember = await db
      .select()
      .from(projectMember)
      .where(
        and(
          eq(projectMember.projectId, project.id),
          eq(projectMember.userId, params.userId)
        )
      );

    console.log("Existing member check:", existingMember);

    if (existingMember.length > 0) {
      // User is already a member, return existing membership
      console.log("User is already a member");
      return {
        project,
        member: existingMember[0] as ProjectMember,
        isNewMember: false,
      };
    }

    const roleToAssign: ProjectMember["role"] = 
      params.requestedRole === "editor" ? "editor" : "viewer";

    const inserted = await db
      .insert(projectMember)
      .values({
        id: nanoid(),
        projectId: project.id,
        userId: params.userId,
        role: roleToAssign,
      })
      .returning();

    const member = inserted[0] as ProjectMember;
    console.log("New member created:", member);

    return {
      project,
      member,
      isNewMember: true,
    };
  } catch (error) {
    console.error("Error joining project by team ID:", error);
    throw error; // Re-throw to let caller handle specific errors
  }
}

export async function leaveProject(params: {
  projectId: string;
  userId: string;
}): Promise<{ success: boolean; message: string }> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return { success: false, message: "User not authenticated" };
    }

    // Ensure the user can only leave their own membership
    if (session.user.id !== params.userId) {
      return { success: false, message: "Not authorized to perform this action" };
    }

    const resolvedProjectId = await resolveProjectId(params.projectId);
    if (!resolvedProjectId) {
      return { success: false, message: "Project not found" };
    }

    // Check if user is a member of the project
    const [member] = await db
      .select()
      .from(projectMember)
      .where(
        and(
          eq(projectMember.projectId, resolvedProjectId),
          eq(projectMember.userId, params.userId)
        )
      );

    if (!member) {
      return { success: false, message: "You are not a member of this project" };
    }

    // Check if user is the owner - owners cannot leave the project
    if (member.role === "owner") {
      return { 
        success: false, 
        message: "Project owners cannot leave the project. Transfer ownership or delete the project instead." 
      };
    }

    // Remove the user from the project
    await db
      .delete(projectMember)
      .where(
        and(
          eq(projectMember.projectId, resolvedProjectId),
          eq(projectMember.userId, params.userId)
        )
      );

    return { success: true, message: "Successfully left the project" };
  } catch (error) {
    console.error("Error leaving project:", error);
    return { success: false, message: "Failed to leave project" };
  }
}
