# 🚀 Quick Email Test (2 Minutes)

Since you already added the Resend API key, here's how to test it immediately:

---

## **Step 1: Apply Database Migration**

In Supabase SQL Editor, run this:

```sql
-- Add CC email column to organizations
ALTER TABLE public.organizations
ADD COLUMN IF NOT EXISTS notification_cc_emails TEXT[];

-- Set your CC emails (replace with real emails you want to test)
UPDATE public.organizations
SET notification_cc_emails = ARRAY['your-email@gmail.com']
WHERE id = '00000000-0000-0000-0000-000000000001';
```

---

## **Step 2: Restart Dev Server**

Make sure the server picks up your `RESEND_API_KEY`:

```bash
cd /Users/nsierra/CEADASH/ceadash
npm run dev
```

---

## **Step 3: Schedule a Test Call**

1. Go to http://localhost:3010
2. Click **"Modo Demo"** (or login)
3. Go to **"Contactos"** tab
4. Add a contact with **YOUR real email** (so you can verify you received it)
5. Go to **"Programación"** tab
6. Click **"Programar Llamada"**
7. Fill out the form:
   - Select your contact
   - Pick a date/time
   - Choose process type (e.g., "Gestión de Agua Potable")
   - Add duration and notes
8. Click **"Programar"**

---

## **Step 4: Check Results**

### **In Terminal:**
Look for one of these messages:

✅ **Success:**
```
✅ Email sent successfully via Resend: re_abc123xyz...
```

⚠️ **Fallback (API key not loaded):**
```
⚠️ RESEND_API_KEY not configured - simulating email send
```

If you see the warning, restart the dev server.

### **In Your Inbox:**
Check your email! You should receive:
- 📧 Beautiful HTML email with CEA branding
- 📅 Date, time, process type
- 🎙️ Big button to "Conectar con el Agente de IA"
- 📋 Instructions for the interview

### **In CC Inbox:**
Check the CC email address you configured - it should also receive the email!

### **In Resend Dashboard:**
Go to https://resend.com/emails to see:
- Email status (Delivered ✅)
- Recipients (to + cc)
- Full preview
- Timestamps

---

## **Troubleshooting**

### **"RESEND_API_KEY not configured"**
- Check `.env.local` has: `RESEND_API_KEY=re_...`
- No quotes, no spaces
- Restart dev server

### **"Invalid API key"**
- Go to https://resend.com/api-keys
- Regenerate key
- Update `.env.local`

### **Email not received**
- Check spam folder
- Verify email address is correct
- Check Resend dashboard for delivery status

---

## **✅ You're Done!**

If you received the email, everything is working! 🎉

Now every time you schedule a call:
1. ✅ Contact receives email with agent link
2. ✅ CC recipients get copied automatically
3. ✅ All emails tracked in Resend dashboard
4. ✅ Beautiful CEA-branded template

