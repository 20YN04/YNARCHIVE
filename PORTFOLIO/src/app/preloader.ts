import { Component, EventEmitter, OnDestroy, Output, signal } from '@angular/core';

@Component({
  selector: 'app-preloader',
  standalone: true,
  template: `
    <div
      class="fixed inset-0 z-50 flex items-center justify-center bg-black"
      [class.is-exiting]="isExiting()"
    >
      <div class="overflow-hidden">
        <h1
          class="preloader-title font-area-normal text-7xl font-bold uppercase text-white md:text-9xl"
        >
          YNARCHIVE
        </h1>
      </div>
    </div>
  `,
  styles: [
    `
      .preloader-title {
        transform: translateY(100%);
        animation: preloader-text-rise 1.5s ease forwards;
      }

      .is-exiting {
        animation: preloader-exit 0.8s ease forwards;
      }

      @keyframes preloader-text-rise {
        to {
          transform: translateY(0);
        }
      }

      @keyframes preloader-exit {
        to {
          transform: translateY(-100%);
          opacity: 0;
        }
      }
    `
  ]
})
export class PreloaderComponent implements OnDestroy {
  @Output() readonly done = new EventEmitter<void>();

  readonly isExiting = signal(false);
  private exitTimer = window.setTimeout(() => this.isExiting.set(true), 2000);
  private doneTimer = window.setTimeout(() => this.done.emit(), 2800);

  ngOnDestroy(): void {
    window.clearTimeout(this.exitTimer);
    window.clearTimeout(this.doneTimer);
  }
}
