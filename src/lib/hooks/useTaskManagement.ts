import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  createKanbanTask,
  getTasksByTeam,
  updateTaskStatus,
  deleteTask,
  updateTask,
} from "@/actions/task-action";
import { usePersistentProjectState } from "@/lib/hooks/usePersistentProjectState";

export interface Task {
  id: string;
  title: string;
  description?: string | null;
  dueDate?: Date | null;
  completed?: boolean;
  teamId: string;
  projectName?: string | null;
  userId?: string | null;
  createdAt: Date;
  updatedAt: Date;
  priority: "high" | "medium" | "low";
  status: "opens" | "in-progress" | "evaluation" | "done";
}

export function useTaskManagement() {
  const { teamId, projectName } = usePersistentProjectState();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Helper functions to extract status and priority from description
  const extractStatusFromDescription = (
    description?: string | null
  ): Task["status"] => {
    if (!description) return "opens";
    const statusMatch = description.match(
      /Status: (opens|in-progress|evaluation|done)/
    );
    return (statusMatch?.[1] as Task["status"]) || "opens";
  };

  const extractPriorityFromDescription = (
    description?: string | null
  ): Task["priority"] => {
    if (!description) return "medium";
    const priorityMatch = description.match(/Priority: (high|medium|low)/);
    return (priorityMatch?.[1] as Task["priority"]) || "medium";
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const formatDate = (date?: Date | null) => {
    if (!date) return "No due date";
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const fetchTasks = async () => {
    if (!teamId) return;

    try {
      setIsLoading(true);
      const fetchedTasks = await getTasksByTeam(teamId);

      // Convert database tasks to Kanban format
      const kanbanTasks: Task[] = fetchedTasks.map((task) => ({
        ...task,
        status: extractStatusFromDescription(task.description) || "opens",
        priority: extractPriorityFromDescription(task.description) || "medium",
      }));

      setTasks(kanbanTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error("Failed to fetch tasks");
    } finally {
      setIsLoading(false);
    }
  };

  const createTask = async (taskData: {
    title: string;
    description?: string;
    dueDate?: Date;
    priority: "high" | "medium" | "low";
    status?: Task["status"];
  }) => {
    if (!teamId) return;

    try {
      await createKanbanTask({
        ...taskData,
        teamId,
        projectName,
        status: taskData.status || "opens",
      });

      await fetchTasks();
      toast.success("Task created successfully");
      return true;
    } catch (error) {
      console.error("Error creating task:", error);
      toast.error("Failed to create task");
      return false;
    }
  };

  const updateTaskById = async (
    taskId: string,
    taskData: {
      title: string;
      description?: string;
      dueDate?: Date;
      priority: "high" | "medium" | "low";
    },
    currentStatus: Task["status"]
  ) => {
    try {
      const updatedDescription = `${taskData.description || ""}\nStatus: ${currentStatus}\nPriority: ${taskData.priority}`;

      await updateTask(taskId, {
        title: taskData.title,
        description: updatedDescription,
        dueDate: taskData.dueDate,
      });

      await fetchTasks();
      toast.success("Task updated successfully");
      return true;
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Failed to update task");
      return false;
    }
  };

  const deleteTaskById = async (taskId: string) => {
    try {
      await deleteTask(taskId);
      await fetchTasks();
      toast.success("Task deleted successfully");
      return true;
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Failed to delete task");
      return false;
    }
  };

  const updateTaskStatusById = async (
    taskId: string,
    newStatus: Task["status"]
  ) => {
    try {
      await updateTaskStatus(taskId, newStatus);
      await fetchTasks();
      toast.success("Task status updated");
      return true;
    } catch (error) {
      console.error("Error updating task status:", error);
      toast.error("Failed to update task status");
      return false;
    }
  };

  const getTasksByStatus = (status: string) => {
    return tasks.filter((task) => task.status === status);
  };

  const getUpcomingTasks = (limit: number = 5) => {
    return tasks
      .filter((task) => task.dueDate && new Date(task.dueDate) > new Date())
      .sort(
        (a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime()
      )
      .slice(0, limit);
  };

  const getRecentTasks = (limit: number = 5) => {
    return tasks
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, limit);
  };

  useEffect(() => {
    fetchTasks();
  }, [teamId]);

  return {
    tasks,
    isLoading,
    teamId,
    projectName,
    createTask,
    updateTaskById,
    deleteTaskById,
    updateTaskStatusById,
    getTasksByStatus,
    getUpcomingTasks,
    getRecentTasks,
    getPriorityColor,
    formatDate,
    extractStatusFromDescription,
    extractPriorityFromDescription,
    fetchTasks,
  };
}