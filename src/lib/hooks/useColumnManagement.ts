import { useState, useEffect } from "react";
import { toast } from "sonner";

export interface Column {
  id: string;
  title: string;
  color: string;
  order: number;
}

const defaultColumns: Column[] = [
  { id: "opens", title: "Opens", color: "bg-slate-600", order: 0 },
  {
    id: "in-progress",
    title: "In Progress",
    color: "bg-blue-600",
    order: 1,
  },
  { id: "evaluation", title: "Evaluation", color: "bg-teal-600", order: 2 },
  { id: "done", title: "Done", color: "bg-green-600", order: 3 },
];

const colorOptions = [
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


export function useColumnManagement() {
  const [columns, setColumns] = useState<Column[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load columns from localStorage on mount
  useEffect(() => {
    const savedColumns = localStorage.getItem("kanban-columns");
    if (savedColumns) {
      try {
        setColumns(JSON.parse(savedColumns));
      } catch (error) {
        console.error("Error parsing saved columns:", error);
        setColumns(defaultColumns);
      }
    } else {
      setColumns(defaultColumns);
    }
    setIsLoading(false);
  }, []);

  // Save columns to localStorage whenever they change
  useEffect(() => {
    if (columns.length > 0) {
      localStorage.setItem("kanban-columns", JSON.stringify(columns));
    }
  }, [columns]);

  const createColumn = (columnData: {
    title: string;
    color?: string;
  }) => {
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

    // Don't allow deleting if it's one of the default columns
    if (defaultColumns.some(defaultCol => defaultCol.id === columnId)) {
      toast.error("Cannot delete default columns");
      return;
    }

    setColumns(columns.filter(col => col.id !== columnId));
    toast.success(`Column "${columnToDelete.title}" deleted successfully`);
  };

  const reorderColumns = (columnId: string, newOrder: number) => {
    const updatedColumns = [...columns];
    const columnIndex = updatedColumns.findIndex(col => col.id === columnId);
    
    if (columnIndex === -1) return;

    const [movedColumn] = updatedColumns.splice(columnIndex, 1);
    updatedColumns.splice(newOrder, 0, movedColumn);

    // Update order property for all columns
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

  return {
    columns: getSortedColumns(),
    isLoading,
    createColumn,
    updateColumn,
    deleteColumn,
    reorderColumns,
    getColumnById,
    colorOptions,
  };
}
