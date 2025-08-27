"use client";

import React from "react";
import HomePage from "@/components/dashboard/HomePage";

interface Project {
  id: string;
  name: string;
  teamId: string;
  description?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface DashboardContentProps {
  projects: Project[];
  selectedProject?: Project | null;
}

export default function DashboardContent({
  projects,
  selectedProject,
}: DashboardContentProps) {
  // Use the selected project if available, otherwise fall back to the first project
  const currentProject = selectedProject || projects[0];

  return (
    <HomePage
      projectName={currentProject.name}
      teamId={currentProject.teamId}
    />
  );
}
