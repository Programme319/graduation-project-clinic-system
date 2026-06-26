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
    const userId = await getUserId() || 'demo-user';

    // Demo mode - return sample data if database is not connected
    if (!process.env.DATABASE_URL) {
      const demoPatients = [
        {
          id: 1,
          userId,
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          phone: '555-0101',
          dateOfBirth: '1985-03-15',
          emergencyContact: 'Jane Doe',
          emergencyPhone: '555-0102',
        },
        {
          id: 2,
          userId,
          firstName: 'Sarah',
          lastName: 'Smith',
          email: 'sarah@example.com',
          phone: '555-0201',
          dateOfBirth: '1990-07-22',
          emergencyContact: 'Michael Smith',
          emergencyPhone: '555-0202',
        },
        {
          id: 3,
          userId,
          firstName: 'Robert',
          lastName: 'Johnson',
          email: 'robert@example.com',
          phone: '555-0301',
          dateOfBirth: '1988-11-30',
          emergencyContact: 'Emily Johnson',
          emergencyPhone: '555-0302',
        },
      ];
      return NextResponse.json(demoPatients);
    }

    const db = getDb();
    const userPatients = await db
      .select()
      .from(patients)
      .where(eq(patients.userId, userId));

    return NextResponse.json(userPatients);
  } catch (error) {
    console.error('[v0] Patients GET error:', error);
    // Fallback to demo data on error
    const demoPatients = [
      {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '555-0101',
      },
      {
        id: 2,
        firstName: 'Sarah',
        lastName: 'Smith',
        email: 'sarah@example.com',
        phone: '555-0201',
      },
    ];
    return NextResponse.json(demoPatients);
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
