"use client";

import { useEffect, useState } from "react";
import { Card, Stack, Group, Title, Text, ThemeIcon, Paper, Badge, Loader, Center } from "@mantine/core";
import { IconClock, IconPhone, IconFileText, IconUsers, IconCheck, IconX } from "@tabler/icons-react";
import { useAuth } from "@/lib/auth/context";
import { createClient } from "@/lib/supabase/client";

interface Activity {
  id: string;
  activity_type: string;
  title: string;
  description: string | null;
  created_at: string;
  metadata: Record<string, unknown>;
}

export function RecentActivity() {
  const { profile } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile?.organization_id) {
      loadActivities();
      subscribeToActivities();
    }
  }, [profile?.organization_id]);

  const loadActivities = async () => {
    try {
      setLoading(true);
      const supabase = createClient();
      
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .eq('organization_id', profile?.organization_id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setActivities(data || []);
    } catch (error) {
      console.error('Error loading activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const subscribeToActivities = () => {
    const supabase = createClient();
    
    const channel = supabase
      .channel('activities_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'activities',
          filter: `organization_id=eq.${profile?.organization_id}`
        },
        (payload) => {
          console.log('New activity:', payload.new);
          setActivities(prev => [payload.new as Activity, ...prev].slice(0, 10));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'call_scheduled':
      case 'call_started':
        return <IconPhone size={16} />;
      case 'call_completed':
        return <IconCheck size={16} />;
      case 'call_cancelled':
        return <IconX size={16} />;
      case 'process_created':
      case 'process_updated':
      case 'transcription_ready':
        return <IconFileText size={16} />;
      case 'contact_added':
        return <IconUsers size={16} />;
      default:
        return <IconClock size={16} />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'call_completed':
        return 'green';
      case 'call_cancelled':
        return 'red';
      case 'call_started':
        return 'yellow';
      case 'call_scheduled':
        return 'blue';
      case 'process_created':
      case 'transcription_ready':
        return 'purple';
      default:
        return 'gray';
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return 'hace un momento';
    if (seconds < 3600) return `hace ${Math.floor(seconds / 60)} min`;
    if (seconds < 86400) return `hace ${Math.floor(seconds / 3600)} h`;
    if (seconds < 604800) return `hace ${Math.floor(seconds / 86400)} días`;
    return date.toLocaleDateString('es-ES');
  };

  if (loading) {
    return (
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Stack gap="md">
          <Group justify="space-between">
            <Title order={3}>Actividad Reciente</Title>
            <ThemeIcon variant="light" color="orange">
              <IconClock size={20} />
            </ThemeIcon>
          </Group>
          <Center py="xl">
            <Loader size="sm" />
          </Center>
        </Stack>
      </Card>
    );
  }

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Stack gap="md">
        <Group justify="space-between">
          <Title order={3}>Actividad Reciente</Title>
          <ThemeIcon variant="light" color="orange">
            <IconClock size={20} />
          </ThemeIcon>
        </Group>
        {activities.length === 0 ? (
          <Center py="xl">
            <Text c="dimmed" size="sm">No hay actividad reciente</Text>
          </Center>
        ) : (
          <Stack gap="md">
            {activities.map((activity) => (
              <Paper key={activity.id} p="sm" radius="sm" bg="gray.0">
                <Group gap="xs" wrap="nowrap">
                  <Badge 
                    color={getActivityColor(activity.activity_type)} 
                    variant="light" 
                    size="lg"
                    leftSection={getActivityIcon(activity.activity_type)}
                  />
                  <Stack gap="xs" style={{ flex: 1 }}>
                    <Text size="sm" fw={500}>
                      {activity.title}
                    </Text>
                    {activity.description && (
                      <Text size="xs" c="dimmed">
                        {activity.description}
                      </Text>
                    )}
                    <Text size="xs" c="dimmed">
                      {formatTimeAgo(activity.created_at)}
                    </Text>
                  </Stack>
                </Group>
              </Paper>
            ))}
          </Stack>
        )}
      </Stack>
    </Card>
  );
}
