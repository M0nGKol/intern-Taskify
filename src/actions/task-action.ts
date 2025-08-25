"use server";

import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { task, NewTask, Task } from '@/db/schema';
import { and, eq } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import { checkProjectPermission } from '@/lib/role-permissions';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
});

const db = drizzle(pool);

export interface KanbanTask extends Task {
  status: string;
  priority: 'high' | 'medium' | 'low';
}

export async function getTasksByTeamAndProject(teamId: string, projectName?: string) {
  if (!projectName) {
    return db.select().from(task).where(eq(task.teamId, teamId));
  }
  return db
    .select()
    .from(task)
    .where(and(eq(task.teamId, teamId), eq(task.projectName, projectName)));
}

// Enhanced createTask with role validation
export async function createTask(
  taskData: Omit<NewTask, 'id' | 'createdAt' | 'updatedAt'>,
  userId?: string
): Promise<Task> {
  try {
    // Check if user has permission to create tasks
    if (userId && taskData.teamId) {
      const canCreate = await checkProjectPermission(userId, taskData.teamId, 'canCreateTasks');
      if (!canCreate) {
        throw new Error('You do not have permission to create tasks in this project');
      }
    }

    const [newTask] = await db.insert(task).values({
      id: nanoid(),
      title: taskData.title,
      description: taskData.description,
      dueDate: taskData.dueDate,
      teamId: taskData.teamId,
      projectName: taskData.projectName,
      userId: taskData.userId,
    }).returning();
    
    return newTask;
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
}

// Enhanced createKanbanTask with role validation
export async function createKanbanTask(
  taskData: {
    title: string;
    description?: string;
    dueDate?: Date;
    teamId: string;
    projectName?: string;
    userId?: string;
    status: string;
    priority: 'high' | 'medium' | 'low';
  },
  currentUserId?: string
): Promise<Task> {
  try {
    // Check if user has permission to create tasks
    if (currentUserId && taskData.teamId) {
      const canCreate = await checkProjectPermission(currentUserId, taskData.teamId, 'canCreateTasks');
      if (!canCreate) {
        throw new Error('You do not have permission to create tasks in this project');
      }
    }

    const [newTask] = await db.insert(task).values({
      id: nanoid(),
      title: taskData.title,
      description: `${taskData.description || ''}\nStatus: ${taskData.status}\nPriority: ${taskData.priority}`,
      dueDate: taskData.dueDate,
      teamId: taskData.teamId,
      projectName: taskData.projectName,
      userId: taskData.userId,
      status: taskData.status,
    }).returning();

    return newTask;
  } catch (error) {
    console.error('Error creating Kanban task:', error);
    throw error;
  }
}

export async function getTasksByTeam(teamId: string): Promise<Task[]> {
  try {
    const allTasks = await db.select().from(task).where(eq(task.teamId, teamId));
    return allTasks;
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw new Error('Failed to fetch tasks');
  }
}

export async function getAllTasks(): Promise<Task[]> {
  try {
    const allTasks = await db.select().from(task);
    return allTasks;
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw new Error('Failed to fetch tasks');
  }
}

// Enhanced updateTask with role validation
export async function updateTask(
  id: string, 
  taskData: Partial<Omit<NewTask, 'id' | 'createdAt'>>,
  currentUserId?: string
): Promise<Task | null> {
  try {
    // Get the current task to check permissions
    const [currentTask] = await db.select().from(task).where(eq(task.id, id));
    if (!currentTask) {
      throw new Error('Task not found');
    }

    // Check if user has permission to edit tasks
    if (currentUserId && currentTask.teamId) {
      const canEdit = await checkProjectPermission(currentUserId, currentTask.teamId, 'canEditTasks');
      if (!canEdit) {
        throw new Error('You do not have permission to edit tasks in this project');
      }
    }

    const updateData: Partial<Omit<NewTask, 'id' | 'createdAt'>> & { updatedAt: Date } = { 
      ...taskData, 
      updatedAt: new Date() 
    };
    
    const [updatedTask] = await db
      .update(task)
      .set(updateData)
      .where(eq(task.id, id))
      .returning();
    
    return updatedTask || null;
  } catch (error) {
    console.error('Error updating task:', error);
    throw error;
  }
}

// Enhanced updateTaskStatus with role validation
export async function updateTaskStatus(
  id: string, 
  status: string,
  currentUserId?: string
): Promise<Task | null> {
  try {
    // Get the current task to check permissions
    const [currentTask] = await db.select().from(task).where(eq(task.id, id));
    if (!currentTask) {
      throw new Error('Task not found');
    }

    // Check if user has permission to change task status
    if (currentUserId && currentTask.teamId) {
      const canChangeStatus = await checkProjectPermission(currentUserId, currentTask.teamId, 'canChangeTaskStatus');
      if (!canChangeStatus) {
        throw new Error('You do not have permission to change task status in this project');
      }
    }

    const [updatedTask] = await db
      .update(task)
      .set({
        status,           
        updatedAt: new Date(),
      })
      .where(eq(task.id, id))
      .returning();

    return updatedTask || null;
  } catch (error) {
    console.error('Error updating task status:', error);
    throw error;
  }
}

// Enhanced deleteTask with role validation
export async function deleteTask(id: string, currentUserId?: string): Promise<boolean> {
  try {
    // Get the current task to check permissions
    const [currentTask] = await db.select().from(task).where(eq(task.id, id));
    if (!currentTask) {
      throw new Error('Task not found');
    }

    // Check if user has permission to delete tasks
    if (currentUserId && currentTask.teamId) {
      const canDelete = await checkProjectPermission(currentUserId, currentTask.teamId, 'canDeleteTasks');
      if (!canDelete) {
        throw new Error('You do not have permission to delete tasks in this project');
      }
    }

    const result = await db.delete(task).where(eq(task.id, id));
    return result.rowCount! > 0;
  } catch (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
}


export async function getTaskById(id: string): Promise<Task | null> {
  try {
    const [taskItem] = await db.select().from(task).where(eq(task.id, id));
    return taskItem || null;
  } catch (error) {
    console.error('Error fetching task:', error);
    throw new Error('Failed to fetch task');
  }
}

// Aggregate counts per day for a team (optionally filtered by project) within a date range
export async function getTaskCountsByDate(
  teamId: string,
  startDate: Date,
  endDate: Date,
  projectName?: string
): Promise<{ date: string; count: number }[]> {
  try {
    const params: string[] = [teamId, startDate.toISOString(), endDate.toISOString()];
    let sqlText = `
      SELECT to_char(due_date::date, 'YYYY-MM-DD') AS date, COUNT(*)::int AS count
      FROM "task"
      WHERE team_id = $1
        AND due_date IS NOT NULL
        AND due_date >= $2
        AND due_date < $3`;

    if (projectName) {
      sqlText += ` AND project_name = $4`;
      params.push(projectName);
    }

    sqlText += ` GROUP BY 1 ORDER BY 1`;

    const { rows } = await pool.query(sqlText, params);
    return rows as { date: string; count: number }[];
  } catch (error) {
    console.error('Error fetching task counts by date:', error);
    throw new Error('Failed to fetch task counts by date');
  }
}
