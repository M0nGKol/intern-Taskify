"use client";

import { useEffect, useState } from "react";

type Persisted = {
	hasProject: boolean;
	projectName: string;
	teamId: string;
};

const STORAGE_KEY = "taskify-dashboard";

export function usePersistentProjectState() {
	const [hasProject, setHasProject] = useState(false);
	const [projectName, setProjectName] = useState("");
	const [teamId, setTeamId] = useState("");

	useEffect(() => {
		if (typeof window === "undefined") return;
		try {
			const raw = localStorage.getItem(STORAGE_KEY);
			if (!raw) return;
			const parsed: Partial<Persisted> = JSON.parse(raw);
			if (parsed.hasProject) {
				setHasProject(true);
				setProjectName(parsed.projectName || "");
				setTeamId(parsed.teamId || "");
			}
		} catch {}
	}, []);

	const setProject = (name: string, id: string) => {
		setHasProject(true);
		setProjectName(name);
		setTeamId(id);
		try {
			localStorage.setItem(
				STORAGE_KEY,
				JSON.stringify({ hasProject: true, projectName: name, teamId: id })
			);
		} catch {}
	};

	const clearProject = () => {
		setHasProject(false);
		setProjectName("");
		setTeamId("");
		try {
			localStorage.removeItem(STORAGE_KEY);
		} catch {}
	};

	return { hasProject, projectName, teamId, setProject, clearProject };
}