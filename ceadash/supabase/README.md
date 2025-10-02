# Supabase Setup for CEA Dashboard

## Overview

This project uses Supabase for authentication, database, and real-time features. The database schema implements a multi-tenant architecture with Row Level Security (RLS) policies.

## Database Schema

### Tables

1. **organizations** - Multi-tenant organization data
2. **profiles** - User profiles (extends auth.users)
3. **contacts** - Contact management for scheduling calls
4. **processes** - Mapped business processes
5. **scheduled_calls** - Call scheduling with ElevenLabs integration
6. **transcriptions** - Call transcription storage

### Security Model

- **Row Level Security (RLS)** enabled on all tables
- Organization-scoped access control
- JWT authentication via Supabase Auth
- Automatic profile creation on user signup

## Setup Instructions

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Note your project URL and anon key

### 2. Configure Environment Variables

Create a `.env.local` file in the project root:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# ElevenLabs
ELEVENLABS_API_KEY=your_elevenlabs_api_key
```

### 3. Run Migrations

You can run migrations in two ways:

#### Option A: Via Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy the contents of `supabase/migrations/20241001000000_initial_schema.sql`
4. Paste and run it

#### Option B: Via Supabase CLI

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push
```

### 4. Verify Setup

After running the migration, verify in the Supabase dashboard:

1. **Tables**: Check that all 6 tables are created
2. **Policies**: Verify RLS policies are enabled
3. **Functions**: Confirm `handle_new_user()` trigger function exists
4. **Triggers**: Check `on_auth_user_created` trigger is active

## Important Security Notes

### JWT Secrets

**DO NOT** try to set custom JWT secrets via SQL commands like:
```sql
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-secret';
```

**Why?** This will fail on Supabase's managed Postgres with "permission denied" error.

**Solution:** Supabase manages JWT secrets automatically. Use built-in functions:
- `auth.uid()` - Get current user's ID
- `auth.jwt()` - Access JWT claims
- `auth.email()` - Get current user's email

### RLS Policies

All tables have RLS enabled with organization-scoped policies:
- Users can only access data within their organization
- First user in an organization becomes admin
- Profile updates are restricted to the user's own profile

### Service Role Key

For server-side operations (like webhooks), use the service role key:
```typescript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // Use service role for bypassing RLS
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)
```

## Testing

### Create Test User

1. Navigate to your app at `http://localhost:3010`
2. Click "Register" or use demo mode
3. Create an account with email/password
4. The trigger will automatically:
   - Create an organization
   - Create a profile linked to the user
   - Set the user as admin

### Demo Mode

The app includes a demo mode that bypasses authentication for testing:
- Click "Demo" button on the homepage
- No Supabase authentication required
- Uses mock data

## Troubleshooting

### "permission denied for table X"

**Problem:** RLS is blocking access

**Solution:** 
1. Verify RLS policies exist for the table
2. Check that user has a profile with an organization_id
3. Confirm `auth.uid()` returns the correct user ID

### "relation does not exist"

**Problem:** Tables not created or migration not run

**Solution:**
1. Re-run the migration SQL
2. Check Supabase dashboard for table existence
3. Verify you're connected to the correct project

### "null value in column organization_id"

**Problem:** User profile not created or organization missing

**Solution:**
1. Check `handle_new_user()` trigger is active
2. Manually create organization and profile if needed:
```sql
-- Get user ID from auth.users
SELECT id, email FROM auth.users;

-- Create organization
INSERT INTO organizations (name, slug) VALUES ('Test Org', 'test-org');

-- Create profile
INSERT INTO profiles (id, organization_id, email, role)
VALUES (
  'user-uuid-from-above',
  (SELECT id FROM organizations WHERE slug = 'test-org'),
  'user@email.com',
  'admin'
);
```

## Migrations

Future schema changes should be added as new migration files:

```bash
supabase/migrations/
  20241001000000_initial_schema.sql
  20241015000000_add_new_feature.sql  ← New migrations
```

Naming convention: `YYYYMMDDHHMMSS_description.sql`

## Additional Resources

- [Supabase Docs](https://supabase.com/docs)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Database Functions](https://supabase.com/docs/guides/database/functions)
- [Triggers](https://supabase.com/docs/guides/database/postgres/triggers)

