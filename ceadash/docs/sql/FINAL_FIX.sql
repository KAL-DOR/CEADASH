-- ===================================
-- FINAL COMPREHENSIVE FIX FOR DEMO MODE
-- Run this entire script in Supabase SQL Editor
-- ===================================

-- Step 1: Verify demo org exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.organizations WHERE id = '00000000-0000-0000-0000-000000000001') THEN
    INSERT INTO public.organizations (id, name, slug, settings)
    VALUES (
      '00000000-0000-0000-0000-000000000001',
      'Demo Organization',
      'demo-org',
      '{}'::jsonb
    );
  END IF;
END $$;

-- Step 2: Verify demo profile exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = '00000000-0000-0000-0000-000000000002') THEN
    INSERT INTO public.profiles (id, organization_id, email, full_name, role)
    VALUES (
      '00000000-0000-0000-0000-000000000002',
      '00000000-0000-0000-0000-000000000001',
      'demo@ceadash.com',
      'Usuario Demo',
      'admin'
    );
  END IF;
END $$;

-- Step 3: Drop ALL existing anon policies to avoid conflicts
DROP POLICY IF EXISTS "anon can read demo profiles" ON public.profiles;
DROP POLICY IF EXISTS "anon can manage demo contacts" ON public.contacts;
DROP POLICY IF EXISTS "anon can manage demo processes" ON public.processes;
DROP POLICY IF EXISTS "anon can manage demo scheduled_calls" ON public.scheduled_calls;
DROP POLICY IF EXISTS "anon can manage demo transcriptions" ON public.transcriptions;
DROP POLICY IF EXISTS "anon can manage demo activities" ON public.activities;
DROP POLICY IF EXISTS "anon can read demo organization" ON public.organizations;

-- Step 4: Grant permissions to anon role
GRANT USAGE ON SCHEMA public TO anon;
GRANT SELECT ON public.organizations TO anon;
GRANT SELECT ON public.profiles TO anon;
GRANT ALL ON public.contacts TO anon;
GRANT ALL ON public.processes TO anon;
GRANT ALL ON public.scheduled_calls TO anon;
GRANT ALL ON public.transcriptions TO anon;
GRANT ALL ON public.activities TO anon;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon;

-- Step 5: Create simple anon policies for demo org
-- Organizations
CREATE POLICY "anon_read_demo_org"
  ON public.organizations
  FOR SELECT
  TO anon
  USING (id = '00000000-0000-0000-0000-000000000001');

-- Profiles
CREATE POLICY "anon_read_demo_profiles"
  ON public.profiles
  FOR SELECT
  TO anon
  USING (organization_id = '00000000-0000-0000-0000-000000000001');

-- Contacts - FULL ACCESS
CREATE POLICY "anon_select_demo_contacts"
  ON public.contacts
  FOR SELECT
  TO anon
  USING (organization_id = '00000000-0000-0000-0000-000000000001');

CREATE POLICY "anon_insert_demo_contacts"
  ON public.contacts
  FOR INSERT
  TO anon
  WITH CHECK (organization_id = '00000000-0000-0000-0000-000000000001');

CREATE POLICY "anon_update_demo_contacts"
  ON public.contacts
  FOR UPDATE
  TO anon
  USING (organization_id = '00000000-0000-0000-0000-000000000001')
  WITH CHECK (organization_id = '00000000-0000-0000-0000-000000000001');

CREATE POLICY "anon_delete_demo_contacts"
  ON public.contacts
  FOR DELETE
  TO anon
  USING (organization_id = '00000000-0000-0000-0000-000000000001');

-- Processes - FULL ACCESS
CREATE POLICY "anon_select_demo_processes"
  ON public.processes
  FOR SELECT
  TO anon
  USING (organization_id = '00000000-0000-0000-0000-000000000001');

CREATE POLICY "anon_insert_demo_processes"
  ON public.processes
  FOR INSERT
  TO anon
  WITH CHECK (organization_id = '00000000-0000-0000-0000-000000000001');

CREATE POLICY "anon_update_demo_processes"
  ON public.processes
  FOR UPDATE
  TO anon
  USING (organization_id = '00000000-0000-0000-0000-000000000001')
  WITH CHECK (organization_id = '00000000-0000-0000-0000-000000000001');

CREATE POLICY "anon_delete_demo_processes"
  ON public.processes
  FOR DELETE
  TO anon
  USING (organization_id = '00000000-0000-0000-0000-000000000001');

-- Scheduled calls - FULL ACCESS
CREATE POLICY "anon_select_demo_calls"
  ON public.scheduled_calls
  FOR SELECT
  TO anon
  USING (organization_id = '00000000-0000-0000-0000-000000000001');

CREATE POLICY "anon_insert_demo_calls"
  ON public.scheduled_calls
  FOR INSERT
  TO anon
  WITH CHECK (organization_id = '00000000-0000-0000-0000-000000000001');

CREATE POLICY "anon_update_demo_calls"
  ON public.scheduled_calls
  FOR UPDATE
  TO anon
  USING (organization_id = '00000000-0000-0000-0000-000000000001')
  WITH CHECK (organization_id = '00000000-0000-0000-0000-000000000001');

CREATE POLICY "anon_delete_demo_calls"
  ON public.scheduled_calls
  FOR DELETE
  TO anon
  USING (organization_id = '00000000-0000-0000-0000-000000000001');

-- Transcriptions - FULL ACCESS
CREATE POLICY "anon_select_demo_transcriptions"
  ON public.transcriptions
  FOR SELECT
  TO anon
  USING (organization_id = '00000000-0000-0000-0000-000000000001');

CREATE POLICY "anon_insert_demo_transcriptions"
  ON public.transcriptions
  FOR INSERT
  TO anon
  WITH CHECK (organization_id = '00000000-0000-0000-0000-000000000001');

CREATE POLICY "anon_update_demo_transcriptions"
  ON public.transcriptions
  FOR UPDATE
  TO anon
  USING (organization_id = '00000000-0000-0000-0000-000000000001')
  WITH CHECK (organization_id = '00000000-0000-0000-0000-000000000001');

CREATE POLICY "anon_delete_demo_transcriptions"
  ON public.transcriptions
  FOR DELETE
  TO anon
  USING (organization_id = '00000000-0000-0000-0000-000000000001');

-- Activities - FULL ACCESS
CREATE POLICY "anon_select_demo_activities"
  ON public.activities
  FOR SELECT
  TO anon
  USING (organization_id = '00000000-0000-0000-0000-000000000001');

CREATE POLICY "anon_insert_demo_activities"
  ON public.activities
  FOR INSERT
  TO anon
  WITH CHECK (organization_id = '00000000-0000-0000-0000-000000000001');

CREATE POLICY "anon_update_demo_activities"
  ON public.activities
  FOR UPDATE
  TO anon
  USING (organization_id = '00000000-0000-0000-0000-000000000001')
  WITH CHECK (organization_id = '00000000-0000-0000-0000-000000000001');

CREATE POLICY "anon_delete_demo_activities"
  ON public.activities
  FOR DELETE
  TO anon
  USING (organization_id = '00000000-0000-0000-0000-000000000001');

-- Step 6: Verify policies were created
SELECT 'Policies created for contacts:' as message;
SELECT policyname, cmd FROM pg_policies WHERE tablename = 'contacts' AND roles @> ARRAY['anon'];

SELECT 'Demo org exists:' as message;
SELECT id, name FROM public.organizations WHERE id = '00000000-0000-0000-0000-000000000001';

SELECT 'Demo profile exists:' as message;
SELECT id, email FROM public.profiles WHERE id = '00000000-0000-0000-0000-000000000002';

