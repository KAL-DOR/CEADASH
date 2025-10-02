/**
 * Email Service for sending scheduling notifications
 * Simulates email sending with ElevenLabs agent links
 */

export interface EmailData {
  to: string;
  contactName: string;
  scheduledDate: Date;
  adminName: string;
  companyName: string;
  botConnectionUrl: string;
  processType?: string;
  duration?: number;
}

export interface EmailResult {
  success: boolean;
  emailId?: string;
  message?: string;
  error?: string;
}

export const EMAIL_CONFIG = {
  defaultAdminName: "Equipo CEA",
  defaultCompanyName: "Centro de Excelencia en Automatización",
  fromEmail: "noreply@cea-automation.com",
};

/**
 * Validates email format
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Generates the HTML email template with agent link
 */
function generateEmailTemplate(data: EmailData): string {
  const formattedDate = data.scheduledDate.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  
  const formattedTime = data.scheduledDate.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const processTypeLabel = getProcessTypeLabel(data.processType || "");

  return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Llamada Programada - ${data.companyName}</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8f9fa;
        }
        .container {
            background: white;
            border-radius: 12px;
            padding: 40px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid #e9ecef;
        }
        .logo {
            font-size: 24px;
            font-weight: bold;
            color: #495057;
            margin-bottom: 10px;
        }
        .title {
            color: #2563eb;
            font-size: 28px;
            font-weight: bold;
            margin: 20px 0;
        }
        .details {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
        }
        .detail-item {
            display: flex;
            justify-content: space-between;
            margin: 10px 0;
            padding: 8px 0;
            border-bottom: 1px solid #dee2e6;
        }
        .detail-item:last-child {
            border-bottom: none;
        }
        .detail-label {
            font-weight: 600;
            color: #495057;
        }
        .detail-value {
            color: #6c757d;
        }
        .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 16px 32px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: bold;
            font-size: 18px;
            text-align: center;
            margin: 30px 0;
            transition: transform 0.2s;
        }
        .cta-button:hover {
            transform: translateY(-2px);
        }
        .instructions {
            background: #e3f2fd;
            padding: 20px;
            border-radius: 8px;
            border-left: 4px solid #2196f3;
            margin: 20px 0;
        }
        .instructions h3 {
            color: #1976d2;
            margin-top: 0;
        }
        .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e9ecef;
            color: #6c757d;
            font-size: 14px;
        }
        .agent-info {
            background: #f0f9ff;
            padding: 20px;
            border-radius: 8px;
            border-left: 4px solid #0ea5e9;
            margin: 20px 0;
        }
        .agent-info h3 {
            color: #0284c7;
            margin-top: 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">🤖 ${data.companyName}</div>
            <h1 class="title">¡Tu llamada ha sido programada!</h1>
        </div>

        <p>Hola <strong>${data.contactName}</strong>,</p>
        
        <p>Tu llamada para el mapeo de procesos con nuestro asistente de IA ha sido programada exitosamente. Nuestro agente especializado te ayudará a documentar y optimizar tu proceso de <strong>${processTypeLabel}</strong>.</p>

        <div class="details">
            <div class="detail-item">
                <span class="detail-label">📅 Fecha:</span>
                <span class="detail-value">${formattedDate}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">⏰ Hora:</span>
                <span class="detail-value">${formattedTime}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">🎯 Proceso:</span>
                <span class="detail-value">${processTypeLabel}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">⏱️ Duración:</span>
                <span class="detail-value">${data.duration || 30} minutos</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">👤 Coordinador:</span>
                <span class="detail-value">${data.adminName}</span>
            </div>
        </div>

        <div class="agent-info">
            <h3>🤖 Agente de IA Configurado</h3>
            <p>Hemos configurado un agente de IA especializado específicamente para tu tipo de proceso. El agente:</p>
            <ul>
                <li>Está entrenado en mapeo de procesos de ${processTypeLabel}</li>
                <li>Hará preguntas específicas para tu industria</li>
                <li>Documentará cada paso del proceso en detalle</li>
                <li>Identificará oportunidades de mejora automáticamente</li>
            </ul>
        </div>

        <div style="text-align: center;">
            <a href="${data.botConnectionUrl}" class="cta-button">
                🎙️ Conectar con el Agente de IA
            </a>
        </div>

        <div class="instructions">
            <h3>📋 Instrucciones para la llamada:</h3>
            <ol>
                <li><strong>Haz clic en el botón de arriba</strong> a la hora programada</li>
                <li><strong>Permite el acceso al micrófono</strong> cuando el navegador lo solicite</li>
                <li><strong>Habla claramente</strong> sobre tu proceso actual</li>
                <li><strong>Sé específico</strong> sobre los pasos, herramientas y personas involucradas</li>
                <li><strong>Menciona los puntos de dolor</strong> o ineficiencias que observes</li>
            </ol>
        </div>

        <div class="instructions">
            <h3>💡 Consejos para una sesión exitosa:</h3>
            <ul>
                <li>Ten a mano documentación relevante del proceso</li>
                <li>Prepara ejemplos específicos de cómo funciona actualmente</li>
                <li>Piensa en los principales desafíos que enfrentas</li>
                <li>Considera qué herramientas o sistemas utilizas</li>
            </ul>
        </div>

        <p><strong>¿Necesitas reprogramar?</strong> Responde a este email o contacta a ${data.adminName}.</p>

        <div class="footer">
            <p>Este email fue enviado por ${data.companyName}</p>
            <p>Sistema de automatización de procesos empresariales</p>
        </div>
    </div>
</body>
</html>`;
}

/**
 * Gets the display label for process types
 */
function getProcessTypeLabel(processType: string): string {
  const labels: Record<string, string> = {
    "onboarding": "Incorporación de empleados",
    "ventas": "Proceso de ventas",
    "soporte": "Atención al cliente",
    "manufactura": "Proceso de manufactura",
    "compras": "Proceso de compras",
    "rrhh": "Recursos humanos",
    "finanzas": "Procesos financieros",
    "marketing": "Marketing y publicidad",
    "logistica": "Logística y distribución",
    "otro": "Proceso personalizado",
  };
  
  return labels[processType] || "Proceso empresarial";
}

/**
 * Simulates sending an email (in production, integrate with actual email service)
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

    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Generate email content
    const htmlContent = generateEmailTemplate(data);
    
    // In production, replace this with actual email service integration
    // For now, we'll simulate a successful send
    const emailId = `email_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    console.log("📧 Email would be sent:", {
      to: data.to,
      subject: `Llamada programada - ${getProcessTypeLabel(data.processType || "")}`,
      html: htmlContent,
      emailId,
    });

    return {
      success: true,
      emailId,
      message: `Email sent successfully to ${data.to}`,
    };

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
