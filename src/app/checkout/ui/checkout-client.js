"use client";

import { useState } from "react";
import Link from "next/link";

function currency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function CheckoutClient({ order }) {
  const [form, setForm] = useState({
    name: order.customer?.name || "",
    email: order.customer?.email || "",
    phone: order.customer?.phone || "",
    whatsapp: order.customer?.whatsapp || "",
    location: order.customer?.location || "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [complete, setComplete] = useState(order.status === "checkout");

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const payload = {
      ...form,
      whatsapp: form.whatsapp || form.phone,
    };

    const response = await fetch(`/api/orders/${order.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.error || "Failed to complete checkout.");
      setLoading(false);
      return;
    }

    setLoading(false);
    setComplete(true);
  }

  return (
    <main className="shell py-14 md:py-20">
      <Link href="/" className="text-sm text-muted underline-offset-4 hover:underline">
        Back to landing page
      </Link>
      <div className="mt-6 grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="glass rounded-[32px] p-6 md:p-8">
          <p className="text-xs uppercase tracking-[0.35em] text-primary">Checkout</p>
          <h1 className="mt-4 text-4xl font-semibold">Finish the customer details</h1>
          <p className="mt-4 text-sm leading-7 text-muted">
            Order reference <span className="font-mono text-primary">{order.id}</span>
          </p>

          {complete ? (
            <div className="mt-8 rounded-[28px] border border-primary/20 bg-primary/10 p-5">
              <h2 className="text-2xl font-semibold">Checkout complete</h2>
              <p className="mt-3 text-sm leading-7 text-muted">
                The order is now in checkout status and visible in the admin dashboard.
              </p>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/admin"
                  className="rounded-full bg-primary px-5 py-3 text-center font-medium text-black"
                >
                  Open Admin Dashboard
                </Link>
                <Link
                  href="/"
                  className="rounded-full border border-white/10 px-5 py-3 text-center text-sm text-muted"
                >
                  Return Home
                </Link>
              </div>
            </div>
          ) : (
            <form className="mt-8 grid gap-4" onSubmit={handleSubmit}>
              {[
                ["name", "Name", "text"],
                ["email", "Email", "email"],
                ["phone", "Phone", "tel"],
                ["whatsapp", "WhatsApp", "tel"],
              ].map(([key, label, type]) => (
                <label key={key} className="grid gap-2">
                  <span className="text-sm text-muted">{label}</span>
                  <input
                    type={type}
                    value={form[key]}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, [key]: event.target.value }))
                    }
                    className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none transition focus:border-primary"
                    required={key !== "whatsapp"}
                  />
                </label>
              ))}

              <label className="grid gap-2">
                <span className="text-sm text-muted">Address</span>
                <textarea
                  rows="4"
                  value={form.location}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, location: event.target.value }))
                  }
                  className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none transition focus:border-primary"
                  required
                />
              </label>

              {error ? <p className="text-sm text-rose-300">{error}</p> : null}

              <button
                type="submit"
                disabled={loading}
                className="rounded-full bg-primary px-5 py-3 font-medium text-black transition hover:bg-accent disabled:opacity-60"
              >
                {loading ? "Saving..." : "Confirm Checkout"}
              </button>
            </form>
          )}
        </section>

        <aside className="glass rounded-[32px] p-6 md:p-8">
          <p className="text-xs uppercase tracking-[0.35em] text-primary">Order Summary</p>
          <div className="mt-6 space-y-4">
            <div className="rounded-[26px] border border-white/10 bg-black/20 p-5">
              <h2 className="text-2xl font-semibold">{order.productName}</h2>
              <p className="mt-3 text-sm leading-7 text-muted">
                Category: {order.category}
              </p>
            </div>
            <div className="grid gap-3 text-sm text-muted">
              <p className="flex items-center justify-between rounded-2xl border border-white/8 px-4 py-3">
                <span>Quantity</span>
                <span className="text-white">{order.quantity}</span>
              </p>
              <p className="flex items-center justify-between rounded-2xl border border-white/8 px-4 py-3">
                <span>Estimated budget</span>
                <span className="text-white">{currency(order.budget)}</span>
              </p>
              <p className="flex items-center justify-between rounded-2xl border border-white/8 px-4 py-3">
                <span>Status</span>
                <span className="text-white capitalize">{order.status}</span>
              </p>
            </div>
            {order.notes ? (
              <div className="rounded-[24px] border border-white/8 bg-black/20 p-5">
                <p className="text-sm leading-7 text-muted">{order.notes}</p>
              </div>
            ) : null}
          </div>
        </aside>
      </div>
    </main>
  );
}
