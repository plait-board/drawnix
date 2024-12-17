import { distanceBetweenPointAndPoint, Point } from '@plait/core';

interface StrokePoint {
  point: Point;
  pressure?: number;
  timestamp: number;
  tiltX?: number;
  tiltY?: number;
}

export interface SmootherOptions {
  smoothing?: number;
  velocityWeight?: number;
  curvatureWeight?: number;
  minDistance?: number;
  maxPoints?: number;
  pressureSensitivity?: number;
  tiltSensitivity?: number;
  velocityThreshold?: number;
  samplingRate?: number;
}

export class FreehandSmoother {
  private readonly defaultOptions: Required<SmootherOptions> = {
    smoothing: 0.65,
    velocityWeight: 0.2,
    curvatureWeight: 0.3,
    minDistance: 0.2, // 降低最小距离阈值
    maxPoints: 8,
    pressureSensitivity: 0.5,
    tiltSensitivity: 0.3,
    velocityThreshold: 800,
    samplingRate: 5, // 降低采样间隔
  };

  private options: Required<SmootherOptions>;
  private points: StrokePoint[] = [];
  private lastProcessedTime = 0;
  private movingAverageVelocity: number[] = [];
  private readonly velocityWindowSize = 3;

  constructor(options: SmootherOptions = {}) {
    this.options = { ...this.defaultOptions, ...options };
  }

  process(
    point: Point,
    data: Partial<Omit<StrokePoint, 'point'>> = {}
  ): Point | null {
    const timestamp = data.timestamp ?? Date.now();

    // 第一个点直接返回
    if (this.points.length === 0) {
      const strokePoint: StrokePoint = { point, timestamp, ...data };
      this.points.push(strokePoint);
      this.lastProcessedTime = timestamp;
      return point;
    }

    // 采样率控制 - 确保不会卡住
    if (timestamp - this.lastProcessedTime < this.options.samplingRate) {
      const timeDiff = timestamp - this.lastProcessedTime;
      if (timeDiff < 2) {
        // 如果时间间隔太小，跳过
        return null;
      }
    }

    const strokePoint: StrokePoint = {
      point,
      timestamp,
      ...data,
    };

    // 距离检查 - 添加最小距离的动态调整
    const distanceOk = this.checkDistance(point);
    if (!distanceOk && this.points.length > 1) {
      // 如果距离太近，但时间间隔较大，仍然处理该点
      const timeDiff = timestamp - this.lastProcessedTime;
      if (timeDiff < 32) {
        // 32ms ≈ 30fps
        return null;
      }
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

    // 动态最小距离：根据当前速度调整
    let minDistance = this.options.minDistance;
    if (this.movingAverageVelocity.length > 0) {
      const avgVelocity = this.getAverageVelocity();
      minDistance *= Math.max(0.5, Math.min(1.5, avgVelocity / 200));
    }

    return distance >= minDistance;
  }

  private calculateDynamicParameters(strokePoint: StrokePoint) {
    const velocity = this.calculateVelocity(strokePoint);
    this.updateMovingAverage(velocity);
    const avgVelocity = this.getAverageVelocity();

    const params = { ...this.options };

    // 压力适应 - 更温和的压力响应
    if (strokePoint.pressure !== undefined) {
      const pressureWeight = Math.pow(strokePoint.pressure, 1.2);
      params.smoothing *= 1 - pressureWeight * params.pressureSensitivity * 0.8;
    }

    // 速度适应 - 更平滑的过渡
    const velocityFactor = Math.min(avgVelocity / params.velocityThreshold, 1);
    params.velocityWeight = 0.2 + velocityFactor * 0.3;
    params.smoothing *= 1 + velocityFactor * 0.2;

    // 倾斜适应 - 更温和的响应
    if (strokePoint.tiltX !== undefined && strokePoint.tiltY !== undefined) {
      const tiltFactor =
        Math.sqrt(strokePoint.tiltX ** 2 + strokePoint.tiltY ** 2) / 90;
      params.smoothing *= 1 + tiltFactor * params.tiltSensitivity * 0.7;
    }

    return params;
  }

  private smooth(point: Point, params: Required<SmootherOptions>): Point {
    if (this.points.length < 2) return point;

    const weights = this.calculateWeights(params);
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);

    if (totalWeight === 0) return point;

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
      // 基础权重 - 使用更温和的衰减
      let weight = Math.pow(params.smoothing, (lastIndex - i) * 0.8);

      // 速度权重 - 更平滑的过渡
      if (i < lastIndex) {
        const velocity = this.getPointVelocity(i);
        weight *= 1 + velocity * params.velocityWeight * 0.8;
      }

      // 曲率权重 - 更温和的影响
      if (i > 0 && i < lastIndex) {
        const curvature = this.getPointCurvature(i);
        weight *= 1 + curvature * params.curvatureWeight * 0.7;
      }

      weights.push(weight);
    }

    return weights;
  }

  // 工具方法保持不变
  private getDistance(p1: Point, p2: Point): number {
    return distanceBetweenPointAndPoint(p1[0], p1[1], p2[0], p2[1]);
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

    const s = (a + b + c) / 2;
    const area = Math.sqrt(Math.max(0, s * (s - a) * (s - b) * (s - c)));
    return (4 * area) / (a * b * c + 0.0001); // 避免除零
  }
}
