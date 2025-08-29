"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2, AlertTriangle } from "lucide-react";
import { deleteProjectByTeamId } from "@/actions/project-action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface DeleteProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  projectName: string;
  projectId?: string;
  teamId?: string;
}

export function DeleteProjectModal({
  isOpen,
  onClose,
  onConfirm,
  projectName,
  teamId,
}: DeleteProjectModalProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!teamId) {
      toast.error("Team ID not found");
      return;
    }

    try {
      setIsDeleting(true);
      await deleteProjectByTeamId(teamId);
      toast.success("Project deleted successfully");
      onConfirm();
      // Redirect to dashboard after successful deletion
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error("Failed to delete project");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Delete Project
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">
              Are you sure you want to delete this project?
            </p>
            <p className="text-sm font-medium text-gray-900">{`"${projectName}"`}</p>
            <p className="text-xs text-gray-500 mt-2">
              This will permanently delete the project and all its tasks. This
              action cannot be undone.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" onClick={onClose} disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            className="bg-red-500 hover:bg-red-600 flex items-center gap-2"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            <Trash2 className="w-4 h-4" />
            {isDeleting ? "Deleting..." : "Delete Project"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
