import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <>
      <section className=" h-[500px] flex px-16 py-8 bg-primary text-white rounded-2xl">
        <div className=" flex justify-center items-center container px-16 text-left">
          <div className="max-w-3xl space-y-6 flex flex-col items-start">
            <h1 className="text-2xl font-medium tracking-tighter sm:text-3xl md:text-4xl">
              Manage Tasks Like a Pro
            </h1>
            <p className="text-sm md:text-base max-w-2xl">
              Streamline your workflow with our powerful task management
              platform. Organize projects, collaborate with teams, and boost
              productivity.
            </p>
            <div className="flex flex-col sm:flex-row justify-start gap-4">
              <Button
                className="bg-white text-primary hover:bg-gray-100 px-8 py-3 text-lg font-semibold rounded-lg shadow-lg"
                asChild
              >
                <Link href="/sign-up">Try Now – Free</Link>
              </Button>
            </div>
          </div>
          <div className="mt-4">
            <Image
              src="/hand.png"
              width={555}
              height={400}
              alt="Taskify App Mockup"
            />
          </div>
        </div>
      </section>
      <div />
    </>
  );
};

export default HeroSection;
