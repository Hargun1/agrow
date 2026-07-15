import express from "express";
import Lead from "../models/Lead.js";
import { sendLeadEmails } from "../services/email.js";

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

    const lead = await Lead.findOneAndUpdate(
      payload.localId ? { localId: payload.localId } : { email: payload.email, timestamp: payload.timestamp },
      { $setOnInsert: payload },
      { new: true, upsert: true, runValidators: true },
    );

    if (!lead.emailSentAt) {
      try {
        const sent = await sendLeadEmails(lead);
        if (sent) {
          lead.emailSentAt = new Date();
          await lead.save();
        }
      } catch (emailError) {
        console.error("Lead saved, but email failed:", emailError.message);
      }
    }

    return res.status(201).json(lead);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(200).json({ message: "Lead already synced" });
    }
    return next(error);
  }
});

// MVP-only internal check. Secure this route before any public deployment.
router.get("/", async (_req, res, next) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 }).limit(200);
    res.json(leads);
  } catch (error) {
    next(error);
  }
});

export default router;
