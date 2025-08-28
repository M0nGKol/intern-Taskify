import React from "react";
import { getAllProjectsWithRoles } from "@/actions/project-action";
import { getTaskCountsForAllProjects } from "@/actions/task-action";
import { Project } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Users, ArrowRight, BarChart3 } from "lucide-react";
import Link from "next/link";
import LeaveProjectButton from "@/components/LeaveProjectEntry";

// Define the type for projects with task counts and user role
type ProjectWithTaskCounts = Project & {
  taskCount: number;
  completedTasks: number;
  inProgressTasks: number;
  userRole: string;
};

export default async function ProjectsPage() {
  const headersList = await headers();
  let session;

  try {
    session = await auth.api.getSession({
      headers: headersList,
    });
  } catch (error) {
    console.error("Auth error:", error);
  }

  if (!session?.user) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-700">Access Denied</h2>
          <p className="text-gray-500">Please sign in to view this page.</p>
        </div>
      </div>
    );
  }

  let projects: (Project & { userRole: string })[] = [];
  let projectsWithTaskCounts: ProjectWithTaskCounts[] = [];

  try {
    projects = await getAllProjectsWithRoles();

    // Fetch real task counts for all projects
    if (projects.length > 0) {
      const projectsData = projects.map((p) => ({
        teamId: p.teamId,
        name: p.name,
      }));

      const taskCounts = await getTaskCountsForAllProjects(projectsData);

      projectsWithTaskCounts = projects.map((project) => {
        const counts = taskCounts[project.teamId] || {
          totalTasks: 0,
          inProgressTasks: 0,
          doneTasks: 0,
        };

        return {
          ...project,
          taskCount: counts.totalTasks,
          completedTasks: counts.doneTasks,
          inProgressTasks: counts.inProgressTasks,
          userRole: project.userRole,
        };
      });
    }
  } catch (error) {
    console.error("Error fetching projects:", error);
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-700">
            Error Loading Projects
          </h2>
          <p className="text-gray-500">Failed to load your projects.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-8 py-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Projects</h1>
            <p className="text-gray-600">
              Manage and view all your projects in one place. Click on any
              project to view its tasks.
            </p>
          </div>

          {/* Projects Grid */}
          {projectsWithTaskCounts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Projects Yet
              </h3>
              <p className="text-gray-600 mb-6">
                Get started by creating your first project or joining an
                existing team.
              </p>
              <Link href="/dashboard">
                <Button>Go to Dashboard</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projectsWithTaskCounts.map((project) => (
                <Card
                  key={project.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-semibold text-gray-900 truncate">
                        {project.name}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {project.userRole === "owner" ? "Owner" : "Active"}
                        </Badge>
                        {project.userRole !== "owner" && (
                          <LeaveProjectButton
                            projectId={project.id}
                            projectName={project.name}
                            userId={session?.user?.id}
                          />
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Project Stats */}
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-1 text-gray-600">
                        <Users className="w-4 h-4" />
                        <span>Team: {project.teamId.slice(0, 8)}...</span>
                      </div>
                    </div>

                    {/* Task Statistics */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <BarChart3 className="w-4 h-4 text-gray-500" />
                          <span className="text-sm font-medium">
                            Task Overview
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="bg-blue-50 rounded-lg p-2">
                          <div className="text-lg font-bold text-blue-600">
                            {project.taskCount}
                          </div>
                          <div className="text-xs text-blue-600">Total</div>
                        </div>
                        <div className="bg-yellow-50 rounded-lg p-2">
                          <div className="text-lg font-bold text-yellow-600">
                            {project.inProgressTasks}
                          </div>
                          <div className="text-xs text-yellow-600">
                            In Progress
                          </div>
                        </div>
                        <div className="bg-green-50 rounded-lg p-2">
                          <div className="text-lg font-bold text-green-600">
                            {project.completedTasks}
                          </div>
                          <div className="text-xs text-green-600">Done</div>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      {project.taskCount > 0 && (
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>Progress</span>
                            <span>
                              {Math.round(
                                (project.completedTasks / project.taskCount) *
                                  100
                              )}
                              %
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-green-500 h-2 rounded-full transition-all duration-300"
                              style={{
                                width: `${
                                  (project.completedTasks / project.taskCount) *
                                  100
                                }%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Created Date */}
                    <div className="flex items-center text-xs text-gray-500 pt-2 border-t">
                      <CalendarDays className="w-3 h-3 mr-1" />
                      Created {new Date(project.createdAt).toLocaleDateString()}
                    </div>

                    <Link
                      href={`/projects/${project.teamId}`}
                      className="block"
                    >
                      <Button className="w-full mt-4" variant="outline">
                        <span>View Tasks</span>
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
