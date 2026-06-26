import { getDb } from '@/lib/db/client';
import { medications, patients } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

async function getUserId(): Promise<string | null> {
  const headersList = await headers();
  return headersList.get('x-user-id');
}

export async function POST(req: NextRequest) {
  try {
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = getDb();
    const body = await req.json();

    // Verify patient ownership
    const patient = await db
      .select()
      .from(patients)
      .where(eq(patients.id, body.patientId));

    if (!patient.length || patient[0].userId !== userId) {
      return NextResponse.json(
        { error: 'Patient not found' },
        { status: 404 }
      );
    }

    const newMedication = await db
      .insert(medications)
      .values({
        patientId: body.patientId,
        medicationName: body.medicationName,
        dosage: body.dosage,
        frequency: body.frequency,
        startDate: body.startDate ? new Date(body.startDate) : new Date(),
        endDate: body.endDate ? new Date(body.endDate) : undefined,
        prescribedBy: body.prescribedBy,
        notes: body.notes,
      })
      .returning();

    return NextResponse.json(newMedication[0], { status: 201 });
  } catch (error) {
    console.error('Error creating medication:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
