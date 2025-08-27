"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Calendar, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { getTasksByTeam } from "@/actions/task-action";
import { getAllProjects } from "@/actions/project-action";
import { CreateProjectModal } from "../modals/create-project-modal";
import { JoinTeamModal } from "../modals/join-team-modal";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

interface Project {
  id: string;
  name: string;
  teamId: string;
  description?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface Task {
  id: string;
  title: string;
  description?: string | null;
  dueDate?: Date | null;
  teamId: string;
  projectName?: string | null;
  userId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// Fix the interface - remove unused props
interface HomePageProps {
  projectName: string;
  teamId: string;
}

export default function HomePage({
  projectName,
  teamId: currentTeamId,
}: HomePageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [monthDate] = useState<Date>(new Date());
  const [showAllProjects, setShowAllProjects] = useState(false);

  // Get the currently selected project from URL parameters
  const currentProjectFromUrl = searchParams.get("project");

  // Fetch data when component mounts or teamId changes
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [projectTasks, allProjects] = await Promise.all([
          getTasksByTeam(currentTeamId),
          getAllProjects(),
        ]);
        setTasks(projectTasks);
        setProjects(allProjects);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currentTeamId]);

  // Handle project creation - Updated to use URL navigation
  const handleProjectCreated = (name: string, teamId: string) => {
    // Update URL to switch to the new project, which will trigger HomeHeader update
    router.push(`/dashboard?project=${teamId}`);
    router.refresh(); // Force refresh to ensure server component re-renders
    toast.success("Project created successfully!");
  };

  // Handle project join - Updated to use URL navigation
  const handleProjectJoined = (name: string, teamId: string) => {
    // Update URL to switch to the joined project, which will trigger HomeHeader update
    router.push(`/dashboard?project=${teamId}`);
    router.refresh(); // Force refresh to ensure server component re-renders
    toast.success(`Successfully joined project: ${name}`);
  };

  // Handle project switch - Updated to use URL navigation with refresh
  const handleProjectSwitch = (name: string, teamId: string) => {
    // Update URL to switch project, which will trigger HomeHeader update
    router.push(`/dashboard?project=${teamId}`);
    router.refresh(); // Force refresh to ensure server component re-renders
  };

  // Generate calendar data from tasks
  const { countsByDate, maxCount } = useMemo(() => {
    const map = new Map<string, number>();
    let localMax = 0;

    const startOfMonth = new Date(
      monthDate.getFullYear(),
      monthDate.getMonth(),
      1
    );
    const endOfMonth = new Date(
      monthDate.getFullYear(),
      monthDate.getMonth() + 1,
      0
    );

    tasks.forEach((task) => {
      if (task.dueDate) {
        const taskDate = new Date(task.dueDate);
        if (taskDate >= startOfMonth && taskDate <= endOfMonth) {
          const dateKey = taskDate.toISOString().slice(0, 10);
          const currentCount = map.get(dateKey) || 0;
          const newCount = currentCount + 1;
          map.set(dateKey, newCount);
          if (newCount > localMax) localMax = newCount;
        }
      }
    });

    return { countsByDate: map, maxCount: localMax };
  }, [tasks, monthDate]);

  // Process upcoming tasks
  const upcomingTasks = useMemo(() => {
    return tasks
      .filter((task) => task.dueDate && new Date(task.dueDate) > new Date())
      .sort(
        (a, b) =>
          new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime()
      )
      .slice(0, 5);
  }, [tasks]);

  // Helper functions (same as before)
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

  const cleanDescription = (description?: string | null): string => {
    if (!description) return "No description";
    const stripped = description
      .split(/\r?\n/)
      .filter((line) => !/^\s*(Status:|Priority:)\s*/i.test(line))
      .join("\n")
      .trim();
    return stripped || "No description";
  };

