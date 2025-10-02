-- Seed data for demo/testing
-- This creates sample data for the demo organization

-- Note: This assumes the demo organization already exists from initial schema
-- If it doesn't exist, create it first
INSERT INTO organizations (id, name, slug, settings)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Demo Organization',
  'demo-org',
  '{"industry": "technology", "size": "medium"}'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  settings = EXCLUDED.settings;

-- Create demo user profile (this would normally be created by auth trigger)
-- You'll need to replace this with an actual auth.users ID after signup
-- For now, we'll use a placeholder that you can update
DO $$
DECLARE
  demo_org_id UUID := '00000000-0000-0000-0000-000000000001';
  demo_user_id UUID := '00000000-0000-0000-0000-000000000002';
BEGIN
  -- Insert demo user profile if it doesn't exist
  INSERT INTO profiles (id, organization_id, email, full_name, role)
  VALUES (
    demo_user_id,
    demo_org_id,
    'demo@ceadash.com',
    'Usuario Demo',
    'admin'
  )
  ON CONFLICT (id) DO NOTHING;
END $$;

-- Seed Contacts
INSERT INTO contacts (organization_id, name, email, phone, company, status, notes, created_by) VALUES
  ('00000000-0000-0000-0000-000000000001', 'María García López', 'maria.garcia@techcorp.com', '+34 612 345 678', 'TechCorp', 'active', 'Directora de Operaciones en TechCorp. Interesada en optimizar proceso de ventas.', '00000000-0000-0000-0000-000000000002'),
  ('00000000-0000-0000-0000-000000000001', 'Carlos Rodríguez Pérez', 'carlos.rodriguez@startupxyz.com', '+34 623 456 789', 'StartupXYZ', 'active', 'CEO de StartupXYZ. Busca mejorar proceso de onboarding de clientes.', '00000000-0000-0000-0000-000000000002'),
  ('00000000-0000-0000-0000-000000000001', 'Ana Martínez Silva', 'ana.martinez@consultoria.es', '+34 634 567 890', 'Consultoría Empresarial', 'active', 'Consultora especializada en procesos. Quiere documentar proceso de atención al cliente.', '00000000-0000-0000-0000-000000000002'),
  ('00000000-0000-0000-0000-000000000001', 'Juan López Torres', 'juan.lopez@fabricasa.com', '+34 645 678 901', 'FabricaSA', 'active', 'Director de Producción en FabricaSA. Necesita optimizar proceso de manufactura.', '00000000-0000-0000-0000-000000000002'),
  ('00000000-0000-0000-0000-000000000001', 'Laura Sánchez Ruiz', 'laura.sanchez@logisticapro.com', '+34 656 789 012', 'LogisticaPro', 'active', 'Gerente de Logística. Interesada en mapear proceso de distribución.', '00000000-0000-0000-0000-000000000002'),
  ('00000000-0000-0000-0000-000000000001', 'Pedro Fernández Gómez', 'pedro.fernandez@retailplus.com', '+34 667 890 123', 'RetailPlus', 'inactive', 'Ex-cliente. Proceso completado satisfactoriamente.', '00000000-0000-0000-0000-000000000002');

-- Seed Processes
INSERT INTO processes (organization_id, name, description, status, efficiency_score, created_by) VALUES
  ('00000000-0000-0000-0000-000000000001', 
   'Incorporación de Nuevos Empleados', 
   'Proceso completo desde la contratación hasta la integración del empleado en el equipo. Incluye documentación, capacitación inicial, asignación de equipos y mentoring.',
   'active',
   85,
   '00000000-0000-0000-0000-000000000002'),
  
  ('00000000-0000-0000-0000-000000000001',
   'Proceso de Ventas B2B',
   'Flujo de trabajo para la gestión de leads empresariales, desde el primer contacto hasta el cierre de venta. Incluye calificación, propuesta, negociación y seguimiento.',
   'active',
   72,
   '00000000-0000-0000-0000-000000000002'),
  
  ('00000000-0000-0000-0000-000000000001',
   'Atención al Cliente - Soporte Técnico',
   'Protocolo para la resolución de incidencias técnicas. Incluye recepción de ticket, diagnóstico, escalamiento, resolución y seguimiento de satisfacción.',
   'active',
   91,
   '00000000-0000-0000-0000-000000000002'),
  
  ('00000000-0000-0000-0000-000000000001',
   'Gestión de Inventario',
   'Control de stock, pedidos a proveedores y distribución de productos. Incluye alertas de stock mínimo, gestión de pedidos y coordinación con almacén.',
   'draft',
   0,
   '00000000-0000-0000-0000-000000000002'),
  
  ('00000000-0000-0000-0000-000000000001',
   'Proceso de Facturación',
   'Generación, envío y seguimiento de facturas a clientes. Incluye validación de datos, generación de documentos, envío y seguimiento de cobros.',
   'active',
   78,
   '00000000-0000-0000-0000-000000000002'),
  
  ('00000000-0000-0000-0000-000000000001',
   'Onboarding de Clientes B2C',
   'Proceso de incorporación de nuevos clientes individuales. Incluye registro, verificación, configuración inicial y capacitación básica.',
   'active',
   82,
   '00000000-0000-0000-0000-000000000002'),
  
  ('00000000-0000-0000-0000-000000000001',
   'Control de Calidad en Producción',
   'Inspección y validación de productos durante el proceso de manufactura. Incluye checkpoints, pruebas y documentación de resultados.',
   'archived',
   88,
   '00000000-0000-0000-0000-000000000002');

