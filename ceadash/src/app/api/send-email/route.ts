import { NextResponse } from 'next/server';
import { sendSchedulingEmail, type EmailData } from '@/lib/email-service';

export async function POST(request: Request) {
  try {
    const emailData: EmailData = await request.json();
    
    const result = await sendSchedulingEmail(emailData);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in send-email API:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to send email' 
      },
      { status: 500 }
    );
  }
}

