import { ArrowRight, Droplets, Sprout } from "lucide-react";
import { useKiosk } from "../context/KioskContext.jsx";

export default function AttractScreen() {
  const { setScreen } = useKiosk();

  return (
    <section className="flex min-h-dvh flex-col items-center justify-center px-5 py-12 text-center sm:px-8">
      <div className="flex w-full max-w-4xl flex-col items-center">
        <div className="mb-8 flex items-center justify-center gap-3 sm:gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-signal/40 bg-signal/12 sm:h-14 sm:w-14">
            <Sprout className="text-signal" size={26} />
          </div>
          <div className="text-left">
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-waterline sm:text-sm sm:tracking-[0.18em]">Happhygreenz</p>
            <p className="text-sm font-bold text-mist sm:text-lg">Precision urban farming systems</p>
          </div>
        </div>

        <div className="max-w-4xl">
          <p className="mb-6 inline-flex items-center justify-center gap-2 rounded-full border border-signal/30 bg-reservoir/50 px-4 py-2 text-sm font-extrabold text-mist sm:mb-8 sm:px-5 sm:py-3 sm:text-lg">
            <Droplets className="shrink-0 text-waterline" size={22} />
            Hydroponic hardware matched to your space
          </p>
          <h1 className="font-display text-4xl font-black leading-[1.1] tracking-normal text-paper sm:text-5xl md:text-6xl lg:text-7xl">
            Calculate Your Tech-Farming ROI in 30 Seconds.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg font-semibold leading-relaxed text-mist/86 sm:mt-8 sm:text-2xl">
            Choose your space, growth goal, and footprint. We will show the system, yield range, and farm workflow that fits.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setScreen("quiz")}
          className="pulse-ring focus-ring touch-button mt-10 flex w-full max-w-md items-center justify-center gap-3 rounded-xl bg-signal px-6 py-4 text-center text-lg font-black text-reservoir transition hover:bg-[#a6d15f] active:scale-[0.99] sm:gap-4 sm:px-9 sm:py-5 sm:text-2xl"
        >
          Begin Your Green Blueprint
          <ArrowRight className="shrink-0" size={28} />
        </button>
      </div>
    </section>
  );
}
