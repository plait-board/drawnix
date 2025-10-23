export class AbortError extends DOMException {
  constructor(message = 'Request Aborted') {
    super(message, 'AbortError');
  }
}

export class ValidationError extends Error {
  constructor(message: string, public field?: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class NetworkError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message);
    this.name = 'NetworkError';
  }
}

export class FileError extends Error {
  constructor(message: string, public fileName?: string) {
    super(message);
    this.name = 'FileError';
  }
}

export class CanvasError extends Error {
  constructor(message: string, public operation?: string) {
    super(message);
    this.name = 'CanvasError';
  }
}

// Error utility functions
export const createError = (type: string, message: string, details?: any) => {
  const errorMap = {
    'AbortError': () => new AbortError(message),
    'ValidationError': () => new ValidationError(message, details?.field),
    'NetworkError': () => new NetworkError(message, details?.statusCode),
    'FileError': () => new FileError(message, details?.fileName),
    'CanvasError': () => new CanvasError(message, details?.operation),
  };
  
  return errorMap[type]?.() || new Error(message);
};

export const isError = (error: any): error is Error => {
  return error instanceof Error;
};

export const getErrorMessage = (error: unknown): string => {
  if (isError(error)) {
    return error.message;
  }
  return String(error);
};
