import { getDb } from '@/lib/db/client';
import { chatHistory, patients } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

async function getUserId(): Promise<string | null> {
  const headersList = await headers();
  return headersList.get('x-user-id');
}

async function getOllamaResponse(userMessage: string, context?: string): Promise<string> {
  try {
    if (!process.env.OLLAMA_CLOUD_API_URL || !process.env.OLLAMA_CLOUD_API_KEY) {
      return 'Ollama API is not configured. Please set OLLAMA_CLOUD_API_URL and OLLAMA_CLOUD_API_KEY.';
    }

    const prompt = context
      ? `Based on the following patient context: ${context}\n\nRespond to: ${userMessage}`
      : userMessage;

    const response = await axios.post(
      `${process.env.OLLAMA_CLOUD_API_URL}/api/generate`,
      {
        model: 'llama2',
        prompt: prompt,
        stream: false,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OLLAMA_CLOUD_API_KEY}`,
        },
        timeout: 30000,
      }
    );

    return response.data.response || 'No response from Ollama';
  } catch (error) {
    console.error('Error calling Ollama API:', error);
    return 'Error communicating with AI service. Please try again later.';
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = getDb();
    const body = await req.json();
    const { message, patientId } = body;

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Get patient context if provided
    let context = '';
    if (patientId) {
      const patient = await db
        .select()
        .from(patients)
        .where(eq(patients.id, patientId));

      if (patient.length && patient[0].userId === userId) {
        context = `Patient: ${patient[0].name}, Age: ${
          patient[0].dateOfBirth
            ? new Date().getFullYear() - new Date(patient[0].dateOfBirth).getFullYear()
            : 'N/A'
        }, Medical History: ${patient[0].medicalHistory || 'None'}, Allergies: ${
          patient[0].allergies || 'None'
        }`;
      }
    }

    // Get response from Ollama
    const aiResponse = await getOllamaResponse(message, context);

    // Save to chat history
    await db.insert(chatHistory).values({
      userId,
      patientId: patientId ? parseInt(patientId) : undefined,
      userMessage: message,
      aiResponse,
      context,
    });

    return NextResponse.json({
      userMessage: message,
      aiResponse,
      context,
    });
  } catch (error) {
    console.error('Error in chat endpoint:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
