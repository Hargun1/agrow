import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    persistSession: false,
  },
});

function toLead(row) {
  return {
    id: row.id,
    localId: row.local_id,
    fullName: row.full_name,
    companyName: row.company_name || "",
    whatsappNumber: row.whatsapp_number,
    email: row.email,
    spaceType: row.space_type,
    primaryGoal: row.primary_goal,
    scale: row.scale,
    blueprintName: row.blueprint_name || "",
    estimatedHarvest: row.estimated_harvest || "",
    submissionDetails: row.submission_details || {},
    timestamp: row.timestamp,
    emailSentAt: row.email_sent_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function toLeadRow(payload) {
  return {
    local_id: payload.localId || null,
    full_name: payload.fullName,
    company_name: payload.companyName || "",
    whatsapp_number: payload.whatsappNumber,
    email: payload.email,
    space_type: payload.spaceType,
    primary_goal: payload.primaryGoal,
    scale: payload.scale,
    blueprint_name: payload.blueprintName || "",
    estimated_harvest: payload.estimatedHarvest || "",
    timestamp: payload.timestamp,
    submission_details: buildSubmissionDetails(payload),
  };
}

function buildSubmissionDetails(payload) {
  return {
    contact: {
      fullName: payload.fullName,
      companyName: payload.companyName || "",
      whatsappNumber: payload.whatsappNumber,
      email: payload.email,
    },
    quiz: {
      spaceType: payload.spaceType,
      primaryGoal: payload.primaryGoal,
      scale: payload.scale,
    },
    blueprint: {
      name: payload.blueprintName || "",
      estimatedHarvest: payload.estimatedHarvest || "",
    },
    metadata: {
      localId: payload.localId || null,
      timestamp: payload.timestamp || null,
      source: "kiosk",
    },
  };
}

export async function saveLead(payload) {
  const row = toLeadRow(payload);
  const query = payload.localId
    ? supabase.from("leads").upsert(row, { onConflict: "local_id" })
    : supabase.from("leads").insert(row);

  const { data, error } = await query.select("*").single();

  if (error) {
    throw error;
  }

  return toLead(data);
}

export async function markLeadEmailSent(id) {
  const { data, error } = await supabase
    .from("leads")
    .update({ email_sent_at: new Date().toISOString() })
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return toLead(data);
}

export async function listLeads(limit = 200) {
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw error;
  }

  return data.map(toLead);
}
