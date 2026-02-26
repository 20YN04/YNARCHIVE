import {
  Component,
  Input,
  AfterViewInit,
  OnChanges,
  OnDestroy,
  ElementRef,
  ViewChild,
  signal,
} from '@angular/core';

@Component({
  selector: 'app-rotor-gallery',
  standalone: true,
  template: `
    <section class="rotor-section" data-rotor-section>
      <div class="rotor-header">
        <span class="section-num">01</span>
        <h2 class="rotor-title">Featured Works</h2>
      </div>
      <div
        class="rotor-wrapper"
        #rotorWrapper
        (mouseenter)="onHover(true)"
        (mouseleave)="onHover(false)"
        (pointerdown)="onPointerDown($event)"
        (pointermove)="onPointerMove($event)"
        (pointerup)="onPointerUp()"
        (pointerleave)="onPointerUp()"
        [class.rotor-dragging]="isDragging()"
      >
        <div class="rotor-scene" #rotorScene>
          <div
            class="rotor-list"
            [style.transform]="'translate3d(0, 0, 0) rotateX(' + camXDeg + 'deg) rotateY(' + camYDeg + 'deg) rotateZ(' + camZDeg + 'deg)'"
          >
            @for (item of displayItems(); track $index) {
              <a
                [href]="item.url"
                [attr.aria-label]="'View project ' + ($index + 1)"
                target="_blank"
                rel="noopener noreferrer"
                class="rotor-item"
                [style.--item-angle]="($index / displayItems().length) * 360 + 'deg'"
                [style.--radial]="radiusPx + $index * zOffsetPx + 'px'"
              >
                <div class="rotor-face" [style.backgroundImage]="'url(' + item.imageUrl + ')'"></div>
              </a>
            }
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .rotor-section {
        padding: 4rem 0 3rem;
      }

      .rotor-header {
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        padding-bottom: 2rem;
        border-bottom: 1px solid rgba(10, 10, 10, 0.1);
        margin-bottom: 2.5rem;
      }

      .section-num {
        font-family: 'area-normal', sans-serif;
        font-size: 11px;
        letter-spacing: 0.32em;
        text-transform: uppercase;
        color: rgba(10, 10, 10, 0.4);
      }

      .rotor-title {
        font-family: 'area-normal', sans-serif;
        font-size: clamp(1.75rem, 4vw, 2.75rem);
        font-weight: 700;
        letter-spacing: -0.02em;
        margin: 0;
        color: #0a0a0a;
      }

      .rotor-wrapper {
        position: relative;
        width: 100%;
        height: 420px;
        perspective: 2800px;
        perspective-origin: 50% 50%;
        cursor: grab;
        touch-action: none;
      }

      .rotor-wrapper.rotor-dragging {
        cursor: grabbing;
      }

      .rotor-scene {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 380px;
        height: 380px;
        margin-left: -190px;
        margin-top: -190px;
        transform-style: preserve-3d;
        --global-rotation: 0deg;
      }

      .rotor-list {
        position: relative;
        width: 100%;
        height: 100%;
        transform-style: preserve-3d;
      }

      .rotor-item {
        position: absolute;
        inset: 0;
        transform-style: preserve-3d;
        transform-origin: center center;
        pointer-events: auto;
        text-decoration: none;
        color: inherit;
        cursor: pointer;
        transform: rotateY(calc(var(--global-rotation) - var(--item-angle, 0deg)))
          translateZ(var(--radial, 220px));
        -webkit-transform: rotateY(calc(var(--global-rotation) - var(--item-angle, 0deg)))
          translateZ(var(--radial, 220px));
      }

      .rotor-face {
        position: absolute;
        inset: 0;
        border-radius: 4px;
        background-color: #e5e5e5;
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        backface-visibility: hidden;
        -webkit-backface-visibility: hidden;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      }

      @media (max-width: 768px) {
        .rotor-wrapper {
          height: 340px;
        }
        .rotor-scene {
          width: 300px;
          height: 300px;
          margin-left: -150px;
          margin-top: -150px;
        }
      }
    `,
  ],
})
export class RotorGalleryComponent implements AfterViewInit, OnChanges, OnDestroy {
  @ViewChild('rotorScene') rotorScene!: ElementRef<HTMLElement>;
  @ViewChild('rotorWrapper') rotorWrapper!: ElementRef<HTMLElement>;

  /** Featured works: imageUrl + url (clickable). Takes precedence over images. */
  @Input() items: { imageUrl: string; url: string }[] = [];
  /** Legacy: image URLs only (links to #). */
  @Input() images: string[] = [];

