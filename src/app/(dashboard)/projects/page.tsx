"use client";

import React from "react";
import { Settings, Plus, Calendar, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreateTaskModal } from "@/components/modals/create-task-modal";
import { EditTaskModal } from "@/components/modals/edit-task-modal";
import { CreateColumnModal } from "@/components/modals/create-column-modal";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { InviteTeamModal } from "@/components/modals/invite-team";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ProjectBoardSkeleton } from "@/components/ProjectBoardSkeleton";
import { useProjectsPage } from "@/lib/hooks/useProjectPage";

export default function TasksPage() {
  const {
    // tasks
    isLoading,
    projectName,
    getTasksByStatus,
    getPriorityColor,
    handleCreateTask,
    handleUpdateTask,
    handleDeleteTask,
    handleDropTask,
    // columns
    columns,
    deleteColumn,
    colorOptions,
    handleCreateColumn,
    // dnd tasks
    draggedTask,
    dragOverColumn,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleTaskDragEnter,
    handleTaskDragLeave,
    // columns dnd
    draggedColumnId,
    dragOverColumnId,
    handleColumnDragStart,
    handleColumnDragOver,
    handleColumnDragEnter,
    handleColumnDragLeave,
    handleColumnDrop,
    handleColumnDragEnd,
    // modals
    isTaskModalOpen,
    isEditModalOpen,
    selectedTask,
    openCreateTaskModal,
    closeCreateTaskModal,
    openEditTaskModal,
    closeEditTaskModal,
    // project switching
    projectQuery,
    setProjectQuery,
    filteredProjects,
    dbProjects,
    isInviteOpen,
    setIsInviteOpen,
    isColumnModalOpen,
    setIsColumnModalOpen,
    viewTask,
    setViewTask,
    switchProject,
    deleteProjectByName,
    teamId,
    // utils
    cleanDescription,
  } = useProjectsPage();

  if (isLoading) {
    return <ProjectBoardSkeleton columnCount={columns.length || 4} />;
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="bg-white px-8 py-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-slate-800">Tasks</h1>
          <div className="flex items-center space-x-4">
            {projectName && (
              <div className="rounded-full border border-blue-200 bg-blue-50 text-blue-700 px-4 py-2 text-sm font-medium">
                {projectName}
              </div>
            )}
            <Button
              variant="secondary"
              className="text-sm"
              onClick={() => setIsInviteOpen(true)}
            >
              Invite
            </Button>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="text-sm">
                  Switch Project
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-72">
                <div className="space-y-2">
                  <Input
                    placeholder="Search projects..."
                    value={projectQuery}
                    onChange={(e) => setProjectQuery(e.target.value)}
                  />
                  <div className="max-h-64 overflow-y-auto space-y-1">
                    {filteredProjects.length === 0 ? (
                      <div className="text-sm text-gray-500 px-1 py-2">
                        No projects
                      </div>
                    ) : (
                      filteredProjects.map((p) => (
                        <button
                          key={p.id}
                          className="w-full text-left px-2 py-2 rounded hover:bg-gray-100 text-sm"
                          onClick={() => switchProject(p.name, p.teamId)}
                        >
                          {p.name}
                        </button>
                      ))
                    )}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" title="Manage projects">
                  <Settings className="w-5 h-5" />
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-[520px]">
                <div className="px-2 py-1 text-sm font-semibold text-slate-700">
                  Collaborators
                </div>
                <div className="space-y-3 py-2">
                  {dbProjects.length === 0 ? (
                    <div className="text-sm text-gray-500 px-2">
                      No projects
                    </div>
                  ) : (
                    dbProjects.map((p) => (
                      <div
                        key={p.id}
                        className="border-t border-b border-slate-300 py-2"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-[13px] font-medium text-slate-800">
                              {p.name}
                            </div>
                            <div className="text-[11px] text-slate-500">
                              members…
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="secondary"
                              className="bg-blue-500 hover:bg-blue-600 text-white text-xs"
                              onClick={() => setIsInviteOpen(true)}
                            >
                              Invite
                            </Button>
                            <Button
                              variant="destructive"
                              className="text-xs"
                              onClick={async () => {
                                await deleteProjectByName(p.name);
                              }}
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      <div className="flex-1 p-8">
        <div
          className={`grid gap-6 h-full`}
          style={{
            gridTemplateColumns: `repeat(${
              columns.length + 1
            }, minmax(0, 1fr))`,
          }}
        >
          {columns.map((column) => (
            <div key={column.id} className="flex flex-col">
              <div
                className={`${
                  column.color
                } text-white px-4 py-3 rounded-t-lg flex items-center justify-between ${
                  dragOverColumnId === column.id ? "ring-2 ring-white/70" : ""
                }`}
                draggable
                onDragStart={(e) => handleColumnDragStart(e, column.id)}
                onDragOver={handleColumnDragOver}
                onDragEnter={() => handleColumnDragEnter(column.id)}
                onDragLeave={handleColumnDragLeave}
                onDrop={(e) => handleColumnDrop(e, column.id)}
                onDragEnd={handleColumnDragEnd}
              >
                <div className="flex items-center space-x-2">
                  <span className="font-medium">{column.title}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    className="text-white hover:text-gray-200"
                    onClick={() => deleteColumn(column.id)}
                    title="Delete column"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div
                className={`bg-white border-l border-r border-gray-200 flex-1 p-4 space-y-4 transition-colors ${
                  dragOverColumn === column.id
                    ? "bg-blue-50 border-blue-300"
                    : ""
                }`}
                onDragOver={handleDragOver}
                onDragEnter={() => handleTaskDragEnter(column.id)}
                onDragLeave={handleTaskDragLeave}
                onDrop={(e) => handleDropTask(e, column.id)}
              >
                {getTasksByStatus(column.id).map((task) => (
                  <Card
                    key={task.id}
                    className={`border border-gray-200 hover:shadow-md transition-all cursor-move ${
                      draggedTask?.id === task.id
                        ? "opacity-50 rotate-2 scale-105"
                        : ""
                    }`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task)}
                    onDragEnd={handleDragEnd}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <Badge
                          className={`${getPriorityColor(
                            task.priority
                          )} text-white text-xs px-2 py-1`}
                        >
                          {task.priority}
                        </Badge>
                        <div className="flex space-x-1">
                          <button
                            className="text-gray-400 hover:text-gray-600"
                            onClick={() => openEditTaskModal(task)}
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            className="text-gray-400 hover:text-red-600"
                            onClick={() => handleDeleteTask(task.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <h3 className="font-medium text-slate-800 mb-2 leading-tight">
                        {task.title}
                      </h3>
                      {(() => {
                        const cleaned = cleanDescription(task.description);
                        const base =
                          cleaned === "No description"
                            ? "Description"
                            : cleaned;
                        const preview =
                          base.length > 80 ? base.slice(0, 80) + "..." : base;
                        return (
                          <div className="mb-3">
                            <p className="text-sm text-gray-600 break-words overflow-hidden">
                              {preview}
                            </p>
                            {base !== "Description" && base.length > 80 && (
                              <button
                                type="button"
                                onClick={() =>
                                  setViewTask({
                                    id: task.id,
                                    title: task.title,
                                    description: base,
                                    dueDate: task.dueDate || null,
                                    priority: task.priority,
                                  })
                                }
                                className="text-xs text-blue-600 hover:underline mt-1"
                              >
                                See more
                              </button>
                            )}
                          </div>
                        );
                      })()}
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>
                            {task.dueDate
                              ? new Date(task.dueDate).toLocaleDateString(
                                  "en-US",
                                  {
                                    month: "short",
                                    day: "numeric",
                                  }
                                )
                              : "No due date"}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                <Button
                  onClick={() => {
                    openCreateTaskModal(column.id);
                  }}
                  className="w-full bg-primary text-white py-3 rounded-lg flex items-center justify-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>New Task</span>
                </Button>
              </div>

              <div className="bg-white border border-gray-200 rounded-b-lg h-4"></div>
            </div>
          ))}

          <div className="flex flex-col">
            <div className="bg-gray-100 text-gray-600 px-4 py-3 rounded-t-lg flex items-center justify-center border-2 border-dashed border-gray-300">
              <Button
                onClick={() => setIsColumnModalOpen(true)}
                variant="ghost"
                className="w-full h-full flex items-center justify-center space-x-2 hover:bg-gray-200"
              >
                <Plus className="w-4 h-4" />
                <span className="font-medium">Add Column</span>
              </Button>
            </div>
            <div className="bg-gray-100 border-l border-r border-gray-200 flex-1 p-4"></div>
            <div className="bg-gray-100 border border-gray-200 rounded-b-lg h-4"></div>
          </div>
        </div>
      </div>

      {/* Full Task Description Modal */}
      <Dialog open={!!viewTask} onOpenChange={() => setViewTask(null)}>
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-slate-800">
              {viewTask?.title}
            </DialogTitle>
          </DialogHeader>
          {viewTask && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge
                  className={`${getPriorityColor(
                    viewTask.priority
                  )} text-white text-xs px-2 py-1`}
                >
                  {viewTask.priority}
                </Badge>
                <div className="text-xs text-gray-500 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>
                    {viewTask.dueDate
                      ? new Date(viewTask.dueDate).toLocaleString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "No due date"}
                  </span>
                </div>
              </div>
              <div className="text-sm text-gray-600 whitespace-pre-wrap break-words">
                {cleanDescription(viewTask.description) || "Description"}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <CreateTaskModal
        isOpen={isTaskModalOpen}
        onClose={closeCreateTaskModal}
        onCreateTask={handleCreateTask}
      />
      <InviteTeamModal
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
      />
      <EditTaskModal
        isOpen={isEditModalOpen}
        onClose={closeEditTaskModal}
        task={selectedTask}
        onUpdateTask={handleUpdateTask}
      />
      <CreateColumnModal
        isOpen={isColumnModalOpen}
        onClose={() => setIsColumnModalOpen(false)}
        onCreateColumn={handleCreateColumn}
        colorOptions={colorOptions}
      />
    </div>
  );
}
