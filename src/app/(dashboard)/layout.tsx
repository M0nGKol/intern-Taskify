import Sidebar from "@/components/Sidebar";
import { PropsWithChildren } from "react";
export default function PageLayout({ children }: PropsWithChildren) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1">{children}</div>
    </div>
  );
}
