import React from "react";
import { Calendar } from "lucide-react";
import { Button } from "../ui/button";

interface HomePageProps {
  projectName: string;
}

export default function HomePage({ projectName }: HomePageProps) {
  return (
    <div className="px-8 mx-4">
      <div className="grid grid-cols-2 gap-8 h-20">
        {/* Left Column */}
        <div className="space-y-8">
          {/* Tasks Section */}
          <div className="bg-white rounded-lg border-2 border-slate-300 p-6 h-80">
            <h3 className="text-xl font-semibold text-slate-700 mb-6">Tasks</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-gray-200">
                <span className="text-gray-600 truncate pr-4 flex-1">
                  {projectName}
                </span>
                <div className="flex items-center text-gray-500 text-sm flex-shrink-0">
                  <Calendar className="w-4 h-4 mr-1" />
                  Mar 14
                </div>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-200">
                <span className="text-gray-600 truncate pr-4 flex-1">
                  {projectName}
                </span>
                <div className="flex items-center text-gray-500 text-sm flex-shrink-0">
                  <Calendar className="w-4 h-4 mr-1" />
                  Mar 16
                </div>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-200">
                <span className="text-gray-600 truncate pr-4 flex-1">
                  {projectName}
                </span>
                <div className="flex items-center text-gray-500 text-sm flex-shrink-0">
                  <Calendar className="w-4 h-4 mr-1" />
                  Mar 18
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <Button className="bg-slate-700 hover:bg-slate-800 text-white px-6 py-2 rounded-full">
                See all
              </Button>
            </div>
          </div>

          {/* Calendar Section */}
          <div className="bg-white rounded-lg border-2 border-slate-300 p-6 h-80">
            <h3 className="text-xl font-semibold text-slate-700 mb-6">
              Calendar
            </h3>
            <div className="h-full flex items-center justify-center text-gray-400">
              {/* Calendar content would go here */}
            </div>
          </div>
        </div>

        {/* Right Column - Upcoming Work */}
        <div className="bg-white rounded-lg border-2 border-blue-400 p-6">
          <h3 className="text-xl font-semibold text-slate-700 mb-6">
            Upcoming Work
          </h3>
          <div className="h-full flex items-center justify-center text-gray-400">
            {/* Upcoming work content would go here */}
          </div>
        </div>
      </div>
    </div>
  );
}
