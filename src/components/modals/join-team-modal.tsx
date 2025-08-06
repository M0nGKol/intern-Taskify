"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface JoinTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function JoinTeamModal({ isOpen, onClose }: JoinTeamModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Team ID</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <Input placeholder="Enter your Team ID" className="w-full" />
          </div>

          <p className="text-sm text-gray-600">
            Ask your team admin for the Team ID if you don't have it.
          </p>
        </div>

        <div className="flex justify-center pt-4">
          <Button className="bg-blue-500 hover:bg-blue-600 text-white w-full">
            Join Team
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
