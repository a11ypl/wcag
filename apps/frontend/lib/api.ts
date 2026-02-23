export type ClientDocument = {
  documentId: number;
  title: string;
  docType: string;
  versionNo: number;
  updatedAt: string;
};

type DownloadResponse = {
  downloadUrl: string;
  expiresAt: string;
};

export async function fetchClientDocuments(accessToken: string): Promise<ClientDocument[]> {
  const response = await fetch(`${process.env.BACKEND_API_URL}/api/client/documents`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('Could not fetch documents');
  }

  return response.json();
}

export async function requestDownloadUrl(
  documentId: number,
  accessToken: string,
): Promise<DownloadResponse> {
  const response = await fetch(
    `${process.env.BACKEND_API_URL}/api/client/documents/${documentId}/download`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error('Could not generate download URL');
  }

  return response.json();
}
