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
  Switch,
  Textarea,
  PasswordInput,
  Divider,
  Avatar,
  FileInput,
  NumberInput,
  Tabs,
} from "@mantine/core";
import {
  IconUser,
  IconBell,
  IconShield,
  IconMail,
  IconPhone,
  IconBuilding,
  IconKey,
  IconUpload,
  IconSettings,
  IconPalette,
} from "@tabler/icons-react";

export default function ConfiguracionPage() {
  const [profile, setProfile] = useState({
    name: "Usuario Demo",
    email: "usuario@empresa.com",
    phone: "+34 123 456 789",
    company: "Mi Empresa",
    position: "Administrador",
    bio: "Especialista en optimización de procesos empresariales",
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    weeklyReports: true,
    processAlerts: true,
  });

  const [elevenlabs, setElevenlabs] = useState({
    apiKey: "",
    voiceId: "default",
    language: "es",
    callDuration: 30,
    autoRecord: true,
  });

  const [security, setSecurity] = useState({
    twoFactorAuth: false,
    sessionTimeout: 60,
    passwordExpiry: 90,
  });

  return (
    <Stack gap="xl">
      {/* Header */}
      <div>
        <Title order={1}>Configuración</Title>
        <Text c="dimmed">Gestiona tu perfil, preferencias y configuración del sistema</Text>
      </div>

      <Tabs defaultValue="profile" orientation="horizontal">
        <Tabs.List>
          <Tabs.Tab value="profile" leftSection={<IconUser size={16} />}>
            Perfil
          </Tabs.Tab>
          <Tabs.Tab value="notifications" leftSection={<IconBell size={16} />}>
            Notificaciones
          </Tabs.Tab>
          <Tabs.Tab value="elevenlabs" leftSection={<IconSettings size={16} />}>
            ElevenLabs
          </Tabs.Tab>
          <Tabs.Tab value="security" leftSection={<IconShield size={16} />}>
            Seguridad
          </Tabs.Tab>
        </Tabs.List>

        {/* Profile Tab */}
        <Tabs.Panel value="profile" pt="lg">
          <Stack gap="lg">
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Stack gap="md">
                <Group>
                  <Avatar size="xl" color="blue">
                    {profile.name.charAt(0)}
                  </Avatar>
                  <div>
                    <Title order={3}>{profile.name}</Title>
                    <Text c="dimmed">{profile.position} en {profile.company}</Text>
                  </div>
                </Group>
                
                <FileInput
                  label="Foto de perfil"
                  placeholder="Subir nueva foto"
                  leftSection={<IconUpload size={16} />}
                />
              </Stack>
            </Card>

            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Stack gap="md">
                <Title order={4}>Información Personal</Title>
                
                <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                  <TextInput
                    label="Nombre completo"
                    leftSection={<IconUser size={16} />}
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  />
                  <TextInput
                    label="Email"
                    leftSection={<IconMail size={16} />}
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  />
                  <TextInput
                    label="Teléfono"
                    leftSection={<IconPhone size={16} />}
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  />
                  <TextInput
                    label="Empresa"
                    leftSection={<IconBuilding size={16} />}
                    value={profile.company}
                    onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                  />
                </SimpleGrid>
                
                <TextInput
                  label="Cargo"
                  value={profile.position}
                  onChange={(e) => setProfile({ ...profile, position: e.target.value })}
                />
                
                <Textarea
                  label="Biografía"
                  placeholder="Cuéntanos sobre ti..."
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  rows={3}
                />
                
                <Group justify="flex-end">
                  <Button variant="light">Cancelar</Button>
                  <Button>Guardar Cambios</Button>
                </Group>
              </Stack>
            </Card>
          </Stack>
        </Tabs.Panel>

        {/* Notifications Tab */}
        <Tabs.Panel value="notifications" pt="lg">
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Stack gap="md">
              <Title order={4}>Preferencias de Notificaciones</Title>
              
              <Stack gap="lg">
                <div>
                  <Text fw={500} mb="sm">Notificaciones Generales</Text>
                  <Stack gap="sm">
                    <Group justify="space-between">
                      <div>
                        <Text size="sm">Notificaciones por email</Text>
                        <Text size="xs" c="dimmed">Recibe actualizaciones por correo electrónico</Text>
                      </div>
                      <Switch
                        checked={notifications.emailNotifications}
                        onChange={(e) => setNotifications({ 
                          ...notifications, 
                          emailNotifications: e.currentTarget.checked 
                        })}
                      />
                    </Group>
                    
                    <Group justify="space-between">
                      <div>
                        <Text size="sm">Notificaciones SMS</Text>
                        <Text size="xs" c="dimmed">Recibe alertas importantes por SMS</Text>
                      </div>
                      <Switch
                        checked={notifications.smsNotifications}
                        onChange={(e) => setNotifications({ 
                          ...notifications, 
                          smsNotifications: e.currentTarget.checked 
                        })}
                      />
                    </Group>
                    
                    <Group justify="space-between">
                      <div>
                        <Text size="sm">Notificaciones push</Text>
                        <Text size="xs" c="dimmed">Notificaciones en tiempo real en el navegador</Text>
                      </div>
                      <Switch
                        checked={notifications.pushNotifications}
                        onChange={(e) => setNotifications({ 
                          ...notifications, 
                          pushNotifications: e.currentTarget.checked 
                        })}
                      />
                    </Group>
                  </Stack>
                </div>

                <Divider />

                <div>
                  <Text fw={500} mb="sm">Reportes y Alertas</Text>
                  <Stack gap="sm">
                    <Group justify="space-between">
                      <div>
                        <Text size="sm">Reportes semanales</Text>
                        <Text size="xs" c="dimmed">Resumen semanal de actividad</Text>
                      </div>
                      <Switch
                        checked={notifications.weeklyReports}
                        onChange={(e) => setNotifications({ 
                          ...notifications, 
                          weeklyReports: e.currentTarget.checked 
                        })}
                      />
                    </Group>
                    
                    <Group justify="space-between">
                      <div>
                        <Text size="sm">Alertas de procesos</Text>
                        <Text size="xs" c="dimmed">Notificaciones cuando se completan procesos</Text>
                      </div>
                      <Switch
                        checked={notifications.processAlerts}
                        onChange={(e) => setNotifications({ 
                          ...notifications, 
                          processAlerts: e.currentTarget.checked 
                        })}
                      />
                    </Group>
                  </Stack>
                </div>
              </Stack>
              
              <Group justify="flex-end" mt="lg">
                <Button variant="light">Cancelar</Button>
                <Button>Guardar Preferencias</Button>
              </Group>
            </Stack>
          </Card>
        </Tabs.Panel>

        {/* ElevenLabs Tab */}
        <Tabs.Panel value="elevenlabs" pt="lg">
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Stack gap="md">
              <Title order={4}>Configuración de ElevenLabs</Title>
              
              <Stack gap="md">
                <TextInput
                  label="API Key"
                  placeholder="Ingresa tu clave API de ElevenLabs"
                  leftSection={<IconKey size={16} />}
                  value={elevenlabs.apiKey}
                  onChange={(e) => setElevenlabs({ ...elevenlabs, apiKey: e.target.value })}
                  type="password"
                />
                
                <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                  <Select
                    label="Voz predeterminada"
                    placeholder="Selecciona una voz"
                    value={elevenlabs.voiceId}
                    onChange={(value) => setElevenlabs({ ...elevenlabs, voiceId: value || "default" })}
                    data={[
                      { value: "default", label: "Voz por defecto" },
                      { value: "spanish-male", label: "Español - Masculina" },
                      { value: "spanish-female", label: "Español - Femenina" },
                      { value: "neutral", label: "Neutral" },
                    ]}
                  />
                  
                  <Select
                    label="Idioma"
                    value={elevenlabs.language}
                    onChange={(value) => setElevenlabs({ ...elevenlabs, language: value || "es" })}
                    data={[
                      { value: "es", label: "Español" },
                      { value: "en", label: "Inglés" },
                      { value: "fr", label: "Francés" },
                      { value: "de", label: "Alemán" },
                    ]}
                  />
                </SimpleGrid>
                
                <NumberInput
                  label="Duración máxima de llamada (minutos)"
                  placeholder="30"
                  value={elevenlabs.callDuration}
                  onChange={(value) => setElevenlabs({ ...elevenlabs, callDuration: Number(value) })}
                  min={5}
                  max={120}
                />
                
                <Group justify="space-between">
                  <div>
                    <Text size="sm" fw={500}>Grabación automática</Text>
                    <Text size="xs" c="dimmed">Grabar automáticamente todas las llamadas</Text>
                  </div>
                  <Switch
                    checked={elevenlabs.autoRecord}
                    onChange={(e) => setElevenlabs({ 
                      ...elevenlabs, 
                      autoRecord: e.currentTarget.checked 
                    })}
                  />
                </Group>
              </Stack>
              
              <Group justify="flex-end" mt="lg">
                <Button variant="light">Probar Configuración</Button>
                <Button>Guardar Configuración</Button>
              </Group>
            </Stack>
          </Card>
        </Tabs.Panel>

        {/* Security Tab */}
        <Tabs.Panel value="security" pt="lg">
          <Stack gap="lg">
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Stack gap="md">
                <Title order={4}>Cambiar Contraseña</Title>
                
                <Stack gap="md">
                  <PasswordInput
                    label="Contraseña actual"
                    placeholder="Ingresa tu contraseña actual"
                  />
                  <PasswordInput
                    label="Nueva contraseña"
                    placeholder="Ingresa una nueva contraseña"
                  />
                  <PasswordInput
                    label="Confirmar contraseña"
                    placeholder="Confirma tu nueva contraseña"
                  />
                </Stack>
                
                <Group justify="flex-end">
                  <Button variant="light">Cancelar</Button>
                  <Button>Cambiar Contraseña</Button>
                </Group>
              </Stack>
            </Card>

            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Stack gap="md">
                <Title order={4}>Configuración de Seguridad</Title>
                
                <Stack gap="lg">
                  <Group justify="space-between">
                    <div>
                      <Text size="sm" fw={500}>Autenticación de dos factores</Text>
                      <Text size="xs" c="dimmed">Añade una capa extra de seguridad a tu cuenta</Text>
                    </div>
                    <Switch
                      checked={security.twoFactorAuth}
                      onChange={(e) => setSecurity({ 
                        ...security, 
                        twoFactorAuth: e.currentTarget.checked 
                      })}
                    />
                  </Group>
                  
                  <NumberInput
                    label="Tiempo de sesión (minutos)"
                    description="Tiempo antes de cerrar sesión automáticamente"
                    value={security.sessionTimeout}
                    onChange={(value) => setSecurity({ ...security, sessionTimeout: Number(value) })}
                    min={15}
                    max={480}
                  />
                  
                  <NumberInput
                    label="Expiración de contraseña (días)"
                    description="Días antes de requerir cambio de contraseña"
                    value={security.passwordExpiry}
                    onChange={(value) => setSecurity({ ...security, passwordExpiry: Number(value) })}
                    min={30}
                    max={365}
                  />
                </Stack>
                
                <Group justify="flex-end" mt="lg">
                  <Button variant="light">Cancelar</Button>
                  <Button>Guardar Configuración</Button>
                </Group>
              </Stack>
            </Card>
          </Stack>
        </Tabs.Panel>
      </Tabs>
    </Stack>
  );
}
