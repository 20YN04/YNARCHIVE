import { Component, EventEmitter, OnDestroy, OnInit, Output, signal } from '@angular/core';

@Component({
            class="preloader-title font-area-normal text-[10vw] font-semibold uppercase leading-[0.72] tracking-[-0.16em] text-white md:text-[14vw] lg:text-[18vw]"
  standalone: true,
  template: `
    <div class="preloader-root fixed inset-0 z-[100]" [class.is-exiting]="isExiting()">
      <div
        class="preloader-mask absolute inset-0 bg-black"
        [style.--exit-duration.ms]="exitTimingMs.duration"
      ></div>
      <div class="preloader-content">
        <div class="preloader-left">
          <div>FULL STACK DEVELOPER</div>
          <div>TESSENDERLO</div>
          <div>BELGIUM</div>
        </div>
        <div class="preloader-right">
          <div class="preloader-loading">Loading</div>
          <div class="preloader-counter">{{ progress() }}%</div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .preloader-root {
        --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .preloader-mask {
        transform: translateY(0);
        transition: transform var(--exit-duration, 900ms) var(--ease-out);
        will-change: transform;
      }

      .preloader-root.is-exiting .preloader-mask {
        transform: translateY(-100%);
      }

      .preloader-content {
        position: relative;
        z-index: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        padding: 0 80px;
      }

      .preloader-left {
        width: 40%;
        color: #ffffff;
        font-size: 14px;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        display: grid;
        gap: 8px;
      }

      .preloader-right {
        width: 20%;
        text-align: right;
        color: #ffffff;
      }

      .preloader-loading {
        font-size: 12px;
        letter-spacing: 0.2em;
        text-transform: uppercase;
      }

      .preloader-counter {
        font-size: 48px;
        font-weight: 700;
        line-height: 1;
      }

      @keyframes preloader-exit {
        to {
          transform: translateY(-100%);
        }
      }
    `
  ]
})
export class PreloaderComponent implements OnDestroy, OnInit {
  @Output() readonly done = new EventEmitter<void>();

  readonly isExiting = signal(false);
  readonly progress = signal(0);
  readonly exitTimingMs = { duration: 900 };
  private readonly loadingMs = 1800;
  private readonly startAt = performance.now();
  private isExitStarted = false;
  private rafId = 0;
  private doneTimer = 0;
  private handoffTimer = 0;

  ngOnInit(): void {
    document.body.classList.add('preloading');
    this.rafId = window.requestAnimationFrame((now) => this.updateProgress(now));
  }

  private startExit(): void {
    requestAnimationFrame(() => this.isExiting.set(true));
    this.handoffTimer = window.setTimeout(
      () => document.body.classList.add('handoff-complete'),
      this.exitTimingMs.duration
    );
    this.doneTimer = window.setTimeout(() => this.done.emit(), this.exitTimingMs.duration + 50);
  }

  private updateProgress(now: number): void {
    const elapsed = now - this.startAt;
    const value = Math.min(100, Math.round((elapsed / this.loadingMs) * 100));
    this.progress.set(value);

    if (value >= 100 && !this.isExitStarted) {
      this.isExitStarted = true;
      this.startExit();
      return;
    }

    if (!this.isExitStarted) {
      this.rafId = window.requestAnimationFrame((time) => this.updateProgress(time));
    }
  }

  ngOnDestroy(): void {
    document.body.classList.remove('preloading');
    window.clearTimeout(this.doneTimer);
    window.clearTimeout(this.handoffTimer);
    window.cancelAnimationFrame(this.rafId);
  }
}
