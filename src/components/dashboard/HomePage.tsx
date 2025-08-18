import React from "react";
import { Calendar, Clock } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface HomePageProps {
  projectName: string;
}

export default function HomePage({ projectName }: HomePageProps) {
  const tasks = [{ name: "Project", date: "Mar 14" }];

  return (
    <div className="px-4 md:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 lg:grid-rows-[repeat(2,1fr)] gap-6 p-4 h-screen">
        {/* Tasks Section */}
        <Card className="border-2 border-slate-300 flex flex-col">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold text-slate-700">
              Tasks
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 space-y-4">
            {/* your tasks here */}
          </CardContent>
        </Card>

        {/* Upcoming Work Section */}
        <Card className="border-2 border-slate-300 lg:row-span-2 flex flex-col">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-slate-700">
              Upcoming Work
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex items-center justify-center">
            <div className="text-center text-slate-400">
              <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No upcoming work scheduled</p>
            </div>
          </CardContent>
        </Card>

        {/* Calendar Section */}
        <Card className="border-2 border-slate-300 flex flex-col">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-slate-700">
              Calendar
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex items-center justify-center">
            <div className="text-center text-slate-400">
              <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Calendar view coming soon</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
