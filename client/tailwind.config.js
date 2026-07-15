export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        reservoir: "#071713",
        nori: "#12382b",
        vein: "#2f7d4a",
        mist: "#dcefe6",
        signal: "#b8e36f",
        waterline: "#7db9b3",
        paper: "#f3f7ee",
      },
      fontFamily: {
        display: ["Fraunces", "Georgia", "serif"],
        ui: ["Manrope", "ui-sans-serif", "system-ui"],
      },
      boxShadow: {
        field: "0 22px 60px rgba(1, 10, 7, 0.36)",
      },
    },
  },
  plugins: [],
};
