-- Add CC email configuration to organizations
-- Users can specify emails to CC on all scheduled call notifications

ALTER TABLE public.organizations
ADD COLUMN IF NOT EXISTS notification_cc_emails TEXT[];

COMMENT ON COLUMN public.organizations.notification_cc_emails IS 'Array of email addresses to CC on all scheduling notifications';

-- Example of how to set it:
-- UPDATE organizations SET notification_cc_emails = ARRAY['admin@cea.gob.mx', 'supervisor@cea.gob.mx'] WHERE id = 'your-org-id';

