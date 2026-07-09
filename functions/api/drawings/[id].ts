import {
  DRAWING_CONTENT_TYPE,
  Env,
  assertCanEdit,
  errorResponse,
  getDrawingRecord,
  jsonResponse,
  parseDrawingPayload,
} from './_storage';

type Params = {
  id: string;
};

export const onRequestGet: PagesFunction<Env, Params> = async ({ env, params }) => {
  const record = await getDrawingRecord(env, params.id);
  if (!record) {
    return errorResponse(404, 'Drawing not found');
  }

  const object = await env.DRAWNIX_BUCKET.get(record.object_key);
  if (!object) {
    return errorResponse(404, 'Drawing content not found');
  }

  const headers = new Headers();
  headers.set('content-type', DRAWING_CONTENT_TYPE);
  headers.set('cache-control', 'no-store');
  headers.set('etag', object.httpEtag);
  headers.set('x-drawnix-updated-at', record.updated_at);
  headers.set('x-drawnix-size-bytes', String(record.size_bytes));

  return new Response(object.body, { headers });
};

export const onRequestHead: PagesFunction<Env, Params> = async ({ env, params }) => {
  const record = await getDrawingRecord(env, params.id);
  if (!record) {
    return new Response(null, { status: 404 });
  }

  return new Response(null, {
    headers: {
      'x-drawnix-updated-at': record.updated_at,
      'x-drawnix-size-bytes': String(record.size_bytes),
    },
  });
};

export const onRequestPut: PagesFunction<Env, Params> = async ({ request, env, params }) => {
  const record = await getDrawingRecord(env, params.id);
  if (!record) {
    return errorResponse(404, 'Drawing not found');
  }

  if (!(await assertCanEdit(record, request))) {
    return errorResponse(403, 'Missing or invalid edit token');
  }

  const parsed = await parseDrawingPayload(request);
  if ('error' in parsed) {
    return parsed.error;
  }

  const now = new Date().toISOString();

  await env.DRAWNIX_BUCKET.put(record.object_key, parsed.text, {
    httpMetadata: {
      contentType: DRAWING_CONTENT_TYPE,
    },
  });

  await env.DRAWNIX_DB.prepare(
    `UPDATE drawings
     SET size_bytes = ?, updated_at = ?
     WHERE id = ?`
  )
    .bind(parsed.size, now, record.id)
    .run();

  return jsonResponse({
    id: record.id,
    updatedAt: now,
  });
};
