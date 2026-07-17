import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect } from "react";
import AttractScreen from "./components/AttractScreen.jsx";
import BlueprintScreen from "./components/BlueprintScreen.jsx";
import LeadCaptureScreen from "./components/LeadCaptureScreen.jsx";
import QuizScreen from "./components/QuizScreen.jsx";
import { KioskProvider, useKiosk } from "./context/KioskContext.jsx";
import { preloadAssets } from "./utils/assets.js";
import { startLeadSync } from "./utils/localStorageSync.js";

const screens = {
  attract: AttractScreen,
  quiz: QuizScreen,
  lead: LeadCaptureScreen,
  blueprint: BlueprintScreen,
};

function Shell() {
  const { screen } = useKiosk();
  const CurrentScreen = screens[screen];

  useEffect(() => {
    preloadAssets();
    return startLeadSync();
  }, []);

  return (
    <main className="screen-bg min-h-dvh w-full overflow-x-hidden md:h-screen md:overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={screen}
          className="min-h-dvh w-full md:h-full"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -18 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          <CurrentScreen />
        </motion.div>
      </AnimatePresence>
    </main>
  );
}

export default function App() {
  return (
    <KioskProvider>
      <Shell />
    </KioskProvider>
  );
}
