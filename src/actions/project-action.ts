"use server";

import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { project, task, projectInvite, projectMember, type NewProject, type Project, type ProjectInvite, type ProjectMember } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { nanoid } from 'nanoid';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
});

const db = drizzle(pool);
export async function getAllProjects(): Promise<Project[]> {
  try {
    const projects = await db.select().from(project);
    return projects;
  } catch (error) {
    console.error('Error fetching all projects:', error);
    throw new Error('Failed to fetch projects');
  }
}
export async function createProject(projectData: Omit<NewProject, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project> {
  try {
    const [newProject] = await db.insert(project).values({
      id: nanoid(),
      name: projectData.name,
      teamId: projectData.teamId,
    }).returning();

    return newProject;
  } catch (error) {
    console.error('Error creating project:', error);
    throw new Error('Failed to create project');
  }
}

export async function getProjectsByTeam(teamId: string): Promise<Project[]> {
  try {
    const projects = await db.select().from(project).where(eq(project.teamId, teamId));
    return projects;
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw new Error('Failed to fetch projects');
  }
}

export async function getProjectByTeamId(teamId: string): Promise<Project | null> {
  try {
    const rows = await db.select().from(project).where(eq(project.teamId, teamId));
    return rows[0] ?? null;
  } catch (error) {
    console.error('Error fetching project by teamId:', error);
    throw new Error('Failed to fetch project');
  }
}

export async function deleteProjectById(projectId: string): Promise<boolean> {
  try {
    // Find project to determine its Project ID (teamId)
    const [existing] = await db
      .select()
      .from(project)
      .where(eq(project.id, projectId));
    if (!existing) {
      return false;
    }

    // Manually cascade delete tasks tied to this project ID
    await db.delete(task).where(eq(task.teamId, existing.teamId));

    const result = await db.delete(project).where(eq(project.id, projectId));
    return !!(result?.rowCount ?? 1);
  } catch (error) {
    console.error('Error deleting project:', error);
    throw new Error('Failed to delete project');
  }
}

export async function inviteToProject(params: {
  projectId: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  invitedByUserId?: string;
}): Promise<ProjectInvite> {
  const token = nanoid(24);
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7); // 7 days
  const [invite] = await db.insert(projectInvite).values({
    id: nanoid(),
    projectId: params.projectId,
    email: params.email.toLowerCase(),
    role: params.role,
    token,
    invitedByUserId: params.invitedByUserId,
    expiresAt,
  }).returning();
  return invite;
}

export async function listProjectInvites(projectId: string): Promise<ProjectInvite[]> {
  const invites = await db.select().from(projectInvite).where(eq(projectInvite.projectId, projectId));
  return invites;
}

export async function listProjectMembers(projectId: string): Promise<ProjectMember[]> {
  const members = await db.select().from(projectMember).where(eq(projectMember.projectId, projectId));
  return members;
}

export async function acceptProjectInvite(params: { token: string; userId: string }): Promise<ProjectMember | null> {
  const [invite] = await db.select().from(projectInvite).where(eq(projectInvite.token, params.token));
  if (!invite) return null;
  if (invite.expiresAt && invite.expiresAt < new Date()) return null;

  const [member] = await db.insert(projectMember).values({
    id: nanoid(),
    projectId: invite.projectId,
    userId: params.userId,
    role: (invite.role as any) ?? 'viewer',
  }).returning();

  await db.delete(projectInvite).where(eq(projectInvite.id, invite.id));
  return member;
}


