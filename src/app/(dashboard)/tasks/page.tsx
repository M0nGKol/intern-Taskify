"use client";

import React, { useState } from "react";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useTaskManagement } from "@/lib/hooks/useTaskManagement";
import { useCalendar } from "@/lib/hooks/useCalendar";
import { CreateTaskModal } from "@/components/modals/create-task-modal";
import { EditTaskModal } from "@/components/modals/edit-task-modal";
import { DeleteTaskModal } from "@/components/modals/delete-task-modal";
import { cn } from "@/lib/utils";

export default function TasksPage() {
  const {
    tasks,
    isLoading,
    createTask,
    updateTaskById,
    deleteTaskById,
    getPriorityColor,
  } = useTaskManagement();

  const {
    currentDate,
    viewType,
    priorityFilter,
    projectFilter,
    searchQuery,
    projects,
    filteredTasks,
    taskSummary,
    setViewType,
    setPriorityFilter,
    setProjectFilter,
    setSearchQuery,
    goToToday,
    goToPrevious,
    goToNext,
    getWeekDates,
    getTasksForDate,
  } = useCalendar(tasks);

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);

  // Time slots for week view (24h)
  const timeSlots = Array.from({ length: 24 }, (_, i) => i); // 00 → 23

  // Handle task actions
  const handleCreateTask = async (taskData: {
    title: string;
    description?: string;
    dueDate?: Date;
    priority: "high" | "medium" | "low";
  }) => {
    await createTask(taskData);
    setIsCreateModalOpen(false);
  };

  const handleEditTask = async (taskData: {
    title: string;
    description?: string;
    dueDate?: Date;
    priority: "high" | "medium" | "low";
  }) => {
    if (selectedTask) {
      await updateTaskById(selectedTask.id, taskData, selectedTask.status);
      setIsEditModalOpen(false);
      setSelectedTask(null);
    }
  };

  const handleDeleteTask = async () => {
    if (selectedTask) {
      await deleteTaskById(selectedTask.id);
      setIsDeleteModalOpen(false);
      setSelectedTask(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar - Summary */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Summary</h2>

          {/* Task Statistics */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Tasks</span>
              <Badge variant="secondary">{taskSummary.total}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Completed</span>
              <Badge variant="secondary">{taskSummary.completed}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">High Priority</span>
              <Badge className="bg-red-100 text-red-800">
                {taskSummary.highPriority}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Medium Priority</span>
              <Badge className="bg-yellow-100 text-yellow-800">
                {taskSummary.mediumPriority}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Low Priority</span>
              <Badge className="bg-green-100 text-green-800">
                {taskSummary.lowPriority}
              </Badge>
            </div>
          </div>
        </div>

        {/* Project Filter */}
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Projects</h3>
          <div className="space-y-2">
            <div
              className={cn(
                "px-3 py-2 rounded-md cursor-pointer text-sm transition-colors",
                projectFilter === "all"
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-600 hover:bg-gray-100"
              )}
              onClick={() => setProjectFilter("all")}
            >
              All Projects
            </div>
            {projects.map((project) => (
              <div
                key={project}
                className={cn(
                  "px-3 py-2 rounded-md cursor-pointer text-sm transition-colors",
                  projectFilter === project
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:bg-gray-100"
                )}
                onClick={() => setProjectFilter(project)}
              >
                {project}
              </div>
            ))}
          </div>
        </div>

        {/* Priority Filter */}
        <div className="p-6">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Priority</h3>
          <div className="space-y-2">
            {[
              {
                value: "all",
                label: "All Priorities",
                color: "bg-gray-100 text-gray-700",
              },
              {
                value: "high",
                label: "High Priority",
                color: "bg-red-100 text-red-700",
              },
              {
                value: "medium",
                label: "Medium Priority",
                color: "bg-yellow-100 text-yellow-700",
              },
              {
                value: "low",
                label: "Low Priority",
                color: "bg-green-100 text-green-700",
              },
            ].map((priority) => (
              <div
                key={priority.value}
                className={cn(
                  "px-3 py-2 rounded-md cursor-pointer text-sm transition-colors",
                  priorityFilter === priority.value
                    ? priority.color
                    : "text-gray-600 hover:bg-gray-100"
                )}
                onClick={() => setPriorityFilter(priority.value as any)}
              >
                {priority.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Calendar Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">Calendar</h1>

              {/* Navigation Controls */}
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={goToPrevious}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={goToToday}>
                  Today
                </Button>
                <Button variant="outline" size="sm" onClick={goToNext}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* View Type Selector */}
            <div className="flex items-center space-x-2">
              {(["day", "week", "month", "year"] as const).map((view) => (
                <Button
                  key={view}
                  variant={viewType === view ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewType(view)}
                  className="capitalize"
                >
                  {view}
                </Button>
              ))}
            </div>

            {/* Search and Actions */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Button onClick={() => setIsCreateModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                New Task
              </Button>
            </div>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="flex-1 overflow-auto">
          {viewType === "week" && (
            <div className="h-full">
              {/* Time slots header */}
              <div className="grid grid-cols-8 border-b border-gray-200 bg-white">
                <div className="p-4 border-r border-gray-200"></div>
                {getWeekDates().map((date) => (
                  <div
                    key={date.toISOString()}
                    className="p-4 border-r border-gray-200 text-center"
                  >
                    <div className="text-sm font-medium text-gray-900">
                      {date.toLocaleDateString("en-US", { weekday: "short" })}
                    </div>
                    <div className="text-lg font-bold text-gray-700">
                      {date.getDate()}
                    </div>
                  </div>
                ))}
              </div>

              {/* Time slots grid */}
              <div className="grid grid-cols-8">
                {/* Time column */}
                <div className="border-r border-gray-200 bg-gray-50">
                  {timeSlots.map((hour) => (
                    <div
                      key={hour}
                      className="h-16 border-b border-gray-200 flex items-center justify-end pr-4"
                    >
                      <span className="text-xs text-gray-500 font-medium">
                        {`${String(hour).padStart(2, "0")}:00`}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Day columns */}
                {getWeekDates().map((date) => (
                  <div
                    key={date.toISOString()}
                    className="border-r border-gray-200 relative"
                  >
                    {timeSlots.map((hour) => (
                      <div
                        key={hour}
                        className="h-16 border-b border-gray-200 relative"
                      >
                        {/* Tasks for this time slot */}
                        {getTasksForDate(date).map((task, index) => {
                          const taskHour = task.dueDate
                            ? new Date(task.dueDate).getHours()
                            : 0;
                          if (taskHour === hour) {
                            return (
                              <div
                                key={task.id}
                                className="absolute left-1 right-1 top-1 bottom-1 bg-blue-100 border border-blue-300 rounded-md p-2 cursor-pointer hover:bg-blue-200 transition-colors"
                                onClick={() => {
                                  setSelectedTask(task);
                                  setIsEditModalOpen(true);
                                }}
                              >
                                <div className="text-xs font-medium text-blue-900 truncate">
                                  {task.title}
                                </div>
                                <div className="flex items-center space-x-1 mt-1">
                                  <div
                                    className={cn("w-2 h-2 rounded-full", {
                                      "bg-red-500": task.priority === "high",
                                      "bg-yellow-500":
                                        task.priority === "medium",
                                      "bg-green-500": task.priority === "low",
                                    })}
                                  />
                                  <span className="text-xs">
                                    {task.dueDate
                                      ? new Date(
                                          task.dueDate
                                        ).toLocaleTimeString("en-US", {
                                          hour: "2-digit",
                                          minute: "2-digit",
                                          hour12: false,
                                        })
                                      : ""}
                                  </span>
                                </div>
                              </div>
                            );
                          }
                          return null;
                        })}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}

          {viewType === "day" && (
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">
                {currentDate.toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </h2>
              <div className="space-y-4">
                {getTasksForDate(currentDate).map((task) => (
                  <Card
                    key={task.id}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div
                            className={cn("w-3 h-3 rounded-full", {
                              "bg-red-500": task.priority === "high",
                              "bg-yellow-500": task.priority === "medium",
                              "bg-green-500": task.priority === "low",
                            })}
                          />
                          <div>
                            <h3 className="font-medium text-gray-900">
                              {task.title}
                            </h3>
                            {task.description && (
                              <p className="text-sm text-gray-600 mt-1">
                                {task.description}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {task.dueDate && (
                            <div className="flex items-center text-sm text-gray-500">
                              <Calendar className="h-4 w-4 mr-1" />
                              {new Date(task.dueDate).toLocaleTimeString(
                                "en-US",
                                {
                                  hour: "numeric",
                                  minute: "2-digit",
                                  hour12: true,
                                }
                              )}
                            </div>
                          )}
                          <Badge variant="outline">{task.status}</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateTask={handleCreateTask}
      />

      {selectedTask && (
        <>
          <EditTaskModal
            isOpen={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false);
              setSelectedTask(null);
            }}
            task={selectedTask}
            onUpdateTask={handleEditTask}
          />
          <DeleteTaskModal
            isOpen={isDeleteModalOpen}
            onClose={() => {
              setIsDeleteModalOpen(false);
              setSelectedTask(null);
            }}
            onConfirm={handleDeleteTask}
            taskTitle={selectedTask.title}
          />
        </>
      )}
    </div>
  );
}
