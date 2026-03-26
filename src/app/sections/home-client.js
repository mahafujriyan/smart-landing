"use client";

import { startTransition, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const categories = ["Smartphone", "Wearable", "Audio", "Tablet", "Accessories"];

const stats = [
  { label: "Conversion-first layout", value: "12 blocks" },
  { label: "Fast quote creation", value: "< 60 sec" },
  { label: "Priority shipping support", value: "24/7" },
];

const steps = [
  "Choose Product",
  "Fill Order Form",
  "Submit Order",
  "Checkout",
];

function currency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

const fallbackVisual = {
  accent: "#0dffb3",
  glow: "#0dffb366",
  label: "ON",
};

function ProductVisual({ product, priority = false }) {
  const visual = product?.visual ?? fallbackVisual;
  const category = product?.category ?? "Product";
  const imageSrc = product?.image ?? "/ordernext.png";
  const imagePosition = product?.imagePosition ?? "center";

  return (
    <div
      className="relative h-full w-full overflow-hidden"
      style={{
        background: `radial-gradient(circle at top, ${visual.glow}, transparent 42%), linear-gradient(180deg, rgba(5,18,12,0.88), rgba(2,10,7,1))`,
      }}
    >
      <Image
        src={imageSrc}
        alt={product?.name ?? "Product image"}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-cover opacity-80"
        style={{ objectPosition: imagePosition }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.08),rgba(0,0,0,0.5)_55%,rgba(0,0,0,0.9))]" />
      <div
        className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
        style={{ backgroundColor: visual.glow }}
      />
      <div
        className="absolute inset-x-6 top-6 rounded-full border px-3 py-2 text-center text-xs uppercase tracking-[0.35em]"
        style={{
          borderColor: `${visual.accent}55`,
          color: visual.accent,
          background: "rgba(0, 0, 0, 0.35)",
          backdropFilter: "blur(10px)",
        }}
      >
        {category}
      </div>
      <div
        className="absolute bottom-5 right-5 flex h-20 w-20 items-center justify-center rounded-[24px] border text-2xl font-semibold"
        style={{
          borderColor: `${visual.accent}55`,
          boxShadow: `0 0 40px ${visual.glow}`,
          color: visual.accent,
          background: "rgba(0,0,0,0.42)",
          backdropFilter: "blur(10px)",
        }}
      >
        {visual.label}
      </div>
      {priority ? (
        <div className="absolute inset-0 border border-white/5" aria-hidden="true" />
      ) : null}
    </div>
  );
}

function ProductCard({ product, onOrder }) {
  return (
    <article className="glass group relative overflow-hidden rounded-[28px] p-4 transition duration-300 hover:-translate-y-1 hover:border-accent/40">
      <div className="relative aspect-[4/3] overflow-hidden rounded-[22px] border border-white/8 bg-black/20">
        <div className="transition duration-500 group-hover:scale-108">
          <ProductVisual product={product} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
      </div>
      <div className="mt-5 space-y-3">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-primary">{product.category}</p>
            <h3 className="mt-2 text-2xl font-semibold">{product.name}</h3>
          </div>
          <p className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm text-primary">
            {currency(product.priceFrom)}
          </p>
        </div>
        <p className="text-sm leading-7 text-muted">{product.blurb}</p>
        <button
          type="button"
          onClick={() => onOrder(product.id)}
          className="w-full rounded-full bg-primary px-5 py-3 font-medium text-black transition hover:bg-accent"
        >
          Order Now
        </button>
      </div>
    </article>
  );
}

