-- Fix ALL RLS policies to prevent infinite recursion
-- The problem: Every policy was querying profiles, which had a recursive policy

-- Step 1: Drop ALL existing policies
DROP POLICY IF EXISTS "Users can view profiles in their organization" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can manage contacts in their organization" ON contacts;
DROP POLICY IF EXISTS "Users can manage processes in their organization" ON processes;
DROP POLICY IF EXISTS "Users can manage scheduled calls in their organization" ON scheduled_calls;
DROP POLICY IF EXISTS "Users can manage transcriptions in their organization" ON transcriptions;
DROP POLICY IF EXISTS "Users can view activities in their organization" ON activities;
DROP POLICY IF EXISTS "Users can create activities in their organization" ON activities;

-- Step 2: Create a SECURITY DEFINER function to get user's org (bypasses RLS)
CREATE OR REPLACE FUNCTION auth.user_organization_id()
RETURNS UUID
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT organization_id FROM public.profiles WHERE id = auth.uid() LIMIT 1;
$$;

-- Step 3: Recreate profiles policies (simple, no recursion)
CREATE POLICY "Users can view their own profile" ON profiles
    FOR SELECT USING (id = auth.uid());

CREATE POLICY "Users can update their own profile" ON profiles
    FOR UPDATE USING (id = auth.uid());

CREATE POLICY "Users can insert their own profile" ON profiles
    FOR INSERT WITH CHECK (id = auth.uid());

-- Step 4: Recreate all other policies using the security definer function
CREATE POLICY "Users can manage contacts in their organization" ON contacts
    FOR ALL USING (organization_id = auth.user_organization_id());

CREATE POLICY "Users can manage processes in their organization" ON processes
    FOR ALL USING (organization_id = auth.user_organization_id());

CREATE POLICY "Users can manage scheduled calls in their organization" ON scheduled_calls
    FOR ALL USING (organization_id = auth.user_organization_id());

CREATE POLICY "Users can manage transcriptions in their organization" ON transcriptions
    FOR ALL USING (organization_id = auth.user_organization_id());

CREATE POLICY "Users can view activities in their organization" ON activities
    FOR SELECT USING (organization_id = auth.user_organization_id());

CREATE POLICY "Users can create activities in their organization" ON activities
    FOR INSERT WITH CHECK (organization_id = auth.user_organization_id());

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION auth.user_organization_id() TO authenticated;
GRANT EXECUTE ON FUNCTION auth.user_organization_id() TO anon;

