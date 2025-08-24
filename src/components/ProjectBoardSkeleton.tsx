import React from "react";

interface ProjectBoardSkeletonProps {
  columnCount?: number;
  cardsPerColumn?: number;
}

export function ProjectBoardSkeleton({
  columnCount = 4,
  cardsPerColumn = 3,
}: ProjectBoardSkeletonProps) {
  return (
    <div className="flex-1 flex flex-col">
      <div className="bg-white px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
          <div className="flex items-center space-x-4">
            <div className="h-8 w-20 bg-gray-200 rounded animate-pulse" />
            <div className="h-8 w-28 bg-gray-200 rounded animate-pulse" />
            <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse" />
          </div>
        </div>
      </div>

      <div className="flex-1 p-8">
        <div
          className="grid gap-6 h-full"
          style={{
            gridTemplateColumns: `repeat(${
              (columnCount || 4) + 1
            }, minmax(0, 1fr))`,
          }}
        >
          {Array.from({ length: columnCount || 4 }).map((_, i) => (
            <div key={i} className="flex flex-col">
              <div className="bg-gray-300 px-4 py-3 rounded-t-lg" />
              <div className="bg-white border-l border-r border-gray-200 flex-1 p-4 space-y-4">
                {Array.from({ length: cardsPerColumn }).map((__, j) => (
                  <div
                    key={j}
                    className="border border-gray-200 rounded-md p-4"
                  >
                    <div className="animate-pulse space-y-3">
                      <div className="h-4 w-16 bg-gray-200 rounded" />
                      <div className="h-4 w-3/4 bg-gray-200 rounded" />
                      <div className="h-3 w-1/2 bg-gray-200 rounded" />
                    </div>
                  </div>
                ))}
                <div className="h-10 w-full bg-gray-100 border rounded-lg animate-pulse" />
              </div>
              <div className="bg-white border border-gray-200 rounded-b-lg h-4" />
            </div>
          ))}

          <div className="flex flex-col">
            <div className="bg-gray-100 px-4 py-3 rounded-t-lg border-2 border-dashed border-gray-300" />
            <div className="bg-gray-100 border-l border-r border-gray-200 flex-1 p-4">
              <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="bg-gray-100 border border-gray-200 rounded-b-lg h-4" />
          </div>
        </div>
      </div>
    </div>
  );
}
