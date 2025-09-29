"use client";

import { useState } from "react";
import {
  Title,
  Text,
  Button,
  Stack,
  Card,
  SimpleGrid,
  TextInput,
  Select,
  Group,
  Badge,
  ActionIcon,
  Modal,
  Table,
  Avatar,
  Flex,
  Textarea,
} from "@mantine/core";
import {
  IconPlus,
  IconCalendar,
  IconClock,
  IconUser,
  IconEdit,
  IconTrash,
  IconSearch,
  IconPhone,
  IconMail,
} from "@tabler/icons-react";

interface ScheduledCall {
  id: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  scheduledDate: Date;
  status: "programada" | "completada" | "cancelada" | "en_progreso";
  notes?: string;
  duration?: number;
}

export default function ProgramacionPage() {
  const [opened, setOpened] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [calls, setCalls] = useState<ScheduledCall[]>([
    {
      id: "1",
      contactName: "Juan Pérez",
      contactEmail: "juan.perez@empresa.com",
      contactPhone: "+34 123 456 789",
      scheduledDate: new Date("2024-09-30T10:00:00"),
      status: "programada",
      notes: "Llamada inicial para mapear proceso de ventas",
    },
    {
      id: "2",
      contactName: "María González",
      contactEmail: "maria.gonzalez@startup.com",
      contactPhone: "+34 987 654 321",
      scheduledDate: new Date("2024-09-29T15:30:00"),
      status: "completada",
      notes: "Proceso de incorporación de empleados",
      duration: 45,
    },
    {
      id: "3",
      contactName: "Carlos Rodríguez",
      contactEmail: "carlos@consultoria.es",
      contactPhone: "+34 555 123 456",
      scheduledDate: new Date("2024-10-01T09:00:00"),
      status: "programada",
      notes: "Optimización de flujo de trabajo",
    },
  ]);

  const [newCall, setNewCall] = useState({
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    scheduledDate: new Date(),
    notes: "",
  });

  const handleScheduleCall = () => {
    const call: ScheduledCall = {
      id: Date.now().toString(),
      contactName: newCall.contactName,
      contactEmail: newCall.contactEmail,
      contactPhone: newCall.contactPhone,
      scheduledDate: newCall.scheduledDate,
      status: "programada",
      notes: newCall.notes,
    };
    
    setCalls([...calls, call]);
    setNewCall({
      contactName: "",
      contactEmail: "",
      contactPhone: "",
      scheduledDate: new Date(),
      notes: "",
    });
    setOpened(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "programada": return "blue";
      case "completada": return "green";
      case "cancelada": return "red";
      case "en_progreso": return "yellow";
      default: return "gray";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "programada": return "Programada";
      case "completada": return "Completada";
      case "cancelada": return "Cancelada";
      case "en_progreso": return "En Progreso";
      default: return status;
    }
  };

  const filteredCalls = calls.filter(call =>
    call.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    call.contactEmail.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const upcomingCalls = calls.filter(call => 
    call.status === "programada" && call.scheduledDate > new Date()
  ).length;

  const completedCalls = calls.filter(call => call.status === "completada").length;

  return (
    <Stack gap="xl">
      {/* Header */}
      <Flex justify="space-between" align="center">
        <div>
          <Title order={1}>Programación de Llamadas</Title>
          <Text c="dimmed">Gestiona y programa llamadas con ElevenLabs para mapear procesos</Text>
        </div>
        <Button
          leftSection={<IconPlus size={16} />}
          onClick={() => setOpened(true)}
        >
          Programar Llamada
        </Button>
      </Flex>

      {/* Stats Cards */}
      <SimpleGrid cols={{ base: 1, sm: 4 }} spacing="lg">
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Stack gap="xs">
            <Text size="sm" c="dimmed">Total Llamadas</Text>
            <Text size="xl" fw={700}>{calls.length}</Text>
          </Stack>
        </Card>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Stack gap="xs">
            <Text size="sm" c="dimmed">Próximas</Text>
            <Text size="xl" fw={700} c="blue">{upcomingCalls}</Text>
          </Stack>
        </Card>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Stack gap="xs">
            <Text size="sm" c="dimmed">Completadas</Text>
            <Text size="xl" fw={700} c="green">{completedCalls}</Text>
          </Stack>
        </Card>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Stack gap="xs">
            <Text size="sm" c="dimmed">Tiempo Promedio</Text>
            <Text size="xl" fw={700} c="orange">38min</Text>
          </Stack>
        </Card>
      </SimpleGrid>

      {/* Search and Filters */}
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Group>
          <TextInput
            placeholder="Buscar llamadas..."
            leftSection={<IconSearch size={16} />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ flex: 1 }}
          />
          <Select
            placeholder="Estado"
            data={[
              { value: "todas", label: "Todas" },
              { value: "programada", label: "Programadas" },
              { value: "completada", label: "Completadas" },
              { value: "cancelada", label: "Canceladas" },
            ]}
            defaultValue="todas"
          />
          <Select
            placeholder="Fecha"
            data={[
              { value: "todas", label: "Todas las fechas" },
              { value: "hoy", label: "Hoy" },
              { value: "semana", label: "Esta semana" },
              { value: "mes", label: "Este mes" },
            ]}
            defaultValue="todas"
          />
        </Group>
      </Card>

      {/* Calls Table */}
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Stack gap="md">
          <Title order={3}>Llamadas Programadas</Title>
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Contacto</Table.Th>
                <Table.Th>Fecha y Hora</Table.Th>
                <Table.Th>Estado</Table.Th>
                <Table.Th>Duración</Table.Th>
                <Table.Th>Notas</Table.Th>
                <Table.Th>Acciones</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {filteredCalls.map((call) => (
                <Table.Tr key={call.id}>
                  <Table.Td>
                    <Group gap="sm">
                      <Avatar size="sm" color="blue">
                        {call.contactName.charAt(0)}
                      </Avatar>
                      <div>
                        <Text size="sm" fw={500}>{call.contactName}</Text>
                        <Text size="xs" c="dimmed">{call.contactEmail}</Text>
                      </div>
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    <div>
                      <Text size="sm" fw={500}>
                        {call.scheduledDate.toLocaleDateString('es-ES')}
                      </Text>
                      <Text size="xs" c="dimmed">
                        {call.scheduledDate.toLocaleTimeString('es-ES', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </Text>
                    </div>
                  </Table.Td>
                  <Table.Td>
                    <Badge color={getStatusColor(call.status)} variant="light">
                      {getStatusLabel(call.status)}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" c="dimmed">
                      {call.duration ? `${call.duration}min` : "-"}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" c="dimmed" lineClamp={1}>
                      {call.notes || "Sin notas"}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      <ActionIcon variant="light" color="blue">
                        <IconPhone size={16} />
                      </ActionIcon>
                      <ActionIcon variant="light" color="green">
                        <IconMail size={16} />
                      </ActionIcon>
                      <ActionIcon variant="light" color="gray">
                        <IconEdit size={16} />
                      </ActionIcon>
                      <ActionIcon variant="light" color="red">
                        <IconTrash size={16} />
                      </ActionIcon>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Stack>
      </Card>

      {/* Schedule Call Modal */}
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Programar Nueva Llamada"
        size="md"
      >
        <Stack gap="md">
          <TextInput
            label="Nombre del contacto"
            placeholder="Juan Pérez"
            value={newCall.contactName}
            onChange={(e) => setNewCall({ ...newCall, contactName: e.target.value })}
            required
          />
          <TextInput
            label="Email"
            placeholder="juan@empresa.com"
            value={newCall.contactEmail}
            onChange={(e) => setNewCall({ ...newCall, contactEmail: e.target.value })}
            required
          />
          <TextInput
            label="Teléfono"
            placeholder="+34 123 456 789"
            value={newCall.contactPhone}
            onChange={(e) => setNewCall({ ...newCall, contactPhone: e.target.value })}
            required
          />
          <TextInput
            label="Fecha y hora"
            placeholder="2024-09-30 10:00"
            value={newCall.scheduledDate.toISOString().slice(0, 16)}
            onChange={(e) => setNewCall({ 
              ...newCall, 
              scheduledDate: new Date(e.target.value) 
            })}
            type="datetime-local"
            required
          />
          <Textarea
            label="Notas"
            placeholder="Objetivo de la llamada, proceso a mapear, etc..."
            value={newCall.notes}
            onChange={(e) => setNewCall({ ...newCall, notes: e.target.value })}
            rows={3}
          />
          <Group justify="flex-end">
            <Button variant="light" onClick={() => setOpened(false)}>
              Cancelar
            </Button>
            <Button onClick={handleScheduleCall}>
              Programar Llamada
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
}
