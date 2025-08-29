"use client";
import React from "react";

export default function WelcomePage() {
  return (
    <div className="px-4 md:px-8">
      <main className="flex-1 px-8 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-8 text-center">
            {/* Welcome Section */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                ✨ Welcome to Your Dashboard!
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Were excited to have you on board! Get started by creating a new
                project or joining an existing team.
              </p>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="text-center p-6 rounded-lg border-2 border-primary">
                <div className="text-4xl mb-3">🚀</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Create Projects
                </h3>
                <p className="text-gray-600 text-sm ">
                  Start organizing your work by creating your first project and
                  adding tasks.
                </p>
              </div>

              <div className="text-center p-6 rounded-lg border-2 border-primary">
                <div className="text-4xl mb-3">👥</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Collaborate
                </h3>
                <p className="text-gray-600 text-sm">
                  Join existing teams and work together on shared projects and
                  goals.
                </p>
              </div>

              <div className="text-center p-6 rounded-lg border-2 border-primary">
                <div className="text-4xl mb-3">✅</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Track Progress
                </h3>
                <p className="text-gray-600 text-sm">
                  Monitor your tasks, deadlines, and team progress all in one
                  place.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
