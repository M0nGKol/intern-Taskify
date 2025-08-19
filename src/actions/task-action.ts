"use server";

import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { task, NewTask, Task } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { nanoid } from 'nanoid';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
});

const db = drizzle(pool);

// Enhanced task interface for Kanban board
export interface KanbanTask extends Task {
  status: string; // Changed to string to support dynamic column IDs
  priority: 'high' | 'medium' | 'low';
}

// Insert a new task
export async function createTask(taskData: Omit<NewTask, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> {
  try {
    const [newTask] = await db.insert(task).values({
      id: nanoid(), // Generate a unique ID
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
    throw new Error('Failed to create task');
  }
}

export async function createKanbanTask(taskData: {
  title: string;
  description?: string;
  dueDate?: Date;
  teamId: string;
  projectName?: string;
  userId?: string;
  status: string; // Changed to string to support dynamic column IDs
  priority: 'high' | 'medium' | 'low';
}): Promise<Task> {
  try {
    // Combine description with status and priority metadata
    const fullDescription = `${taskData.description || ''}\nStatus: ${taskData.status}\nPriority: ${taskData.priority}`.trim();
    
    const [newTask] = await db.insert(task).values({
      id: nanoid(), // Generate a unique ID
      title: taskData.title,
      description: fullDescription,
      dueDate: taskData.dueDate,
      teamId: taskData.teamId,
      projectName: taskData.projectName,
      userId: taskData.userId,
    }).returning();
    
    return newTask;
  } catch (error) {
    console.error('Error creating Kanban task:', error);
    throw new Error('Failed to create Kanban task');
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

// Get all tasks
export async function getAllTasks(): Promise<Task[]> {
  try {
    const allTasks = await db.select().from(task);
    return allTasks;
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw new Error('Failed to fetch tasks');
  }
}

// Update a task
export async function updateTask(id: string, taskData: Partial<Omit<NewTask, 'id' | 'createdAt'>>): Promise<Task | null> {
  try {
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
    throw new Error('Failed to update task');
  }
}


export async function updateTaskStatus(id: string, status: string): Promise<Task | null> {
  try {
    const currentTask = await getTaskById(id);
    if (!currentTask) return null;
    

    const priorityMatch = currentTask.description?.match(/Priority: (high|medium|low)/);
    const priority = priorityMatch?.[1] || 'medium';
    

    const cleanDescription = currentTask.description?.replace(/Status:.*Priority:.*/g, '').trim() || '';
    

    const newDescription = `${cleanDescription}\nStatus: ${status}\nPriority: ${priority}`.trim();
    
    const [updatedTask] = await db
      .update(task)
      .set({ 
        updatedAt: new Date(),
        description: newDescription
      })
      .where(eq(task.id, id))
      .returning();
    
    return updatedTask || null;
  } catch (error) {
    console.error('Error updating task status:', error);
    throw new Error('Failed to update task status');
  }
}


export async function deleteTask(id: string): Promise<boolean> {
  try {
    const result = await db.delete(task).where(eq(task.id, id));
    return result.rowCount! > 0;
  } catch (error) {
    console.error('Error deleting task:', error);
    throw new Error('Failed to delete task');
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