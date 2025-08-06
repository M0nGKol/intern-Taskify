"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface EditTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EditTaskModal({ isOpen, onClose }: EditTaskModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Edit Task</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <Input
              placeholder="Task title"
              className="w-full"
              defaultValue="Sample Task"
            />
          </div>
          <div>
            <Input
              placeholder="Task description"
              className="w-full"
              defaultValue="Sample description"
            />
          </div>
        </div>

        <div className="flex justify-center pt-4">
          <Button className="bg-blue-500 hover:bg-blue-600 text-white w-full">
            Update Task
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
