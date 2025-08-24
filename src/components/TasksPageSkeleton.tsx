import React from "react";

export function TasksPageSkeleton() {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200 space-y-4 animate-pulse">
          <div className="h-5 w-28 bg-gray-200 rounded" />
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="h-4 w-24 bg-gray-200 rounded" />
              <div className="h-6 w-10 bg-gray-200 rounded" />
            </div>
            <div className="flex justify-between items-center">
              <div className="h-4 w-24 bg-gray-200 rounded" />
              <div className="h-6 w-10 bg-gray-200 rounded" />
            </div>
            <div className="flex justify-between items-center">
              <div className="h-4 w-28 bg-gray-200 rounded" />
              <div className="h-6 w-10 bg-gray-200 rounded" />
            </div>
          </div>
        </div>

        <div className="p-6 border-b border-gray-200 space-y-3 animate-pulse">
          <div className="h-4 w-24 bg-gray-200 rounded" />
          <div className="h-8 w-full bg-gray-100 rounded" />
          <div className="h-8 w-5/6 bg-gray-100 rounded" />
          <div className="h-8 w-4/6 bg-gray-100 rounded" />
        </div>

        <div className="p-6 space-y-2 animate-pulse">
          <div className="h-4 w-24 bg-gray-200 rounded" />
          <div className="h-8 w-full bg-gray-100 rounded" />
          <div className="h-8 w-full bg-gray-100 rounded" />
          <div className="h-8 w-full bg-gray-100 rounded" />
          <div className="h-8 w-full bg-gray-100 rounded" />
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between animate-pulse">
            <div className="flex items-center space-x-4">
              <div className="h-6 w-36 bg-gray-200 rounded" />
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 bg-gray-100 rounded" />
                <div className="h-8 w-14 bg-gray-100 rounded" />
                <div className="h-8 w-8 bg-gray-100 rounded" />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-8 w-14 bg-gray-100 rounded" />
              <div className="h-8 w-14 bg-gray-100 rounded" />
              <div className="h-8 w-14 bg-gray-100 rounded" />
              <div className="h-8 w-14 bg-gray-100 rounded" />
            </div>
            <div className="flex items-center space-x-4">
              <div className="h-9 w-64 bg-gray-100 rounded" />
              <div className="h-9 w-28 bg-gray-200 rounded" />
            </div>
          </div>
        </div>

        {/* Calendar skeleton grid */}
        <div className="flex-1 overflow-auto p-4">
          <div className="animate-pulse space-y-3">
            <div className="grid grid-cols-8 gap-2">
              <div className="h-10 bg-gray-100 rounded" />
              <div className="h-10 bg-gray-100 rounded" />
              <div className="h-10 bg-gray-100 rounded" />
              <div className="h-10 bg-gray-100 rounded" />
              <div className="h-10 bg-gray-100 rounded" />
              <div className="h-10 bg-gray-100 rounded" />
              <div className="h-10 bg-gray-100 rounded" />
              <div className="h-10 bg-gray-100 rounded" />
            </div>

            <div className="grid grid-cols-8 gap-2">
              <div className="space-y-2">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-16 bg-gray-50 border border-gray-200 rounded"
                  />
                ))}
              </div>
              {Array.from({ length: 7 }).map((_, col) => (
                <div key={col} className="space-y-2">
                  {Array.from({ length: 8 }).map((__, row) => (
                    <div
                      key={row}
                      className="h-16 bg-white border border-gray-200 rounded relative"
                    >
                      {row % 3 === 0 && col % 2 === 0 ? (
                        <div className="absolute inset-1 bg-blue-100 rounded" />
                      ) : null}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
