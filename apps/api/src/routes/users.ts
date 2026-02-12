import { Router, Response, NextFunction } from 'express';
import { getDatabase } from '../utils/database';
import {
  authMiddleware,
  adminMiddleware,
  AuthRequest,
} from '../middleware/auth';
import { createError } from '../middleware/error-handler';

const router = Router();

// Get all users (admin only)
router.get(
  '/',
  authMiddleware,
  adminMiddleware,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const db = getDatabase();
      const users = await db.all(
        'SELECT id, username, role, avatar, created_at FROM users ORDER BY created_at DESC'
      );

      res.json({
        success: true,
        data: { users },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Get user by ID
router.get(
  '/:id',
  authMiddleware,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      // Users can only view their own profile unless admin
      if (req.user!.id !== id && req.user!.role !== 'admin') {
        throw createError('Access denied', 403, 'FORBIDDEN');
      }

      const db = getDatabase();
      const user = await db.get(
        'SELECT id, username, role, avatar, created_at FROM users WHERE id = ?',
        [id]
      );

      if (!user) {
        throw createError('User not found', 404, 'USER_NOT_FOUND');
      }

      res.json({
        success: true,
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Update user
router.put(
  '/:id',
  authMiddleware,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { username, avatar } = req.body;

      // Users can only update their own profile unless admin
      if (req.user!.id !== id && req.user!.role !== 'admin') {
        throw createError('Access denied', 403, 'FORBIDDEN');
      }

      const db = getDatabase();

      await db.run(
        'UPDATE users SET username = COALESCE(?, username), avatar = COALESCE(?, avatar), updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [username, avatar, id]
      );

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

// Delete user (admin only)
router.delete(
  '/:id',
  authMiddleware,
  adminMiddleware,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const db = getDatabase();

      // Prevent deleting yourself
      if (id === req.user!.id) {
        throw createError('Cannot delete yourself', 400, 'INVALID_OPERATION');
      }

      const result = await db.run('DELETE FROM users WHERE id = ?', [id]);

      if (result.changes === 0) {
        throw createError('User not found', 404, 'USER_NOT_FOUND');
      }

      res.json({
        success: true,
        message: 'User deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
