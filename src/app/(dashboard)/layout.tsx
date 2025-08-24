// src/app/(dashboard)/layout.tsx
import Sidebar from "@/components/Sidebar";
import { PropsWithChildren } from "react";

export default function PageLayout({ children }: PropsWithChildren) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 h-full overflow-y-auto">{children}</div>
    </div>
  );
}
