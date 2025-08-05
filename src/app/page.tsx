import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Mail, Users, CalendarDays } from "lucide-react";
import Testimonial from "@/components/testimonial";

export default function Home() {
  return (
    <>
      <main className="flex-1">
        <div className="flex justify-center items-center py-8">
          <section className="w-[1350px] h-[500px] flex px-16 py-8 bg-[#113F67] text-white rounded-2xl">
            <div className=" flex justify-center items-center container px-16 text-center">
              <div className="max-w-3xl mx-auto space-y-6">
                <h1 className="text-2xl font-medium tracking-tighter sm:text-3xl md:text-4xl">
                  Everything you need to stay organized
                </h1>
                <p className="text-sm md:text-base max-w-2xl mx-auto">
                  Our comprehensive task management solution provides all the
                  tools you need to manage projects efficiently.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Button
                    className="bg-white text-[#113F67] hover:bg-gray-100 px-8 py-3 text-lg font-semibold rounded-lg shadow-lg"
                    asChild
                  >
                    <Link href="/auth/signup">Try Now – Free</Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="border-white text-white hover:bg-white hover:text-[#113F67] px-8 py-3 text-lg font-semibold rounded-lg shadow-lg bg-transparent"
                    asChild
                  >
                    <Link href="/auth/signup">Get Started</Link>
                  </Button>
                </div>
              </div>
              <div className="mt-4">
                <Image
                  src="/hand.png"
                  width={610}
                  height={400}
                  alt="Taskify App Mockup"
                />
              </div>
            </div>
          </section>
        </div>

        {/* Features Section */}
        <section
          id="features"
          className="w-full flex flex-col justify-center items-center"
        >
          <div className="container px-4 md:px-6">
            <div className="text-center space-y-6 mb-12">
              <h2 className="text-2xl font-bold tracking-tighter">
                Streamline your workflow with our powerful task management
                platform.
              </h2>
              <p className="max-w-2xl mx-auto text-muted-foreground md:text-xl">
                Organize projects, collaborate with teams, and boost
                productivity.
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <Mail className="h-12 w-12 text-[#113F67] mb-4" />
                <h3 className="text-xl font-semibold mb-2">Task Management</h3>
                <p className="text-muted-foreground">
                  Create, organize, and track tasks with our intuitive Kanban
                  board interface.
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <Users className="h-12 w-12 text-[#113F67] mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  Team Collaboration
                </h3>
                <p className="text-muted-foreground">
                  Assign tasks, add comments, and collaborate seamlessly with
                  your team members.
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <CalendarDays className="h-12 w-12 text-[#113F67] mb-4" />
                <h3 className="text-xl font-semibold mb-2">Calendar View</h3>
                <p className="text-muted-foreground">
                  Visualize deadlines and schedule tasks with our integrated
                  calendar system.
                </p>
              </div>
            </div>
          </div>
        </section>
        <Testimonial />
      </main>
    </>
  );
}
