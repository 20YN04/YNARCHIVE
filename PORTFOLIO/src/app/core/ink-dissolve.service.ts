import { Injectable } from '@angular/core';

interface Particle {
  sx: number; sy: number; // start (letter position)
  tx: number; ty: number; // target (navbar brand)
  // Control point for quadratic bezier curve (creates the upward arc)
  cx: number; cy: number;
  // Timing
  delay: number;          // stagger: when this particle starts moving (0→~0.5s)
  duration: number;       // how long to reach target (1.4→2.3s)
  // Visual
  baseSize: number;
  alpha: number;
}

@Injectable({ providedIn: 'root' })
export class InkDissolveService {
  private canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;
  private particles: Particle[] = [];
  private animationId?: number;
  private startTime = 0;
  private onComplete?: () => void;
  private dpr = 1;
  private done = false;

  /**
   * Start the ink dissolve: letters break into particles that arc toward the navbar brand.
   * Call this while letters are still visible — particles appear on top, then
   * the caller fades the original letters.
   */
  start(
    letterEls: HTMLElement[],
    targetEl: HTMLElement,
    onComplete: () => void
  ): void {
    this.onComplete = onComplete;
    this.done = false;
    this.dpr = window.devicePixelRatio || 1;

    // Create full-screen canvas
    this.canvas = document.createElement('canvas');
    this.canvas.style.cssText =
      'position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:199;pointer-events:none;';
    this.canvas.width = window.innerWidth * this.dpr;
    this.canvas.height = window.innerHeight * this.dpr;
    document.body.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d')!;
    this.ctx.scale(this.dpr, this.dpr);

    // Target bounding box
    const brandRect = targetEl.getBoundingClientRect();

    // Sample target positions from text shape
    const targetPoints = this.sampleTextPixels(
      targetEl,
      targetEl.textContent || 'YNARCHIVE',
      600
    );

    // Build particles from each preloader letter
    this.particles = [];
    const particlesPerLetter = Math.ceil(500 / letterEls.length);

    letterEls.forEach((letterEl, letterIdx) => {
      const sourcePoints = this.sampleElementPixels(letterEl, particlesPerLetter);

      sourcePoints.forEach((sp) => {
        // Pick a target — cycle through sampled target points
        const tIdx = this.particles.length % Math.max(1, targetPoints.length);
        const tp = targetPoints[tIdx] || {
          x: brandRect.left + Math.random() * brandRect.width,
          y: brandRect.top + Math.random() * brandRect.height,
        };

        // Stagger: earlier letters start first, with per-particle jitter
        const delay = letterIdx * 0.04 + Math.random() * 0.15;

        // Duration: particles farther away take slightly longer
        const dist = Math.hypot(tp.x - sp.x, tp.y - sp.y);
        const duration = 1.4 + (dist / window.innerHeight) * 0.6 + Math.random() * 0.3;

        // Control point: creates an upward arc (ink bleed feel)
        const midX = (sp.x + tp.x) / 2 + (Math.random() - 0.5) * 120;
        const midY = Math.min(sp.y, tp.y) - 40 - Math.random() * 100;

        this.particles.push({
          sx: sp.x,
          sy: sp.y,
          tx: tp.x,
          ty: tp.y,
          cx: midX,
          cy: midY,
          delay,
          duration,
          baseSize: 1.0 + Math.random() * 2.0,
          alpha: 0,
        });
      });
    });

    this.startTime = performance.now();
    this.animate();
  }

  /** Sample pixel positions from an element's rendered text. */
  private sampleElementPixels(
    el: HTMLElement,
    max: number
  ): { x: number; y: number }[] {
    const rect = el.getBoundingClientRect();
    const text = el.textContent || '';
    if (!text || rect.width === 0) return [];

    const oc = document.createElement('canvas');
    const s = 2;
    oc.width = Math.ceil(rect.width * s);
    oc.height = Math.ceil(rect.height * s);
    const octx = oc.getContext('2d')!;
    octx.scale(s, s);

    const cs = window.getComputedStyle(el);
    octx.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
    octx.fillStyle = '#fff';
    octx.textBaseline = 'top';
    octx.fillText(text, 0, 0);

    return this.extractPoints(octx, oc.width, oc.height, rect, s, max);
  }

