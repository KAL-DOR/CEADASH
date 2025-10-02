"use client";

import { Card, Stack, Title, Text, Group, Badge, Button, SimpleGrid } from "@mantine/core";
import { IconGitBranch, IconArrowRight, IconCircle, IconSquare, IconDiamond } from "@tabler/icons-react";

interface DiagramNode {
  id: string;
  label: string;
  type: 'start' | 'process' | 'decision' | 'end';
  x?: number;
  y?: number;
}

interface DiagramEdge {
  from: string;
  to: string;
  label?: string;
}

interface ProcessDiagramData {
  nodes: DiagramNode[];
  edges: DiagramEdge[];
}

interface ProcessDiagramProps {
  data: ProcessDiagramData;
  title?: string;
  onNodeClick?: (node: DiagramNode) => void;
}

export function ProcessDiagram({ data, title = "Diagrama de Proceso", onNodeClick }: ProcessDiagramProps) {
  const getNodeIcon = (type: DiagramNode['type']) => {
    switch (type) {
      case 'start':
        return <IconCircle size={16} />;
      case 'process':
        return <IconSquare size={16} />;
      case 'decision':
        return <IconDiamond size={16} />;
      case 'end':
        return <IconCircle size={16} />;
      default:
        return <IconSquare size={16} />;
    }
  };

  const getNodeColor = (type: DiagramNode['type']) => {
    switch (type) {
      case 'start':
        return 'green';
      case 'process':
        return 'blue';
      case 'decision':
        return 'orange';
      case 'end':
        return 'red';
      default:
        return 'gray';
    }
  };

  // Helper function to get node label (kept for future use)
  // const getNodeLabel = (type: DiagramNode['type']) => {
  //   switch (type) {
  //     case 'start':
  //       return 'Inicio';
  //     case 'process':
  //       return 'Proceso';
  //     case 'decision':
  //       return 'Decisión';
  //     case 'end':
  //       return 'Fin';
  //     default:
  //       return 'Nodo';
  //   }
  // };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Stack gap="md">
        <Group justify="space-between">
          <Title order={3}>{title}</Title>
          <Badge leftSection={<IconGitBranch size={14} />} variant="light">
            {data.nodes.length} nodos
          </Badge>
        </Group>

        {/* Simple visual representation */}
        <Card bg="gray.0" p="md" radius="md">
          <Stack gap="lg" align="center">
            {data.nodes.map((node, index) => (
              <div key={node.id}>
                <Group justify="center">
                  <Button
                    variant="light"
                    color={getNodeColor(node.type)}
                    leftSection={getNodeIcon(node.type)}
                    onClick={() => onNodeClick?.(node)}
                    size="sm"
                  >
                    {node.label}
                  </Button>
                </Group>
                
                {/* Show arrow to next node if not the last one */}
                {index < data.nodes.length - 1 && (
                  <Group justify="center" mt="xs">
                    <IconArrowRight size={20} color="var(--mantine-color-gray-6)" />
                  </Group>
                )}
              </div>
            ))}
          </Stack>
        </Card>

        {/* Node types legend */}
        <Card bg="blue.0" p="sm" radius="md">
          <Text size="sm" fw={500} mb="xs">Tipos de Nodos:</Text>
          <SimpleGrid cols={2} spacing="xs">
            <Group gap="xs">
              <IconCircle size={14} color="var(--mantine-color-green-6)" />
              <Text size="xs">Inicio</Text>
            </Group>
            <Group gap="xs">
              <IconSquare size={14} color="var(--mantine-color-blue-6)" />
              <Text size="xs">Proceso</Text>
            </Group>
            <Group gap="xs">
              <IconDiamond size={14} color="var(--mantine-color-orange-6)" />
              <Text size="xs">Decisión</Text>
            </Group>
            <Group gap="xs">
              <IconCircle size={14} color="var(--mantine-color-red-6)" />
              <Text size="xs">Fin</Text>
            </Group>
          </SimpleGrid>
        </Card>

        {/* Process flow summary */}
        <div>
          <Text size="sm" fw={500} mb="xs">Flujo del Proceso:</Text>
          <Text size="sm" c="dimmed">
            {data.nodes.map((node, index) => (
              <span key={node.id}>
                {node.label}
                {index < data.nodes.length - 1 && ' → '}
              </span>
            ))}
          </Text>
        </div>
      </Stack>
    </Card>
  );
}

// Sample data generator for testing
export function generateSampleDiagram(): ProcessDiagramData {
  return {
    nodes: [
      { id: '1', label: 'Recibir Solicitud', type: 'start' },
      { id: '2', label: 'Validar Información', type: 'process' },
      { id: '3', label: '¿Información Completa?', type: 'decision' },
      { id: '4', label: 'Solicitar Datos Faltantes', type: 'process' },
      { id: '5', label: 'Procesar Solicitud', type: 'process' },
      { id: '6', label: 'Enviar Respuesta', type: 'end' }
    ],
    edges: [
      { from: '1', to: '2' },
      { from: '2', to: '3' },
      { from: '3', to: '4', label: 'No' },
      { from: '4', to: '2' },
      { from: '3', to: '5', label: 'Sí' },
      { from: '5', to: '6' }
    ]
  };
}

