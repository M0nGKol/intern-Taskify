import { useState } from "react";

export function useModalManagement() {
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>("opens");
  const [selectedTask, setSelectedTask] = useState<any>(null);
  

  const openCreateTaskModal = (status?: string) => {
    if (status) {
      setSelectedStatus(status);
    }
    setIsTaskModalOpen(true);
  };

  const closeCreateTaskModal = () => {
    setIsTaskModalOpen(false);
  };

  const openEditTaskModal = (task: any) => {
    setSelectedTask(task);
    setIsEditModalOpen(true);
  };

  const closeEditTaskModal = () => {
    setIsEditModalOpen(false);
    setSelectedTask(null);
  };
  

  return {
    isTaskModalOpen,
    isEditModalOpen,
    selectedStatus,
    selectedTask,
    openCreateTaskModal,
    closeCreateTaskModal,
    openEditTaskModal,
    closeEditTaskModal,
  };
}