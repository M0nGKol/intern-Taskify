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
import { Label } from "@radix-ui/react-label";
import { toast } from "sonner";
import { useAuth } from "@/components/providers/auth-provider";
import { joinProjectByTeamId } from "@/actions/project-action";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface JoinTeamModalProps {
  onProjectJoined?: (name: string, teamId: string) => void;
}

export function JoinTeamModal({ onProjectJoined }: JoinTeamModalProps) {
  const [teamId, setTeamId] = useState("");
  const [requestedRole, setRequestedRole] = useState<"viewer" | "editor">(
    "viewer"
  );
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async () => {
    const id = teamId.trim();
    if (!id) {
      toast.error("Please enter a Team ID");
      return;
    }

    if (!user?.id) {
      toast.error("You must be logged in to join a team");
      return;
    }

    setIsLoading(true);

    try {
      const result = await joinProjectByTeamId({
        teamId: id,
        userId: user.id,
        requestedRole,
      });

      if (result) {
        // Call the callback to update parent state
        onProjectJoined?.(result.project.name, id);

        // Reset form and close modal
        setTeamId("");
        setRequestedRole("viewer");
        setIsOpen(false);

        if (result.isNewMember) {
          toast.success(
            `Successfully joined "${result.project.name}" as ${result.member.role}`
          );
        } else {
          toast.success(
            `Welcome back to "${result.project.name}" (Role: ${result.member.role})`
          );
        }
      } else {
        toast.error("Failed to join project - no result returned");
      }
    } catch (error) {
      console.error("Failed to join project:", error);
      if (error instanceof Error) {
        console.error("Error details:", {
          message: error.message,
          stack: error.stack,
          name: error.name,
        });
        if (error.message.includes("not found")) {
          toast.error("Project not found. Please check the Team ID.");
        } else {
          toast.error(error.message);
        }
      } else {
        console.error("Unknown error type:", error);
        toast.error("Failed to join project. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setTeamId("");
      setRequestedRole("viewer");
      setIsOpen(false);
    }
  };

  return (
    <Dialog onOpenChange={handleClose}>
      <DialogTrigger asChild>
        <Button variant="outline">Join Project</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Join Existing Team</DialogTitle>
          <DialogDescription>
            Enter the Team ID and select your desired role to join an existing
            project.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Team ID Input */}
          <div className="space-y-2">
            <Label htmlFor="team-id">Team ID</Label>
            <Input
              id="team-id"
              placeholder="Enter Team ID (e.g., PRJ-ABC12345)"
              value={teamId}
              onChange={(e) => setTeamId(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && !isLoading && handleSubmit()
              }
              disabled={isLoading}
            />
          </div>

          {/* Role Selection */}
          <div className="space-y-2">
            <Label htmlFor="role-select">Requested Role</Label>
            <Select
              value={requestedRole}
              onValueChange={(value: "viewer" | "editor") =>
                setRequestedRole(value)
              }
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="viewer">
                  <div className="flex flex-col items-start">
                    <span className="font-medium">Viewer</span>
                    <span className="text-xs text-gray-500">
                      Can view tasks and project details
                    </span>
                  </div>
                </SelectItem>
                <SelectItem value="editor">
                  <div className="flex flex-col items-start">
                    <span className="font-medium">Editor</span>
                    <span className="text-xs text-gray-500">
                      Can create, edit, and manage tasks
                    </span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500">
              Note: Project owners can change your role later if needed.
            </p>
          </div>

          {/* Debug info - show current user */}
          {process.env.NODE_ENV === "development" && (
            <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
              Debug: User ID: {user?.id || "Not logged in"}
            </div>
          )}
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
