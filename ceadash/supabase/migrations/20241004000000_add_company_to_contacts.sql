-- Add company column to contacts table
-- This field was in the UI but missing from the schema

ALTER TABLE contacts
ADD COLUMN IF NOT EXISTS company TEXT;

-- Add comment
COMMENT ON COLUMN contacts.company IS 'Company or organization the contact works for';

