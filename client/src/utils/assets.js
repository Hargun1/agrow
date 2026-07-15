const assets = [
  "/assets/greenhouse-lettuce.jpg",
  "/assets/quiz-home-balcony.jpg",
  "/assets/quiz-office-cafe.jpg",
  "/assets/quiz-hospitality.jpg",
  "/assets/vertical-rack.jpg",
  "/assets/indoor-led-farm.jpg",
  "/assets/commercial-greenhouse.jpg",
];

export function preloadAssets() {
  assets.forEach((asset) => {
    const image = new Image();
    image.src = asset;
  });
}
