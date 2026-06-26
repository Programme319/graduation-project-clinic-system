import { getDb } from '@/lib/db/client';
import { patients, investigations, medications } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

async function getUserId(): Promise<string | null> {
  const headersList = await headers();
  return headersList.get('x-user-id');
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = getDb();
    const { id } = await params;
    const patientId = parseInt(id);

    // Get patient
    const patient = await db
      .select()
      .from(patients)
      .where(eq(patients.id, patientId));

    if (!patient.length || patient[0].userId !== userId) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    // Get investigations
    const patientInvestigations = await db
      .select()
      .from(investigations)
      .where(eq(investigations.patientId, patientId));

    // Get medications
    const patientMedications = await db
      .select()
      .from(medications)
      .where(eq(medications.patientId, patientId));

    return NextResponse.json({
      ...patient[0],
      investigations: patientInvestigations,
      medications: patientMedications,
    });
  } catch (error) {
    console.error('Error fetching patient:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = getDb();
    const { id } = await params;
    const patientId = parseInt(id);
    const body = await req.json();

    // Verify ownership
    const patient = await db
      .select()
      .from(patients)
      .where(eq(patients.id, patientId));

    if (!patient.length || patient[0].userId !== userId) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const updatedPatient = await db
      .update(patients)
      .set({
        name: body.name,
        email: body.email,
        phone: body.phone,
        address: body.address,
        medicalHistory: body.medicalHistory,
        allergies: body.allergies,
        emergencyContact: body.emergencyContact,
        emergencyPhone: body.emergencyPhone,
        updatedAt: new Date(),
      })
      .where(eq(patients.id, patientId))
      .returning();

    return NextResponse.json(updatedPatient[0]);
  } catch (error) {
    console.error('Error updating patient:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = getDb();
    const { id } = await params;
    const patientId = parseInt(id);

    // Verify ownership
    const patient = await db
      .select()
      .from(patients)
      .where(eq(patients.id, patientId));

    if (!patient.length || patient[0].userId !== userId) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    await db.delete(patients).where(eq(patients.id, patientId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting patient:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
