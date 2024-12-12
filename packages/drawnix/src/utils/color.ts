import { DEFAULT_COLOR } from '@plait/core';
import { TRANSPARENT, NO_COLOR, WHITE } from '../constants/color';

// 将 0-100 的透明度转换为 0-255 的整数
function transparencyToAlpha255(transparency: number) {
  return Math.round(((100 - transparency) / 100) * 255);
}

// 将 0-255 的 alpha 值转换为 0-100 的透明度
function alpha255ToTransparency(alpha255: number) {
  return Math.round((1 - alpha255 / 255) * 100);
}

export function applyOpacityToHex(hexColor: string, opacity: number) {
  const alpha = transparencyToAlpha255(100 - opacity);
  const alphaHex = alpha.toString(16).padStart(2, '0');
  return `${hexColor}${alphaHex}`;
}

export function hexAlphaToOpacity(hexColor: string) {
  // 移除可能存在的 # 前缀
  hexColor = hexColor.replace(/^#/, '');

  let alpha;
  if (hexColor.length === 8) {
    // 8位十六进制，提取最后两位作为 alpha 值
    alpha = parseInt(hexColor.slice(6, 8), 16);
  } else if (hexColor.length === 4) {
    // 4位十六进制（简写形式），提取最后一位并重复
    alpha = parseInt(hexColor.slice(3, 4).repeat(2), 16);
  } else {
    // 如果没有 alpha 通道，则认为是完全不透明
    return 100;
  }

  return 100 - alpha255ToTransparency(alpha);
}

export function isValidColor(color: string) {
  if (color === 'none') {
    return false;
  }
  return true;
}

export function removeHexAlpha(hexColor: string) {
  // 移除可能存在的 # 前缀，并转换为大写
  const hexColorClone = hexColor.replace(/^#/, '').toUpperCase();

  if (hexColorClone.length === 8) {
    // 8位十六进制，移除最后两位
    return '#' + hexColorClone.slice(0, 6);
  } else if (hexColorClone.length === 4) {
    // 4位十六进制（简写形式），移除最后一位
    return '#' + hexColorClone.slice(0, 3);
  } else if (hexColorClone.length === 6 || hexColorClone.length === 3) {
    // 已经是标准的 6 位或 3 位形式，直接返回
    return '#' + hexColorClone;
  } else {
    return hexColor;
  }
}

export function isTransparent(color?: string) {
  return color === TRANSPARENT;
}

export function isWhite(color?: string) {
  return color === WHITE;
}

export function isFullyTransparent(opacity: number) {
  return opacity === 0;
}

export function isFullyOpaque(opacity: number) {
  return opacity === 100;
}

export function isNoColor(value: string) {
  return value === NO_COLOR;
}

export function isDefaultStroke(color?: string) {
  return !color || color === DEFAULT_COLOR;
}
