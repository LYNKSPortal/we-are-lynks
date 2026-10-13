import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { neonSql } from '@/lib/neon';

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json({ error: 'Token and password are required' }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    const tokens = await neonSql<{ id: number; admin_user_id: number; expires_at: string; used_at: string | null }>`
      SELECT id, admin_user_id, expires_at, used_at
      FROM password_reset_tokens
      WHERE token_hash = ${tokenHash}
    `;
    const resetToken = tokens[0];

    if (!resetToken || resetToken.used_at || new Date(resetToken.expires_at) < new Date()) {
      return NextResponse.json({ error: 'Invalid or expired reset link' }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await neonSql`
      UPDATE admin_users SET password_hash = ${passwordHash}, updated_at = NOW()
      WHERE id = ${resetToken.admin_user_id}
    `;
    await neonSql`
      UPDATE password_reset_tokens SET used_at = NOW() WHERE id = ${resetToken.id}
    `;

    return NextResponse.json({ message: 'Password reset successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error resetting password:', error);
    return NextResponse.json({ error: 'Failed to reset password' }, { status: 500 });
  }
}
