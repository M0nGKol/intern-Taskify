import React from "react";
import HomeHeader from "@/components/HomeHeader";
import { getAllProjects } from "@/actions/project-action";
import DashboardContent from "../../../components/dashboard/DashboardContent";
import WelcomePage from "@/components/dashboard/WelcomePage";

// Force dynamic rendering to ensure URL parameter changes trigger re-renders
export const dynamic = "force-dynamic";

interface DashboardPageProps {
  searchParams: Promise<{ project?: string }>; // Make searchParams a Promise
}

export default async function DashboardPage({
  searchParams,
}: DashboardPageProps) {
  // Await the searchParams Promise
  const resolvedSearchParams = await searchParams;

  // Fetch all user projects from the server
  const projects = await getAllProjects();

  // Get the selected project from URL params
  const selectedProjectId = resolvedSearchParams.project;
  let selectedProject = null;

  if (selectedProjectId && projects.length > 0) {
    selectedProject = projects.find(
      (p) => p.id === selectedProjectId || p.teamId === selectedProjectId
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <HomeHeader selectedProject={selectedProject} projects={projects} />
      <div className="flex-1 overflow-y-auto">
        {projects.length === 0 ? (
          <WelcomePage />
        ) : selectedProject ? (
          <DashboardContent
            projects={projects}
            selectedProject={selectedProject}
          />
        ) : (
          <DashboardContent projects={projects} />
        )}
      </div>
    </div>
  );
}
