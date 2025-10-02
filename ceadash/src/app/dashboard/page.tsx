"use client";

import { Title, Text, Stack, SimpleGrid } from "@mantine/core";
import { useRouter } from "next/navigation";
import { notifications } from "@mantine/notifications";
import {
  IconGitBranch,
  IconCalendar,
  IconUsers,
  IconTrendingUp,
} from "@tabler/icons-react";

import { StatsCard } from "@/components/dashboard/stats-card";
import { ProcessEfficiencyChart } from "@/components/dashboard/process-efficiency-chart";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { QuickActions } from "@/components/dashboard/quick-actions";

export default function DashboardPage() {
  const router = useRouter();
  const stats = [
    {
      title: "Procesos Totales",
      value: "24",
      icon: IconGitBranch,
      color: "blue",
      change: "+12%",
    },
    {
      title: "Llamadas Programadas",
      value: "8",
      icon: IconCalendar,
      color: "green",
      change: "+5%",
    },
    {
      title: "Usuarios Activos",
      value: "156",
      icon: IconUsers,
      color: "purple",
      change: "+18%",
    },
    {
      title: "Ganancia de Eficiencia",
      value: "35%",
      icon: IconTrendingUp,
      color: "orange",
      change: "+8%",
    },
  ];

  const handleMapProcess = () => {
    router.push("/dashboard/procesos");
    notifications.show({
      title: "Navegando a Procesos",
      message: "Aquí puedes crear y mapear nuevos procesos",
      color: "blue",
    });
  };

  const handleScheduleCall = () => {
    router.push("/dashboard/programacion");
    notifications.show({
      title: "Navegando a Programación",
      message: "Programa una nueva llamada con ElevenLabs",
      color: "green",
    });
  };

  const handleViewDocs = () => {
    router.push("/dashboard/procesos");
    notifications.show({
      title: "Navegando a Documentación",
      message: "Revisa todos los procesos documentados",
      color: "purple",
    });
  };

  return (
    <Stack gap="xl">
      {/* Header */}
      <div>
        <Title order={1}>Panel Principal</Title>
        <Text c="dimmed">¡Bienvenido de vuelta! Aquí está lo que está pasando con tus procesos.</Text>
      </div>

      {/* Stats Grid */}
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing={{ base: "md", md: "lg" }}>
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </SimpleGrid>

      {/* Charts and Activity */}
      <SimpleGrid cols={{ base: 1, lg: 2 }} spacing={{ base: "md", md: "lg" }}>
        <ProcessEfficiencyChart />
        <RecentActivity />
      </SimpleGrid>

      {/* Quick Actions */}
      <QuickActions
        onMapProcess={handleMapProcess}
        onScheduleCall={handleScheduleCall}
        onViewDocs={handleViewDocs}
      />
    </Stack>
  );
}