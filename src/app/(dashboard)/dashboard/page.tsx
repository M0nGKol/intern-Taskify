import React, { Suspense } from "react";
import HomeHeader from "@/components/HomeHeader";
import { getAllProjects } from "@/actions/project-action";
import DashboardContent from "../../../components/dashboard/DashboardContent";
import WelcomePage from "@/components/dashboard/WelcomePage";
import { HomePageSkeleton } from "@/components/HomePageSkeleton";

export const dynamic = "force-dynamic";

interface DashboardPageProps {
  searchParams: Promise<{ project?: string }>;
}

async function DashboardPageContent({ searchParams }: DashboardPageProps) {
  const resolvedSearchParams = await searchParams;

  const projects = await getAllProjects();

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
          <DashboardContent projects={projects} selectedProject={projects[0]} />
        )}
      </div>
    </div>
  );
}

export default function DashboardPage({ searchParams }: DashboardPageProps) {
  return (
    <Suspense fallback={<HomePageSkeleton />}>
      <DashboardPageContent searchParams={searchParams} />
    </Suspense>
  );
}
