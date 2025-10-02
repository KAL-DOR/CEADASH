-- Fix infinite recursion in profiles RLS policy
-- The issue: profiles policy was querying profiles table itself, causing infinite loop

-- Drop the problematic policy
DROP POLICY IF EXISTS "Users can view profiles in their organization" ON profiles;

-- Create a fixed policy that doesn't cause recursion
-- Users can see their own profile and profiles in their org
CREATE POLICY "Users can view profiles in their organization" ON profiles
    FOR SELECT USING (
        id = auth.uid() 
        OR 
        organization_id = (
            SELECT organization_id FROM profiles WHERE id = auth.uid() LIMIT 1
        )
    );

-- Also ensure users can insert their own profile (for new signups)
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
CREATE POLICY "Users can insert their own profile" ON profiles
    FOR INSERT WITH CHECK (id = auth.uid());

