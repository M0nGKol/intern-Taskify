import { PropsWithChildren } from "react";
import Image from "next/image";
export default function AuthLayout({ children }: PropsWithChildren) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex h-20 items-center gap-4 px-4 md:px-6">
        <Image
          src="/logo2.png"
          alt="Taskify Logo"
          width={64}
          height={64}
          className="rounded-full p-2"
        />
        <h2>Taskify</h2>
      </header>
      {children}
    </div>
  );
}
