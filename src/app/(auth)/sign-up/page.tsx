import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, User } from "lucide-react";
import Image from "next/image";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen flex-col ">
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
      <main className="flex flex-1 items-center justify-center bg-white py-12">
        <div className="mx-auto w-full max-w-4xl space-y-6 rounded-lg bg-white p-8 shadow-lg md:flex md:space-x-8 md:space-y-0">
          {/* Left Section */}
          <div className="flex flex-1 flex-col items-center justify-center space-y-6 md:w-1/2">
            <h1 className="text-3xl font-bold text-[#1A202C]">Sign Up</h1>
            <Button
              variant="outline"
              className="w-full max-w-xs justify-center gap-2 rounded-md border border-gray-300 bg-[#F5F5F5] py-2 text-gray-700 shadow-sm hover:bg-gray-100"
            >
              <Image
                src="/google.png"
                alt="Google Logo"
                width={20}
                height={20}
              />
              Continue with Gmail
            </Button>
          </div>

          {/* Separator */}
          <div className="relative flex items-center justify-center py-6 md:w-auto md:py-0">
            <div className="h-full w-px bg-gray-300 md:h-96" />
            <span className="absolute rounded-full bg-white px-3 py-1 text-sm text-gray-500 ring-1 ring-gray-300">
              OR
            </span>
          </div>

          {/* Right Section */}
          <div className="flex flex-1 flex-col space-y-4 md:w-1/2">
            <div className="space-y-2">
              <Label
                htmlFor="fullname"
                className="text-sm font-medium text-[#1A202C]"
              >
                Fullname
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  id="fullname"
                  type="text"
                  placeholder="Full name"
                  className="w-full rounded-md border-none bg-[#F5F5F5] py-2 pl-10 pr-3 text-gray-700 focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="text-sm font-medium text-[#1A202C]"
              >
                Name
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Email or Username"
                  className="w-full rounded-md border-none bg-[#F5F5F5] py-2 pl-10 pr-3 text-gray-700 focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-sm font-medium text-[#1A202C]"
              >
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Password"
                  className="w-full rounded-md border-none bg-[#F5F5F5] py-2 pl-10 pr-3 text-gray-700 focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="terms"
                className="h-4 w-4 rounded border-gray-300 text-[#5FA8D3] focus:ring-[#5FA8D3]"
              />
              <Label htmlFor="terms" className="text-sm text-gray-700">
                By checking this box, I acknowledge that I have read and agree
                to the{" "}
                <Link
                  href="#"
                  className="text-[#5FA8D3] hover:underline"
                  prefetch={false}
                >
                  Terms and Conditions.
                </Link>
              </Label>
            </div>
            <Button
              type="submit"
              className="w-full rounded-md bg-[#5FA8D3] py-2 text-white shadow-sm hover:bg-[#4A90C2]"
            >
              Sign Up
            </Button>
            <div className="mt-4 text-center text-sm">
              <Link
                href="/sign-in"
                className="text-[#5FA8D3] hover:underline"
                prefetch={false}
              >
                I already have account
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
