export type Env = {
  DRAWNIX_DB: D1Database;
  DRAWNIX_BUCKET: R2Bucket;
};

export type DrawingRecord = {
  id: string;
  object_key: string;
  edit_token_hash: string;
  title: string | null;
  size_bytes: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export const MAX_DRAWING_BYTES = 2 * 1024 * 1024;
export const DRAWING_CONTENT_TYPE = 'application/vnd.drawnix+json; charset=utf-8';

export const jsonResponse = (body: unknown, init?: ResponseInit) => {
  const headers = new Headers(init?.headers);
  headers.set('content-type', 'application/json; charset=utf-8');
  return new Response(JSON.stringify(body), {
    ...init,
    headers,
  });
};

export const errorResponse = (status: number, message: string) => {
  return jsonResponse({ error: message }, { status });
};

export const parseDrawingPayload = async (request: Request) => {
  const text = await request.text();
  const size = new TextEncoder().encode(text).byteLength;

  if (size > MAX_DRAWING_BYTES) {
    return { error: errorResponse(413, 'Drawing is too large') };
  }

  let data: any;
  try {
    data = JSON.parse(text);
  } catch {
    return { error: errorResponse(400, 'Invalid JSON payload') };
  }

  if (
    !data ||
    data.type !== 'drawnix' ||
    !Array.isArray(data.elements) ||
    !data.viewport ||
    typeof data.viewport !== 'object'
  ) {
    return { error: errorResponse(400, 'Invalid Drawnix payload') };
  }

  return { data, text, size };
};

export const createId = () => {
  return randomBase64Url(18);
};

export const createEditToken = () => {
  return randomBase64Url(32);
};

export const objectKeyFor = (id: string) => {
  return `drawings/${id}.drawnix.json`;
};

export const hashToken = async (token: string) => {
  const input = new TextEncoder().encode(token);
  const digest = await crypto.subtle.digest('SHA-256', input);
  return base64UrlEncode(new Uint8Array(digest));
};

export const getBearerToken = (request: Request) => {
  const authorization = request.headers.get('authorization');
  const match = authorization?.match(/^Bearer\s+(.+)$/i);
  return match?.[1] ?? null;
};

export const buildViewUrl = (request: Request, id: string) => {
  const url = new URL(request.url);
  url.pathname = '/d/' + id;
  url.search = '';
  url.hash = '';
  return url.toString();
};

export const getDrawingRecord = async (env: Env, id: string) => {
  return env.DRAWNIX_DB.prepare(
    `SELECT id, object_key, edit_token_hash, title, size_bytes, created_at, updated_at, deleted_at
     FROM drawings
     WHERE id = ? AND deleted_at IS NULL`
  )
    .bind(id)
    .first<DrawingRecord>();
};

export const assertCanEdit = async (record: DrawingRecord, request: Request) => {
  const token = getBearerToken(request);
  if (!token) {
    return false;
  }
  return (await hashToken(token)) === record.edit_token_hash;
};

const randomBase64Url = (byteLength: number) => {
  const bytes = new Uint8Array(byteLength);
  crypto.getRandomValues(bytes);
  return base64UrlEncode(bytes);
};

const base64UrlEncode = (bytes: Uint8Array) => {
  let binary = '';
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
};

