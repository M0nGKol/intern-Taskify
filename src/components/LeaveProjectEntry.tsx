// src/components/modals/LeaveProjectButton.tsx
"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { LeaveProjectModal } from "@/components/modals/leave-project-modal";

type Props = {
  projectId?: string;
  projectName?: string;
  userId?: string;
};

export default function LeaveProjectButton({
  projectId,
  projectName,
  userId,
}: Props) {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button
        size="sm"
        variant="outline"
        className="h-7 text-xs"
        onClick={() => setOpen(true)}
        title={projectName ? `Leave "${projectName}"` : "Leave project"}
      >
        <LogOut className="w-3 h-3 mr-1" />
        Leave
      </Button>
      <LeaveProjectModal
        isOpen={open}
        onClose={() => setOpen(false)}
        projectId={projectId}
        projectName={projectName}
        userId={userId}
      />
    </>
  );
}
