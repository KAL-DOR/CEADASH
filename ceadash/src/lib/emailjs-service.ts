// EmailJS Email Service
// Sends emails through your Gmail account
import emailjs from '@emailjs/browser';

export interface ScheduledCallEmailData {
  id: string;
  contact_name: string;
  contact_email: string;
  scheduled_date: string;
  notes?: string | null;
  bot_connection_url?: string | null;
}

/**
 * Send a scheduled call notification email via EmailJS (through your Gmail)
 */
export async function sendSchedulingEmailViaGmail(
  to: string,
  scheduledCall: ScheduledCallEmailData,
  additionalCCs?: string[]
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

    if (!serviceId || !templateId || !publicKey) {
      throw new Error('EmailJS credentials not configured. Check your .env.local file.');
    }

    // Format the date nicely
    const scheduledDate = new Date(scheduledCall.scheduled_date);
    const formattedDate = scheduledDate.toLocaleString('es-MX', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'America/Mexico_City'
    });

    // Prepare template parameters
    const templateParams = {
      to_email: to,
      contact_name: scheduledCall.contact_name,
      contact_email: scheduledCall.contact_email,
      scheduled_date: formattedDate,
      notes: scheduledCall.notes || 'Sin notas adicionales',
      bot_url: scheduledCall.bot_connection_url || 'El link será enviado pronto',
      // Add CCs if provided
      cc_emails: additionalCCs?.join(', ') || ''
    };

    console.log('📧 Sending email via EmailJS/Gmail:', {
      to,
      contact: scheduledCall.contact_name,
      scheduled: formattedDate,
    });

    // Send email using EmailJS
    const response = await emailjs.send(
      serviceId,
      templateId,
      templateParams,
      publicKey
    );

    console.log('✅ Email sent successfully via Gmail:', response);

    return {
      success: true,
      messageId: response.text,
    };
  } catch (error) {
    console.error('❌ Failed to send email via EmailJS:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send email',
    };
  }
}

/**
 * Validate email format
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

