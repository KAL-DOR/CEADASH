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
  Textarea,
  Select,
  Group,
  Badge,
  ActionIcon,
  Modal,
  Table,
  Avatar,
  Flex,
} from "@mantine/core";
import {
  IconPlus,
  IconPhone,
  IconMail,
  IconCalendar,
  IconEdit,
  IconTrash,
  IconSearch,
} from "@tabler/icons-react";

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: "activo" | "pendiente" | "completado";
  lastCall?: string;
}

export default function ContactosPage() {
  const [opened, setOpened] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: "1",
      name: "Juan Pérez",
      email: "juan.perez@empresa.com",
      phone: "+34 123 456 789",
      company: "Empresa ABC",
      status: "activo",
      lastCall: "2024-09-25",
    },
    {
      id: "2",
      name: "María González",
      email: "maria.gonzalez@startup.com",
      phone: "+34 987 654 321",
      company: "Startup XYZ",
      status: "pendiente",
    },
    {
      id: "3",
      name: "Carlos Rodríguez",
      email: "carlos@consultoria.es",
      phone: "+34 555 123 456",
      company: "Consultoría Pro",
      status: "completado",
      lastCall: "2024-09-20",
    },
  ]);

  const [newContact, setNewContact] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    notes: "",
  });

  const handleAddContact = () => {
    const contact: Contact = {
      id: Date.now().toString(),
      name: newContact.name,
      email: newContact.email,
      phone: newContact.phone,
      company: newContact.company,
      status: "pendiente",
    };
    
    setContacts([...contacts, contact]);
    setNewContact({ name: "", email: "", phone: "", company: "", notes: "" });
    setOpened(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "activo": return "blue";
      case "pendiente": return "yellow";
      case "completado": return "green";
      default: return "gray";
    }
  };

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Stack gap="xl">
      {/* Header */}
      <Flex justify="space-between" align="center">
        <div>
          <Title order={1}>Contactos</Title>
          <Text c="dimmed">Gestiona tus contactos y programa llamadas con ElevenLabs</Text>
        </div>
        <Button
          leftSection={<IconPlus size={16} />}
          onClick={() => setOpened(true)}
        >
          Agregar Contacto
        </Button>
      </Flex>

      {/* Stats Cards */}
      <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="lg">
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Stack gap="xs">
            <Text size="sm" c="dimmed">Total Contactos</Text>
            <Text size="xl" fw={700}>{contacts.length}</Text>
          </Stack>
        </Card>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Stack gap="xs">
            <Text size="sm" c="dimmed">Llamadas Pendientes</Text>
            <Text size="xl" fw={700} c="yellow">
              {contacts.filter(c => c.status === "pendiente").length}
            </Text>
          </Stack>
        </Card>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Stack gap="xs">
            <Text size="sm" c="dimmed">Llamadas Completadas</Text>
            <Text size="xl" fw={700} c="green">
              {contacts.filter(c => c.status === "completado").length}
            </Text>
          </Stack>
        </Card>
      </SimpleGrid>

      {/* Search and Filters */}
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Group>
          <TextInput
            placeholder="Buscar contactos..."
            leftSection={<IconSearch size={16} />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ flex: 1 }}
          />
          <Select
            placeholder="Estado"
            data={[
              { value: "todos", label: "Todos" },
              { value: "activo", label: "Activo" },
              { value: "pendiente", label: "Pendiente" },
              { value: "completado", label: "Completado" },
            ]}
            defaultValue="todos"
          />
        </Group>
      </Card>

      {/* Contacts Table */}
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Stack gap="md">
          <Title order={3}>Lista de Contactos</Title>
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Contacto</Table.Th>
                <Table.Th>Empresa</Table.Th>
                <Table.Th>Teléfono</Table.Th>
                <Table.Th>Estado</Table.Th>
                <Table.Th>Última Llamada</Table.Th>
                <Table.Th>Acciones</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {filteredContacts.map((contact) => (
                <Table.Tr key={contact.id}>
                  <Table.Td>
                    <Group gap="sm">
                      <Avatar size="sm" color="blue">
                        {contact.name.charAt(0)}
                      </Avatar>
                      <div>
                        <Text size="sm" fw={500}>{contact.name}</Text>
                        <Text size="xs" c="dimmed">{contact.email}</Text>
                      </div>
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">{contact.company}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">{contact.phone}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Badge color={getStatusColor(contact.status)} variant="light">
                      {contact.status}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" c="dimmed">
                      {contact.lastCall || "Nunca"}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      <ActionIcon variant="light" color="blue">
                        <IconPhone size={16} />
                      </ActionIcon>
                      <ActionIcon variant="light" color="green">
                        <IconCalendar size={16} />
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

      {/* Add Contact Modal */}
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Agregar Nuevo Contacto"
        size="md"
      >
        <Stack gap="md">
          <TextInput
            label="Nombre completo"
            placeholder="Juan Pérez"
            value={newContact.name}
            onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
            required
          />
          <TextInput
            label="Email"
            placeholder="juan@empresa.com"
            value={newContact.email}
            onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
            required
          />
          <TextInput
            label="Teléfono"
            placeholder="+34 123 456 789"
            value={newContact.phone}
            onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
            required
          />
          <TextInput
            label="Empresa"
            placeholder="Empresa ABC"
            value={newContact.company}
            onChange={(e) => setNewContact({ ...newContact, company: e.target.value })}
            required
          />
          <Textarea
            label="Notas adicionales"
            placeholder="Información adicional sobre el contacto..."
            value={newContact.notes}
            onChange={(e) => setNewContact({ ...newContact, notes: e.target.value })}
            rows={3}
          />
          <Group justify="flex-end">
            <Button variant="light" onClick={() => setOpened(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddContact}>
              Agregar Contacto
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
}
