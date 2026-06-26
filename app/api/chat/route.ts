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
    // Check if Ollama is configured
    if (!process.env.OLLAMA_CLOUD_API_URL || !process.env.OLLAMA_CLOUD_API_KEY) {
      // Return demo responses when API is not configured
      const demoResponses: { [key: string]: string } = {
        'patient': 'I can help you with patient information. Currently, we have 3 patients in the system: John Doe, Sarah Smith, and Robert Johnson. What would you like to know about them?',
        'help': 'I am your clinic assistant. I can help you with: patient information, medical records, appointment scheduling, and general clinic inquiries. What would you like assistance with?',
        'appointment': 'To schedule an appointment, please visit the clinic directly or call our office. We are open Monday to Friday from 9 AM to 5 PM.',
        'doctor': 'Our clinic has experienced medical professionals available. Please contact us to schedule a consultation with your preferred doctor.',
        'hello': 'Hello! How can I assist you today? You can ask about patients, appointments, or any clinic-related questions.',
        'hi': 'Hi there! What can I help you with today?',
      };

      // Find matching response or return a generic one
      const lowerMessage = userMessage.toLowerCase();
      for (const [key, response] of Object.entries(demoResponses)) {
        if (lowerMessage.includes(key)) {
          return response;
        }
      }

      return 'Thank you for your inquiry. At the moment, I am in demo mode. For assistance, please contact our clinic directly at (555) 123-4567.';
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
    console.error('[v0] Error calling Ollama API:', error);
    return 'I apologize, but I encountered an error. In demo mode, I have limited responses. Please contact our clinic directly for assistance.';
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = await getUserId() || 'demo-user';
    const body = await req.json();
    const { message, patientId } = body;

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Get patient context if provided and database is available
    let context = '';
    if (patientId && process.env.DATABASE_URL) {
      try {
        const db = getDb();
        const patient = await db
          .select()
          .from(patients)
          .where(eq(patients.id, patientId));

        if (patient.length) {
          context = `Patient: ${patient[0].firstName} ${patient[0].lastName}, Age: ${
            patient[0].dateOfBirth
              ? new Date().getFullYear() - new Date(patient[0].dateOfBirth).getFullYear()
              : 'N/A'
          }`;
        }
      } catch (dbError) {
        console.error('[v0] Error fetching patient context:', dbError);
      }
    }

    // Get response from Ollama or demo
    const aiResponse = await getOllamaResponse(message, context);

    // Try to save to chat history if database is available
    if (process.env.DATABASE_URL) {
      try {
        const db = getDb();
        await db.insert(chatHistory).values({
          userId,
          patientId: patientId ? parseInt(patientId) : undefined,
          userMessage: message,
          aiResponse,
          context,
        });
      } catch (dbError) {
        console.error('[v0] Error saving chat history:', dbError);
        // Continue anyway - don't fail the response
      }
    }

    return NextResponse.json({
      response: aiResponse,
      context,
    });
  } catch (error) {
    console.error('[v0] Error in chat endpoint:', error);
    return NextResponse.json(
      { response: 'I apologize, but I encountered an error processing your request. Please try again.' },
      { status: 200 }
    );
  }
}
