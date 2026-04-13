export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { firstName, lastName, email, phone, businessType, message } = req.body;

  // Basic validation
  if (!firstName || !email || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'WebLaunch Australia <enquiries@weblaunchaustralia.com.au>',
        to: ['weblaunchaustralia@gmail.com'],
        reply_to: email,
        subject: `New enquiry from ${firstName} ${lastName} — ${businessType}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #f7f7f5;">
            <div style="background: #0B1C4A; padding: 24px 32px; border-radius: 4px 4px 0 0;">
              <h1 style="color: #ffffff; font-size: 20px; margin: 0; font-weight: 500;">New Website Enquiry</h1>
              <p style="color: rgba(255,255,255,0.5); font-size: 13px; margin: 6px 0 0;">WebLaunch Australia</p>
            </div>
            <div style="background: #ffffff; padding: 32px; border-radius: 0 0 4px 4px; border: 1px solid #e2e6f0; border-top: none;">
              
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
                <tr style="border-bottom: 1px solid #e2e6f0;">
                  <td style="padding: 12px 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #6b7a99; width: 140px;">Name</td>
                  <td style="padding: 12px 0; font-size: 14px; color: #111827;">${firstName} ${lastName}</td>
                </tr>
                <tr style="border-bottom: 1px solid #e2e6f0;">
                  <td style="padding: 12px 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #6b7a99;">Email</td>
                  <td style="padding: 12px 0; font-size: 14px; color: #111827;"><a href="mailto:${email}" style="color: #E8620A; text-decoration: none;">${email}</a></td>
                </tr>
                <tr style="border-bottom: 1px solid #e2e6f0;">
                  <td style="padding: 12px 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #6b7a99;">Phone</td>
                  <td style="padding: 12px 0; font-size: 14px; color: #111827;">${phone || 'Not provided'}</td>
                </tr>
                <tr style="border-bottom: 1px solid #e2e6f0;">
                  <td style="padding: 12px 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #6b7a99;">Business Type</td>
                  <td style="padding: 12px 0; font-size: 14px; color: #111827;">${businessType}</td>
                </tr>
              </table>

              <div style="background: #f7f7f5; border-radius: 4px; padding: 20px 24px;">
                <p style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #6b7a99; margin: 0 0 10px;">Message</p>
                <p style="font-size: 14px; color: #111827; line-height: 1.7; margin: 0;">${message.replace(/\n/g, '<br>')}</p>
              </div>

              <div style="margin-top: 28px; padding-top: 20px; border-top: 1px solid #e2e6f0;">
                <a href="mailto:${email}" style="display: inline-block; background: #E8620A; color: #ffffff; padding: 12px 24px; border-radius: 3px; text-decoration: none; font-size: 13px; font-weight: 500; letter-spacing: 0.05em;">Reply to ${firstName}</a>
              </div>

            </div>
            <p style="text-align: center; font-size: 11px; color: #b0bac8; margin-top: 20px;">WebLaunch Australia · weblaunchaustralia.com.au</p>
          </div>
        `,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Resend error:', error);
      return res.status(500).json({ error: 'Failed to send email' });
    }

    return res.status(200).json({ success: true });

  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}
