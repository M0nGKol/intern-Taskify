import Sidebar from "@/components/Sidebar";
import { PropsWithChildren } from "react";
import { ProtectedRoute } from "@/components/auth/protected-route";

export default function PageLayout({ children }: PropsWithChildren) {
  return (
    <ProtectedRoute>
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <div className="flex-1 h-full overflow-y-auto">{children}</div>
      </div>
    </ProtectedRoute>
  );
}
