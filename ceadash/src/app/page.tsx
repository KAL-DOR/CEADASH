"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/context";
import {
  Container,
  Title,
  Text,
  Button,
  Group,
  Stack,
  Card,
  SimpleGrid,
  Badge,
  Anchor,
  Paper,
  TextInput,
  PasswordInput,
  Tabs,
  Center,
  Box,
  ThemeIcon,
  List,
  Divider,
  Flex,
} from "@mantine/core";
import {
  IconRocket,
  IconBrain,
  IconCalendar,
  IconUsers,
  IconChartBar,
  IconGitBranch,
  IconSparkles,
  IconCheck,
  IconStar,
  IconArrowRight,
  IconBolt,
  IconPlayerPlay,
} from "@tabler/icons-react";
import { AuthForms } from "@/components/auth/auth-forms";

export default function HomePage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleBypassAuth = async () => {
    setLoading(true);
    
    // Set demo mode cookie
    document.cookie = 'demo-mode=true; max-age=86400; path=/'; // 24 hours
    
    // Small delay for UX
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Navigate to dashboard with demo parameter
    router.push("/dashboard?demo=true");
  };

  // Redirect if user is already authenticated
  if (user && !authLoading) {
    router.push("/dashboard");
    return null;
  }

  // Show loading while checking auth
  if (authLoading) {
    return (
      <Container size="xl" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Text>Cargando...</Text>
      </Container>
    );
  }

  const features = [
    {
      icon: IconBrain,
      title: "AI Process Mapping",
      description: "Transform conversations into intelligent flowcharts automatically",
      color: "blue",
    },
    {
      icon: IconCalendar,
      title: "Smart Scheduling",
      description: "Automated booking with email notifications and reminders",
      color: "green",
    },
    {
      icon: IconUsers,
      title: "Multi-tenant Support",
      description: "Enterprise-grade security with organization isolation",
      color: "purple",
    },
    {
      icon: IconChartBar,
      title: "Advanced Analytics",
      description: "Deep insights into process efficiency and optimization",
      color: "orange",
    },
  ];

  return (
    <Box>
      {/* Header */}
      <Paper shadow="sm" p="md" mb={0} style={{ borderBottom: '1px solid #e9ecef' }}>
        <Container size="xl">
          <Flex justify="space-between" align="center">
            <Group gap="sm">
              <ThemeIcon size="lg" variant="gradient" gradient={{ from: 'blue', to: 'purple' }}>
                <IconGitBranch size={20} />
              </ThemeIcon>
              <Title order={2} fw={700} size="xl">Panel CEA</Title>
            </Group>
            <Group gap="xs" visibleFrom="sm">
              <Anchor c="dimmed" size="sm">Características</Anchor>
              <Anchor c="dimmed" size="sm">Precios</Anchor>
              <Anchor c="dimmed" size="sm">Documentación</Anchor>
            </Group>
            <Button
              leftSection={<IconPlayerPlay size={16} />}
              variant="gradient"
              gradient={{ from: 'blue', to: 'purple' }}
              onClick={handleBypassAuth}
              loading={loading}
              size="md"
            >
              Demo
            </Button>
          </Flex>
        </Container>
      </Paper>

      {/* Hero Section */}
      <Box style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }} py={{ base: 40, md: 80 }}>
        <Container size="xl">
          <SimpleGrid cols={{ base: 1, md: 2 }} spacing={{ base: 30, md: 50 }}>
            <Stack gap="xl">
              <Badge
                leftSection={<IconSparkles size={16} />}
                variant="light"
                color="white"
                size="lg"
              >
                Optimización de Procesos con IA
              </Badge>
              
              <Title order={1} size="h1" fw={900} lh={1.2}>
                Transforma tus Flujos de Trabajo con IA
              </Title>
              
              <Text size="xl" c="gray.2">
                Convierte conversaciones de ElevenLabs en diagramas de procesos inteligentes.
                Programa sin problemas, gestiona documentación y optimiza flujos de trabajo.
              </Text>
              
              <Group gap="md">
                <Button
                  size="lg"
                  variant="white"
                  color="dark"
                  rightSection={<IconArrowRight size={20} />}
                  onClick={handleBypassAuth}
                  loading={loading}
                  style={{ flexGrow: 1 }}
                  hiddenFrom="sm"
                >
                  {loading ? "Entrando al Demo..." : "Empezar Ahora"}
                </Button>
                <Button
                  size="lg"
                  variant="white"
                  color="dark"
                  rightSection={<IconArrowRight size={20} />}
                  onClick={handleBypassAuth}
                  loading={loading}
                  visibleFrom="sm"
                >
                  {loading ? "Entrando al Demo..." : "Empezar Ahora"}
                </Button>
                <Button 
                  size="lg"
                  variant="outline" 
                  color="white"
                  style={{ flexGrow: 1 }}
                  hiddenFrom="sm"
                >
                  Saber Más
                </Button>
                <Button 
                  size="lg"
                  variant="outline" 
                  color="white"
                  visibleFrom="sm"
                >
                  Saber Más
                </Button>
              </Group>
              
              <Stack gap="xs" hiddenFrom="sm">
                <Group gap="xs">
                  <IconCheck size={16} color="#4ade80" />
                  <Text size="sm">Sin tarjeta de crédito</Text>
                </Group>
                <Group gap="xs">
                  <IconCheck size={16} color="#4ade80" />
                  <Text size="sm">Prueba gratuita</Text>
                </Group>
                <Group gap="xs">
                  <IconStar size={16} color="#fbbf24" />
                  <Text size="sm">5 estrellas</Text>
                </Group>
              </Stack>
              
              <Group gap="xl" visibleFrom="sm">
                <Group gap="xs">
                  <IconCheck size={16} color="#4ade80" />
                  <Text size="sm">Sin tarjeta de crédito</Text>
                </Group>
                <Group gap="xs">
                  <IconCheck size={16} color="#4ade80" />
                  <Text size="sm">Prueba gratuita</Text>
                </Group>
                <Group gap="xs">
                  <IconStar size={16} color="#fbbf24" />
                  <Text size="sm">5 estrellas</Text>
                </Group>
              </Group>
            </Stack>

            {/* Auth Forms */}
            <Center>
              <div style={{ width: '100%', maxWidth: 400 }}>
                <AuthForms />
                
                <Divider label="O continúa con" labelPosition="center" my="md" />

                <Button
                  variant="outline"
                  leftSection={<IconBolt size={16} />}
                  onClick={handleBypassAuth}
                  loading={loading}
                  fullWidth
                  size="lg"
                >
                  {loading ? "Entrando al Demo..." : "Probar Modo Demo"}
                </Button>
                
                <Text ta="center" size="xs" c="dimmed" mt="sm">
                  Sin registro requerido • Acceso completo a funcionalidades
                </Text>
              </div>
            </Center>
          </SimpleGrid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container size="xl" py={80}>
        <Stack gap="xl" align="center" mb={60}>
          <Title order={2} ta="center" size={36}>
            Everything you need to optimize processes
          </Title>
          <Text ta="center" size="lg" c="dimmed" maw={600}>
            Powerful features to streamline your workflow management and boost productivity.
          </Text>
        </Stack>

        <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="xl">
          {features.map((feature, index) => (
            <Card key={index} shadow="sm" padding="lg" radius="md" withBorder>
              <Stack gap="md">
                <ThemeIcon size="xl" variant="light" color={feature.color}>
                  <feature.icon size={24} />
                </ThemeIcon>
                <Title order={4}>{feature.title}</Title>
                <Text size="sm" c="dimmed">
                  {feature.description}
                </Text>
              </Stack>
            </Card>
          ))}
        </SimpleGrid>

        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl" mt={60}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Stack gap="sm">
              <Title order={5} c="green">Process Efficiency</Title>
              <Title order={1} c="green">+35%</Title>
              <Text size="sm" c="dimmed">
                Average improvement in workflow efficiency
              </Text>
            </Stack>
          </Card>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Stack gap="sm">
              <Title order={5} c="blue">Time Saved</Title>
              <Title order={1} c="blue">12hrs</Title>
              <Text size="sm" c="dimmed">
                Per week saved on process documentation
              </Text>
            </Stack>
          </Card>
        </SimpleGrid>
      </Container>

      {/* CTA Section */}
      <Box style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }} py={80}>
        <Container size="xl">
          <Stack gap="xl" align="center">
            <Title order={2} ta="center" size={36}>
              Ready to transform your processes?
            </Title>
            <Text ta="center" size="lg" c="gray.2" maw={600}>
              Start optimizing your workflows today with our AI-powered platform.
            </Text>
            <Group>
              <Button
                size="lg"
                variant="white"
                color="dark"
                onClick={handleBypassAuth}
                loading={loading}
              >
                Start Free Trial
              </Button>
              <Button size="lg" variant="outline" color="white">
                Schedule Demo
              </Button>
            </Group>
          </Stack>
        </Container>
      </Box>

      {/* Footer */}
      <Paper p="md" style={{ borderTop: '1px solid #e9ecef' }}>
        <Container size="xl">
          <Flex justify="space-between" align="center">
            <Text size="sm" c="dimmed">
              © 2024 CEA Dashboard. All rights reserved.
            </Text>
            <Group>
              <Anchor size="sm" c="dimmed">Terms of Service</Anchor>
              <Anchor size="sm" c="dimmed">Privacy</Anchor>
            </Group>
          </Flex>
        </Container>
      </Paper>
    </Box>
  );
}