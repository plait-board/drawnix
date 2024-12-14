import { PlaitBoard } from '@plait/core';

export const withPenMode = (board: PlaitBoard) => {
  const { pointerDown, pointerMove, pointerUp, globalPointerUp } = board;
  
  // 跟踪触控状态
  let activePointers = new Map<number, PointerEvent>();
  let lastStylusTime = 0;
  let penMode = false;
  
  const STYLUS_TIMEOUT = 30000; // 30秒没有使用触控笔就退出触控笔模式

  const shouldHandleEvent = (event: PointerEvent): boolean => {
    // 多点触控时直接放行
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
    activePointers.set(event.pointerId, event);
    
    if (shouldHandleEvent(event)) {
      pointerDown(event);
    }
  };

  board.pointerMove = (event: PointerEvent) => {
    if (!activePointers.has(event.pointerId)) {
      return;
    }
    
    activePointers.set(event.pointerId, event);
    
    if (shouldHandleEvent(event)) {
      pointerMove(event);
    }
  };

  board.pointerUp = (event: PointerEvent) => {
    activePointers.delete(event.pointerId);
    pointerUp(event);
  };

  board.globalPointerUp = (event: PointerEvent) => {
    activePointers.clear();
    globalPointerUp(event);
  };

  return board;
};