function OrderModal({ open, products, productId, onClose }) {
  const defaultProduct = useMemo(
    () => products.find((item) => item.id === productId) ?? products[0],
    [productId, products],
  );
  const initialForm = {
    productId: defaultProduct.id,
    quantity: 1,
    budget: defaultProduct.priceFrom,
    category: defaultProduct.category,
    notes: "",
    image: "",
  };
  const [step, setStep] = useState("form");
  const [submitting, setSubmitting] = useState(false);
  const [preview, setPreview] = useState("");
  const [serverError, setServerError] = useState("");
  const [createdOrder, setCreatedOrder] = useState(null);
  const [form, setForm] = useState(initialForm);

  if (!open) {
    return null;
  }

  const selectedProduct = products.find((item) => item.id === form.productId) ?? defaultProduct;

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setServerError("");

    const response = await fetch("/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await response.json();

    if (!response.ok) {
      setServerError(data.error || "Failed to create order.");
      setSubmitting(false);
      return;
    }

    startTransition(() => {
      setCreatedOrder(data.order);
      setStep("success");
      setSubmitting(false);
    });
  }

  function handleFileChange(event) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      setPreview(result);
      setForm((current) => ({ ...current, image: result }));
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4 backdrop-blur-md">
      <div className="glass relative max-h-[92vh] w-full max-w-3xl overflow-auto rounded-[32px] p-6 md:p-8">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full border border-white/10 px-3 py-2 text-sm text-muted transition hover:text-white"
        >
          Close
        </button>

        {step === "form" ? (
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-primary">Custom Order</p>
              <h2 className="mt-3 text-3xl font-semibold">Configure your premium order request</h2>
              <p className="mt-4 max-w-xl text-sm leading-7 text-muted">
                This modal captures the brief before checkout so the customer intent is stored early.
              </p>
              <form className="mt-8 grid gap-4" onSubmit={handleSubmit}>
                <label className="grid gap-2">
                  <span className="text-sm text-muted">Product Name</span>
                  <select
                    value={form.productId}
                    onChange={(event) => {
                      const product = products.find((item) => item.id === event.target.value);
                      setForm((current) => ({
                        ...current,
                        productId: event.target.value,
                        category: product?.category || current.category,
                        budget: product?.priceFrom || current.budget,
                      }));
                    }}
                    className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none transition focus:border-primary"
                  >
                    {products.map((product) => (
                      <option key={product.id} value={product.id} className="bg-slate-950">
                        {product.name}
                      </option>
                    ))}
                  </select>
                </label>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="grid gap-2">
                    <span className="text-sm text-muted">Quantity</span>
                    <input
                      type="number"
                      min="1"
                      max="25"
                      value={form.quantity}
                      onChange={(event) =>
                        setForm((current) => ({ ...current, quantity: event.target.value }))
                      }
                      className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none transition focus:border-primary"
                    />
                  </label>
                  <label className="grid gap-2">
                    <span className="text-sm text-muted">Estimated Budget</span>
                    <input
                      type="number"
                      min="1"
                      value={form.budget}
                      onChange={(event) =>
                        setForm((current) => ({ ...current, budget: event.target.value }))
                      }
                      className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none transition focus:border-primary"
                    />
                  </label>
                </div>

                <label className="grid gap-2">
                  <span className="text-sm text-muted">Category</span>
                  <select
                    value={form.category}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, category: event.target.value }))
                    }
                    className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none transition focus:border-primary"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category} className="bg-slate-950">
                        {category}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="grid gap-2">
                  <span className="text-sm text-muted">Image Upload</span>
                  <div className="rounded-[24px] border border-dashed border-primary/35 bg-black/20 p-4">
                    <input type="file" accept="image/*" onChange={handleFileChange} />
                    <p className="mt-2 text-xs leading-6 text-muted">
                      Drag-and-drop is supported by the browser input. Selected image is previewed before submit.
                    </p>
                    {preview ? (
                      <div className="relative mt-4 aspect-[4/3] overflow-hidden rounded-2xl border border-white/10">
                        <Image src={preview} alt="Upload preview" fill className="object-cover" />
                      </div>
                    ) : null}
                  </div>
                </label>

                <label className="grid gap-2">
                  <span className="text-sm text-muted">Notes</span>
                  <textarea
                    rows="4"
                    value={form.notes}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, notes: event.target.value }))
                    }
                    className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none transition focus:border-primary"
                    placeholder="Share sizing, color, delivery, or customization notes."
                  />
                </label>

                {serverError ? <p className="text-sm text-rose-300">{serverError}</p> : null}

                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-full bg-primary px-5 py-3 font-medium text-black transition hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? "Creating Order..." : "Submit Order"}
                </button>
              </form>
            </div>

            <aside className="rounded-[28px] border border-white/10 bg-black/20 p-5">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[24px]">
                <ProductVisual product={selectedProduct} />
              </div>
              <p className="mt-5 text-xs uppercase tracking-[0.3em] text-primary">
                Selected Product
              </p>
              <h3 className="mt-3 text-2xl font-semibold">{selectedProduct.name}</h3>
              <p className="mt-3 text-sm leading-7 text-muted">{selectedProduct.blurb}</p>
              <div className="mt-6 grid gap-3 text-sm text-muted">
                <p className="flex items-center justify-between rounded-2xl border border-white/8 px-4 py-3">
                  <span>Category</span>
                  <span className="text-white">{selectedProduct.category}</span>
                </p>
                <p className="flex items-center justify-between rounded-2xl border border-white/8 px-4 py-3">
                  <span>Starts at</span>
                  <span className="text-white">{currency(selectedProduct.priceFrom)}</span>
                </p>
                <p className="flex items-center justify-between rounded-2xl border border-white/8 px-4 py-3">
                  <span>Lead time</span>
                  <span className="text-white">{selectedProduct.leadTime}</span>
                </p>
              </div>
            </aside>
          </div>
        ) : (
          <div className="space-y-6 text-center">
            <p className="text-xs uppercase tracking-[0.35em] text-primary">Order Created</p>
            <h2 className="text-3xl font-semibold">Your order brief is locked in</h2>
            <p className="mx-auto max-w-xl text-sm leading-7 text-muted">
              The system created an order record and generated a reference ID before checkout.
            </p>
            <div className="mx-auto max-w-xl rounded-[28px] border border-primary/20 bg-black/20 p-6 text-left">
              <p className="text-xs uppercase tracking-[0.35em] text-muted">Order ID</p>
              <p className="mt-2 font-mono text-lg text-primary">{createdOrder?.id}</p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <p className="rounded-2xl border border-white/8 px-4 py-3 text-sm text-muted">
                  Product: <span className="text-white">{createdOrder?.productName}</span>
                </p>
                <p className="rounded-2xl border border-white/8 px-4 py-3 text-sm text-muted">
                  Quantity: <span className="text-white">{createdOrder?.quantity}</span>
                </p>
              </div>
            </div>
            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href={`/checkout?order=${createdOrder?.id}`}
                className="rounded-full bg-primary px-6 py-3 font-medium text-black transition hover:bg-accent"
              >
                Proceed to Checkout
              </Link>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-white/10 px-6 py-3 text-sm text-muted transition hover:text-white"
              >
                Keep Browsing
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function HomeClient({ products }) {
  const [activeProduct, setActiveProduct] = useState(products[0]?.id ?? "");
  const [isModalOpen, setIsModalOpen] = useState(false);

  function openOrder(productId) {
    setActiveProduct(productId);
    setIsModalOpen(true);
  }

  return (
    <main className="pb-20">
      <header className="sticky top-0 z-40 border-b border-white/6 bg-background/80 backdrop-blur-xl">
        <div className="shell flex items-center justify-between gap-6 py-4">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex items-center justify-center overflow-hidden rounded-2xl">
              <Image
                src="/ordernex-logo-1.png"
                alt="OrderNex logo"
                width={140}
                height={120}
                priority
              />
            </span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm text-muted md:flex">
            <a href="#home">Home</a>
            <a href="#products">Products</a>
            <a href="#how-it-works">How It Works</a>
            <a href="#contact">Contact</a>
          </nav>
          <button
            type="button"
            onClick={() => openOrder(products[0]?.id)}
            className="rounded-full bg-primary px-5 py-3 text-sm font-medium text-black transition hover:bg-accent"
          >
            Order Now
          </button>
        </div>
      </header>

      <section id="home" className="shell relative overflow-hidden pt-12 md:pt-18">
        <div className="grid-fade absolute inset-0 -z-10 opacity-70" />
        <div className="grid items-center gap-12 py-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.45em] text-primary">Premium Smart Devices</p>
            <h1 className="mt-5 max-w-3xl text-5xl font-semibold leading-[0.95] md:text-7xl">
             A smart ordering platform crafted to convert interest into seamless purchases.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-muted md:text-lg">
              Showcase flagship devices, capture custom order intent, and route buyers directly into
              checkout with a cleaner, faster flow than generic storefront templates.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => openOrder(products[0]?.id)}
                className="rounded-full bg-primary px-6 py-3 font-medium text-black transition hover:bg-accent"
              >
                Order Now
              </button>
              <a
                href="#video"
                className="rounded-full border border-white/10 px-6 py-3 text-center text-sm text-muted transition hover:text-white"
              >
                Watch Video
              </a>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {stats.map((item) => (
                <div key={item.label} className="glass rounded-[24px] p-4">
                  <p className="text-2xl font-semibold text-accent">{item.value}</p>
                  <p className="mt-2 text-sm leading-6 text-muted">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-x-10 top-10 h-24 rounded-full bg-primary/25 blur-3xl" />
            <div className="glass relative rounded-[36px] p-4">
              <div className="grid gap-4 sm:grid-cols-2">
                {products.slice(0, 2).map((product, index) => (
                  <div
                    key={product.id}
                    className={`relative overflow-hidden rounded-[28px] border border-white/10 ${
                      index === 0 ? "sm:row-span-2 sm:min-h-[430px]" : "min-h-[200px]"
                    }`}
                  >
                    <ProductVisual product={product} priority />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-5">
                      <p className="text-xs uppercase tracking-[0.3em] text-primary">
                        {product.category}
                      </p>
                      <h2 className="mt-2 text-2xl font-semibold">{product.name}</h2>
                    </div>
                  </div>
                ))}
                <div className="glass rounded-[28px] p-5">
                  <p className="text-xs uppercase tracking-[0.3em] text-primary">High Intent Funnel</p>
                  <p className="mt-3 text-lg leading-8 text-white">
                    Premium layout, inline credibility, and an order modal that captures demand before drop-off.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="video" className="shell py-12 md:py-16">
        <div className="glass rounded-[36px] p-6 md:p-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs uppercase tracking-[0.35em] text-primary">How It Works</p>
            <h2 className="mt-4 text-3xl font-semibold md:text-5xl">Show the product story before the ask</h2>
            <p className="mt-4 text-sm leading-7 text-muted md:text-base">
              Use a concise explainer video to reduce hesitation and frame the premium buying experience.
            </p>
          </div>
          <div className="mt-8 overflow-hidden rounded-[28px] border border-white/10">
            <div className="aspect-video">
              <iframe
                className="h-full w-full"
                src="https://www.youtube.com/embed/ScMzIvxBSi4?si=y8P7b3R2dPZ9u0q4"
                title="How Smart Landing Works"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </section>

      <section id="products" className="shell py-12 md:py-16">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-primary">Featured Products</p>
            <h2 className="mt-4 text-3xl font-semibold md:text-5xl">Curated devices for a higher-value order mix</h2>
          </div>
          <Link href="/admin" className="hidden text-sm text-muted underline-offset-4 hover:underline md:block">
            Open admin dashboard
          </Link>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} onOrder={openOrder} />
          ))}
        </div>
      </section>

      <section id="how-it-works" className="shell py-12 md:py-16">
        <div className="grid gap-5 md:grid-cols-4">
          {steps.map((step, index) => (
            <article key={step} className="glass rounded-[28px] p-5">
              <p className="font-mono text-sm text-primary">0{index + 1}</p>
              <h3 className="mt-4 text-2xl font-semibold">{step}</h3>
              <p className="mt-3 text-sm leading-7 text-muted">
                {index === 0
                  ? "Lead with a focused product grid and direct action."
                  : index === 1
                    ? "Capture budget, quantity, notes, and upload intent."
                    : index === 2
                      ? "Generate an order ID and save the request immediately."
                      : "Collect customer details and move the order into checkout status."}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section id="contact" className="shell py-12 md:py-16">
        <div className="glass grid gap-8 rounded-[36px] p-6 md:grid-cols-[1.1fr_0.9fr] md:p-8">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-primary">Contact</p>
            <h2 className="mt-4 text-3xl font-semibold md:text-5xl">Ready to launch a product-focused order funnel?</h2>
            <p className="mt-5 max-w-2xl text-sm leading-8 text-muted md:text-base">
              This build includes the premium landing page, custom order capture, checkout handoff,
              admin dashboard, SEO metadata, and server-side validation.
            </p>
          </div>
          <div className="rounded-[28px] border border-white/10 bg-black/20 p-5">
            <p className="text-sm leading-7 text-muted">Primary CTA</p>
            <button
              type="button"
              onClick={() => openOrder(products[0]?.id)}
              className="mt-4 w-full rounded-full bg-accent px-5 py-3 font-medium text-black transition hover:bg-primary"
            >
              Start Custom Order
            </button>
            <div className="mt-6 space-y-3 text-sm text-muted">
              <p>Support: hello@ordernex.demo</p>
              <p>WhatsApp: +1 202 555 0142</p>
              <p>Admin Route: /admin</p>
            </div>
          </div>
        </div>
      </section>

      <OrderModal
        key={activeProduct}
        open={isModalOpen}
        productId={activeProduct}
        products={products}
        onClose={() => setIsModalOpen(false)}
      />
    </main>
  );
}
