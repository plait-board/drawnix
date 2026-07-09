import { DrawnixExportedData } from '@drawnix/drawnix';

export type CloudDrawingSession = {
  id: string;
  editToken?: string;
  viewUrl: string;
  updatedAt?: string;
};

export type CreateCloudDrawingResult = CloudDrawingSession & {
  editToken: string;
};

const apiUrl = (path: string) => {
  return `/api/drawings${path}`;
};

export const getCloudDrawingIdFromLocation = (location: Location = window.location) => {
  const pathMatch = location.pathname.match(/^\/d\/([^/]+)$/);
  if (pathMatch) {
    return pathMatch[1];
  }
  return new URLSearchParams(location.search).get('drawing');
};

export const createCloudDrawing = async (
  data: DrawnixExportedData
): Promise<CreateCloudDrawingResult> => {
  const response = await fetch(apiUrl(''), {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  return parseJsonResponse<CreateCloudDrawingResult>(response);
};

export const updateCloudDrawing = async (
  session: CloudDrawingSession,
  data: DrawnixExportedData
): Promise<Pick<CloudDrawingSession, 'id' | 'updatedAt'>> => {
  if (!session.editToken) {
    throw new Error('This cloud drawing cannot be updated from this browser.');
  }

  const response = await fetch(apiUrl(`/${session.id}`), {
    method: 'PUT',
    headers: {
      authorization: `Bearer ${session.editToken}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  return parseJsonResponse<Pick<CloudDrawingSession, 'id' | 'updatedAt'>>(response);
};

export const loadCloudDrawing = async (id: string): Promise<DrawnixExportedData> => {
  const response = await fetch(apiUrl(`/${id}`));
  return parseJsonResponse<DrawnixExportedData>(response);
};

const parseJsonResponse = async <T>(response: Response): Promise<T> => {
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const message =
      data && typeof data.error === 'string' ? data.error : `Request failed: ${response.status}`;
    throw new Error(message);
  }
  return data as T;
};

