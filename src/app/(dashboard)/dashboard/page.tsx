"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CreateProjectModal } from "@/components/modals/create-project-modal";
import { JoinTeamModal } from "@/components/modals/join-team-modal";
const page = () => {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const openModal = (modalname: string) => setActiveModal(modalname);
  const closeModal = () => setActiveModal(null);
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-white px-8 py-6 border-b">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-gray-600 mb-2">Friday, July 31</p>
            <h1 className="text-3xl font-semibold text-gray-900">
              Good Morning, Mongkol
            </h1>
          </div>
          <div className="flex space-x-4">
            <Button
              onClick={() => openModal("createProject")}
              className="bg-[#5FA8D3] hover:bg-blue-600 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Project
            </Button>
            <Button variant="outline" onClick={() => openModal("joinTeam")}>
              Join Existing
            </Button>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <main className="flex-1 px-8 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-8 text-center">
            {/* Welcome Section */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                ✨ Welcome to Your Dashboard!
              </h2>
              <p className="text-blue-600 mb-6">
                {
                  "We're excited to have you on board! Here's what you can do to get started:"
                }
              </p>
            </div>

            {/* Action Cards */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  🚀 Create Your First Project
                </h3>
                <p className="text-blue-600">
                  Start organizing your work by clicking "New Project" above.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  👥 Join an Existing Project
                </h3>
                <p className="text-blue-600">
                  Already part of a team? Use "Join Existing" to connect with
                  them.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  ✅ Tasks and Notes Will Appear Here
                </h3>
                <p className="text-blue-600">
                  {
                    "Once you create or join a project, you'll start seeing your tasks and notes here."
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
      {activeModal === "createProject" && (
        <CreateProjectModal isOpen={true} onClose={closeModal} />
      )}
      {activeModal === "joinTeam" && (
        <JoinTeamModal isOpen={true} onClose={closeModal} />
      )}
    </div>
  );
};

export default page;
