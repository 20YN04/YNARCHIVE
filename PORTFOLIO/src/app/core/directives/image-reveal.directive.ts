import { AfterViewInit, Directive, ElementRef, Input, OnDestroy } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Reusable image reveal: clip-path on scroll with generous feel.
 * Add to img wrapper or figure. Requires registerPortfolioEffects() at app init.
 */
@Directive({ selector: '[appImageReveal]', standalone: true })
export class ImageRevealDirective implements AfterViewInit, OnDestroy {
  @Input() appImageRevealDirection: 'top' | 'bottom' | 'left' | 'right' = 'top';
  @Input() appImageRevealStart = 'top 92%';
  @Input() appImageRevealEnd = 'top 50%';
  @Input() appImageRevealScrub = 0.8;
  private triggerId: string;

  constructor(private el: ElementRef<HTMLElement>) {
    this.triggerId = `image-reveal-${Math.random().toString(36).slice(2, 11)}`;
  }

  ngAfterViewInit(): void {
    const target = this.el.nativeElement;
    if (!target || typeof (gsap.effects as any)?.imageReveal !== 'function') return;

    (gsap.effects as any).imageReveal(target, {
      direction: this.appImageRevealDirection,
      duration: 1.2,
      ease: 'power4.inOut',
      scrollTrigger: {
        trigger: target,
        start: this.appImageRevealStart,
        end: this.appImageRevealEnd,
        scrub: this.appImageRevealScrub,
        id: this.triggerId
      }
    });
  }

  ngOnDestroy(): void {
    ScrollTrigger.getById(this.triggerId)?.kill();
  }
}
