import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Home, Rocket, CheckSquare, FileText, Plus, Users } from "lucide-react";
import Link from "next/link";
import React from "react";

const Sidebar = () => {
  return (
    <>
      <div className="w-20 h-screen bg-primary flex flex-col items-center py-6">
        <Avatar className="w-12 h-12 mb-8">
          <AvatarImage src="/placeholder.svg?height=48&width=48" />
          <AvatarFallback className="bg-gray-400">M</AvatarFallback>
        </Avatar>

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

          <div className="flex flex-col items-center text-gray-400 hover:text-white cursor-pointer">
            <CheckSquare className="w-6 h-6 mb-1" />
            <span className="text-xs">Tasks</span>
          </div>

          <div className="flex flex-col items-center text-gray-400 hover:text-white cursor-pointer">
            <FileText className="w-6 h-6 mb-1" />
            <span className="text-xs">Notes</span>
          </div>
        </nav>

        <div className="mt-auto">
          <Avatar className="w-10 h-10">
            <AvatarImage src="/placeholder.svg?height=40&width=40" />
            <AvatarFallback className="bg-gray-600">🐾</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
