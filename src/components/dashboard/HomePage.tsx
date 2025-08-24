import React, { useState, useEffect } from "react";
import { Calendar, Clock, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { getTasksByTeam, getTaskCountsByDate } from "@/actions/task-action";
import { usePersistentProjectState } from "@/lib/hooks/usePersistentProjectState";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { CreateProjectModal } from "../modals/create-project-modal";
import { JoinTeamModal } from "../modals/join-team-modal";
import { HomePageSkeleton } from "../HomePageSkeleton";

interface Task {
  id: string;
  title: string;
  description?: string | null;
  dueDate?: Date | null;
  teamId: string;
  projectName?: string | null;
  userId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface HomePageProps {
  projectName: string;
}

export default function HomePage({ projectName }: HomePageProps) {
  const { teamId, setProject, recentProjects } = usePersistentProjectState();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [monthDate, setMonthDate] = useState<Date>(new Date());
  const [countsByDate, setCountsByDate] = useState<Map<string, number>>(
    new Map()
  );
  const [maxCount, setMaxCount] = useState(0);
  const [showAllProjects, setShowAllProjects] = useState(false);

  const openCreateProject = () => setActiveModal("createProject");
  const openJoinTeam = () => setActiveModal("joinTeam");
  const closeModal = () => setActiveModal(null);

  const handleProjectCreated = (payload: {
    projectName: string;
    teamId: string;
  }) => {
    setProject(payload.projectName, payload.teamId);
    closeModal();
  };

  const handleProjectJoined = (payload: {
    projectName: string;
    teamId: string;
  }) => {
    setProject(payload.projectName, payload.teamId);
    closeModal();
  };

  const fetchTasks = async () => {
    if (!teamId) return;

    try {
      setIsLoading(true);
      const fetchedTasks = await getTasksByTeam(teamId);
      setTasks(fetchedTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error("Failed to fetch tasks");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [teamId]);

  // Heatmap calendar helpers
  const startOfMonth = new Date(
    monthDate.getFullYear(),
    monthDate.getMonth(),
    1
  );
  const endOfMonth = new Date(
    monthDate.getFullYear(),
    monthDate.getMonth() + 1,
    0
  );
  const startDay = startOfMonth.getDay();
  const daysInMonth = endOfMonth.getDate();

  // useEffect(() => {
  //   fetchTasks();
  // }, [teamId]);

  useEffect(() => {
    const loadCounts = async () => {
      if (!teamId) return;
      try {
        const start = new Date(
          monthDate.getFullYear(),
          monthDate.getMonth(),
          1
        );
        const end = new Date(
          monthDate.getFullYear(),
          monthDate.getMonth() + 1,
          1
        );
        const rows = await getTaskCountsByDate(
          teamId,
          start,
          end,
          projectName || undefined
        );

        const map = new Map<string, number>();
        let localMax = 0;
        for (const r of rows) {
          map.set(r.date, r.count);
          if (r.count > localMax) localMax = r.count;
        }
        setCountsByDate(map);
        setMaxCount(localMax);
      } catch (err) {
        console.error("Error loading task counts:", err);
      }
    };
    loadCounts();
  }, [teamId, projectName, monthDate]);

  if (isLoading) {
    return <HomePageSkeleton />;
  }

  const getCellClass = (count: number) => {
    if (!count || count <= 0) return "bg-gray-100";
    const ratio = count / Math.max(1, maxCount);
    if (ratio <= 0.25) return "bg-blue-100";
    if (ratio <= 0.5) return "bg-blue-200";
    if (ratio <= 0.75) return "bg-blue-400";
    return "bg-blue-600";
  };

  const getTextClass = (count: number) => {
    const ratio = count / Math.max(1, maxCount);
    return ratio > 0.5 ? "text-white" : "text-gray-700";
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const cleanDescription = (description?: string | null): string => {
    if (!description) return "No description";
    const stripped = description
      .split(/\r?\n/)
      .filter((line) => !/^\s*(Status:|Priority:)\s*/i.test(line))
      .join("\n")
      .trim();
    return stripped || "No description";
  };

  const extractPriorityFromDescription = (
    description?: string | null
  ): "high" | "medium" | "low" => {
    if (!description) return "medium";
    const match = description.match(
      /Priority:\s*(high|medium|low|hard|urgent|normal|minor)/i
    );
    const raw = match?.[1]?.toLowerCase();
    switch (raw) {
      case "high":
      case "hard":
      case "urgent":
        return "high";
      case "low":
      case "minor":
        return "low";
      case "medium":
      case "normal":
        return "medium";
      default:
        return "medium";
    }
  };

  const formatDate = (date?: Date | null) => {
    if (!date) return "No due date";
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const upcomingTasks = tasks
    .filter((task) => task.dueDate && new Date(task.dueDate) > new Date())
    .sort(
      (a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime()
    )
    .slice(0, 5);

  const recentProjectsToShow = (
    showAllProjects ? recentProjects : recentProjects.slice(0, 5)
  )
    // ensure stable ordering by viewedAt desc when rendering
    .sort((a, b) => (b.viewedAt || 0) - (a.viewedAt || 0));

  return (
    <div className="px-4 md:px-8">
      {/* Quick actions: Create or Join project */}
      <div className="flex justify-end gap-3 py-3">
        <Button
          onClick={openCreateProject}
          className="bg-blue-500 hover:bg-blue-600 text-white"
          size="sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Project
        </Button>
        <Button variant="outline" size="sm" onClick={openJoinTeam}>
          Join Existing
        </Button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 lg:grid-rows-[repeat(2,1fr)] gap-6 p-4 h-screen">
        {/* Recent Projects Section */}
        <Card className="border-2 border-slate-300 flex flex-col">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-semibold text-slate-700">
                Recent Projects
              </CardTitle>
            </div>
          </CardHeader>

          <CardContent className="flex-1 space-y-4 overflow-y-auto">
            {recentProjects.length > 0 ? (
              <div className="space-y-3">
                {recentProjectsToShow.map((proj) => (
                  <div
                    key={`${proj.teamId}-${proj.viewedAt}`}
                    className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => setProject(proj.name, proj.teamId)}
                    title={`Last viewed: ${new Date(
                      proj.viewedAt
                    ).toLocaleString()}`}
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-slate-800 truncate">
                        {proj.name}
                      </h4>
                      <div className="text-[11px] text-gray-500 ml-2 whitespace-nowrap">
                        {new Date(proj.viewedAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </div>
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      Team: {proj.teamId}
                    </div>
                  </div>
                ))}

                {recentProjects.length > 5 && (
                  <div className="pt-1">
                    <Button
                      variant="ghost"
                      className="w-full text-blue-600 hover:underline"
                      onClick={() => setShowAllProjects((v) => !v)}
                    >
                      {showAllProjects ? "See less" : "See more"}
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center text-slate-400 py-8">
                <p>No recent projects yet</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Work Section */}
        <Card className="border-2 border-slate-300 lg:row-span-2 flex flex-col">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-slate-700">
              Upcoming Work
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto">
            {upcomingTasks.length > 0 ? (
              <div className="space-y-3">
                {upcomingTasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-3 border border-gray-200 rounded-lg"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <Badge
                        className={`${getPriorityColor(
                          extractPriorityFromDescription(task.description)
                        )} text-white text-xs px-2 py-1`}
                      >
                        {extractPriorityFromDescription(task.description)}
                      </Badge>
                    </div>
                    <h4 className="font-medium text-slate-800 mb-1">
                      {task.title}
                    </h4>
                    <p className="text-sm text-gray-600 mb-2 break-words overflow-hidden">
                      {cleanDescription(task.description)}
                    </p>
                    <div className="flex items-center text-xs text-gray-500">
                      <Calendar className="w-3 h-3 mr-1" />
                      <span>{formatDate(task.dueDate)}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-slate-400">
                  <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No upcoming work scheduled</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Calendar Section */}
        <Card className="border-2 border-slate-300 flex flex-col">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-slate-700">
              Calendar
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-medium text-slate-700">
                {monthDate.toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </div>
            </div>

            {/* Weekday headers */}
            <div className="grid grid-cols-7 gap-1 text-[10px] text-center text-slate-500 mb-1">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                <div key={d}>{d}</div>
              ))}
            </div>

            {/* Month grid */}
            <div className="grid grid-cols-7 gap-1">
              {/* Leading blanks */}
              {Array.from({ length: startDay }).map((_, idx) => (
                <div key={`blank-${idx}`} className="h-7 w-7" />
              ))}
              {/* Days */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const date = new Date(
                  monthDate.getFullYear(),
                  monthDate.getMonth(),
                  day
                );
                const key = date.toISOString().slice(0, 10);
                const count = countsByDate.get(key) || 0;
                const bg = getCellClass(count);
                const text = getTextClass(count);
                return (
                  <div
                    key={key}
                    title={`${count} task${count === 1 ? "" : "s"}`}
                    className={`h-7 w-7 rounded flex items-center justify-center text-[10px] ${bg} ${text}`}
                  >
                    {day}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modals for project actions */}
      {activeModal === "createProject" && (
        <CreateProjectModal
          isOpen={true}
          onClose={closeModal}
          onProjectCreated={handleProjectCreated}
        />
      )}
      {activeModal === "joinTeam" && (
        <JoinTeamModal
          isOpen={true}
          onClose={closeModal}
          onProjectJoined={handleProjectJoined}
        />
      )}
    </div>
  );
}
