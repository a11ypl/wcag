'use client';

import { useState } from 'react';
import { requestDownloadUrl, type ClientDocument } from '@/lib/api';

export function DocumentsTable({
  documents,
  accessToken,
}: {
  documents: ClientDocument[];
  accessToken: string;
}) {
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleDownload(documentId: number) {
    setError(null);
    setLoadingId(documentId);

    try {
      const result = await requestDownloadUrl(documentId, accessToken);
      window.location.assign(result.downloadUrl);
    } catch {
      setError('Could not generate secure download link.');
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--surface-border)] bg-white shadow-sm">
      <table className="min-w-full text-sm">
        <thead className="bg-[#f3f0e8] text-left text-ink">
          <tr>
            <th className="px-4 py-3">Title</th>
            <th className="px-4 py-3">Type</th>
            <th className="px-4 py-3">Version</th>
            <th className="px-4 py-3">Updated</th>
            <th className="px-4 py-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {documents.length === 0 ? (
            <tr>
              <td className="px-4 py-6 text-center text-ink/60" colSpan={5}>
                No documents available for your role.
              </td>
            </tr>
          ) : (
            documents.map((doc) => (
              <tr key={doc.documentId} className="border-t border-ink/10">
                <td className="px-4 py-3">{doc.title}</td>
                <td className="px-4 py-3">{doc.docType}</td>
                <td className="px-4 py-3">v{doc.versionNo}</td>
                <td className="px-4 py-3">
                  {new Date(doc.updatedAt).toLocaleString('pl-PL', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleDownload(doc.documentId)}
                    disabled={loadingId === doc.documentId}
                    className="rounded-md bg-ink px-3 py-2 text-xs font-semibold text-white disabled:opacity-50"
                  >
                    {loadingId === doc.documentId ? 'Preparing...' : 'Download'}
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      {error ? <p className="px-4 py-3 text-sm text-red-700">{error}</p> : null}
    </div>
  );
}
