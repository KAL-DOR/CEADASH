"use client";

import { useState, useEffect } from "react";
import {
  Title,
  Text,
  Button,
  Stack,
  Card,
  SimpleGrid,
  Table,
  Badge,
  Group,
  Avatar,
  Modal,
  TextInput,
  Textarea,
  Select,
  NumberInput,
  Alert,
  Flex,
  Loader,
  Center,
  MultiSelect,
} from "@mantine/core";
import {
  IconPlus,
  IconCalendar,
  IconCheck,
  IconAlertCircle,
  IconMail,
  IconPhone,
  IconClock,
  IconUser,
  IconExternalLink,
} from "@tabler/icons-react";
import { DateTimePicker } from "@mantine/dates";
import { notifications } from "@mantine/notifications";
import { useAuth } from "@/lib/auth/context";

interface ScheduledCall {
  id: string;
  contact_id: string;
  contact_name?: string;
  contact_email?: string;
  contact_phone?: string;
  scheduled_date: string;
  status: "scheduled" | "completed" | "cancelled" | "in_progress";
  duration_minutes?: number | null;
  notes: string | null;
  email_sent: boolean;
  email_id?: string | null;
  bot_connection_url?: string | null;
  agent_id?: string | null;
  created_at?: string;
}

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  status?: string;
}

