import { NextResponse } from 'next/server';
import { neonSql } from '@/lib/neon';

// One-time setup route: seeds the admin_users table (Neon) from the
// existing ADMIN_USERNAME / ADMIN_PASSWORD_HASH / ADMIN_EMAIL env vars,
// so the DB-backed login + forgot-password flow has a starting account.
export async function GET() {
  try {
    const username = process.env.ADMIN_USERNAME;
    const passwordHashRaw = process.env.ADMIN_PASSWORD_HASH;
    const email = process.env.ADMIN_EMAIL || 'support@wearelynks.com';

    if (!username || !passwordHashRaw) {
      return NextResponse.json(
        { success: false, error: 'ADMIN_USERNAME and ADMIN_PASSWORD_HASH must be set' },
        { status: 400 }
      );
    }

    // Normalize and reconstruct the full bcrypt hash (allows the env var to include or omit $ signs)
    const normalizedHash = passwordHashRaw.replace(/\$/g, '');
    const passwordHash = `$${normalizedHash.slice(0, 2)}$${normalizedHash.slice(2, 4)}$${normalizedHash.slice(4)}`;

    await neonSql`
      INSERT INTO admin_users (username, email, password_hash)
      VALUES (${username}, ${email}, ${passwordHash})
      ON CONFLICT (username) DO NOTHING
    `;

    return NextResponse.json({ success: true, message: 'Admin user seeded successfully' });
  } catch (error) {
    console.error('Error seeding admin user:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
