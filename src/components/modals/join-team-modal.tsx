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
import { getProjectByTeamId } from "@/actions/project-action";

interface JoinTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectJoined: (payload: { projectName: string; teamId: string }) => void;
}

export function JoinTeamModal({
  isOpen,
  onClose,
  onProjectJoined,
}: JoinTeamModalProps) {
  const [teamId, setTeamId] = useState("");

  const handleSubmit = async () => {
    const id = teamId.trim();
    if (id) {
      try {
        const proj = await getProjectByTeamId(id);
        if (proj) {
          onProjectJoined({ projectName: proj.name, teamId: id });
          setTeamId("");
        }
      } catch {}
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
          <DialogTitle className="text-lg font-semibold">
            Project ID
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <Input
              placeholder="Enter your Project ID"
              className="w-full"
              value={teamId}
              onChange={(e) => setTeamId(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
          </div>

          <p className="text-sm text-gray-600">
            Ask your project admin for the Project ID if you don&apos;t have it.
          </p>
        </div>

        <div className="flex justify-center pt-4">
          <Button
            className="bg-blue-500 hover:bg-blue-600 text-white w-full"
            onClick={handleSubmit}
            disabled={!teamId.trim()}
          >
            Join Project
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
