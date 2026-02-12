import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { getDatabase } from '../utils/database';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { createError } from '../middleware/error-handler';

const router = Router();

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads/boards'));
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow common file types
    const allowedTypes = [
      'image/',
      'video/',
      'audio/',
      'application/pdf',
      'text/',
      'application/vnd.openxmlformats-officedocument',
      'application/vnd.ms-',
      'application/zip',
      'application/x-zip',
    ];

    const isAllowed = allowedTypes.some(
      (type) => file.mimetype.startsWith(type) || file.mimetype.includes(type)
    );

    if (isAllowed) {
      cb(null, true);
    } else {
      cb(new Error('File type not allowed'));
    }
  },
});

// Get attachments for a board
router.get(
  '/board/:boardId',
  authMiddleware,
  async (req: AuthRequest, res, next) => {
    try {
      const { boardId } = req.params;
      const db = getDatabase();

      // Check board access
      const board = await db.get(
        'SELECT owner_id, status FROM boards WHERE id = ?',
        [boardId]
      );

      if (!board) {
        throw createError('Board not found', 404, 'BOARD_NOT_FOUND');
      }

      if (board.owner_id !== req.user!.id && board.status !== 'published') {
        throw createError('Access denied', 403, 'FORBIDDEN');
      }

      const attachments = await db.all(
        'SELECT * FROM attachments WHERE board_id = ? ORDER BY upload_time DESC',
        [boardId]
      );

      res.json({
        success: true,
        data: { attachments },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Upload attachment
router.post(
  '/board/:boardId',
  authMiddleware,
  upload.single('file'),
  async (req: AuthRequest, res, next) => {
    try {
      const { boardId } = req.params;

      if (!req.file) {
        throw createError('No file uploaded', 400, 'FILE_REQUIRED');
      }

      const db = getDatabase();

      // Check board access
      const board = await db.get(
        'SELECT owner_id, status FROM boards WHERE id = ?',
        [boardId]
      );

      if (!board) {
        throw createError('Board not found', 404, 'BOARD_NOT_FOUND');
      }

      if (board.owner_id !== req.user!.id && board.status !== 'published') {
        throw createError('Access denied', 403, 'FORBIDDEN');
      }

      const attachmentId = uuidv4();
      const fileUrl = `/uploads/boards/${req.file.filename}`;

      await db.run(
        `INSERT INTO attachments (id, board_id, name, size, type, url, background_color) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          attachmentId,
          boardId,
          req.file.originalname,
          req.file.size,
          req.file.mimetype,
          fileUrl,
          '#f0f9ff',
        ]
      );

      const attachment = await db.get(
        'SELECT * FROM attachments WHERE id = ?',
        [attachmentId]
      );

      res.status(201).json({
        success: true,
        data: { attachment },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Update attachment background color
router.put(
  '/:id/color',
  authMiddleware,
  async (req: AuthRequest, res, next) => {
    try {
      const { id } = req.params;
      const { backgroundColor } = req.body;

      const db = getDatabase();

      const attachment = await db.get(
        'SELECT * FROM attachments WHERE id = ?',
        [id]
      );

      if (!attachment) {
        throw createError('Attachment not found', 404, 'ATTACHMENT_NOT_FOUND');
      }

      // Check board access
      const board = await db.get(
        'SELECT owner_id, status FROM boards WHERE id = ?',
        [attachment.board_id]
      );

      if (!board) {
        throw createError('Board not found', 404, 'BOARD_NOT_FOUND');
      }

      if (board.owner_id !== req.user!.id && board.status !== 'published') {
        throw createError('Access denied', 403, 'FORBIDDEN');
      }

      await db.run('UPDATE attachments SET background_color = ? WHERE id = ?', [
        backgroundColor,
        id,
      ]);

      const updated = await db.get('SELECT * FROM attachments WHERE id = ?', [
        id,
      ]);

      res.json({
        success: true,
        data: { attachment: updated },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Delete attachment
router.delete('/:id', authMiddleware, async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;
    const db = getDatabase();

    const attachment = await db.get('SELECT * FROM attachments WHERE id = ?', [
      id,
    ]);

    if (!attachment) {
      throw createError('Attachment not found', 404, 'ATTACHMENT_NOT_FOUND');
    }

    // Check board ownership for delete
    const board = await db.get('SELECT owner_id FROM boards WHERE id = ?', [
      attachment.board_id,
    ]);

    if (!board) {
      throw createError('Board not found', 404, 'BOARD_NOT_FOUND');
    }

    if (board.owner_id !== req.user!.id && req.user!.role !== 'admin') {
      throw createError('Access denied', 403, 'FORBIDDEN');
    }

    // Delete file from disk
    const fs = require('fs');
    const filePath = path.join(__dirname, '../..', attachment.url);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await db.run('DELETE FROM attachments WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Attachment deleted successfully',
    });
  } catch (error) {
    next(error);
  }
});

export default router;
