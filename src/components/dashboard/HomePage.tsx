import React, { useState, useEffect } from "react";
import { Calendar, Clock, Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { getTasksByTeam } from "@/actions/task-action";
import { usePersistentProjectState } from "@/lib/hooks/usePersistentProjectState";
import { toast } from "sonner";

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
  const { teamId } = usePersistentProjectState();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  const extractPriorityFromDescription = (
    description?: string | null
  ): string => {
    if (!description) return "medium";
    const priorityMatch = description.match(/Priority: (high|medium|low)/);
    return priorityMatch?.[1] || "medium";
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

  const recentTasks = tasks
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

  return (
    <div className="px-4 md:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 lg:grid-rows-[repeat(2,1fr)] gap-6 p-4 h-screen">
        {/* Tasks Section */}
        <Card className="border-2 border-slate-300 flex flex-col">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-semibold text-slate-700">
                Recent Tasks
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="flex-1 space-y-4 overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              </div>
            ) : recentTasks.length > 0 ? (
              recentTasks.map((task) => (
                <div
                  key={task.id}
                  className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-start justify-between mb-2">
                    <Badge
                      className={`${getPriorityColor(
                        extractPriorityFromDescription(task.description)
                      )} text-white text-xs px-2 py-1`}
                    >
                      {extractPriorityFromDescription(task.description)}
                    </Badge>
                    <div className="flex space-x-1">
                      <button className="text-gray-400 hover:text-gray-600">
                        <Edit className="w-3 h-3" />
                      </button>
                      <button className="text-gray-400 hover:text-red-600">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  <h4 className="font-medium text-slate-800 mb-1">
                    {task.title}
                  </h4>
                  <p className="text-sm text-gray-600 mb-2">
                    {task.description
                      ?.replace(/Status:.*Priority:.*/g, "")
                      .trim() || "No description"}
                  </p>
                  <div className="flex items-center text-xs text-gray-500">
                    <Calendar className="w-3 h-3 mr-1" />
                    <span>{formatDate(task.dueDate)}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-slate-400 py-8">
                <p>No tasks yet</p>
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
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              </div>
            ) : upcomingTasks.length > 0 ? (
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
                    <p className="text-sm text-gray-600 mb-2">
                      {task.description
                        ?.replace(/Status:.*Priority:.*/g, "")
                        .trim() || "No description"}
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
          <CardContent className="flex-1 flex items-center justify-center">
            <div className="text-center text-slate-400">
              <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Calendar view coming soon</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
