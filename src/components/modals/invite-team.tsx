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
import { Mail, UserPlus } from "lucide-react";
import { useState } from "react";
import { inviteToProject, listProjectInvites } from "@/actions/project-action";
import { usePersistentProjectState } from "@/lib/hooks/usePersistentProjectState";
import { toast } from "sonner";

interface InviteTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InviteTeamModal({ isOpen, onClose }: InviteTeamModalProps) {
  const { teamId, projectName } = usePersistentProjectState();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"admin" | "editor" | "viewer">("viewer");
  const [pending, setPending] = useState(false);
  const [invites, setInvites] = useState<{ email: string; role: string }[]>([]);

  const loadInvites = async () => {
    try {
      const list = await listProjectInvites(teamId);
      setInvites(list.map((i) => ({ email: i.email, role: i.role })));
    } catch {}
  };

  const handleInvite = async () => {
    if (!teamId) return;
    const trimmed = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      toast.error("Enter a valid email address");
      return;
    }
    setPending(true);
    try {
      await inviteToProject({ projectId: teamId, email: trimmed, role });
      toast.success("Invitation sent");
      setEmail("");
      loadInvites();
    } catch (e) {
      toast.error("Failed to send invite");
    } finally {
      setPending(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg" onOpenAutoFocus={loadInvites}>
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Invite collaborators {projectName ? `to ${projectName}` : ""}
          </DialogTitle>
        </DialogHeader>

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
            <Select value={role} onValueChange={(v) => setRole(v as any)}>
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
              disabled={pending}
            >
              Invite
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
