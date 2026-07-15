import { createContext, useContext, useMemo, useState } from "react";

const initialAnswers = {
  spaceType: "",
  primaryGoal: "",
  scale: "",
};

const initialLead = {
  fullName: "",
  companyName: "",
  whatsappNumber: "",
  email: "",
};

const KioskContext = createContext(null);

export function KioskProvider({ children }) {
  const [screen, setScreen] = useState("attract");
  const [answers, setAnswers] = useState(initialAnswers);
  const [lead, setLead] = useState(initialLead);

  const value = useMemo(
    () => ({
      screen,
      answers,
      lead,
      setScreen,
      setLead,
      setAnswer(key, value) {
        setAnswers((current) => ({ ...current, [key]: value }));
      },
      resetSession() {
        setAnswers(initialAnswers);
        setLead(initialLead);
        setScreen("attract");
      },
    }),
    [answers, lead, screen],
  );

  return <KioskContext.Provider value={value}>{children}</KioskContext.Provider>;
}

export function useKiosk() {
  const context = useContext(KioskContext);
  if (!context) {
    throw new Error("useKiosk must be used inside KioskProvider");
  }
  return context;
}
