"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useState } from "react";
import { leaveProject } from "@/actions/project-action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface LeaveProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId?: string;
  projectName?: string;
  userId?: string;
}

export function LeaveProjectModal({
  isOpen,
  onClose,
  projectId,
  projectName,
  userId,
}: LeaveProjectModalProps) {
  const [isLeaving, setIsLeaving] = useState(false);
  const router = useRouter();

  const handleLeaveProject = async () => {
    if (!projectId || !userId) {
      toast.error("Missing project information");
      return;
    }

    setIsLeaving(true);
    try {
      const result = await leaveProject({
        projectId,
        userId,
      });

      if (result.success) {
        toast.success(result.message);
        onClose();
        // Refresh the page to update the project list
        router.refresh();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error leaving project:", error);
      toast.error("Failed to leave project");
    } finally {
      setIsLeaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-red-600">
            Leave project?
          </DialogTitle>
          <p className="text-sm text-gray-600">
            Are you sure you want to leave{" "}
            {projectName ? `"${projectName}"` : "this project"}? You will lose
            access to all tasks and data in this project.
          </p>
        </DialogHeader>

        <div className="flex justify-end gap-3 pt-6">
          <Button variant="outline" onClick={onClose} disabled={isLeaving}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            className="bg-red-500 hover:bg-red-600"
            onClick={handleLeaveProject}
            disabled={isLeaving}
          >
            <LogOut className="w-4 h-4 mr-2" />
            {isLeaving ? "Leaving..." : "Leave Project"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
