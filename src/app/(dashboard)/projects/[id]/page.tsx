import { getTasksByTeam } from "@/actions/task-action";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, User, FileText } from "lucide-react";

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const tasks = await getTasksByTeam(id);

  // const getPriorityColor = (priority: string) => {
  //   switch (priority) {
  //     case "high":
  //       return "bg-red-500 text-white";
  //     case "medium":
  //       return "bg-yellow-500 text-white";
  //     case "low":
  //       return "bg-green-500 text-white";
  //     default:
  //       return "bg-gray-500 text-white";
  //   }
  // };

  const formatDate = (date: Date | null | undefined) => {
    if (!date) return "No due date";
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDateTime = (date: Date | null | undefined) => {
    if (!date) return "Not set";
    return new Date(date).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Project Tasks
              </h1>
              <p className="text-gray-600 mt-1">Team ID: {id}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Total Tasks</p>
              <p className="text-2xl font-semibold text-gray-900">
                {tasks.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tasks Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {tasks.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No tasks found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              There are no tasks for this team yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map((task) => (
              <Card
                key={task.id}
                className="hover:shadow-lg transition-shadow duration-200"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-2">
                      {task.title}
                    </CardTitle>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Description */}
                  {task.description && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-1">
                        Description
                      </h4>
                      <p className="text-sm text-gray-600 line-clamp-3">
                        {task.description}
                      </p>
                    </div>
                  )}

                  {/* Status */}
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-700">
                      Status:
                    </span>
                    <span className="text-sm text-gray-600 capitalize">
                      {task.status}
                    </span>
                  </div>

                  {/* Due Date */}
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-700">
                      Due:
                    </span>
                    <span className="text-sm text-gray-600">
                      {formatDate(task.dueDate)}
                    </span>
                  </div>

                  {/* Project Name */}
                  {task.projectName && (
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-700">
                        Project:
                      </span>
                      <span className="text-sm text-gray-600">
                        {task.projectName}
                      </span>
                    </div>
                  )}

                  {/* User ID */}
                  {task.userId && (
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-700">
                        Assigned:
                      </span>
                      <span className="text-sm text-gray-600 font-mono">
                        {task.userId}
                      </span>
                    </div>
                  )}

                  {/* Timestamps */}
                  <div className="border-t pt-3 space-y-2">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>Created:</span>
                      </div>
                      <span>{formatDateTime(task.createdAt)}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>Updated:</span>
                      </div>
                      <span>{formatDateTime(task.updatedAt)}</span>
                    </div>
                  </div>

                  {/* Task ID */}
                  <div className="text-xs text-gray-400 font-mono bg-gray-50 px-2 py-1 rounded">
                    ID: {task.id}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
