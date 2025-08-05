import React from "react";
import { Mail, Users, CalendarDays } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <div>
      <header className="px-16 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <Image src="/logo2.png" alt="Taskify Logo" width={24} height={24} />
          Taskify
        </Link>
        <nav className="hidden md:flex gap-4 sm:gap-6">
          <Link
            href="#features"
            className="text-sm font-medium hover:underline underline-offset-4"
          >
            Features
          </Link>
          <Link
            href="#testimonials"
            className="text-sm font-medium hover:underline underline-offset-4"
          >
            Testimonials
          </Link>
          <Link
            href="#contact"
            className="text-sm font-medium hover:underline underline-offset-4"
          >
            Contact
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href="/auth/login">Log In</Link>
          </Button>
          <Button className="bg-[#113F67] text-white" asChild>
            <Link href="/auth/signup">Get Started</Link>
          </Button>
        </div>
      </header>
    </div>
  );
};

export default Header;