-- Seed Scheduled Calls
INSERT INTO scheduled_calls (organization_id, contact_id, scheduled_date, status, duration_minutes, notes, email_sent, created_by) VALUES
  ('00000000-0000-0000-0000-000000000001',
   (SELECT id FROM contacts WHERE email = 'maria.garcia@techcorp.com'),
   NOW() + INTERVAL '2 days',
   'scheduled',
   30,
   'Primera sesión para mapeo de proceso de ventas',
   true,
   '00000000-0000-0000-0000-000000000002'),
  
  ('00000000-0000-0000-0000-000000000001',
   (SELECT id FROM contacts WHERE email = 'carlos.rodriguez@startupxyz.com'),
   NOW() + INTERVAL '5 days',
   'scheduled',
   45,
   'Análisis detallado del proceso de onboarding actual',
   true,
   '00000000-0000-0000-0000-000000000002'),
  
  ('00000000-0000-0000-0000-000000000001',
   (SELECT id FROM contacts WHERE email = 'ana.martinez@consultoria.es'),
   NOW() - INTERVAL '3 days',
   'completed',
   38,
   'Sesión completada exitosamente. Transcripción disponible.',
   true,
   '00000000-0000-0000-0000-000000000002'),
  
  ('00000000-0000-0000-0000-000000000001',
   (SELECT id FROM contacts WHERE email = 'juan.lopez@fabricasa.com'),
   NOW() - INTERVAL '1 day',
   'completed',
   52,
   'Excelente sesión. Cliente muy participativo.',
   true,
   '00000000-0000-0000-0000-000000000002'),
  
  ('00000000-0000-0000-0000-000000000001',
   (SELECT id FROM contacts WHERE email = 'laura.sanchez@logisticapro.com'),
   NOW() + INTERVAL '7 days',
   'scheduled',
   40,
   'Enfoque en cuellos de botella de distribución',
   false,
   '00000000-0000-0000-0000-000000000002');

-- Seed Transcriptions
INSERT INTO transcriptions (organization_id, content, processed, metadata) VALUES
  ('00000000-0000-0000-0000-000000000001',
   'En nuestra empresa, el proceso de atención al cliente comienza cuando recibimos una solicitud por email o teléfono. Primero, el agente valida los datos del cliente y crea un ticket en el sistema. Luego, clasifica la incidencia según su tipo: técnica, comercial o administrativa. Si es técnica, se asigna al equipo de soporte. El equipo diagnostica el problema y si es simple, lo resuelve directamente. Si es complejo, lo escala al nivel 2. Una vez resuelto, se notifica al cliente y se cierra el ticket. Finalmente, enviamos una encuesta de satisfacción.',
   false,
   '{"duration": 38, "language": "es", "contact": "Ana Martínez"}'::jsonb),
  
  ('00000000-0000-0000-0000-000000000001',
   'El proceso de producción en nuestra fábrica tiene varios pasos críticos. Primero, recibimos las materias primas y las almacenamos. Cada mañana, el jefe de producción revisa los pedidos y asigna las órdenes de trabajo. Los operarios preparan las máquinas y comienzan la producción. Cada 2 horas hay un control de calidad donde se revisan muestras. Si hay defectos, se detiene la línea y se corrige. Al final del día, los productos terminados pasan por inspección final antes de ir al almacén. El problema es que a veces hay retrasos entre el control de calidad y la corrección de defectos.',
   false,
   '{"duration": 52, "language": "es", "contact": "Juan López"}'::jsonb);

