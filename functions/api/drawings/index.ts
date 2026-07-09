import {
  DRAWING_CONTENT_TYPE,
  Env,
  buildViewUrl,
  createEditToken,
  createId,
  hashToken,
  jsonResponse,
  objectKeyFor,
  parseDrawingPayload,
} from './_storage';

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const parsed = await parseDrawingPayload(request);
  if ('error' in parsed) {
    return parsed.error;
  }

  const id = createId();
  const editToken = createEditToken();
  const now = new Date().toISOString();
  const objectKey = objectKeyFor(id);

  await env.DRAWNIX_BUCKET.put(objectKey, parsed.text, {
    httpMetadata: {
      contentType: DRAWING_CONTENT_TYPE,
    },
  });

  await env.DRAWNIX_DB.prepare(
    `INSERT INTO drawings (id, object_key, edit_token_hash, title, size_bytes, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  )
    .bind(id, objectKey, await hashToken(editToken), null, parsed.size, now, now)
    .run();

  return jsonResponse(
    {
      id,
      editToken,
      viewUrl: buildViewUrl(request, id),
      updatedAt: now,
    },
    { status: 201 }
  );
};
