"use client";

import { useState, useCallback } from "react";

type ProjectState = {
  hasProject: boolean;
  projectName: string;
  teamId: string;
};

export function useProjectState(initialProject?: { name: string; teamId: string }) {
  const [projectState, setProjectState] = useState<ProjectState>(() => ({
    hasProject: !!(initialProject?.name && initialProject?.teamId),
    projectName: initialProject?.name || "",
    teamId: initialProject?.teamId || "",
  }));

  const setProject = useCallback((name: string, teamId: string) => {
    setProjectState({
      hasProject: true,
      projectName: name,
      teamId: teamId,
    });
  }, []);

  const clearProject = useCallback(() => {
    setProjectState({
      hasProject: false,
      projectName: "",
      teamId: "",
    });
  }, []);

  return {
    ...projectState,
    setProject,
    clearProject,
  };
}