import { Card, Stack, ThemeIcon, Badge, Title, Text, Flex } from "@mantine/core";
import { Icon } from "@tabler/icons-react";

interface StatsCardProps {
  title: string;
  value: string;
  icon: Icon;
  color: string;
  change: string;
}

export function StatsCard({ title, value, icon: IconComponent, color, change }: StatsCardProps) {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Stack gap="xs">
        <Flex justify="space-between" align="flex-start">
          <ThemeIcon size="lg" variant="light" color={color}>
            <IconComponent size={20} />
          </ThemeIcon>
          <Badge color={color} variant="light" size="sm">
            {change}
          </Badge>
        </Flex>
        <Title order={2} size="2rem">
          {value}
        </Title>
        <Text size="sm" c="dimmed">
          {title}
        </Text>
      </Stack>
    </Card>
  );
}
