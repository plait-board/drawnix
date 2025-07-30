interface ImageViewerOptions {
  zoomStep?: number;
  minZoom?: number;
  maxZoom?: number;
  enableKeyboard?: boolean;
}

interface ImageState {
  zoom: number;
  x: number;
  y: number;
  isDragging: boolean;
  dragStartX: number;
  dragStartY: number;
  imageStartX: number;
  imageStartY: number;
}

export class ImageViewer {
  private options: Required<ImageViewerOptions>;
  private overlay: HTMLDivElement | null = null;
  private imageContainer: HTMLDivElement | null = null;
  private image: HTMLImageElement | null = null;
  private closeButton: HTMLDivElement | null = null;
  private controlsContainer: HTMLDivElement | null = null;
  private delegationHandler: ((e: Event) => void) | null = null;
  private dragHandler: ((e: MouseEvent) => void) | null = null;
  private mouseUpHandler: (() => void) | null = null;
  private animationFrameId: number | null = null;
  private pendingUpdate = false;
  private state: ImageState = {
    zoom: 1,
    x: 0,
    y: 0,
    isDragging: false,
    dragStartX: 0,
    dragStartY: 0,
    imageStartX: 0,
    imageStartY: 0,
  };

  constructor(options: ImageViewerOptions = {}) {
    this.options = {
      zoomStep: options.zoomStep || 0.2,
      minZoom: options.minZoom || 0.1,
      maxZoom: options.maxZoom || 5,
      enableKeyboard: options.enableKeyboard !== false,
    };

    this.addStyles();
    this.bindEvents();
  }

  // 打开图片查看器
  open(src: string, alt = ''): void {
    this.createOverlay();
    this.createImage(src, alt);
    this.resetState();
    document.body.style.overflow = 'hidden';
  }

  // 关闭图片查看器
  close(): void {
    if (this.overlay) {
      // 清理拖动事件监听器
      this.cleanupDragEvents();
      
      // 清理全局事件监听器
      document.removeEventListener('mousemove', this.delegationHandler!);
      document.removeEventListener('mouseup', this.delegationHandler!);
      document.removeEventListener('keydown', this.delegationHandler!);
      document.removeEventListener('wheel', this.delegationHandler!);
      
      // 取消动画帧
      if (this.animationFrameId) {
        cancelAnimationFrame(this.animationFrameId);
        this.animationFrameId = null;
      }
      
      document.body.removeChild(this.overlay);
      this.overlay = null;
      this.image = null;
      this.imageContainer = null;
      this.closeButton = null;
      this.controlsContainer = null;
      this.delegationHandler = null;
      this.dragHandler = null;
      this.mouseUpHandler = null;
      this.pendingUpdate = false;
    }
    document.body.style.overflow = '';
  }

