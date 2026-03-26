import { randomUUID } from "node:crypto";

import { getProductById } from "@/lib/products";

const VALID_STATUSES = new Set(["pending", "checkout", "completed"]);
const VALID_CATEGORIES = new Set([
  "Smartphone",
  "Wearable",
  "Audio",
  "Tablet",
  "Accessories",
]);

function sanitizeString(value, maxLength = 160) {
  return String(value ?? "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

function sanitizeOptionalString(value, maxLength = 300) {
  const cleaned = sanitizeString(value, maxLength);
  return cleaned || "";
}

function sanitizeNumber(value, fallback = 1) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function validateOrderDraft(payload) {
  const productId = sanitizeString(payload?.productId, 60);
  const product = getProductById(productId);

  if (!product) {
    return { ok: false, error: "Select a valid product." };
  }

  const quantity = Math.max(1, Math.min(25, sanitizeNumber(payload?.quantity, 1)));
  const budget = Math.max(1, Math.min(100000, sanitizeNumber(payload?.budget, product.priceFrom)));
  const category = sanitizeString(payload?.category || product.category, 40);

  if (!VALID_CATEGORIES.has(category)) {
    return { ok: false, error: "Select a valid category." };
  }

  const image = sanitizeOptionalString(payload?.image, 5000);
  const notes = sanitizeOptionalString(payload?.notes, 400);

  return {
    ok: true,
    value: {
      id: randomUUID(),
      productId: product.id,
      productName: product.name,
      quantity,
      budget,
      category,
      image,
      notes,
      customer: {
        name: "",
        email: "",
        phone: "",
        whatsapp: "",
        location: "",
      },
      status: "pending",
      createdAt: new Date().toISOString(),
    },
  };
}

export function validateCheckoutPayload(payload, previousOrder) {
  if (!previousOrder) {
    return { ok: false, error: "Order not found." };
  }

  const name = sanitizeString(payload?.name, 80);
  const email = sanitizeString(payload?.email, 120).toLowerCase();
  const phone = sanitizeString(payload?.phone, 30);
  const whatsapp = sanitizeString(payload?.whatsapp || phone, 30);
  const location = sanitizeString(payload?.location, 220);

  if (name.length < 2) {
    return { ok: false, error: "Enter your full name." };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: "Enter a valid email address." };
  }

  if (!/^[+\d][\d\s-]{7,}$/.test(phone)) {
    return { ok: false, error: "Enter a valid phone number." };
  }

  if (location.length < 6) {
    return { ok: false, error: "Enter a delivery address." };
  }

  return {
    ok: true,
    value: {
      ...previousOrder,
      customer: {
        name,
        email,
        phone,
        whatsapp,
        location,
      },
      status: "checkout",
    },
  };
}

export function validateStatusUpdate(payload, previousOrder) {
  if (!previousOrder) {
    return { ok: false, error: "Order not found." };
  }

  const status = sanitizeString(payload?.status, 30);

  if (!VALID_STATUSES.has(status)) {
    return { ok: false, error: "Invalid status value." };
  }

  return {
    ok: true,
    value: {
      ...previousOrder,
      status,
    },
  };
}
