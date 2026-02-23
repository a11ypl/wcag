import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6 text-center">
      <p className="rounded-full border border-ink/20 bg-white px-3 py-1 text-xs uppercase tracking-[0.18em] text-ink/70">
        Wlacz Wizje - Partner Hub
      </p>
      <h1 className="mt-6 font-heading text-4xl leading-tight text-ink sm:text-5xl">
        Secure document access for B2B partners
      </h1>
      <p className="mt-4 max-w-xl text-base text-ink/70">
        One source of truth for references, certificates, trainer profile, and offers.
      </p>
      <div className="mt-8 flex gap-3">
        <Link
          href="/login"
          className="rounded-lg bg-ink px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
        >
          Sign in
        </Link>
        <Link
          href="/dashboard"
          className="rounded-lg border border-ink/25 bg-white px-5 py-3 text-sm font-semibold text-ink transition hover:bg-ink/5"
        >
          Dashboard
        </Link>
      </div>
    </main>
  );
}
