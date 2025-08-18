import { PropsWithChildren } from "react";
import { Toaster } from "@/components/ui/sonner";
import Image from "next/image";
import Link from "next/link";
export default function AuthLayout({ children }: PropsWithChildren) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex h-20 items-center gap-4 px-4 md:px-6">
        <Link href="/">
          <Image
            src="/logo2.png"
            alt="Taskify Logo"
            width={64}
            height={64}
            className="rounded-full p-2"
          />
        </Link>
        <h2>Taskify</h2>
      </header>
      {children}
      <Toaster richColors position="top-center" />
    </div>
  );
}
