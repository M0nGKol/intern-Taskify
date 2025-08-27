"use client";
import React from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/components/providers/auth-provider";
import { useDashboardDateTime } from "@/lib/hooks/useDashboardDateTime";
import { CreateProjectModal } from "./modals/create-project-modal";
import { JoinTeamModal } from "./modals/join-team-modal";
import { toast } from "sonner";

interface Project {
  id: string;
  name: string;
  teamId: string;
  description?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface HomeHeaderProps {
  selectedProject?: Project | null;
  projects?: Project[];
}

export default function HomeHeader({
  selectedProject,
  projects = [],
}: HomeHeaderProps) {
  const { user } = useAuth();
  const { currentDate, greeting } = useDashboardDateTime();
  const router = useRouter();

  // Handle project creation - redirect to dashboard with the new project
  const handleProjectCreated = (name: string, teamId: string) => {
    toast.success("Project created successfully!");
    // Redirect to dashboard with the new project selected
    router.push(`/dashboard?project=${teamId}`);
    router.refresh(); // Refresh to get updated projects list
  };

  // Handle project join - redirect to dashboard with the joined project
  const handleProjectJoined = (name: string, teamId: string) => {
    toast.success(`Successfully joined project: ${name}`);
    // Redirect to dashboard with the joined project selected
    router.push(`/dashboard?project=${teamId}`);
    router.refresh(); // Refresh to get updated projects list
  };

  // Handle project selection from existing projects
  const handleProjectSelect = (project: Project) => {
    router.push(`/dashboard?project=${project.teamId}`);
  };

  const hasProjects = projects.length > 0;
  const showProjectInfo = selectedProject && hasProjects;

  return (
    <div>
      {/* Header */}
      <div className="px-12 py-8">
        <div className="flex justify-between items-start">
          <div className="text-center flex-1">
            <p className="text-gray-600 text-base mb-4">{currentDate}</p>
            <h1 className="text-4xl font-normal text-black">
              {greeting}
              {user?.name ? `, ${user.name}` : ""}
            </h1>
          </div>
          <div className="flex items-center space-x-4 top-8 right-12">
            {!showProjectInfo ? (
              <>
                <CreateProjectModal onProjectCreated={handleProjectCreated} />
                <JoinTeamModal onProjectJoined={handleProjectJoined} />
                {/* Show project selector if user has projects but none selected */}
                {hasProjects && (
                  <select
                    onChange={(e) => {
                      const projectId = e.target.value;
                      if (projectId) {
                        const project = projects.find(
                          (p) => p.teamId === projectId
                        );
                        if (project) handleProjectSelect(project);
                      }
                    }}
                    className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                    defaultValue=""
                  >
                    <option value="">Select a project...</option>
                    {projects.map((project) => (
                      <option key={project.id} value={project.teamId}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                )}
              </>
            ) : (
              <>
                <div className="rounded-full border border-blue-200 bg-blue-50 text-blue-700 px-4 py-2 text-sm font-medium">
                  {selectedProject.name}
                </div>
                <div className="rounded-full border border-gray-200 bg-gray-50 text-gray-700 px-4 py-2 text-sm font-mono">
                  ID: {selectedProject.teamId}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
