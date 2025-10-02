"use client";

import { useState, useEffect } from "react";
import { Title, Text, Stack, SimpleGrid, Loader, Center } from "@mantine/core";
import { useRouter } from "next/navigation";
import { notifications } from "@mantine/notifications";
import {
  IconGitBranch,
  IconCalendar,
  IconUsers,
  IconTrendingUp,
} from "@tabler/icons-react";
import { useAuth } from "@/lib/auth/context";

import { StatsCard } from "@/components/dashboard/stats-card";
import { ProcessEfficiencyChart } from "@/components/dashboard/process-efficiency-chart";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { QuickActions } from "@/components/dashboard/quick-actions";

export default function DashboardPage() {
  const router = useRouter();
  const { profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProcesses: 0,
    scheduledCalls: 0,
    totalContacts: 0,
    avgEfficiency: 0,
  });

  useEffect(() => {
    if (profile?.organization_id) {
      console.log('📊 Loading dashboard stats for org:', profile.organization_id);
      loadStats();
    } else {
      console.log('⏳ Waiting for profile...', { profile });
      setLoading(false); // Don't get stuck if profile isn't loaded
    }
  }, [profile?.organization_id]);

  const loadStats = async () => {
    try {
      setLoading(true);
      
      const response = await fetch(`/api/dashboard-stats?organization_id=${profile?.organization_id}`);
      if (!response.ok) throw new Error('Failed to load stats');
      
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statsCards = [
    {
      title: "Procesos Totales",
      value: stats.totalProcesses.toString(),
      icon: IconGitBranch,
      color: "blue",
      change: "",
    },
    {
      title: "Llamadas Programadas",
      value: stats.scheduledCalls.toString(),
      icon: IconCalendar,
      color: "green",
      change: "",
    },
    {
      title: "Contactos Activos",
      value: stats.totalContacts.toString(),
      icon: IconUsers,
      color: "purple",
      change: "",
    },
    {
      title: "Eficiencia Promedio",
      value: `${stats.avgEfficiency}%`,
      icon: IconTrendingUp,
      color: "orange",
      change: "",
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

  if (loading) {
    return (
      <Center style={{ minHeight: '50vh' }}>
        <Stack align="center" gap="md">
          <Loader size="lg" />
          <Text c="dimmed">Cargando estadísticas...</Text>
        </Stack>
      </Center>
    );
  }

  return (
    <Stack gap="xl">
      {/* Header */}
      <div>
        <Title order={1}>Panel Principal</Title>
        <Text c="dimmed">¡Bienvenido de vuelta! Aquí está lo que está pasando con tus procesos.</Text>
      </div>

      {/* Stats Grid */}
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing={{ base: "md", md: "lg" }}>
        {statsCards.map((stat, index) => (
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