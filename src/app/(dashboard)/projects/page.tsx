"use client";

import type React from "react";

import { useState } from "react";
import { Search, Settings, Plus, Calendar, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CreateTaskModal } from "@/components/modals/create-task-modal";
import { EditTaskModal } from "@/components/modals/edit-task-modal";

interface Task {
  id: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  dueDate: string;
  status: "opens" | "in-progress" | "evaluation" | "done";
}

interface Project {
  id: string;
  name: string;
  tasks: Task[];
}

const mockProjects: Project[] = [
  {
    id: "1",
    name: "Website Redesign",
    tasks: [
      {
        id: "1",
        title: "Sint ex excepteur proident adipisicing",
        description: "adipisicing occaecat pariatur.",
        priority: "high",
        dueDate: "Mar 14",
        status: "opens",
      },
      {
        id: "2",
        title: "Sint ex excepteur proident adipisicing",
        description: "adipisicing occaecat pariatur.",
        priority: "medium",
        dueDate: "Mar 14",
        status: "opens",
      },
      {
        id: "3",
        title: "Sint ex excepteur proident adipisicing",
        description: "adipisicing occaecat pariatur.",
        priority: "low",
        dueDate: "Mar 14",
        status: "opens",
      },
    ],
  },
  {
    id: "2",
    name: "Mobile App",
    tasks: [
      {
        id: "4",
        title: "Sint ex excepteur proident adipisicing",
        description: "adipisicing occaecat pariatur.",
        priority: "medium",
        dueDate: "Mar 14",
        status: "in-progress",
      },
    ],
  },
];

export default function ProjectsPage() {
  const [currentProject, setCurrentProject] = useState<Project>(
    mockProjects[0]
  );
  const [showProjectSwitcher, setShowProjectSwitcher] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<Task["status"]>("opens");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);

  const columns = [
    { id: "opens", title: "Opens", icon: "○", color: "bg-slate-600" },
    {
      id: "in-progress",
      title: "In Progress",
      icon: "◐",
      color: "bg-blue-600",
    },
    { id: "evaluation", title: "Evaluation", icon: "◑", color: "bg-teal-600" },
    { id: "done", title: "Done", icon: "✓", color: "bg-green-600" },
  ];

  const getTasksByStatus = (status: string) => {
    return currentProject.tasks.filter((task) => task.status === status);
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

  const handleCreateTask = (status: Task["status"]) => {
    setSelectedStatus(status);
    setIsTaskModalOpen(true);
  };
  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setIsEditModalOpen(true);
  };

  const handleDragStart = (e: React.DragEvent, task: Task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragEnd = () => {
    setDraggedTask(null);
    setDragOverColumn(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDragEnter = (columnId: string) => {
    setDragOverColumn(columnId);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    // Only clear drag over if we're leaving the column entirely
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;

    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setDragOverColumn(null);
    }
  };

  const handleDrop = (e: React.DragEvent, targetStatus: Task["status"]) => {
    e.preventDefault();

    if (!draggedTask || draggedTask.status === targetStatus) {
      setDragOverColumn(null);
      return;
    }

    // Update the task status
    const updatedTasks = currentProject.tasks.map((task) =>
      task.id === draggedTask.id ? { ...task, status: targetStatus } : task
    );

    const updatedProject = { ...currentProject, tasks: updatedTasks };
    setCurrentProject(updatedProject);
    setDragOverColumn(null);
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="bg-white px-8 py-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-slate-800">Projects</h1>
          <div className="flex items-center space-x-4">
            <Popover
              open={showProjectSwitcher}
              onOpenChange={setShowProjectSwitcher}
            >
              <PopoverTrigger asChild>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="Search"
                    className="pl-10 w-64"
                    onFocus={() => setShowProjectSwitcher(true)}
                  />
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-0" align="end">
                <div className="p-4">
                  <h3 className="font-semibold text-sm text-gray-600 mb-3">
                    Current Project
                  </h3>
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 mb-4">
                    <div className="font-medium text-slate-800">
                      {currentProject.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      {currentProject.tasks.length} tasks
                    </div>
                  </div>

                  <h3 className="font-semibold text-sm text-gray-600 mb-3">
                    Switch Project
                  </h3>
                  <div className="space-y-2">
                    {mockProjects.map((project) => (
                      <button
                        key={project.id}
                        onClick={() => {
                          setCurrentProject(project);
                          setShowProjectSwitcher(false);
                        }}
                        className={`w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors ${
                          project.id === currentProject.id
                            ? "bg-blue-50 border border-blue-200"
                            : "border border-gray-200"
                        }`}
                      >
                        <div className="font-medium text-slate-800">
                          {project.name}
                        </div>
                        <div className="text-sm text-gray-600">
                          {project.tasks.length} tasks
                        </div>
                      </button>
                    ))}
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
        <div className="grid grid-cols-4 gap-6 h-full">
          {columns.map((column) => (
            <div key={column.id} className="flex flex-col">
              <div
                className={`${column.color} text-white px-4 py-3 rounded-t-lg flex items-center space-x-2`}
              >
                <span>{column.icon}</span>
                <span className="font-medium">{column.title}</span>
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
                onDrop={(e) => handleDrop(e, column.id as Task["status"])}
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
                        <button
                          className="text-gray-400 hover:text-gray-600"
                          onClick={() => handleEditTask(task)}
                        >
                          <Edit />
                        </button>
                      </div>
                      <h3 className="font-medium text-slate-800 mb-2 leading-tight">
                        {task.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3">
                        {task.description}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>{task.dueDate}</span>
                        </div>
                        <button className="text-gray-400 hover:text-gray-600"></button>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                <Button
                  onClick={() => handleCreateTask(column.id as Task["status"])}
                  className="w-full bg-blue-400 hover:bg-blue-500 text-white py-3 rounded-lg flex items-center justify-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>New Tasks</span>
                </Button>
              </div>

              <div className="bg-white border border-gray-200 rounded-b-lg h-4"></div>
            </div>
          ))}
        </div>
      </div>

      <Button
        onClick={() => setIsTaskModalOpen(true)}
        className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-slate-800 hover:bg-slate-700 text-white shadow-lg"
        size="icon"
      >
        <Plus className="w-6 h-6" />
      </Button>

      <CreateTaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
      />
      <EditTaskModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedTask(null);
        }}
        task={selectedTask ?? undefined}
      />
    </div>
  );
}
