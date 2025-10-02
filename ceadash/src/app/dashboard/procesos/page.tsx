"use client";

import { useState, useEffect } from "react";
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
  Loader,
  Center,
} from "@mantine/core";
import { IconPlus, IconUpload } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { useAuth } from "@/lib/auth/context";
import { createClient } from "@/lib/supabase/client";

import { ProcessCard } from "@/components/procesos/process-card";
import { ProcessFilters } from "@/components/procesos/process-filters";
import { ProcessStats } from "@/components/procesos/process-stats";

interface Process {
  id: string;
  name: string;
  description: string | null;
  status: "draft" | "active" | "archived";
  efficiency_score: number | null;
  diagram_data: Record<string, unknown> | null;
  improvements_data: Record<string, unknown> | null;
  transcription_id: string | null;
  created_at: string;
  updated_at: string;
}

export default function ProcesosPage() {
  const { profile } = useAuth();
  const [opened, setOpened] = useState(false);
  const [uploadOpened, setUploadOpened] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [sortBy, setSortBy] = useState("fecha");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [processes, setProcesses] = useState<Process[]>([]);
  
  const [newProcess, setNewProcess] = useState<{
    name: string;
    description: string;
    status: "draft" | "active" | "archived";
  }>({
    name: "",
    description: "",
    status: "draft",
  });

  const [uploadData, setUploadData] = useState({
    transcriptionText: "",
    processName: "",
    processType: "",
  });

  // Load processes from Supabase
  useEffect(() => {
    if (profile?.organization_id) {
      loadProcesses();
    }
  }, [profile?.organization_id]);

  const loadProcesses = async () => {
    try {
      setLoading(true);
      const supabase = createClient();
      
      const { data, error } = await supabase
        .from('processes')
        .select('*')
        .eq('organization_id', profile?.organization_id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProcesses(data || []);
    } catch (error) {
      console.error('Error loading processes:', error);
      notifications.show({
        title: "Error",
        message: "No se pudieron cargar los procesos",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProcess = async () => {
    if (!newProcess.name) {
      notifications.show({
        title: "Campo requerido",
        message: "Por favor ingresa el nombre del proceso",
        color: "red",
      });
      return;
    }

    try {
      setSubmitting(true);
      const supabase = createClient();

      const { error } = await supabase
        .from('processes')
        .insert([
          {
            organization_id: profile?.organization_id,
            name: newProcess.name,
            description: newProcess.description || null,
            status: newProcess.status,
            created_by: profile?.id,
          }
        ]);

      if (error) throw error;

      notifications.show({
        title: "¡Éxito!",
        message: "Proceso creado correctamente",
        color: "green",
      });

      setNewProcess({ name: "", description: "", status: "draft" });
      setOpened(false);
      loadProcesses();
    } catch (error) {
      console.error('Error creating process:', error);
      notifications.show({
        title: "Error",
        message: "No se pudo crear el proceso",
        color: "red",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleImportTranscription = async () => {
    if (!uploadData.transcriptionText || !uploadData.processName) {
      notifications.show({
        title: "Campos requeridos",
        message: "Por favor completa todos los campos",
        color: "red",
      });
      return;
    }

    try {
      setSubmitting(true);
      const supabase = createClient();

      // First, create the transcription
      const { data: transcription, error: transcriptionError } = await supabase
        .from('transcriptions')
        .insert([
          {
            organization_id: profile?.organization_id,
            content: uploadData.transcriptionText,
            metadata: {
              process_type: uploadData.processType,
              imported_at: new Date().toISOString(),
            },
            processed: false,
          }
        ])
        .select()
        .single();

      if (transcriptionError) throw transcriptionError;

      // Then create the process linked to the transcription
      const { error: processError } = await supabase
        .from('processes')
        .insert([
          {
            organization_id: profile?.organization_id,
            name: uploadData.processName,
            description: `Proceso importado desde transcripción - ${uploadData.processType}`,
            status: 'draft',
            transcription_id: transcription.id,
            created_by: profile?.id,
          }
        ]);

      if (processError) throw processError;

      notifications.show({
        title: "¡Éxito!",
        message: "Transcripción importada correctamente. El proceso será analizado en breve.",
        color: "green",
      });

      setUploadData({ transcriptionText: "", processName: "", processType: "" });
      setUploadOpened(false);
      loadProcesses();
    } catch (error) {
      console.error('Error importing transcription:', error);
      notifications.show({
        title: "Error",
        message: "No se pudo importar la transcripción",
        color: "red",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProcess = async (processId: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este proceso?')) {
      return;
    }

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('processes')
        .delete()
        .eq('id', processId);

      if (error) throw error;

      notifications.show({
        title: "¡Éxito!",
        message: "Proceso eliminado correctamente",
        color: "green",
      });

      loadProcesses();
    } catch (error) {
      console.error('Error deleting process:', error);
      notifications.show({
        title: "Error",
        message: "No se pudo eliminar el proceso",
        color: "red",
      });
    }
  };

  const handleUpdateStatus = async (processId: string, newStatus: "draft" | "active" | "archived") => {
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('processes')
        .update({ status: newStatus })
        .eq('id', processId);

      if (error) throw error;

      notifications.show({
        title: "¡Éxito!",
        message: "Estado actualizado correctamente",
        color: "green",
      });

      loadProcesses();
    } catch (error) {
      console.error('Error updating status:', error);
      notifications.show({
        title: "Error",
        message: "No se pudo actualizar el estado",
        color: "red",
      });
    }
  };

  // Filter and sort processes
  const filteredProcesses = processes
    .filter(process => {
      const matchesSearch = process.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (process.description && process.description.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesStatus = statusFilter === "todos" || process.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "nombre":
          return a.name.localeCompare(b.name);
        case "eficiencia":
          return (b.efficiency_score || 0) - (a.efficiency_score || 0);
        case "fecha":
        default:
          return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
      }
    });

  // Calculate stats
  const stats = {
    total: processes.length,
    completed: processes.filter(p => p.status === "active").length,
    inProgress: processes.filter(p => p.status === "draft").length,
    avgEfficiency: processes.length > 0
      ? Math.round(processes.reduce((sum, p) => sum + (p.efficiency_score || 0), 0) / processes.length)
      : 0,
  };

  if (loading) {
    return (
      <Center style={{ minHeight: '50vh' }}>
        <Stack align="center" gap="md">
          <Loader size="lg" />
          <Text c="dimmed">Cargando procesos...</Text>
        </Stack>
      </Center>
    );
  }

  return (
    <Stack gap="xl">
      {/* Header */}
      <Flex justify="space-between" align={{ base: "flex-start", sm: "center" }} direction={{ base: "column", sm: "row" }} gap="md">
        <div>
          <Title order={1}>Procesos</Title>
          <Text c="dimmed">Gestiona y optimiza tus procesos empresariales</Text>
        </div>
        <Group>
          <Button
            leftSection={<IconUpload size={16} />}
            onClick={() => setUploadOpened(true)}
            variant="light"
            size="md"
          >
            Importar Transcripción
          </Button>
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={() => setOpened(true)}
            size="md"
            hiddenFrom="sm"
            fullWidth
          >
            Nuevo Proceso
          </Button>
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={() => setOpened(true)}
            size="md"
            visibleFrom="sm"
          >
            Nuevo Proceso
          </Button>
        </Group>
      </Flex>

      {/* Stats */}
      <ProcessStats
        totalProcesses={stats.total}
        completedProcesses={stats.completed}
        inProgressProcesses={stats.inProgress}
        averageEfficiency={stats.avgEfficiency}
      />

      {/* Filters */}
      <ProcessFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        sortBy={sortBy}
        onSortByChange={setSortBy}
      />

      {/* Process Grid */}
      {filteredProcesses.length === 0 ? (
        <Center py="xl">
          <Stack align="center" gap="sm">
            <IconPlus size={48} stroke={1.5} color="gray" />
            <Text c="dimmed">No hay procesos para mostrar</Text>
            <Button onClick={() => setOpened(true)}>Crear primer proceso</Button>
          </Stack>
        </Center>
      ) : (
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing={{ base: "md", md: "lg" }}>
          {filteredProcesses.map((process) => (
            <ProcessCard
              key={process.id}
              id={process.id}
              name={process.name}
              description={process.description || "Sin descripción"}
              status={process.status}
              efficiency={process.efficiency_score || 0}
              lastUpdated={new Date(process.updated_at).toLocaleDateString('es-ES')}
              onDelete={() => handleDeleteProcess(process.id)}
              onUpdateStatus={(newStatus) => handleUpdateStatus(process.id, newStatus as "draft" | "active" | "archived")}
            />
          ))}
        </SimpleGrid>
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
            placeholder="ej. Incorporación de empleados"
            value={newProcess.name}
            onChange={(e) => setNewProcess({ ...newProcess, name: e.target.value })}
            required
          />
          <Textarea
            label="Descripción"
            placeholder="Describe el proceso..."
            value={newProcess.description}
            onChange={(e) => setNewProcess({ ...newProcess, description: e.target.value })}
            rows={4}
          />
          <Select
            label="Estado inicial"
            data={[
              { value: "draft", label: "Borrador" },
              { value: "active", label: "Activo" },
              { value: "archived", label: "Archivado" },
            ]}
            value={newProcess.status}
            onChange={(value) => {
              if (value === "draft") {
                setNewProcess({ ...newProcess, status: "draft" });
              } else if (value === "active") {
                setNewProcess({ ...newProcess, status: "active" });
              } else if (value === "archived") {
                setNewProcess({ ...newProcess, status: "archived" });
              }
            }}
          />
          <Group justify="flex-end">
            <Button variant="light" onClick={() => setOpened(false)} disabled={submitting}>
              Cancelar
            </Button>
            <Button onClick={handleCreateProcess} loading={submitting}>
              Crear Proceso
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* Import Transcription Modal */}
      <Modal
        opened={uploadOpened}
        onClose={() => setUploadOpened(false)}
        title="Importar Transcripción"
        size="lg"
      >
        <Stack gap="md">
          <Text size="sm" c="dimmed">
            Importa una transcripción de llamada para crear un nuevo proceso. El sistema analizará el contenido y generará un diagrama automáticamente.
          </Text>
          <TextInput
            label="Nombre del proceso"
            placeholder="ej. Proceso de Ventas B2B"
            value={uploadData.processName}
            onChange={(e) => setUploadData({ ...uploadData, processName: e.target.value })}
            required
          />
          <Select
            label="Tipo de proceso"
            placeholder="Selecciona el tipo"
            data={[
              { value: "ventas", label: "Ventas" },
              { value: "onboarding", label: "Onboarding" },
              { value: "soporte", label: "Soporte" },
              { value: "produccion", label: "Producción" },
              { value: "logistica", label: "Logística" },
              { value: "otro", label: "Otro" },
            ]}
            value={uploadData.processType}
            onChange={(value) => setUploadData({ ...uploadData, processType: value || "" })}
            required
          />
          <Textarea
            label="Transcripción"
            placeholder="Pega aquí el texto de la transcripción..."
            value={uploadData.transcriptionText}
            onChange={(e) => setUploadData({ ...uploadData, transcriptionText: e.target.value })}
            rows={10}
            required
          />
          <Group justify="flex-end">
            <Button variant="light" onClick={() => setUploadOpened(false)} disabled={submitting}>
              Cancelar
            </Button>
            <Button onClick={handleImportTranscription} loading={submitting}>
              Importar y Analizar
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
}
