import { CheckCircle2, Droplets, Leaf, RotateCcw, Smartphone } from "lucide-react";
import { useKiosk } from "../context/KioskContext.jsx";
import { getBlueprint } from "../data/blueprints.js";

export default function BlueprintScreen() {
  const { answers, lead, resetSession } = useKiosk();
  const blueprint = getBlueprint(answers.scale);
  const firstName = lead.fullName.trim().split(" ")[0] || "there";

  return (
    <section className="growth-grid flex h-full flex-col px-7 py-6 lg:px-12">
      <header className="mb-5 grid grid-cols-[1fr_auto] items-end gap-6">
        <div>
          <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-waterline">Custom Urban Farm Blueprint</p>
          <h1 className="mt-2 font-display text-4xl font-black leading-tight text-paper lg:text-5xl">
          Hello {firstName}, here is your Custom Urban Farm Blueprint.
          </h1>
        </div>
        <div className="hidden border border-mist/16 bg-reservoir/78 px-5 py-4 text-right md:block">
          <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-waterline">Selected footprint</p>
          <p className="mt-1 text-xl font-black text-paper">{answers.scale}</p>
        </div>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        <Metric icon={Leaf} title="Estimated Harvest" value={blueprint.yield} />
        <Metric icon={Droplets} title="Water Efficiency" value="Saves up to 95%" />
        <Metric icon={CheckCircle2} title="Pesticide-Free" value="100% Guaranteed" />
      </div>

      <div className="mt-5 grid min-h-0 flex-1 gap-5 lg:grid-cols-[1.28fr_0.72fr]">
        <section className="grid min-h-0 grid-cols-[0.78fr_1.22fr] overflow-hidden border border-mist/16 bg-reservoir/78">
          <img className="h-full min-h-0 w-full object-cover" src={blueprint.hardwareImage} alt={blueprint.hardwareName} />
          <div className="flex min-h-0 flex-col justify-between p-5 lg:p-6">
            <div>
              <p className="mb-3 text-sm font-extrabold uppercase tracking-[0.18em] text-waterline">Hardware prescription</p>
              <h2 className="font-display text-3xl font-black leading-tight text-paper xl:text-4xl">{blueprint.hardwareName}</h2>
            </div>
            <ul className="mt-4 space-y-3">
              {blueprint.bullets.map((bullet) => (
                <li key={bullet} className="flex gap-3 text-lg font-bold leading-snug text-mist xl:text-xl">
                  <CheckCircle2 className="mt-0.5 shrink-0 text-signal" size={23} />
                  {bullet}
                </li>
              ))}
            </ul>
            <YieldMeter value={blueprint.yieldScore} label={blueprint.yield} />
          </div>
        </section>

        <section className="flex min-h-0 items-center gap-5 border border-waterline/28 bg-nori/92 p-5">
          <div className="relative flex h-full min-h-64 w-40 shrink-0 items-center justify-center rounded-[28px] border-[7px] border-black bg-black p-2 shadow-field">
            <div className="flex h-full w-full flex-col rounded-[20px] bg-paper p-4 text-reservoir">
              <div className="mb-5 flex items-center justify-between">
                <span className="text-sm font-black">agrowAi</span>
                <span className="h-2 w-10 bg-signal" />
              </div>
              <div className="relative flex-1 overflow-hidden bg-[#dcefe6]">
                <img className="h-full w-full object-cover opacity-90" src="/assets/vertical-rack.jpg" alt="Leaf scan preview" />
                <div className="absolute left-5 top-7 h-24 w-24 border-4 border-signal" />
                <div className="absolute bottom-5 left-4 right-4 bg-reservoir px-3 py-2 text-xs font-black text-paper">
                  Leaf health: stable
                </div>
              </div>
              <div className="mt-4 h-3 w-full bg-waterline/40">
                <div className="h-full w-3/4 bg-vein" />
              </div>
            </div>
          </div>
          <div>
            <Smartphone className="mb-5 text-signal" size={40} />
            <h2 className="font-display text-3xl font-black text-paper">Powered by agrowAi.</h2>
            <p className="mt-3 text-xl font-semibold leading-relaxed text-mist/84">
              Your pocket plant coach using advanced computer vision to guarantee perfect growth.
            </p>
          </div>
        </section>
      </div>

      <button
        type="button"
        onClick={resetSession}
        className="focus-ring touch-button mt-5 flex w-full items-center justify-center gap-3 rounded-[4px] bg-signal px-8 py-4 text-2xl font-black text-reservoir active:scale-[0.99]"
      >
        <RotateCcw size={28} />
        Blueprint sent to your email! Tap to Reset
      </button>
    </section>
  );
}

function Metric({ icon: Icon, title, value }) {
  return (
    <article className="border border-mist/16 bg-paper p-5 text-reservoir">
      <Icon className="mb-4 text-vein" size={28} />
      <p className="text-lg font-black text-nori">{title}</p>
      <p className="mt-2 text-3xl font-black leading-tight">{value}</p>
    </article>
  );
}

function YieldMeter({ value, label }) {
  return (
    <div className="mt-8 border-t border-mist/18 pt-5">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-waterline">Yield calculation</p>
        <p className="text-lg font-black text-signal">{value}% match</p>
      </div>
      <div className="h-4 bg-mist/12">
        <div className="h-full bg-signal transition-all duration-700" style={{ width: `${value}%` }} />
      </div>
      <p className="mt-3 text-base font-bold text-mist/74">{label} based on selected footprint and operating model.</p>
    </div>
  );
}
