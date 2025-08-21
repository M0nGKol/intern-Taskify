"use client";

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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User, Calendar, Clock, ChevronDown } from "lucide-react";
import { useState } from "react";

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateTask?: (taskData: {
    title: string;
    description?: string;
    dueDate?: Date;
    priority: "high" | "medium" | "low";
  }) => void;
}

export function CreateTaskModal({
  isOpen,
  onClose,
  onCreateTask,
}: CreateTaskModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string>("09:00"); // 24h default
  const [priority, setPriority] = useState<"high" | "medium" | "low">("medium");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClose = () => {
    setTitle("");
    setDescription("");
    setSelectedDate(undefined);
    setSelectedTime("09:00");
    setPriority("medium");
    setIsSubmitting(false);
    onClose();
  };

  const handleSubmit = async () => {
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      let composedDueDate: Date | undefined = undefined;
      if (selectedDate) {
        const [h, m] = (selectedTime || "09:00")
          .split(":")
          .map((v) => parseInt(v, 10));
        const d = new Date(selectedDate);
        d.setHours(isNaN(h) ? 9 : h, isNaN(m) ? 0 : m, 0, 0); // store as local 24h
        composedDueDate = d;
      }

      await onCreateTask?.({
        title: title.trim(),
        description: description.trim() || undefined,
        dueDate: composedDueDate,
        priority,
      });

      handleClose();
    } catch (error) {
      console.error("Error creating task:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-slate-800">
            Create new Task
          </DialogTitle>
          <p className="text-gray-600">Fill the details for your task.</p>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Title<span className="text-red-500">*</span>
            </label>
            <Input
              placeholder="Enter task title"
              className="w-full"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Description
            </label>
            <Textarea
              placeholder="Description..."
              className="min-h-[120px] resize-none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Due Date
              </label>
              <Popover modal>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal bg-transparent"
                  >
                    <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                    {selectedDate ? (
                      selectedDate.toLocaleDateString()
                    ) : (
                      <span className="text-gray-500">dd/mm/yyyy</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={selectedDate}
                    onDayClick={setSelectedDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Time (24h)
              </label>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <Input
                  type="time"
                  step={300}
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Priority<span className="text-red-500">*</span>
            </label>
            <Select
              value={priority}
              onValueChange={(value: "high" | "medium" | "low") =>
                setPriority(value)
              }
            >
              <SelectTrigger>
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

          <div className="flex items-center justify-between pt-4">
            <div className="flex items-center space-x-2 text-gray-600">
              <User className="w-5 h-5" />
              <span>Assign to</span>
            </div>

            <Button
              className="bg-blue-400 hover:bg-blue-500 text-white px-8 py-2 rounded-lg flex items-center space-x-2"
              onClick={handleSubmit}
              disabled={!title.trim() || isSubmitting}
            >
              {isSubmitting ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <span>✓</span>
              )}
              <span>{isSubmitting ? "Creating..." : "Create Task"}</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
