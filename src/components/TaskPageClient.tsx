"use client";

import React, { useState, useEffect } from "react";
import {
  Settings,
  Plus,
  Calendar,
  Edit,
  Trash2,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Task, Project } from "@/db/schema";
import { Column } from "@/constants/columns";
import {
  createKanbanTask,
  updateTask,
  deleteTask,
} from "@/actions/task-action";
import { deleteProjectById } from "@/actions/project-action";
import { toast } from "sonner";
import { useDragAndDrop } from "@/lib/hooks/useDragAndDrop";
import { CreateTaskModal } from "@/components/modals/create-task-modal";
import { CreateColumnModal } from "@/components/modals/create-column-modal";
import { EditTaskModal } from "@/components/modals/edit-task-modal";
import { InviteTeamModal } from "./modals/invite-team";

// Extended Task type with priority
type TaskWithPriority = Task & {
  priority: "high" | "medium" | "low";
};

type ViewTask = {
  id: string;
  title: string;
  description?: string | null;
  dueDate?: Date | null;
  priority: "high" | "medium" | "low";
} | null;

interface TaskPageClientProps {
  tasks: Task[];
  projects: Project[];
  teamId: string;
  projectName: string;
  defaultColumns: Column[];
  colorOptions: string[];
  userId: string;
}

