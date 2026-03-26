import Link from "next/link";

export default function NotFound() {
  return (
    <main className="shell flex min-h-screen items-center justify-center py-20">
      <div className="glass max-w-xl rounded-[32px] p-8 text-center">
        <p className="text-xs uppercase tracking-[0.35em] text-primary">404</p>
        <h1 className="mt-4 text-4xl font-semibold">Page not found</h1>
        <p className="mt-4 text-sm leading-7 text-muted">
          The route could not be resolved. Use the landing page or admin dashboard links to continue.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex rounded-full bg-primary px-5 py-3 font-medium text-black"
        >
          Return Home
        </Link>
      </div>
    </main>
  );
}
