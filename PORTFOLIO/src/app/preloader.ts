import { Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild, signal } from '@angular/core';

@Component({
  selector: 'app-preloader',
  standalone: true,
  template: `
    <div class="fixed inset-0 z-50 w-screen">
      <div
        class="preloader-mask absolute inset-0 bg-black"
        [class.is-exiting]="isExiting()"
        [style.--exit-duration.ms]="exitTimingMs.duration"
      ></div>
      <div
        class="preloader-title-wrap absolute inset-0 flex items-center justify-center"
        [style.--exit-duration.ms]="exitTimingMs.duration"
      >
        <div class="overflow-hidden">
          <h1
            #preloaderTitle
            class="preloader-title font-area-normal text-[clamp(3.5rem,10vw,9rem)] font-semibold uppercase tracking-[0.14em] text-white"
            [class.is-exiting]="isExiting()"
            [style.--target-x.px]="targetX()"
            [style.--target-y.px]="targetY()"
            [style.--target-scale-x]="targetScaleX()"
            [style.--target-scale-y]="targetScaleY()"
          >
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
      </div>
      <div
        class="preloader-progress font-area-normal"
        [class.is-exiting]="isExiting()"
      >
        Loading {{ progress() }}%
      </div>
    </div>
  `,
  styles: [
    `
      .preloader-mask {
        transform-origin: top;
      }

      .preloader-mask.is-exiting {
        animation: preloader-exit var(--exit-duration, 800ms) ease forwards;
      }

      .preloader-title-wrap {
        transform: translate3d(0, 0, 0);
        will-change: transform;
      }

      .preloader-title {
        display: inline-flex;
        gap: 0.04em;
        transform-origin: top left;
        transition: transform var(--exit-duration, 800ms) cubic-bezier(0.16, 1, 0.3, 1),
          opacity var(--exit-duration, 800ms) ease;
        will-change: transform;
      }

      .preloader-title.is-exiting {
        transform: translate3d(
            var(--target-x, 0px),
            var(--target-y, 0px),
            0
          )
          scale(var(--target-scale-x, 1), var(--target-scale-y, 1));
        opacity: 1;
      }

      .preloader-letter {
        display: inline-block;
        filter: blur(8px);
        transform: translateY(100%);
        animation: preloader-text-rise 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        animation-delay: var(--delay, 0ms);
      }

      .preloader-progress {
        position: absolute;
        right: clamp(1.25rem, 4vw, 3.5rem);
        bottom: clamp(1.25rem, 4vw, 3.5rem);
        font-size: 0.625rem;
        letter-spacing: 0.28em;
        text-transform: uppercase;
        color: #ffffff;
        transition: opacity var(--exit-duration, 800ms) ease;
      }

      .preloader-progress.is-exiting {
        opacity: 0;
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
export class PreloaderComponent implements OnDestroy, OnInit {
  @Output() readonly done = new EventEmitter<void>();

  @ViewChild('preloaderTitle') private readonly preloaderTitle?: ElementRef<HTMLElement>;

  readonly isExiting = signal(false);
  readonly progress = signal(0);
  readonly targetX = signal(0);
  readonly targetY = signal(0);
  readonly targetScaleX = signal(1);
  readonly targetScaleY = signal(1);
  readonly exitTimingMs = { delay: 2000, duration: 800 };
  private readonly totalMs = this.exitTimingMs.delay + this.exitTimingMs.duration;
  private readonly startAt = performance.now();
  private exitTimer = window.setTimeout(() => this.startExit(), this.exitTimingMs.delay);
  private doneTimer = window.setTimeout(
    () => this.done.emit(),
    this.exitTimingMs.delay + this.exitTimingMs.duration
  );
  private handoffTimer = window.setTimeout(
    () => document.body.classList.add('handoff-complete'),
    this.exitTimingMs.delay + this.exitTimingMs.duration - 40
  );
  private progressTimer = window.setInterval(() => this.updateProgress(), 50);

  ngOnInit(): void {
    document.body.classList.add('preloading');
  }

  private startExit(): void {
    this.alignToHero();
    requestAnimationFrame(() => this.isExiting.set(true));
  }

  private alignToHero(): void {
    const titleEl = this.preloaderTitle?.nativeElement;
    const heroTitle = document.querySelector('[data-hero-title]') as HTMLElement | null;

    if (!titleEl || !heroTitle) {
      return;
    }

    const from = titleEl.getBoundingClientRect();
    const to = heroTitle.getBoundingClientRect();
    this.targetX.set(to.left - from.left);
    this.targetY.set(to.top - from.top);
    this.targetScaleX.set(from.width ? to.width / from.width : 1);
    this.targetScaleY.set(from.height ? to.height / from.height : 1);
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
    document.body.classList.remove('preloading');
    document.body.classList.remove('handoff-complete');
    window.clearTimeout(this.exitTimer);
    window.clearTimeout(this.doneTimer);
    window.clearTimeout(this.handoffTimer);
    window.clearInterval(this.progressTimer);
  }
}
