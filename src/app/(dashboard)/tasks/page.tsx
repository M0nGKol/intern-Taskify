"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Calendar, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TasksPageSkeleton } from "@/components/TasksPageSkeleton";
import { Task } from "@/constants/data";
import { CreateTaskModal } from "@/components/modals/create-task-modal";
import { EditTaskModal } from "@/components/modals/edit-task-modal";
import { DeleteTaskModal } from "@/components/modals/delete-task-modal";
import { toast } from "sonner";
import {
  getAllTasks,
  createTask as createTaskAction,
  updateTask,
  deleteTask,
} from "@/actions/task-action";
import { getAllProjects } from "@/actions/project-action";

export type ViewType = "day" | "week" | "month" | "year";
export type PriorityFilter = "all" | "high" | "medium" | "low";

export default function TasksPage() {
  // Data state
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<
    { id: string; name: string; teamId: string }[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  // Calendar state
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewType, setViewType] = useState<ViewType>("week");
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>("all");
  const [projectFilter, setProjectFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Time slots for week view (24h)
  const timeSlots = Array.from({ length: 24 }, (_, i) => i);

  // Get current team ID from localStorage
  const getCurrentTeamId = useCallback(() => {
    try {
      const stored = localStorage.getItem("taskify-dashboard");
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.teamId || "";
      }
    } catch {}
    return "";
  }, []);

  // Fetch data
  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);

      // Fetch all tasks and projects in parallel
      const [allTasks, allProjects] = await Promise.all([
        getAllTasks(),
        getAllProjects(),
      ]);

      setTasks(allTasks as Task[]);
      setProjects(allProjects);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to fetch data");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load data on mount
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Extract priority from description (legacy support)
  const extractPriorityFromDescription = (
    description?: string | null
  ): Task["priority"] => {
    if (!description) return "medium";
    const match = description.match(
      /Priority:\s*(high|medium|low|hard|urgent|normal|minor)/i
    );
    const raw = match?.[1]?.toLowerCase();
    switch (raw) {
      case "high":
      case "hard":
      case "urgent":
        return "high";
      case "low":
      case "minor":
        return "low";
      case "medium":
      case "normal":
        return "medium";
      default:
        return "medium";
    }
  };

  // Get unique project names for filtering
  const projectNames = useMemo(() => {
    const projectSet = new Set<string>();
    projects.forEach((project) => projectSet.add(project.name));
    tasks.forEach((task) => {
      if (task.projectName) {
        projectSet.add(task.projectName);
      }
    });
    return Array.from(projectSet);
  }, [tasks, projects]);

  // Filter tasks based on current filters
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const taskPriority =
        task.priority || extractPriorityFromDescription(task.description);
      const matchesPriority =
        priorityFilter === "all" || taskPriority === priorityFilter;
      const matchesProject =
        projectFilter === "all" || task.projectName === projectFilter;
      const matchesSearch =
        searchQuery === "" ||
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (task.description &&
          task.description.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesPriority && matchesProject && matchesSearch;
    });
  }, [tasks, priorityFilter, projectFilter, searchQuery]);

  // Calendar navigation
  const goToToday = () => setCurrentDate(new Date());

  const goToPrevious = () => {
    const newDate = new Date(currentDate);
    if (viewType === "week") {
      newDate.setDate(newDate.getDate() - 7);
    } else if (viewType === "month") {
      newDate.setMonth(newDate.getMonth() - 1);
    } else if (viewType === "day") {
      newDate.setDate(newDate.getDate() - 1);
    }
    setCurrentDate(newDate);
  };

  const goToNext = () => {
    const newDate = new Date(currentDate);
    if (viewType === "week") {
      newDate.setDate(newDate.getDate() + 7);
    } else if (viewType === "month") {
      newDate.setMonth(newDate.getMonth() + 1);
    } else if (viewType === "day") {
      newDate.setDate(newDate.getDate() + 1);
    }
    setCurrentDate(newDate);
  };

  // Get week dates for week view
  const getWeekDates = () => {
    const startOfWeek = new Date(currentDate);
    const day = startOfWeek.getDay();
    startOfWeek.setDate(startOfWeek.getDate() - day);

    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(date.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  // Get tasks for a specific date
  const getTasksForDate = (date: Date) => {
    const tasksForDate = filteredTasks.filter((task) => {
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate);
      return taskDate.toDateString() === date.toDateString();
    });

    // Sort tasks by time
    return tasksForDate.sort((a, b) => {
      if (!a.dueDate || !b.dueDate) return 0;
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });
  };

  // Get task summary statistics
  const taskSummary = useMemo(() => {
    const total = filteredTasks.length;
    const completed = filteredTasks.filter(
      (task) => task.status === "completed"
    ).length;
    const highPriority = filteredTasks.filter((task) => {
      const priority =
        task.priority || extractPriorityFromDescription(task.description);
      return priority === "high";
    }).length;
    const mediumPriority = filteredTasks.filter((task) => {
      const priority =
        task.priority || extractPriorityFromDescription(task.description);
      return priority === "medium";
    }).length;
    const lowPriority = filteredTasks.filter((task) => {
      const priority =
        task.priority || extractPriorityFromDescription(task.description);
      return priority === "low";
    }).length;

    return { total, completed, highPriority, mediumPriority, lowPriority };
  }, [filteredTasks]);

  // Handle task actions
  const handleCreateTask = async (taskData: {
    title: string;
    description?: string;
    dueDate?: Date;
    priority: "high" | "medium" | "low";
  }) => {
    try {
      const teamId = getCurrentTeamId();
      if (!teamId) {
        toast.error("No project selected");
        return;
      }

      await createTaskAction({
        ...taskData,
        teamId,
        status: "opens",
        projectName: projectFilter !== "all" ? projectFilter : undefined,
      });

      toast.success("Task created successfully");
      await fetchData(); // Refresh data
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error("Error creating task:", error);
      toast.error("Failed to create task");
    }
  };

  const handleEditTask = async (taskData: {
    title: string;
    description?: string;
    dueDate?: Date;
    priority: "high" | "medium" | "low";
  }) => {
    if (!selectedTask) return;

    try {
      await updateTask(selectedTask.id, {
        ...taskData,
        status: selectedTask.status,
      });

      toast.success("Task updated successfully");
      await fetchData(); // Refresh data
      setIsEditModalOpen(false);
      setSelectedTask(null);
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Failed to update task");
    }
  };

  const handleDeleteTask = async () => {
    if (!selectedTask) return;

    try {
      await deleteTask(selectedTask.id);
      toast.success("Task deleted successfully");
      await fetchData(); // Refresh data
      setIsDeleteModalOpen(false);
      setSelectedTask(null);
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Failed to delete task");
    }
  };

  if (isLoading) {
    return <TasksPageSkeleton />;
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
            {projectNames.map((project) => (
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
                onClick={() =>
                  setPriorityFilter(
                    priority.value as "all" | "high" | "medium" | "low"
                  )
                }
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
                        {getTasksForDate(date).map((task) => {
                          const taskHour = task.dueDate
                            ? new Date(task.dueDate).getHours()
                            : 0;
                          if (taskHour === hour) {
                            const priority =
                              task.priority ||
                              extractPriorityFromDescription(task.description);
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
                                      "bg-red-500": priority === "high",
                                      "bg-yellow-500": priority === "medium",
                                      "bg-green-500": priority === "low",
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
                {getTasksForDate(currentDate).map((task) => {
                  const priority =
                    task.priority ||
                    extractPriorityFromDescription(task.description);
                  return (
                    <Card
                      key={task.id}
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => {
                        setSelectedTask(task);
                        setIsEditModalOpen(true);
                      }}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div
                              className={cn("w-3 h-3 rounded-full", {
                                "bg-red-500": priority === "high",
                                "bg-yellow-500": priority === "medium",
                                "bg-green-500": priority === "low",
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
                              {task.projectName && (
                                <p className="text-xs text-blue-600 mt-1">
                                  {task.projectName}
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
                  );
                })}
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
            task={{
              ...selectedTask,
              description: selectedTask.description ?? undefined,
              dueDate: selectedTask.dueDate ?? undefined,
              projectName: selectedTask.projectName ?? undefined,
              userId: selectedTask.userId ?? undefined,
            }}
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
