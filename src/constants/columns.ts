// Column interface and defaults
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
    "bg-purple-600",
    "bg-green-600",
    "bg-red-600",
    "bg-yellow-600",
    "bg-pink-600",
  ];