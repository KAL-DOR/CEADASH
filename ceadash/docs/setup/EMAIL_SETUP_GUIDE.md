# 📧 Email Setup Guide - Resend Integration

## Overview
This app uses [Resend](https://resend.com) to send scheduling notification emails. Resend is free for up to 3,000 emails/month and very easy to set up.

---

## 🚀 Quick Setup (5 minutes)

### **Step 1: Create a Resend Account**
1. Go to https://resend.com
2. Click "Start Building" or "Sign Up"
3. Sign up with your email or GitHub
4. Verify your email address

### **Step 2: Get Your API Key**
1. Once logged in, go to https://resend.com/api-keys
2. Click "Create API Key"
3. Name it: `CEA Dashboard Production`
4. Permission: "Sending access"
5. Click "Add"
6. **COPY THE API KEY** (you won't see it again!)
   - It looks like: `re_123abc456def789ghi012jkl345mno678`

### **Step 3: Verify Your Domain (Required for Production)**

#### **Option A: Use Resend's Test Domain (Quick Start)**
- Resend gives you `onboarding@resend.dev` to test immediately
- Emails will work but show "via resend.dev"
- **Good for testing, not for production**

#### **Option B: Use Your Own Domain (Recommended)**
1. In Resend dashboard, go to https://resend.com/domains
2. Click "Add Domain"
3. Enter your domain: `cea.gob.mx` (or your actual domain)
4. Follow the DNS setup instructions:
   - Add TXT record for verification
   - Add MX records (for receiving bounces)
   - Add DKIM records (for authentication)
5. Wait for DNS propagation (5-60 minutes)
6. Resend will verify and show "Verified" ✅

**Example DNS Records for `cea.gob.mx`:**
```
Type: TXT
Name: @
Value: resend-verification=abc123xyz456

Type: MX
Name: @
Priority: 10
Value: feedback-smtp.resend.com

Type: TXT
Name: resend._domainkey
Value: v=DKIM1; k=rsa; p=MIGfMA0GCSqGSIb3...
```

### **Step 4: Add API Key to Your App**
1. Open your `.env.local` file in the `ceadash` directory
2. Add this line:
   ```bash
   RESEND_API_KEY=re_your_actual_api_key_here
   ```
3. Save the file
4. Restart your dev server:
   ```bash
   npm run dev
   ```

---

## 🎯 Configure CC Emails

### **Step 1: Run the Migration**
In Supabase SQL Editor, run:
```sql
ALTER TABLE public.organizations
ADD COLUMN IF NOT EXISTS notification_cc_emails TEXT[];
```

### **Step 2: Set CC Emails for Your Organization**
In Supabase SQL Editor, run:
```sql
-- Replace with your actual organization ID and emails
UPDATE public.organizations
SET notification_cc_emails = ARRAY[
  'director@cea.gob.mx',
  'coordinador@cea.gob.mx'
]
WHERE id = '00000000-0000-0000-0000-000000000001';
```

Now, every scheduling email will automatically CC those addresses!

---

## ✅ Test Your Setup

### **Test 1: Check API Key is Loaded**
1. Schedule a call in your app
2. Check the terminal/console logs
3. You should see:
   - ✅ `Email sent successfully via Resend: re_...`
   
   If you see:
   - ⚠️ `RESEND_API_KEY not configured - simulating email send`
   - This means the API key isn't loaded. Restart your dev server.

### **Test 2: Send a Real Email**
1. Go to http://localhost:3010
2. Login as demo (`demo@ceadash.com` / `demo123`)
3. Go to **Contactos**
4. Add a contact with YOUR real email address
5. Go to **Programación**
6. Schedule a call with that contact
7. Check your inbox! 📬

### **Test 3: Verify CC Emails**
1. Set CC emails in your organization (see Step 2 above)
2. Schedule another call
3. Check that the CC recipients also received the email

---

## 📊 Resend Dashboard

Monitor your emails at: https://resend.com/emails

You can see:
- ✅ Delivered emails
- ⚠️ Bounced emails
- 📊 Open rates (if enabled)
- 🔍 Full email details

---

## 🔧 Troubleshooting

### **Problem: "RESEND_API_KEY not configured"**
**Solution:**
1. Check `.env.local` exists in `ceadash` directory
2. Verify the line: `RESEND_API_KEY=re_...`
3. NO quotes around the value
4. Restart dev server: `npm run dev`

### **Problem: "Invalid API key"**
**Solution:**
1. Go to https://resend.com/api-keys
2. Delete old key
3. Create new key
4. Update `.env.local`
5. Restart server

### **Problem: "Domain not verified"**
**Solution:**
1. Use `onboarding@resend.dev` for testing (works immediately)
2. Or wait for DNS propagation (can take up to 48 hours)
3. Check DNS with: `dig TXT cea.gob.mx` or `nslookup -type=TXT cea.gob.mx`

### **Problem: Emails go to spam**
**Solution:**
1. Verify your domain (don't use resend.dev)
2. Add DKIM, SPF, and DMARC records
3. Send test emails to yourself first
4. Avoid spammy words in subject/content

### **Problem: CC emails not working**
**Solution:**
1. Verify migration was run: 
   ```sql
   SELECT notification_cc_emails FROM organizations WHERE id = 'your-org-id';
   ```
2. Should return an array of emails, not NULL
3. Check console logs to see what CC emails are being sent

---

## 💰 Pricing

### **Free Tier:**
- ✅ 3,000 emails/month
- ✅ 1 verified domain
- ✅ Email logs
- ✅ Full API access

### **Pro Tier ($20/month):**
- ✅ 50,000 emails/month
- ✅ Unlimited domains
- ✅ Priority support
- ✅ Advanced analytics

**For CEA:** The free tier is probably enough unless you're scheduling 100+ calls/day.

---

## 🔐 Security Best Practices

1. **Never commit `.env.local` to git** (it's already in `.gitignore`)
2. **Rotate API keys every 3-6 months**
3. **Use different keys for dev/staging/production**
4. **Monitor usage in Resend dashboard**
5. **Set up alerts for bounces**

---

## 🎨 Customize Email Template

The email template is in: `src/lib/email-service.ts`

To customize:
1. Edit the `generateEmailTemplate()` function
2. Update HTML/CSS as needed
3. Test by scheduling a call
4. Check Resend dashboard for preview

---

## 📝 Alternative Email Services

If you prefer not to use Resend, you can integrate:

### **SendGrid:**
```typescript
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
await sgMail.send({ to, from, subject, html, cc });
```

### **AWS SES:**
```typescript
import { SES } from '@aws-sdk/client-ses';
const ses = new SES({ region: 'us-east-1' });
await ses.sendEmail({ ... });
```

### **Postmark:**
```typescript
const postmark = require('postmark');
const client = new postmark.ServerClient(apiKey);
await client.sendEmail({ ... });
```

---

## ✅ You're All Set!

Once configured, your app will:
1. ✅ Send real emails when calls are scheduled
2. ✅ Include beautiful HTML templates
3. ✅ Automatically CC configured emails
4. ✅ Track delivery in Resend dashboard
5. ✅ Include personalized agent links

**Happy emailing! 📧**

