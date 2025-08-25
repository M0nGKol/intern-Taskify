"use client";

import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/providers/auth-provider";
import {
  listPendingInvitesForEmail,
  acceptProjectInvite,
  declineProjectInvite,
} from "@/actions/project-action";
import { toast } from "sonner";

type InviteItem = {
  id: string;
  token: string;
  projectId: string;
  email: string;
  role: "admin" | "editor" | "viewer";
  projectName?: string | null;
};

export function NotificationBell() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [invites, setInvites] = useState<InviteItem[]>([]);

  const count = invites.length;

  useEffect(() => {
    const loadInvites = async () => {
      if (!user?.email) return;
      setLoading(true);
      try {
        const list = await listPendingInvitesForEmail(user.email);
        setInvites(list as InviteItem[]);
      } catch {
        setInvites([]);
      } finally {
        setLoading(false);
      }
    };

    if (open) loadInvites();
  }, [open, user?.email]);

  const handleAccept = async (token: string) => {
    if (!user?.id) return;
    try {
      await acceptProjectInvite({ token, userId: user.id });
      setInvites((prev) => prev.filter((i) => i.token !== token));
      toast.success("Joined the project");
    } catch {
      toast.error("Failed to accept invite");
    }
  };

  const handleDecline = async (token: string) => {
    try {
      await declineProjectInvite({ token });
      setInvites((prev) => prev.filter((i) => i.token !== token));
      toast.success("Invite dismissed");
    } catch {
      toast.error("Failed to dismiss invite");
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className="relative flex flex-col items-center text-gray-400 hover:text-white transition-colors"
          title="Invitations"
        >
          <Bell className="w-6 h-6 mb-1" />
          {count > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] leading-none px-1.5 py-0.5 rounded-full">
              {count}
            </span>
          )}
          <span className="text-xs">Invites</span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="text-sm font-medium mb-2">Pending invitations</div>
        {loading ? (
          <div className="text-xs text-gray-500">Loading…</div>
        ) : invites.length === 0 ? (
          <div className="text-xs text-gray-500">No pending invites</div>
        ) : (
          <div className="space-y-3">
            {invites.map((i) => (
              <div
                key={i.token}
                className="flex items-start justify-between gap-2"
              >
                <div className="text-sm">
                  <div className="font-medium">
                    {i.projectName || "Project"}
                  </div>
                  <div className="text-xs text-gray-500">Role: {i.role}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    className="h-7 px-2 bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => handleAccept(i.token)}
                  >
                    Accept
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="h-7 px-2"
                    onClick={() => handleDecline(i.token)}
                  >
                    Dismiss
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
