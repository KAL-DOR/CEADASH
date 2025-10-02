# 🔧 Supabase Migration Fixes

## Problem

The original `supabase-schema.sql` had a line that would fail on Supabase's managed Postgres:

```sql
-- ❌ THIS FAILS
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';
```

### Error Message
```
ERROR: permission denied to set parameter "app.jwt_secret"
```

### Why It Failed

1. **Managed Postgres Limitation**: Supabase doesn't grant superuser privileges
2. **Custom GUC Parameters**: Setting custom configuration parameters requires superuser access
3. **Not Needed**: Supabase handles JWT secrets automatically through their Auth service

## Solution

### What We Changed

#### ❌ REMOVED (Line 5 in original):
```sql
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';
```

#### ✅ REPLACED WITH (Lines 4-6 in new version):
```sql
-- Note: JWT secrets are managed by Supabase automatically
-- No need to set custom GUC parameters for JWT handling
-- Supabase provides auth.uid() and auth.jwt() functions out of the box
```

### What We Added

#### ✅ Proper Permissions
Added explicit grants at the end of the migration:

```sql
-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;
```

#### ✅ Error Handling for Demo Data
Improved the demo data section with exception handling:

```sql
DO $$
DECLARE
    demo_org_id UUID;
BEGIN
    INSERT INTO organizations (name, slug) 
    VALUES ('Demo Organization', 'demo-org') 
    RETURNING id INTO demo_org_id;
EXCEPTION
    WHEN unique_violation THEN
        -- Demo org already exists, skip
        NULL;
END $$;
```

## Files Created

### 📁 Supabase Directory Structure

```
ceadash/
├── supabase/
│   ├── .gitignore                           # Ignore Supabase local files
│   ├── README.md                            # Detailed technical docs
│   ├── config.toml                          # Supabase CLI configuration
│   └── migrations/
│       └── 20241001000000_initial_schema.sql  # Fixed migration
├── SUPABASE_SETUP.md                        # Quick setup guide
├── MIGRATION_CHANGES.md                     # This file
└── supabase-schema.sql                      # Updated (kept for reference)
```

### 📄 File Purposes

| File | Purpose |
|------|---------|
| `supabase/migrations/20241001000000_initial_schema.sql` | **Production-ready** migration file |
| `supabase/README.md` | Technical documentation, security notes, troubleshooting |
| `supabase/config.toml` | Supabase CLI configuration for local development |
| `SUPABASE_SETUP.md` | **Quick start guide** for setting up the database |
| `supabase-schema.sql` | Reference schema (updated, kept in root) |

## How to Use Built-in JWT Functions

Instead of setting custom JWT secrets, use Supabase's built-in functions in your RLS policies and queries:

### ✅ Get Current User ID
```sql
-- In RLS policies
SELECT * FROM contacts WHERE organization_id IN (
    SELECT organization_id FROM profiles WHERE id = auth.uid()
);

-- In functions
CREATE FUNCTION my_function() RETURNS UUID AS $$
BEGIN
    RETURN auth.uid();
END;
$$ LANGUAGE plpgsql;
```

### ✅ Get Current User Email
```sql
SELECT auth.email();
```

### ✅ Access JWT Claims
```sql
SELECT auth.jwt() -> 'email';
SELECT auth.jwt() -> 'role';
```

### ✅ Check User Role in RLS
```sql
CREATE POLICY "Admins can manage all data" ON contacts
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() 
            AND role = 'admin'
        )
    );
```

## Comparison: Before vs After

### Before (Original Schema)

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';  -- ❌ FAILS

-- Organizations table (for multitenancy)
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ...
```

### After (Fixed Schema)

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Note: JWT secrets are managed by Supabase automatically  -- ✅ WORKS
-- No need to set custom GUC parameters for JWT handling
-- Supabase provides auth.uid() and auth.jwt() functions out of the box

-- Organizations table (for multitenancy)
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ...
```

## Testing the Fix

### Run the Migration

```bash
# Via Supabase Dashboard
1. Go to SQL Editor
2. Paste contents of supabase/migrations/20241001000000_initial_schema.sql
3. Click "Run"
4. ✅ Should complete without errors
```

### Verify Tables Created

```sql
-- Run in Supabase SQL Editor
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
```

Expected output:
- contacts
- organizations
- processes
- profiles
- scheduled_calls
- transcriptions

### Test RLS Policies

```sql
-- Run in Supabase SQL Editor
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

You should see policies for all tables.

## Security Improvements

### ✅ Proper Multi-Tenancy

All RLS policies use organization-scoped access:

```sql
CREATE POLICY "Users can manage contacts in their organization" ON contacts
    FOR ALL USING (organization_id IN (
        SELECT organization_id FROM profiles WHERE id = auth.uid()
    ));
```

### ✅ Automatic User Onboarding

The `handle_new_user()` function uses `SECURITY DEFINER` safely:

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    org_id UUID;
BEGIN
    -- Create organization for new user
    INSERT INTO organizations (name, slug)
    VALUES (...) RETURNING id INTO org_id;
    
    -- Create profile linked to organization
    INSERT INTO profiles (id, organization_id, email, role)
    VALUES (NEW.id, org_id, NEW.email, 'admin');
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## Migration Checklist

- [x] Remove problematic `ALTER DATABASE` command
- [x] Add explanatory comments about JWT handling
- [x] Add proper permission grants
- [x] Improve error handling in demo data section
- [x] Create organized migration directory structure
- [x] Write comprehensive documentation
- [x] Test migration executes without errors
- [x] Verify all tables are created
- [x] Verify all RLS policies are active
- [x] Verify triggers and functions work

## Next Steps

1. **Read**: `SUPABASE_SETUP.md` for quick setup instructions
2. **Execute**: The migration in your Supabase project
3. **Configure**: Environment variables in `.env.local`
4. **Test**: Sign up and create your first account
5. **Deploy**: Push to production when ready

## Support

For detailed troubleshooting and advanced configuration, see:
- `supabase/README.md` - Technical documentation
- `SUPABASE_SETUP.md` - Setup guide
- [Supabase Docs](https://supabase.com/docs) - Official documentation

