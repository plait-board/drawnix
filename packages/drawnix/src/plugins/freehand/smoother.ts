import { Point } from '@plait/core';

interface StrokePoint {
  point: Point;
  pressure?: number;
  timestamp: number;
  tiltX?: number;
  tiltY?: number;
}

interface SmootherOptions {
  // 基础平滑参数
  smoothing?: number; // 基础平滑强度 (0-1)
  velocityWeight?: number; // 速度权重
  curvatureWeight?: number; // 曲率权重
  minDistance?: number; // 最小距离阈值
  maxPoints?: number; // 历史点数量

  // 高级参数
  pressureSensitivity?: number; // 压力敏感度 (0-1)
  tiltSensitivity?: number; // 倾斜敏感度 (0-1)
  velocityThreshold?: number; // 速度阈值
  samplingRate?: number; // 采样率控制(ms)
}

export class FreehandSmoother {
  private readonly defaultOptions: Required<SmootherOptions> = {
    smoothing: 0.7,
    velocityWeight: 0.25,
    curvatureWeight: 0.35,
    minDistance: 0.8,
    maxPoints: 6,
    pressureSensitivity: 0.5,
    tiltSensitivity: 0.3,
    velocityThreshold: 1000,
    samplingRate: 8,
  };

  private options: Required<SmootherOptions>;
  private points: StrokePoint[] = [];
  private lastProcessedTime: number = 0;
  private movingAverageVelocity: number[] = [];
  private readonly velocityWindowSize = 3;

  constructor(options: SmootherOptions = {}) {
    this.options = { ...this.defaultOptions, ...options };
  }

  /**
   * 处理新的点
   * @param point 基础坐标点
   * @param data 额外的点数据（压力、倾斜等）
   * @returns 平滑后的点，如果点被过滤则返回 null
   */
  process(
    point: Point,
    data: Partial<Omit<StrokePoint, 'point'>> = {}
  ): Point | null {
    const timestamp = data.timestamp ?? Date.now();

    // 采样率控制
    if (timestamp - this.lastProcessedTime < this.options.samplingRate) {
      return null;
    }

    const strokePoint: StrokePoint = {
      point,
      timestamp,
      ...data,
    };

    // 距离检查
    if (this.points.length > 0 && !this.checkDistance(point)) {
      return null;
    }

    // 更新历史点
    this.updatePoints(strokePoint);

    // 计算动态参数
    const dynamicParams = this.calculateDynamicParameters(strokePoint);

    // 应用平滑
    const smoothedPoint = this.smooth(point, dynamicParams);

    this.lastProcessedTime = timestamp;
    return smoothedPoint;
  }

  /**
   * 重置状态
   */
  reset(): void {
    this.points = [];
    this.lastProcessedTime = 0;
    this.movingAverageVelocity = [];
  }

  private updatePoints(point: StrokePoint): void {
    this.points.push(point);
    if (this.points.length > this.options.maxPoints) {
      this.points.shift();
    }
  }

  private checkDistance(point: Point): boolean {
    if (this.points.length === 0) return true;

    const lastPoint = this.points[this.points.length - 1].point;
    const distance = this.getDistance(lastPoint, point);
    return distance >= this.options.minDistance;
  }

  private calculateDynamicParameters(strokePoint: StrokePoint) {
    // 计算速度
    const velocity = this.calculateVelocity(strokePoint);
    this.updateMovingAverage(velocity);
    const avgVelocity = this.getAverageVelocity();

    // 基础参数
    const params = { ...this.options };

    // 压力适应
    if (strokePoint.pressure !== undefined) {
      const pressureWeight = Math.pow(strokePoint.pressure, 1.5);
      params.smoothing *= 1 - pressureWeight * params.pressureSensitivity;
    }

    // 速度适应
    const velocityFactor = Math.min(avgVelocity / params.velocityThreshold, 1);
    params.velocityWeight = 0.3 + velocityFactor * 0.4;
    params.curvatureWeight *= 1 - velocityFactor * 0.5;

    // 倾斜角度适应
    if (strokePoint.tiltX !== undefined && strokePoint.tiltY !== undefined) {
      const tiltFactor =
        Math.sqrt(strokePoint.tiltX ** 2 + strokePoint.tiltY ** 2) / 90;
      params.smoothing *= 1 + tiltFactor * params.tiltSensitivity;
    }

    return params;
  }

  private smooth(point: Point, params: Required<SmootherOptions>): Point {
    if (this.points.length < 2) return point;

    const weights = this.calculateWeights(params);
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);

    const smoothedPoint: Point = [0, 0];
    for (let i = 0; i < this.points.length; i++) {
      const weight = weights[i] / totalWeight;
      smoothedPoint[0] += this.points[i].point[0] * weight;
      smoothedPoint[1] += this.points[i].point[1] * weight;
    }

    return smoothedPoint;
  }

  private calculateWeights(params: Required<SmootherOptions>): number[] {
    const weights: number[] = [];
    const lastIndex = this.points.length - 1;

    for (let i = 0; i < this.points.length; i++) {
      // 基础权重
      let weight = Math.pow(params.smoothing, lastIndex - i);

      // 速度权重
      if (i < lastIndex) {
        const velocity = this.getPointVelocity(i);
        weight *= 1 + velocity * params.velocityWeight;
      }

      // 曲率权重
      if (i > 0 && i < lastIndex) {
        const curvature = this.getPointCurvature(i);
        weight *= 1 + curvature * params.curvatureWeight;
      }

      weights.push(weight);
    }

    return weights;
  }

  // 工具方法
  private getDistance(p1: Point, p2: Point): number {
    const dx = p2[0] - p1[0];
    const dy = p2[1] - p1[1];
    return Math.sqrt(dx * dx + dy * dy);
  }

  private calculateVelocity(point: StrokePoint): number {
    if (this.points.length < 2) return 0;

    const prevPoint = this.points[this.points.length - 1];
    const distance = this.getDistance(prevPoint.point, point.point);
    const timeDiff = point.timestamp - prevPoint.timestamp;
    return timeDiff > 0 ? distance / timeDiff : 0;
  }

  private updateMovingAverage(velocity: number): void {
    this.movingAverageVelocity.push(velocity);
    if (this.movingAverageVelocity.length > this.velocityWindowSize) {
      this.movingAverageVelocity.shift();
    }
  }

  private getAverageVelocity(): number {
    if (this.movingAverageVelocity.length === 0) return 0;
    return (
      this.movingAverageVelocity.reduce((a, b) => a + b) /
      this.movingAverageVelocity.length
    );
  }

  private getPointVelocity(index: number): number {
    if (index >= this.points.length - 1) return 0;

    const p1 = this.points[index];
    const p2 = this.points[index + 1];
    const distance = this.getDistance(p1.point, p2.point);
    const timeDiff = p2.timestamp - p1.timestamp;
    return timeDiff > 0 ? distance / timeDiff : 0;
  }

  private getPointCurvature(index: number): number {
    if (index <= 0 || index >= this.points.length - 1) return 0;

    const p1 = this.points[index - 1].point;
    const p2 = this.points[index].point;
    const p3 = this.points[index + 1].point;

    const a = this.getDistance(p1, p2);
    const b = this.getDistance(p2, p3);
    const c = this.getDistance(p1, p3);

    // 使用海伦公式计算曲率
    const s = (a + b + c) / 2;
    const area = Math.sqrt(s * (s - a) * (s - b) * (s - c));
    return (4 * area) / (a * b * c);
  }
}
