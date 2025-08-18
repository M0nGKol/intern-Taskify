import Sidebar from "@/components/Sidebar";
import { PropsWithChildren } from "react";
import { ProtectedRoute } from "@/components/auth/protected-route";

export default function PageLayout({ children }: PropsWithChildren) {
  return (
    <ProtectedRoute>
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1">{children}</div>
      </div>
    </ProtectedRoute>
  );
}
