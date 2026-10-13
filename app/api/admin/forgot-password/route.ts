import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { neonSql } from '@/lib/neon';
import { sendPasswordResetEmail } from '@/lib/email';

const TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const genericResponse = NextResponse.json(
      { message: 'If an account with that email exists, a reset link has been sent.' },
      { status: 200 }
    );

    const admins = await neonSql<{ id: number; email: string }>`
      SELECT id, email FROM admin_users WHERE email = ${email}
    `;
    const admin = admins[0];

    if (!admin) {
      // Don't reveal whether the email exists
      return genericResponse;
    }

    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    const expiresAt = new Date(Date.now() + TOKEN_TTL_MS);

    await neonSql`
      INSERT INTO password_reset_tokens (admin_user_id, token_hash, expires_at)
      VALUES (${admin.id}, ${tokenHash}, ${expiresAt.toISOString()})
    `;

    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const resetUrl = `${baseUrl}/admin/reset-password?token=${rawToken}`;

    await sendPasswordResetEmail(admin.email, resetUrl);

    return genericResponse;
  } catch (error) {
    console.error('Error processing forgot-password request:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
