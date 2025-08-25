// new file: src/lib/resend.ts
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

type Role = "admin" | "editor" | "viewer";

export async function sendProjectInviteEmail(opts: {
  to: string;
  projectName?: string;
  role: Role;
  acceptUrl: string;
  invitedByEmail?: string | null;
}) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY is not set; skipping email send.");
    return { skipped: true };
  }

  const from = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
  const subject = `You're invited to join ${opts.projectName || "a project"} on Taskify`;

  const html = `
  <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #111;">
    <h2>You're invited${opts.projectName ? ` to <strong>${opts.projectName}</strong>` : ""}</h2>
    <p>You have been invited ${opts.projectName ? `to join ${opts.projectName}` : "to join a project"} as <strong>${opts.role}</strong>.</p>
    <p>Click the button below to accept the invite.</p>
    <p>
      <a href="${opts.acceptUrl}" style="display: inline-block; background: #2563EB; color: #fff; text-decoration: none; padding: 10px 14px; border-radius: 6px;">
        Accept invite
      </a>
    </p>
    <p style="font-size: 12px; color: #666;">If you did not expect this, you can ignore this email.</p>
  </div>`.trim();

  return await resend.emails.send({
    from,
    to: opts.to,
    subject,
    html,
  });
}