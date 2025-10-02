import { Card, Stack, Title, Text, Button, Group, Divider, Alert } from "@mantine/core";
import { IconCalendar, IconPhone, IconInfoCircle } from "@tabler/icons-react";

interface EmailTemplateProps {
  contactName: string;
  scheduledDate: Date;
  adminName?: string;
  companyName?: string;
  botConnectionUrl?: string;
}

export function EmailTemplate({
  contactName,
  scheduledDate,
  adminName = "Equipo CEA",
  companyName = "CEA Dashboard",
  botConnectionUrl = "https://elevenlabs.io/connect/cea-bot"
}: EmailTemplateProps) {
  const formattedDate = scheduledDate.toLocaleString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Card shadow="sm" padding="xl" radius="md" withBorder style={{ maxWidth: 600, margin: "0 auto" }}>
      <Stack gap="lg">
        {/* Header */}
        <div style={{ textAlign: "center" }}>
          <Title order={2} c="blue">¡Llamada Programada!</Title>
          <Text c="dimmed">Proceso de Mapeo con IA</Text>
        </div>

        <Divider />

        {/* Greeting */}
        <div>
          <Text size="lg">Hola <strong>{contactName}</strong>,</Text>
          <Text mt="sm">
            Hemos programado una llamada contigo para mapear y optimizar tus procesos empresariales 
            utilizando nuestra tecnología de IA avanzada.
          </Text>
        </div>

        {/* Call Details */}
        <Card bg="blue.0" p="md" radius="md">
          <Group>
            <IconCalendar size={24} color="var(--mantine-color-blue-6)" />
            <div>
              <Text fw={600} c="blue">Fecha y Hora de la Llamada</Text>
              <Text size="lg" fw={700}>{formattedDate}</Text>
            </div>
          </Group>
        </Card>

        {/* Instructions */}
        <Stack gap="sm">
          <Title order={4}>¿Cómo conectarte?</Title>
          <Text>
            Para unirte a la llamada, simplemente haz clic en el botón de abajo a la hora programada. 
            Nuestro asistente de IA te guiará a través del proceso de mapeo.
          </Text>
          
          <Alert icon={<IconInfoCircle size={16} />} color="blue" variant="light">
            <Text size="sm">
              <strong>Importante:</strong> Asegúrate de tener una conexión estable a internet y 
              un micrófono funcionando. La llamada durará aproximadamente 30-45 minutos.
            </Text>
          </Alert>
        </Stack>

        {/* Connection Button */}
        <div style={{ textAlign: "center" }}>
          <Button
            size="lg"
            leftSection={<IconPhone size={20} />}
            component="a"
            href={botConnectionUrl}
            target="_blank"
            style={{ fontSize: 16, padding: "12px 32px" }}
          >
            Conectar con el Bot de IA
          </Button>
          <Text size="sm" c="dimmed" mt="xs">
            Disponible 10 minutos antes de la hora programada
          </Text>
        </div>

        {/* What to Expect */}
        <Stack gap="xs">
          <Title order={4}>¿Qué esperar en la llamada?</Title>
          <Text size="sm" c="dimmed">
            • El asistente de IA te hará preguntas sobre tus procesos actuales<br/>
            • Describirás paso a paso cómo realizas ciertas tareas<br/>
            • El sistema generará un diagrama de flujo automáticamente<br/>
            • Recibirás sugerencias de mejora personalizadas<br/>
            • Todo quedará documentado para futuras referencias
          </Text>
        </Stack>

        <Divider />

        {/* Footer */}
        <div style={{ textAlign: "center" }}>
          <Text size="sm" c="dimmed">
            ¿Necesitas reprogramar o tienes preguntas?<br/>
            Contacta a <strong>{adminName}</strong> en {companyName}
          </Text>
          <Text size="xs" c="dimmed" mt="sm">
            Este email fue generado automáticamente por el sistema CEA Dashboard
          </Text>
        </div>
      </Stack>
    </Card>
  );
}

// Función para generar el HTML del email
export function generateEmailHTML({
  contactName,
  scheduledDate,
  adminName = "Equipo CEA",
  companyName = "CEA Dashboard",
  botConnectionUrl = "https://elevenlabs.io/connect/cea-bot"
}: EmailTemplateProps): string {
  const formattedDate = scheduledDate.toLocaleString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Llamada Programada - CEA Dashboard</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .header h1 { color: #228be6; margin: 0; }
        .header p { color: #666; margin: 5px 0; }
        .call-details { background: #e7f5ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #228be6; }
        .call-details h3 { color: #228be6; margin: 0 0 10px 0; }
        .call-details .date { font-size: 18px; font-weight: bold; }
        .connect-button { text-align: center; margin: 30px 0; }
        .connect-button a { background: #228be6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; }
        .alert { background: #e7f5ff; border: 1px solid #74c0fc; padding: 15px; border-radius: 6px; margin: 20px 0; }
        .expectations { background: #f8f9fa; padding: 20px; border-radius: 6px; margin: 20px 0; }
        .expectations ul { margin: 10px 0; padding-left: 20px; }
        .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #dee2e6; color: #666; font-size: 14px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>¡Llamada Programada!</h1>
        <p>Proceso de Mapeo con IA</p>
    </div>

    <p>Hola <strong>${contactName}</strong>,</p>
    <p>Hemos programado una llamada contigo para mapear y optimizar tus procesos empresariales utilizando nuestra tecnología de IA avanzada.</p>

    <div class="call-details">
        <h3>📅 Fecha y Hora de la Llamada</h3>
        <div class="date">${formattedDate}</div>
    </div>

    <h3>¿Cómo conectarte?</h3>
    <p>Para unirte a la llamada, simplemente haz clic en el botón de abajo a la hora programada. Nuestro asistente de IA te guiará a través del proceso de mapeo.</p>
    
    <div class="alert">
        <strong>Importante:</strong> Asegúrate de tener una conexión estable a internet y un micrófono funcionando. La llamada durará aproximadamente 30-45 minutos.
    </div>

    <div class="connect-button">
        <a href="${botConnectionUrl}" target="_blank">📞 Conectar con el Bot de IA</a>
        <p style="font-size: 12px; color: #666; margin-top: 10px;">Disponible 10 minutos antes de la hora programada</p>
    </div>

    <div class="expectations">
        <h3>¿Qué esperar en la llamada?</h3>
        <ul>
            <li>El asistente de IA te hará preguntas sobre tus procesos actuales</li>
            <li>Describirás paso a paso cómo realizas ciertas tareas</li>
            <li>El sistema generará un diagrama de flujo automáticamente</li>
            <li>Recibirás sugerencias de mejora personalizadas</li>
            <li>Todo quedará documentado para futuras referencias</li>
        </ul>
    </div>

    <div class="footer">
        <p>¿Necesitas reprogramar o tienes preguntas?<br/>
        Contacta a <strong>${adminName}</strong> en ${companyName}</p>
        <p style="font-size: 12px; margin-top: 15px;">Este email fue generado automáticamente por el sistema CEA Dashboard</p>
    </div>
</body>
</html>
  `;
}


