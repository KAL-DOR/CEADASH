import { Card, Stack, Group, Title, Text, Badge, Button, ActionIcon, Progress, Menu } from "@mantine/core";
import { IconEye, IconEdit, IconDownload, IconShare, IconChartBar, IconDotsVertical, IconTrash, IconArchive, IconCheck } from "@tabler/icons-react";

interface ProcessCardProps {
  id: string;
  name: string;
  description: string;
  status: "draft" | "active" | "archived";
  efficiency: number;
  lastUpdated: string;
  transcriptionLength?: number;
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDownload?: (id: string) => void;
  onShare?: (id: string) => void;
  onViewDiagram?: (id: string) => void;
  onViewImprovements?: (id: string) => void;
  onDelete?: () => void;
  onUpdateStatus?: (status: string) => void;
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
  onDelete,
  onUpdateStatus,
}: ProcessCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "green";
      case "draft": return "blue";
      case "archived": return "gray";
      default: return "gray";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active": return "Activo";
      case "draft": return "Borrador";
      case "archived": return "Archivado";
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
          
          <Menu shadow="md" width={200}>
            <Menu.Target>
              <ActionIcon variant="light" color="gray">
                <IconDotsVertical size={16} />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Label>Acciones</Menu.Label>
              <Menu.Item leftSection={<IconEye size={14} />} onClick={() => onView?.(id)}>
                Ver detalles
              </Menu.Item>
              <Menu.Item leftSection={<IconEdit size={14} />} onClick={() => onEdit?.(id)}>
                Editar
              </Menu.Item>
              <Menu.Item leftSection={<IconChartBar size={14} />} onClick={() => onViewDiagram?.(id)}>
                Ver diagrama
              </Menu.Item>
              <Menu.Item leftSection={<IconDownload size={14} />} onClick={() => onDownload?.(id)}>
                Descargar
              </Menu.Item>
              <Menu.Item leftSection={<IconShare size={14} />} onClick={() => onShare?.(id)}>
                Compartir
              </Menu.Item>
              
              <Menu.Divider />
              <Menu.Label>Cambiar Estado</Menu.Label>
              {status !== "active" && (
                <Menu.Item 
                  leftSection={<IconCheck size={14} />} 
                  onClick={() => onUpdateStatus?.("active")}
                  color="green"
                >
                  Marcar como activo
                </Menu.Item>
              )}
              {status !== "draft" && (
                <Menu.Item 
                  leftSection={<IconEdit size={14} />} 
                  onClick={() => onUpdateStatus?.("draft")}
                  color="blue"
                >
                  Marcar como borrador
                </Menu.Item>
              )}
              {status !== "archived" && (
                <Menu.Item 
                  leftSection={<IconArchive size={14} />} 
                  onClick={() => onUpdateStatus?.("archived")}
                  color="gray"
                >
                  Archivar
                </Menu.Item>
              )}
              
              <Menu.Divider />
              <Menu.Item 
                leftSection={<IconTrash size={14} />} 
                color="red"
                onClick={onDelete}
              >
                Eliminar
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
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
