'use client';

import { useParams } from 'next/navigation';
import { Container, Title, Text, Paper, Stack, Button, Group } from '@mantine/core';
import { IconPhone, IconExternalLink } from '@tabler/icons-react';

export default function AgentPage() {
  const params = useParams();
  const agentId = params.agentId as string;

  // ElevenLabs provides embed options - for now, we'll link to their platform
  const agentUrl = `https://elevenlabs.io/app/conversational-ai/${agentId}`;

  return (
    <Container size="md" py="xl">
      <Stack gap="xl">
        <Paper shadow="sm" p="xl" radius="md" withBorder>
          <Stack gap="md">
            <Group>
              <IconPhone size={32} />
              <Title order={2}>Tu Llamada está Lista</Title>
            </Group>

            <Text c="dimmed">
              Hemos configurado un agente de IA especializado para tu llamada de mapeo de procesos.
              El agente está entrenado específicamente para tu tipo de proceso e industria.
            </Text>

            <Paper bg="blue.0" p="md" radius="md">
              <Stack gap="xs">
                <Text fw={600}>Instrucciones:</Text>
                <Text size="sm">
                  1. Haz clic en el botón de abajo para abrir la interfaz del agente
                </Text>
                <Text size="sm">
                  2. Permite el acceso al micrófono cuando te lo solicite
                </Text>
                <Text size="sm">
                  3. El agente te saludará y guiará la conversación
                </Text>
                <Text size="sm">
                  4. Responde las preguntas sobre tu proceso con detalle
                </Text>
              </Stack>
            </Paper>

            <Button
              component="a"
              href={agentUrl}
              target="_blank"
              rel="noopener noreferrer"
              size="lg"
              leftSection={<IconExternalLink size={20} />}
              fullWidth
            >
              Iniciar Llamada con el Agente
            </Button>

            <Text size="sm" c="dimmed" ta="center">
              Agent ID: {agentId}
            </Text>
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
}

