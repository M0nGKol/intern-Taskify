import { Facebook, Instagram, Twitter } from "lucide-react";
import { User } from "lucide-react";
import { Mail } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
const Footer = () => {
  return (
    <>
      <footer className="flex flex-col justify-center items-center py-12">
        <div className="container px-4 md:px-6">
          <div className="border border-primary rounded-xl p-8 grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            {/* Left Section: Logo and Tagline */}
            <div className="flex flex-col items-start space-y-2">
              <div className="flex items-center gap-2 font-bold text-2xl">
                <Image
                  src="/logo2.png"
                  alt="Taskify Logo"
                  width={48}
                  height={48}
                />
                Taskify
              </div>
              <p className="text-sm text-muted-foreground">
                stay organized and productive with Taskify
              </p>
            </div>

            {/* Middle Section: Follow Us */}
            <div className="flex flex-col items-start space-y-4 md:pl-8">
              <h3 className="text-lg font-semibold">Follow us</h3>
              <div className="flex gap-4">
                <Link href="#" aria-label="Facebook">
                  <Facebook className="h-8 w-8 text-white bg-blue-600 rounded-full p-1 hover:bg-blue-700 transition-colors" />
                </Link>
                <Link href="#" aria-label="Instagram">
                  <Instagram className="h-8 w-8 text-white bg-pink-500 rounded-full p-1 hover:bg-pink-600 transition-colors" />
                </Link>
                <Link href="#" aria-label="X (Twitter)">
                  <Twitter className="h-8 w-8 text-white bg-black rounded-full p-1 hover:bg-gray-800 transition-colors" />
                </Link>
              </div>
            </div>

            {/* Right Section: Contact Us Form */}
            <div className="flex flex-col items-start space-y-4 md:pl-8">
              <h3 className="text-lg font-semibold">Contact us</h3>
              <div className="w-full space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="Full name"
                      className="w-full pl-10 bg-gray-100 border-none"
                    />
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="relative">
                    <Input
                      type="email"
                      placeholder="Email"
                      className="w-full pl-10 bg-gray-100 border-none"
                    />
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  </div>
                </div>
                <textarea
                  placeholder="Message"
                  className="w-full p-3 pl-4 bg-gray-100 border-none rounded-md min-h-[100px] resize-y"
                ></textarea>
                <Button
                  type="submit"
                  className="w-auto px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md self-end"
                >
                  Submit
                </Button>
              </div>
            </div>
          </div>
        </div>
        {/* Bottom Legal Links */}
        <div className="container px-4 md:px-6 flex flex-col sm:flex-row justify-end gap-4 mt-8 text-sm text-muted-foreground">
          <Link href="/Cookies" className="hover:underline underline-offset-4">
            Cookies
          </Link>
          <Link href="/Privacy" className="hover:underline underline-offset-4">
            Privacy policy
          </Link>
          <Link href="/Security" className="hover:underline underline-offset-4">
            Security
          </Link>
          <Link href="/Legal" className="hover:underline underline-offset-4">
            Legal documents
          </Link>
        </div>
      </footer>
    </>
  );
};

export default Footer;
