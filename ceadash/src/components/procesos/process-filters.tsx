import { Card, Group, TextInput, Select } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";

interface ProcessFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  sortBy: string;
  onSortByChange: (sort: string) => void;
}

export function ProcessFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  sortBy,
  onSortByChange,
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
          onChange={(value) => onStatusFilterChange(value || "todos")}
          data={[
            { value: "todos", label: "Todos" },
            { value: "active", label: "Activos" },
            { value: "draft", label: "Borradores" },
            { value: "archived", label: "Archivados" },
          ]}
          w={150}
        />
        <Select
          placeholder="Ordenar por"
          value={sortBy}
          onChange={(value) => onSortByChange(value || "fecha")}
          data={[
            { value: "fecha", label: "Fecha" },
            { value: "nombre", label: "Nombre" },
            { value: "eficiencia", label: "Eficiencia" },
          ]}
          w={150}
        />
      </Group>
    </Card>
  );
}
