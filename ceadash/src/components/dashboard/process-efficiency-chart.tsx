import { Card, Stack, Group, Title, Text, ThemeIcon, Progress, Flex } from "@mantine/core";
import { IconChartBar } from "@tabler/icons-react";

interface ProcessData {
  name: string;
  percentage: number;
  color: string;
}

interface ProcessEfficiencyChartProps {
  processes?: ProcessData[];
}

export function ProcessEfficiencyChart({ 
  processes = [
    { name: "Incorporación de Clientes", percentage: 85, color: "blue" },
    { name: "Proceso de Ventas", percentage: 72, color: "green" },
    { name: "Flujo de Soporte", percentage: 91, color: "purple" },
  ]
}: ProcessEfficiencyChartProps) {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Stack gap="md">
        <Group justify="space-between">
          <Title order={3}>Eficiencia de Procesos</Title>
          <ThemeIcon variant="light" color="blue">
            <IconChartBar size={20} />
          </ThemeIcon>
        </Group>
        <Text c="dimmed" size="sm">
          Mejora general de eficiencia a lo largo del tiempo
        </Text>
        <Stack gap="xs">
          {processes.map((process, index) => (
            <div key={index}>
              <Flex justify="space-between">
                <Text size="sm">{process.name}</Text>
                <Text size="sm" fw={500}>{process.percentage}%</Text>
              </Flex>
              <Progress value={process.percentage} color={process.color} />
            </div>
          ))}
        </Stack>
      </Stack>
    </Card>
  );
}
