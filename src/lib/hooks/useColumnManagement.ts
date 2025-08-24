import { useState, useEffect } from "react";
import { toast } from "sonner";
import { usePersistentProjectState } from "@/lib/hooks/usePersistentProjectState";

export interface Column {
  id: string;
  title: string;
  color: string;
  order: number;
}

export const defaultColumns: Column[] = [
  { id: "opens", title: "Opens", color: "bg-slate-600", order: 0 },
  { id: "in-progress", title: "In Progress", color: "bg-blue-600", order: 1 },
  { id: "evaluation", title: "Evaluation", color: "bg-teal-600", order: 2 },
  { id: "done", title: "Done", color: "bg-green-600", order: 3 },
];

export const colorOptions = [
  "bg-slate-600",
  "bg-blue-600",
  "bg-teal-600",
  "bg-green-600",
  "bg-purple-600",
  "bg-pink-600",
  "bg-orange-600",
  "bg-red-600",
  "bg-indigo-600",
  "bg-cyan-600",
];

export const getColumnsStorageKey = (teamId?: string) =>
  teamId ? `kanban-columns:${teamId}` : "kanban-columns";

export function useColumnManagement() {
  const { teamId } = usePersistentProjectState();
  const [columns, setColumns] = useState<Column[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load columns for current project (team) on mount and when team changes
  useEffect(() => {
    if (typeof window === "undefined") return;
    const key = getColumnsStorageKey(teamId);
    const savedColumns = localStorage.getItem(key);
    if (savedColumns) {
      try {
        setColumns(JSON.parse(savedColumns));
      } catch {
        setColumns(defaultColumns);
      }
    } else {
      setColumns(defaultColumns);
    }
    setIsLoading(false);
  }, [teamId]);

  // Persist columns whenever they change (per team)
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (columns.length === 0) return;
    const key = getColumnsStorageKey(teamId);
    localStorage.setItem(key, JSON.stringify(columns));
  }, [columns, teamId]);

  const createColumn = (columnData: { title: string; color?: string }) => {
    const newColumn: Column = {
      id: `column-${Date.now()}`,
      title: columnData.title,
      color: columnData.color || colorOptions[Math.floor(Math.random() * colorOptions.length)],
      order: columns.length,
    };

    setColumns([...columns, newColumn]);
    toast.success(`Column "${columnData.title}" created successfully`);
    return newColumn;
  };

  const updateColumn = (columnId: string, updates: Partial<Column>) => {
    setColumns(columns.map(col =>
      col.id === columnId ? { ...col, ...updates } : col
    ));
    toast.success("Column updated successfully");
  };

  const deleteColumn = (columnId: string) => {
    const columnToDelete = columns.find(col => col.id === columnId);
    if (!columnToDelete) return;

    const remaining = columns.filter(col => col.id !== columnId);
    const reindexed = remaining.map((col, idx) => ({ ...col, order: idx }));
    setColumns(reindexed);
    toast.success(`Column "${columnToDelete.title}" deleted successfully`);
  };

  const reorderColumns = (columnId: string, newOrder: number) => {
    const updatedColumns = [...columns];
    const columnIndex = updatedColumns.findIndex(col => col.id === columnId);

    if (columnIndex === -1) return;

    const [movedColumn] = updatedColumns.splice(columnIndex, 1);
    updatedColumns.splice(newOrder, 0, movedColumn);

    const reorderedColumns = updatedColumns.map((col, index) => ({
      ...col,
      order: index,
    }));

    setColumns(reorderedColumns);
  };

  const getColumnById = (columnId: string) => {
    return columns.find(col => col.id === columnId);
  };

  const getSortedColumns = () => {
    return [...columns].sort((a, b) => a.order - b.order);
  };

  const resetToDefaultColumns = () => {
    setColumns(defaultColumns);
    try {
      const key = getColumnsStorageKey(teamId);
      localStorage.setItem(key, JSON.stringify(defaultColumns));
    } catch {}
    toast.success("Columns reset to defaults");
  };

  return {
    columns: getSortedColumns(),
    isLoading,
    createColumn,
    updateColumn,
    deleteColumn,
    reorderColumns,
    getColumnById,
    colorOptions,
    resetToDefaultColumns,
  };
}