"use client";

import { useEffect, useState, useCallback } from "react";
// import { getProjectByTeamId, getProjectsByTeamIds } from "@/actions/project-action";

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
	typeof window !== "undefined" ? window : null;

export function usePersistentProjectState() {
	const [hasProject, setHasProject] = useState(false);
	const [projectName, setProjectName] = useState("");
	const [teamId, setTeamId] = useState("");
	const [recentProjects, setRecentProjects] = useState<RecentProject[]>([]);

	// Load from localStorage and validate recent projects
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

				// TODO: Validate against DB and prune/update names when server actions are available
				// Comment out DB validation to avoid SSR conflicts
				/*
				(async () => {
					try {
						const teamIds = Array.from(
							new Set(sorted.map((p) => p.teamId).filter(Boolean))
						);
						if (teamIds.length === 0) return;
						const rows = await getProjectsByTeamIds(teamIds);
						const byTeam = new Map(rows.map((r) => [r.teamId, r.name]));
						const filtered = sorted
							.filter((p) => byTeam.has(p.teamId))
							.map((p) => ({
								...p,
								name: byTeam.get(p.teamId) || p.name,
							}))
							.slice(0, 10);
						const changed =
							filtered.length !== sorted.length ||
							filtered.some(
								(p, i) =>
									p.teamId !== sorted[i]?.teamId ||
									p.name !== sorted[i]?.name
							);
						if (!changed) return;
						setRecentProjects(filtered);
						try {
							const toStore: Persisted = {
								hasProject: !!parsed.hasProject,
								projectName: parsed.projectName || "",
								teamId: parsed.teamId || "",
								recentProjects: filtered,
							};
							localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
							emitter?.dispatchEvent(
								new CustomEvent<Persisted>(PROJECT_EVENT, { detail: toStore })
							);
						} catch {}
					} catch {}
				})();
				*/
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

	const setProject = useCallback((name: string, id: string) => {
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
	}, [recentProjects]);

	const clearProject = useCallback(() => {
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
	}, [recentProjects]);

	// Re-validate on window focus to reflect external DB changes
	useEffect(() => {
		const onFocus = () => {
			// TODO: Re-enable DB validation when server actions are properly set up
			// Comment out DB validation to avoid SSR conflicts
			/*
			try {
				const ids = Array.from(
					new Set(recentProjects.map((p) => p.teamId).filter(Boolean))
				);
				if (ids.length > 0) {
					getProjectsByTeamIds(ids)
						.then((rows) => {
							const byTeam = new Map(rows.map((r) => [r.teamId, r.name]));
							const filtered = recentProjects
								.filter((p) => byTeam.has(p.teamId))
								.map((p) => ({
									...p,
									name: byTeam.get(p.teamId) || p.name,
								}))
								.slice(0, 10);
							const changed =
								filtered.length !== recentProjects.length ||
								filtered.some(
									(p, i) =>
										p.teamId !== recentProjects[i]?.teamId ||
										p.name !== recentProjects[i]?.name
								);
							if (!changed) return;
							setRecentProjects(filtered);
							try {
								const persisted: Persisted = {
									hasProject,
									projectName,
									teamId,
									recentProjects: filtered,
								};
								localStorage.setItem(STORAGE_KEY, JSON.stringify(persisted));
								emitter?.dispatchEvent(
									new CustomEvent<Persisted>(PROJECT_EVENT, { detail: persisted })
								);
							} catch {}
						})
						.catch(() => {});
				}
			} catch {}

			// Validate currently selected project
			if (!teamId) return;
			getProjectByTeamId(teamId)
				.then((proj) => {
					if (!proj) {
						clearProject();
						return;
					}
					// Only resync the name if a specific project is selected.
					if (hasProject && proj.name && proj.name !== projectName) {
						setProject(proj.name, teamId);
					}
				})
				.catch(() => {});
			*/
		};

		if (typeof window !== "undefined") {
			window.addEventListener("focus", onFocus);
			return () => window.removeEventListener("focus", onFocus);
		}
	}, [teamId, projectName, recentProjects, hasProject, clearProject, setProject]);

	// Persist an "All Projects" selection while keeping the team context
	const setAllProjects = () => {
		setHasProject(false);
		setProjectName("");
		// keep teamId as-is
		try {
			const persisted: Persisted = {
				hasProject: false,
				projectName: "",
				teamId,
				recentProjects,
			};
			localStorage.setItem(STORAGE_KEY, JSON.stringify(persisted));
			emitter?.dispatchEvent(
				new CustomEvent<Persisted>(PROJECT_EVENT, { detail: persisted })
			);
		} catch {}
	};

	return { hasProject, projectName, teamId, recentProjects, setProject, setAllProjects, clearProject };
}