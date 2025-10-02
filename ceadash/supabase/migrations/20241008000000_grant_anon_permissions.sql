-- Grant anon role permissions on tables for demo mode
-- Without these grants, RLS policies won't work for anon users

-- Grant usage on schema
GRANT USAGE ON SCHEMA public TO anon;

-- Organizations
GRANT SELECT ON public.organizations TO anon;

-- Profiles
GRANT SELECT ON public.profiles TO anon;

-- Contacts
GRANT ALL ON public.contacts TO anon;

-- Processes
GRANT ALL ON public.processes TO anon;

-- Scheduled calls
GRANT ALL ON public.scheduled_calls TO anon;

-- Transcriptions
GRANT ALL ON public.transcriptions TO anon;

-- Activities
GRANT ALL ON public.activities TO anon;

-- Also grant on sequences (for inserts to work)
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon;

