-- ============================================
-- FIX RLS POLICIES AND SEED DATA FOR DEMO
-- Run this in Supabase SQL Editor
-- ============================================

-- Drop all existing policies to start fresh
DROP POLICY IF EXISTS "anon can manage demo contacts" ON public.contacts;
DROP POLICY IF EXISTS "Users can manage contacts in their organization" ON public.contacts;
DROP POLICY IF EXISTS "anon can manage demo processes" ON public.processes;
DROP POLICY IF EXISTS "anon can manage demo scheduled_calls" ON public.scheduled_calls;
DROP POLICY IF EXISTS "anon can manage demo transcriptions" ON public.transcriptions;
DROP POLICY IF EXISTS "anon can manage demo activities" ON public.activities;
DROP POLICY IF EXISTS "anon can read demo profiles" ON public.profiles;
DROP POLICY IF EXISTS "anon can read demo organization" ON public.organizations;

-- Grant permissions to anon role
GRANT ALL ON public.contacts TO anon;
GRANT ALL ON public.processes TO anon;
GRANT ALL ON public.scheduled_calls TO anon;
GRANT ALL ON public.transcriptions TO anon;
GRANT ALL ON public.activities TO anon;
GRANT ALL ON public.profiles TO anon;
GRANT ALL ON public.organizations TO anon;

-- Create new policies for demo organization
-- Contacts: Allow anon full access to demo contacts
CREATE POLICY "anon can manage demo contacts"
  ON public.contacts
  FOR ALL
  TO anon
  USING (organization_id = '00000000-0000-0000-0000-000000000001')
  WITH CHECK (organization_id = '00000000-0000-0000-0000-000000000001');

-- Processes: Allow anon full access to demo processes
CREATE POLICY "anon can manage demo processes"
  ON public.processes
  FOR ALL
  TO anon
  USING (organization_id = '00000000-0000-0000-0000-000000000001')
  WITH CHECK (organization_id = '00000000-0000-0000-0000-000000000001');

-- Scheduled calls: Allow anon full access to demo scheduled calls
CREATE POLICY "anon can manage demo scheduled_calls"
  ON public.scheduled_calls
  FOR ALL
  TO anon
  USING (organization_id = '00000000-0000-0000-0000-000000000001')
  WITH CHECK (organization_id = '00000000-0000-0000-0000-000000000001');

-- Transcriptions: Allow anon full access to demo transcriptions
CREATE POLICY "anon can manage demo transcriptions"
  ON public.transcriptions
  FOR ALL
  TO anon
  USING (organization_id = '00000000-0000-0000-0000-000000000001')
  WITH CHECK (organization_id = '00000000-0000-0000-0000-000000000001');

-- Activities: Allow anon full access to demo activities
CREATE POLICY "anon can manage demo activities"
  ON public.activities
  FOR ALL
  TO anon
  USING (organization_id = '00000000-0000-0000-0000-000000000001')
  WITH CHECK (organization_id = '00000000-0000-0000-0000-000000000001');

-- Profiles: Allow anon to read demo profiles
CREATE POLICY "anon can read demo profiles"
  ON public.profiles
  FOR SELECT
  TO anon
  USING (organization_id = '00000000-0000-0000-0000-000000000001');

-- Organizations: Allow anon to read demo org
CREATE POLICY "anon can read demo organization"
  ON public.organizations
  FOR SELECT
  TO anon
  USING (id = '00000000-0000-0000-0000-000000000001');

-- First ensure the demo organization exists
INSERT INTO organizations (id, name, slug, settings)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Demo Organization',
  'demo-org',
  '{"industry": "technology", "size": "medium"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  settings = EXCLUDED.settings;

-- Then ensure the demo user profile exists
INSERT INTO profiles (id, organization_id, email, full_name, role)
VALUES (
  '00000000-0000-0000-0000-000000000002',
  '00000000-0000-0000-0000-000000000001',
  'demo@ceadash.com',
  'Usuario Demo',
  'admin'
)
ON CONFLICT (id) DO UPDATE SET
  organization_id = EXCLUDED.organization_id,
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role;

-- Now create/update the contacts
INSERT INTO contacts (id, organization_id, name, email, phone, company, status, notes, created_by) VALUES
  ('872c0b47-92ef-47f9-9ad6-359479287754', '00000000-0000-0000-0000-000000000001', 'please', 'work@gmail.com', '+34 612 345 678', 'Test Company', 'active', 'Test contact', '00000000-0000-0000-0000-000000000002'),
  ('955a215c-9ca4-4031-b0f2-84bc0e3b8368', '00000000-0000-0000-0000-000000000001', 'Eduardo del Castillo', 'edc@provivienda.mx', '+34 623 456 789', 'Provivienda', 'active', 'Real contact', '00000000-0000-0000-0000-000000000002'),
  ('e9695c56-7333-4d5a-9452-c46499fd6a5a', '00000000-0000-0000-0000-000000000001', 'nico', 'nktekns@gmail.com', '+34 634 567 890', 'Tech Startup', 'active', 'Another contact', '00000000-0000-0000-0000-000000000002')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  company = EXCLUDED.company,
  status = EXCLUDED.status,
  notes = EXCLUDED.notes;

-- Test the policy works
SELECT 'Testing anon access to contacts...' as test;
SET ROLE anon;
SELECT COUNT(*) as contact_count FROM contacts WHERE organization_id = '00000000-0000-0000-0000-000000000001';
RESET ROLE;

SELECT 'Done! You should see 3 contacts above.' as result;