export function TaskPageClient({
  tasks: initialTasks,
  projects: dbProjects,
  teamId,
  projectName,
  defaultColumns,
  colorOptions,
  userId,
}: TaskPageClientProps) {
  const tasksWithPriority: TaskWithPriority[] = initialTasks.map((task) => ({
    ...task,
    priority: (task.priority as "high" | "medium" | "low") || "medium",
  }));

  const [tasks, setTasks] = useState<TaskWithPriority[]>(tasksWithPriority);
  const [columns, setColumns] = useState<Column[]>(defaultColumns);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TaskWithPriority | null>(
    null
  );
  const [selectedColumnId, setSelectedColumnId] = useState<string>("");
  const [viewTask, setViewTask] = useState<ViewTask>(null);

  // Project switching
  const [projectQuery, setProjectQuery] = useState("");
  const [filteredProjects, setFilteredProjects] = useState(dbProjects);

  // Drag and drop state for columns
  const [dragOverColumnId, setDragOverColumnId] = useState<string | null>(null);

  // Custom drag and drop hook
  const {
    draggedTask,
    dragOverColumn,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDragEnter,
    handleDragLeave,
    handleDrop,
  } = useDragAndDrop();

  // Utility functions
  const getPriorityColor = (priority: string): string => {
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

  const cleanDescription = (description: string | null | undefined): string => {
    if (!description) return "No description";
    return description.replace(/<[^>]*>/g, "").trim() || "No description";
  };

  // Update filtered projects when query changes
  useEffect(() => {
    const filtered = dbProjects.filter((project) =>
      project.name.toLowerCase().includes(projectQuery.toLowerCase())
    );
    setFilteredProjects(filtered);
  }, [projectQuery, dbProjects]);

  // Update tasks when initialTasks changes (when route changes)
  useEffect(() => {
    const tasksWithPriority: TaskWithPriority[] = initialTasks.map((task) => ({
      ...task,
      priority: (task.priority as "high" | "medium" | "low") || "medium",
    }));
    setTasks(tasksWithPriority);
  }, [initialTasks]);

  // Task management functions
  const getTasksByStatus = (columnId: string) => {
    return tasks.filter((task) => task.status === columnId);
  };

  const handleUpdateTask = async (
    taskId: string,
    updates: Partial<TaskWithPriority>
  ) => {
    try {
      const updatedTask = await updateTask(taskId, updates, userId);
      if (updatedTask) {
        const taskWithPriority: TaskWithPriority = {
          ...updatedTask,
          priority:
            updates.priority ||
            tasks.find((t) => t.id === taskId)?.priority ||
            "medium",
        };
        setTasks(
          tasks.map((task) => (task.id === taskId ? taskWithPriority : task))
        );
        toast.success("Task updated successfully");
        return true;
      }
      return false;
    } catch {
      toast.error("Failed to update task");
      return false;
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask(taskId);
      setTasks(tasks.filter((task) => task.id !== taskId));
      toast.success("Task deleted successfully");
    } catch {
      toast.error("Failed to delete task");
    }
  };

  const deleteColumn = (columnId: string) => {
    const columnToDelete = columns.find((col) => col.id === columnId);
    if (!columnToDelete) return;

    const remaining = columns.filter((col) => col.id !== columnId);
    const reindexed = remaining.map((col, idx) => ({ ...col, order: idx }));
    setColumns(reindexed);
    toast.success(`Column "${columnToDelete.title}" deleted successfully`);
  };

  // Modal handlers
  const openCreateTaskModal = (columnId: string) => {
    setSelectedColumnId(columnId);
    setIsTaskModalOpen(true);
  };

  const closeCreateTaskModal = () => {
    setIsTaskModalOpen(false);
    setSelectedColumnId("");
  };

  const openEditTaskModal = (task: TaskWithPriority) => {
    setSelectedTask(task);
    setIsEditModalOpen(true);
  };

  const closeEditTaskModal = () => {
    setIsEditModalOpen(false);
    setSelectedTask(null);
  };

  // Create task handler
  const handleCreateTask = async (taskData: {
    title: string;
    description?: string;
    dueDate?: Date;
    priority: "high" | "medium" | "low";
  }) => {
    if (!selectedColumnId) return;

    try {
      const newTask = await createKanbanTask({
        title: taskData.title,
        description: taskData.description || "",
        dueDate: taskData.dueDate,
        priority: taskData.priority,
        status: selectedColumnId,
        teamId,
        projectName,
        userId,
      });

      if (newTask) {
        const taskWithPriority: TaskWithPriority = {
          ...newTask,
          priority: taskData.priority,
        };
        setTasks([...tasks, taskWithPriority]);
        toast.success("Task created successfully");
      }
    } catch (error) {
      toast.error("Failed to create task");
      console.error("Error creating task:", error);
    }
  };

  // Update task handler for edit modal
  const handleUpdateTaskFromModal = async (taskData: {
    title: string;
    description?: string;
    dueDate?: Date;
    priority: "high" | "medium" | "low";
  }) => {
    if (!selectedTask) return;

    await handleUpdateTask(selectedTask.id, {
      title: taskData.title,
      description: taskData.description,
      dueDate: taskData.dueDate,
      priority: taskData.priority,
    });
  };

  // Create column handler
  const handleCreateColumn = (columnData: { title: string; color: string }) => {
    const newColumn: Column = {
      id: `col-${Date.now()}`,
      title: columnData.title,
      color: columnData.color,
      order: columns.length,
    };

    setColumns([...columns, newColumn]);
    setIsColumnModalOpen(false);
    toast.success("Column created successfully");
  };

  // Drag and drop handlers for tasks
  const handleTaskDrop = async (e: React.DragEvent, columnId: string) => {
    await handleDrop(e, columnId, async (taskId, status) => {
      return await handleUpdateTask(taskId, { status });
    });
  };

  // Column drag and drop handlers
  const handleColumnDragStart = (e: React.DragEvent, columnId: string) => {
    e.dataTransfer.setData("text/plain", columnId);
  };

  const handleColumnDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleColumnDragEnter = (columnId: string) => {
    setDragOverColumnId(columnId);
  };

  const handleColumnDragLeave = () => {
    setDragOverColumnId(null);
  };

  const handleColumnDrop = (e: React.DragEvent, targetColumnId: string) => {
    e.preventDefault();
    const draggedColumnId = e.dataTransfer.getData("text/plain");

    if (draggedColumnId !== targetColumnId) {
      const draggedIndex = columns.findIndex(
        (col) => col.id === draggedColumnId
      );
      const targetIndex = columns.findIndex((col) => col.id === targetColumnId);

      const newColumns = [...columns];
      const [draggedColumn] = newColumns.splice(draggedIndex, 1);
      newColumns.splice(targetIndex, 0, draggedColumn);

      const reorderedColumns = newColumns.map((col, index) => ({
        ...col,
        order: index,
      }));

      setColumns(reorderedColumns);
    }
    setDragOverColumnId(null);
  };

  const handleColumnDragEnd = () => {
    setDragOverColumnId(null);
  };

  // Project management - uses team ID
  const switchProject = (projectName: string, projectTeamId: string) => {
    window.location.href = `/projects/${projectTeamId}`;
  };

  const deleteProjectByName = async (projectName: string) => {
    const project = dbProjects.find((p) => p.name === projectName);
    if (project) {
      try {
        await deleteProjectById(project.id);
        toast.success("Project deleted successfully");
        // Redirect to dashboard after deleting if this was the current project
        if (project.teamId === teamId) {
          window.location.href = "/dashboard";
        } else {
          window.location.reload();
        }
      } catch {
        toast.error("Failed to delete project");
      }
    }
  };

  return (
    <div className="h-full p-6 bg-gray-50">
      {/* Header */}
      <div className="bg-white px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/projects">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-slate-800">Tasks</h1>
          </div>
          <div className="flex items-center space-x-4">
            {projectName && (
              <div className="rounded-full border border-blue-200 bg-blue-50 text-blue-700 px-4 py-2 text-sm font-medium">
                {projectName}
              </div>
            )}
            <Button
              variant="secondary"
              className="text-sm"
              onClick={() => setIsInviteOpen(true)}
            >
              Invite
            </Button>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" title="Manage projects">
                  <Settings className="w-5 h-5" />
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-[520px]">
                <div className="px-2 py-1 text-sm font-semibold text-slate-700">
                  Collaborators
                </div>
                <div className="space-y-3 py-2">
                  {dbProjects.length === 0 ? (
                    <div className="text-sm text-gray-500 px-2">
                      No projects
                    </div>
                  ) : (
                    dbProjects.map((p) => (
                      <div
                        key={p.id}
                        className="border-t border-b border-slate-300 py-2"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-[13px] font-medium text-slate-800">
                              {p.name}
                            </div>
                            <div className="text-[11px] text-slate-500">
                              members…
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="secondary"
                              className="bg-blue-500 hover:bg-blue-600 text-white text-xs"
                              onClick={() => setIsInviteOpen(true)}
                            >
                              Invite
                            </Button>
                            <Button
                              variant="destructive"
                              className="text-xs"
                              onClick={async () => {
                                await deleteProjectByName(p.name);
                              }}
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="mt-6">
        <div
          className="grid gap-6 h-[calc(100vh-200px)]"
          style={{
            gridTemplateColumns: `repeat(${
              columns.length + 1
            }, minmax(0, 1fr))`,
          }}
        >
          {columns.map((column) => (
            <div key={column.id} className="flex flex-col">
              <div
                className={`${
                  column.color
                } text-white px-4 py-3 rounded-t-lg flex items-center justify-between ${
                  dragOverColumnId === column.id ? "ring-2 ring-white/70" : ""
                }`}
                draggable
                onDragStart={(e) => handleColumnDragStart(e, column.id)}
                onDragOver={handleColumnDragOver}
                onDragEnter={() => handleColumnDragEnter(column.id)}
                onDragLeave={handleColumnDragLeave}
                onDrop={(e) => handleColumnDrop(e, column.id)}
                onDragEnd={handleColumnDragEnd}
              >
                <div className="flex items-center space-x-2">
                  <span className="font-medium">{column.title}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    className="text-white hover:text-gray-200"
                    onClick={() => deleteColumn(column.id)}
                    title="Delete column"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div
                className={`bg-white border-l border-r border-gray-200 flex-1 p-4 space-y-4 transition-colors ${
                  dragOverColumn === column.id
                    ? "bg-blue-50 border-blue-300"
                    : ""
                }`}
                onDragOver={handleDragOver}
                onDragEnter={() => handleDragEnter(column.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleTaskDrop(e, column.id)}
              >
                {getTasksByStatus(column.id).map((task) => (
                  <Card
                    key={task.id}
                    className={`border border-gray-200 hover:shadow-md transition-all cursor-move ${
                      draggedTask?.id === task.id
                        ? "opacity-50 rotate-2 scale-105"
                        : ""
                    }`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task)}
                    onDragEnd={handleDragEnd}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <Badge
                          className={`${getPriorityColor(
                            task.priority
                          )} text-white text-xs px-2 py-1`}
                        >
                          {task.priority}
                        </Badge>
                        <div className="flex space-x-1">
                          <button
                            className="text-gray-400 hover:text-gray-600"
                            onClick={() => openEditTaskModal(task)}
                            title="Edit task"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            className="text-gray-400 hover:text-gray-600"
                            onClick={() => setViewTask(task)}
                            title="View task"
                          >
                            <Calendar className="w-4 h-4" />
                          </button>
                          <button
                            className="text-gray-400 hover:text-red-600"
                            onClick={() => handleDeleteTask(task.id)}
                            title="Delete task"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <h4 className="font-medium text-gray-900 mb-2">
                        {task.title}
                      </h4>
                      {task.description && (
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {task.description}
                        </p>
                      )}
                      {task.dueDate && (
                        <div className="flex items-center text-xs text-gray-500">
                          <Calendar className="w-3 h-3 mr-1" />
                          {new Date(task.dueDate).toLocaleDateString()}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}

                {/* Add Task Button for each column */}
                <button
                  onClick={() => openCreateTaskModal(column.id)}
                  className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:text-gray-700 hover:border-gray-400 transition-colors flex items-center justify-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span className="text-sm">Add Task</span>
                </button>
              </div>
            </div>
          ))}

          {/* Add Column Button */}
          <div className="flex flex-col">
            <div className="bg-gray-300 text-gray-700 px-4 py-3 rounded-t-lg flex items-center justify-center">
              <button
                onClick={() => setIsColumnModalOpen(true)}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
              >
                <Plus className="w-4 h-4" />
                <span>Add Column</span>
              </button>
            </div>
            <div className="bg-white border-l border-r border-gray-200 flex-1 p-4"></div>
          </div>
        </div>
      </div>

      {/* Task View Modal */}
      <Dialog open={!!viewTask} onOpenChange={() => setViewTask(null)}>
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-slate-800">
              {viewTask?.title}
            </DialogTitle>
          </DialogHeader>
          {viewTask && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge
                  className={`${getPriorityColor(
                    viewTask.priority
                  )} text-white text-xs px-2 py-1`}
                >
                  {viewTask.priority}
                </Badge>
                <div className="text-xs text-gray-500 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>
                    {viewTask.dueDate
                      ? new Date(viewTask.dueDate).toLocaleString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "No due date"}
                  </span>
                </div>
              </div>
              <div className="text-sm text-gray-600 whitespace-pre-wrap break-words">
                {cleanDescription(viewTask.description) || "Description"}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Minimal Invite Dialog */}
      <InviteTeamModal
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
      />

      {/* Modal Components */}
      <CreateTaskModal
        isOpen={isTaskModalOpen}
        onClose={closeCreateTaskModal}
        onCreateTask={handleCreateTask}
      />

      <EditTaskModal
        isOpen={isEditModalOpen}
        onClose={closeEditTaskModal}
        onUpdateTask={handleUpdateTaskFromModal}
      />

      <CreateColumnModal
        isOpen={isColumnModalOpen}
        onClose={() => setIsColumnModalOpen(false)}
        onCreateColumn={handleCreateColumn}
        colorOptions={colorOptions}
      />
    </div>
  );
}
