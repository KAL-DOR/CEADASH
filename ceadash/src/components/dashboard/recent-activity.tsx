import { Card, Stack, Group, Title, Text, ThemeIcon, Paper } from "@mantine/core";
import { IconClock } from "@tabler/icons-react";

interface ActivityItem {
  title: string;
  time: string;
  type: string;
}

interface RecentActivityProps {
  activities?: ActivityItem[];
}

export function RecentActivity({ 
  activities = [
    {
      title: "Nuevo proceso mapeado: Incorporación de Clientes",
      time: "hace 2 horas",
      type: "process",
    },
    {
      title: "Llamada programada con Juan Pérez",
      time: "hace 4 horas",
      type: "schedule",
    },
    {
      title: "Optimización de proceso completada",
      time: "hace 1 día",
      type: "optimization",
    },
    {
      title: "Nuevo usuario registrado: María González",
      time: "hace 2 días",
      type: "user",
    },
  ]
}: RecentActivityProps) {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Stack gap="md">
        <Group justify="space-between">
          <Title order={3}>Actividad Reciente</Title>
          <ThemeIcon variant="light" color="orange">
            <IconClock size={20} />
          </ThemeIcon>
        </Group>
        <Stack gap="md">
          {activities.map((activity, index) => (
            <Paper key={index} p="sm" radius="sm" bg="gray.0">
              <Stack gap="xs">
                <Text size="sm" fw={500}>
                  {activity.title}
                </Text>
                <Text size="xs" c="dimmed">
                  {activity.time}
                </Text>
              </Stack>
            </Paper>
          ))}
        </Stack>
      </Stack>
    </Card>
  );
}
