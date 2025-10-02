// Quick test script for Resend
// Run with: node test-resend.js

const testEmail = async () => {
  const response = await fetch('http://localhost:3000/api/send-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      to: 'your-email@gmail.com', // Change this to your email
      scheduledCall: {
        id: 'test-123',
        contact_name: 'Test Contact',
        contact_email: 'test@example.com',
        scheduled_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        notes: 'This is a test email from Resend!',
        bot_connection_url: 'https://test-url.com/join',
      }
    })
  });

  const data = await response.json();
  console.log('✅ Email sent!', data);
};

testEmail().catch(console.error);

