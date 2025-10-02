"use client";

import { useState, useEffect } from "react";
import {
  Title,
  Text,
  Button,
  Stack,
  SimpleGrid,
  Flex,
  Loader,
  Center,
  Group,
} from "@mantine/core";
import { IconPlus, IconUpload, IconFolderOpen } from "@tabler/icons-react";
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
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [sortBy, setSortBy] = useState("fecha");
  const [loading, setLoading] = useState(true);
  
  const [processes, setProcesses] = useState<Process[]>([]);

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
            leftSection={<IconFolderOpen size={16} />}
            onClick={() => window.open('https://crimson-snowboard-382.notion.site/Procesos-23e31d8762438016a65ae59b43137c07', '_blank')}
            variant="filled"
            color="blue"
            size="md"
          >
            Ver Procesos Guardados
          </Button>
          <Button
            leftSection={<IconUpload size={16} />}
            onClick={() => window.open('https://tools.fitcluv.com/form/19083649-234c-4815-9903-7864a61f6884', '_blank')}
            variant="light"
            size="md"
          >
            Importar Transcripción
          </Button>
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={() => window.open('https://tools.fitcluv.com/form/aa6a028e-8e5b-463e-bc2b-6d6d760927f5', '_blank')}
            size="md"
            hiddenFrom="sm"
            fullWidth
          >
            Nuevo Proceso
          </Button>
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={() => window.open('https://tools.fitcluv.com/form/aa6a028e-8e5b-463e-bc2b-6d6d760927f5', '_blank')}
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
            <Button onClick={() => window.open('https://tools.fitcluv.com/form/aa6a028e-8e5b-463e-bc2b-6d6d760927f5', '_blank')}>
              Crear primer proceso
            </Button>
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
    </Stack>
  );
}
