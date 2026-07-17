function getEmailProvider() {
  const requestedProvider = process.env.EMAIL_PROVIDER?.toLowerCase();

  if (requestedProvider === "brevo" || requestedProvider === "resend") {
    return requestedProvider;
  }

  if (process.env.BREVO_API_KEY && process.env.BREVO_SENDER_EMAIL) {
    return "brevo";
  }

  if (process.env.RESEND_API_KEY && process.env.MAIL_FROM) {
    return "resend";
  }

  return null;
}

function emailReady() {
  return Boolean(getEmailProvider());
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
      ${choicesHtml(lead)}
      <p>Powered by agrowAi, your pocket plant coach using computer vision to guide perfect growth.</p>
    </div>
  `;
}

function choicesHtml(lead) {
  return `
    <div>
      <h3 style="margin:24px 0 8px;color:#106b3a">Your choices</h3>
      <p><strong>Space:</strong> ${lead.spaceType}</p>
      <p><strong>Goal:</strong> ${lead.primaryGoal}</p>
      <p><strong>Footprint:</strong> ${lead.scale}</p>
    </div>
  `;
}

function choicesText(lead) {
  return [
    "Your choices:",
    `- Space: ${lead.spaceType}`,
    `- Goal: ${lead.primaryGoal}`,
    `- Footprint: ${lead.scale}`,
  ].join("\n");
}

function blueprintText(lead) {
  return [
    "Your Happhygreenz Urban Farm Blueprint",
    `Hello ${lead.fullName.split(" ")[0]},`,
    "",
    "Your kiosk result is ready.",
    `Blueprint: ${lead.blueprintName}`,
    `Estimated harvest: ${lead.estimatedHarvest}`,
    "Water efficiency: Saves up to 95%",
    "Pesticide-free: 100% guaranteed",
    "",
    choicesText(lead),
    "",
    "Powered by agrowAi, your pocket plant coach using computer vision to guide perfect growth.",
  ].join("\n");
}

export async function sendLeadEmails(lead) {
  if (!emailReady()) {
    console.warn("Email provider is not configured; skipping email send.");
    return false;
  }

  console.log("Calling sendLeadEmails");
  console.log("Sending customer email to:", lead.email);

  await sendEmail({
    to: lead.email,
    subject: "Your Happhygreenz Urban Farm Blueprint",
    html: blueprintHtml(lead),
    text: blueprintText(lead),
  });

  if (process.env.MAIL_TO) {
    console.log("Sending internal notification to:", process.env.MAIL_TO);
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
          ${choicesHtml(lead)}
        </div>
      `,
      text: [
        "New Happhygreenz kiosk lead",
        `Name: ${lead.fullName}`,
        `Company: ${lead.companyName || "-"}`,
        `WhatsApp: ${lead.whatsappNumber}`,
        `Email: ${lead.email}`,
        `Blueprint: ${lead.blueprintName}`,
        choicesText(lead),
      ].join("\n"),
    });
  }

  return true;
}

async function sendEmail({ to, subject, html, text }) {
  const provider = getEmailProvider();

  if (provider === "brevo") {
    return sendBrevoEmail({ to, subject, html, text });
  }

  if (provider === "resend") {
    return sendResendEmail({ to, subject, html, text });
  }

  throw new Error("Email provider is not configured");
}

async function sendResendEmail({ to, subject, html, text }) {
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

async function sendBrevoEmail({ to, subject, html, text }) {
  const payload = {
    sender: {
      email: process.env.BREVO_SENDER_EMAIL,
      name: process.env.BREVO_SENDER_NAME || "Happhygreenz Kiosk",
    },
    to: Array.isArray(to)
      ? to.map((recipient) => ({ email: recipient }))
      : [{ email: to }],
    subject,
  };

  // Only include defined body fields. Brevo accepts html and/or text; omitting
  // empty keys avoids sending htmlContent/textContent as undefined.
  if (html) payload.htmlContent = html;
  if (text) payload.textContent = text;

  console.log("Brevo request payload:", JSON.stringify(payload, null, 2));

  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": process.env.BREVO_API_KEY,
      "content-type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = data.message || data.code || `Brevo request failed with status ${response.status}`;
    const error = new Error(message);
    error.code = "BREVO_ERROR";
    error.response = data;
    throw error;
  }

  console.log("Brevo response:", JSON.stringify(data));
  return data;
}

export async function sendTestEmail(to = process.env.MAIL_TO) {
  if (!emailReady()) {
    throw new Error("Email provider is not configured");
  }

  if (!to) {
    throw new Error("MAIL_TO or a test recipient is required");
  }

  await sendEmail({
    to,
    subject: "Happhygreenz email test",
    text: "Email delivery is working for the Happhygreenz kiosk API.",
  });
}
