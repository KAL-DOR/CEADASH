-- Allow anon (demo mode) access to demo organization data
-- Demo org UUID: 00000000-0000-0000-0000-000000000001

-- Profiles: Allow anon to read demo profiles
CREATE POLICY "anon can read demo profiles"
  ON public.profiles
  FOR SELECT
  TO anon
  USING (organization_id = '00000000-0000-0000-0000-000000000001');

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

-- Organizations: Allow anon to read demo org
CREATE POLICY "anon can read demo organization"
  ON public.organizations
  FOR SELECT
  TO anon
  USING (id = '00000000-0000-0000-0000-000000000001');

