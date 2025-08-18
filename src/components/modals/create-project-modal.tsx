"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectCreated: (payload: { projectName: string; teamId: string }) => void;
}

export function CreateProjectModal({
  isOpen,
  onClose,
  onProjectCreated,
}: CreateProjectModalProps) {
  const [projectName, setProjectName] = useState("");

  const generateTeamId = () =>
    "TEAM-" + Math.random().toString(36).slice(2, 8).toUpperCase();

  const handleSubmit = () => {
    const name = projectName.trim();
    if (name) {
      const teamId = generateTeamId();
      onProjectCreated({ projectName: name, teamId });
      setProjectName("");
    }
  };

  const handleClose = () => {
    setProjectName("");
    onClose();
  };
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Create a New Project
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <Input
              placeholder="Enter project name"
              className="w-full"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
          </div>
        </div>

        <div className="flex justify-center pt-4">
          <Button
            className="bg-blue-500 hover:bg-blue-600 text-white w-full"
            onClick={handleSubmit}
            disabled={!projectName.trim()}
          >
            Create Project
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
