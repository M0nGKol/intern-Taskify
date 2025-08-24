import { useState } from "react";
import { Task } from "./useTaskManagement";

export function useDragAndDrop() {
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, task: Task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = "move";
    // Required for Safari to allow drop
    e.dataTransfer.setData("text/plain", task.id);
  };

  const handleDragEnd = () => {
    setDraggedTask(null);
    setDragOverColumn(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDragEnter = (columnId: string) => {
    setDragOverColumn(columnId);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    // Only clear drag over if we're leaving the column entirely
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;

    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setDragOverColumn(null);
    }
  };

  const handleDrop = async (
    e: React.DragEvent,
    targetStatus: Task["status"],
    onStatusUpdate: (taskId: string, status: Task["status"]) => Promise<boolean>
  ) => {
    e.preventDefault();

    if (!draggedTask || draggedTask.status === targetStatus) {
      setDragOverColumn(null);
      return;
    }

    // Clear drag state immediately for better UX
    setDragOverColumn(null);
    setDraggedTask(null);

    try {
      const success = await onStatusUpdate(draggedTask.id, targetStatus);
      
      if (!success) {
        console.error("Failed to update task status");
      }
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  return {
    draggedTask,
    dragOverColumn,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDragEnter,
    handleDragLeave,
    handleDrop,
  };
}