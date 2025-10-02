-- Check what policies exist for contacts table
SELECT schemaname, tablename, policyname, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'contacts'
ORDER BY policyname;

-- Check if anon role can insert
SELECT has_table_privilege('anon', 'contacts', 'INSERT');
SELECT has_table_privilege('anon', 'contacts', 'SELECT');
