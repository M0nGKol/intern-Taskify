"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock } from "lucide-react";
import { getTasksByTeam } from "@/actions/task-action";
import { getAllProjects } from "@/actions/project-action";
import {
  getTaskCountsForAllProjects,
  ProjectTaskCounts,
} from "@/actions/task-action";
import { Task, Project } from "@/db/schema";
import { toast } from "sonner";
import { HomePageSkeleton } from "@/components/HomePageSkeleton";
import { CreateProjectModal } from "../modals/create-project-modal";
import { JoinTeamModal } from "../modals/join-team-modal";

interface HomePageProps {
  projectName: string;
  teamId: string;
}

export default function HomePage({ teamId: currentTeamId }: HomePageProps) {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectTaskCounts, setProjectTaskCounts] = useState<
    Record<string, ProjectTaskCounts>
  >({});
  const [isLoading, setIsLoading] = useState(true);
  const [isProjectSwitching, setIsProjectSwitching] = useState(false);
  const [monthDate] = useState<Date>(new Date());
  const [showAllProjects, setShowAllProjects] = useState(false);

  const handleProjectCreated = (name: string, teamId: string) => {
    toast.success("Project created successfully!");
    router.push(`/dashboard?project=${teamId}`);
    router.refresh();
  };

  const handleProjectJoined = (name: string, teamId: string) => {
    toast.success(`Successfully joined project: ${name}`);
    router.push(`/dashboard?project=${teamId}`);
    router.refresh();
  };

  const switchToProject = async (project: Project) => {
    if (project.teamId === currentTeamId) return;

    try {
      setIsProjectSwitching(true);

      // Navigate to the new project
      router.push(`/dashboard?project=${project.teamId}`);
    } catch (error) {
      console.error("Error switching projects:", error);
      toast.error("Failed to switch project");
      setIsProjectSwitching(false);
    }
  };

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

        // Fetch task counts for all projects
        if (allProjects.length > 0) {
          const projectsData = allProjects.map((p) => ({
            teamId: p.teamId,
            name: p.name,
          }));
          const taskCounts = await getTaskCountsForAllProjects(projectsData);
          setProjectTaskCounts(taskCounts);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load data");
      } finally {
        setIsLoading(false);
        setIsProjectSwitching(false);
      }
    };

    fetchData();
  }, [currentTeamId]);

  if (isLoading || isProjectSwitching) {
    return <HomePageSkeleton />;
  }

  // Helper functions
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

  const formatDate = (date?: Date | null) => {
    if (!date) return "No due date";
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const upcomingTasks = tasks
    .filter((task) => task.dueDate && new Date(task.dueDate) > new Date())
    .sort(
      (a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime()
    )
    .slice(0, 5);

  const recentProjectsToShow = (
    showAllProjects ? projects : projects.slice(0, 5)
  ).sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  const renderTaskCounts = (teamId: string) => {
    const counts = projectTaskCounts[teamId];
    if (!counts) return null;

    return (
      <div className="flex gap-1 mt-2 flex-wrap">
        <Badge variant="outline" className="text-xs px-2 py-0.5 bg-gray-100">
          Total: {counts.totalTasks}
        </Badge>
        <Badge
          variant="outline"
          className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700"
        >
          In Progress: {counts.inProgressTasks}
        </Badge>
        <Badge
          variant="outline"
          className="text-xs px-2 py-0.5 bg-green-100 text-green-700"
        >
          Done: {counts.doneTasks}
        </Badge>
      </div>
    );
  };

  return (
    <div className="px-4 md:px-8">
      {/* Top Right Modals */}
      <div className="flex justify-end items-center space-x-4 mb-6 pt-4">
        <CreateProjectModal onProjectCreated={handleProjectCreated} />
        <JoinTeamModal onProjectJoined={handleProjectJoined} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 lg:grid-rows-[repeat(2,1fr)] gap-6 p-4 h-screen">
        {/* Recent Projects Section */}
        <Card className="border-2 border-slate-300 flex flex-col">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-semibold text-slate-700">
                Projects
              </CardTitle>
            </div>
          </CardHeader>

          <CardContent className="flex-1 space-y-4 overflow-y-auto">
            {projects.length > 0 ? (
              <div className="space-y-3">
                {recentProjectsToShow.map((project) => (
                  <div
                    key={project.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                      project.teamId === currentTeamId
                        ? "bg-blue-50 border-blue-200 ring-2 ring-blue-100"
                        : "border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                    }`}
                    onClick={() => switchToProject(project)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-slate-800 truncate">
                          {project.name}
                        </h4>
                        {project.teamId === currentTeamId && (
                          <Badge className="bg-blue-500 text-white text-xs px-2 py-1">
                            Current
                          </Badge>
                        )}
                      </div>
                      <div className="text-[11px] text-gray-500 ml-2 whitespace-nowrap">
                        {new Date(project.updatedAt).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </div>
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      Team: {project.teamId}
                    </div>
                    {renderTaskCounts(project.teamId)}
                  </div>
                ))}

                {projects.length > 5 && (
                  <div className="pt-1">
                    <Button
                      variant="ghost"
                      className="w-full text-blue-600 hover:underline"
                      onClick={() => setShowAllProjects((v) => !v)}
                    >
                      {showAllProjects ? "See less" : "See more"}
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center text-slate-400 py-8">
                <p>No projects yet</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Work Section */}
        <Card className="border-2 border-slate-300 lg:row-span-2 flex flex-col">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-slate-700">
              Upcoming Work ({upcomingTasks.length} tasks)
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto">
            {upcomingTasks.length > 0 ? (
              <div className="space-y-3">
                {upcomingTasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <Badge
                        className={`${getPriorityColor(
                          task.priority
                        )} text-white text-xs px-2 py-1`}
                      >
                        {task.priority}
                      </Badge>
                      <span className="text-xs text-gray-400">
                        {task.projectName && `${task.projectName}`}
                      </span>
                    </div>
                    <h4 className="font-medium text-slate-800 mb-1 line-clamp-2">
                      {task.title}
                    </h4>
                    <p className="text-sm text-gray-600 mb-2 break-words overflow-hidden line-clamp-2">
                      {cleanDescription(task.description)}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        <span>{formatDate(task.dueDate)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-slate-400">
                  <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No upcoming work scheduled</p>
                  <p className="text-xs mt-1">
                    Create tasks with due dates to see them here
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Calendar Section */}
        <Card className="border-2 border-slate-300 flex flex-col">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-slate-700">
              Calendar
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-medium text-slate-700">
                {monthDate.toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </div>
            </div>

            {/* Calendar grid would go here */}
            <div className="text-center text-slate-400 py-8">
              <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Calendar view coming soon</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
