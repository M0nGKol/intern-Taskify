import React from "react";

export default function WelcomePage() {
  return (
    <div>
      <main className="flex-1 px-8 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-8 text-center">
            {/* Welcome Section */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                ✨ Welcome to Your Dashboard!
              </h2>
              <p className="text-blue-600 mb-6">
                {
                  "We're excited to have you on board! Here's what you can do to get started:"
                }
              </p>
            </div>

            {/* Action Cards */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  🚀 Create Your First Project
                </h3>
                <p className="text-blue-600">
                  Start organizing your work by clicking "New Project" above.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  👥 Join an Existing Project
                </h3>
                <p className="text-blue-600">
                  Already part of a team? Use "Join Existing" to connect with
                  them.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  ✅ Tasks and Notes Will Appear Here
                </h3>
                <p className="text-blue-600">
                  {
                    "Once you create or join a project, you'll start seeing your tasks and notes here."
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
