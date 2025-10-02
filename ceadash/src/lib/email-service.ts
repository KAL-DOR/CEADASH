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
  defaultCompanyName: "Comisión Estatal de Agua",
  fromEmail: "noreply@cea.gob.mx",
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
        
        <p>La Comisión Estatal de Agua (CEA) te ha programado una entrevista con nuestro asistente virtual para conocer más sobre tus operaciones diarias en <strong>${processTypeLabel}</strong>. El objetivo es entender mejor cómo trabajas y qué podemos hacer para apoyarte.</p>

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
            <h3>🤖 Asistente Virtual de la CEA</h3>
            <p>Hemos configurado un asistente virtual especializado para entrevistar al personal de la CEA. El asistente:</p>
            <ul>
                <li>Te hará preguntas sobre tu trabajo diario en ${processTypeLabel}</li>
                <li>Escuchará tus experiencias y desafíos</li>
                <li>Documentará tus actividades y procesos</li>
                <li>Identificará áreas de oportunidad desde tu perspectiva</li>
            </ul>
            <p><strong>Recuerda:</strong> Esta es una entrevista confidencial para mejorar las operaciones de la CEA. Tu feedback es muy valioso.</p>
        </div>

        <div style="text-align: center;">
            <a href="${data.botConnectionUrl}" class="cta-button">
                🎙️ Conectar con el Agente de IA
            </a>
        </div>

        <div class="instructions">
            <h3>📋 Cómo conectarte:</h3>
            <ol>
                <li><strong>Haz clic en el botón de arriba</strong> a la hora programada</li>
                <li><strong>Permite el acceso al micrófono</strong> cuando el navegador lo solicite</li>
                <li><strong>Habla naturalmente</strong> sobre tu trabajo diario</li>
                <li><strong>Sé específico</strong> sobre las tareas que realizas, herramientas que usas, y con quién trabajas</li>
                <li><strong>Comparte tus experiencias</strong> - tanto lo que funciona bien como los desafíos</li>
            </ol>
        </div>

        <div class="instructions">
            <h3>💡 Qué puedes compartir:</h3>
            <ul>
                <li>Tus actividades diarias, semanales o mensuales</li>
                <li>Herramientas, sistemas o equipos que utilizas</li>
                <li>Desafíos o problemas que enfrentas en tu trabajo</li>
                <li>Coordinación con otros departamentos o áreas</li>
                <li>Sugerencias o ideas de mejora</li>
            </ul>
        </div>

        <p><strong>¿Necesitas reprogramar?</strong> Responde a este email o contacta a ${data.adminName}.</p>

        <div class="footer">
            <p>Este email fue enviado por ${data.companyName}</p>
            <p>Sistema de entrevistas para mejora de operaciones</p>
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
