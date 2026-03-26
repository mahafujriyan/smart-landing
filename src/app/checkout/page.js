import { notFound } from "next/navigation";

import { getOrderById } from "@/lib/order-store";

import CheckoutClient from "./ui/checkout-client";

export const metadata = {
  title: "Checkout",
  description: "Finalize customer details and move the order into checkout status.",
};

export default async function CheckoutPage({ searchParams }) {
  const { order: orderId } = await searchParams;

  if (!orderId || typeof orderId !== "string") {
    notFound();
  }

  const order = await getOrderById(orderId);

  if (!order) {
    notFound();
  }

  return <CheckoutClient order={order} />;
}
