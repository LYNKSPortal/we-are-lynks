import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { sql } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const meetings = await sql`
      SELECT id, type, name, email, phone, platform, timezone,
             preferred_date, preferred_time, message, status, created_at
      FROM meeting_requests
      ORDER BY preferred_date ASC, preferred_time ASC
    `;

    return NextResponse.json({ data: meetings }, { status: 200 });
  } catch (error) {
    console.error('Error fetching meetings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch meetings' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { type, name, email, phone, platform, timezone, preferredDate, preferredTime, message } = body;

    if (!type || !name || !email || !phone || !preferredDate || !preferredTime) {
      return NextResponse.json(
        { error: 'Type, name, email, phone, date, and time are required' },
        { status: 400 }
      );
    }

    await sql`
      INSERT INTO meeting_requests (
        type, name, email, phone, platform, timezone, preferred_date, preferred_time, message, status, created_at
      )
      VALUES (
        ${type}, ${name}, ${email}, ${phone}, ${platform || null}, ${timezone || null},
        ${preferredDate}, ${preferredTime}, ${message || ''}, 'confirmed', NOW()
      )
    `;

    return NextResponse.json({ message: 'Meeting booked successfully' }, { status: 201 });
  } catch (error) {
    console.error('Error creating meeting:', error);
    return NextResponse.json(
      { error: 'Failed to book meeting' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, name, email, phone, platform, timezone, preferredDate, preferredTime, message, status } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    await sql`
      UPDATE meeting_requests SET
        name = ${name},
        email = ${email},
        phone = ${phone},
        platform = ${platform || null},
        timezone = ${timezone || null},
        preferred_date = ${preferredDate},
        preferred_time = ${preferredTime},
        message = ${message || ''},
        status = ${status}
      WHERE id = ${id}
    `;

    return NextResponse.json({ message: 'Meeting updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error updating meeting:', error);
    return NextResponse.json(
      { error: 'Failed to update meeting' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    await sql`DELETE FROM meeting_requests WHERE id = ${id}`;

    return NextResponse.json({ message: 'Meeting deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting meeting:', error);
    return NextResponse.json(
      { error: 'Failed to delete meeting' },
      { status: 500 }
    );
  }
}
