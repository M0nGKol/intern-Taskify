"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, FileText, Tag } from "lucide-react";
import { cn } from "@/lib/utils";

// Define the task type that matches what we're actually using
interface TaskDetails {
  id: string;
  title: string;
  description?: string | null;
  status: string;
  priority?: string | null;
  dueDate?: Date | null;
  projectName?: string | null;
  userId?: string | null;
  teamId: string;
  createdAt: Date;
  updatedAt: Date;
  completed?: boolean;
}

interface TaskDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: TaskDetails | null;
  onEdit?: () => void;
  onDelete?: () => void;
  canEdit?: boolean;
  canDelete?: boolean;
}

export function TaskDetailsModal({
  isOpen,
  onClose,
  task,
  onEdit,
  onDelete,
  canEdit = false,
  canDelete = false,
}: TaskDetailsModalProps) {
  if (!task) return null;

  const getPriorityColor = (priority?: string | null) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "in-progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "opens":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatDate = (date?: Date | null) => {
    if (!date) return "No due date";
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (date?: Date | null) => {
    if (!date) return "No time set";
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-900">
            Task Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Task Title */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {task.title}
            </h3>
          </div>

          {/* Task Description */}
          {task.description && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <FileText className="w-4 h-4" />
                Description
              </div>
              <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                {task.description}
              </p>
            </div>
          )}

          {/* Task Metadata */}
          <div className="space-y-3">
            {/* Priority */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Tag className="w-4 h-4" />
                Priority
              </div>
              <Badge
                variant="outline"
                className={cn("text-xs", getPriorityColor(task.priority))}
              >
                {task.priority || "medium"}
              </Badge>
            </div>

            {/* Status */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Clock className="w-4 h-4" />
                Status
              </div>
              <Badge
                variant="outline"
                className={cn("text-xs", getStatusColor(task.status))}
              >
                {task.status}
              </Badge>
            </div>

            {/* Due Date */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Calendar className="w-4 h-4" />
                Due Date
              </div>
              <div className="text-sm text-gray-600">
                {formatDate(task.dueDate)}
              </div>
            </div>

            {/* Due Time */}
            {task.dueDate && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Clock className="w-4 h-4" />
                  Due Time
                </div>
                <div className="text-sm text-gray-600">
                  {formatTime(task.dueDate)}
                </div>
              </div>
            )}

            {/* Project */}
            {task.projectName && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Tag className="w-4 h-4" />
                  Project
                </div>
                <div className="text-sm text-blue-600 font-medium">
                  {task.projectName}
                </div>
              </div>
            )}
          </div>

          {/* Created/Updated Info */}
          <div className="pt-4 border-t border-gray-200">
            <div className="text-xs text-gray-500 space-y-1">
              <div>Created: {formatDate(task.createdAt)}</div>
              <div>Updated: {formatDate(task.updatedAt)}</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          {canEdit && onEdit && <Button onClick={onEdit}>Edit Task</Button>}
          {canDelete && onDelete && (
            <Button variant="destructive" onClick={onDelete}>
              Delete Task
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
