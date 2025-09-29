"use client";

import { useState } from "react";
import {
  Title,
  Text,
  Button,
  Stack,
  SimpleGrid,
  Flex,
  Modal,
  TextInput,
  Textarea,
  Select,
  Group,
} from "@mantine/core";
import { IconPlus, IconUpload } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";

import { ProcessCard } from "@/components/procesos/process-card";
import { ProcessFilters } from "@/components/procesos/process-filters";
import { ProcessStats } from "@/components/procesos/process-stats";

interface Process {
  id: string;
  name: string;
  description: string;
  status: "completado" | "en_progreso" | "pendiente";
  efficiency: number;
  lastUpdated: string;
  transcriptionLength?: number;
}

export default function ProcesosPage() {
  const [opened, setOpened] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [sortBy, setSortBy] = useState("fecha");
  
  const [processes, setProcesses] = useState<Process[]>([
    {
      id: "1",
      name: "Incorporación de Nuevos Empleados",
      description: "Proceso completo desde la contratación hasta la integración del empleado en el equipo",
      status: "completado",
      efficiency: 85,
      lastUpdated: "hace 2 días",
      transcriptionLength: 45,
    },
    {
      id: "2",
      name: "Proceso de Ventas B2B",
      description: "Flujo de trabajo para la gestión de leads y cierre de ventas empresariales",
      status: "en_progreso",
      efficiency: 72,
      lastUpdated: "hace 1 día",
      transcriptionLength: 38,
    },
    {
      id: "3",
      name: "Atención al Cliente - Soporte Técnico",
      description: "Protocolo para la resolución de incidencias técnicas y seguimiento",
      status: "completado",
      efficiency: 91,
      lastUpdated: "hace 3 días",
      transcriptionLength: 52,
    },
    {
      id: "4",
      name: "Gestión de Inventario",
      description: "Control de stock, pedidos y distribución de productos",
      status: "pendiente",
      efficiency: 0,
      lastUpdated: "hace 1 semana",
    },
    {
      id: "5",
      name: "Proceso de Facturación",
      description: "Generación, envío y seguimiento de facturas a clientes",
      status: "en_progreso",
      efficiency: 68,
      lastUpdated: "hace 5 días",
      transcriptionLength: 29,
    },
    {
      id: "6",
      name: "Reclutamiento y Selección",
      description: "Proceso de búsqueda, evaluación y selección de candidatos",
      status: "completado",
      efficiency: 79,
      lastUpdated: "hace 1 semana",
      transcriptionLength: 41,
    },
  ]);

  const [newProcess, setNewProcess] = useState({
    name: "",
    description: "",
    department: "",
    priority: "media",
  });

  // Filter and sort processes
  const filteredProcesses = processes
    .filter(process => {
      const matchesSearch = process.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           process.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "todos" || process.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "nombre":
          return a.name.localeCompare(b.name);
        case "eficiencia":
          return b.efficiency - a.efficiency;
        case "estado":
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });

  // Calculate stats
  const totalProcesses = processes.length;
  const completedProcesses = processes.filter(p => p.status === "completado").length;
  const inProgressProcesses = processes.filter(p => p.status === "en_progreso").length;
  const averageEfficiency = Math.round(
    processes.filter(p => p.efficiency > 0).reduce((sum, p) => sum + p.efficiency, 0) / 
    processes.filter(p => p.efficiency > 0).length
  );

  const handleCreateProcess = () => {
    const process: Process = {
      id: Date.now().toString(),
      name: newProcess.name,
      description: newProcess.description,
      status: "pendiente",
      efficiency: 0,
      lastUpdated: "ahora",
    };
    
    setProcesses([...processes, process]);
    setNewProcess({ name: "", description: "", department: "", priority: "media" });
    setOpened(false);
  };

  const handleProcessAction = (action: string, processId: string) => {
    const process = processes.find(p => p.id === processId);
    const processName = process?.name || "Proceso";

    switch (action) {
      case "view":
        notifications.show({
          title: "Ver Proceso",
          message: `Abriendo detalles de: ${processName}`,
          color: "blue",
        });
        break;
      case "edit":
        notifications.show({
          title: "Editar Proceso",
          message: `Editando: ${processName}`,
          color: "green",
        });
        break;
      case "download":
        notifications.show({
          title: "Descargar",
          message: `Descargando documentación de: ${processName}`,
          color: "purple",
        });
        break;
      case "share":
        notifications.show({
          title: "Compartir",
          message: `Compartiendo: ${processName}`,
          color: "orange",
        });
        break;
      case "diagram":
        notifications.show({
          title: "Ver Diagrama",
          message: `Abriendo diagrama de flujo de: ${processName}`,
          color: "blue",
        });
        break;
      case "improvements":
        notifications.show({
          title: "Ver Mejoras",
          message: `Mostrando mejoras sugeridas para: ${processName}`,
          color: "teal",
        });
        break;
    }
  };

  return (
    <Stack gap="xl">
      {/* Header */}
      <Flex justify="space-between" align="center">
        <div>
          <Title order={1}>Procesos</Title>
          <Text c="dimmed">Gestiona y visualiza todos los procesos mapeados con IA</Text>
        </div>
        <Group>
          <Button
            leftSection={<IconUpload size={16} />}
            variant="light"
          >
            Importar Transcripción
          </Button>
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={() => setOpened(true)}
          >
            Nuevo Proceso
          </Button>
        </Group>
      </Flex>

      {/* Stats */}
      <ProcessStats
        totalProcesses={totalProcesses}
        completedProcesses={completedProcesses}
        inProgressProcesses={inProgressProcesses}
        averageEfficiency={averageEfficiency}
      />

      {/* Filters */}
      <ProcessFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      {/* Process Grid */}
      <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="lg">
        {filteredProcesses.map((process) => (
          <ProcessCard 
            key={process.id} 
            {...process}
            onView={(id) => handleProcessAction("view", id)}
            onEdit={(id) => handleProcessAction("edit", id)}
            onDownload={(id) => handleProcessAction("download", id)}
            onShare={(id) => handleProcessAction("share", id)}
            onViewDiagram={(id) => handleProcessAction("diagram", id)}
            onViewImprovements={(id) => handleProcessAction("improvements", id)}
          />
        ))}
      </SimpleGrid>

      {filteredProcesses.length === 0 && (
        <Text ta="center" c="dimmed" py="xl">
          No se encontraron procesos que coincidan con los filtros seleccionados.
        </Text>
      )}

      {/* Create Process Modal */}
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Crear Nuevo Proceso"
        size="md"
      >
        <Stack gap="md">
          <TextInput
            label="Nombre del proceso"
            placeholder="Ej: Incorporación de empleados"
            value={newProcess.name}
            onChange={(e) => setNewProcess({ ...newProcess, name: e.target.value })}
            required
          />
          <Textarea
            label="Descripción"
            placeholder="Describe brevemente el proceso..."
            value={newProcess.description}
            onChange={(e) => setNewProcess({ ...newProcess, description: e.target.value })}
            rows={3}
            required
          />
          <Select
            label="Departamento"
            placeholder="Selecciona un departamento"
            value={newProcess.department}
            onChange={(value) => setNewProcess({ ...newProcess, department: value || "" })}
            data={[
              { value: "rrhh", label: "Recursos Humanos" },
              { value: "ventas", label: "Ventas" },
              { value: "soporte", label: "Soporte" },
              { value: "operaciones", label: "Operaciones" },
              { value: "finanzas", label: "Finanzas" },
              { value: "marketing", label: "Marketing" },
            ]}
          />
          <Select
            label="Prioridad"
            value={newProcess.priority}
            onChange={(value) => setNewProcess({ ...newProcess, priority: value || "media" })}
            data={[
              { value: "alta", label: "Alta" },
              { value: "media", label: "Media" },
              { value: "baja", label: "Baja" },
            ]}
          />
          <Group justify="flex-end">
            <Button variant="light" onClick={() => setOpened(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateProcess}>
              Crear Proceso
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
}
