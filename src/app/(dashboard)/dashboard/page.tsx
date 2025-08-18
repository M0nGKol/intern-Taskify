"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, LogOut, User } from "lucide-react";
import { CreateProjectModal } from "@/components/modals/create-project-modal";
import { JoinTeamModal } from "@/components/modals/join-team-modal";
import WelcomePage from "@/components/dashboard/WelcomePage";
import HomePage from "@/components/dashboard/HomePage";
import { useAuth } from "@/components/providers/auth-provider";
import { useRouter } from "next/navigation";

const page = () => {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [hasProject, setHasProject] = useState(false);
  const [projectName, setProjectName] = useState("");
  const { user, signOut } = useAuth();
  const router = useRouter();

  const openModal = (modalname: string) => setActiveModal(modalname);
  const closeModal = () => setActiveModal(null);

  const handleProjectCreated = (name: string) => {
    setProjectName(name);
    setHasProject(true);
    closeModal();
  };

  const handleProjectJoined = (name: string) => {
    setProjectName(name);
    setHasProject(true);
    closeModal();
  };

  const handleSignOut = async () => {
    await signOut();
    router.push("/sign-in");
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="bg-white px-12 py-8">
        <div className="flex justify-between items-start">
          <div className="text-center flex-1">
            <p className="text-gray-600 text-base mb-4">Friday, July 31</p>
            <h1 className="text-4xl font-normal text-black">
              Good Morning{user?.name ? `, ${user.name}` : ""}
            </h1>
          </div>
          <div className="flex items-center space-x-4 absolute top-8 right-12">
            {/* User Info */}
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <User className="w-4 h-4" />
              <span>{user?.email || "User"}</span>
            </div>

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
            <Button
              variant="ghost"
              onClick={handleSignOut}
              className="text-red-600 hover:bg-red-50 font-medium text-sm"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      {hasProject ? <HomePage projectName={projectName} /> : <WelcomePage />}

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
