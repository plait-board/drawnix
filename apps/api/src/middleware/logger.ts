import { Request, Response, NextFunction } from 'express';

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const timestamp = new Date().toISOString();
  const { method, path, ip } = req;

  console.log(`[${timestamp}] ${method} ${path} - IP: ${ip}`);

  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const { statusCode } = res;
    console.log(
      `[${timestamp}] ${method} ${path} - ${statusCode} - ${duration}ms`
    );
  });

  next();
}
