-- Check if company column exists
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'contacts' 
AND column_name = 'company';

-- If empty result, add the column
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS company TEXT;

-- Verify it was added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'contacts'
ORDER BY ordinal_position;
