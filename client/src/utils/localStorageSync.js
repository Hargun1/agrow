import { getBlueprint } from "../data/blueprints.js";

const STORAGE_KEY = "happhygreenz_leads";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function readLeads() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function writeLeads(leads) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
}

function withTimeout(promise, timeoutMs = 5000) {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), timeoutMs);

  return promise(controller.signal).finally(() => window.clearTimeout(timeout));
}

export function saveLeadOffline(formData, answers) {
  const blueprint = getBlueprint(answers.scale);
  const localLead = {
    localId: crypto.randomUUID(),
    synced: false,
    timestamp: new Date().toISOString(),
    ...formData,
    ...answers,
    blueprintName: blueprint.hardwareName,
    estimatedHarvest: blueprint.yield,
  };

  writeLeads([...readLeads(), localLead]);
  return localLead;
}

export async function postLead(lead) {
  const response = await withTimeout((signal) =>
    fetch(`${API_URL}/api/leads`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(lead),
      signal,
    }),
  );

  if (!response.ok) {
    throw new Error("Lead sync failed");
  }

  return response.json();
}

export function markLeadSynced(localId) {
  writeLeads(readLeads().map((lead) => (lead.localId === localId ? { ...lead, synced: true } : lead)));
}

export async function syncUnsyncedLeads() {
  if (!navigator.onLine) {
    return;
  }

  const leads = readLeads();
  const unsynced = leads.filter((lead) => !lead.synced);

  for (const lead of unsynced) {
    try {
      await postLead(lead);
      markLeadSynced(lead.localId);
    } catch {
      break;
    }
  }
}

export function startLeadSync() {
  syncUnsyncedLeads();
  const intervalId = window.setInterval(syncUnsyncedLeads, 20000);
  window.addEventListener("online", syncUnsyncedLeads);

  return () => {
    window.clearInterval(intervalId);
    window.removeEventListener("online", syncUnsyncedLeads);
  };
}
