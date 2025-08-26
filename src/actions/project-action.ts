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
import { sendProjectInviteEmail } from "@/lib/resend";

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
    const projects = await db.select().from(project);
    return projects as Project[];
  } catch (error) {
    console.error("Error fetching all projects:", error);
    throw new Error("Failed to fetch projects");
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
  projectId: string; // can be teamId or real project.id
  email: string;
  role: "admin" | "editor" | "viewer";
  invitedByUserId?: string;
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

  const token = nanoid(24);
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7); // 7 days

  const inserted = await db
    .insert(projectInvite)
    .values({
      id: nanoid(),
      projectId: resolvedId,
      email: params.email.toLowerCase(),
      role: params.role,
      token,
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
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const acceptUrl = `${baseUrl}/invite/${token}`;

    await sendProjectInviteEmail({
      to: params.email.toLowerCase(),
      projectName: (proj as Project)?.name,
      role: params.role,
      acceptUrl,
    });
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
