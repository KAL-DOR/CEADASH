-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Note: JWT secrets are managed by Supabase automatically
-- No need to set custom GUC parameters for JWT handling
-- Supabase provides auth.uid() and auth.jwt() functions out of the box

-- Organizations table (for multitenancy)
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    settings JSONB DEFAULT '{}'::jsonb
);

-- Profiles table (extends auth.users)
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    role TEXT CHECK (role IN ('admin', 'user')) DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contacts table
CREATE TABLE contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    status TEXT CHECK (status IN ('active', 'inactive')) DEFAULT 'active',
    notes TEXT,
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Transcriptions table
CREATE TABLE transcriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    call_id UUID,
    content TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    processed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Processes table
CREATE TABLE processes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    status TEXT CHECK (status IN ('draft', 'active', 'archived')) DEFAULT 'draft',
    efficiency_score INTEGER CHECK (efficiency_score >= 0 AND efficiency_score <= 100),
    diagram_data JSONB DEFAULT '{}'::jsonb,
    improvements_data JSONB DEFAULT '{}'::jsonb,
    transcription_id UUID REFERENCES transcriptions(id),
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Scheduled calls table
CREATE TABLE scheduled_calls (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE,
    process_id UUID REFERENCES processes(id) ON DELETE SET NULL,
    scheduled_date TIMESTAMP WITH TIME ZONE NOT NULL,
    status TEXT CHECK (status IN ('scheduled', 'completed', 'cancelled', 'in_progress')) DEFAULT 'scheduled',
    duration_minutes INTEGER,
    notes TEXT,
    email_sent BOOLEAN DEFAULT FALSE,
    email_id TEXT,
    bot_connection_url TEXT,
    transcription_data JSONB DEFAULT '{}'::jsonb,
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX idx_profiles_organization_id ON profiles(organization_id);
CREATE INDEX idx_contacts_organization_id ON contacts(organization_id);
CREATE INDEX idx_processes_organization_id ON processes(organization_id);
CREATE INDEX idx_scheduled_calls_organization_id ON scheduled_calls(organization_id);
CREATE INDEX idx_scheduled_calls_contact_id ON scheduled_calls(contact_id);
CREATE INDEX idx_scheduled_calls_scheduled_date ON scheduled_calls(scheduled_date);
CREATE INDEX idx_transcriptions_organization_id ON transcriptions(organization_id);

-- Updated at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_contacts_updated_at BEFORE UPDATE ON contacts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_processes_updated_at BEFORE UPDATE ON processes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_scheduled_calls_updated_at BEFORE UPDATE ON scheduled_calls FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_transcriptions_updated_at BEFORE UPDATE ON transcriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security Policies

-- Organizations: Users can only see their own organization
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own organization" ON organizations
    FOR SELECT USING (id IN (
        SELECT organization_id FROM profiles WHERE id = auth.uid()
    ));

-- Profiles: Users can see profiles in their organization
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view profiles in their organization" ON profiles
    FOR SELECT USING (organization_id IN (
        SELECT organization_id FROM profiles WHERE id = auth.uid()
    ));

CREATE POLICY "Users can update their own profile" ON profiles
    FOR UPDATE USING (id = auth.uid());

-- Contacts: Organization-scoped
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage contacts in their organization" ON contacts
    FOR ALL USING (organization_id IN (
        SELECT organization_id FROM profiles WHERE id = auth.uid()
    ));

-- Processes: Organization-scoped
ALTER TABLE processes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage processes in their organization" ON processes
    FOR ALL USING (organization_id IN (
        SELECT organization_id FROM profiles WHERE id = auth.uid()
    ));

-- Scheduled calls: Organization-scoped
ALTER TABLE scheduled_calls ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage scheduled calls in their organization" ON scheduled_calls
    FOR ALL USING (organization_id IN (
        SELECT organization_id FROM profiles WHERE id = auth.uid()
    ));

-- Transcriptions: Organization-scoped
ALTER TABLE transcriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage transcriptions in their organization" ON transcriptions
    FOR ALL USING (organization_id IN (
        SELECT organization_id FROM profiles WHERE id = auth.uid()
    ));

-- Function to create organization and profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    org_id UUID;
    org_name TEXT;
    org_slug TEXT;
BEGIN
    -- Get organization name from user metadata
    org_name := COALESCE(NEW.raw_user_meta_data->>'organization_name', 'Mi Organización');
    
    -- Generate a unique slug
    org_slug := LOWER(REGEXP_REPLACE(org_name, '[^a-zA-Z0-9]+', '-', 'g'));
    org_slug := TRIM(BOTH '-' FROM org_slug);
    
    -- Ensure slug is unique
    WHILE EXISTS (SELECT 1 FROM organizations WHERE slug = org_slug) LOOP
        org_slug := org_slug || '-' || EXTRACT(EPOCH FROM NOW())::INTEGER;
    END LOOP;
    
    -- Create organization
    INSERT INTO organizations (name, slug)
    VALUES (org_name, org_slug)
    RETURNING id INTO org_id;
    
    -- Create profile
    INSERT INTO profiles (id, organization_id, email, full_name, role)
    VALUES (
        NEW.id,
        org_id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        'admin'  -- First user in organization is admin
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function when a new user signs up
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Grant necessary permissions
-- Allow authenticated users to insert into their own organization's tables
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

-- Sample data for demo (optional - remove in production)
-- This creates a demo organization for testing
DO $$
DECLARE
    demo_org_id UUID;
BEGIN
    -- Create demo organization
    INSERT INTO organizations (name, slug) 
    VALUES ('Demo Organization', 'demo-org') 
    RETURNING id INTO demo_org_id;
    
    -- Note: In real usage, profiles are created via the trigger when users sign up
    -- This is just for demo purposes if you want to test without full auth
EXCEPTION
    WHEN unique_violation THEN
        -- Demo org already exists, skip
        NULL;
END $$;

