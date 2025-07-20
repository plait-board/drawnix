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

    this.bindEvents();
  }

  // 打开图片查看器
  open(src: string, alt: string = ''): void {
    this.createOverlay();
    this.createImage(src, alt);
    this.resetState();
    document.body.style.overflow = 'hidden';
  }

  // 关闭图片查看器
  close(): void {
    if (this.overlay) {
      document.removeEventListener('mousemove', this.delegationHandler!);
      document.removeEventListener('mouseup', this.delegationHandler!);
      document.removeEventListener('keydown', this.delegationHandler!);
      document.removeEventListener('wheel', this.delegationHandler!);
      
      document.body.removeChild(this.overlay);
      this.overlay = null;
      this.image = null;
      this.imageContainer = null;
      this.closeButton = null;
      this.controlsContainer = null;
      this.delegationHandler = null;
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
    this.closeButton.style.cssText = `
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
      background: rgba(0, 0, 0, 0.5);
      transition: all 0.2s ease;
      line-height: 34px;
      padding-bottom:2px;
    `;

    this.closeButton.addEventListener('mouseenter', () => {
      if (this.closeButton) {
        this.closeButton.style.background = 'rgba(255, 255, 255, 0.2)';
      }
    });

    this.closeButton.addEventListener('mouseleave', () => {
      if (this.closeButton) {
        this.closeButton.style.background = 'rgba(0, 0, 0, 0.5)';
      }
    });

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

    const buttonStyle = `
      background: rgba(0, 0, 0, 0.7);
      color: white;
      border: none;
      padding: 8px 14px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 18px;
      transition: background 0.2s;
      user-select: none;
    `;

    // 放大按钮
    const zoomInBtn = document.createElement('button');
    zoomInBtn.innerHTML = '+';
    zoomInBtn.style.cssText = buttonStyle;
    zoomInBtn.addEventListener('click', () => this.zoomIn());
    zoomInBtn.addEventListener('mouseenter', () => {
      zoomInBtn.style.background = 'rgba(255, 255, 255, 0.2)';
    });
    zoomInBtn.addEventListener('mouseleave', () => {
      zoomInBtn.style.background = 'rgba(0, 0, 0, 0.7)';
    });

    // 缩小按钮
    const zoomOutBtn = document.createElement('button');
    zoomOutBtn.innerHTML = '-';
    zoomOutBtn.style.cssText = buttonStyle;
    zoomOutBtn.addEventListener('click', () => this.zoomOut());
    zoomOutBtn.addEventListener('mouseenter', () => {
      zoomOutBtn.style.background = 'rgba(255, 255, 255, 0.2)';
    });
    zoomOutBtn.addEventListener('mouseleave', () => {
      zoomOutBtn.style.background = 'rgba(0, 0, 0, 0.7)';
    });

    // 重置按钮
    const resetBtn = document.createElement('button');
    resetBtn.innerHTML = '⌂';
    resetBtn.style.cssText = buttonStyle;
    resetBtn.addEventListener('click', () => this.resetState());
    resetBtn.addEventListener('mouseenter', () => {
      resetBtn.style.background = 'rgba(255, 255, 255, 0.2)';
    });
    resetBtn.addEventListener('mouseleave', () => {
      resetBtn.style.background = 'rgba(0, 0, 0, 0.7)';
    });

    this.controlsContainer.appendChild(zoomOutBtn);
    this.controlsContainer.appendChild(resetBtn);
    this.controlsContainer.appendChild(zoomInBtn);
    this.overlay!.appendChild(this.controlsContainer);
  }

  // 创建图片元素
  private createImage(src: string, alt: string): void {
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
      transition: transform 0.2s ease;
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

    const dragHandler = (e: MouseEvent) => {
      if (!this.state.isDragging) return;

      const deltaX = e.clientX - this.state.dragStartX;
      const deltaY = e.clientY - this.state.dragStartY;

      this.state.x = this.state.imageStartX + deltaX;
      this.state.y = this.state.imageStartY + deltaY;

      this.updateImageTransform();
    };

    const mouseUpHandler = () => {
      if (this.state.isDragging) {
        this.state.isDragging = false;
        if (this.imageContainer) {
          this.imageContainer.style.cursor = 'grab';
        }
        if (this.overlay) {
          this.overlay.style.cursor = 'grab';
        }
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

      document.addEventListener('mousemove', dragHandler);
      document.addEventListener('mouseup', mouseUpHandler);
    });
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
    document.addEventListener('wheel', this.delegationHandler, { passive: false });
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
    if (!this.image) return;

    this.image.style.transform = `
      translate(${this.state.x}px, ${this.state.y}px) 
      scale(${this.state.zoom})
    `;
  }

  // 销毁实例
  destroy(): void {
    this.close();
  }
}
