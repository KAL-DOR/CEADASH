# 🎬 Demo Data Setup Guide

## Overview
This guide helps you populate your database with realistic demo data for testing and demonstrations.

## 📋 What Gets Created

### **Demo Organization**
- **Name:** Demo Organization
- **Slug:** demo-org
- **ID:** `00000000-0000-0000-0000-000000000001`

### **6 Sample Contacts** 👥
1. **María García López** - Directora de Operaciones, TechCorp
   - Interested in sales process optimization
   - Status: Active

2. **Carlos Rodríguez Pérez** - CEO, StartupXYZ
   - Wants to improve client onboarding
   - Status: Active

3. **Ana Martínez Silva** - Process Consultant
   - Documenting customer service process
   - Status: Active (Completed call)

4. **Juan López Torres** - Production Director, FabricaSA
   - Needs manufacturing process optimization
   - Status: Active (Completed call)

5. **Laura Sánchez Ruiz** - Logistics Manager
   - Interested in distribution process mapping
   - Status: Active

6. **Pedro Fernández Gómez** - Ex-client
   - Process completed successfully
   - Status: Inactive

### **7 Sample Processes** 📊
1. **Incorporación de Nuevos Empleados** (Active, 85% efficiency)
   - Full employee onboarding from hiring to integration

2. **Proceso de Ventas B2B** (Active, 72% efficiency)
   - B2B lead management workflow

3. **Atención al Cliente - Soporte Técnico** (Active, 91% efficiency)
   - Technical incident resolution protocol

4. **Gestión de Inventario** (Draft, 0% efficiency)
   - Stock control and supplier management

5. **Proceso de Facturación** (Active, 78% efficiency)
   - Invoice generation and payment tracking

6. **Onboarding de Clientes B2C** (Active, 82% efficiency)
   - Individual customer onboarding

7. **Control de Calidad en Producción** (Archived, 88% efficiency)
   - Manufacturing quality control and inspection

### **5 Scheduled Calls** 📞
1. **María García** - In 2 days (Scheduled) ⏰
2. **Carlos Rodríguez** - In 5 days (Scheduled) ⏰
3. **Ana Martínez** - 3 days ago (Completed) ✅
4. **Juan López** - 1 day ago (Completed) ✅
5. **Laura Sánchez** - In 7 days (Scheduled) ⏰

### **2 Transcriptions** 📝
1. **Ana Martínez Session** - Customer service process (38 min)
2. **Juan López Session** - Production process with quality control issues (52 min)

### **8 Activity Entries** 🎯
- Process creations
- Contact additions
- Call scheduling
- Call completions
- Transcription ready notifications
- Spread over the last 5 days for realistic timeline

---

## 🚀 How to Apply Demo Data

### **Option 1: Supabase CLI (Recommended)**

1. **Make sure you're connected to your project:**
   ```bash
   cd ceadash
   supabase status
   ```

2. **Apply the migration:**
   ```bash
   supabase db push
   ```
   This will apply the seed data migration along with any pending migrations.

### **Option 2: Supabase Dashboard**

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Click **New Query**
4. Copy and paste the contents of `supabase/migrations/20241003000000_seed_demo_data.sql`
5. Click **Run**

### **Option 3: Direct SQL Execution**

```bash
cd ceadash
psql "YOUR_SUPABASE_CONNECTION_STRING" -f supabase/migrations/20241003000000_seed_demo_data.sql
```

---

## 🔑 Demo User Setup

### **Important: User Authentication**

The seed data creates a **placeholder user profile** with these credentials:
- **User ID:** `00000000-0000-0000-0000-000000000002`
- **Email:** `demo@ceadash.com`
- **Name:** Usuario Demo
- **Organization:** Demo Organization

⚠️ **However**, Supabase authentication requires a real user account. You have two options:

### **Option A: Use Demo Mode (Easiest)**
1. Click the **"Continuar como Demo"** button on the login page
2. This bypasses authentication and shows you the demo data immediately
3. Perfect for presentations and quick testing

### **Option B: Create a Real Demo Account**
1. Sign up at `/` with email `demo@ceadash.com` (or any email you prefer)
2. After signup, update the seed data to match your real user ID:
   ```sql
   -- Get your actual user ID from auth.users
   SELECT id, email FROM auth.users WHERE email = 'your-email@example.com';
   
   -- Update the demo profile with your real ID
   UPDATE profiles 
   SET id = 'YOUR-ACTUAL-UUID-HERE'
   WHERE email = 'demo@ceadash.com';
   
   -- Update all demo data to be owned by your user
   UPDATE contacts SET created_by = 'YOUR-ACTUAL-UUID-HERE' WHERE organization_id = '00000000-0000-0000-0000-000000000001';
   UPDATE processes SET created_by = 'YOUR-ACTUAL-UUID-HERE' WHERE organization_id = '00000000-0000-0000-0000-000000000001';
   UPDATE scheduled_calls SET created_by = 'YOUR-ACTUAL-UUID-HERE' WHERE organization_id = '00000000-0000-0000-0000-000000000001';
   UPDATE activities SET user_id = 'YOUR-ACTUAL-UUID-HERE' WHERE organization_id = '00000000-0000-0000-0000-000000000001';
   ```

