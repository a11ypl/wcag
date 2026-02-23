import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { fetchClientDocuments } from '@/lib/api';
import { DocumentsTable } from '@/components/dashboard/documents-table';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.accessToken) {
    redirect('/login?callbackUrl=/dashboard');
  }

  const documents = await fetchClientDocuments(session.accessToken);

  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-6 py-8">
      <header className="rounded-2xl border border-[var(--surface-border)] bg-[var(--surface)] p-6 shadow-sm">
        <p className="text-xs uppercase tracking-[0.16em] text-ink/60">Client dashboard</p>
        <h1 className="mt-2 font-heading text-3xl text-ink">Current partner documents</h1>
        <p className="mt-2 text-sm text-ink/70">
          Visible scope: <span className="font-semibold">{session.role}</span>
        </p>
      </header>

      <section className="mt-6">
        <DocumentsTable documents={documents} accessToken={session.accessToken} />
      </section>
    </main>
  );
}
