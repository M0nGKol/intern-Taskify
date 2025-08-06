"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateTaskModal({ isOpen, onClose }: CreateTaskModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Create a New Task
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <Input placeholder="Enter task title" className="w-full" />
          </div>
          <div>
            <Input placeholder="Enter task description" className="w-full" />
          </div>
        </div>

        <div className="flex justify-center pt-4">
          <Button className="bg-blue-500 hover:bg-blue-600 text-white w-full">
            Create Task
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
