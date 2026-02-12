import { Router, Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { getDatabase } from '../utils/database';
import { generateToken } from '../middleware/auth';
import { createError } from '../middleware/error-handler';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// Simple validation helper
function validateLogin(body: any): { isValid: boolean; error?: string } {
  if (
    !body.username ||
    typeof body.username !== 'string' ||
    body.username.trim() === ''
  ) {
    return { isValid: false, error: 'Username is required' };
  }
  if (
    !body.password ||
    typeof body.password !== 'string' ||
    body.password === ''
  ) {
    return { isValid: false, error: 'Password is required' };
  }
  return { isValid: true };
}

function validateRegister(body: any): { isValid: boolean; error?: string } {
  if (
    !body.username ||
    typeof body.username !== 'string' ||
    body.username.trim().length < 3
  ) {
    return { isValid: false, error: 'Username must be at least 3 characters' };
  }
  if (
    !body.password ||
    typeof body.password !== 'string' ||
    body.password.length < 3
  ) {
    return { isValid: false, error: 'Password must be at least 3 characters' };
  }
  return { isValid: true };
}

// Login
router.post(
  '/login',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log('[Login] Request body:', req.body);

      const validation = validateLogin(req.body);
      if (!validation.isValid) {
        console.log('[Login] Validation failed:', validation.error);
        throw createError(
          validation.error || 'Validation failed',
          400,
          'VALIDATION_ERROR'
        );
      }

      const { username, password } = req.body;
      const db = getDatabase();

      const user = await db.get('SELECT * FROM users WHERE username = ?', [
        username.trim(),
      ]);

      if (!user) {
        throw createError('Invalid credentials', 401, 'INVALID_CREDENTIALS');
      }

      const isValidPassword = await bcrypt.compare(password, user.password);

      if (!isValidPassword) {
        throw createError('Invalid credentials', 401, 'INVALID_CREDENTIALS');
      }

      const token = generateToken({
        id: user.id,
        username: user.username,
        role: user.role,
      });

      console.log('[Login] Success for user:', username);

      res.json({
        success: true,
        data: {
          user: {
            id: user.id,
            username: user.username,
            role: user.role,
            avatar: user.avatar,
          },
          token,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Register
router.post(
  '/register',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log('[Register] Request body:', req.body);

      const validation = validateRegister(req.body);
      if (!validation.isValid) {
        throw createError(
          validation.error || 'Validation failed',
          400,
          'VALIDATION_ERROR'
        );
      }

      const { username, password } = req.body;
      const db = getDatabase();

      // Check if user exists
      const existingUser = await db.get(
        'SELECT id FROM users WHERE username = ?',
        [username.trim()]
      );
      if (existingUser) {
        throw createError('Username already exists', 409, 'USER_EXISTS');
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      const userId = uuidv4();

      // Create user
      await db.run(
        'INSERT INTO users (id, username, password, role) VALUES (?, ?, ?, ?)',
        [userId, username.trim(), hashedPassword, 'user']
      );

      const token = generateToken({
        id: userId,
        username: username.trim(),
        role: 'user',
      });

      console.log('[Register] Success for user:', username);

      res.status(201).json({
        success: true,
        data: {
          user: {
            id: userId,
            username: username.trim(),
            role: 'user',
          },
          token,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Get current user
router.get('/me', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw createError('No token provided', 401, 'UNAUTHORIZED');
    }

    const token = authHeader.substring(7);
    const { verifyToken } = await import('../middleware/auth');
    const decoded = verifyToken(token);

    const db = getDatabase();
    const user = await db.get(
      'SELECT id, username, role, avatar, created_at FROM users WHERE id = ?',
      [decoded.id]
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
});

export default router;
