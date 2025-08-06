"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";

interface DeleteTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DeleteTaskModal({ isOpen, onClose }: DeleteTaskModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Delete Task
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm font-medium">Due Date:</span>
              <span className="text-sm text-gray-600">dd/mm/yyyy</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium">Priority:</span>
              <span className="text-sm text-gray-600">-</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium">Status:</span>
              <span className="text-sm text-gray-600">-</span>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-2">Description</h4>
            <p className="text-sm text-gray-600">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" className="flex items-center gap-2">
            <Edit className="w-4 h-4" />
            Edit
          </Button>
          <Button
            variant="destructive"
            className="bg-red-500 hover:bg-red-600 flex items-center gap-2"
            onClick={onClose}
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
