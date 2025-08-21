"use client";

import React from "react";
import { Settings, Plus, Calendar, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreateTaskModal } from "@/components/modals/create-task-modal";
import { EditTaskModal } from "@/components/modals/edit-task-modal";
import { CreateColumnModal } from "@/components/modals/create-column-modal";
import { useTaskManagement } from "@/lib/hooks/useTaskManagement";
import { useColumnManagement, Column } from "@/lib/hooks/useColumnManagement";
import { useDragAndDrop } from "@/lib/hooks/useDragAndDrop";
import { useModalManagement } from "@/lib/hooks/useModalManagement";
import { usePersistentProjectState } from "@/lib/hooks/usePersistentProjectState";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function TasksPage() {
  const {
    tasks,
    isLoading,
    projectName,
    createTask,
    updateTaskById,
    deleteTaskById,
    updateTaskStatusById,
    getTasksByStatus,
    getPriorityColor,
  } = useTaskManagement();

  const {
    columns,
    isLoading: columnsLoading,
    createColumn,
    updateColumn,
    deleteColumn,
    colorOptions,
  } = useColumnManagement();

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

  const {
    isTaskModalOpen,
    isEditModalOpen,
    selectedStatus,
    selectedTask,
    openCreateTaskModal,
    closeCreateTaskModal,
    openEditTaskModal,
    closeEditTaskModal,
  } = useModalManagement();

  const [isColumnModalOpen, setIsColumnModalOpen] = React.useState(false);

  const { setProject, teamId } = usePersistentProjectState();
  const [projectQuery, setProjectQuery] = React.useState("");

  const projectOptions = React.useMemo(() => {
    const names = Array.from(
      new Set(tasks.map((t) => t.projectName).filter((n): n is string => !!n))
    );
    if (projectName && !names.includes(projectName)) names.unshift(projectName);
    return names;
  }, [tasks, projectName]);

  const filteredProjects = React.useMemo(
    () =>
      projectOptions.filter((n) =>
        n.toLowerCase().includes(projectQuery.toLowerCase())
      ),
    [projectOptions, projectQuery]
  );

  const handleCreateTask = async (taskData: {
    title: string;
    description?: string;
    dueDate?: Date;
    priority: "high" | "medium" | "low";
  }) => {
    const success = await createTask({
      ...taskData,
      status: selectedStatus,
    });
    if (success) {
      closeCreateTaskModal();
    }
  };

  const handleUpdateTask = async (taskData: {
    title: string;
    description?: string;
    dueDate?: Date;
    priority: "high" | "medium" | "low";
  }) => {
    if (!selectedTask) return;

    const success = await updateTaskById(
      selectedTask.id,
      taskData,
      selectedTask.status
    );
    if (success) {
      closeEditTaskModal();
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    await deleteTaskById(taskId);
  };

  const handleDropTask = async (e: React.DragEvent, targetStatus: string) => {
    await handleDrop(e, targetStatus, updateTaskStatusById);
  };

  const handleCreateColumn = (columnData: { title: string; color: string }) => {
    createColumn(columnData);
    setIsColumnModalOpen(false);
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="bg-white px-8 py-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-slate-800">Tasks</h1>
          <div className="flex items-center space-x-4">
            {projectName && (
              <div className="rounded-full border border-blue-200 bg-blue-50 text-blue-700 px-4 py-2 text-sm font-medium">
                {projectName}
              </div>
            )}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="text-sm">
                  Switch Project
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-72">
                <div className="space-y-2">
                  <Input
                    placeholder="Search projects..."
                    value={projectQuery}
                    onChange={(e) => setProjectQuery(e.target.value)}
                  />
                  <div className="max-h-64 overflow-y-auto space-y-1">
                    {filteredProjects.length === 0 ? (
                      <div className="text-sm text-gray-500 px-1 py-2">
                        No projects
                      </div>
                    ) : (
                      filteredProjects.map((name) => (
                        <button
                          key={name}
                          className="w-full text-left px-2 py-2 rounded hover:bg-gray-100 text-sm"
                          onClick={() => setProject(name, teamId || "")}
                        >
                          {name}
                        </button>
                      ))
                    )}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            <Button variant="ghost" size="icon">
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 p-8">
        <div
          className={`grid gap-6 h-full`}
          style={{
            gridTemplateColumns: `repeat(${
              columns.length + 1
            }, minmax(0, 1fr))`,
          }}
        >
          {columns.map((column) => (
            <div key={column.id} className="flex flex-col">
              <div
                className={`${column.color} text-white px-4 py-3 rounded-t-lg flex items-center justify-between`}
              >
                <div className="flex items-center space-x-2">
                  <span className="font-medium">{column.title}</span>
                </div>
                <div className="flex items-center space-x-2">
                  {!["opens", "in-progress", "evaluation", "done"].includes(
                    column.id
                  ) && (
                    <button
                      className="text-white hover:text-gray-200"
                      onClick={() => deleteColumn(column.id)}
                      title="Delete column"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
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
                onDrop={(e) => handleDropTask(e, column.id)}
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
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            className="text-gray-400 hover:text-red-600"
                            onClick={() => handleDeleteTask(task.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <h3 className="font-medium text-slate-800 mb-2 leading-tight">
                        {task.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3">
                        {task.description
                          ?.replace(/Status:.*Priority:.*/g, "")
                          .trim() || "No description"}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>
                            {task.dueDate
                              ? new Date(task.dueDate).toLocaleDateString(
                                  "en-US",
                                  {
                                    month: "short",
                                    day: "numeric",
                                  }
                                )
                              : "No due date"}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                <Button
                  onClick={() => {
                    openCreateTaskModal(column.id);
                  }}
                  className="w-full bg-primary text-white py-3 rounded-lg flex items-center justify-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>New Task</span>
                </Button>
              </div>

              <div className="bg-white border border-gray-200 rounded-b-lg h-4"></div>
            </div>
          ))}

          <div className="flex flex-col">
            <div className="bg-gray-100 text-gray-600 px-4 py-3 rounded-t-lg flex items-center justify-center border-2 border-dashed border-gray-300">
              <Button
                onClick={() => setIsColumnModalOpen(true)}
                variant="ghost"
                className="w-full h-full flex items-center justify-center space-x-2 hover:bg-gray-200"
              >
                <Plus className="w-4 h-4" />
                <span className="font-medium">Add Column</span>
              </Button>
            </div>
            <div className="bg-gray-100 border-l border-r border-gray-200 flex-1 p-4"></div>
            <div className="bg-gray-100 border border-gray-200 rounded-b-lg h-4"></div>
          </div>
        </div>
      </div>

      <CreateTaskModal
        isOpen={isTaskModalOpen}
        onClose={closeCreateTaskModal}
        onCreateTask={handleCreateTask}
      />
      <EditTaskModal
        isOpen={isEditModalOpen}
        onClose={closeEditTaskModal}
        task={selectedTask}
        onUpdateTask={handleUpdateTask}
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
