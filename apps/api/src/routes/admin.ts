import { Router } from 'express';
import { getDatabase } from '../utils/database';
import {
  authMiddleware,
  adminMiddleware,
  AuthRequest,
} from '../middleware/auth';
import { createError } from '../middleware/error-handler';

const router = Router();

// Get admin dashboard stats
router.get(
  '/stats',
  authMiddleware,
  adminMiddleware,
  async (req, res, next) => {
    try {
      const db = getDatabase();

      const [userCount, boardCount, publishedCount, attachmentCount] =
        await Promise.all([
          db.get('SELECT COUNT(*) as count FROM users'),
          db.get('SELECT COUNT(*) as count FROM boards'),
          db.get(
            'SELECT COUNT(*) as count FROM boards WHERE status = "published"'
          ),
          db.get('SELECT COUNT(*) as count FROM attachments'),
        ]);

      res.json({
        success: true,
        data: {
          users: userCount.count,
          boards: boardCount.count,
          publishedBoards: publishedCount.count,
          attachments: attachmentCount.count,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Get all users with board counts (admin only)
router.get(
  '/users',
  authMiddleware,
  adminMiddleware,
  async (req, res, next) => {
    try {
      const db = getDatabase();

      const users = await db.all(`
      SELECT 
        u.id, u.username, u.role, u.avatar, u.created_at,
        COUNT(b.id) as board_count
      FROM users u
      LEFT JOIN boards b ON u.id = b.owner_id
      GROUP BY u.id
      ORDER BY u.created_at DESC
    `);

      res.json({
        success: true,
        data: { users },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Get all boards with owner info (admin only)
router.get(
  '/boards',
  authMiddleware,
  adminMiddleware,
  async (req, res, next) => {
    try {
      const db = getDatabase();

      const boards = await db.all(`
      SELECT 
        b.*,
        u.username as owner_name,
        COUNT(a.id) as attachment_count
      FROM boards b
      JOIN users u ON b.owner_id = u.id
      LEFT JOIN attachments a ON b.id = a.board_id
      GROUP BY b.id
      ORDER BY b.last_modified DESC
    `);

      res.json({
        success: true,
        data: {
          boards: boards.map((board) => ({
            ...board,
            elements: JSON.parse(board.elements || '[]'),
            viewport: JSON.parse(board.viewport || '{}'),
          })),
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Delete any board (admin only)
router.delete(
  '/boards/:id',
  authMiddleware,
  adminMiddleware,
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const db = getDatabase();

      const result = await db.run('DELETE FROM boards WHERE id = ?', [id]);

      if (result.changes === 0) {
        throw createError('Board not found', 404, 'BOARD_NOT_FOUND');
      }

      res.json({
        success: true,
        message: 'Board deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
);

// Change user role (admin only)
router.put(
  '/users/:id/role',
  authMiddleware,
  adminMiddleware,
  async (req: AuthRequest, res, next) => {
    try {
      const { id } = req.params;
      const { role } = req.body;

      if (!role || !['user', 'admin'].includes(role)) {
        throw createError('Invalid role', 400, 'VALIDATION_ERROR');
      }

      // Prevent changing own role
      if (id === req.user!.id) {
        throw createError(
          'Cannot change your own role',
          400,
          'INVALID_OPERATION'
        );
      }

      const db = getDatabase();

      const result = await db.run(
        'UPDATE users SET role = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [role, id]
      );

      if (result.changes === 0) {
        throw createError('User not found', 404, 'USER_NOT_FOUND');
      }

      const user = await db.get(
        'SELECT id, username, role, avatar, created_at FROM users WHERE id = ?',
        [id]
      );

      res.json({
        success: true,
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
