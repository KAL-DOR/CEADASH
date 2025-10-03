-- Add notifications_cc_emails column to organizations
-- This is the correct column name (with 's') to match the code

ALTER TABLE public.organizations
ADD COLUMN IF NOT EXISTS notifications_cc_emails TEXT;

COMMENT ON COLUMN public.organizations.notifications_cc_emails IS 'Single email address to CC on all scheduling notifications';

-- Copy data from old column if it exists
UPDATE public.organizations
SET notifications_cc_emails = notification_cc_emails[1]
WHERE notification_cc_emails IS NOT NULL AND array_length(notification_cc_emails, 1) > 0;

