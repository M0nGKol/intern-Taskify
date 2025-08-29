"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface TermsModalProps {
  children: React.ReactNode;
}

export default function TermsModal({ children }: TermsModalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-xl font-bold text-gray-900">
            Terms and Conditions
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-2 -mr-2">
          <div className="prose prose-gray max-w-none">
            <p className="text-sm text-gray-600 mb-6">
              Last updated: {new Date().toLocaleDateString()}
            </p>

            <section className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                1. Acceptance of Terms
              </h2>
              <p className="text-gray-700 mb-3 text-sm">
                By accessing and using Taskify, you accept and agree to be bound
                by the terms and provision of this agreement.
              </p>
            </section>

            <section className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                2. Use License
              </h2>
              <p className="text-gray-700 mb-3 text-sm">
                Permission is granted to temporarily download one copy of
                Taskify for personal, non-commercial transitory viewing only.
              </p>
              <p className="text-gray-700 mb-3 text-sm">
                This is the grant of a license, not a transfer of title, and
                under this license you may not:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-3 text-sm">
                <li>modify or copy the materials</li>
                <li>
                  use the materials for any commercial purpose or for any public
                  display
                </li>
                <li>
                  attempt to reverse engineer any software contained in Taskify
                </li>
                <li>
                  remove any copyright or other proprietary notations from the
                  materials
                </li>
              </ul>
            </section>

            <section className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                3. User Account
              </h2>
              <p className="text-gray-700 mb-3 text-sm">
                When you create an account with us, you must provide information
                that is accurate, complete, and current at all times.
              </p>
              <p className="text-gray-700 mb-3 text-sm">
                You are responsible for safeguarding the password and for all
                activities that occur under your account.
              </p>
            </section>

            <section className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                4. Privacy Policy
              </h2>
              <p className="text-gray-700 mb-3 text-sm">
                Your privacy is important to us. Please review our Privacy
                Policy, which also governs your use of the service.
              </p>
            </section>

            <section className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                5. Disclaimer
              </h2>
              <p className="text-gray-700 mb-3 text-sm">
                The materials within Taskify are provided on an &apos;as
                is&apos; basis. Taskify makes no warranties, expressed or
                implied, and hereby disclaims and negates all other warranties
                including without limitation, implied warranties or conditions
                of merchantability, fitness for a particular purpose, or
                non-infringement of intellectual property or other violation of
                rights.
              </p>
            </section>

            <section className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                6. Limitations
              </h2>
              <p className="text-gray-700 mb-3 text-sm">
                In no event shall Taskify or its suppliers be liable for any
                damages (including, without limitation, damages for loss of data
                or profit, or due to business interruption) arising out of the
                use or inability to use the materials on Taskify&apos;s website.
              </p>
            </section>

            <section className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                7. Revisions and Errata
              </h2>
              <p className="text-gray-700 mb-3 text-sm">
                The materials appearing on Taskify could include technical,
                typographical, or photographic errors. Taskify does not warrant
                that any of the materials on its website are accurate, complete,
                or current.
              </p>
            </section>

            <section className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                8. Links
              </h2>
              <p className="text-gray-700 mb-3 text-sm">
                Taskify has not reviewed all of the sites linked to its website
                and is not responsible for the contents of any such linked site.
                The inclusion of any link does not imply endorsement by Taskify
                of the site.
              </p>
            </section>

            <section className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                9. Modifications
              </h2>
              <p className="text-gray-700 mb-3 text-sm">
                Taskify may revise these terms of service for its website at any
                time without notice. By using this website you are agreeing to
                be bound by the then current version of these Terms and
                Conditions of Use.
              </p>
            </section>

            <section className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                10. Contact Information
              </h2>
              <p className="text-gray-700 mb-3 text-sm">
                If you have any questions about these Terms and Conditions,
                please contact us at support@taskify.com
              </p>
            </section>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
