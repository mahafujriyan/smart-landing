import { getOrderById, updateOrder } from "@/lib/order-store";
import { validateCheckoutPayload, validateStatusUpdate } from "@/lib/order-utils";

export async function GET(_request, { params }) {
  const { id } = await params;
  const order = await getOrderById(id);

  if (!order) {
    return Response.json({ error: "Order not found." }, { status: 404 });
  }

  return Response.json({ order });
}

export async function PATCH(request, { params }) {
  const { id } = await params;
  const payload = await request.json();
  const existing = await getOrderById(id);
  const isStatusOnly = typeof payload?.status === "string" && !payload?.name;
  const result = isStatusOnly
    ? validateStatusUpdate(payload, existing)
    : validateCheckoutPayload(payload, existing);

  if (!result.ok) {
    return Response.json({ error: result.error }, { status: existing ? 400 : 404 });
  }

  const order = await updateOrder(id, result.value);
  return Response.json({ order });
}
