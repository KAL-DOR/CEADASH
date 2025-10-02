"use client";

import { useState } from 'react';
import {
  Paper,
  TextInput,
  PasswordInput,
  Button,
  Title,
  Text,
  Anchor,
  Stack,
  Alert,
  Tabs,
} from '@mantine/core';
import { IconAlertCircle, IconUser, IconMail } from '@tabler/icons-react';
import { useAuth } from '@/lib/auth/context';
import { notifications } from '@mantine/notifications';
import { useRouter } from 'next/navigation';

export function AuthForms() {
  const { signIn, signUp } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Login form state
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  // Register form state
  const [registerData, setRegisterData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    organizationName: '',
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await signIn(loginData.email, loginData.password);
      
      if (error) {
        setError(error.message);
      } else {
        notifications.show({
          title: '¡Bienvenido!',
          message: 'Has iniciado sesión exitosamente',
          color: 'green',
        });
        router.push('/dashboard');
      }
    } catch (err) {
      setError('Error inesperado al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate passwords match
    if (registerData.password !== registerData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    // Validate password strength
    if (registerData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      setLoading(false);
      return;
    }

    try {
      const { error } = await signUp(
        registerData.email,
        registerData.password,
        registerData.fullName,
        registerData.organizationName
      );
      
      if (error) {
        setError(error.message);
      } else {
        notifications.show({
          title: '¡Registro exitoso!',
          message: 'Revisa tu email para confirmar tu cuenta',
          color: 'green',
        });
        // Don't redirect yet, user needs to confirm email
      }
    } catch (err) {
      setError('Error inesperado al registrarse');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper radius="md" p="xl" withBorder>
      <Tabs defaultValue="login">
        <Tabs.List grow mb="md">
          <Tabs.Tab value="login">Iniciar Sesión</Tabs.Tab>
          <Tabs.Tab value="register">Registrarse</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="login">
          <form onSubmit={handleLogin}>
            <Stack gap="md">
              <Title order={2} ta="center">
                Iniciar Sesión
              </Title>
              <Text c="dimmed" size="sm" ta="center">
                Accede a tu dashboard de procesos
              </Text>

              {error && (
                <Alert icon={<IconAlertCircle size={16} />} color="red" variant="light">
                  {error}
                </Alert>
              )}

              <TextInput
                required
                label="Email"
                placeholder="tu@email.com"
                value={loginData.email}
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                leftSection={<IconMail size={16} />}
              />

              <PasswordInput
                required
                label="Contraseña"
                placeholder="Tu contraseña"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
              />

              <Button type="submit" fullWidth loading={loading}>
                Iniciar Sesión
              </Button>

              <Text ta="center" size="sm">
                ¿Olvidaste tu contraseña?{' '}
                <Anchor size="sm">
                  Recuperar contraseña
                </Anchor>
              </Text>
            </Stack>
          </form>
        </Tabs.Panel>

        <Tabs.Panel value="register">
          <form onSubmit={handleRegister}>
            <Stack gap="md">
              <Title order={2} ta="center">
                Crear Cuenta
              </Title>
              <Text c="dimmed" size="sm" ta="center">
                Crea tu organización y comienza a mapear procesos
              </Text>

              {error && (
                <Alert icon={<IconAlertCircle size={16} />} color="red" variant="light">
                  {error}
                </Alert>
              )}

              <TextInput
                required
                label="Nombre completo"
                placeholder="Juan Pérez"
                value={registerData.fullName}
                onChange={(e) => setRegisterData({ ...registerData, fullName: e.target.value })}
                leftSection={<IconUser size={16} />}
              />

              <TextInput
                required
                label="Nombre de la organización"
                placeholder="Mi Empresa S.L."
                value={registerData.organizationName}
                onChange={(e) => setRegisterData({ ...registerData, organizationName: e.target.value })}
              />

              <TextInput
                required
                label="Email"
                placeholder="tu@email.com"
                type="email"
                value={registerData.email}
                onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                leftSection={<IconMail size={16} />}
              />

              <PasswordInput
                required
                label="Contraseña"
                placeholder="Mínimo 6 caracteres"
                value={registerData.password}
                onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
              />

              <PasswordInput
                required
                label="Confirmar contraseña"
                placeholder="Repite tu contraseña"
                value={registerData.confirmPassword}
                onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
              />

              <Button type="submit" fullWidth loading={loading}>
                Crear Cuenta
              </Button>

              <Text ta="center" size="sm" c="dimmed">
                Al registrarte, aceptas nuestros términos de servicio y política de privacidad
              </Text>
            </Stack>
          </form>
        </Tabs.Panel>
      </Tabs>
    </Paper>
  );
}

