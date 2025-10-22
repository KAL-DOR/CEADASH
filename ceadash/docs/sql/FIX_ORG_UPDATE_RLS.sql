-- Fix RLS policy to allow anon to update organizations notification_cc_emails
-- Run this in your Supabase SQL Editor NOW!

-- Drop existing policies that might be blocking
DROP POLICY IF EXISTS "anon can update demo organizations" ON public.organizations;
DROP POLICY IF EXISTS "anon can read demo organizations" ON public.organizations;

-- Allow anon to read demo organization
CREATE POLICY "anon can read demo organizations"
  ON public.organizations
  FOR SELECT
  TO anon
  USING (id = '00000000-0000-0000-0000-000000000001');

-- Allow anon to UPDATE demo organization (especially notification_cc_emails)
CREATE POLICY "anon can update demo organizations"
  ON public.organizations
  FOR UPDATE
  TO anon
  USING (id = '00000000-0000-0000-0000-000000000001')
  WITH CHECK (id = '00000000-0000-0000-0000-000000000001');

-- Verify it worked
SELECT id, name, notification_cc_emails 
FROM public.organizations 
WHERE id = '00000000-0000-0000-0000-000000000001';

