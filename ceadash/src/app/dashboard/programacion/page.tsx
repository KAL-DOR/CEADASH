"use client";

import { useState } from "react";
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
} from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { sendSchedulingEmail, validateEmail, EMAIL_CONFIG } from "@/lib/email-service";

interface ScheduledCall {
  id: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  scheduledDate: Date;
  status: "programada" | "completada" | "cancelada";
  notes: string;
  emailSent?: boolean;
  emailId?: string;
  botConnectionUrl?: string;
  agentId?: string;
  processType?: string;
  industry?: string;
}

export default function ProgramacionPage() {
  const [opened, setOpened] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isScheduling, setIsScheduling] = useState(false);
  const [calls, setCalls] = useState<ScheduledCall[]>([
    {
      id: "1",
      contactName: "María García",
      contactEmail: "maria@empresa.com",
      contactPhone: "+34 123 456 789",
      scheduledDate: new Date("2024-10-15T10:00:00"),
      status: "programada",
      notes: "Mapeo de proceso de ventas",
      emailSent: true,
      emailId: "email_123",
      botConnectionUrl: "https://elevenlabs.io/convai/conversation?agent_id=agent_123",
      agentId: "agent_123",
      processType: "ventas",
      industry: "tecnologia",
    },
    {
      id: "2",
      contactName: "Carlos López",
      contactEmail: "carlos@startup.com",
      contactPhone: "+34 987 654 321",
      scheduledDate: new Date("2024-10-16T14:30:00"),
      status: "completada",
      notes: "Optimización de flujo de trabajo",
      emailSent: true,
      emailId: "email_124",
      botConnectionUrl: "https://elevenlabs.io/convai/conversation?agent_id=agent_124",
      agentId: "agent_124",
      processType: "onboarding",
      industry: "servicios",
    },
  ]);

  const [newCall, setNewCall] = useState({
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    scheduledDate: new Date(),
    notes: "",
    processType: "",
    industry: "",
    objectives: [] as string[],
    duration: 30,
    specificQuestions: [] as string[],
    company: "",
  });

  const handleScheduleCall = async () => {
    // Validar email
    if (!validateEmail(newCall.contactEmail)) {
      notifications.show({
        title: "Email inválido",
        message: "Por favor, ingresa un email válido",
        color: "red",
      });
      return;
    }

    // Validar campos requeridos para configuración del agente
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
      const callId = Date.now().toString();
      
      // Configurar agente dinámicamente
      const callData = {
        contactName: newCall.contactName,
        contactEmail: newCall.contactEmail,
        contactCompany: newCall.company,
        processType: newCall.processType,
        objectives: newCall.objectives,
        duration: newCall.duration,
        language: "es",
        industry: newCall.industry,
        specificQuestions: newCall.specificQuestions,
      };

      // Crear configuración del agente
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

      // Use the agent link from the API response
      const botConnectionUrl = agentResult.agentLink || `https://elevenlabs.io/convai/conversation?agent_id=${agentResult.agentId}`;

      // Crear la llamada
      const call: ScheduledCall = {
        id: callId,
        contactName: newCall.contactName,
        contactEmail: newCall.contactEmail,
        contactPhone: newCall.contactPhone,
        scheduledDate: newCall.scheduledDate,
        status: "programada",
        notes: newCall.notes,
        emailSent: false,
        botConnectionUrl,
        agentId: agentResult.agentId,
        processType: newCall.processType,
        industry: newCall.industry,
      };

      // Enviar email con el link del agente
      const emailResult = await sendSchedulingEmail({
        to: newCall.contactEmail,
        contactName: newCall.contactName,
        scheduledDate: newCall.scheduledDate,
        adminName: EMAIL_CONFIG.defaultAdminName,
        companyName: EMAIL_CONFIG.defaultCompanyName,
        botConnectionUrl,
        processType: newCall.processType,
        duration: newCall.duration,
      });

      if (emailResult.success) {
        call.emailSent = true;
        call.emailId = emailResult.emailId;
        
        notifications.show({
          title: "¡Llamada programada exitosamente!",
          message: `Email enviado a ${newCall.contactName}. Agente configurado para proceso: ${newCall.processType}`,
          color: "green",
        });
      } else {
        notifications.show({
          title: "Llamada programada",
          message: `Llamada creada con agente configurado, pero hubo un error enviando el email: ${emailResult.message}`,
          color: "yellow",
        });
      }

      setCalls([...calls, call]);
      setNewCall({
        contactName: "",
        contactEmail: "",
        contactPhone: "",
        scheduledDate: new Date(),
        notes: "",
        processType: "",
        industry: "",
        objectives: [],
        duration: 30,
        specificQuestions: [],
        company: "",
      });
      setOpened(false);
    } catch (error) {
      console.error("Error scheduling call:", error);
      notifications.show({
        title: "Error",
        message: "Hubo un error programando la llamada o configurando el agente",
        color: "red",
      });
    } finally {
      setIsScheduling(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "programada": return "blue";
      case "completada": return "green";
      case "cancelada": return "red";
      default: return "gray";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "programada": return "Programada";
      case "completada": return "Completada";
      case "cancelada": return "Cancelada";
      default: return status;
    }
  };

  const filteredCalls = calls.filter(call =>
    call.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    call.contactEmail.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalCalls = calls.length;
  const completedCalls = calls.filter(call => call.status === "completada").length;

  return (
    <Stack gap="xl">
      {/* Header */}
      <Flex justify="space-between" align={{ base: "flex-start", sm: "center" }} direction={{ base: "column", sm: "row" }} gap="md">
        <div>
          <Title order={1}>Programación de Llamadas</Title>
          <Text c="dimmed">Gestiona y programa llamadas con ElevenLabs para mapear procesos</Text>
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
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing={{ base: "md", md: "lg" }}>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Stack gap="xs">
            <Text size="sm" c="dimmed">Total Llamadas</Text>
            <Text size="xl" fw={700}>{totalCalls}</Text>
          </Stack>
        </Card>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Stack gap="xs">
            <Text size="sm" c="dimmed">Completadas</Text>
            <Text size="xl" fw={700}>{completedCalls}</Text>
          </Stack>
        </Card>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Stack gap="xs">
            <Text size="sm" c="dimmed">Programadas</Text>
            <Text size="xl" fw={700}>{calls.filter(c => c.status === "programada").length}</Text>
          </Stack>
        </Card>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Stack gap="xs">
            <Text size="sm" c="dimmed">Tasa de Éxito</Text>
            <Text size="xl" fw={700}>{totalCalls > 0 ? Math.round((completedCalls / totalCalls) * 100) : 0}%</Text>
          </Stack>
        </Card>
      </SimpleGrid>

      {/* Search */}
      <TextInput
        placeholder="Buscar por nombre o email..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        leftSection={<IconUser size={16} />}
      />

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
                <Table.Th>Email</Table.Th>
                <Table.Th>Proceso</Table.Th>
                <Table.Th>Agente</Table.Th>
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
                    <Group gap="xs">
                      {call.emailSent ? (
                        <Badge color="green" variant="light" leftSection={<IconCheck size={12} />}>
                          Enviado
                        </Badge>
                      ) : (
                        <Badge color="red" variant="light" leftSection={<IconAlertCircle size={12} />}>
                          Falló
                        </Badge>
                      )}
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    <div>
                      <Text size="sm" fw={500}>{call.processType || "N/A"}</Text>
                      <Text size="xs" c="dimmed">{call.industry || "N/A"}</Text>
                    </div>
                  </Table.Td>
                  <Table.Td>
                    <Text size="xs" c="dimmed" style={{ fontFamily: 'monospace' }}>
                      {call.agentId ? call.agentId.substring(0, 8) + '...' : 'N/A'}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      {call.botConnectionUrl && (
                        <Button
                          size="xs"
                          variant="light"
                          leftSection={<IconPhone size={12} />}
                          onClick={() => window.open(call.botConnectionUrl, '_blank')}
                        >
                          Conectar
                        </Button>
                      )}
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
        size="lg"
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
          <TextInput
            label="Empresa"
            placeholder="Nombre de la empresa"
            value={newCall.company}
            onChange={(e) => setNewCall({ ...newCall, company: e.target.value })}
          />
          
          <Select
            label="Tipo de Proceso"
            placeholder="Selecciona el tipo de proceso a mapear"
            value={newCall.processType}
            onChange={(value) => setNewCall({ ...newCall, processType: value || "" })}
            data={[
              { value: "onboarding", label: "Incorporación de empleados" },
              { value: "ventas", label: "Proceso de ventas" },
              { value: "soporte", label: "Atención al cliente" },
              { value: "manufactura", label: "Proceso de manufactura" },
              { value: "compras", label: "Proceso de compras" },
              { value: "rrhh", label: "Recursos humanos" },
              { value: "finanzas", label: "Procesos financieros" },
              { value: "marketing", label: "Marketing y publicidad" },
              { value: "logistica", label: "Logística y distribución" },
              { value: "otro", label: "Otro proceso" },
            ]}
            required
          />
          
          <Select
            label="Industria"
            placeholder="Selecciona la industria"
            value={newCall.industry}
            onChange={(value) => setNewCall({ ...newCall, industry: value || "" })}
            data={[
              { value: "tecnologia", label: "Tecnología" },
              { value: "manufactura", label: "Manufactura" },
              { value: "servicios", label: "Servicios" },
              { value: "retail", label: "Retail/Comercio" },
              { value: "salud", label: "Salud" },
              { value: "educacion", label: "Educación" },
              { value: "finanzas", label: "Finanzas" },
              { value: "construccion", label: "Construcción" },
              { value: "alimentaria", label: "Industria alimentaria" },
              { value: "otro", label: "Otra industria" },
            ]}
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
          
          <Textarea
            label="Notas adicionales"
            placeholder="Objetivo específico de la llamada, contexto adicional..."
            value={newCall.notes}
            onChange={(e) => setNewCall({ ...newCall, notes: e.target.value })}
            rows={3}
          />
          
          <Alert color="blue" variant="light">
            <Text size="sm">
              <strong>🤖 Configuración automática:</strong> El agente de IA se configurará automáticamente 
              basado en el tipo de proceso e industria seleccionados.
            </Text>
          </Alert>
          
          <Alert color="green" variant="light">
            <Text size="sm">
              <strong>📧 Email automático:</strong> Se enviará un email al contacto con las instrucciones 
              para conectarse con el bot de ElevenLabs configurado específicamente para su proceso.
            </Text>
          </Alert>
          
          <Group justify="flex-end">
            <Button 
              variant="light" 
              onClick={() => setOpened(false)}
              disabled={isScheduling}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleScheduleCall}
              loading={isScheduling}
              leftSection={isScheduling ? <Loader size={16} /> : <IconCalendar size={16} />}
            >
              {isScheduling ? "Configurando agente..." : "Programar Llamada"}
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
}