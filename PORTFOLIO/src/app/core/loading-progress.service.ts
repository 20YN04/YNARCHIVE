import { Injectable, signal } from '@angular/core';

/**
 * Drives the preloader loading percentage (0–100) from the app timeline.
 */
@Injectable({ providedIn: 'root' })
export class LoadingProgressService {
  readonly progress = signal(0);

  setProgress(value: number): void {
    this.progress.set(Math.round(Math.min(100, Math.max(0, value))));
  }
}
