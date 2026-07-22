import { Building2, Mail, Phone, UserRound } from "lucide-react";
import { useState } from "react";
import { useKiosk } from "../context/KioskContext.jsx";
import { getBlueprint } from "../data/blueprints.js";
import { markLeadSynced, postLead, saveLeadOffline } from "../utils/localStorageSync.js";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const indianMobilePattern = /^[6-9]\d{9}$/;

export default function LeadCaptureScreen() {
  const { answers, lead, setLead, setScreen } = useKiosk();
  const [errors, setErrors] = useState({});
  const blueprint = getBlueprint(answers.scale);

  function updateField(event) {
    setLead({ ...lead, [event.target.name]: event.target.value });
  }

  function validate() {
    const nextErrors = {};
    if (!lead.fullName.trim()) nextErrors.fullName = "Required";
    if (!indianMobilePattern.test(lead.whatsappNumber.trim())) nextErrors.whatsappNumber = "Enter a valid 10-digit mobile";
    if (!emailPattern.test(lead.email.trim())) nextErrors.email = "Enter a valid email";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function submit(event) {
    event.preventDefault();
    if (!validate()) return;

    const offlineLead = saveLeadOffline(
      {
        fullName: lead.fullName.trim(),
        companyName: lead.companyName.trim(),
        whatsappNumber: lead.whatsappNumber.trim(),
        email: lead.email.trim(),
      },
      answers,
    );

    setScreen("blueprint");

    try {
      await postLead(offlineLead);
      markLeadSynced(offlineLead.localId);
    } catch {
      // Silent by design: the global sync worker retries when connectivity returns.
    }
  }

  return (
    <section className="flex min-h-dvh flex-col items-center justify-center bg-paper px-5 py-12 sm:px-8">
      <div className="w-full max-w-2xl text-center">
        <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.16em] text-vein sm:text-sm sm:tracking-[0.18em]">
          Blueprint Ready
        </p>
        <h1 className="font-display text-4xl font-black leading-tight text-reservoir sm:text-5xl lg:text-6xl">
          Your sustainable growth journey starts here.
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg font-semibold text-nori/80 sm:text-xl">
          Join thousands who have switched to 100% pesticide-free, hyper-local farming. Where should we send your custom {answers.scale || "farming"} blueprint?
        </p>
      </div>

      <form
        onSubmit={submit}
        className="mt-10 w-full max-w-3xl rounded-xl bg-white p-6 shadow-field sm:p-10"
      >
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          <Field
            icon={UserRound}
            label="Full Name"
            name="fullName"
            value={lead.fullName}
            onChange={updateField}
            error={errors.fullName}
            required
            placeholder="John Doe"
          />
          <Field
            icon={Building2}
            label="Company / Farm Name"
            name="companyName"
            value={lead.companyName}
            onChange={updateField}
            placeholder="Green Acres"
          />
          <Field
            icon={Phone}
            label="WhatsApp Number"
            name="whatsappNumber"
            value={lead.whatsappNumber}
            onChange={updateField}
            inputMode="numeric"
            maxLength={10}
            error={errors.whatsappNumber}
            required
            placeholder="9876543210"
          />
          <Field
            icon={Mail}
            label="Email Address"
            name="email"
            value={lead.email}
            onChange={updateField}
            inputMode="email"
            error={errors.email}
            required
            placeholder="john@example.com"
          />
        </div>

        <button
          type="submit"
          className="focus-ring touch-button w-full rounded-lg bg-vein px-6 py-4 text-xl font-black text-white transition hover:bg-nori active:scale-[0.99] sm:py-5 sm:text-2xl"
        >
          Reveal My Blueprint
        </button>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-sm font-semibold text-nori/60">
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-signal"></span>
            100% Pesticide Free
          </span>
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-signal"></span>
            Locally Grown
          </span>
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-signal"></span>
            Sustainable Future
          </span>
        </div>
      </form>
    </section>
  );
}

function Field({ icon: Icon, label, error, ...props }) {
  return (
    <label className="block">
      <span className="mb-2 block text-base font-extrabold text-nori">{label}</span>
      <span className="relative block">
        {Icon ? <Icon className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-vein" size={24} /> : null}
        <input
          {...props}
          className={`focus-ring touch-button w-full rounded-[4px] border bg-white px-4 text-base font-bold text-reservoir outline-none focus:border-vein sm:text-xl ${
            Icon ? "pl-12" : ""
          } ${error ? "border-red-500" : "border-nori/18"}`}
        />
      </span>
      <span className="mt-1 block min-h-5 text-sm font-bold text-red-700">{error || ""}</span>
    </label>
  );
}
