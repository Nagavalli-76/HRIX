/**
 * HRIX Email Notification Helper
 *
 * Uses the Resend API for transactional emails. Requires:
 *   RESEND_API_KEY — Server-side only. Never use NEXT_PUBLIC_ for this.
 *   HRIX_EMAIL_FROM — Optional. Defaults to "HRIX <noreply@hrix.app>".
 *
 * If RESEND_API_KEY is not configured, emails are logged to the console
 * and the function returns "skipped" so the caller knows delivery was not attempted.
 */

const RESEND_ENDPOINT = "https://api.resend.com/emails";

interface ModerationEmailParams {
  to: string;
  userName: string;
  accountType: "creator" | "brand";
  decision: "approved" | "action-required";
  reason?: string;
}

function buildApprovalHtml(userName: string, accountType: string): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://hrixofficial.in";
  const loginUrl = `${siteUrl}/login`;
  const roleLabel = accountType === "brand" ? "Brand" : "Creator";
  return `
<div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:32px 24px;color:#e4e4e7;background:#09090b;border-radius:12px;">
  <h1 style="font-size:22px;color:#fafafa;margin:0 0 16px;">Welcome to HRIX ✓</h1>
  <p style="margin:0 0 12px;line-height:1.6;">
    Hi ${userName},
  </p>
  <p style="margin:0 0 12px;line-height:1.6;">
    Your <strong>${roleLabel}</strong> account has been approved by the HRIX team.
    You now have access to the features available for your role.
  </p>
  <p style="margin:0 0 24px;line-height:1.6;">
    <a href="${loginUrl}" style="display:inline-block;padding:10px 24px;background:#6366f1;color:#fff;text-decoration:none;border-radius:6px;font-weight:600;">Log in to HRIX</a>
  </p>
  <p style="margin:0;font-size:13px;color:#71717a;">
    If you have questions, reply to this email or contact us at hrixofficial@gmail.com.
  </p>
</div>`;
}

function buildActionRequiredHtml(userName: string, accountType: string, reason?: string): string {
  const roleLabel = accountType === "brand" ? "Brand" : "Creator";
  const reasonBlock = reason
    ? `<p style="margin:12px 0;padding:12px 16px;background:#1c1917;border-left:3px solid #f59e0b;border-radius:4px;line-height:1.6;">${reason}</p>`
    : "";
  return `
<div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:32px 24px;color:#e4e4e7;background:#09090b;border-radius:12px;">
  <h1 style="font-size:22px;color:#fafafa;margin:0 0 16px;">Action Required — HRIX ${roleLabel} Account</h1>
  <p style="margin:0 0 12px;line-height:1.6;">
    Hi ${userName},
  </p>
  <p style="margin:0 0 12px;line-height:1.6;">
    The HRIX team has reviewed your <strong>${roleLabel}</strong> registration and needs
    additional information before your account can be approved.
  </p>
  ${reasonBlock}
  <p style="margin:0 0 12px;line-height:1.6;">
    Please update your profile or reply to this email with the requested details.
  </p>
  <p style="margin:0;font-size:13px;color:#71717a;">
    Contact us at hrixofficial@gmail.com if you need help.
  </p>
</div>`;
}

/**
 * Sends an approval or action-required notification email.
 *
 * Returns:
 *  - "sent"    — the email provider accepted the request.
 *  - "skipped" — credentials are not configured; email was NOT sent.
 *  - "failed"  — the provider returned an error; email was NOT delivered.
 */
export async function sendModerationEmail(
  params: ModerationEmailParams,
): Promise<"sent" | "skipped" | "failed"> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.HRIX_EMAIL_FROM || "HRIX <noreply@hrix.app>";

  if (!apiKey) {
    console.warn(
      `[HRIX Email] RESEND_API_KEY is not configured. ` +
      `Skipping ${params.decision} email to ${params.to}.`,
    );
    return "skipped";
  }

  const isApproval = params.decision === "approved";
  const subject = isApproval
    ? `Your HRIX ${params.accountType === "brand" ? "Brand" : "Creator"} account is approved`
    : `Action required for your HRIX ${params.accountType === "brand" ? "Brand" : "Creator"} account`;

  const html = isApproval
    ? buildApprovalHtml(params.userName, params.accountType)
    : buildActionRequiredHtml(params.userName, params.accountType, params.reason);

  try {
    const response = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from, to: [params.to], subject, html }),
    });

    if (!response.ok) {
      const body = await response.text().catch(() => "");
      console.error(
        `[HRIX Email] Resend API error (${response.status}): ${body}`,
      );
      return "failed";
    }

    console.log(`[HRIX Email] ${params.decision} email sent to ${params.to}`);
    return "sent";
  } catch (err) {
    console.error("[HRIX Email] Network error sending email:", err);
    return "failed";
  }
}
