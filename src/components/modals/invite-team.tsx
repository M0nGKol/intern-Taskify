"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import {
  inviteToProject,
  listProjectInvites,
  getMyRoleForProject,
} from "@/actions/project-action";
import { usePersistentProjectState } from "@/lib/hooks/usePersistentProjectState";
import { toast } from "sonner";
import { useAuth } from "@/components/providers/auth-provider";

interface InviteTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InviteTeamModal({ isOpen, onClose }: InviteTeamModalProps) {
  const { teamId, projectName } = usePersistentProjectState();
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"admin" | "editor" | "viewer">("viewer");
  const [pending, setPending] = useState(false);
  const [invites, setInvites] = useState<{ email: string; role: string }[]>([]);
  const [myRole, setMyRole] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const loadInvites = async () => {
      try {
        const list = await listProjectInvites(teamId);
        setInvites(list.map((i) => ({ email: i.email, role: i.role })));
      } catch {}
    };

    const loadRole = async () => {
      try {
        if (user?.id && teamId) {
          const r = await getMyRoleForProject({
            projectKey: teamId,
            userId: user.id,
          });
          setMyRole(r);
        } else {
          setMyRole(null);
        }
      } catch {
        setMyRole(null);
      }
    };

    loadInvites();
    loadRole();
  }, [isOpen, teamId, user?.id]);

  const handleInvite = async () => {
    if (!teamId) return;
    if (myRole !== "owner") {
      toast.error("Only owners can invite members");
      return;
    }
    const trimmed = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      toast.error("Enter a valid email address");
      return;
    }
    setPending(true);
    try {
      await inviteToProject({
        projectId: teamId,
        email: trimmed,
        role,
        invitedByUserId: user?.id,
      });
      toast.success("Invitation sent");
      setEmail("");

      // Reload invites after successful invitation
      try {
        const list = await listProjectInvites(teamId);
        setInvites(list.map((i) => ({ email: i.email, role: i.role })));
      } catch {}
    } catch (e) {
      if (e instanceof Error) toast.error(e.message);
      else toast.error("Failed to send invite");
    } finally {
      setPending(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Invite collaborators {projectName ? `to ${projectName}` : ""}
          </DialogTitle>
        </DialogHeader>

        <div className="py-2 text-xs text-gray-500">
          Your role: {myRole ?? "—"}
          {myRole !== "owner" ? " — only owners can invite" : ""}
        </div>

        {/* Role descriptions */}
        <div className="py-2 space-y-2 text-xs text-gray-600 bg-gray-50 p-3 rounded">
          <div>
            <strong>Admin:</strong> Full task management, cannot invite members
          </div>
          <div>
            <strong>Editor:</strong> Create, edit, delete tasks only
          </div>
          <div>
            <strong>Viewer:</strong> Read-only access to project and tasks
          </div>
        </div>

        <div className="py-4 space-y-6">
          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Select
              value={role}
              onValueChange={(v) => setRole(v as "admin" | "editor" | "viewer")}
            >
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="editor">Editor</SelectItem>
                <SelectItem value="viewer">Viewer</SelectItem>
              </SelectContent>
            </Select>
            <Button
              className="bg-blue-500 hover:bg-blue-600 text-white"
              onClick={handleInvite}
              disabled={pending || myRole !== "owner"}
            >
              {pending ? "Sending..." : "Invite"}
            </Button>
          </div>
          <div>
            <div className="text-sm font-medium mb-2">Pending invites</div>
            <div className="space-y-1">
              {invites.length === 0 ? (
                <div className="text-xs text-gray-500">No pending invites</div>
              ) : (
                invites.map((i) => (
                  <div
                    key={`${i.email}-${i.role}`}
                    className="text-sm text-gray-700"
                  >
                    {i.email} — {i.role}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
