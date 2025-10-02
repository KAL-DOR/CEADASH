"use client";

import { Card, Stack, Title, Text, List, Badge, Group, Progress, Alert, Button } from "@mantine/core";
import { IconBulb, IconTrendingUp, IconClock, IconCheck, IconAlertTriangle } from "@tabler/icons-react";

interface ProcessImprovementData {
  suggestions: string[];
  efficiency_gain?: number;
  time_saved?: string;
  cost_reduction?: string;
  priority?: 'high' | 'medium' | 'low';
  implementation_difficulty?: 'easy' | 'medium' | 'hard';
}

interface ProcessImprovementsProps {
  data: ProcessImprovementData;
  title?: string;
  onImplementSuggestion?: (suggestion: string, index: number) => void;
}

export function ProcessImprovements({ 
  data, 
  title = "Mejoras Sugeridas", 
  onImplementSuggestion 
}: ProcessImprovementsProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'red';
      case 'medium': return 'orange';
      case 'low': return 'green';
      default: return 'blue';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'green';
      case 'medium': return 'orange';
      case 'hard': return 'red';
      default: return 'blue';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'Fácil';
      case 'medium': return 'Medio';
      case 'hard': return 'Difícil';
      default: return 'No especificado';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high': return 'Alta';
      case 'medium': return 'Media';
      case 'low': return 'Baja';
      default: return 'No especificada';
    }
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Stack gap="md">
        <Group justify="space-between">
          <Group gap="xs">
            <IconBulb size={20} />
            <Title order={3}>{title}</Title>
          </Group>
          {data.priority && (
            <Badge color={getPriorityColor(data.priority)} variant="light">
              Prioridad {getPriorityLabel(data.priority)}
            </Badge>
          )}
        </Group>

        {/* Impact Metrics */}
        {(data.efficiency_gain || data.time_saved || data.cost_reduction) && (
          <Card bg="green.0" p="md" radius="md">
            <Title order={4} size="sm" mb="sm" c="green">
              Impacto Esperado
            </Title>
            <Stack gap="xs">
              {data.efficiency_gain && (
                <Group>
                  <IconTrendingUp size={16} color="var(--mantine-color-green-6)" />
                  <Text size="sm">
                    <strong>Ganancia de eficiencia:</strong> {data.efficiency_gain}%
                  </Text>
                </Group>
              )}
              {data.time_saved && (
                <Group>
                  <IconClock size={16} color="var(--mantine-color-green-6)" />
                  <Text size="sm">
                    <strong>Tiempo ahorrado:</strong> {data.time_saved}
                  </Text>
                </Group>
              )}
              {data.cost_reduction && (
                <Group>
                  <IconTrendingUp size={16} color="var(--mantine-color-green-6)" />
                  <Text size="sm">
                    <strong>Reducción de costos:</strong> {data.cost_reduction}
                  </Text>
                </Group>
              )}
            </Stack>
            
            {data.efficiency_gain && (
              <div style={{ marginTop: '12px' }}>
                <Text size="xs" c="dimmed" mb="xs">
                  Progreso de eficiencia esperado
                </Text>
                <Progress value={data.efficiency_gain} color="green" />
              </div>
            )}
          </Card>
        )}

        {/* Implementation Difficulty */}
        {data.implementation_difficulty && (
          <Alert 
            icon={<IconAlertTriangle size={16} />} 
            color={getDifficultyColor(data.implementation_difficulty)}
            variant="light"
          >
            <Text size="sm">
              <strong>Dificultad de implementación:</strong> {getDifficultyLabel(data.implementation_difficulty)}
            </Text>
          </Alert>
        )}

        {/* Suggestions List */}
        <div>
          <Title order={4} size="sm" mb="sm">
            Sugerencias de Mejora:
          </Title>
          <List
            spacing="sm"
            size="sm"
            icon={<IconCheck size={16} color="var(--mantine-color-blue-6)" />}
          >
            {data.suggestions.map((suggestion, index) => (
              <List.Item key={index}>
                <Group justify="space-between" align="flex-start">
                  <Text style={{ flex: 1 }}>{suggestion}</Text>
                  {onImplementSuggestion && (
                    <Button
                      size="xs"
                      variant="light"
                      onClick={() => onImplementSuggestion(suggestion, index)}
                    >
                      Implementar
                    </Button>
                  )}
                </Group>
              </List.Item>
            ))}
          </List>
        </div>

        {/* Action Buttons */}
        <Group justify="flex-end">
          <Button variant="light" size="sm">
            Exportar Reporte
          </Button>
          <Button size="sm">
            Aplicar Todas las Mejoras
          </Button>
        </Group>
      </Stack>
    </Card>
  );
}

// Sample data generator for testing
export function generateSampleImprovements(): ProcessImprovementData {
  return {
    suggestions: [
      "Automatizar la validación de información para reducir errores manuales",
      "Implementar un sistema de notificaciones automáticas para acelerar las respuestas",
      "Crear plantillas predefinidas para solicitudes comunes",
      "Establecer un sistema de priorización basado en criterios objetivos",
      "Integrar con sistemas externos para obtener datos automáticamente"
    ],
    efficiency_gain: 35,
    time_saved: "2.5 horas por proceso",
    cost_reduction: "€150 por proceso",
    priority: 'high',
    implementation_difficulty: 'medium'
  };
}

