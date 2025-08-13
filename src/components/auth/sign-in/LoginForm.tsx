"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Mail, Lock } from "lucide-react";
import Link from "next/link";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { redirect } from "next/navigation";
import { toast } from "sonner";
import { SignInSchema, SignInSchemaValue } from "@/lib/schema/auth";
import { credentialsSignIn } from "@/lib/actions/auth.actions";

export default function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const form = useForm<z.infer<typeof SignInSchema>>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  async function onSubmit(values: SignInSchemaValue) {
    const { data, message } = await credentialsSignIn(values);
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
      <main className="flex flex-1 items-center justify-center py-12">
        <div className="mx-auto w-full max-w-md space-y-6 rounded-lg">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold text-[#1A202C]">Log In</h1>
          </div>
          <Button
            size="lg"
            variant="outline"
            className="w-full justify-center gap-2 rounded-md border border-gray-300 bg-[#F5F5F5] py-2 text-gray-700 hover:bg-gray-100"
          >
            <Image src="/google.png" alt="Google Logo" width={20} height={20} />
            Continue with Gmail
          </Button>
          <div className="relative flex items-center justify-center">
            <span className="absolute bg-white px-2 text-sm text-gray-500">
              Or with your own Taskify Account
            </span>
            <div className="w-full border-t border-gray-300" />
          </div>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-4">
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
              <Button
                type="submit"
                className="w-full rounded-md bg-[#5FA8D3] py-2 text-white shadow-sm hover:bg-[#4A90C2]"
              >
                Log In
              </Button>
            </div>
          </form>

          <div className="mt-4 flex justify-between text-sm">
            <Link
              href="/sign-up"
              className="text-[#5FA8D3] hover:underline"
              prefetch={false}
            >
              don&apos;t have account? Sign Up
            </Link>
            <Link
              href="#"
              className="text-[#5FA8D3] hover:underline"
              prefetch={false}
            >
              I forgot my password
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
