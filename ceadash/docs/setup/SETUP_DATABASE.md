# 🚀 Database Setup - REQUIRED BEFORE TESTING

## ⚠️ CRITICAL: Your database tables don't exist yet!

You need to apply the migrations to your Supabase database before the app will work.

---

## 📋 Quick Setup (5 minutes)

### **Step 1: Go to Supabase Dashboard**
1. Open https://app.supabase.com
2. Select your project
3. Go to **SQL Editor** in the left sidebar

### **Step 2: Run the Initial Schema**
1. Click **New Query**
2. Copy the ENTIRE contents of `supabase/migrations/20241001000000_initial_schema.sql`
3. Paste into the SQL Editor
4. Click **Run** or press `Ctrl+Enter`
5. You should see: "Success. No rows returned"

### **Step 3: Run the Activities Table Migration**
1. Click **New Query** again
2. Copy the ENTIRE contents of `supabase/migrations/20241002000000_add_activities.sql`
3. Paste into the SQL Editor
4. Click **Run**
5. You should see: "Success. No rows returned"

### **Step 4: (Optional) Add Demo Data**
1. Click **New Query** again
2. Copy the ENTIRE contents of `supabase/migrations/20241003000000_seed_demo_data.sql`
3. Paste into the SQL Editor
4. Click **Run**
5. You should see: "Success. No rows returned"

### **Step 5: Verify Tables Were Created**
1. Go to **Table Editor** in the left sidebar
2. You should see these tables:
   - ✅ organizations
   - ✅ profiles
   - ✅ contacts
   - ✅ processes
   - ✅ scheduled_calls
   - ✅ transcriptions
   - ✅ activities

---

## 🎯 What Each Migration Does

### **Migration 1: Initial Schema** (20241001000000_initial_schema.sql)
Creates:
- Organizations table (multi-tenancy)
- Profiles table (user data)
- Contacts table (your leads/clients)
- Processes table (business processes)
- Scheduled Calls table (AI call scheduling)
- Transcriptions table (call recordings)
- All RLS (Row Level Security) policies
- Database triggers for auto-creating profiles

### **Migration 2: Activities** (20241002000000_add_activities.sql)
Creates:
- Activities table (activity feed)
- RLS policies for activities
- Indexes for performance

### **Migration 3: Demo Data** (20241003000000_seed_demo_data.sql) - OPTIONAL
Creates:
- Demo organization
- 6 sample contacts
- 7 sample processes
- 5 scheduled calls
- 2 transcriptions
- 8 activity entries

---

## 🔧 Alternative: Using Supabase CLI

If you prefer using the CLI:

```bash
# 1. Link your project (if not already linked)
cd ceadash
npx supabase link --project-ref YOUR_PROJECT_REF

# 2. Push all migrations
npx supabase db push

# Done! All migrations applied automatically
```

To get your PROJECT_REF:
- Go to Supabase Dashboard > Project Settings > General
- Copy the "Reference ID"

---

## ✅ How to Verify It's Working

### **Test 1: Check Tables Exist**
Run this SQL query in Supabase SQL Editor:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
```

You should see:
- activities
- contacts
- organizations
- processes
- profiles
- scheduled_calls
- transcriptions

### **Test 2: Check RLS Policies**
```sql
SELECT tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename;
```

You should see multiple policies for each table.

### **Test 3: Try Adding a Contact**
1. Go to your app: http://localhost:3010
2. Click "Continuar como Demo" (or login)
3. Go to **Contactos** page
4. Click **+ Agregar Contacto**
5. Fill in:
   - Nombre: Test User
   - Email: test@example.com
6. Click **Agregar Contacto**
7. ✅ Should work! No more errors!

---

## 🐛 Troubleshooting

### **Error: "relation 'contacts' does not exist"**
**Problem:** Tables haven't been created
**Solution:** Run migrations 1 and 2 in SQL Editor (see Step 2 & 3 above)

### **Error: "No se pudo guardar el contacto"**
**Possible causes:**
1. Tables don't exist → Run migrations
2. Not authenticated → Click "Continuar como Demo"
3. RLS policies blocking → Check you're in the right organization

### **Error: "permission denied for table contacts"**
**Problem:** RLS policies not applied
**Solution:** Re-run the initial schema migration

### **Tables exist but can't insert data**
**Problem:** RLS policies preventing access
**Solution:** Make sure you're authenticated or in demo mode

---

## 📊 Database Structure

```
organizations (1)
    ↓
    ├── profiles (many users)
    ├── contacts (many contacts)
    ├── processes (many processes)
    ├── scheduled_calls (many calls)
    ├── transcriptions (many transcriptions)
    └── activities (many activities)
```

All tables are **organization-scoped** for multi-tenancy.

---

## 🔐 Security Features

✅ **Row Level Security (RLS)** enabled on all tables
✅ **Organization isolation** - no data leaks between organizations
✅ **User attribution** - tracks who created what
✅ **Automatic profile creation** - triggered on user signup

---

## 🎉 After Setup

Once migrations are applied, you can:
- ✅ Add contacts
- ✅ Create processes
- ✅ Schedule calls
- ✅ See real-time activity feed
- ✅ View dashboard stats
- ✅ Everything works!

---

## 📞 Need Help?

1. **Check the Supabase logs:**
   - Dashboard > Logs > Database
   - Look for error messages

2. **Verify environment variables:**
   ```bash
   cat .env.local
   ```
   Should have:
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY

3. **Check browser console:**
   - Open DevTools (F12)
   - Look for red errors
   - Share the error message

---

## ⚡ Quick Commands Reference

```bash
# Check if project is linked
cd ceadash
npx supabase status

# Link your project
npx supabase link --project-ref YOUR_REF

# Apply all migrations
npx supabase db push

# Check applied migrations
npx supabase migration list

# Reset database (WARNING: Deletes all data!)
npx supabase db reset
```

---

## 🎯 Summary

**Before testing, you MUST:**
1. ✅ Run migration 1 (initial schema)
2. ✅ Run migration 2 (activities)
3. ✅ (Optional) Run migration 3 (demo data)

**Then:**
4. ✅ Refresh your app
5. ✅ Try adding a contact
6. ✅ Everything should work!

**Takes less than 5 minutes!** 🚀

