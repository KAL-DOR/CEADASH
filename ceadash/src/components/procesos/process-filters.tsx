import { Card, Group, TextInput, Select } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";

interface ProcessFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: string;
  onStatusChange: (status: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
}

export function ProcessFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  sortBy,
  onSortChange,
}: ProcessFiltersProps) {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Group>
        <TextInput
          placeholder="Buscar procesos..."
          leftSection={<IconSearch size={16} />}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          style={{ flex: 1 }}
        />
        <Select
          placeholder="Estado"
          value={statusFilter}
          onChange={(value) => onStatusChange(value || "todos")}
          data={[
            { value: "todos", label: "Todos" },
            { value: "completado", label: "Completados" },
            { value: "en_progreso", label: "En Progreso" },
            { value: "pendiente", label: "Pendientes" },
          ]}
          w={150}
        />
        <Select
          placeholder="Ordenar por"
          value={sortBy}
          onChange={(value) => onSortChange(value || "fecha")}
          data={[
            { value: "fecha", label: "Fecha" },
            { value: "nombre", label: "Nombre" },
            { value: "eficiencia", label: "Eficiencia" },
            { value: "estado", label: "Estado" },
          ]}
          w={150}
        />
      </Group>
    </Card>
  );
}
