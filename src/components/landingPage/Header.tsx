import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <div>
      <header className="px-16 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <Image src="/logo2.png" alt="Taskify Logo" width={64} height={64} />
          Taskify
        </Link>
        <div className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href="/sign-in">Log In</Link>
          </Button>
          <Button className="bg-primary text-white" asChild>
            <Link href="/sign-up">Get Started</Link>
          </Button>
        </div>
      </header>
    </div>
  );
};

export default Header;
