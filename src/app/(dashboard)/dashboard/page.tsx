import { getAllProjects } from "@/actions/project-action";
import Link from "next/link";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, Users, Calendar, FolderOpen } from "lucide-react";

export default async function DashboardPage() {
  const projects = await getAllProjects();

  const formatDate = (date: Date | null | undefined) => {
    if (!date) return "Not set";
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-1">
                Manage your projects and teams
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Total Projects</p>
              <p className="text-2xl font-semibold text-gray-900">
                {projects.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Projects Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {projects.length === 0 ? (
          <div className="text-center py-12">
            <FolderOpen className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No projects found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Create your first project to get started.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Your Projects
              </h2>
              <p className="text-gray-600">
                Click on any project to view its tasks
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <Card
                  key={project.id}
                  className="hover:shadow-lg transition-shadow duration-200 group"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {project.name}
                      </CardTitle>
                      <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Description */}

                    {/* Team Information */}
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-700">
                          Team ID:
                        </span>
                        <span className="text-sm text-gray-600 font-mono">
                          {project.teamId}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-700">
                          Created:
                        </span>
                        <span className="text-sm text-gray-600">
                          {formatDate(project.createdAt)}
                        </span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="pt-4">
                      <Link
                        href={`/projects/${project.teamId}`}
                        className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                      >
                        View Tasks
                        <ExternalLink className="ml-2 w-4 h-4" />
                      </Link>
                    </div>

                    {/* Project ID */}
                    <div className="text-xs text-gray-400 font-mono bg-gray-50 px-2 py-1 rounded">
                      Project ID: {project.id}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Quick Stats */}
      {projects.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Quick Stats
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {projects.length}
                </p>
                <p className="text-sm text-gray-600">Total Projects</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {new Set(projects.map((p) => p.teamId)).size}
                </p>
                <p className="text-sm text-gray-600">Unique Teams</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">With Descriptions</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Debug Information */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <details className="bg-gray-100 rounded-lg p-4">
          <summary className="cursor-pointer text-sm font-medium text-gray-700">
            Debug Information (Click to expand)
          </summary>
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              All Projects Data:
            </h4>
            <pre className="text-xs bg-white p-4 rounded border overflow-auto max-h-64">
              {JSON.stringify(projects, null, 2)}
            </pre>
          </div>
        </details>
      </div>
    </div>
  );
}

// import { getAllProjects } from "@/actions/project-action";
// import Link from "next/link";
// import React from "react";

// export default async function DashboardPage() {
//   // const session = await

//   const projects = await getAllProjects();
//   console.log(projects);
//   return (
//     <div>
//       <h1>Dashboard</h1>
//       {projects.map((project) => (
//         <div key={project.id}>
//           {project.name}
//           <Link href={`/projects/${project.teamId}`}>View</Link>
//         </div>
//       ))}
//     </div>
//   );
// }
