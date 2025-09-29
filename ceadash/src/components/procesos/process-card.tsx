import { Card, Stack, Group, Title, Text, Badge, Button, ActionIcon, Progress } from "@mantine/core";
import { IconEye, IconEdit, IconDownload, IconShare, IconChartBar } from "@tabler/icons-react";

interface ProcessCardProps {
  id: string;
  name: string;
  description: string;
  status: "completado" | "en_progreso" | "pendiente";
  efficiency: number;
  lastUpdated: string;
  transcriptionLength?: number;
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDownload?: (id: string) => void;
  onShare?: (id: string) => void;
  onViewDiagram?: (id: string) => void;
  onViewImprovements?: (id: string) => void;
}

export function ProcessCard({ 
  id,
  name, 
  description, 
  status, 
  efficiency, 
  lastUpdated,
  transcriptionLength = 0,
  onView,
  onEdit,
  onDownload,
  onShare,
  onViewDiagram,
  onViewImprovements,
}: ProcessCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completado": return "green";
      case "en_progreso": return "blue";
      case "pendiente": return "yellow";
      default: return "gray";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "completado": return "Completado";
      case "en_progreso": return "En Progreso";
      case "pendiente": return "Pendiente";
      default: return status;
    }
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Stack gap="md">
        <Group justify="space-between" align="flex-start">
          <div style={{ flex: 1 }}>
            <Title order={4} lineClamp={1}>{name}</Title>
            <Text size="sm" c="dimmed" lineClamp={2} mt="xs">
              {description}
            </Text>
          </div>
          <Badge color={getStatusColor(status)} variant="light">
            {getStatusLabel(status)}
          </Badge>
        </Group>

        <div>
          <Group justify="space-between" mb="xs">
            <Text size="sm" fw={500}>Eficiencia</Text>
            <Text size="sm" fw={500}>{efficiency}%</Text>
          </Group>
          <Progress value={efficiency} color={getStatusColor(status)} />
        </div>

        <Group justify="space-between" align="center">
          <div>
            <Text size="xs" c="dimmed">Actualizado: {lastUpdated}</Text>
            {transcriptionLength > 0 && (
              <Text size="xs" c="dimmed">{transcriptionLength} min de transcripción</Text>
            )}
          </div>
          
          <Group gap="xs">
            <ActionIcon variant="light" color="blue" size="sm" onClick={() => onView?.(id)}>
              <IconEye size={16} />
            </ActionIcon>
            <ActionIcon variant="light" color="green" size="sm" onClick={() => onEdit?.(id)}>
              <IconEdit size={16} />
            </ActionIcon>
            <ActionIcon variant="light" color="purple" size="sm" onClick={() => onDownload?.(id)}>
              <IconDownload size={16} />
            </ActionIcon>
            <ActionIcon variant="light" color="orange" size="sm" onClick={() => onShare?.(id)}>
              <IconShare size={16} />
            </ActionIcon>
          </Group>
        </Group>

        <Group>
          <Button 
            variant="light" 
            size="sm" 
            leftSection={<IconChartBar size={16} />} 
            flex={1}
            onClick={() => onViewDiagram?.(id)}
          >
            Ver Diagrama
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            flex={1}
            onClick={() => onViewImprovements?.(id)}
          >
            Ver Mejoras
          </Button>
        </Group>
      </Stack>
    </Card>
  );
}
