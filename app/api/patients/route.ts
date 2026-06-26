import { getDb } from '@/lib/db/client';
import { patients } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

// Helper to extract user ID from request
async function getUserId(): Promise<string | null> {
  const headersList = await headers();
  
  // In a real app, you'd validate the token here
  // For now, we'll extract userId from a custom header set by middleware
  return headersList.get('x-user-id');
}

export async function GET(_req: NextRequest) {
  try {
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = getDb();
    const userPatients = await db
      .select()
      .from(patients)
      .where(eq(patients.userId, userId));

    return NextResponse.json(userPatients);
  } catch (error) {
    console.error('Error fetching patients:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const db = getDb();

    const newPatient = await db
      .insert(patients)
      .values({
        userId,
        name: body.name,
        email: body.email,
        phone: body.phone,
        address: body.address,
        dateOfBirth: body.dateOfBirth ? new Date(body.dateOfBirth) : undefined,
        medicalHistory: body.medicalHistory,
        allergies: body.allergies,
        emergencyContact: body.emergencyContact,
        emergencyPhone: body.emergencyPhone,
      })
      .returning();

    return NextResponse.json(newPatient[0], { status: 201 });
  } catch (error) {
    console.error('Error creating patient:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
