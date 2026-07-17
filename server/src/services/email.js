import dns from "node:dns/promises";
import nodemailer from "nodemailer";

function smtpReady() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

function smtpPass() {
  return process.env.SMTP_PASS.replace(/\s+/g, "");
}

async function resolveSmtpHost(host) {
  if (String(process.env.SMTP_FORCE_IPV4 || "true") !== "true") {
    return host;
  }

  try {
    const addresses = await dns.resolve4(host);
    return addresses[0] || host;
  } catch (error) {
    console.warn("Could not resolve SMTP IPv4 address; using configured host.", error.message);
    return host;
  }
}

async function createTransporter() {
  const configuredHost = process.env.SMTP_HOST.trim();
  const host = await resolveSmtpHost(configuredHost);

  return nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT || 465),
    secure: String(process.env.SMTP_SECURE || "true") === "true",
    auth: {
      user: process.env.SMTP_USER.trim(),
      pass: smtpPass(),
    },
    tls: {
      servername: configuredHost,
    },
  });
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
  if (!smtpReady()) {
    console.warn("SMTP is not configured; skipping email send.");
    return false;
  }

  const transporter = await createTransporter();
  const from = process.env.MAIL_FROM || process.env.SMTP_USER;

  await transporter.sendMail({
    from,
    to: lead.email,
    subject: "Your Happhygreenz Urban Farm Blueprint",
    html: blueprintHtml(lead),
  });

  if (process.env.MAIL_TO) {
    await transporter.sendMail({
      from,
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

export async function sendTestEmail(to = process.env.MAIL_TO || process.env.SMTP_USER) {
  if (!smtpReady()) {
    throw new Error("SMTP is not configured");
  }

  const transporter = await createTransporter();
  await transporter.verify();

  const from = process.env.MAIL_FROM || process.env.SMTP_USER;
  await transporter.sendMail({
    from,
    to,
    subject: "Happhygreenz SMTP test",
    text: "SMTP is working for the Happhygreenz kiosk API.",
  });
}
