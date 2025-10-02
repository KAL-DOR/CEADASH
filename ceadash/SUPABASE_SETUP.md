# 🚀 Supabase Setup Guide for CEA Dashboard

## Quick Start (5 minutes)

### Step 1: Create Supabase Project

1. Go to https://supabase.com
2. Click "Start your project"
3. Create a new project (choose a region close to you)
4. Wait for the project to be ready (~2 minutes)

### Step 2: Get Your Credentials

Once your project is ready:

1. Go to **Settings** → **API** in the left sidebar
2. Copy these values:
   - **Project URL**: `https://xxxxxxxxxxxxx.supabase.co`
   - **Anon/Public Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### Step 3: Configure Environment Variables

Create or update your `.env.local` file in the project root:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# ElevenLabs (Optional - for call features)
ELEVENLABS_API_KEY=your_elevenlabs_key_here
```

### Step 4: Run the Database Migration

#### Option A: Via Supabase Dashboard (Easiest)

1. In your Supabase project, go to **SQL Editor** (left sidebar)
2. Click "New Query"
3. Open the file `supabase/migrations/20241001000000_initial_schema.sql`
4. Copy all the contents and paste into the SQL Editor
5. Click "Run" (or press `Cmd/Ctrl + Enter`)
6. Wait for "Success" message

#### Option B: Via Supabase CLI

```bash
# Install Supabase CLI (one-time)
npm install -g supabase

# Login to Supabase
supabase login

# Link your project (get ref from project settings)
supabase link --project-ref your-project-ref

# Push migrations
supabase db push
```

### Step 5: Verify Setup ✅

1. In Supabase Dashboard, go to **Table Editor**
2. You should see these tables:
   - ✅ organizations
   - ✅ profiles
   - ✅ contacts
   - ✅ processes
   - ✅ scheduled_calls
   - ✅ transcriptions

3. Go to **Database** → **Functions**
   - ✅ `handle_new_user()` function should exist

4. Go to **Authentication** → **Policies**
   - ✅ Each table should have RLS policies enabled

### Step 6: Test Your Setup

```bash
# Start the dev server
cd ceadash
npm run dev
```

Navigate to `http://localhost:3010` and:

1. Click "Register"
2. Create a test account
3. You should be automatically logged in and see the dashboard

## 🔒 Security Notes

### ✅ What We Fixed

The original schema had this **problematic line**:
```sql
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';
```

This causes the error:
```
permission denied to set parameter "app.jwt_secret"
```

### Why It Failed

- Supabase managed Postgres doesn't allow setting custom GUC parameters
- You don't have superuser privileges on managed Supabase
- JWT secrets are managed automatically by Supabase

### ✅ The Solution

We **removed** the problematic line. Supabase provides JWT handling out of the box:

```sql
-- Built-in functions provided by Supabase:
auth.uid()        -- Current user's ID
auth.jwt()        -- Access JWT claims  
auth.email()      -- Current user's email
```

No custom JWT configuration needed! 🎉

## 🛠 Troubleshooting

### "permission denied for table X"

**Cause:** Row Level Security (RLS) is blocking access

**Fix:**
1. Make sure you're logged in
2. Check that your user has a profile with an organization_id
3. Verify RLS policies exist in the Table Editor

### "relation 'profiles' does not exist"

**Cause:** Migration not run or failed

**Fix:**
1. Go to SQL Editor
2. Re-run the migration SQL
3. Check for error messages

### User signs up but no profile created

**Cause:** Trigger function not working

**Fix:**
1. Check Database → Functions for `handle_new_user`
2. Check Database → Triggers for `on_auth_user_created`
3. Manually create profile if needed:

```sql
-- Find your user ID
SELECT id, email FROM auth.users;

-- Create organization
INSERT INTO organizations (name, slug) 
VALUES ('Your Org Name', 'your-org-slug')
RETURNING id;

-- Create profile (use IDs from above)
INSERT INTO profiles (id, organization_id, email, role)
VALUES (
  'user-uuid-here',
  'org-uuid-here',
  'your-email@example.com',
  'admin'
);
```

## 📊 Database Schema Overview

### Multi-Tenant Architecture

```
organizations (1) ────── (many) profiles
                    └──── (many) contacts
                    └──── (many) processes
                    └──── (many) scheduled_calls
                    └──── (many) transcriptions
```

### Row Level Security (RLS)

All tables are **organization-scoped**:
- Users can only see data from their own organization
- First user in an organization becomes **admin**
- Profile updates restricted to own profile

### Automatic User Onboarding

When a user signs up:
1. ✅ Trigger `on_auth_user_created` fires
2. ✅ Creates new organization
3. ✅ Creates user profile linked to org
4. ✅ Sets user as admin

## 🎯 Next Steps

After setup is complete:

1. **Test Authentication**: Sign up and log in
2. **Add Contacts**: Go to "Contactos" tab
3. **Schedule Calls**: Go to "Programacion" tab
4. **View Processes**: Go to "Procesos" tab
5. **Configure Settings**: Go to "Configuracion" tab

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Database Triggers](https://supabase.com/docs/guides/database/postgres/triggers)
- [Full Schema README](./supabase/README.md)

## 🆘 Need Help?

If you encounter issues:
1. Check Supabase logs in Dashboard → Logs
2. Review the detailed troubleshooting in `supabase/README.md`
3. Check browser console for errors
4. Verify all environment variables are set correctly

