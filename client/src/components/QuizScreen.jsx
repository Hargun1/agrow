
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
    <section className="growth-grid flex h-full flex-col px-8 py-8 lg:px-14">
      <div className="mx-auto flex h-full w-full max-w-7xl flex-col">
        <div className="mb-9 grid grid-cols-[220px_1fr_90px] items-center gap-6">
          <div>
            <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-waterline">Growth protocol</p>
            <p className="mt-1 text-2xl font-black text-paper">Step {stepIndex + 1} of 3</p>
          </div>
          <div className="h-3 overflow-hidden bg-mist/14">
            <div className="h-full bg-signal transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
          <p className="text-right text-2xl font-black text-signal">{Math.round(progress)}%</p>
        </div>

        <div className="mb-10 grid grid-cols-[0.78fr_1.22fr] gap-10">
          <div className="border-l-4 border-signal pl-6">
            <h2 className="font-display text-5xl font-black leading-[1.04] text-paper">{step.question}</h2>
          </div>
          <p className="max-w-2xl self-end text-xl font-semibold leading-relaxed text-mist/82">
            Each choice narrows the hardware prescription. Keep moving; the system saves your selection as soon as you tap.
          </p>
        </div>

        <div className="grid flex-1 gap-5 md:grid-cols-3">
          {step.options.map(({ label, icon: Icon, image }) => (
            <button
              key={label}
              type="button"
              onClick={() => choose(label)}
              className="focus-ring touch-button group relative flex min-h-72 flex-col justify-between overflow-hidden border border-mist/16 bg-reservoir/76 p-6 text-left transition hover:border-signal active:scale-[0.99]"
            >
              <img
                className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                src={image}
                alt=""
              />
              <div className="absolute inset-0 bg-gradient-to-t from-reservoir via-reservoir/72 to-reservoir/18" />
              <div className="absolute inset-0 bg-nori/10 transition group-hover:bg-nori/0" />

              <div className="relative flex h-14 w-14 items-center justify-center rounded-[4px] bg-paper text-vein transition group-hover:bg-signal group-hover:text-reservoir">
                <Icon size={30} strokeWidth={1.8} />
              </div>

              <div className="relative">
                <span className="mb-5 block h-px w-full bg-mist/18" />
                <span className="block text-3xl font-black leading-tight text-paper">{label}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
