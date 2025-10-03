// EmailJS Email Service (CLIENT-SIDE ONLY)
// Sends emails through your Gmail account
// Must be called from browser, not server
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
 * ⚠️ MUST be called from client-side code only (browser environment)
 */
export async function sendSchedulingEmailViaGmail(
  to: string,
  scheduledCall: ScheduledCallEmailData,
  ccEmail?: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    // Check if running in browser
    if (typeof window === 'undefined') {
      throw new Error('EmailJS must be called from client-side (browser) only');
    }

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

    // Prepare template parameters for main email
    const templateParams = {
      to_email: to,
      contact_name: scheduledCall.contact_name,
      contact_email: scheduledCall.contact_email,
      scheduled_date: formattedDate,
      notes: scheduledCall.notes || 'Sin notas adicionales',
      bot_url: scheduledCall.bot_connection_url || 'El link será enviado pronto',
    };

    console.log('📧 Sending email via EmailJS/Gmail:', {
      to,
      contact: scheduledCall.contact_name,
      scheduled: formattedDate,
      cc: ccEmail,
    });

    // Send main email to contact
    const response = await emailjs.send(
      serviceId,
      templateId,
      templateParams,
      publicKey
    );

    console.log('✅ Email sent to contact:', response);

    // Send CC email if provided
    if (ccEmail && ccEmail.trim()) {
      const ccTemplateParams = {
        ...templateParams,
        to_email: ccEmail,
      };
      
      try {
        const ccResponse = await emailjs.send(
          serviceId,
          templateId,
          ccTemplateParams,
          publicKey
        );
        console.log('✅ CC email sent to:', ccEmail, ccResponse);
      } catch (ccError) {
        console.error('⚠️ Failed to send CC email (non-fatal):', ccError);
        // Don't fail the whole operation if CC fails
      }
    }

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

