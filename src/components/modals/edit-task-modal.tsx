"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: Date;
  teamId: string;
  projectName?: string;
  userId?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface EditTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task?: Task;
  onUpdateTask?: (taskData: {
    title: string;
    description?: string;
    dueDate?: Date;
    priority: "high" | "medium" | "low";
  }) => void;
}

export function EditTaskModal({
  isOpen,
  onClose,
  task,
  onUpdateTask,
}: EditTaskModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState<Date | undefined>();
  const [priority, setPriority] = useState<"high" | "medium" | "low">("medium");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Extract priority from description
  const extractPriorityFromDescription = (
    description?: string
  ): "high" | "medium" | "low" => {
    if (!description) return "medium";
    const priorityMatch = description.match(/Priority: (high|medium|low)/);
    return (priorityMatch?.[1] as "high" | "medium" | "low") || "medium";
  };

  // Extract clean description (without status and priority metadata)
  const extractCleanDescription = (description?: string): string => {
    if (!description) return "";
    return description.replace(/Status:.*Priority:.*/, "").trim();
  };

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(extractCleanDescription(task.description));
      setDueDate(task.dueDate);
      setPriority(extractPriorityFromDescription(task.description));
    }
  }, [task]);

  const handleClose = () => {
    setTitle("");
    setDescription("");
    setDueDate(undefined);
    setPriority("medium");
    setIsSubmitting(false);
    onClose();
  };

  const handleSave = async () => {
    if (!title.trim()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await onUpdateTask?.({
        title: title.trim(),
        description: description.trim() || undefined,
        dueDate,
        priority,
      });

      handleClose();
    } catch (error) {
      console.error("Error updating task:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-slate-700">
            Edit Task
          </DialogTitle>
          <p className="text-sm text-slate-500">Make changes to your task</p>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600">
              Title<span className="text-red-500">*</span>
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="rounded-xl border-slate-300"
              placeholder="Enter task title"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600">
              Description
            </label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description..."
              className="rounded-xl border-slate-300 min-h-[120px] resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-600">
                Due Date
              </label>
              <Popover modal>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal rounded-xl border-slate-300",
                      !dueDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dueDate ? (
                      dueDate.toLocaleDateString()
                    ) : (
                      <span className="text-gray-500">dd/mm/yyyy</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dueDate}
                    onDayClick={setDueDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-600">
                Priority<span className="text-red-500">*</span>
              </label>
              <Select
                value={priority}
                onValueChange={(value: "high" | "medium" | "low") =>
                  setPriority(value)
                }
              >
                <SelectTrigger className="rounded-xl border-slate-300">
                  <SelectValue placeholder="Select priority" />
                  <ChevronDown className="w-4 h-4" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High Priority</SelectItem>
                  <SelectItem value="medium">Medium Priority</SelectItem>
                  <SelectItem value="low">Low Priority</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            onClick={handleSave}
            disabled={!title.trim() || isSubmitting}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-xl py-3 text-base font-medium"
          >
            {isSubmitting ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Saving...</span>
              </div>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
