# EmailJS Setup Guide (Gmail Integration)

Send emails from your **own Gmail account** to any recipient - no domain verification needed!

## Step 1: Create EmailJS Account (2 minutes)

1. Go to https://www.emailjs.com/
2. Sign up for free (200 emails/month)
3. Verify your email

## Step 2: Connect Your Gmail (1 minute)

1. In EmailJS dashboard, go to **Email Services**
2. Click **Add New Service**
3. Select **Gmail**
4. Click **Connect Account** and authorize your Gmail
5. **Copy your Service ID** (looks like `service_abc123xyz`)

## Step 3: Create Email Template (2 minutes)

1. Go to **Email Templates** in EmailJS dashboard
2. Click **Create New Template**
3. Paste this template:

### Template Content:

**Subject:**
```
Llamada Programada - {{contact_name}}
```

**Body (HTML):**
```html
<p>Hola {{contact_name}},</p>

<p>Tu llamada ha sido programada para el <strong>{{scheduled_date}}</strong></p>

<h3>Detalles de la reunión:</h3>
<ul>
  <li><strong>Contacto:</strong> {{contact_name}} ({{contact_email}})</li>
  <li><strong>Fecha:</strong> {{scheduled_date}}</li>
  <li><strong>Notas:</strong> {{notes}}</li>
</ul>

<p><strong>🔗 Link de conexión:</strong><br>
<a href="{{bot_url}}" style="display:inline-block;padding:12px 24px;background:#228BE6;color:white;text-decoration:none;border-radius:6px;margin:10px 0;">Unirse a la llamada</a></p>

<p>También puedes copiar este link: {{bot_url}}</p>

<hr>
<p style="color:#666;font-size:12px;">Este email fue enviado desde CEA Dashboard</p>
```

**Settings:**
- **To email:** `{{to_email}}`
- **Cc:** `{{cc_emails}}` (optional)

4. Click **Save**
5. **Copy your Template ID** (looks like `template_xyz789abc`)

## Step 4: Get Your Public Key

1. Go to **Account** → **General** in EmailJS dashboard
2. Find your **Public Key** (looks like `Abc-123XYZ456_def`)
3. Copy it

## Step 5: Add to .env.local

Open `/ceadash/.env.local` and replace these values:

```env
NEXT_PUBLIC_EMAILJS_SERVICE_ID=service_abc123xyz
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=template_xyz789abc
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=Abc-123XYZ456_def
```

## Step 6: Restart and Test

```bash
npm run dev
```

Now when you schedule a call in the dashboard, the email will be sent from YOUR Gmail account! 📧

## Troubleshooting

### Error: "EmailJS credentials not configured"
- Make sure you've added all three variables to `.env.local`
- Restart your dev server after adding them

### Email not sending
- Check your EmailJS dashboard for error logs
- Make sure your Gmail is still connected (may need to re-authorize)
- Check your Gmail's "Sent" folder to confirm

### Emails going to spam
- Ask recipients to add your Gmail to their contacts
- Use a verified domain (optional, for production)

## Free Tier Limits

- **200 emails/month**
- **Unlimited email services**
- **50 requests/hour**

Perfect for testing and small-scale use! For more, upgrade to EmailJS Pro.

## Why EmailJS + Gmail?

✅ **No domain verification needed**  
✅ **Emails come from YOUR Gmail** (trusted sender)  
✅ **Works with any recipient** (Gmail, Outlook, Yahoo, etc.)  
✅ **Setup in 5 minutes**  
✅ **Free tier is generous**  
✅ **Professional appearance** (from real Gmail account)

