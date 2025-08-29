"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { DeleteProjectModal } from "@/components/modals/delete-project-modal";

type Props = {
  projectId?: string;
  projectName?: string;
  teamId?: string;
};

export default function DeleteProjectButton({
  projectId,
  projectName,
  teamId,
}: Props) {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button
        size="sm"
        variant="destructive"
        className="h-7 text-xs"
        onClick={() => setOpen(true)}
        title={projectName ? `Delete "${projectName}"` : "Delete project"}
      >
        <Trash2 className="w-3 h-3 mr-1" />
        Delete
      </Button>
      <DeleteProjectModal
        isOpen={open}
        onClose={() => setOpen(false)}
        projectName={projectName || ""}
        projectId={projectId}
        teamId={teamId}
        onConfirm={() => {
          // The modal will handle the deletion logic
          setOpen(false);
        }}
      />
    </>
  );
}
