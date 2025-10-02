"use client";

import {
  Title,
  Text,
  Button,
  Stack,
  Flex,
  Center,
  Group,
  Card,
} from "@mantine/core";
import { IconPlus, IconUpload, IconFolderOpen, IconExternalLink } from "@tabler/icons-react";

export default function ProcesosPage() {
  return (
    <Stack gap="xl">
      {/* Header */}
      <Flex justify="space-between" align={{ base: "flex-start", sm: "center" }} direction={{ base: "column", sm: "row" }} gap="md">
        <div>
          <Title order={1}>Procesos</Title>
          <Text c="dimmed">Gestiona y optimiza tus procesos empresariales</Text>
        </div>
        <Group>
          <Button
            leftSection={<IconFolderOpen size={16} />}
            onClick={() => window.open('https://crimson-snowboard-382.notion.site/Procesos-23e31d8762438016a65ae59b43137c07', '_blank')}
            variant="filled"
            color="blue"
            size="md"
          >
            Ver Procesos Guardados
          </Button>
          <Button
            leftSection={<IconUpload size={16} />}
            onClick={() => window.open('https://tools.fitcluv.com/form/19083649-234c-4815-9903-7864a61f6884', '_blank')}
            variant="light"
            size="md"
          >
            Importar Transcripción
          </Button>
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={() => window.open('https://tools.fitcluv.com/form/aa6a028e-8e5b-463e-bc2b-6d6d760927f5', '_blank')}
            size="md"
            hiddenFrom="sm"
            fullWidth
          >
            Nuevo Proceso
          </Button>
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={() => window.open('https://tools.fitcluv.com/form/aa6a028e-8e5b-463e-bc2b-6d6d760927f5', '_blank')}
            size="md"
            visibleFrom="sm"
          >
            Nuevo Proceso
          </Button>
        </Group>
      </Flex>

      {/* Main Content Card */}
      <Center style={{ minHeight: '60vh' }}>
        <Card shadow="md" padding="xl" radius="md" withBorder maw={600}>
          <Stack align="center" gap="xl">
            <IconFolderOpen size={80} stroke={1.5} color="#228BE6" />
            
            <Stack align="center" gap="sm">
              <Title order={2} ta="center">Accede a tus Procesos</Title>
              <Text c="dimmed" ta="center" size="lg">
                Todos tus procesos están organizados y guardados en Notion
              </Text>
            </Stack>

            <Button
              size="lg"
              leftSection={<IconExternalLink size={20} />}
              onClick={() => window.open('https://crimson-snowboard-382.notion.site/Procesos-23e31d8762438016a65ae59b43137c07', '_blank')}
              fullWidth
            >
              Abrir Procesos en Notion
            </Button>

            <Stack gap="xs" w="100%">
              <Text size="sm" fw={500} c="dimmed">¿Necesitas crear o importar un proceso?</Text>
              <Group grow>
                <Button
                  variant="light"
                  leftSection={<IconPlus size={16} />}
                  onClick={() => window.open('https://tools.fitcluv.com/form/aa6a028e-8e5b-463e-bc2b-6d6d760927f5', '_blank')}
                >
                  Nuevo Proceso
                </Button>
                <Button
                  variant="light"
                  leftSection={<IconUpload size={16} />}
                  onClick={() => window.open('https://tools.fitcluv.com/form/19083649-234c-4815-9903-7864a61f6884', '_blank')}
                >
                  Importar
                </Button>
              </Group>
            </Stack>
          </Stack>
        </Card>
      </Center>
    </Stack>
  );
}
