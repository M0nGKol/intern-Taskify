"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface LeaveProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LeaveProjectModal({ isOpen, onClose }: LeaveProjectModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-red-600">
            Leave project?
          </DialogTitle>
          <p className="text-sm text-gray-600">
            Are you sure you want to leave this project? Any unsaved changes
            will be lost.
          </p>
        </DialogHeader>

        <div className="flex justify-end gap-3 pt-6">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            className="bg-red-500 hover:bg-red-600"
            onClick={onClose}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
