function emailReady() {
  return Boolean(process.env.RESEND_API_KEY && process.env.MAIL_FROM);
}

function blueprintHtml(lead) {
  return `
    <div style="font-family:Arial,sans-serif;line-height:1.5;color:#0f1f18">
      <h1 style="color:#106b3a">Your Happhygreenz Urban Farm Blueprint</h1>
      <p>Hello ${lead.fullName.split(" ")[0]},</p>
      <p>Your kiosk result is ready.</p>
      <h2>${lead.blueprintName}</h2>
      <ul>
        <li><strong>Estimated harvest:</strong> ${lead.estimatedHarvest}</li>
        <li><strong>Water efficiency:</strong> Saves up to 95%</li>
        <li><strong>Pesticide-free:</strong> 100% guaranteed</li>
      </ul>
      <p><strong>Space:</strong> ${lead.spaceType}</p>
      <p><strong>Goal:</strong> ${lead.primaryGoal}</p>
      <p><strong>Footprint:</strong> ${lead.scale}</p>
      <p>Powered by agrowAi, your pocket plant coach using computer vision to guide perfect growth.</p>
    </div>
  `;
}

export async function sendLeadEmails(lead) {
  if (!emailReady()) {
    console.warn("Resend is not configured; skipping email send.");
    return false;
  }

  await sendEmail({
    to: lead.email,
    subject: "Your Happhygreenz Urban Farm Blueprint",
    html: blueprintHtml(lead),
  });

  if (process.env.MAIL_TO) {
    await sendEmail({
      to: process.env.MAIL_TO,
      subject: `New kiosk lead: ${lead.fullName}`,
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.5">
          <h2>New Happhygreenz kiosk lead</h2>
          <p><strong>Name:</strong> ${lead.fullName}</p>
          <p><strong>Company:</strong> ${lead.companyName || "-"}</p>
          <p><strong>WhatsApp:</strong> ${lead.whatsappNumber}</p>
          <p><strong>Email:</strong> ${lead.email}</p>
          <p><strong>Blueprint:</strong> ${lead.blueprintName}</p>
          <p><strong>Scale:</strong> ${lead.scale}</p>
        </div>
      `,
    });
  }

  return true;
}

async function sendEmail({ to, subject, html, text }) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.MAIL_FROM,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      text,
    }),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = data.message || data.error || `Resend request failed with status ${response.status}`;
    const error = new Error(message);
    error.code = "RESEND_ERROR";
    error.response = data;
    throw error;
  }

  return data;
}

export async function sendTestEmail(to = process.env.MAIL_TO) {
  if (!emailReady()) {
    throw new Error("Resend is not configured");
  }

  if (!to) {
    throw new Error("MAIL_TO or a test recipient is required");
  }

  await sendEmail({
    to,
    subject: "Happhygreenz Resend test",
    text: "Resend email delivery is working for the Happhygreenz kiosk API.",
  });
}
