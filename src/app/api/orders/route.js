import { headers } from "next/headers";

import { createOrder, listOrders } from "@/lib/order-store";
import { validateOrderDraft } from "@/lib/order-utils";
import { checkRateLimit } from "@/lib/rate-limit";

export async function GET() {
  const orders = await listOrders();
  return Response.json({ orders });
}

export async function POST(request) {
  const headerStore = await headers();
  const forwardedFor = headerStore.get("x-forwarded-for") ?? "local";

  if (!checkRateLimit(forwardedFor)) {
    return Response.json(
      { error: "Too many requests. Please wait a moment and try again." },
      { status: 429 },
    );
  }

  const payload = await request.json();
  const result = validateOrderDraft(payload);

  if (!result.ok) {
    return Response.json({ error: result.error }, { status: 400 });
  }

  const order = await createOrder(result.value);
  return Response.json({ order }, { status: 201 });
}