-- Seed Activities
INSERT INTO activities (organization_id, user_id, activity_type, title, description, metadata) VALUES
  ('00000000-0000-0000-0000-000000000001',
   '00000000-0000-0000-0000-000000000002',
   'process_created',
   'Proceso creado: Atención al Cliente - Soporte Técnico',
   'Protocolo para la resolución de incidencias técnicas',
   '{"process_name": "Atención al Cliente - Soporte Técnico"}'::jsonb),
  
  ('00000000-0000-0000-0000-000000000001',
   '00000000-0000-0000-0000-000000000002',
   'contact_added',
   'Contacto agregado: María García López',
   'maria.garcia@techcorp.com',
   '{"contact_name": "María García López"}'::jsonb),
  
  ('00000000-0000-0000-0000-000000000001',
   '00000000-0000-0000-0000-000000000002',
   'call_scheduled',
   'Llamada programada con María García López',
   'ventas - ' || TO_CHAR(NOW() + INTERVAL '2 days', 'DD/MM/YYYY'),
   '{"contact_name": "María García López", "process_type": "ventas"}'::jsonb),
  
  ('00000000-0000-0000-0000-000000000001',
   '00000000-0000-0000-0000-000000000002',
   'call_completed',
   'Llamada completada con Ana Martínez Silva',
   'Duración: 38 minutos',
   '{"contact_name": "Ana Martínez Silva", "duration_minutes": 38}'::jsonb),
  
  ('00000000-0000-0000-0000-000000000001',
   '00000000-0000-0000-0000-000000000002',
   'transcription_ready',
   'Transcripción lista para Ana Martínez Silva',
   'La transcripción de la llamada está disponible para análisis',
   '{"contact_name": "Ana Martínez Silva"}'::jsonb),
  
  ('00000000-0000-0000-0000-000000000001',
   '00000000-0000-0000-0000-000000000002',
   'call_completed',
   'Llamada completada con Juan López Torres',
   'Duración: 52 minutos',
   '{"contact_name": "Juan López Torres", "duration_minutes": 52}'::jsonb),
  
  ('00000000-0000-0000-0000-000000000001',
   '00000000-0000-0000-0000-000000000002',
   'process_created',
   'Proceso creado: Proceso de Ventas B2B',
   'Flujo de trabajo para la gestión de leads empresariales',
   '{"process_name": "Proceso de Ventas B2B"}'::jsonb),
  
  ('00000000-0000-0000-0000-000000000001',
   '00000000-0000-0000-0000-000000000002',
   'contact_added',
   'Contacto agregado: Carlos Rodríguez Pérez',
   'carlos.rodriguez@startupxyz.com',
   '{"contact_name": "Carlos Rodríguez Pérez"}'::jsonb);

-- Update activity timestamps to be more realistic (spread over time)
UPDATE activities SET created_at = NOW() - INTERVAL '5 days' WHERE title LIKE '%Atención al Cliente%';
UPDATE activities SET created_at = NOW() - INTERVAL '4 days' WHERE title LIKE '%María García López%' AND activity_type = 'contact_added';
UPDATE activities SET created_at = NOW() - INTERVAL '3 days' WHERE title LIKE '%Ana Martínez%';
UPDATE activities SET created_at = NOW() - INTERVAL '2 days' WHERE title LIKE '%Juan López%';
UPDATE activities SET created_at = NOW() - INTERVAL '1 day' WHERE title LIKE '%Proceso de Ventas B2B%';
UPDATE activities SET created_at = NOW() - INTERVAL '12 hours' WHERE title LIKE '%Carlos Rodríguez%' AND activity_type = 'contact_added';

-- Update process timestamps
UPDATE processes SET created_at = NOW() - INTERVAL '10 days', updated_at = NOW() - INTERVAL '5 days' WHERE name LIKE '%Atención al Cliente%';
UPDATE processes SET created_at = NOW() - INTERVAL '8 days', updated_at = NOW() - INTERVAL '3 days' WHERE name LIKE '%Ventas B2B%';
UPDATE processes SET created_at = NOW() - INTERVAL '12 days', updated_at = NOW() - INTERVAL '12 days' WHERE name LIKE '%Control de Calidad%';

-- Update contact timestamps
UPDATE contacts SET created_at = NOW() - INTERVAL '15 days' WHERE name LIKE '%María García%';
UPDATE contacts SET created_at = NOW() - INTERVAL '12 days' WHERE name LIKE '%Carlos Rodríguez%';
UPDATE contacts SET created_at = NOW() - INTERVAL '20 days' WHERE name LIKE '%Pedro Fernández%';

COMMIT;

