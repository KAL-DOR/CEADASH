"use client";

import { useState } from "react";
import { Container, Title, Text, Stack, Button, Group, Card } from "@mantine/core";
import { IconArrowLeft, IconMail } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { EmailTemplate } from "@/components/programacion/email-template";

export default function EmailPreviewPage() {
  const router = useRouter();
  const [sampleData] = useState({
    contactName: "Juan Pérez",
    scheduledDate: new Date(2024, 9, 15, 10, 30), // Oct 15, 10:30 AM
    adminName: "Equipo CEA",
    companyName: "CEA Dashboard",
    botConnectionUrl: "https://elevenlabs.io/connect/cea-bot?call=sample123",
  });

  return (
    <Container size="md" py="xl">
      <Stack gap="xl">
        {/* Header */}
        <Group>
          <Button
            variant="light"
            leftSection={<IconArrowLeft size={16} />}
            onClick={() => router.back()}
          >
            Volver
          </Button>
          <div>
            <Title order={1}>Vista Previa del Email</Title>
            <Text c="dimmed">Así es como se ve el email que reciben los contactos</Text>
          </div>
        </Group>

        {/* Info Card */}
        <Card shadow="sm" padding="lg" radius="md" withBorder bg="blue.0">
          <Group>
            <IconMail size={24} color="var(--mantine-color-blue-6)" />
            <div>
              <Text fw={600} c="blue">Email de Invitación a Llamada</Text>
              <Text size="sm" c="dimmed">
                Este email se envía automáticamente cuando programas una llamada
              </Text>
            </div>
          </Group>
        </Card>

        {/* Email Preview */}
        <EmailTemplate {...sampleData} />

        {/* Footer Info */}
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Stack gap="sm">
            <Title order={4}>Características del Email:</Title>
            <Text size="sm" c="dimmed">
              • <strong>Responsive:</strong> Se adapta a dispositivos móviles y desktop<br/>
              • <strong>Profesional:</strong> Diseño limpio y moderno<br/>
              • <strong>Informativo:</strong> Incluye toda la información necesaria<br/>
              • <strong>Interactivo:</strong> Botón directo para conectar con el bot<br/>
              • <strong>Personalizado:</strong> Usa el nombre del contacto y detalles específicos
            </Text>
          </Stack>
        </Card>
      </Stack>
    </Container>
  );
}


