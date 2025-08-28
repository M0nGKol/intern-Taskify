// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { acceptProjectInvite } from "@/actions/project-action";
// import { useAuth } from "@/components/providers/auth-provider";
// import { Loading } from "@/components/ui/loading";
// import Link from "next/link";

// export default function AcceptInvitePage({
//   params,
// }: {
//   params: { token: string };
// }) {
//   console.log("params", params.token);

//   const { user, isLoading } = useAuth();
//   const [status, setStatus] = useState<
//     "idle" | "need-auth" | "accepting" | "done" | "error"
//   >("idle");
//   const router = useRouter();

//   useEffect(() => {
//     if (!params?.token) return;
//     if (isLoading) return;

//     if (!user) {
//       setStatus("need-auth");
//       return;
//     }

//     const run = async () => {
//       try {
//         setStatus("accepting");
//         await acceptProjectInvite({ token: params.token, userId: user.id });
//         setStatus("done");
//         router.push("/dashboard");
//       } catch {
//         setStatus("error");
//       }
//     };

//     run();
//   }, [params?.token, user, isLoading, router]);

//   if (status === "need-auth") {
//     return (
//       <div className="min-h-[50vh] flex flex-col items-center justify-center gap-4">
//         <p className="text-sm text-gray-600">
//           Please sign in to accept the invite.
//         </p>
//         <Link
//           href="/sign-in"
//           className="px-4 py-2 bg-blue-600 text-white rounded-md"
//         >
//           Sign in
//         </Link>
//       </div>
//     );
//   }

//   if (status === "accepting" || status === "idle") {
//     return (
//       <div className="min-h-[50vh] flex items-center justify-center">
//         <Loading text="Accepting your invite..." />
//       </div>
//     );
//   }

//   if (status === "error") {
//     return (
//       <div className="min-h-[50vh] flex flex-col items-center justify-center gap-2">
//         <p className="text-sm text-red-600">
//           This invite is invalid or expired.
//         </p>
//         <Link
//           href="/dashboard"
//           className="px-4 py-2 bg-gray-800 text-white rounded-md"
//         >
//           Go to dashboard
//         </Link>
//       </div>
//     );
//   }

//   return (
//     <>
//       <p>hi</p>
//     </>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { acceptProjectInvite } from "@/actions/project-action";
import { useAuth } from "@/components/providers/auth-provider";
import { Loading } from "@/components/ui/loading";
import Link from "next/link";

export default function AcceptInvitePage() {
  const params = useParams<{ token: string }>();
  const token = (params?.token as string) || "";

  const { user, isLoading } = useAuth();
  const [status, setStatus] = useState<
    "idle" | "need-auth" | "accepting" | "done" | "error"
  >("idle");
  const router = useRouter();

  useEffect(() => {
    if (!token) return;
    if (isLoading) return;

    if (!user) {
      setStatus("need-auth");
      return;
    }

    const run = async () => {
      try {
        setStatus("accepting");
        await acceptProjectInvite({ token, userId: user.id });
        setStatus("done");
        router.push("/dashboard");
      } catch {
        setStatus("error");
      }
    };

    run();
  }, [token, user, isLoading, router]);

  if (status === "need-auth") {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-4">
        <p className="text-sm text-gray-600">
          Please sign in to accept the invite.
        </p>
        <Link
          href="/sign-in"
          className="px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          Sign in
        </Link>
      </div>
    );
  }

  if (status === "accepting" || status === "idle") {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Loading text="Accepting your invite..." />
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-2">
        <p className="text-sm text-red-600">
          This invite is invalid or expired.
        </p>
        <Link
          href="/dashboard"
          className="px-4 py-2 bg-gray-800 text-white rounded-md"
        >
          Go to dashboard
        </Link>
      </div>
    );
  }

  return null;
}