  // 创建遮罩层
  private createOverlay(): void {
    this.overlay = document.createElement('div');
    this.overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(45, 45, 45, 0.95);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      cursor: grab;
    `;

    // 点击遮罩层关闭
    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) {
        this.close();
      }
    });

    this.createCloseButton();
    this.createControls();
    document.body.appendChild(this.overlay);
  }

  // 创建关闭按钮
  private createCloseButton(): void {
    this.closeButton = document.createElement('div');
    this.closeButton.innerHTML = '×';
    this.closeButton.className = 'image-viewer-close-btn';
    this.closeButton.addEventListener('click', () => this.close());
    this.overlay!.appendChild(this.closeButton);
  }

  // 创建控制按钮
  private createControls(): void {
    this.controlsContainer = document.createElement('div');
    this.controlsContainer.style.cssText = `
      position: absolute;
      bottom: 30px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      gap: 10px;
      z-index: 10001;
    `;

    this.addStyles();

    // 放大按钮
    const zoomInBtn = document.createElement('button');
    zoomInBtn.innerHTML = '+';
    zoomInBtn.className = 'image-viewer-control-btn';
    zoomInBtn.addEventListener('click', () => this.zoomIn());

    // 缩小按钮
    const zoomOutBtn = document.createElement('button');
    zoomOutBtn.innerHTML = '-';
    zoomOutBtn.className = 'image-viewer-control-btn';
    zoomOutBtn.addEventListener('click', () => this.zoomOut());

    // 重置按钮
    const resetBtn = document.createElement('button');
    resetBtn.innerHTML = '⌂';
    resetBtn.className = 'image-viewer-control-btn';
    resetBtn.addEventListener('click', () => this.resetState());

    this.controlsContainer.appendChild(zoomOutBtn);
    this.controlsContainer.appendChild(resetBtn);
    this.controlsContainer.appendChild(zoomInBtn);
    this.overlay!.appendChild(this.controlsContainer);
  }

  // 创建图片元素
  private  createImage(src: string, alt: string): void {
    this.imageContainer = document.createElement('div');
    this.imageContainer.style.cssText = `
      position: relative;
      cursor: grab;
      display: flex;
      align-items: center;
      justify-content: center;
      max-width: calc(100vw - 80px);
      max-height: calc(100vh - 160px);
    `;

    this.image = document.createElement('img');
    this.image.src = src;
    this.image.alt = alt;
    this.image.style.cssText = `
      max-width: calc(100vw - 80px);
      max-height: calc(100vh - 160px);
      width: auto;
      height: auto;
      display: block;
      user-select: none;
      pointer-events: none;
      object-fit: contain;
    `;

    this.imageContainer.appendChild(this.image);
    this.overlay!.appendChild(this.imageContainer);

    // 绑定拖拽事件
    this.bindDragEvents();
  }

  // 绑定拖拽事件
  private bindDragEvents(): void {
    if (!this.imageContainer) return;

    // 使用 requestAnimationFrame 优化的拖动处理器
    this.dragHandler = (e: MouseEvent) => {
      if (!this.state.isDragging) return;

      const deltaX = e.clientX - this.state.dragStartX;
      const deltaY = e.clientY - this.state.dragStartY;

      this.state.x = this.state.imageStartX + deltaX;
      this.state.y = this.state.imageStartY + deltaY;

      // 使用 requestAnimationFrame 优化渲染
      if (!this.pendingUpdate) {
        this.pendingUpdate = true;
        this.animationFrameId = requestAnimationFrame(() => {
          this.updateImageTransform();
          this.pendingUpdate = false;
        });
      }
    };

    this.mouseUpHandler = () => {
      if (this.state.isDragging) {
        this.state.isDragging = false;
        if (this.imageContainer) {
          this.imageContainer.style.cursor = 'grab';
        }
        if (this.overlay) {
          this.overlay.style.cursor = 'grab';
        }
        this.cleanupDragEvents();
      }
    };

    this.imageContainer.addEventListener('mousedown', (e) => {
      e.preventDefault();
      this.state.isDragging = true;
      this.state.dragStartX = e.clientX;
      this.state.dragStartY = e.clientY;
      this.state.imageStartX = this.state.x;
      this.state.imageStartY = this.state.y;

      if (this.imageContainer) {
        this.imageContainer.style.cursor = 'grabbing';
      }
      if (this.overlay) {
        this.overlay.style.cursor = 'grabbing';
      }

      // 添加事件监听器
      if (this.dragHandler && this.mouseUpHandler) {
        document.addEventListener('mousemove', this.dragHandler, { passive: true });
        document.addEventListener('mouseup', this.mouseUpHandler, { once: true });
      }
    });
  }

  // 清理拖动事件监听器
  private cleanupDragEvents(): void {
    if (this.dragHandler) {
      document.removeEventListener('mousemove', this.dragHandler);
    }
    if (this.mouseUpHandler) {
      document.removeEventListener('mouseup', this.mouseUpHandler);
    }
  }

  // 绑定全局事件
  private bindEvents(): void {
    this.delegationHandler = (e: Event) => {
      if (!this.overlay) return;

      if (e.type === 'keydown' && this.options.enableKeyboard) {
        const keyboardEvent = e as KeyboardEvent;
        switch (keyboardEvent.key) {
          case 'Escape':
            this.close();
            break;
          case '+':
          case '=':
            keyboardEvent.preventDefault();
            this.zoomIn();
            break;
          case '-':
            keyboardEvent.preventDefault();
            this.zoomOut();
            break;
          case '0':
            keyboardEvent.preventDefault();
            this.resetState();
            break;
        }
      } else if (e.type === 'wheel') {
        const wheelEvent = e as WheelEvent;
        wheelEvent.preventDefault();
        if (wheelEvent.deltaY < 0) {
          this.zoomIn();
        } else {
          this.zoomOut();
        }
      }
    };

    document.addEventListener('keydown', this.delegationHandler);
    document.addEventListener('wheel', this.delegationHandler, {
      passive: false,
    });
  }

  // 放大
  private zoomIn(): void {
    this.state.zoom = Math.min(
      this.state.zoom + this.options.zoomStep,
      this.options.maxZoom
    );
    this.updateImageTransform();
  }

  // 缩小
  private zoomOut(): void {
    this.state.zoom = Math.max(
      this.state.zoom - this.options.zoomStep,
      this.options.minZoom
    );
    this.updateImageTransform();
  }

  // 重置状态
  private resetState(): void {
    this.state.zoom = 1;
    this.state.x = 0;
    this.state.y = 0;
    this.updateImageTransform();
  }

  // 更新图片变换
  private updateImageTransform(): void {
    if (!this.imageContainer) return;
    this.imageContainer.style.transform = `
      translate(${this.state.x}px, ${this.state.y}px) 
      scale(${this.state.zoom})
    `;
  }

  private styleElement: HTMLStyleElement | null = null;

  // 添加样式
  private addStyles(): void {
    if (!this.styleElement) {
      this.styleElement = document.createElement('style');
      this.styleElement.textContent = `
        .image-viewer-control-btn {
          background: rgba(0, 0, 0, 0.8);
          color: white;
          border: none;
          padding: 8px 14px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 18px;
          transition: background 0.2s;
          user-select: none;
        }
        
        .image-viewer-control-btn:hover {
          background: rgba(0, 0, 0, 0.4);
        }
        
        .image-viewer-close-btn {
          position: absolute;
          top: 20px;
          right: 30px;
          color: white;
          font-size: 18px;
          cursor: pointer;
          z-index: 10001;
          user-select: none;
          width: 36px;
          height: 34px;
          display: flex;
          border-radius: 50%;
          justify-content: center;
          background: rgba(0, 0, 0, 0.8);
          transition: all 0.2s ease;
          line-height: 34px;
          padding-bottom:2px;
        }
        
        .image-viewer-close-btn:hover {
          background: rgba(0, 0, 0, 0.4);
        }
      `;
      document.head.appendChild(this.styleElement);
    }
  }

  // 移除样式
  private removeStyles(): void {
    if (this.styleElement) {
      document.head.removeChild(this.styleElement);
      this.styleElement = null;
    }
  }

  // 销毁实例
  destroy(): void {
    this.close();
    this.removeStyles();
  }
}
