import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;
const fromEmail = process.env.EMAIL_FROM || "Life Resume <noreply@liferesume.com>";
const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailParams): Promise<{ success: boolean; id?: string }> {
  try {
    if (resend && resendApiKey && !resendApiKey.startsWith("re_1234567890")) {
      const response = await resend.emails.send({
        from: fromEmail,
        to,
        subject,
        html,
      });
      return { success: true, id: response.data?.id };
    }

    // Development / unconfigured fallback: log cleanly for testing
    console.info("==================================================================");
    console.info(`[EMAIL DISPATCH] To: ${to}`);
    console.info(`[EMAIL DISPATCH] Subject: ${subject}`);
    console.info(`[EMAIL DISPATCH] Preview Content:\n${html.replace(/<[^>]*>?/gm, " ").trim().substring(0, 300)}...`);
    console.info("==================================================================");
    return { success: true, id: "simulated-email-id" };
  } catch (error) {
    console.error("[Email Dispatch Error]", error);
    return { success: false };
  }
}

export async function sendVerificationRequestEmail({
  to,
  requesterName,
  achievementTitle,
  rawToken,
  customMessage,
}: {
  to: string;
  requesterName: string;
  achievementTitle: string;
  rawToken: string;
  customMessage?: string | null;
}) {
  const verifyUrl = `${appUrl}/verify/${rawToken}`;
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #FFF8E5; margin: 0; padding: 24px; color: #252525; }
          .container { max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #EFE9D9; padding: 36px; }
          .header { text-align: center; margin-bottom: 24px; }
          .badge { display: inline-block; background-color: #F5C542; color: #252525; font-weight: 700; font-size: 13px; padding: 4px 12px; border-radius: 20px; }
          .btn { display: inline-block; background-color: #F5C542; color: #252525; text-decoration: none; font-weight: 600; padding: 14px 28px; border-radius: 8px; margin: 24px 0; }
          .footer { font-size: 12px; color: #777777; margin-top: 32px; text-align: center; }
          .card { background-color: #FFFEF8; border: 1px solid #EFE9D9; padding: 16px; border-radius: 8px; margin: 16px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <span class="badge">LIFE RESUME ATTESTATION</span>
            <h2 style="margin-top: 12px; color: #252525;">Achievement Verification Request</h2>
          </div>
          <p>Hello,</p>
          <p><strong>${requesterName}</strong> has documented an achievement on Life Resume and requested your official verification as an organizer, mentor, or supervisor.</p>
          
          <div class="card">
            <div style="font-size: 12px; text-transform: uppercase; color: #777777; font-weight: 600;">Achievement Claim</div>
            <div style="font-size: 18px; font-weight: 700; margin: 6px 0;">${achievementTitle}</div>
            ${customMessage ? `<p style="font-size: 14px; color: #555; margin: 8px 0 0 0;"><em>"${customMessage}"</em></p>` : ""}
          </div>

          <p>Please review the details and any attached evidence. You can confirm or dispute the role, attendance, or measurable impact.</p>
          
          <div style="text-align: center;">
            <a href="${verifyUrl}" class="btn">Review & Verify Achievement</a>
          </div>

          <p style="font-size: 12px; color: #777777;">This secure link is single-use and will expire in 14 days. If you did not oversee this activity, you may reject the claim or simply ignore this email.</p>
          
          <div class="footer">
            Life Resume — Your achievements. Your evidence. Your story.<br />
            Secure token: <code>${verifyUrl}</code>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to,
    subject: `Verification Request: ${requesterName} on Life Resume`,
    html,
  });
}

export async function sendPasswordResetEmail({ to, rawToken }: { to: string; rawToken: string }) {
  const resetUrl = `${appUrl}/auth/reset-password?token=${rawToken}`;
  const html = `
    <div style="font-family: sans-serif; background-color: #FFF8E5; padding: 32px;">
      <div style="max-width: 500px; margin: auto; background: white; padding: 32px; border-radius: 16px; border: 1px solid #EFE9D9;">
        <h2 style="color: #252525;">Reset Your Life Resume Password</h2>
        <p>You recently requested to reset your password. Click the button below to proceed. This link is valid for 1 hour.</p>
        <p style="text-align: center; margin: 24px 0;">
          <a href="${resetUrl}" style="background-color: #F5C542; color: #252525; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">Reset Password</a>
        </p>
        <p style="font-size: 12px; color: #777;">If you did not request this, please disregard this email.</p>
      </div>
    </div>
  `;
  return sendEmail({ to, subject: "Reset your Life Resume password", html });
}

export async function sendEmailConfirmation({ to, rawToken }: { to: string; rawToken: string }) {
  const verifyUrl = `${appUrl}/auth/verify-email?token=${rawToken}`;
  const html = `
    <div style="font-family: sans-serif; background-color: #FFF8E5; padding: 32px;">
      <div style="max-width: 500px; margin: auto; background: white; padding: 32px; border-radius: 16px; border: 1px solid #EFE9D9;">
        <h2 style="color: #252525;">Welcome to Life Resume!</h2>
        <p>Confirm your email address to activate your full achievement portfolio.</p>
        <p style="text-align: center; margin: 24px 0;">
          <a href="${verifyUrl}" style="background-color: #F5C542; color: #252525; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">Confirm Email</a>
        </p>
      </div>
    </div>
  `;
  return sendEmail({ to, subject: "Confirm your Life Resume account", html });
}
