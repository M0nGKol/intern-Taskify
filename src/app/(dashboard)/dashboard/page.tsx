"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, LogOut } from "lucide-react";
import { CreateProjectModal } from "@/components/modals/create-project-modal";
import { JoinTeamModal } from "@/components/modals/join-team-modal";
import WelcomePage from "@/components/dashboard/WelcomePage";
import HomePage from "@/components/dashboard/HomePage";
import { useAuth } from "@/components/providers/auth-provider";
import { useRouter } from "next/navigation";
import { useDashboardDateTime } from "@/lib/hooks/useDashboardDateTime";
import { usePersistentProjectState } from "@/lib/hooks/usePersistentProjectState";

const page = () => {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const { user, signOut } = useAuth();
  const router = useRouter();

  const { currentDate, greeting } = useDashboardDateTime();
  const { hasProject, projectName, teamId, setProject, clearProject } =
    usePersistentProjectState();

  const openModal = (modalname: string) => setActiveModal(modalname);
  const closeModal = () => setActiveModal(null);

  const handleProjectCreated = (payload: {
    projectName: string;
    teamId: string;
  }) => {
    setProject(payload.projectName, payload.teamId);
    closeModal();
  };

  const handleProjectJoined = (payload: {
    projectName: string;
    teamId: string;
  }) => {
    setProject(payload.projectName, payload.teamId);
    closeModal();
  };

  const handleSignOut = async () => {
    await signOut();
    clearProject();
    router.push("/sign-in");
  };

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-white px-12 py-8">
        <div className="flex justify-between items-start">
          <div className="text-center flex-1">
            <p className="text-gray-600 text-base mb-4">{currentDate}</p>
            <h1 className="text-4xl font-normal text-black">
              {greeting}
              {user?.name ? `, ${user.name}` : ""}
            </h1>
          </div>
          <div className="flex items-center space-x-4 absolute top-8 right-12">
            {!hasProject ? (
              <>
                <Button
                  onClick={() => openModal("createProject")}
                  className="bg-blue-400 hover:bg-blue-500 text-white rounded-full px-6 py-2 text-sm font-medium"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Project
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => openModal("joinTeam")}
                  className="text-slate-700 hover:bg-gray-100 font-medium text-sm"
                >
                  Join Existing
                </Button>
              </>
            ) : (
              <>
                <div className="rounded-full border border-blue-200 bg-blue-50 text-blue-700 px-4 py-2 text-sm font-medium">
                  {projectName}
                </div>
                <div className="rounded-full border border-gray-200 bg-gray-50 text-gray-700 px-4 py-2 text-sm font-mono">
                  Team ID: {teamId}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="flex-1 overflow-y-auto">
        {hasProject ? <HomePage projectName={projectName} /> : <WelcomePage />}
      </div>

      {/* Modals */}
      {activeModal === "createProject" && (
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
      )}
    </div>
  );
};

export default page;
