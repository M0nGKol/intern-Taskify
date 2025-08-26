import { useState, useMemo, useEffect } from "react";
import type { Task } from "@/constants/data";
// import { getProjectsByTeam } from "@/actions/project-action";
import { usePersistentProjectState } from "@/lib/hooks/usePersistentProjectState";

export type ViewType = "day" | "week" | "month" | "year";
export type PriorityFilter = "all" | "high" | "medium" | "low";

export interface CalendarTask extends Task {
  startTime?: string;
  endTime?: string;
  position?: number;
  width?: number;
}

export function useCalendar(tasks: Task[]) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewType, setViewType] = useState<ViewType>("week");
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>("all");
  const [projectFilter, setProjectFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { teamId, projectName } = usePersistentProjectState();
  const [dbProjects, setDbProjects] = useState<string[]>([]);

  // useEffect(() => {
  //   const load = async () => {
  //     if (!teamId) return;
  //     try {
  //       const list = await getProjectsByTeam(teamId);
  //       setDbProjects(list.map((p) => p.name));
  //     } catch {}
  //   };
  //   load();
  // }, [teamId]);

  // Keep calendar project filter in sync with selected project
  // useEffect(() => {
  //   if (projectName && projectName.length > 0) {
  //     setProjectFilter(projectName);
  //   } else {
  //     setProjectFilter("all");
  //   }
  // }, [projectName]);

  // Get unique projects for filtering
  const projects = useMemo(() => {
    const projectSet = new Set<string>(dbProjects);
    tasks.forEach(task => {
      if (task.projectName) {
        projectSet.add(task.projectName);
      }
    });
    return Array.from(projectSet);
  }, [tasks, dbProjects]);

  // Filter tasks based on current filters
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter;
      const matchesProject = projectFilter === "all" || task.projectName === projectFilter;
      const matchesSearch = searchQuery === "" || 
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));
      
      return matchesPriority && matchesProject && matchesSearch;
    });
  }, [tasks, priorityFilter, projectFilter, searchQuery]);

  // Calendar navigation
  const goToToday = () => setCurrentDate(new Date());
  
  const goToPrevious = () => {
    const newDate = new Date(currentDate);
    if (viewType === "week") {
      newDate.setDate(newDate.getDate() - 7);
    } else if (viewType === "month") {
      newDate.setMonth(newDate.getMonth() - 1);
    } else if (viewType === "day") {
      newDate.setDate(newDate.getDate() - 1);
    }
    setCurrentDate(newDate);
  };
  
  const goToNext = () => {
    const newDate = new Date(currentDate);
    if (viewType === "week") {
      newDate.setDate(newDate.getDate() + 7);
    } else if (viewType === "month") {
      newDate.setMonth(newDate.getMonth() + 1);
    } else if (viewType === "day") {
      newDate.setDate(newDate.getDate() + 1);
    }
    setCurrentDate(newDate);
  };

  // Get week dates for week view
  const getWeekDates = () => {
    const startOfWeek = new Date(currentDate);
    const day = startOfWeek.getDay();
    startOfWeek.setDate(startOfWeek.getDate() - day);
    
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(date.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  // Get tasks for a specific date
  const getTasksForDate = (date: Date) => {
    const tasksForDate = filteredTasks.filter(task => {
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate);
      return taskDate.toDateString() === date.toDateString();
    });

    // Sort tasks by time
    return tasksForDate.sort((a, b) => {
      if (!a.dueDate || !b.dueDate) return 0;
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });
  };

  // Get tasks for a specific time slot with Google Calendar style positioning
  const getTasksForTimeSlot = (date: Date, hour: number) => {
    const tasksForDate = getTasksForDate(date);
    
    // Get tasks that fall within this hour
    const tasksInHour = tasksForDate.filter(task => {
      if (!task.dueDate) return false;
      const taskHour = new Date(task.dueDate).getHours();
      return taskHour === hour;
    });

    // Sort by minute for proper stacking
    return tasksInHour.sort((a, b) => {
      if (!a.dueDate || !b.dueDate) return 0;
      const aMinute = new Date(a.dueDate).getMinutes();
      const bMinute = new Date(b.dueDate).getMinutes();
      return aMinute - bMinute;
    });
  };

  // Get current month and year for display
  const getCurrentMonthYear = () => {
    return currentDate.toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    });
  };

  // Get current week range for display
  const getCurrentWeekRange = () => {
    const weekDates = getWeekDates();
    const startDate = weekDates[0];
    const endDate = weekDates[6];
    
    const startMonth = startDate.toLocaleDateString('en-US', { month: 'short' });
    const endMonth = endDate.toLocaleDateString('en-US', { month: 'short' });
    
    if (startMonth === endMonth) {
      return `${startMonth} ${startDate.getDate()} - ${endDate.getDate()}, ${startDate.getFullYear()}`;
    } else {
      return `${startMonth} ${startDate.getDate()} - ${endMonth} ${endDate.getDate()}, ${startDate.getFullYear()}`;
    }
  };

  // Get task summary statistics
  const taskSummary = useMemo(() => {
    const total = filteredTasks.length;
    const completed = filteredTasks.filter(task => task.status === "completed").length;
    const highPriority = filteredTasks.filter(task => task.priority === "high").length;
    const mediumPriority = filteredTasks.filter(task => task.priority === "medium").length;
    const lowPriority = filteredTasks.filter(task => task.priority === "low").length;
    
    return { total, completed, highPriority, mediumPriority, lowPriority };
  }, [filteredTasks]);

  return {
    currentDate,
    viewType,
    priorityFilter,
    projectFilter,
    searchQuery,
    projects,
    filteredTasks,
    taskSummary,
    setCurrentDate,
    setViewType,
    setPriorityFilter,
    setProjectFilter,
    setSearchQuery,
    goToToday,
    goToPrevious,
    goToNext,
    getWeekDates,
    getTasksForDate,
    getTasksForTimeSlot,
    getCurrentMonthYear,
    getCurrentWeekRange,
  };
}