  /** Seconds for one full rotation. */
  @Input() speedSec = 40;
  /** Camera tilt — standing-up wheel: look from front/slightly above. */
  @Input() camXDeg = -22;
  @Input() camYDeg = 0;
  @Input() camZDeg = 0;
  /** Radius of the wheel (px). */
  @Input() radiusPx = 220;
  @Input() zOffsetPx = 0;
  /** Slow down when hovering. */
  @Input() slowOnHover = true;
  @Input() enableDrag = true;

  readonly displayItems = signal<{ imageUrl: string; url: string }[]>([]);
  readonly isDragging = signal(false);

  private animationId: number | null = null;
  private lastTime: number | null = null;
  private hovered = false;
  private dragStartX = 0;
  private dragStartY = 0;
  private dragStartRotation = 0;
  private isPointerDown = false;
  private _rotationDeg = 0;
  private readonly DRAG_DEG_PER_PX = 0.4;

  ngAfterViewInit(): void {
    this.applyImages();
    this.startAnimation();
  }

  ngOnChanges(): void {
    this.applyImages();
  }

  private applyImages(): void {
    if (this.items?.length > 0) {
      this.displayItems.set([...this.items]);
      return;
    }
    const urls = this.images?.length ? [...this.images] : this.getPlaceholderImages();
    this.displayItems.set(urls.map((imageUrl) => ({ imageUrl, url: '#' })));
  }

  ngOnDestroy(): void {
    if (this.animationId != null) {
      cancelAnimationFrame(this.animationId);
    }
  }

  private getPlaceholderImages(): string[] {
    return [
      'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=600&q=80',
    ];
  }

  private getItemZIndex(index: number, n: number, rotation: number): number {
    if (n === 0) return 0;
    const angle = ((index / n) * 360 + rotation) % 360;
    const normalized = ((angle % 360) + 360) % 360;
    return normalized <= 180 ? n - index : index;
  }

  onHover(hover: boolean): void {
    this.hovered = hover;
  }

  onPointerDown(e: PointerEvent): void {
    if (!this.enableDrag) return;
    if ((e.target as HTMLElement).closest?.('a.rotor-item')) return;
    this.isPointerDown = true;
    this.dragStartX = e.clientX;
    this.dragStartY = e.clientY;
    this.dragStartRotation = this._rotationDeg;
    this.isDragging.set(true);
    (e.currentTarget as HTMLElement)?.setPointerCapture?.(e.pointerId);
  }

  onPointerMove(e: PointerEvent): void {
    if (!this.enableDrag || !this.isPointerDown) return;
    const dx = this.dragStartX - e.clientX;
    const dy = e.clientY - this.dragStartY;
    const delta = dx + dy;
    this._rotationDeg = this.dragStartRotation + delta * this.DRAG_DEG_PER_PX;
    this.applyRotation();
  }

  onPointerUp(): void {
    if (!this.isPointerDown) return;
    this.isPointerDown = false;
    this.isDragging.set(false);
    this.dragStartRotation = this._rotationDeg;
  }

  private applyRotation(): void {
    const el = this.rotorScene?.nativeElement;
    if (!el) return;
    el.style.setProperty('--global-rotation', this._rotationDeg + 'deg');
    const n = this.displayItems().length;
    const list = el.querySelector('.rotor-list');
    const items = list?.querySelectorAll('.rotor-item');
    items?.forEach((item, i) => {
      (item as HTMLElement).style.zIndex = String(this.getItemZIndex(i, n, this._rotationDeg));
    });
  }

  private startAnimation(): void {
    const degPerMs = 360 / Math.max(0.001, this.speedSec * 1000);

    const tick = (t: number) => {
      if (this.isPointerDown) {
        this.animationId = requestAnimationFrame(tick);
        return;
      }
      if (this.lastTime == null) this.lastTime = t;
      const delta = t - this.lastTime;
      this.lastTime = t;
      const factor = this.slowOnHover && this.hovered ? 0.35 : 1;
      let next = this._rotationDeg - degPerMs * delta * factor;
      next = ((next % 360) + 360) % 360;
      this._rotationDeg = next;

      const el = this.rotorScene?.nativeElement;
      if (el) {
        el.style.setProperty('--global-rotation', next + 'deg');
        const n = this.displayItems().length;
        const list = el.querySelector('.rotor-list');
        const items = list?.querySelectorAll('.rotor-item');
        items?.forEach((item, i) => {
          (item as HTMLElement).style.zIndex = String(this.getItemZIndex(i, n, next));
        });
      }
      this.animationId = requestAnimationFrame(tick);
    };

    this.animationId = requestAnimationFrame(tick);
  }
}