  /** Sample pixel positions from text rendered in an element's font. */
  private sampleTextPixels(
    el: HTMLElement,
    text: string,
    max: number
  ): { x: number; y: number }[] {
    const rect = el.getBoundingClientRect();
    const oc = document.createElement('canvas');
    const s = 2;
    oc.width = Math.max(200, Math.ceil(rect.width * s));
    oc.height = Math.max(40, Math.ceil(rect.height * s));
    const octx = oc.getContext('2d')!;
    octx.scale(s, s);

    const cs = window.getComputedStyle(el);
    octx.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
    octx.fillStyle = '#fff';
    octx.textBaseline = 'top';
    octx.fillText(text, 0, 0);

    const pts = this.extractPoints(octx, oc.width, oc.height, rect, s, max);

    // Fallback grid if brand is hidden (opacity: 0)
    if (pts.length === 0) {
      for (let r = 0; r < 5; r++) {
        for (let c = 0; c < 30; c++) {
          pts.push({
            x: rect.left + (c / 30) * rect.width,
            y: rect.top + (r / 5) * rect.height,
          });
        }
      }
    }
    return pts;
  }

  private extractPoints(
    octx: CanvasRenderingContext2D,
    w: number,
    h: number,
    rect: DOMRect,
    scale: number,
    max: number
  ): { x: number; y: number }[] {
    const data = octx.getImageData(0, 0, w, h).data;
    const pts: { x: number; y: number }[] = [];
    const step = Math.max(1, Math.floor(Math.sqrt((w * h) / (max * 4))));

    for (let py = 0; py < h; py += step) {
      for (let px = 0; px < w; px += step) {
        if (data[(py * w + px) * 4 + 3] > 128) {
          pts.push({ x: rect.left + px / scale, y: rect.top + py / scale });
        }
      }
    }

    // Shuffle
    for (let i = pts.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pts[i], pts[j]] = [pts[j], pts[i]];
    }
    return pts.slice(0, max);
  }

  // ── Animation loop: single continuous phase ──

  private animate = (): void => {
    if (this.done) return;

    const elapsed = (performance.now() - this.startTime) / 1000;
    const vw = this.canvas.width / this.dpr;
    const vh = this.canvas.height / this.dpr;

    this.ctx.clearRect(0, 0, vw, vh);

    let allDone = true;

    for (const p of this.particles) {
      const t = Math.max(0, Math.min(1, (elapsed - p.delay) / p.duration));

      if (t <= 0) {
        // Not started yet — draw at source position (stays in letter form)
        this.ctx.globalAlpha = 0.9;
        this.ctx.fillStyle = '#fff';
        this.ctx.beginPath();
        this.ctx.arc(p.sx, p.sy, p.baseSize * 0.8, 0, Math.PI * 2);
        this.ctx.fill();
        allDone = false;
        continue;
      }

      if (t < 1) allDone = false;

      // Ease in-out cubic for smooth arc traversal
      const ease = t < 0.5
        ? 4 * t * t * t
        : 1 - Math.pow(-2 * t + 2, 3) / 2;

      // Quadratic bezier: source → control → target
      const u = 1 - ease;
      const x = u * u * p.sx + 2 * u * ease * p.cx + ease * ease * p.tx;
      const y = u * u * p.sy + 2 * u * ease * p.cy + ease * ease * p.ty;

      // Alpha: fade in at start, solid through, stays solid at end
      const alpha = t < 0.1 ? t / 0.1 : 1;

      // Size: shrinks as it approaches target
      const size = p.baseSize * (1 - ease * 0.6);

      // Ink bleed jitter — strongest in the middle of the arc
      const jitter = Math.sin(t * Math.PI) * 2;
      const jx = (Math.random() - 0.5) * jitter;
      const jy = (Math.random() - 0.5) * jitter;

      this.ctx.globalAlpha = alpha;
      this.ctx.fillStyle = '#fff';
      this.ctx.beginPath();
      this.ctx.arc(x + jx, y + jy, size, 0, Math.PI * 2);
      this.ctx.fill();
    }

    this.ctx.globalAlpha = 1;

    if (allDone) {
      this.done = true;
      this.fadeOut();
      return;
    }

    this.animationId = requestAnimationFrame(this.animate);
  };

  private fadeOut(): void {
    const fadeStart = performance.now();
    const fadeDuration = 350;

    const step = () => {
      const t = Math.min(1, (performance.now() - fadeStart) / fadeDuration);
      this.canvas.style.opacity = String(1 - t);

      if (t >= 1) {
        this.canvas.remove();
        this.onComplete?.();
        return;
      }
      requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  destroy(): void {
    this.done = true;
    if (this.animationId) cancelAnimationFrame(this.animationId);
    this.canvas?.remove();
    this.particles = [];
  }
}
