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
    const db = getDb();
    const userId = await getUserId() || 'demo-user';

    const userPatients = await db
      .select()
      .from(patients)
      .where(eq(patients.userId, userId));

    return NextResponse.json(userPatients);
  } catch (error) {
    console.error('[v0] Patients GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch patients', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = await getUserId() || 'demo-user';
    const body = await req.json();
    const db = getDb();

    const newPatient = await db
      .insert(patients)
      .values({
        userId,
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        phone: body.phone,
        dateOfBirth: body.dateOfBirth,
        emergencyContact: body.emergencyContact,
        emergencyPhone: body.emergencyPhone,
      })
      .returning();

    return NextResponse.json(newPatient[0], { status: 201 });
  } catch (error) {
    console.error('[v0] Patients POST error:', error);
    return NextResponse.json(
      { error: 'Failed to create patient', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
