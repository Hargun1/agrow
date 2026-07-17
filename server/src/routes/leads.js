import express from "express";
import { sendLeadEmails, sendTestEmail } from "../services/email.js";
import { listLeads, markLeadEmailSent, saveLead } from "../services/supabase.js";

const router = express.Router();

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const indianMobilePattern = /^[6-9]\d{9}$/;

function validateLead(body) {
  const missing = ["fullName", "whatsappNumber", "email", "spaceType", "primaryGoal", "scale"].filter(
    (field) => !String(body[field] || "").trim(),
  );

  if (missing.length) {
    return `Missing required fields: ${missing.join(", ")}`;
  }

  if (!indianMobilePattern.test(String(body.whatsappNumber).trim())) {
    return "WhatsApp number must be a valid 10-digit Indian mobile number";
  }

  if (!emailPattern.test(String(body.email).trim())) {
    return "Email address is invalid";
  }

  return null;
}

router.post("/", async (req, res, next) => {
  try {
    const validationError = validateLead(req.body);
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const payload = {
      localId: req.body.localId,
      fullName: req.body.fullName.trim(),
      companyName: req.body.companyName?.trim() || "",
      whatsappNumber: req.body.whatsappNumber.trim(),
      email: req.body.email.trim().toLowerCase(),
      spaceType: req.body.spaceType,
      primaryGoal: req.body.primaryGoal,
      scale: req.body.scale,
      blueprintName: req.body.blueprintName || "",
      estimatedHarvest: req.body.estimatedHarvest || "",
      timestamp: req.body.timestamp ? new Date(req.body.timestamp) : new Date(),
    };

    let lead = await saveLead(payload);

    if (!lead.emailSentAt) {
      try {
        const sent = await sendLeadEmails(lead);
        if (sent) {
          lead = await markLeadEmailSent(lead.id);
        }
      } catch (emailError) {
        console.error("Lead saved, but email failed:", {
          code: emailError.code,
          command: emailError.command,
          response: emailError.response,
          message: emailError.message,
        });
      }
    }

    return res.status(201).json(lead);
  } catch (error) {
    if (error.code === "23505") {
      return res.status(200).json({ message: "Lead already synced" });
    }
    return next(error);
  }
});

router.post("/test-email", async (req, res, next) => {
  try {
    if (!process.env.INTERNAL_API_KEY || req.get("x-api-key") !== process.env.INTERNAL_API_KEY) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    await sendTestEmail(req.body?.to);
    res.json({ ok: true, message: "Test email sent" });
  } catch (error) {
    next(error);
  }
});

// MVP-only internal check. Secure this route before any public deployment.
router.get("/", async (_req, res, next) => {
  try {
    const leads = await listLeads();
    res.json(leads);
  } catch (error) {
    next(error);
  }
});

export default router;
