"use client";

import { useEffect, useState } from "react";
import { getProjectByTeamId } from "@/actions/project-action";

type RecentProject = {
	name: string;
	teamId: string;
	viewedAt: number;
};

type Persisted = {
	hasProject: boolean;
	projectName: string;
	teamId: string;
	recentProjects?: RecentProject[];
};

const STORAGE_KEY = "taskify-dashboard";


const PROJECT_EVENT = "taskify-project-change";
const emitter: EventTarget | null =
	typeof window !== "undefined" ? new EventTarget() : null;

export function usePersistentProjectState() {
	const [hasProject, setHasProject] = useState(false);
	const [projectName, setProjectName] = useState("");
	const [teamId, setTeamId] = useState("");
	const [recentProjects, setRecentProjects] = useState<RecentProject[]>([]);

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
			if (Array.isArray(parsed.recentProjects)) {
				// Ensure newest first
				const sorted = [...parsed.recentProjects].sort(
					(a, b) => (b.viewedAt || 0) - (a.viewedAt || 0)
				);
				setRecentProjects(sorted);
			}
		} catch {}
	}, []);

	// Listen for project changes from other instances of this hook
	useEffect(() => {
		if (!emitter) return;
		const handler = (e: Event) => {
			const ce = e as CustomEvent<Persisted>;
			if (!ce.detail) return;
			setHasProject(!!ce.detail.hasProject);
			setProjectName(ce.detail.projectName || "");
			setTeamId(ce.detail.teamId || "");
			if (Array.isArray(ce.detail.recentProjects)) {
				const sorted = [...ce.detail.recentProjects].sort(
					(a, b) => (b.viewedAt || 0) - (a.viewedAt || 0)
				);
				setRecentProjects(sorted);
			}
		};
		emitter.addEventListener(PROJECT_EVENT, handler as EventListener);
		return () => {
			emitter.removeEventListener(PROJECT_EVENT, handler as EventListener);
		};
	}, []);

	// Validate current project against the database and keep UI in sync
	useEffect(() => {
		const validate = async () => {
			if (!teamId) return;
			try {
				const proj = await getProjectByTeamId(teamId);
				if (!proj) {
					clearProject();
					return;
				}
				if (proj.name && proj.name !== projectName) {
					setProject(proj.name, teamId);
				}
			} catch {}
		};

		validate();
	}, [teamId]);

	// Re-validate on window focus to reflect external DB changes
	useEffect(() => {
		const onFocus = () => {
			if (!teamId) return;
			getProjectByTeamId(teamId)
				.then((proj) => {
					if (!proj) {
						clearProject();
						return;
					}
					if (proj.name && proj.name !== projectName) {
						setProject(proj.name, teamId);
					}
				})
				.catch(() => {});
		};

		if (typeof window !== "undefined") {
			window.addEventListener("focus", onFocus);
			return () => window.removeEventListener("focus", onFocus);
		}
	}, [teamId, projectName]);

	const setProject = (name: string, id: string) => {
		setHasProject(true);
		setProjectName(name);
		setTeamId(id);
		try {
			// Update recent projects (move to front, unique by teamId, cap length)
			const nextRecent: RecentProject[] = (() => {
				const existing = [...recentProjects];
				const filtered = existing.filter((p) => p.teamId !== id);
				return [{ name, teamId: id, viewedAt: Date.now() }, ...filtered].slice(0, 10);
			})();
			setRecentProjects(nextRecent);

			const persisted: Persisted = {
				hasProject: true,
				projectName: name,
				teamId: id,
				recentProjects: nextRecent,
			};
			localStorage.setItem(STORAGE_KEY, JSON.stringify(persisted));
			emitter?.dispatchEvent(
				new CustomEvent<Persisted>(PROJECT_EVENT, { detail: persisted })
			);
		} catch {}
	};

	const clearProject = () => {
		setHasProject(false);
		setProjectName("");
		setTeamId("");
		try {
			const persisted: Persisted = {
				hasProject: false,
				projectName: "",
				teamId: "",
				recentProjects,
			};
			localStorage.setItem(STORAGE_KEY, JSON.stringify(persisted));
			emitter?.dispatchEvent(
				new CustomEvent<Persisted>(PROJECT_EVENT, { detail: persisted })
			);
		} catch {}
	};

	return { hasProject, projectName, teamId, recentProjects, setProject, clearProject };
}