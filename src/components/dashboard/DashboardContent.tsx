"use client";

import React from "react";
import WelcomePage from "@/components/dashboard/WelcomePage";
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
  // If no projects exist, show welcome page
  if (projects.length === 0) {
    return <WelcomePage />;
  }

  // If a specific project is selected, show that project
  if (selectedProject) {
    return (
      <HomePage
        projectName={selectedProject.name}
        teamId={selectedProject.teamId}
      />
    );
  }

  // If no project is selected but projects exist, show a project overview or the first project
  // You can customize this behavior based on your needs
  return (
    <div className="px-8 py-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="p-6 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
              onClick={() => {
                window.location.href = `/dashboard?project=${project.teamId}`;
              }}
            >
              <h3 className="font-semibold text-gray-900 mb-2">
                {project.name}
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                {project.description || "No description"}
              </p>
              <div className="text-xs text-gray-500">
                Team ID: {project.teamId}
              </div>
              <div className="text-xs text-gray-400 mt-1">
                Created: {new Date(project.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
