"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth/context";
import {
  AppShell,
  Text,
  Group,
  ActionIcon,
  ThemeIcon,
  Stack,
  NavLink,
  Button,
  Avatar,
  Menu,
  Divider,
  Badge,
} from "@mantine/core";
import {
  IconGitBranch,
  IconHome,
  IconFileText,
  IconCalendar,
  IconUsers,
  IconSettings,
  IconLogout,
  IconMenu2,
  IconX,
} from "@tabler/icons-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [opened, setOpened] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { profile, organization, isDemoMode, signOut } = useAuth();

  // No auth checks needed - always in demo mode

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  const navItems = [
    {
      label: "Panel Principal",
      icon: IconHome,
      href: "/dashboard",
      active: pathname === "/dashboard",
    },
    {
      label: "Procesos",
      icon: IconFileText,
      href: "/dashboard/procesos",
      active: pathname === "/dashboard/procesos",
    },
    {
      label: "Contactos",
      icon: IconUsers,
      href: "/dashboard/contactos",
      active: pathname === "/dashboard/contactos",
    },
    {
      label: "Programación",
      icon: IconCalendar,
      href: "/dashboard/programacion",
      active: pathname === "/dashboard/programacion",
    },
    {
      label: "Configuración",
      icon: IconSettings,
      href: "/dashboard/configuracion",
      active: pathname === "/dashboard/configuracion",
    },
  ];

  return (
    <AppShell
      navbar={{
        width: { base: 280, md: 300 },
        breakpoint: "sm",
        collapsed: { mobile: !opened },
      }}
      header={{ height: 60 }}
      padding={{ base: "sm", md: "md" }}
    >
      <AppShell.Header>
        <Group h="100%" px={{ base: "sm", md: "md" }} justify="space-between">
          <Group gap="sm">
            <ActionIcon
              variant="subtle"
              onClick={() => setOpened(!opened)}
              hiddenFrom="sm"
            >
              {opened ? <IconX size={18} /> : <IconMenu2 size={18} />}
            </ActionIcon>
            <Group gap="sm">
              <ThemeIcon size="lg" variant="gradient" gradient={{ from: 'blue', to: 'purple' }}>
                <IconGitBranch size={20} />
              </ThemeIcon>
              <Text size="lg" fw={700}>Panel CEA</Text>
              {isDemoMode && (
                <Badge color="orange" variant="light" size="sm">
                  DEMO
                </Badge>
              )}
            </Group>
          </Group>

          <Menu shadow="md" width={250}>
            <Menu.Target>
              <ActionIcon variant="subtle" size="lg">
                <Avatar size="sm" color="blue" src={profile?.avatar_url}>
                  {profile?.full_name?.charAt(0) || 'D'}
                </Avatar>
              </ActionIcon>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Label>
                <div>
                  <Text size="sm" fw={500}>{profile?.full_name || 'Usuario'}</Text>
                  <Text size="xs" c="dimmed">{profile?.email}</Text>
                  {organization && (
                    <Text size="xs" c="dimmed">{organization.name}</Text>
                  )}
                </div>
              </Menu.Label>
              <Menu.Divider />
              <Menu.Item 
                leftSection={<IconSettings size={14} />}
                onClick={() => router.push('/dashboard/configuracion')}
              >
                Configuración
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item
                leftSection={<IconLogout size={14} />}
                color="red"
                onClick={handleSignOut}
              >
                Cerrar Sesión
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <Stack gap="xs">
          <Text size="xs" tt="uppercase" fw={700} c="dimmed" mb="sm">
            Navegación
          </Text>
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              label={item.label}
              leftSection={<item.icon size={20} />}
              active={item.active}
              onClick={() => {
                router.push(item.href);
                setOpened(false);
              }}
              variant="filled"
            />
          ))}
        </Stack>

        <Divider my="md" />

        <Button
          variant="light"
          leftSection={<IconLogout size={16} />}
          onClick={() => router.push("/")}
          fullWidth
        >
          Volver al Inicio
        </Button>
      </AppShell.Navbar>

      <AppShell.Main>
        {children}
      </AppShell.Main>
    </AppShell>
  );
}