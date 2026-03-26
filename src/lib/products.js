export const products = [
  {
    id: "aurora-x-phone",
    name: "Aurora X Phone",
    category: "Smartphone",
    priceFrom: 899,
    leadTime: "2 to 4 days",
    blurb: "Flagship-grade camera stack, matte alloy frame, and all-day battery.",
    image:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80",
    imagePosition: "center",
    visual: {
      accent: "#0dffb3",
      glow: "#0dffb366",
      label: "AX",
    },
  },
  {
    id: "pulse-pro-watch",
    name: "Pulse Pro Watch",
    category: "Wearable",
    priceFrom: 249,
    leadTime: "1 to 3 days",
    blurb: "AMOLED display, health sensors, and premium Milanese strap finish.",
    image:
      "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=1200&q=80",
    imagePosition: "center",
    visual: {
      accent: "#d8ff30",
      glow: "#d8ff3066",
      label: "PP",
    },
  },
  {
    id: "sonic-elite-headphones",
    name: "Sonic Elite Headphones",
    category: "Audio",
    priceFrom: 329,
    leadTime: "2 to 5 days",
    blurb: "Adaptive noise cancellation tuned for work, flights, and late-night focus.",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80",
    imagePosition: "center",
    visual: {
      accent: "#7cf4ff",
      glow: "#7cf4ff66",
      label: "SE",
    },
  },
  {
    id: "studio-tab-air",
    name: "Studio Tab Air",
    category: "Tablet",
    priceFrom: 599,
    leadTime: "3 to 6 days",
    blurb: "Ultra-light tablet with stylus support for design, notes, and streaming.",
    image:
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=1200&q=80",
    imagePosition: "center",
    visual: {
      accent: "#ffb86b",
      glow: "#ffb86b66",
      label: "ST",
    },
  },
];

export function getProductById(productId) {
  return products.find((product) => product.id === productId) ?? null;
}
