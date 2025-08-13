"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { User, Mail, Lock } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignUpSchema, SignUpSchemaValue } from "@/lib/schema/auth";
import { toast } from "sonner";
import { credentialsSignUp } from "@/lib/actions/auth.actions";
import { redirect } from "next/navigation";

export default function SignUp() {
  const form = useForm<SignUpSchemaValue>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: SignUpSchemaValue) {
    const { data, message } = await credentialsSignUp(values);
    if (!data) {
      toast.error(message);
    }
    if (data) {
      toast.success(message);
      redirect("/dashboard");
    }
  }
  return (
    <div>
      <main className="flex bg-white py-12">
        <div className="mx-auto w-full max-w-4xl space-y-6 rounded-lg bg-white p-8 md:flex md:space-x-8 md:space-y-0">
          <div className="flex flex-1 flex-col items-center space-y-6 md:w-1/2">
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

          <div className="flex flex-1 flex-col space-y-4 md:w-1/2">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="name"
                  className="text-sm font-medium text-[#1A202C]"
                >
                  Full Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Full name"
                    className="w-full rounded-md border-none bg-[#F5F5F5] py-2 pl-10 pr-3 text-gray-700 focus:ring-2 focus:ring-blue-500"
                    {...form.register("name")}
                    required
                  />
                </div>
                {form.formState.errors.name && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.name.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-[#1A202C]"
                >
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Email"
                    className="w-full rounded-md border-none bg-[#F5F5F5] py-2 pl-10 pr-3 text-gray-700 focus:ring-2 focus:ring-blue-500"
                    {...form.register("email")}
                    required
                  />
                </div>
                {form.formState.errors.email && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.email.message}
                  </p>
                )}
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
                    {...form.register("password")}
                    required
                  />
                </div>
                {form.formState.errors.password && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.password.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="confirmPassword"
                  className="text-sm font-medium text-[#1A202C]"
                >
                  Confirm Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm password"
                    className="w-full rounded-md border-none bg-[#F5F5F5] py-2 pl-10 pr-3 text-gray-700 focus:ring-2 focus:ring-blue-500"
                    {...form.register("confirmPassword")}
                    required
                  />
                </div>
                {form.formState.errors.confirmPassword && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>
              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  id="terms"
                  className="h-8 w-8 rounded border-gray-300 text-[#5FA8D3] focus:ring-[#5FA8D3]"
                />
                <Label htmlFor="terms" className="text-xs text-gray-700">
                  By checking this box, I acknowledge that I have read and agree
                  to the{" "}
                  <Link
                    href="#"
                    className="text-[#5FA8D3] hover:underline underline"
                  >
                    Terms and Conditions
                  </Link>
                  .
                </Label>
              </div>
              <Button
                type="submit"
                className="w-full rounded-md bg-[#5FA8D3] py-2 text-white shadow-sm hover:bg-[#4A90C2]"
              >
                Sign Up
              </Button>
            </form>
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
