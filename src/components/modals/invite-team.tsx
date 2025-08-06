"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Mail, UserPlus } from "lucide-react";

interface InviteTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InviteTeamModal({ isOpen, onClose }: InviteTeamModalProps) {
  const members = ["Member 1", "Member 2", "Member 3", "Member 4", "Member 5"];
  const projects = [
    "Project 1",
    "Project 2",
    "Project 3",
    "Project 5",
    "Project 6",
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Invite team members
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-6 py-4">
          {/* Left Column - Members */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 bg-red-500 rounded-full"></span>
              <span className="text-sm font-medium">Edit</span>
            </div>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 bg-red-500 rounded-full"></span>
              <span className="text-sm font-medium">Delete</span>
            </div>

            <div className="space-y-2">
              {members.map((member, index) => (
                <div
                  key={member}
                  className={`px-3 py-2 rounded text-sm ${
                    index === 0
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {member}
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Projects */}
          <div>
            <div className="space-y-2 mb-6">
              {projects.map((project, index) => (
                <div
                  key={project}
                  className={`px-3 py-2 rounded text-sm ${
                    index === 0
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {project}
                </div>
              ))}
            </div>

            {/* Invite Form */}
            <div className="space-y-4">
              <div>
                <Input placeholder="Email or Username" className="w-full" />
              </div>

              <div className="flex items-center gap-2">
                <Select>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="editor">Editor</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
                <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                  Invite
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
