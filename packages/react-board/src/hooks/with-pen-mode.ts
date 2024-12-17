import {
  PlaitBoard,
  toHostPoint,
  toViewBoxPoint,
} from '@plait/core';

export const withPenMode = (board: PlaitBoard) => {
  const { pointerDown, pointerMove, pointerUp, globalPointerUp } = board;
  
  // 跟踪触控状态
  const activePointers = new Map<number, PointerEvent>();
  let lastStylusTime = 0;
  let penMode = false;
  
  const STYLUS_TIMEOUT = 30000; // 30秒没有使用触控笔就退出触控笔模式
  const PALM_REJECTION_SIZE = 30; // 手掌触控通常面积较大
  const PALM_REJECTION_PRESSURE = 0.1; // 手掌触控通常压力较小

  const isPalmTouch = (event: PointerEvent): boolean => {
    // 触控笔输入直接放行
    if (event.pointerType === 'pen') {
      return false;
    }

    // 检查触控点的大小
    const touchSize = Math.max(event.width, event.height);
    
    // 如果是手指触控且尺寸大于阈值，认为是手掌
    // 或者压力值特别小，也可能是手掌
    return (
      event.pointerType === 'touch' && 
      (touchSize > PALM_REJECTION_SIZE || event.pressure < PALM_REJECTION_PRESSURE)
    );
  };

  const shouldHandleEvent = (event: PointerEvent): boolean => {
    // 检查是否是手掌触控
    if (isPalmTouch(event)) {
      return false;
    }

    // 多点触控时（比如双指缩放）直接放行
    if (activePointers.size > 1) {
      return true;
    }

    const isPen = event.pointerType === 'pen';
    
    // 更新触控笔状态
    if (isPen) {
      lastStylusTime = Date.now();
      penMode = true;
    }

    // 检查是否需要退出触控笔模式
    if (penMode && Date.now() - lastStylusTime > STYLUS_TIMEOUT) {
      penMode = false;
    }

    // 在触控笔模式下，只允许触控笔输入
    return !penMode || isPen;
  };

  board.pointerDown = (event: PointerEvent) => {
    // 先判断是否处理这个事件
    if (shouldHandleEvent(event)) {
      activePointers.set(event.pointerId, event);
      pointerDown(event);
    }
  };

  board.pointerMove = (event: PointerEvent) => {
    // 如果这个触控点之前没有被记录，说明是被拒绝的触控（如手掌）
    if (!activePointers.has(event.pointerId)) {
      return;
    }
    
    if (shouldHandleEvent(event)) {
      activePointers.set(event.pointerId, event);
      pointerMove(event);
    }
  };

  board.pointerUp = (event: PointerEvent) => {
    // 无论是否是被拒绝的触控，都需要清理
    activePointers.delete(event.pointerId);
    
    // 只有之前接受的触控才触发 pointerUp
    if (activePointers.has(event.pointerId)) {
      pointerUp(event);
    }
  };

  board.globalPointerUp = (event: PointerEvent) => {
    activePointers.clear();
    globalPointerUp(event);
  };

  return board;
};
