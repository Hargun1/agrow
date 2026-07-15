import { ArrowRight, Droplets, Sprout } from "lucide-react";
import { useKiosk } from "../context/KioskContext.jsx";

export default function AttractScreen() {
  const { setScreen } = useKiosk();

  return (
    <section className="growth-grid grid h-full items-stretch overflow-hidden md:grid-cols-[1.08fr_0.92fr]">
      <div className="flex flex-col justify-between px-10 py-9 lg:px-16 lg:py-12">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-[6px] border border-signal/40 bg-signal/12">
            <Sprout className="text-signal" size={29} />
          </div>
          <div>
            <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-waterline">Happhygreenz</p>
            <p className="text-lg font-bold text-mist">Precision urban farming systems</p>
          </div>
        </div>

        <div className="max-w-4xl">
          <p className="mb-5 inline-flex items-center gap-2 border-l-4 border-signal bg-reservoir/70 px-4 py-3 text-lg font-extrabold text-mist">
            <Droplets className="text-waterline" size={24} />
            Hydroponic hardware matched to your space
          </p>
          <h1 className="font-display text-6xl font-black leading-[0.98] tracking-normal text-paper lg:text-8xl">
            Calculate Your Tech-Farming ROI in 30 Seconds.
          </h1>
          <p className="mt-7 max-w-2xl text-2xl font-semibold leading-snug text-mist/86">
            Choose your space, growth goal, and footprint. We will show the system, yield range, and farm workflow that fits.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setScreen("quiz")}
          className="pulse-ring focus-ring touch-button flex w-fit items-center gap-4 rounded-[4px] bg-signal px-9 py-5 text-2xl font-black text-reservoir transition active:scale-[0.99]"
        >
          Tap to Begin Your Green Blueprint
          <ArrowRight size={30} />
        </button>
      </div>

      <aside className="relative hidden h-full md:block">
        <img
          className="h-full w-full object-cover"
          src="/assets/greenhouse-lettuce.jpg"
          alt="Hydroponic lettuce growing in controlled rows"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-reservoir/8 to-reservoir/88" />
        <div className="absolute bottom-10 right-10 w-80 border border-mist/20 bg-reservoir/88 p-5">
          <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-waterline">Live kiosk workflow</p>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center text-sm font-black text-reservoir">
            <span className="bg-paper px-2 py-3">Space</span>
            <span className="bg-paper px-2 py-3">Goal</span>
            <span className="bg-signal px-2 py-3">Yield</span>
          </div>
        </div>
      </aside>
    </section>
  );
}
