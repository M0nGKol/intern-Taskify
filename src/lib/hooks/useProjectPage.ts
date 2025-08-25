import { useState, useEffect, useMemo, useCallback } from "react";
import { useTaskManagement } from "@/lib/hooks/useTaskManagement";
import { useColumnManagement } from "@/lib/hooks/useColumnManagement";
import { useDragAndDrop } from "@/lib/hooks/useDragAndDrop";
import { useModalManagement } from "@/lib/hooks/useModalManagement";
import { usePersistentProjectState } from "@/lib/hooks/usePersistentProjectState";
import { getAllProjects, deleteProjectById } from "@/actions/project-action";

type ViewTask = {
  id: string;
  title: string;
  description?: string | null;
  dueDate?: Date | null;
  priority: "high" | "medium" | "low";
} | null;

export function useProjectsPage() {
  // Base hooks
  const {
    isLoading,
    projectName,
    createTask,
    updateTaskById,
    deleteTaskById,
    updateTaskStatusById,
    getTasksByStatus,
    getPriorityColor,
  } = useTaskManagement();

  const {
    columns,
    createColumn,
    deleteColumn,
    colorOptions,
    reorderColumns,
  } = useColumnManagement();

  const {
    draggedTask,
    dragOverColumn,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDragEnter: handleTaskDragEnter,
    handleDragLeave: handleTaskDragLeave,
    handleDrop,
  } = useDragAndDrop();

  const {
    isTaskModalOpen,
    isEditModalOpen,
    selectedStatus,
    selectedTask,
    openCreateTaskModal,
    closeCreateTaskModal,
    openEditTaskModal,
    closeEditTaskModal,
  } = useModalManagement();

  const { setProject, teamId } = usePersistentProjectState();

  // UI state
  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [viewTask, setViewTask] = useState<ViewTask>(null);

  // Column drag state
  const [draggedColumnId, setDraggedColumnId] = useState<string | null>(null);
  const [dragOverColumnId, setDragOverColumnId] = useState<string | null>(null);

  // Project list state
  const [projectQuery, setProjectQuery] = useState("");
  const [dbProjects, setDbProjects] = useState<{ id: string; name: string; teamId: string }[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const list = await getAllProjects();
        setDbProjects(list);
      } catch {}
    };
    load();
  }, []);

  const filteredProjects = useMemo(
    () =>
      dbProjects.filter((p) =>
        p.name.toLowerCase().includes(projectQuery.toLowerCase())
      ),
    [dbProjects, projectQuery]
  );

  // Handlers
  const handleCreateTask = useCallback(
    async (taskData: {
      title: string;
      description?: string;
      dueDate?: Date;
      priority: "high" | "medium" | "low";
    }) => {
      const success = await createTask({
        ...taskData,
        status: selectedStatus,
      });
      if (success) {
        closeCreateTaskModal();
      }
    },
    [createTask, selectedStatus, closeCreateTaskModal]
  );

  const handleUpdateTask = useCallback(
    async (taskData: {
      title: string;
      description?: string;
      dueDate?: Date;
      priority: "high" | "medium" | "low";
    }) => {
      if (!selectedTask) return;
      const success = await updateTaskById(
        selectedTask.id,
        taskData,
        selectedTask.status
      );
      if (success) {
        closeEditTaskModal();
      }
    },
    [selectedTask, updateTaskById, closeEditTaskModal]
  );

  const handleDeleteTask = useCallback(
    async (taskId: string) => {
      await deleteTaskById(taskId);
    },
    [deleteTaskById]
  );

  const handleDropTask = useCallback(
    async (e: React.DragEvent, targetStatus: string) => {
      await handleDrop(e, targetStatus, updateTaskStatusById);
    },
    [handleDrop, updateTaskStatusById]
  );

  const handleCreateColumn = useCallback(
    (columnData: { title: string; color: string }) => {
      createColumn(columnData);
      setIsColumnModalOpen(false);
    },
    [createColumn]
  );

  const cleanDescription = useCallback((description?: string | null): string => {
    if (!description) return "No description";
    const stripped = description
      .split(/\r?\n/)
      .filter((line) => !/^\s*(Status:|Priority:)\s*/i.test(line))
      .join("\n")
      .trim();
    return stripped || "No description";
  }, []);

  // Column drag handlers
  const handleColumnDragStart = useCallback(
    (e: React.DragEvent, columnId: string) => {
      setDraggedColumnId(columnId);
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/column", columnId);
    },
    []
  );

  const handleColumnDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);

  const handleColumnDragEnter = useCallback((columnId: string) => {
    setDragOverColumnId(columnId);
  }, []);

  const handleColumnDragLeave = useCallback(() => {
    setDragOverColumnId(null);
  }, []);

  const handleColumnDrop = useCallback(
    (e: React.DragEvent, targetColumnId: string) => {
      e.preventDefault();
      const sourceId =
        draggedColumnId || e.dataTransfer.getData("text/column") || "";
      if (!sourceId) return;

      const targetIndex = columns.findIndex((c) => c.id === targetColumnId);
      if (targetIndex < 0) return;

      reorderColumns(sourceId, targetIndex);

      setDraggedColumnId(null);
      setDragOverColumnId(null);
    },
    [draggedColumnId, columns, reorderColumns]
  );

  const handleColumnDragEnd = useCallback(() => {
    setDraggedColumnId(null);
    setDragOverColumnId(null);
  }, []);

  // Project actions
  const switchProject = useCallback(
    (name: string, selectedTeamId?: string) =>
      setProject(name, selectedTeamId || teamId || ""),
    [setProject, teamId]
  );

  const deleteProjectByName = useCallback(
    async (name: string) => {
      try {
        const match = dbProjects.find((p) => p.name === name);
        if (!match) return;
        await deleteProjectById(match.id);
        setDbProjects((prev) => prev.filter((p) => p.id !== match.id));
      } catch {}
    },
    [dbProjects]
  );

  return {
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
    reorderColumns,
    handleCreateColumn,

    // DnD for tasks
    draggedTask,
    dragOverColumn,
    handleDragStart,
    handleDragEnd,
    handleTaskDragEnter,
    handleTaskDragLeave,
    handleDragOver,

    // DnD for columns
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

    // project switching/list
    teamId,
    projectQuery,
    setProjectQuery,
    filteredProjects,
    dbProjects,
    switchProject,
    deleteProjectByName,

    // misc ui state
    isColumnModalOpen,
    setIsColumnModalOpen,
    isInviteOpen,
    setIsInviteOpen,
    viewTask,
    setViewTask,

    // utils
    cleanDescription,
  };
}