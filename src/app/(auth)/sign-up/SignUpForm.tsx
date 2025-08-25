"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { User, Mail, Lock } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/auth-provider";
import { toast } from "sonner";

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const router = useRouter();
  const { refreshAuth } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!acceptTerms) {
      setError("Please accept the terms and conditions.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await authClient.signUp.email({
        email,
        password,
        name,
      });

      await refreshAuth();

      toast.success("Account created successfully!");
      router.push("/dashboard");
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setIsGoogleLoading(true);
    setError("");

    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: `${window.location.origin}/dashboard`,
      });
      return; // Google will redirect
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message || "Failed to sign in with Google");
      } else {
        toast.error("Failed to sign in with Google");
      }
      setIsGoogleLoading(false);
    }
  };

  return (
    <div>
      <main className="flex bg-white py-12">
        <div className="mx-auto w-full max-w-4xl space-y-6 rounded-lg bg-white p-8 md:flex md:space-x-8 md:space-y-0">
          <div className="flex flex-1 flex-col items-center space-y-6 md:w-1/2">
            <h1 className="text-3xl font-bold text-[#1A202C]">Sign Up</h1>

            {error && (
              <div className="w-full max-w-xs rounded-md bg-red-50 border border-red-200 p-4 text-sm text-red-700 shadow-sm">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-red-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-red-800">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <Button
              type="button"
              variant="outline"
              className="w-full max-w-xs justify-center gap-2 rounded-md border border-gray-300 bg-[#F5F5F5] py-2 text-gray-700 shadow-sm hover:bg-gray-100"
              onClick={handleGoogleSignUp}
              disabled={isLoading || isGoogleLoading}
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
            <form onSubmit={handleSubmit} className="space-y-4">
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
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full rounded-md border-none bg-[#F5F5F5] py-2 pl-10 pr-3 text-gray-700 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full rounded-md border-none bg-[#F5F5F5] py-2 pl-10 pr-3 text-gray-700 focus:ring-2 focus:ring-blue-500"
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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full rounded-md border-none bg-[#F5F5F5] py-2 pl-10 pr-3 text-gray-700 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
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
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full rounded-md border-none bg-[#F5F5F5] py-2 pl-10 pr-3 text-gray-700 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  id="terms"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
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
                disabled={isLoading}
                className="w-full rounded-md bg-[#5FA8D3] py-2 text-white shadow-sm hover:bg-[#4A90C2] disabled:opacity-50"
              >
                {isLoading ? "Creating Account..." : "Sign Up"}
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
