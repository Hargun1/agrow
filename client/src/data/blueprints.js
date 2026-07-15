export const blueprints = {
  "Compact (10-20 sq ft)": {
    hardwareName: "The Smart Vertical Tower (NeoX Series)",
    // Pexels, Bulat843: free-to-use vertical hydroponic lettuce farm photo. Swap for final Happhygreenz product photography when available.
    hardwareImage: "/assets/vertical-rack.jpg",
    yield: "5-8 kg of fresh greens/month",
    yieldScore: 38,
    bullets: ["Ultra-compact vertical aeroponics", "Zero soil, maximum yield", "Fits in 10 sq ft"],
  },
  "Mid-Scale (50-200 sq ft)": {
    hardwareName: "Happhygreenz Indoor Modular Rack",
    // Pexels, Emily Bow Pearce: free-to-use indoor LED vertical farm photo. Swap for final Happhygreenz product photography when available.
    hardwareImage: "/assets/indoor-led-farm.jpg",
    yield: "Continuous daily harvest",
    yieldScore: 68,
    bullets: ["Aesthetic indoor farming arrays", "Boosts employee wellness", "Scalable modular design"],
  },
  "Commercial (1 Acre+)": {
    hardwareName: "Automated Commercial Greenhouse",
    // Pexels, S. Minh: free-to-use commercial greenhouse lettuce bed photo. Swap for final Happhygreenz product photography when available.
    hardwareImage: "/assets/commercial-greenhouse.jpg",
    yield: "Commercial-grade tonnage",
    yieldScore: 94,
    bullets: ["Fully automated climate control", "Predictable, high-margin ROI", "Engineered for hospitality and retail"],
  },
};

export function getBlueprint(scale) {
  return blueprints[scale] || blueprints["Compact (10-20 sq ft)"];
}
