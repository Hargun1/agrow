
  import { Building2, Home, Hotel, Leaf, LineChart, Sparkles } from "lucide-react";
import { useState } from "react";
import { useKiosk } from "../context/KioskContext.jsx";

const steps = [
  {
    key: "spaceType",
    question: "Where are you looking to integrate sustainable greens?",
    options: [
      {
        label: "Home / Balcony",
        icon: Home,
        // Pexels, Nguyen Designer: free-to-use plant-filled balcony photo. Swap for final Happhygreenz home installation photography when available.
        image: "/assets/quiz-home-balcony.jpg",
      },
      {
        label: "Office / Cafeteria",
        icon: Building2,
        // Pexels, Thetravelgramist: free-to-use green cafe/interior photo. Swap for final office/cafeteria installation photography when available.
        image: "/assets/quiz-office-cafe.jpg",
      },
      {
        label: "Commercial / Hospitality",
        icon: Hotel,
        // Pexels, Vladimir Srajber: free-to-use hospitality dining photo. Swap for final hotel/restaurant deployment photography when available.
        image: "/assets/quiz-hospitality.jpg",
      },
    ],
  },
  {
    key: "primaryGoal",
    question: "What is your main goal?",
    options: [
      { label: "Pure Nutrition & Wellness", icon: Leaf, image: "/assets/greenhouse-lettuce.jpg" },
      { label: "Aesthetic & Smart Living", icon: Sparkles, image: "/assets/quiz-office-cafe.jpg" },
      { label: "Commercial Scale & ROI", icon: LineChart, image: "/assets/commercial-greenhouse.jpg" },
    ],
  },
  {
    key: "scale",
    question: "Select your available space footprint:",
    options: [
      { label: "Compact (10-20 sq ft)", icon: Home, image: "/assets/vertical-rack.jpg" },
      { label: "Mid-Scale (50-200 sq ft)", icon: Building2, image: "/assets/indoor-led-farm.jpg" },
      { label: "Commercial (1 Acre+)", icon: Hotel, image: "/assets/commercial-greenhouse.jpg" },
    ],
  },
];

export default function QuizScreen() {
  const { setAnswer, setScreen } = useKiosk();
  const [stepIndex, setStepIndex] = useState(0);
  const step = steps[stepIndex];
  const progress = ((stepIndex + 1) / steps.length) * 100;

  function choose(label) {
    setAnswer(step.key, label);
    if (stepIndex === steps.length - 1) {
      setScreen("lead");
    } else {
      setStepIndex((current) => current + 1);
    }
  }

  return (
    <section className="flex min-h-dvh flex-col items-center justify-center px-5 py-6 sm:px-8 md:py-12">
      <div className="flex w-full max-w-4xl flex-col items-center text-center">
        <div className="mb-8 flex flex-col items-center">
          <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.16em] text-waterline sm:text-sm sm:tracking-[0.18em]">
            Growth Protocol — Step {stepIndex + 1} of 3
          </p>
          <div className="mt-2 h-2 w-48 overflow-hidden rounded-full bg-mist/14">
            <div className="h-full bg-signal transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="mb-10 flex flex-col items-center">
          <h2 className="font-display text-4xl font-black leading-[1.1] text-paper sm:text-5xl">
            {step.question}
          </h2>
          <p className="mt-4 max-w-2xl text-base font-semibold leading-relaxed text-mist/82 sm:text-xl">
            Each choice narrows the hardware prescription. Keep moving; the system saves your selection instantly.
          </p>
        </div>

        <div className="grid w-full gap-4 sm:grid-cols-3 sm:gap-6">
          {step.options.map(({ label, icon: Icon, image }) => (
            <button
              key={label}
              type="button"
              onClick={() => choose(label)}
              className="focus-ring touch-button group relative flex min-h-48 flex-col items-center justify-center overflow-hidden rounded-xl border border-mist/16 bg-reservoir/80 p-6 text-center transition hover:border-signal active:scale-[0.99] sm:min-h-56 md:min-h-64"
            >
              <img
                className="absolute inset-0 h-full w-full object-cover opacity-40 transition duration-500 group-hover:scale-[1.04] group-hover:opacity-50"
                src={image}
                alt=""
              />
              <div className="absolute inset-0 bg-gradient-to-t from-reservoir via-reservoir/60 to-transparent" />
              
              <div className="relative mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-paper text-vein shadow-lg transition group-hover:bg-signal group-hover:text-reservoir">
                <Icon size={28} strokeWidth={1.8} />
              </div>

              <div className="relative">
                <span className="block text-xl font-black leading-tight text-paper sm:text-2xl">{label}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
