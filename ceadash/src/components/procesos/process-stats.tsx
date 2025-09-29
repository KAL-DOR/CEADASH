import { SimpleGrid, Card, Stack, Text } from "@mantine/core";

interface ProcessStatsProps {
  totalProcesses: number;
  completedProcesses: number;
  inProgressProcesses: number;
  averageEfficiency: number;
}

export function ProcessStats({
  totalProcesses,
  completedProcesses,
  inProgressProcesses,
  averageEfficiency,
}: ProcessStatsProps) {
  return (
    <SimpleGrid cols={{ base: 1, sm: 4 }} spacing="lg">
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Stack gap="xs">
          <Text size="sm" c="dimmed">Total Procesos</Text>
          <Text size="xl" fw={700}>{totalProcesses}</Text>
        </Stack>
      </Card>
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Stack gap="xs">
          <Text size="sm" c="dimmed">Completados</Text>
          <Text size="xl" fw={700} c="green">{completedProcesses}</Text>
        </Stack>
      </Card>
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Stack gap="xs">
          <Text size="sm" c="dimmed">En Progreso</Text>
          <Text size="xl" fw={700} c="blue">{inProgressProcesses}</Text>
        </Stack>
      </Card>
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Stack gap="xs">
          <Text size="sm" c="dimmed">Eficiencia Promedio</Text>
          <Text size="xl" fw={700} c="orange">{averageEfficiency}%</Text>
        </Stack>
      </Card>
    </SimpleGrid>
  );
}
