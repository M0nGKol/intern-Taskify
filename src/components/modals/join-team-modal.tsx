"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getProjectByTeamId } from "@/actions/project-action";
import { Label } from "@radix-ui/react-label";
import { toast } from "sonner";

interface JoinTeamModalProps {
  onProjectJoined?: (name: string, teamId: string) => void;
}

export function JoinTeamModal({ onProjectJoined }: JoinTeamModalProps) {
  const [teamId, setTeamId] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    const id = teamId.trim();
    if (!id) return;

    setIsLoading(true);
    try {
      // Only query database - no localStorage
      const proj = await getProjectByTeamId(id);
      if (proj) {
        // Call the callback to update parent state
        onProjectJoined?.(proj.name, id);

        // Reset form and close modal
        setTeamId("");
        setIsOpen(false);
        toast.success(`Successfully joined project: ${proj.name}`);
      } else {
        toast.error("Project not found. Please check the Project ID.");
      }
    } catch (error) {
      console.error("Failed to join project:", error);
      toast.error("Failed to join project. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Join Team</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Join Existing Team</DialogTitle>
          <DialogDescription>
            Enter the Project ID to join an existing team.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="team-id" className="sr-only">
              Project ID
            </Label>
            <Input
              id="team-id"
              placeholder="Enter Project ID (e.g., PRJ-ABC12345)"
              value={teamId}
              onChange={(e) => setTeamId(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && !isLoading && handleSubmit()
              }
              disabled={isLoading}
            />
          </div>
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button variant="outline" disabled={isLoading}>
              Cancel
            </Button>
          </DialogClose>
          <Button
            className="bg-green-500 hover:bg-green-600 text-white"
            onClick={handleSubmit}
            disabled={!teamId.trim() || isLoading}
          >
            {isLoading ? "Joining..." : "Join Team"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