---

## 📊 Expected Dashboard Stats After Seeding

Once the demo data is loaded, your dashboard should show:

### **Statistics:**
- **Total Processes:** 7 (4 active, 1 draft, 2 archived)
- **Scheduled Calls:** 2 (upcoming calls)
- **Active Contacts:** 5
- **Average Efficiency:** ~82.7%

### **Recent Activity Feed:**
- 8 activity entries showing the last 5 days
- Mix of process creations, contacts, and completed calls
- Real-time updates when new events occur

### **Charts:**
- Process efficiency chart with 4 active processes
- Efficiency scores ranging from 72% to 91%

---

## 🧪 Testing Scenarios

### **1. Test Real-time Activity Feed**
- Open the dashboard in one browser tab
- Open another tab and create a new contact
- Watch the activity feed update automatically in the first tab ✨

### **2. Test Call Scheduling**
- Go to **Programación** page
- Schedule a new call with any contact
- See it appear in the scheduled calls list
- Check the activity feed for the "call scheduled" entry

### **3. Test Webhook Simulation**
You can simulate webhook events by directly calling the API:
```bash
curl -X POST http://localhost:3000/api/webhook/elevenlabs \
  -H "Content-Type: application/json" \
  -d '{
    "event": "call_started",
    "call_id": "test-call-123",
    "data": {}
  }'
```

### **4. Test Process Management**
- Create a new process
- Watch it appear immediately
- Check the stats update in real-time
- Archive it and see stats update again

### **5. Test Multi-tenancy (Advanced)**
- Sign up with a different email to create a new organization
- Verify you can't see the demo organization's data
- All queries should be isolated by organization_id

---

## 🗑️ Clean Up Demo Data

If you want to remove all demo data and start fresh:

```sql
-- Delete all data for the demo organization
DELETE FROM activities WHERE organization_id = '00000000-0000-0000-0000-000000000001';
DELETE FROM transcriptions WHERE organization_id = '00000000-0000-0000-0000-000000000001';
DELETE FROM scheduled_calls WHERE organization_id = '00000000-0000-0000-0000-000000000001';
DELETE FROM processes WHERE organization_id = '00000000-0000-0000-0000-000000000001';
DELETE FROM contacts WHERE organization_id = '00000000-0000-0000-0000-000000000001';
DELETE FROM profiles WHERE organization_id = '00000000-0000-0000-0000-000000000001';
DELETE FROM organizations WHERE id = '00000000-0000-0000-0000-000000000001';
```

---

## 🎨 Customizing Demo Data

You can modify the seed file to add your own data:

1. Edit `supabase/migrations/20241003000000_seed_demo_data.sql`
2. Add more contacts, processes, or calls
3. Rerun the migration:
   ```bash
   supabase db reset  # Warning: This resets ALL data
   ```
   Or manually run the INSERT statements in SQL Editor

---

## 📸 Demo Screenshots Checklist

Perfect for presentations! Make sure to show:

- ✅ Dashboard with populated stats
- ✅ Real-time activity feed with recent entries
- ✅ Contacts page with 6 contacts
- ✅ Scheduling page with upcoming and completed calls
- ✅ Processes page with different statuses
- ✅ Process efficiency chart
- ✅ Activity feed auto-updating (live demo!)

---

## 🐛 Troubleshooting

### **Problem: No data appears after running migration**
**Solution:** Check that the migration ran successfully:
```bash
supabase migration list
# Should show 20241003000000_seed_demo_data applied
```

### **Problem: RLS policies block access**
**Solution:** Make sure you're logged in as a user that belongs to the demo organization, or use demo mode.

### **Problem: Activity feed is empty**
**Solution:** The real-time subscription requires the user's organization_id. Make sure you're authenticated properly.

### **Problem: Can't see demo data in demo mode**
**Solution:** Check that your middleware is properly setting the demo organization ID in the demo mode path.

---

## 🎉 Ready to Demo!

Your database is now populated with:
- ✅ 6 realistic contacts
- ✅ 7 diverse processes with varying efficiency scores
- ✅ 5 scheduled calls (past and future)
- ✅ 2 transcriptions ready for analysis
- ✅ 8 activity entries showing realistic timeline
- ✅ All data properly scoped to demo organization
- ✅ Real-time updates configured

**Perfect for demos, testing, and development!** 🚀

