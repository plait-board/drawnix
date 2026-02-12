import { Router } from 'express';
import { getDatabase } from '../utils/database';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { createError } from '../middleware/error-handler';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// Get all boards for current user + published boards from others
router.get('/', authMiddleware, async (req: AuthRequest, res, next) => {
  try {
    const db = getDatabase();
    const userId = req.user!.id;

    // Get user's own boards
    const myBoards = await db.all(
      `SELECT b.*, u.username as owner_name 
       FROM boards b 
       JOIN users u ON b.owner_id = u.id 
       WHERE b.owner_id = ? 
       ORDER BY b.last_modified DESC`,
      [userId]
    );

    // Get published boards from other users
    const publishedBoards = await db.all(
      `SELECT b.*, u.username as owner_name 
       FROM boards b 
       JOIN users u ON b.owner_id = u.id 
       WHERE b.status = 'published' AND b.owner_id != ? 
       ORDER BY b.last_modified DESC`,
      [userId]
    );

    res.json({
      success: true,
      data: {
        myBoards: myBoards.map(parseBoard),
        publishedBoards: publishedBoards.map(parseBoard),
      },
    });
  } catch (error) {
    next(error);
  }
});

// Get single board
router.get('/:id', authMiddleware, async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;
    const db = getDatabase();
    const userId = req.user!.id;

    const board = await db.get(
      `SELECT b.*, u.username as owner_name 
       FROM boards b 
       JOIN users u ON b.owner_id = u.id 
       WHERE b.id = ?`,
      [id]
    );

    if (!board) {
      throw createError('Board not found', 404, 'BOARD_NOT_FOUND');
    }

    // Check access: owner or published
    if (board.owner_id !== userId && board.status !== 'published') {
      throw createError('Access denied', 403, 'FORBIDDEN');
    }

    // Get attachments
    const attachments = await db.all(
      'SELECT * FROM attachments WHERE board_id = ? ORDER BY upload_time DESC',
      [id]
    );

    res.json({
      success: true,
      data: {
        board: parseBoard(board),
        attachments,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Create board
router.post('/', authMiddleware, async (req: AuthRequest, res, next) => {
  try {
    const { title } = req.body;

    if (!title || title.trim().length < 2) {
      throw createError(
        'Title must be at least 2 characters',
        400,
        'VALIDATION_ERROR'
      );
    }

    const db = getDatabase();
    const boardId = uuidv4();

    await db.run(
      `INSERT INTO boards (id, owner_id, title, elements, viewport, theme, status, last_modified) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        boardId,
        req.user!.id,
        title.trim(),
        JSON.stringify([]),
        JSON.stringify({ zoom: 1, scrollX: 0, scrollY: 0 }),
        'default',
        'draft',
        Date.now(),
      ]
    );

    const board = await db.get(
      `SELECT b.*, u.username as owner_name 
       FROM boards b 
       JOIN users u ON b.owner_id = u.id 
       WHERE b.id = ?`,
      [boardId]
    );

    res.status(201).json({
      success: true,
      data: { board: parseBoard(board) },
    });
  } catch (error) {
    next(error);
  }
});

// Update board
router.put('/:id', authMiddleware, async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;
    const { title, elements, viewport, theme, status } = req.body;

    const db = getDatabase();

    // Check if board exists and user has access
    const existingBoard = await db.get('SELECT * FROM boards WHERE id = ?', [
      id,
    ]);

    if (!existingBoard) {
      throw createError('Board not found', 404, 'BOARD_NOT_FOUND');
    }

    const isOwner = existingBoard.owner_id === req.user!.id;

    // Non-owners can only edit published boards
    if (!isOwner && existingBoard.status !== 'published') {
      throw createError('Access denied', 403, 'FORBIDDEN');
    }

    // Build update query dynamically
    const updates: string[] = [];
    const values: any[] = [];

    if (title !== undefined) {
      updates.push('title = ?');
      values.push(title);
    }
    if (elements !== undefined) {
      updates.push('elements = ?');
      values.push(JSON.stringify(elements));
    }
    if (viewport !== undefined) {
      updates.push('viewport = ?');
      values.push(JSON.stringify(viewport));
    }
    if (theme !== undefined) {
      updates.push('theme = ?');
      values.push(theme);
    }

    // Only owner can change status to published
    if (status !== undefined && isOwner) {
      updates.push('status = ?');
      values.push(status);
    }

    updates.push('last_modified = ?');
    values.push(Date.now());
    values.push(id);

    await db.run(
      `UPDATE boards SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    const board = await db.get(
      `SELECT b.*, u.username as owner_name 
       FROM boards b 
       JOIN users u ON b.owner_id = u.id 
       WHERE b.id = ?`,
      [id]
    );

    res.json({
      success: true,
      data: { board: parseBoard(board) },
    });
  } catch (error) {
    next(error);
  }
});

// Delete board
router.delete('/:id', authMiddleware, async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;
    const db = getDatabase();

    // Check ownership
    const board = await db.get('SELECT owner_id FROM boards WHERE id = ?', [
      id,
    ]);

    if (!board) {
      throw createError('Board not found', 404, 'BOARD_NOT_FOUND');
    }

    // Only owner or admin can delete
    if (board.owner_id !== req.user!.id && req.user!.role !== 'admin') {
      throw createError('Access denied', 403, 'FORBIDDEN');
    }

    await db.run('DELETE FROM boards WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Board deleted successfully',
    });
  } catch (error) {
    next(error);
  }
});

// Helper to parse board data
function parseBoard(row: any) {
  return {
    ...row,
    elements: JSON.parse(row.elements || '[]'),
    viewport: JSON.parse(row.viewport || '{"zoom":1,"scrollX":0,"scrollY":0}'),
  };
}

export default router;
