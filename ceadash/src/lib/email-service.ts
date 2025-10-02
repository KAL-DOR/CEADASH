/**
 * Email Service for sending scheduling notifications
 * Simulates email sending with ElevenLabs agent links
 */

export interface EmailData {
  to: string;
  contactName: string;
  scheduledDate: Date | string; // Can be Date object or ISO string from API
  adminName: string;
  companyName: string;
  botConnectionUrl: string;
  processType?: string;
  duration?: number;
  ccEmails?: string[]; // Optional CC emails from user configuration
}

export interface EmailResult {
  success: boolean;
  emailId?: string;
  message?: string;
  error?: string;
}

export const EMAIL_CONFIG = {
  defaultAdminName: "Equipo CEA",
  defaultCompanyName: "Comisión Estatal de Agua",
  fromEmail: "onboarding@resend.dev", // Using Resend's test domain - replace with your verified domain
  defaultCcEmails: ["edc@provivienda.mx"], // Always CC this email
};

/**
 * Validates email format
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Generates a simple plain text email (as requested by user)
 */
function generateEmailTemplate(data: EmailData): string {
  // Convert scheduledDate to Date object if it's a string
  const dateObj = typeof data.scheduledDate === 'string' ? new Date(data.scheduledDate) : data.scheduledDate;
  
  const formattedDate = dateObj.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  
  const formattedTime = dateObj.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const processTypeLabel = getProcessTypeLabel(data.processType || "");

  return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; padding: 20px;">
    <h2>Entrevista CEA Programada</h2>
    
    <p>Hola <strong>${data.contactName}</strong>,</p>
    
    <p>La Comisión Estatal de Agua te ha programado una entrevista con nuestro asistente virtual para conocer más sobre tus operaciones en <strong>${processTypeLabel}</strong>.</p>
    
    <p><strong>Detalles:</strong></p>
    <ul>
        <li>📅 Fecha: ${formattedDate}</li>
        <li>⏰ Hora: ${formattedTime}</li>
        <li>⏱️ Duración: ${data.duration || 30} minutos</li>
        <li>👤 Coordinador: ${data.adminName}</li>
    </ul>
    
    <p><strong>Para conectarte a la hora programada, haz clic aquí:</strong></p>
    <p><a href="${data.botConnectionUrl}" style="color: #2563eb; font-size: 18px;">${data.botConnectionUrl}</a></p>
    
    <p>El asistente te hará preguntas sobre tu trabajo diario, herramientas que utilizas, y desafíos que enfrentas. Tu feedback es muy valioso para mejorar las operaciones de la CEA.</p>
    
    <p>Si necesitas reprogramar, responde a este email o contacta a ${data.adminName}.</p>
    
    <hr style="margin: 20px 0; border: none; border-top: 1px solid #ccc;">
    <p style="font-size: 12px; color: #666;">Comisión Estatal de Agua - Sistema de entrevistas</p>
</body>
</html>`;
}

/**
 * Gets the display label for process types
 */
function getProcessTypeLabel(processType: string): string {
  const labels: Record<string, string> = {
    "agua_potable": "Gestión de Agua Potable",
    "saneamiento": "Saneamiento y Alcantarillado",
    "tratamiento": "Tratamiento de Aguas Residuales",
    "mantenimiento": "Mantenimiento de Infraestructura",
    "atencion_ciudadana": "Atención Ciudadana",
    "facturacion": "Facturación y Cobranza",
    "operacion": "Operación de Sistemas",
    "calidad_agua": "Control de Calidad del Agua",
    "medicion": "Medición y Macromedición",
    "fugas": "Detección y Reparación de Fugas",
    "rrhh": "Recursos Humanos",
    "administracion": "Administración General",
    "compras": "Adquisiciones y Compras",
    "almacen": "Almacén e Inventarios",
    "finanzas": "Finanzas y Contabilidad",
    "juridico": "Área Jurídica",
    "planeacion": "Planeación y Proyectos",
    "otro": "Otras operaciones",
  };
  
  return labels[processType] || "Operaciones de la CEA";
}

/**
 * Sends an email using Resend API (or simulates if API key not configured)
 */
export async function sendSchedulingEmail(data: EmailData): Promise<EmailResult> {
  try {
    // Validate email
    if (!validateEmail(data.to)) {
      return {
        success: false,
        error: "Invalid email address",
      };
    }

    // Validate CC emails if provided
    if (data.ccEmails && data.ccEmails.length > 0) {
      for (const ccEmail of data.ccEmails) {
        if (!validateEmail(ccEmail)) {
          return {
            success: false,
            error: `Invalid CC email address: ${ccEmail}`,
          };
        }
      }
    }

    // Generate email content
    const htmlContent = generateEmailTemplate(data);
    const subject = `Entrevista CEA programada - ${getProcessTypeLabel(data.processType || "")}`;
    
    // Check if Resend API key is configured
    const resendApiKey = process.env.RESEND_API_KEY;
    
    if (resendApiKey) {
      // Send real email using Resend
      try {
        const response = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: EMAIL_CONFIG.fromEmail,
            to: [data.to],
            cc: [...(data.ccEmails || []), ...EMAIL_CONFIG.defaultCcEmails],
            subject: subject,
            html: htmlContent,
          }),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || 'Failed to send email');
        }

        console.log("✅ Email sent successfully via Resend:", result.id);

        const allCcEmails = [...(data.ccEmails || []), ...EMAIL_CONFIG.defaultCcEmails];
        return {
          success: true,
          emailId: result.id,
          message: `Email sent successfully to ${data.to}${allCcEmails.length ? ` with CC to ${allCcEmails.join(', ')}` : ''}`,
        };
      } catch (emailError) {
        console.error("Error sending via Resend:", emailError);
        return {
          success: false,
          error: emailError instanceof Error ? emailError.message : "Failed to send email",
        };
      }
    } else {
      // Simulate email sending (for development/demo without API key)
      console.log("⚠️  RESEND_API_KEY not configured - simulating email send");
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const emailId = `sim_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      console.log("📧 Email simulation:", {
        to: data.to,
        cc: data.ccEmails,
        subject: subject,
        emailId,
      });

      return {
        success: true,
        emailId,
        message: `Email simulated (no RESEND_API_KEY) to ${data.to}${data.ccEmails?.length ? ` with CC to ${data.ccEmails.join(', ')}` : ''}`,
      };
    }

  } catch (error) {
    console.error("Error sending email:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

/**
 * Generates a bot connection URL (placeholder for actual ElevenLabs integration)
 */
export function generateBotConnectionUrl(callId: string): string {
  return `https://elevenlabs.io/convai/conversation?agent_id=${callId}`;
}
