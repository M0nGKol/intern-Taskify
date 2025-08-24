import React from "react";

export function HomePageSkeleton() {
  return (
    <div className="px-4 md:px-8 animate-pulse">
      <div className="flex justify-end gap-3 py-3">
        <div className="h-9 w-28 bg-gray-200 rounded" />
        <div className="h-9 w-28 bg-gray-100 rounded" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 lg:grid-rows-[repeat(2,1fr)] gap-6 p-4 h-screen">
        {/* Recent Tasks */}
        <div className="border-2 border-slate-300 rounded-md p-4 flex flex-col">
          <div className="h-5 w-32 bg-gray-200 rounded mb-4" />
          <div className="flex-1 space-y-3 overflow-y-auto">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="p-3 border border-gray-200 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div className="h-4 w-16 bg-gray-200 rounded" />
                  <div className="h-4 w-10 bg-gray-200 rounded" />
                </div>
                <div className="h-4 w-40 bg-gray-200 rounded mb-2" />
                <div className="h-3 w-60 bg-gray-100 rounded mb-1" />
                <div className="h-3 w-48 bg-gray-100 rounded" />
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Work */}
        <div className="border-2 border-slate-300 rounded-md p-4 flex flex-col lg:row-span-2">
          <div className="h-5 w-36 bg-gray-200 rounded mb-4" />
          <div className="flex-1 space-y-3 overflow-y-auto">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="p-3 border border-gray-200 rounded-lg">
                <div className="h-4 w-16 bg-gray-200 rounded mb-2" />
                <div className="h-4 w-48 bg-gray-200 rounded mb-2" />
                <div className="h-3 w-32 bg-gray-100 rounded" />
              </div>
            ))}
          </div>
        </div>

        {/* Calendar */}
        <div className="border-2 border-slate-300 rounded-md p-4">
          <div className="h-5 w-24 bg-gray-200 rounded mb-3" />
          <div className="h-4 w-40 bg-gray-200 rounded mb-3" />
          <div className="grid grid-cols-7 gap-1 text-[10px] text-center mb-1">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="h-3 bg-gray-100 rounded" />
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: 35 }).map((_, i) => (
              <div key={i} className="h-7 w-7 bg-gray-100 rounded" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
