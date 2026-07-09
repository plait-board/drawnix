import { Env, errorResponse, getDrawingRecord, jsonResponse } from '../_storage';

type Params = {
  id: string;
};

export const onRequestGet: PagesFunction<Env, Params> = async ({ env, params }) => {
  const record = await getDrawingRecord(env, params.id);
  if (!record) {
    return errorResponse(404, 'Drawing not found');
  }

  return jsonResponse({
    id: record.id,
    title: record.title,
    sizeBytes: record.size_bytes,
    createdAt: record.created_at,
    updatedAt: record.updated_at,
  });
};
