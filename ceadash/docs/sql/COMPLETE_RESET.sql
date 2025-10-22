
DROP TABLE IF EXISTS public.processes CASCADE;
DROP TABLE IF EXISTS public.contacts CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TABLE IF EXISTS public.organizations CASCADE;

-- Step 2: Drop functions
DROP FUNCTION IF EXISTS public.user_organization_id() CASCADE;
DROP FUNCTION IF EXISTS auth.user_organization_id() CASCADE;

-- Step 3: Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Step 4: Create tables
CREATE TABLE public.organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    settings JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.profiles (
    id UUID PRIMARY KEY,
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
    email TEXT NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    role TEXT DEFAULT 'member',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    company TEXT,
    status TEXT CHECK (status IN ('active', 'inactive')) DEFAULT 'active',
    notes TEXT,
    created_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.processes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    status TEXT CHECK (status IN ('draft', 'active', 'archived')) DEFAULT 'draft',
    efficiency_score INTEGER CHECK (efficiency_score >= 0 AND efficiency_score <= 100),
    diagram_data JSONB DEFAULT '{}'::jsonb,
    improvements_data JSONB DEFAULT '{}'::jsonb,
    transcription_id UUID,
    created_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.scheduled_calls (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
    contact_id UUID REFERENCES public.contacts(id) ON DELETE CASCADE NOT NULL,
    scheduled_date TIMESTAMP WITH TIME ZONE NOT NULL,
    status TEXT DEFAULT 'scheduled',
    duration_minutes INTEGER,
    notes TEXT,
    bot_connection_url TEXT,
    transcription_data JSONB,
    email_sent BOOLEAN DEFAULT false,
    email_id TEXT,
    created_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.transcriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
    call_id UUID,
    content TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    processed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    activity_type TEXT NOT NULL CHECK (activity_type IN (
        'call_scheduled', 'call_started', 'call_completed', 'call_cancelled',
        'process_created', 'process_updated', 'contact_added', 'transcription_ready'
    )),
    title TEXT NOT NULL,
    description TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 5: Create indexes
CREATE INDEX idx_profiles_org ON public.profiles(organization_id);
CREATE INDEX idx_contacts_org ON public.contacts(organization_id);
CREATE INDEX idx_processes_org ON public.processes(organization_id);
CREATE INDEX idx_scheduled_calls_org ON public.scheduled_calls(organization_id);
CREATE INDEX idx_transcriptions_org ON public.transcriptions(organization_id);
CREATE INDEX idx_activities_org ON public.activities(organization_id);
CREATE INDEX idx_activities_created_at ON public.activities(created_at DESC);

-- Step 6: Enable RLS
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.processes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scheduled_calls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transcriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;

-- Step 7: Create simple, non-recursive RLS policies
-- Organizations
CREATE POLICY "org_select" ON public.organizations
    FOR SELECT USING (
        id IN (SELECT organization_id FROM public.profiles WHERE id = auth.uid())
    );

-- Profiles
CREATE POLICY "profile_select" ON public.profiles
    FOR SELECT USING (id = auth.uid());

CREATE POLICY "profile_update" ON public.profiles
    FOR UPDATE USING (id = auth.uid());

CREATE POLICY "profile_insert" ON public.profiles
    FOR INSERT WITH CHECK (id = auth.uid());

-- Contacts
CREATE POLICY "contacts_all" ON public.contacts
    FOR ALL USING (
        organization_id IN (SELECT organization_id FROM public.profiles WHERE id = auth.uid())
    );

-- Processes
CREATE POLICY "processes_all" ON public.processes
    FOR ALL USING (
        organization_id IN (SELECT organization_id FROM public.profiles WHERE id = auth.uid())
    );

-- Scheduled calls
CREATE POLICY "calls_all" ON public.scheduled_calls
    FOR ALL USING (
        organization_id IN (SELECT organization_id FROM public.profiles WHERE id = auth.uid())
    );

-- Transcriptions
CREATE POLICY "transcriptions_all" ON public.transcriptions
    FOR ALL USING (
        organization_id IN (SELECT organization_id FROM public.profiles WHERE id = auth.uid())
    );

-- Activities
CREATE POLICY "activities_select" ON public.activities
    FOR SELECT USING (
        organization_id IN (SELECT organization_id FROM public.profiles WHERE id = auth.uid())
    );

CREATE POLICY "activities_insert" ON public.activities
    FOR INSERT WITH CHECK (
        organization_id IN (SELECT organization_id FROM public.profiles WHERE id = auth.uid())
    );

-- Step 8: Grant permissions
GRANT USAGE ON SCHEMA public TO authenticated, anon;
GRANT ALL ON public.organizations TO authenticated;
GRANT ALL ON public.profiles TO authenticated;
GRANT ALL ON public.contacts TO authenticated;
GRANT ALL ON public.processes TO authenticated;
GRANT ALL ON public.scheduled_calls TO authenticated;
GRANT ALL ON public.transcriptions TO authenticated;
GRANT ALL ON public.activities TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated, anon;

-- Step 9: Create demo organization and profile
INSERT INTO public.organizations (id, name, slug, settings)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    'Demo Organization',
    'demo-org',
    '{}'::jsonb
);

-- Step 10: Trigger to create profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, organization_id, email, full_name)
    VALUES (
        NEW.id,
        '00000000-0000-0000-0000-000000000001', -- Default to demo org
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Success message
SELECT 'SUCCESS! All tables created and configured.' as status;
SELECT 'Demo org ID: 00000000-0000-0000-0000-000000000001' as info;

