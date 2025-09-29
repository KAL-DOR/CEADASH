"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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

export default function HomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleBypassAuth = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    router.push("/dashboard");
  };

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
            <Group>
              <ThemeIcon size="lg" variant="gradient" gradient={{ from: 'blue', to: 'purple' }}>
                <IconGitBranch size={20} />
              </ThemeIcon>
              <Title order={2} fw={700}>Panel CEA</Title>
            </Group>
            <Group>
              <Anchor c="dimmed" size="sm">Características</Anchor>
              <Anchor c="dimmed" size="sm">Precios</Anchor>
              <Anchor c="dimmed" size="sm">Documentación</Anchor>
              <Button
                leftSection={<IconPlayerPlay size={16} />}
                variant="gradient"
                gradient={{ from: 'blue', to: 'purple' }}
                onClick={handleBypassAuth}
                loading={loading}
              >
                Demo
              </Button>
            </Group>
          </Flex>
        </Container>
      </Paper>

      {/* Hero Section */}
      <Box style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }} py={80}>
        <Container size="xl">
          <SimpleGrid cols={{ base: 1, md: 2 }} spacing={50}>
            <Stack gap="xl">
              <Badge
                leftSection={<IconSparkles size={16} />}
                variant="light"
                color="white"
                size="lg"
              >
                AI-Powered Process Optimization
              </Badge>
              
              <Title order={1} size={48} fw={900} lh={1.2}>
                Transforma tus Flujos de Trabajo con IA
              </Title>
              
              <Text size="xl" c="gray.2">
                Convierte conversaciones de ElevenLabs en diagramas de procesos inteligentes. 
                Programa sin problemas, gestiona documentación y optimiza flujos de trabajo.
              </Text>
              
              <Group>
                <Button
                  size="lg"
                  variant="white"
                  color="dark"
                  rightSection={<IconArrowRight size={20} />}
                  onClick={handleBypassAuth}
                  loading={loading}
                >
                  Get Started
                </Button>
                <Button size="lg" variant="outline" color="white">
                  View Demo
                </Button>
              </Group>
              
              <Group gap="xl">
                <Group gap="xs">
                  <IconCheck size={16} color="#4ade80" />
                  <Text size="sm">No credit card required</Text>
                </Group>
                <Group gap="xs">
                  <IconCheck size={16} color="#4ade80" />
                  <Text size="sm">Free trial</Text>
                </Group>
                <Group gap="xs">
                  <IconStar size={16} color="#fbbf24" />
                  <Text size="sm">5-star rated</Text>
                </Group>
              </Group>
            </Stack>

            {/* Auth Card */}
            <Center>
              <Card shadow="xl" radius="md" p="xl" w={400} bg="white">
                <Stack gap="md">
                  <Title order={3} ta="center" c="dark">Welcome to CEA Dashboard</Title>
                  <Text ta="center" c="dimmed" size="sm">
                    Sign in to your account or create a new one
                  </Text>

                  <Tabs defaultValue="login">
                    <Tabs.List grow>
                      <Tabs.Tab value="login">Login</Tabs.Tab>
                      <Tabs.Tab value="register">Register</Tabs.Tab>
                    </Tabs.List>

                    <Tabs.Panel value="login" pt="md">
                      <Stack gap="md">
                        <TextInput
                          label="Email"
                          placeholder="your@email.com"
                          required
                        />
                        <PasswordInput
                          label="Password"
                          placeholder="Your password"
                          required
                        />
                        <Button fullWidth variant="gradient" gradient={{ from: 'blue', to: 'purple' }}>
                          Sign In
                        </Button>
                      </Stack>
                    </Tabs.Panel>

                    <Tabs.Panel value="register" pt="md">
                      <Stack gap="md">
                        <SimpleGrid cols={2}>
                          <TextInput label="First name" placeholder="John" />
                          <TextInput label="Last name" placeholder="Doe" />
                        </SimpleGrid>
                        <TextInput label="Email" placeholder="your@email.com" />
                        <TextInput label="Company" placeholder="Acme Inc." />
                        <PasswordInput label="Password" placeholder="Create password" />
                        <Button fullWidth variant="gradient" gradient={{ from: 'blue', to: 'purple' }}>
                          Create Account
                        </Button>
                      </Stack>
                    </Tabs.Panel>
                  </Tabs>

                  <Divider label="Or continue with" labelPosition="center" />

                  <Button
                    variant="outline"
                    leftSection={<IconBolt size={16} />}
                    onClick={handleBypassAuth}
                    loading={loading}
                    fullWidth
                  >
                    {loading ? "Entering Demo..." : "Try Demo Mode"}
                  </Button>
                  
                  <Text ta="center" size="xs" c="dimmed">
                    No registration required • Full feature access
                  </Text>
                </Stack>
              </Card>
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