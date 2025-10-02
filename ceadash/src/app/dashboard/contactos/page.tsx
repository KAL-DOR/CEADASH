"use client";

import { useState, useEffect } from "react";
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
  Loader,
  Center,
} from "@mantine/core";
import {
  IconPlus,
  IconPhone,
  IconMail,
  IconCalendar,
  IconEdit,
  IconTrash,
  IconSearch,
  IconRefresh,
} from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { useAuth } from "@/lib/auth/context";

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company?: string;
  status: "active" | "inactive";
  notes?: string | null;
  created_at?: string;
  updated_at?: string;
}

export default function ContactosPage() {
  const { profile } = useAuth();
  const [opened, setOpened] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("todos");
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [newContact, setNewContact] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    notes: "",
  });

  // Load contacts from Supabase
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let isMounted = true;
    
    const loadData = async () => {
      if (!profile?.organization_id) {
        setLoading(false);
        return;
      }

      // Set timeout to prevent infinite loading - increased to 10 seconds
      timeoutId = setTimeout(() => {
        console.warn('Contacts loading timeout - still trying...');
        if (isMounted) {
          setLoading(false);
        }
      }, 10000);

      try {
        await loadContacts();
      } catch (err) {
        console.error('Failed to load contacts:', err);
      } finally {
        clearTimeout(timeoutId);
      }
    };

    loadData();

    return () => {
      isMounted = false;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [profile?.organization_id]);

  const loadContacts = async () => {
    try {
      setLoading(true);
      
      console.log('🔍 Loading contacts for org:', profile?.organization_id);
      console.log('⏰ Starting query at:', new Date().toISOString());
      
      const startTime = Date.now();
      const response = await fetch(`/api/contacts?organization_id=${profile?.organization_id}`);
      const duration = Date.now() - startTime;
      
      console.log('✅ API call completed in', duration, 'ms');

      if (!response.ok) {
        throw new Error(`API returned ${response.status}`);
      }

      const data = await response.json();
      
      console.log('📊 Contacts loaded:', { 
        count: data?.length || 0,
        sample: data?.slice(0, 2)
      });

      setContacts(data || []);
    } catch (error) {
      console.error('💥 Exception loading contacts:', error);
      notifications.show({
        title: "Error",
        message: "No se pudieron cargar los contactos",
        color: "red",
      });
      setContacts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddContact = async () => {
    if (!newContact.name || !newContact.email) {
      notifications.show({
        title: "Campos requeridos",
        message: "Por favor completa nombre y email",
        color: "red",
      });
      return;
    }

    try {
      setSubmitting(true);

      const contactData = {
        organization_id: profile?.organization_id,
        name: newContact.name,
        email: newContact.email,
        phone: newContact.phone || null,
        company: newContact.company || null,
        notes: newContact.notes || null,
        status: 'active' as const,
        created_by: profile?.id,
      };

      if (editingContact) {
        // Update existing contact
        const response = await fetch('/api/contacts', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...contactData, id: editingContact.id }),
        });

        if (!response.ok) throw new Error('Failed to update contact');

        notifications.show({
          title: "¡Éxito!",
          message: "Contacto actualizado correctamente",
          color: "green",
        });
      } else {
        // Create new contact
        const response = await fetch('/api/contacts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(contactData),
        });

        if (!response.ok) throw new Error('Failed to create contact');

        notifications.show({
          title: "¡Éxito!",
          message: "Contacto agregado correctamente",
          color: "green",
        });
      }

      setNewContact({ name: "", email: "", phone: "", company: "", notes: "" });
      setEditingContact(null);
      setOpened(false);
      loadContacts();
    } catch (error) {
      console.error('Error saving contact:', error);
      notifications.show({
        title: "Error",
        message: "No se pudo guardar el contacto",
        color: "red",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditContact = (contact: Contact) => {
    setEditingContact(contact);
    setNewContact({
      name: contact.name,
      email: contact.email,
      phone: contact.phone || "",
      company: contact.company || "",
      notes: contact.notes || "",
    });
    setOpened(true);
  };

  const handleDeleteContact = async (contactId: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este contacto?')) {
      return;
    }

    try {
      const response = await fetch(`/api/contacts?id=${contactId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete contact');

      notifications.show({
        title: "¡Éxito!",
        message: "Contacto eliminado correctamente",
        color: "green",
      });

      loadContacts();
    } catch (error) {
      console.error('Error deleting contact:', error);
      notifications.show({
        title: "Error",
        message: "No se pudo eliminar el contacto",
        color: "red",
      });
    }
  };

  const handleCloseModal = () => {
    setOpened(false);
    setEditingContact(null);
    setNewContact({ name: "", email: "", phone: "", company: "", notes: "" });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "green";
      case "inactive": return "gray";
      default: return "gray";
    }
  };

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = 
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (contact.company && contact.company.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = statusFilter === "todos" || contact.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <Center style={{ minHeight: '50vh' }}>
        <Stack align="center" gap="md">
          <Loader size="lg" />
          <Text c="dimmed">Cargando contactos...</Text>
        </Stack>
      </Center>
    );
  }

  return (
    <Stack gap="xl">
      {/* Header */}
      <Flex justify="space-between" align={{ base: "flex-start", sm: "center" }} direction={{ base: "column", sm: "row" }} gap="md">
        <div>
          <Title order={1}>Contactos</Title>
          <Text c="dimmed">Gestiona tus contactos y programa llamadas con ElevenLabs</Text>
        </div>
        <Group>
          <ActionIcon
            variant="light"
            size="lg"
            onClick={() => loadContacts()}
            title="Recargar contactos"
          >
            <IconRefresh size={18} />
          </ActionIcon>
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={() => setOpened(true)}
            size="md"
            hiddenFrom="sm"
            fullWidth
          >
            Agregar Contacto
          </Button>
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={() => setOpened(true)}
            size="md"
            visibleFrom="sm"
          >
            Agregar Contacto
          </Button>
        </Group>
      </Flex>

      {/* Stats Cards */}
      <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing={{ base: "md", md: "lg" }}>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Stack gap="xs">
            <Text size="sm" c="dimmed">Total Contactos</Text>
            <Text size="xl" fw={700}>{contacts.length}</Text>
          </Stack>
        </Card>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Stack gap="xs">
            <Text size="sm" c="dimmed">Contactos Activos</Text>
            <Text size="xl" fw={700} c="green">
              {contacts.filter(c => c.status === "active").length}
            </Text>
          </Stack>
        </Card>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Stack gap="xs">
            <Text size="sm" c="dimmed">Contactos Inactivos</Text>
            <Text size="xl" fw={700} c="gray">
              {contacts.filter(c => c.status === "inactive").length}
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
              { value: "active", label: "Activo" },
              { value: "inactive", label: "Inactivo" },
            ]}
            value={statusFilter}
            onChange={(value) => setStatusFilter(value || "todos")}
          />
        </Group>
      </Card>

      {/* Contacts Table */}
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Stack gap="md">
          <Title order={3}>Lista de Contactos</Title>
          {filteredContacts.length === 0 ? (
            <Center py="xl">
              <Stack align="center" gap="sm">
                <IconPlus size={48} stroke={1.5} color="gray" />
                <Text c="dimmed">No hay contactos para mostrar</Text>
                <Button onClick={() => setOpened(true)} leftSection={<IconPlus size={16} />}>
                  Agregar primer contacto
                </Button>
              </Stack>
            </Center>
          ) : (
            <Table>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Contacto</Table.Th>
                  <Table.Th>Empresa</Table.Th>
                  <Table.Th>Teléfono</Table.Th>
                  <Table.Th>Estado</Table.Th>
                  <Table.Th>Fecha de Creación</Table.Th>
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
                      <Text size="sm">{contact.company || "-"}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm">{contact.phone || "-"}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Badge color={getStatusColor(contact.status)} variant="light">
                        {contact.status === "active" ? "Activo" : "Inactivo"}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm" c="dimmed">
                        {contact.created_at ? new Date(contact.created_at).toLocaleDateString('es-ES') : "-"}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Group gap="xs">
                        <ActionIcon 
                          variant="light" 
                          color="blue"
                          onClick={() => window.location.href = `/dashboard/programacion?contactId=${contact.id}`}
                          title="Programar llamada"
                        >
                          <IconCalendar size={16} />
                        </ActionIcon>
                        <ActionIcon 
                          variant="light" 
                          color="gray"
                          onClick={() => handleEditContact(contact)}
                          title="Editar"
                        >
                          <IconEdit size={16} />
                        </ActionIcon>
                        <ActionIcon 
                          variant="light" 
                          color="red"
                          onClick={() => handleDeleteContact(contact.id)}
                          title="Eliminar"
                        >
                          <IconTrash size={16} />
                        </ActionIcon>
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          )}
        </Stack>
      </Card>

      {/* Add/Edit Contact Modal */}
      <Modal
        opened={opened}
        onClose={handleCloseModal}
        title={editingContact ? "Editar Contacto" : "Agregar Nuevo Contacto"}
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
            type="email"
          />
          <TextInput
            label="Teléfono"
            placeholder="+34 123 456 789"
            value={newContact.phone}
            onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
          />
          <TextInput
            label="Empresa"
            placeholder="Empresa ABC"
            value={newContact.company}
            onChange={(e) => setNewContact({ ...newContact, company: e.target.value })}
          />
          <Textarea
            label="Notas adicionales"
            placeholder="Información adicional sobre el contacto..."
            value={newContact.notes}
            onChange={(e) => setNewContact({ ...newContact, notes: e.target.value })}
            rows={3}
          />
          <Group justify="flex-end">
            <Button variant="light" onClick={handleCloseModal} disabled={submitting}>
              Cancelar
            </Button>
            <Button onClick={handleAddContact} loading={submitting}>
              {editingContact ? "Actualizar" : "Agregar"} Contacto
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
}
