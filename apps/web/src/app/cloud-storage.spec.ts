import { createCloudDrawing, updateCloudDrawing } from './cloud-storage';
import { parseCloudDrawingId } from './app';
import { DrawnixExportedData, DrawnixExportedType } from '@drawnix/drawnix';

const drawing: DrawnixExportedData = {
  type: DrawnixExportedType.drawnix,
  version: 1,
  source: 'web',
  elements: [],
  viewport: { zoom: 1 },
};

describe('cloud storage', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('parses cloud drawing ids from links and raw ids', () => {
    expect(parseCloudDrawingId('https://drawnix.example/d/abc123')).toBe('abc123');
    expect(parseCloudDrawingId('https://drawnix.example/?drawing=abc123')).toBe('abc123');
    expect(parseCloudDrawingId('abc123')).toBe('abc123');
  });

  it('creates drawings with the Drawnix payload', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        return new Response(
          JSON.stringify({
            id: 'abc123',
            editToken: 'token',
            viewUrl: 'https://drawnix.example/d/abc123',
          }),
          { status: 201 }
        );
      })
    );

    const result = await createCloudDrawing(drawing);

    expect(result.id).toBe('abc123');
    expect(fetch).toHaveBeenCalledWith('/api/drawings', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(drawing),
    });
  });

  it('updates drawings with the edit token', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        return new Response(JSON.stringify({ id: 'abc123', updatedAt: 'now' }));
      })
    );

    await updateCloudDrawing(
      {
        id: 'abc123',
        editToken: 'token',
        viewUrl: 'https://drawnix.example/d/abc123',
      },
      drawing
    );

    expect(fetch).toHaveBeenCalledWith('/api/drawings/abc123', {
      method: 'PUT',
      headers: {
        authorization: 'Bearer token',
        'content-type': 'application/json',
      },
      body: JSON.stringify(drawing),
    });
  });
});

