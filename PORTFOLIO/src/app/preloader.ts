import { Component, EventEmitter, OnDestroy, Output, signal } from '@angular/core';

@Component({
  selector: 'app-preloader',
  standalone: true,
  template: `
    <div class="fixed inset-0 z-50 w-screen">
      <div
        class="preloader-mask absolute inset-0 flex items-center justify-center bg-black"
        [class.is-exiting]="isExiting()"
        [style.--exit-duration.ms]="exitTimingMs.duration"
      >
        <div class="overflow-hidden">
          <h1 class="preloader-title font-area-normal text-7xl font-bold uppercase text-white md:text-9xl">
            <span class="preloader-letter" style="--delay: 0ms">Y</span>
            <span class="preloader-letter" style="--delay: 80ms">N</span>
            <span class="preloader-letter" style="--delay: 160ms">A</span>
            <span class="preloader-letter" style="--delay: 240ms">R</span>
            <span class="preloader-letter" style="--delay: 320ms">C</span>
            <span class="preloader-letter" style="--delay: 400ms">H</span>
            <span class="preloader-letter" style="--delay: 480ms">I</span>
            <span class="preloader-letter" style="--delay: 560ms">V</span>
            <span class="preloader-letter" style="--delay: 640ms">E</span>
          </h1>
        </div>
        <div class="preloader-progress font-area-normal">Loading {{ progress() }}%</div>
      </div>
    </div>
  `,
  styles: [
    `
      .preloader-mask {
        transform-origin: top;
      }

      .preloader-title {
        display: inline-flex;
        gap: 0.04em;
      }

      .preloader-letter {
        display: inline-block;
        filter: blur(8px);
        transform: translateY(100%);
        animation: preloader-text-rise 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        animation-delay: var(--delay, 0ms);
      }

      .is-exiting {
        animation: preloader-exit var(--exit-duration, 800ms) ease forwards;
      }

      .preloader-progress {
        position: absolute;
        right: clamp(1.25rem, 4vw, 3.5rem);
        bottom: clamp(1.25rem, 4vw, 3.5rem);
        font-size: 0.625rem;
        letter-spacing: 0.28em;
        text-transform: uppercase;
        color: #ffffff;
      }

      @keyframes preloader-text-rise {
        to {
          filter: blur(0);
          transform: translateY(0);
        }
      }

      @keyframes preloader-exit {
        to {
          transform: scaleY(0);
        }
      }
    `
  ]
})
export class PreloaderComponent implements OnDestroy {
  @Output() readonly done = new EventEmitter<void>();

  readonly isExiting = signal(false);
  readonly progress = signal(0);
  readonly exitTimingMs = { delay: 2000, duration: 800 };
  private readonly totalMs = this.exitTimingMs.delay + this.exitTimingMs.duration;
  private readonly startAt = performance.now();
  private exitTimer = window.setTimeout(() => this.startExit(), this.exitTimingMs.delay);
  private doneTimer = window.setTimeout(
    () => this.done.emit(),
    this.exitTimingMs.delay + this.exitTimingMs.duration
  );
  private progressTimer = window.setInterval(() => this.updateProgress(), 50);

  private startExit(): void {
    this.isExiting.set(true);
  }

  private updateProgress(): void {
    const elapsed = performance.now() - this.startAt;
    const value = Math.min(100, Math.round((elapsed / this.totalMs) * 100));
    this.progress.set(value);

    if (value >= 100) {
      window.clearInterval(this.progressTimer);
    }
  }

  ngOnDestroy(): void {
    window.clearTimeout(this.exitTimer);
    window.clearTimeout(this.doneTimer);
    window.clearInterval(this.progressTimer);
  }
}
