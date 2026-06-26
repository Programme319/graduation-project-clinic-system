import { getDb } from '@/lib/db/client';
import { patients, investigations, medications } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const db = getDb();
    const { id } = await params;
    const patientId = parseInt(id);

    // Get patient
    const patient = await db
      .select()
      .from(patients)
      .where(eq(patients.id, patientId));

    if (!patient.length) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
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
    console.error('[v0] Patient detail GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch patient', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const db = getDb();
    const { id } = await params;
    const patientId = parseInt(id);
    const body = await req.json();

    // Verify patient exists
    const patient = await db
      .select()
      .from(patients)
      .where(eq(patients.id, patientId));

    if (!patient.length) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }

    const updatedPatient = await db
      .update(patients)
      .set({
        firstName: body.firstName || patient[0].firstName,
        lastName: body.lastName || patient[0].lastName,
        email: body.email,
        phone: body.phone,
        dateOfBirth: body.dateOfBirth,
        emergencyContact: body.emergencyContact,
        emergencyPhone: body.emergencyPhone,
      })
      .where(eq(patients.id, patientId))
      .returning();

    return NextResponse.json(updatedPatient[0]);
  } catch (error) {
    console.error('[v0] Patient detail PUT error:', error);
    return NextResponse.json(
      { error: 'Failed to update patient', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const db = getDb();
    const { id } = await params;
    const patientId = parseInt(id);

    // Verify patient exists
    const patient = await db
      .select()
      .from(patients)
      .where(eq(patients.id, patientId));

    if (!patient.length) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }

    await db.delete(patients).where(eq(patients.id, patientId));

    return NextResponse.json({ success: true, message: 'Patient deleted' });
  } catch (error) {
    console.error('[v0] Patient detail DELETE error:', error);
    return NextResponse.json(
      { error: 'Failed to delete patient', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
