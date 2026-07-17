import { ArrowRight, Droplets, Sprout } from "lucide-react";
import { useKiosk } from "../context/KioskContext.jsx";

export default function AttractScreen() {
  const { setScreen } = useKiosk();

  return (
    <section className="growth-grid grid min-h-dvh items-stretch md:h-full md:min-h-0 md:grid-cols-[1.08fr_0.92fr] md:overflow-hidden">
      <div className="flex min-h-dvh flex-col justify-between gap-10 px-5 py-6 sm:px-8 md:min-h-0 md:px-10 md:py-9 lg:px-16 lg:py-12">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[6px] border border-signal/40 bg-signal/12 sm:h-14 sm:w-14">
            <Sprout className="text-signal" size={26} />
          </div>
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-waterline sm:text-sm sm:tracking-[0.18em]">Happhygreenz</p>
            <p className="text-sm font-bold text-mist sm:text-lg">Precision urban farming systems</p>
          </div>
        </div>

        <div className="max-w-4xl">
          <p className="mb-4 inline-flex items-center gap-2 border-l-4 border-signal bg-reservoir/70 px-3 py-2 text-sm font-extrabold text-mist sm:mb-5 sm:px-4 sm:py-3 sm:text-lg">
            <Droplets className="shrink-0 text-waterline" size={22} />
            Hydroponic hardware matched to your space
          </p>
          <h1 className="font-display text-4xl font-black leading-[1.02] tracking-normal text-paper sm:text-5xl md:text-6xl lg:text-8xl">
            Calculate Your Tech-Farming ROI in 30 Seconds.
          </h1>
          <p className="mt-5 max-w-2xl text-lg font-semibold leading-snug text-mist/86 sm:mt-7 sm:text-2xl">
            Choose your space, growth goal, and footprint. We will show the system, yield range, and farm workflow that fits.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setScreen("quiz")}
          className="pulse-ring focus-ring touch-button flex w-full items-center justify-center gap-3 rounded-[4px] bg-signal px-5 py-4 text-center text-base font-black text-reservoir transition active:scale-[0.99] sm:w-fit sm:gap-4 sm:px-9 sm:py-5 sm:text-2xl"
        >
          Tap to Begin Your Green Blueprint
          <ArrowRight className="shrink-0" size={28} />
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
