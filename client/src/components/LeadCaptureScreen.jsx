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
    <section className="growth-grid grid h-full items-stretch px-8 py-8 md:grid-cols-[0.82fr_1.18fr] lg:px-14">
      <aside className="relative hidden overflow-hidden border-r border-mist/14 md:block">
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src={blueprint.hardwareImage}
          alt=""
        />
        <div className="absolute inset-0 bg-gradient-to-t from-reservoir via-reservoir/78 to-reservoir/28" />
        <div className="absolute inset-0 bg-gradient-to-r from-reservoir/92 via-reservoir/48 to-transparent" />

        <div className="relative flex h-full flex-col justify-between p-8 lg:p-10">
          <div>
          <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-waterline">Blueprint ready</p>
          <h1 className="mt-5 font-display text-6xl font-black leading-[1] text-paper">
            Send the result to the right inbox.
          </h1>
          </div>

          <div className="space-y-5">
            <div className="border-l-4 border-signal bg-reservoir/76 p-5 backdrop-blur-sm">
              <p className="text-xl font-black text-paper">{answers.scale || "Selected farm footprint"}</p>
              <p className="mt-2 text-lg font-semibold text-mist/84">{answers.primaryGoal || "Growth goal captured"}</p>
            </div>
            <p className="max-w-md text-lg font-semibold leading-relaxed text-mist/82">
              The lead is saved on this tablet first, then synced to the database and emailed when connectivity is available.
            </p>
          </div>
        </div>
      </aside>

      <form
        onSubmit={submit}
        className="ml-auto flex w-full max-w-3xl flex-col justify-center bg-paper p-8 text-reservoir shadow-field"
      >
        <p className="mb-3 text-sm font-extrabold uppercase tracking-[0.18em] text-vein">Lead capture</p>
        <h2 className="font-display text-5xl font-black leading-tight text-reservoir">Your custom blueprint is ready.</h2>
        <p className="mb-8 mt-3 text-xl font-bold text-nori/74">Where should we send the result?</p>

        <div className="grid gap-4 md:grid-cols-2">
          <Field
            icon={UserRound}
            label="Full Name"
            name="fullName"
            value={lead.fullName}
            onChange={updateField}
            error={errors.fullName}
            required
          />
          <Field
            icon={Building2}
            label="Company Name / Designation"
            name="companyName"
            value={lead.companyName}
            onChange={updateField}
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
          />
        </div>

        <button
          type="submit"
          className="focus-ring touch-button mt-7 w-full rounded-[4px] bg-reservoir px-8 py-5 text-2xl font-black text-paper transition hover:bg-nori active:scale-[0.99]"
        >
          Reveal My Blueprint
        </button>
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
          className={`focus-ring touch-button w-full rounded-[4px] border bg-white px-4 text-xl font-bold text-reservoir outline-none focus:border-vein ${
            Icon ? "pl-12" : ""
          } ${error ? "border-red-500" : "border-nori/18"}`}
        />
      </span>
      <span className="mt-1 block min-h-5 text-sm font-bold text-red-700">{error || ""}</span>
    </label>
  );
}
