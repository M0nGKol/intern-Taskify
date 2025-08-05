import React from "react";

const page = () => {
  return (
    <div className="min-h-screen bg-white text-gray-800">
      <header className="py-10 text-center">
        <h1 className="text-4xl font-bold">
          Everything you need to stay organized
        </h1>
        <p className="mt-4 text-lg max-w-2xl mx-auto">
          Our comprehensive task management solution provides all the tools you
          need to manage projects efficiently.
        </p>
        <div className="mt-6 flex justify-center gap-4">
          <button className="bg-blue-600 text-white px-6 py-2 rounded">
            Try Now - Free
          </button>
          <button className="border border-blue-600 text-blue-600 px-6 py-2 rounded">
            Get Started
          </button>
        </div>
      </header>

      <section className="py-12 bg-gray-100 text-center">
        <h2 className="text-2xl font-semibold mb-4">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div>
            <h3 className="font-bold text-lg">Task Management</h3>
            <p>
              Create, organize, and track tasks with our intuitive Kanban board
              interface.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-lg">Team Collaboration</h3>
            <p>
              Assign tasks, add comments, and collaborate seamlessly with your
              team.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-lg">Calendar View</h3>
            <p>
              Visualize deadlines and schedule tasks with our integrated
              calendar system.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 text-center">
        <h2 className="text-2xl font-semibold mb-4">What Our Users Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="border p-4 rounded shadow">
            <p className="italic">
              “Love how the Product Manager incorporates user suggestions.”
            </p>
            <p className="mt-2 font-bold">John Doe, CEO</p>
          </div>
          <div className="border p-4 rounded shadow">
            <p className="italic">
              “The Designer’s UI is stunning and intuitive.”
            </p>
            <p className="mt-2 font-bold">Bob, CTO</p>
          </div>
          <div className="border p-4 rounded shadow">
            <p className="italic">
              “Data Analyst’s insights have improved Taskify a lot.”
            </p>
            <p className="mt-2 font-bold">Johnson, COO</p>
          </div>
        </div>
      </section>

      <footer className="bg-gray-200 py-6 text-center text-sm">
        <p>
          Contact us | Cookies | Privacy Policy | Security | Legal documents
        </p>
        <p className="mt-2">Follow us - Taskify</p>
      </footer>
    </div>
  );
};

export default page;
