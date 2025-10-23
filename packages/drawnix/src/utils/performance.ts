/**
 * Performance utilities for Drawnix
 * Provides tools for optimizing canvas operations and user interactions
 */

export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number[]> = new Map();

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  startTiming(label: string): void {
    const startTime = performance.now();
    this.metrics.set(`${label}_start`, [startTime]);
  }

  endTiming(label: string): number {
    const endTime = performance.now();
    const startTimes = this.metrics.get(`${label}_start`);
    
    if (startTimes && startTimes.length > 0) {
      const duration = endTime - startTimes[0];
      this.recordMetric(label, duration);
      return duration;
    }
    
    return 0;
  }

  recordMetric(label: string, value: number): void {
    const existing = this.metrics.get(label) || [];
    existing.push(value);
    this.metrics.set(label, existing);
  }

  getAverageTime(label: string): number {
    const values = this.metrics.get(label) || [];
    if (values.length === 0) return 0;
    
    return values.reduce((sum, val) => sum + val, 0) / values.length;
  }

  getMetrics(): Record<string, number[]> {
    const result: Record<string, number[]> = {};
    this.metrics.forEach((values, key) => {
      if (!key.endsWith('_start')) {
        result[key] = values;
      }
    });
    return result;
  }

  clearMetrics(): void {
    this.metrics.clear();
  }
}

export class Debouncer {
  private timeoutId: NodeJS.Timeout | null = null;

  debounce<T extends (...args: any[]) => any>(
    func: T,
    delay: number
  ): (...args: Parameters<T>) => void {
    return (...args: Parameters<T>) => {
      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
      }
      
      this.timeoutId = setTimeout(() => {
        func(...args);
        this.timeoutId = null;
      }, delay);
    };
  }

  cancel(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }
}

export class Throttler {
  private lastExecuted = 0;

  throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): (...args: Parameters<T>) => void {
    return (...args: Parameters<T>) => {
      const now = Date.now();
      
      if (now - this.lastExecuted >= limit) {
        func(...args);
        this.lastExecuted = now;
      }
    };
  }
}

export class MemoryManager {
  private static readonly MAX_CACHE_SIZE = 100;
  private cache: Map<string, any> = new Map();

  set(key: string, value: any): void {
    if (this.cache.size >= MemoryManager.MAX_CACHE_SIZE) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, value);
  }

  get(key: string): any {
    return this.cache.get(key);
  }

  has(key: string): boolean {
    return this.cache.has(key);
  }

  clear(): void {
    this.cache.clear();
  }

  getSize(): number {
    return this.cache.size;
  }
}

export class CanvasOptimizer {
  private static readonly BATCH_SIZE = 10;
  private pendingOperations: (() => void)[] = [];
  private rafId: number | null = null;

  batchOperation(operation: () => void): void {
    this.pendingOperations.push(operation);
    
    if (this.pendingOperations.length >= CanvasOptimizer.BATCH_SIZE) {
      this.flush();
    } else if (!this.rafId) {
      this.rafId = requestAnimationFrame(() => this.flush());
    }
  }

  private flush(): void {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }

    const operations = this.pendingOperations.splice(0);
    operations.forEach(operation => operation());
  }

  cancel(): void {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this.pendingOperations = [];
  }
}

// Utility functions
export const measurePerformance = <T extends (...args: any[]) => any>(
  func: T,
  label?: string
): T => {
  return ((...args: Parameters<T>) => {
    const monitor = PerformanceMonitor.getInstance();
    const timingLabel = label || func.name || 'anonymous';
    
    monitor.startTiming(timingLabel);
    const result = func(...args);
    monitor.endTiming(timingLabel);
    
    return result;
  }) as T;
};

export const createPerformanceLogger = (label: string) => {
  const monitor = PerformanceMonitor.getInstance();
  
  return {
    start: () => monitor.startTiming(label),
    end: () => monitor.endTiming(label),
    getAverage: () => monitor.getAverageTime(label),
  };
};

export const optimizeCanvasRendering = (canvas: HTMLCanvasElement) => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Enable hardware acceleration
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  
  // Optimize for performance
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
};

export const getDevicePixelRatio = (): number => {
  return window.devicePixelRatio || 1;
};

export const createHighDPICanvas = (
  width: number,
  height: number
): HTMLCanvasElement => {
  const canvas = document.createElement('canvas');
  const ratio = getDevicePixelRatio();
  
  canvas.width = width * ratio;
  canvas.height = height * ratio;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.scale(ratio, ratio);
  }
  
  return canvas;
};
