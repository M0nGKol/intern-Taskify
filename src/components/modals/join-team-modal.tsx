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
import { Label } from "@/components/ui/label";

interface JoinTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectJoined: (projectName: string) => void;
}

export function JoinTeamModal({
  isOpen,
  onClose,
  onProjectJoined,
}: JoinTeamModalProps) {
  const [teamId, setTeamId] = useState("");

  const handleSubmit = () => {
    if (teamId.trim()) {
      // For now, we'll use the team ID as the project name
      // In a real app, you'd fetch the actual project name from the API
      onProjectJoined(`Team ${teamId.trim()}`);
      setTeamId(""); // Reset form
    }
  };

  const handleClose = () => {
    setTeamId(""); // Reset form on close
    onClose();
  };
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Team ID</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <Input
              placeholder="Enter your Team ID"
              className="w-full"
              value={teamId}
              onChange={(e) => setTeamId(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
          </div>

          <p className="text-sm text-gray-600">
            Ask your team admin for the Team ID if you don't have it.
          </p>
        </div>

        <div className="flex justify-center pt-4">
          <Button
            className="bg-blue-500 hover:bg-blue-600 text-white w-full"
            onClick={handleSubmit}
            disabled={!teamId.trim()}
          >
            Join Team
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
