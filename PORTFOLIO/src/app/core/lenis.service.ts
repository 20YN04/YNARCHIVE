import { Injectable, OnDestroy } from '@angular/core';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Smooth scroll with Lenis, integrated with GSAP ScrollTrigger.
 * Start after the intro preloader completes so the timeline isn't affected.
 */
@Injectable({ providedIn: 'root' })
export class LenisService implements OnDestroy {
  private lenis: InstanceType<typeof Lenis> | null = null;
  private tickerAdded = false;

  start(): void {
    if (this.lenis) return;

    this.lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
    });

    this.lenis.on('scroll', () => ScrollTrigger.update());

    gsap.ticker.add(this.raf);
    gsap.ticker.lagSmoothing(0);
    this.tickerAdded = true;
  }

  private raf = (time: number): void => {
    this.lenis?.raf(time * 1000);
  };

  stop(): void {
    if (this.tickerAdded) {
      gsap.ticker.remove(this.raf);
      this.tickerAdded = false;
    }
    this.lenis?.destroy();
    this.lenis = null;
  }

  ngOnDestroy(): void {
    this.stop();
  }
}
