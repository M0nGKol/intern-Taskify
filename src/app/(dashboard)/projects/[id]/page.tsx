import React from "react";
import { getTasksByTeam } from "@/actions/task-action";
import { getProjectsByTeamIds } from "@/actions/project-action";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { TaskPageClient } from "@/components/TaskPageClient";
import { defaultColumns, colorOptions } from "@/constants/columns";

export default async function TasksPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: teamId } = await params;

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

  let tasks = [];
  let projects = [];
  let projectName = "";

  try {
    const [tasksData, projectsData] = await Promise.all([
      getTasksByTeam(teamId),
      getProjectsByTeamIds([teamId]),
    ]);

    tasks = tasksData;
    projects = projectsData;
    projectName = projects[0]?.name || "";
  } catch (error) {
    console.error("Error fetching data:", error);
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-700">
            Error Loading Data
          </h2>
          <p className="text-gray-500">Failed to load tasks and projects.</p>
          <p className="text-xs text-gray-400 mt-2">Team ID: {teamId}</p>
        </div>
      </div>
    );
  }

  return (
    <TaskPageClient
      tasks={tasks}
      projects={projects}
      teamId={teamId}
      projectName={projectName}
      defaultColumns={defaultColumns}
      colorOptions={colorOptions}
      userId={session.user.id}
    />
  );
}