  const extractPriorityFromDescription = (
    description?: string | null
  ): "high" | "medium" | "low" => {
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
      default:
        return "medium";
    }
  };

  const formatDate = (date?: Date | null) => {
    if (!date) return "No due date";
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const getCellClass = (count: number) => {
    if (!count || count <= 0) return "bg-gray-100";
    const ratio = count / Math.max(1, maxCount);
    if (ratio <= 0.25) return "bg-blue-100";
    if (ratio <= 0.5) return "bg-blue-200";
    if (ratio <= 0.75) return "bg-blue-400";
    return "bg-blue-600";
  };

  const getTextClass = (count: number) => {
    const ratio = count / Math.max(1, maxCount);
    return ratio > 0.5 ? "text-white" : "text-gray-700";
  };

  // Calendar helpers
  const startOfMonth = new Date(
    monthDate.getFullYear(),
    monthDate.getMonth(),
    1
  );
  const endOfMonth = new Date(
    monthDate.getFullYear(),
    monthDate.getMonth() + 1,
    0
  );
  const startDay = startOfMonth.getDay();
  const daysInMonth = endOfMonth.getDate();
  const projectsToShow = showAllProjects ? projects : projects.slice(0, 5);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading {projectName}...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 md:px-8">
      {/* Header - Conditional based on project state */}
      <div className="flex items-center justify-end py-4 mb-6 gap-4">
        <CreateProjectModal onProjectCreated={handleProjectCreated} />
        <JoinTeamModal onProjectJoined={handleProjectJoined} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 lg:grid-rows-[repeat(2,1fr)] gap-6 p-4 h-screen">
        {/* Switch Project Section */}
        <Card className="border-2 border-slate-300 flex flex-col">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold text-slate-700">
              Switch Project
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 space-y-4 overflow-y-auto">
            {projects.length > 0 ? (
              <div className="space-y-3">
                {projectsToShow.map((project) => (
                  <div
                    key={project.id}
                    className={`p-3 border rounded-lg hover:bg-gray-50 cursor-pointer ${
                      project.teamId === currentProjectFromUrl
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200"
                    }`}
                    onClick={() =>
                      handleProjectSwitch(project.name, project.teamId)
                    }
                  >
                    <h4 className="font-medium text-slate-800 truncate">
                      {project.name}
                    </h4>
                    <div className="text-xs text-slate-500 mt-1">
                      Team: {project.teamId}
                    </div>
                    {project.description && (
                      <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                        {project.description}
                      </p>
                    )}
                  </div>
                ))}
                {projects.length > 5 && (
                  <Button
                    variant="ghost"
                    className="w-full text-blue-600 hover:underline"
                    onClick={() => setShowAllProjects((v) => !v)}
                  >
                    {showAllProjects
                      ? "See less"
                      : `See ${projects.length - 5} more`}
                  </Button>
                )}
              </div>
            ) : (
              <div className="text-center text-slate-400 py-8">
                <p>No projects available</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Work */}
        <Card className="border-2 border-slate-300 lg:row-span-2 flex flex-col">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-slate-700">
              Upcoming Work ({upcomingTasks.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto">
            {upcomingTasks.length > 0 ? (
              <div className="space-y-3">
                {upcomingTasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-3 border border-gray-200 rounded-lg"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <Badge
                        className={`${getPriorityColor(
                          extractPriorityFromDescription(task.description)
                        )} text-white text-xs px-2 py-1`}
                      >
                        {extractPriorityFromDescription(task.description)}
                      </Badge>
                    </div>
                    <h4 className="font-medium text-slate-800 mb-1">
                      {task.title}
                    </h4>
                    <p className="text-sm text-gray-600 mb-2 break-words overflow-hidden">
                      {cleanDescription(task.description)}
                    </p>
                    <div className="flex items-center text-xs text-gray-500">
                      <Calendar className="w-3 h-3 mr-1" />
                      <span>{formatDate(task.dueDate)}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-slate-400">
                  <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No upcoming work scheduled</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Calendar */}
        <Card className="border-2 border-slate-300 flex flex-col">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-slate-700">
              Calendar -{" "}
              {monthDate.toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="grid grid-cols-7 gap-1 text-[10px] text-center text-slate-500 mb-1">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                <div key={d}>{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: startDay }).map((_, idx) => (
                <div key={`blank-${idx}`} className="h-7 w-7" />
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const date = new Date(
                  monthDate.getFullYear(),
                  monthDate.getMonth(),
                  day
                );
                const key = date.toISOString().slice(0, 10);
                const count = countsByDate.get(key) || 0;
                return (
                  <div
                    key={key}
                    title={`${count} task${count === 1 ? "" : "s"}`}
                    className={`h-7 w-7 rounded flex items-center justify-center text-[10px] ${getCellClass(
                      count
                    )} ${getTextClass(count)}`}
                  >
                    {day}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      {/* {activeModal === "createProject" && (
        <CreateProjectModal
          isOpen={true}
          onClose={closeModal}
          onProjectCreated={handleProjectCreated}
        />
      )}
      {activeModal === "joinTeam" && (
        <JoinTeamModal
          isOpen={true}
          onClose={closeModal}
          onProjectJoined={handleProjectJoined}
        />
      )} */}
    </div>
  );
}
