import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const fromEmail = process.env.RESEND_FROM_EMAIL || 'LYNKS Admin <support@wearelynks.com>';

export async function sendPasswordResetEmail(to: string, resetUrl: string) {
  await resend.emails.send({
    from: fromEmail,
    to,
    subject: 'Reset your LYNKS admin password',
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2>Reset your password</h2>
        <p>We received a request to reset the password for your LYNKS admin account.</p>
        <p>
          <a href="${resetUrl}" style="display: inline-block; background: #dbf72c; color: #0c0f17; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">
            Reset Password
          </a>
        </p>
        <p>This link will expire in 1 hour. If you didn't request this, you can safely ignore this email.</p>
      </div>
    `,
  });
}
