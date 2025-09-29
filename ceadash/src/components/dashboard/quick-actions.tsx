import { Card, Stack, Title, SimpleGrid, Button } from "@mantine/core";
import { IconBrain, IconCalendar, IconFileText } from "@tabler/icons-react";

interface QuickActionsProps {
  onMapProcess?: () => void;
  onScheduleCall?: () => void;
  onViewDocs?: () => void;
}

export function QuickActions({ onMapProcess, onScheduleCall, onViewDocs }: QuickActionsProps) {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Stack gap="md">
        <Title order={3}>Acciones Rápidas</Title>
        <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
          <Button
            leftSection={<IconBrain size={16} />}
            variant="light"
            color="blue"
            size="lg"
            fullWidth
            onClick={onMapProcess}
          >
            Mapear Nuevo Proceso
          </Button>
          <Button
            leftSection={<IconCalendar size={16} />}
            variant="light"
            color="green"
            size="lg"
            fullWidth
            onClick={onScheduleCall}
          >
            Programar Llamada
          </Button>
          <Button
            leftSection={<IconFileText size={16} />}
            variant="light"
            color="purple"
            size="lg"
            fullWidth
            onClick={onViewDocs}
          >
            Ver Documentación
          </Button>
        </SimpleGrid>
      </Stack>
    </Card>
  );
}
