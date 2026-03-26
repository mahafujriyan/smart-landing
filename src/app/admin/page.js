import Link from "next/link";

import { getOrderStats, listOrders } from "@/lib/order-store";

export const metadata = {
  title: "Admin Dashboard",
  description: "View order metrics, pipeline status, and customer details.",
};

function currency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export default async function AdminPage() {
  const [stats, orders] = await Promise.all([getOrderStats(), listOrders()]);

  return (
    <main className="shell py-14 md:py-20">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-primary">Admin Dashboard</p>
          <h1 className="mt-4 text-4xl font-semibold md:text-5xl">Order overview and pipeline visibility</h1>
        </div>
        <Link href="/" className="text-sm text-muted underline-offset-4 hover:underline">
          Return to landing page
        </Link>
      </div>

      <section className="mt-10 grid gap-5 md:grid-cols-4">
        <article className="glass rounded-[28px] p-5">
          <p className="text-sm text-muted">Total Orders</p>
          <p className="mt-3 text-4xl font-semibold">{stats.totalOrders}</p>
        </article>
        <article className="glass rounded-[28px] p-5">
          <p className="text-sm text-muted">Today Orders</p>
          <p className="mt-3 text-4xl font-semibold">{stats.todayOrders}</p>
        </article>
        <article className="glass rounded-[28px] p-5">
          <p className="text-sm text-muted">Monthly Orders</p>
          <p className="mt-3 text-4xl font-semibold">{stats.monthlyOrders}</p>
        </article>
        <article className="glass rounded-[28px] p-5">
          <p className="text-sm text-muted">Projected Revenue</p>
          <p className="mt-3 text-4xl font-semibold">{currency(stats.projectedRevenue)}</p>
        </article>
      </section>

      <section className="mt-10 grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="glass overflow-hidden rounded-[32px]">
          <div className="border-b border-white/8 px-6 py-5">
            <h2 className="text-2xl font-semibold">Orders Table</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-white/4 text-muted">
                <tr>
                  <th className="px-6 py-4 font-medium">Product</th>
                  <th className="px-6 py-4 font-medium">Budget</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Customer</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-t border-white/6 align-top">
                    <td className="px-6 py-5">
                      <p className="font-medium text-white">{order.productName}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.25em] text-primary">
                        {order.category}
                      </p>
                    </td>
                    <td className="px-6 py-5 text-muted">{currency(order.budget)}</td>
                    <td className="px-6 py-5">
                      <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs uppercase tracking-[0.25em] text-primary">
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-muted">
                      {order.customer?.name ? order.customer.name : "Awaiting checkout"}
                    </td>
                  </tr>
                ))}
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center text-muted">
                      No orders yet. Create one from the landing page.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>

        <aside className="glass rounded-[32px] p-6">
          <h2 className="text-2xl font-semibold">Latest Order Details</h2>
          {orders[0] ? (
            <div className="mt-6 space-y-4 text-sm text-muted">
              <div className="rounded-[24px] border border-white/8 bg-black/20 p-5">
                <p className="font-mono text-xs uppercase tracking-[0.25em] text-primary">
                  {orders[0].id}
                </p>
                <h3 className="mt-3 text-xl font-semibold text-white">{orders[0].productName}</h3>
                <p className="mt-3 leading-7">Budget {currency(orders[0].budget)}</p>
              </div>
              <div className="rounded-[24px] border border-white/8 bg-black/20 p-5">
                <p className="text-white">Customer Information</p>
                <p className="mt-3 leading-7">
                  {orders[0].customer?.name || "Not submitted yet"}
                </p>
                <p className="leading-7">{orders[0].customer?.email || "-"}</p>
                <p className="leading-7">{orders[0].customer?.phone || "-"}</p>
                <p className="leading-7">{orders[0].customer?.location || "-"}</p>
              </div>
            </div>
          ) : (
            <p className="mt-6 text-sm leading-7 text-muted">
              Once an order is created, the latest order snapshot appears here.
            </p>
          )}
        </aside>
      </section>
    </main>
  );
}