export default function ProgramacionPage() {
  const { profile } = useAuth();
  const [opened, setOpened] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isScheduling, setIsScheduling] = useState(false);
  const [loading, setLoading] = useState(true);
  const [calls, setCalls] = useState<ScheduledCall[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);

  const [newCall, setNewCall] = useState({
    contactId: "",
    scheduledDate: new Date(),
    notes: "",
    processType: "",
    industry: "",
    objectives: [] as string[],
    duration: 30,
    specificQuestions: [] as string[],
  });

  // Load scheduled calls and contacts
  useEffect(() => {
    if (profile?.organization_id) {
      console.log('📊 Loading data for org:', profile.organization_id);
      loadScheduledCalls();
      loadContacts();
    } else {
      console.log('⏳ Waiting for profile...', { profile });
      setLoading(false); // Don't get stuck if profile isn't loaded
    }
  }, [profile?.organization_id]);

  const loadScheduledCalls = async () => {
    try {
      setLoading(true);
      
      const response = await fetch(`/api/scheduled-calls?organization_id=${profile?.organization_id}`);
      if (!response.ok) throw new Error('Failed to load scheduled calls');
      
      const data = await response.json();
      setCalls(data || []);
    } catch (error) {
      console.error('Error loading scheduled calls:', error);
      notifications.show({
        title: "Error",
        message: "No se pudieron cargar las llamadas programadas",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadContacts = async () => {
    try {
      const response = await fetch(`/api/contacts?organization_id=${profile?.organization_id}`);
      if (!response.ok) throw new Error('Failed to load contacts');
      
      const data = await response.json();
      // Filter active contacts and sort by name
      const activeContacts = (data || [])
        .filter((c: Contact) => c.status === 'active')
        .sort((a: Contact, b: Contact) => a.name.localeCompare(b.name));
      
      setContacts(activeContacts);
    } catch (error) {
      console.error('Error loading contacts:', error);
    }
  };

  const handleScheduleCall = async () => {
    if (!newCall.contactId) {
      notifications.show({
        title: "Campo requerido",
        message: "Por favor selecciona un contacto",
        color: "red",
      });
      return;
    }

    if (!newCall.processType || !newCall.industry) {
      notifications.show({
        title: "Campos requeridos",
        message: "Por favor, completa el tipo de proceso e industria",
        color: "red",
      });
      return;
    }

    setIsScheduling(true);

    try {
      // Get contact details
      const selectedContact = contacts.find(c => c.id === newCall.contactId);
      if (!selectedContact) {
        throw new Error('Contact not found');
      }

      // Prepare call data for agent configuration
      const callData = {
        contactName: selectedContact.name,
        contactEmail: selectedContact.email,
        contactCompany: "",
        processType: newCall.processType,
        objectives: newCall.objectives,
        duration: newCall.duration,
        language: "es",
        industry: newCall.industry,
        specificQuestions: newCall.specificQuestions,
      };

      // Create agent configuration
      const agentResponse = await fetch('/api/elevenlabs/configure-agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          callData,
          action: 'create',
        }),
      });

      const agentResult = await agentResponse.json();
      
      if (!agentResult.success) {
        throw new Error(agentResult.error || 'Failed to configure agent');
      }

      const botConnectionUrl = agentResult.agentLink || `https://elevenlabs.io/convai/conversation?agent_id=${agentResult.agentId}`;

      // Create scheduled call in database via API
      const scheduledCallData = {
        organization_id: profile?.organization_id,
        contact_id: newCall.contactId,
        scheduled_date: newCall.scheduledDate.toISOString(),
        status: 'scheduled',
        duration_minutes: newCall.duration,
        notes: newCall.notes || null,
        email_sent: false,
        bot_connection_url: botConnectionUrl,
        created_by: profile?.id,
      };

      const createCallResponse = await fetch('/api/scheduled-calls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(scheduledCallData),
      });

      if (!createCallResponse.ok) {
        const error = await createCallResponse.json();
        throw new Error(error.error || 'Failed to create scheduled call');
      }

      const ccEmails: string[] = [];

      // Send email to contact via Gmail (EmailJS)
      try {
        const emailResponse = await fetch('/api/send-email-gmail', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: selectedContact.email,
            scheduledCall: {
              id: 'new',
              contact_name: selectedContact.name,
              contact_email: selectedContact.email,
              scheduled_date: newCall.scheduledDate.toISOString(),
              notes: newCall.notes,
              bot_connection_url: botConnectionUrl,
            },
            additionalCCs: ccEmails,
          }),
        });

        const emailResult = await emailResponse.json();

        notifications.show({
          title: "¡Éxito!",
          message: `Llamada programada${emailResult.success ? ' y email enviado desde tu Gmail' : ''} a ${selectedContact.name}`,
          color: "green",
        });
      } catch (emailError) {
        console.error('Email error:', emailError);
        notifications.show({
          title: "Llamada programada",
          message: "La llamada fue programada pero hubo un problema al enviar el email",
          color: "yellow",
        });
      }

      // Reset form and reload
      setNewCall({
        contactId: "",
        scheduledDate: new Date(),
        notes: "",
        processType: "",
        industry: "",
        objectives: [],
        duration: 30,
        specificQuestions: [],
      });
      setOpened(false);
      loadScheduledCalls();
    } catch (error) {
      console.error('Error scheduling call:', error);
      notifications.show({
        title: "Error",
        message: "No se pudo programar la llamada",
        color: "red",
      });
    } finally {
      setIsScheduling(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "blue";
      case "in_progress":
        return "yellow";
      case "completed":
        return "green";
      case "cancelled":
        return "red";
      default:
        return "gray";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "scheduled":
        return "Programada";
      case "in_progress":
        return "En Progreso";
      case "completed":
        return "Completada";
      case "cancelled":
        return "Cancelada";
      default:
        return status;
    }
  };

  const filteredCalls = calls.filter(call =>
    call.contact_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    call.contact_email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    call.notes?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <Center style={{ minHeight: '50vh' }}>
        <Stack align="center" gap="md">
          <Loader size="lg" />
          <Text c="dimmed">Cargando llamadas programadas...</Text>
        </Stack>
      </Center>
    );
  }

  return (
    <Stack gap="xl">
      {/* Header */}
      <Flex justify="space-between" align={{ base: "flex-start", sm: "center" }} direction={{ base: "column", sm: "row" }} gap="md">
        <div>
          <Title order={1}>Programación</Title>
          <Text c="dimmed">Programa y gestiona llamadas con ElevenLabs</Text>
        </div>
        <Button
          leftSection={<IconPlus size={16} />}
          onClick={() => setOpened(true)}
          size="md"
          hiddenFrom="sm"
          fullWidth
        >
          Programar Llamada
        </Button>
        <Button
          leftSection={<IconPlus size={16} />}
          onClick={() => setOpened(true)}
          size="md"
          visibleFrom="sm"
        >
          Programar Llamada
        </Button>
      </Flex>

      {/* Stats Cards */}
      <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing={{ base: "md", md: "lg" }}>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Stack gap="xs">
            <Text size="sm" c="dimmed">Total Llamadas</Text>
            <Text size="xl" fw={700}>{calls.length}</Text>
          </Stack>
        </Card>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Stack gap="xs">
            <Text size="sm" c="dimmed">Programadas</Text>
            <Text size="xl" fw={700} c="blue">
              {calls.filter(c => c.status === "scheduled").length}
            </Text>
          </Stack>
        </Card>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Stack gap="xs">
            <Text size="sm" c="dimmed">En Progreso</Text>
            <Text size="xl" fw={700} c="yellow">
              {calls.filter(c => c.status === "in_progress").length}
            </Text>
          </Stack>
        </Card>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Stack gap="xs">
            <Text size="sm" c="dimmed">Completadas</Text>
            <Text size="xl" fw={700} c="green">
              {calls.filter(c => c.status === "completed").length}
            </Text>
          </Stack>
        </Card>
      </SimpleGrid>

      {/* Search */}
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <TextInput
          placeholder="Buscar llamadas..."
          leftSection={<IconCalendar size={16} />}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Card>

      {/* Calls Table */}
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Stack gap="md">
          <Title order={3}>Llamadas Programadas</Title>
          {filteredCalls.length === 0 ? (
            <Center py="xl">
              <Stack align="center" gap="sm">
                <IconCalendar size={48} stroke={1.5} color="gray" />
                <Text c="dimmed">No hay llamadas programadas</Text>
              </Stack>
            </Center>
          ) : (
            <Table>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Contacto</Table.Th>
                  <Table.Th>Fecha Programada</Table.Th>
                  <Table.Th>Duración</Table.Th>
                  <Table.Th>Estado</Table.Th>
                  <Table.Th>Email Enviado</Table.Th>
                  <Table.Th>Acciones</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {filteredCalls.map((call) => (
                  <Table.Tr key={call.id}>
                    <Table.Td>
                      <Group gap="sm">
                        <Avatar size="sm" color="blue">
                          {call.contact_name?.charAt(0) || "?"}
                        </Avatar>
                        <div>
                          <Text size="sm" fw={500}>{call.contact_name || "N/A"}</Text>
                          <Text size="xs" c="dimmed">{call.contact_email || "N/A"}</Text>
                        </div>
                      </Group>
                    </Table.Td>
                    <Table.Td>
                      <Group gap="xs">
                        <IconCalendar size={16} />
                        <Text size="sm">
                          {new Date(call.scheduled_date).toLocaleString('es-ES', {
                            dateStyle: 'short',
                            timeStyle: 'short',
                          })}
                        </Text>
                      </Group>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm">{call.duration_minutes || 30} min</Text>
                    </Table.Td>
                    <Table.Td>
                      <Badge color={getStatusColor(call.status)} variant="light">
                        {getStatusLabel(call.status)}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      {call.email_sent ? (
                        <Badge color="green" leftSection={<IconCheck size={12} />} variant="light">
                          Enviado
                        </Badge>
                      ) : (
                        <Badge color="gray" leftSection={<IconAlertCircle size={12} />} variant="light">
                          Pendiente
                        </Badge>
                      )}
                    </Table.Td>
                    <Table.Td>
                      {call.bot_connection_url && (
                        <Button
                          component="a"
                          href={call.bot_connection_url}
                          target="_blank"
                          size="xs"
                          variant="light"
                          rightSection={<IconExternalLink size={14} />}
                        >
                          Ver Agente
                        </Button>
                      )}
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          )}
        </Stack>
      </Card>

      {/* Schedule Call Modal */}
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Programar Nueva Llamada"
        size="lg"
      >
        <Stack gap="md">
          <Alert icon={<IconAlertCircle size={16} />} color="blue">
            El contacto recibirá un email con el enlace para conectarse con el agente de IA
          </Alert>

          <Select
            label="Contacto"
            placeholder="Selecciona un contacto"
            data={contacts.map(c => ({ value: c.id, label: `${c.name} (${c.email})` }))}
            value={newCall.contactId}
            onChange={(value) => setNewCall({ ...newCall, contactId: value || "" })}
            required
            searchable
          />

          <DateTimePicker
            label="Fecha y hora programada"
            placeholder="Selecciona fecha y hora"
            value={newCall.scheduledDate}
            onChange={(value) => {
              if (value) {
                let dateValue: Date;
                const valueAsUnknown = value as unknown;
                if (valueAsUnknown instanceof Date) {
                  dateValue = valueAsUnknown;
                } else {
                  dateValue = new Date(valueAsUnknown as string);
                }
                setNewCall({ ...newCall, scheduledDate: dateValue });
              }
            }}
            required
            minDate={new Date()}
          />

          <Select
            label="Tipo de Proceso"
            placeholder="Selecciona el tipo"
            data={[
              { value: "ventas", label: "Proceso de Ventas" },
              { value: "onboarding", label: "Onboarding de Clientes" },
              { value: "soporte", label: "Soporte Técnico" },
              { value: "produccion", label: "Producción" },
              { value: "logistica", label: "Logística" },
              { value: "otro", label: "Otro" },
            ]}
            value={newCall.processType}
            onChange={(value) => setNewCall({ ...newCall, processType: value || "" })}
            required
          />

          <Select
            label="Industria"
            placeholder="Selecciona la industria"
            data={[
              { value: "tecnologia", label: "Tecnología" },
              { value: "servicios", label: "Servicios" },
              { value: "manufactura", label: "Manufactura" },
              { value: "retail", label: "Retail" },
              { value: "salud", label: "Salud" },
              { value: "educacion", label: "Educación" },
              { value: "otro", label: "Otro" },
            ]}
            value={newCall.industry}
            onChange={(value) => setNewCall({ ...newCall, industry: value || "" })}
            required
          />

          <NumberInput
            label="Duración estimada (minutos)"
            placeholder="30"
            value={newCall.duration}
            onChange={(value) => setNewCall({ ...newCall, duration: Number(value) || 30 })}
            min={15}
            max={120}
            step={15}
          />

          <MultiSelect
            label="Objetivos de la llamada"
            placeholder="Selecciona o escribe objetivos"
            data={[
              { value: "mapear-proceso", label: "Mapear proceso actual" },
              { value: "identificar-cuellos", label: "Identificar cuellos de botella" },
              { value: "optimizar", label: "Optimizar eficiencia" },
              { value: "documentar", label: "Documentar procedimientos" },
            ]}
            value={newCall.objectives}
            onChange={(value) => setNewCall({ ...newCall, objectives: value })}
            searchable
          />

          <Textarea
            label="Notas adicionales"
            placeholder="Información adicional sobre la llamada..."
            value={newCall.notes}
            onChange={(e) => setNewCall({ ...newCall, notes: e.target.value })}
            rows={3}
          />

          <Group justify="flex-end">
            <Button variant="light" onClick={() => setOpened(false)} disabled={isScheduling}>
              Cancelar
            </Button>
            <Button onClick={handleScheduleCall} loading={isScheduling}>
              Programar Llamada
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
}
