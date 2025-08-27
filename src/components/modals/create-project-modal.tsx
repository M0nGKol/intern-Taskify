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
import { createProject } from "@/actions/project-action";
import { nanoid } from "nanoid";
import { Label } from "@radix-ui/react-label";
import { useAuth } from "../providers/auth-provider";
import { toast } from "sonner";

interface CreateProjectModalProps {
  onProjectCreated?: (name: string, teamId: string) => void;
}

export function CreateProjectModal({
  onProjectCreated,
}: CreateProjectModalProps) {
  const [projectName, setProjectName] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const generateProjectId = () => "PRJ-" + nanoid(8).toUpperCase();

  const handleSubmit = async () => {
    const name = projectName.trim();
    if (!name) return;

    setIsLoading(true);
    const effectiveTeamId = generateProjectId();

    try {
      // Only create in database - no localStorage
      await createProject({
        name,
        teamId: effectiveTeamId,
        ownerUserId: user?.id,
      });

      // Call the callback to update parent state
      onProjectCreated?.(name, effectiveTeamId);

      // Reset form and close modal
      setProjectName("");
      setIsOpen(false);
      toast.success("Project created successfully!");
    } catch (error) {
      console.error("Failed to create project:", error);
      toast.error("Failed to create project. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Create Project</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create a New Project</DialogTitle>
          <DialogDescription>
            Create a new project to get started.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="project-name" className="sr-only">
              Project Name
            </Label>
            <Input
              id="project-name"
              placeholder="Enter project name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
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
            className="bg-blue-500 hover:bg-blue-600 text-white"
            onClick={handleSubmit}
            disabled={!projectName.trim() || isLoading}
          >
            {isLoading ? "Creating..." : "Create Project"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
