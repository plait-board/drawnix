import { Point } from '@plait/core';

export interface FreehandSmootherConfig {
  smoothing: number; // 基础平滑系数
  velocityWeight: number; // 速度权重
  curvatureWeight: number; // 曲率权重
  maxPoints: number; // 最大历史点数
  minDistance: number; // 最小距离阈值
}

// 例如需要更精细的笔画
// const preciseConfig = {
//   smoothing: 0.3,      // 较小的平滑度保留更多细节
//   velocityWeight: 0.4, // 更敏感的速度响应
//   curvatureWeight: 0.4,// 更好地保留转角
//   maxPoints: 3,        // 更少的历史点提高响应速度
//   minDistance: 0.3     // 保留更多细微变化
// };

// 例如需要更平滑的笔画
// const smoothConfig = {
//   smoothing: 0.7,      // 较大的平滑度
//   velocityWeight: 0.2, // 较小的速度影响
//   curvatureWeight: 0.2,// 较圆滑的转角
//   maxPoints: 7,        // 更多的历史点实现更平滑的效果
//   minDistance: 0.8     // 更强的抖动过滤
// };

// 最大平滑效果的配置
// const maxSmoothConfig = {
//   smoothing: 0.9,        // 接近 1，最大平滑度
//   velocityWeight: 0.1,   // 很小的速度影响，保持一致的平滑度
//   curvatureWeight: 0.1,  // 很小的曲率影响，让转角也变得圆滑
//   maxPoints: 10,         // 更多的历史点参与计算
//   minDistance: 1.0       // 强力过滤小幅度抖动
// };

export class FreehandSmoother {
  private config: FreehandSmootherConfig;
  private points: Point[];
  private velocities: number[];

  constructor(options: Partial<FreehandSmootherConfig> = {}) {
    // 默认配置
    const defaultConfig: FreehandSmootherConfig = {
      smoothing: 0.9, // 接近 1，最大平滑度
      velocityWeight: 0.1, // 很小的速度影响，保持一致的平滑度
      curvatureWeight: 0.1, // 很小的曲率影响，让转角也变得圆滑
      maxPoints: 10, // 更多的历史点参与计算
      minDistance: 1.0, // 强力过滤小幅度抖动
    };

    this.config = {
      ...defaultConfig,
      ...options,
    };

    this.points = [];
    this.velocities = [];
  }

  public smoothPoint(point: Point): Point {
    this.points.push(point);
    if (this.points.length > this.config.maxPoints) {
      this.points.shift();
    }

    if (this.points.length < 2) return point;

    // 计算速度
    const velocity = this.calculateVelocity(point);
    this.velocities.push(velocity);
    if (this.velocities.length > this.config.maxPoints) {
      this.velocities.shift();
    }

    // 计算曲率
    const curvature = this.calculateCurvature();

    // 动态调整平滑系数
    const adaptiveSmoothing = this.getAdaptiveSmoothing(velocity, curvature);

    let smoothX = point[0];
    let smoothY = point[1];
    let totalWeight = 1;
    let weight = 1;

    // 指数加权移动平均
    for (let i = this.points.length - 2; i >= 0; i--) {
      weight *= adaptiveSmoothing;
      totalWeight += weight;

      smoothX += this.points[i][0] * weight;
      smoothY += this.points[i][1] * weight;
    }

    return [smoothX / totalWeight, smoothY / totalWeight];
  }

  private calculateVelocity(point: Point): number {
    if (this.points.length < 2) return 0;

    const prev = this.points[this.points.length - 2];
    const dx = point[0] - prev[0];
    const dy = point[1] - prev[1];
    const dt = 1; // 假设时间间隔恒定

    return Math.sqrt(dx * dx + dy * dy) / dt;
  }

  private calculateCurvature(): number {
    if (this.points.length < 3) return 0;

    const p1 = this.points[this.points.length - 3];
    const p2 = this.points[this.points.length - 2];
    const p3 = this.points[this.points.length - 1];

    // 使用三点法计算曲率
    const dx1 = p2[0] - p1[0];
    const dy1 = p2[1] - p1[1];
    const dx2 = p3[0] - p2[0];
    const dy2 = p3[1] - p2[1];

    // 使用叉积估算曲率
    const cross = dx1 * dy2 - dy1 * dx2;
    const velocity = Math.sqrt(dx1 * dx1 + dy1 * dy1);

    return Math.abs(cross) / (velocity * velocity + this.config.minDistance);
  }

  private getAdaptiveSmoothing(velocity: number, curvature: number): number {
    // 基于速度和曲率动态调整平滑系数
    const velocityFactor = Math.exp(-velocity * this.config.velocityWeight);
    const curvatureFactor = Math.exp(-curvature * this.config.curvatureWeight);

    // 结合基础平滑系数和动态因子
    return this.config.smoothing * velocityFactor * curvatureFactor;
  }

  // 获取当前配置
  public getConfig(): FreehandSmootherConfig {
    return { ...this.config };
  }

  // 更新配置
  public updateConfig(newConfig: Partial<FreehandSmootherConfig>): void {
    this.config = {
      ...this.config,
      ...newConfig,
    };
  }

  // 重置状态
  public reset(): void {
    this.points = [];
    this.velocities = [];
  }

  // 获取当前点的数量
  public getPointCount(): number {
    return this.points.length;
  }
}
