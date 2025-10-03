-- Quick SQL to add notifications_cc_emails column to organizations table
-- Run this in your Supabase SQL Editor

-- Add the column
ALTER TABLE public.organizations
ADD COLUMN IF NOT EXISTS notifications_cc_emails TEXT;

-- Add comment
COMMENT ON COLUMN public.organizations.notifications_cc_emails IS 'Email address to CC on all scheduling notifications';

-- Optional: If you have the old column, copy data over
UPDATE public.organizations
SET notifications_cc_emails = notification_cc_emails[1]
WHERE notification_cc_emails IS NOT NULL AND array_length(notification_cc_emails, 1) > 0;

-- Verify it worked
SELECT id, name, notifications_cc_emails FROM public.organizations;

