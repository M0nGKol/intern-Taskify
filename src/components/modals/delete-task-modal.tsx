"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2, AlertTriangle } from "lucide-react";

interface DeleteTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  taskTitle: string;
}

export function DeleteTaskModal({
  isOpen,
  onClose,
  onConfirm,
  taskTitle,
}: DeleteTaskModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Delete Task
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">
              Are you sure you want to delete this task?
            </p>
            <p className="text-sm font-medium text-gray-900">"{taskTitle}"</p>
            <p className="text-xs text-gray-500 mt-2">
              This action cannot be undone.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            className="bg-red-500 hover:bg-red-600 flex items-center gap-2"
            onClick={onConfirm}
          >
            <Trash2 className="w-4 h-4" />
            Delete Task
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
