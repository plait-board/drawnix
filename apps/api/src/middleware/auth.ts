import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { createError } from './error-handler';

const JWT_SECRET =
  process.env.JWT_SECRET || 'drawnix-secret-key-change-in-production';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    username: string;
    role: string;
  };
}

export function generateToken(user: {
  id: string;
  username: string;
  role: string;
}): string {
  return jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function verifyToken(token: string): {
  id: string;
  username: string;
  role: string;
} {
  return jwt.verify(token, JWT_SECRET) as {
    id: string;
    username: string;
    role: string;
  };
}

export function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw createError('No token provided', 401, 'UNAUTHORIZED');
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(createError('Invalid token', 401, 'UNAUTHORIZED'));
    } else {
      next(error);
    }
  }
}

export function adminMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  if (!req.user) {
    next(createError('Authentication required', 401, 'UNAUTHORIZED'));
    return;
  }

  if (req.user.role !== 'admin') {
    next(createError('Admin access required', 403, 'FORBIDDEN'));
    return;
  }

  next();
}
