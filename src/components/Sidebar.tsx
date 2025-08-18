"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Home,
  Rocket,
  CheckSquare,
  FileText,
  Plus,
  Users,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import React from "react";
import { useAuth } from "@/components/providers/auth-provider";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const Sidebar = () => {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Signed out successfully");
      router.push("/sign-in");
    } catch (error) {
      toast.error("Failed to sign out");
    }
  };

  const getUserInitials = () => {
    if (!user?.name) return user?.email?.charAt(0).toUpperCase() || "U";
    return user.name
      .split(" ")
      .map((n) => n.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      <div className="w-20 h-screen bg-primary flex flex-col items-center py-6">
        <nav className="flex flex-col space-y-6">
          <Link
            href="/dashboard"
            className="flex flex-col items-center text-white"
          >
            <Home className="w-6 h-6 mb-1" />
            <span className="text-xs">Home</span>
            <div className="w-8 h-0.5 bg-white mt-2"></div>
          </Link>

          <Link
            href="/projects"
            className="flex flex-col items-center text-gray-400 hover:text-white cursor-pointer"
          >
            <Rocket className="w-6 h-6 mb-1" />
            <span className="text-xs">Projects</span>
          </Link>
          <Link href="/tasks">
            <div className="flex flex-col items-center text-gray-400 hover:text-white cursor-pointer">
              <CheckSquare className="w-6 h-6 mb-1" />
              <span className="text-xs">Tasks</span>
            </div>
          </Link>
          <Link href="/notes">
            <div className="flex flex-col items-center text-gray-400 hover:text-white cursor-pointer">
              <FileText className="w-6 h-6 mb-1" />
              <span className="text-xs">Notes</span>
            </div>
          </Link>
        </nav>

        <div className="mt-auto space-y-4">
          <Avatar className="w-12 h-12 mb-8 cursor-pointer hover:opacity-80 transition-opacity">
            <AvatarImage
              src={user?.image || ""}
              alt={user?.name || user?.email || "User"}
            />
            <AvatarFallback className="bg-gray-400 text-white font-semibold">
              {getUserInitials()}
            </AvatarFallback>
          </Avatar>

          <button
            onClick={handleSignOut}
            className="flex flex-col items-center text-gray-400 hover:text-white cursor-pointer transition-colors"
            title="Sign Out"
          >
            <LogOut className="w-5 h-5 mb-1" />
            <span className="text-xs">Sign Out</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
