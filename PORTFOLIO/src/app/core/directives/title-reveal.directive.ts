import { AfterViewInit, Directive, ElementRef, Input, OnDestroy } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Reusable title reveal: clip-path upward mask on scroll.
 * Add to any heading or text block. Requires registerPortfolioEffects() at app init.
 */
@Directive({ selector: '[appTitleReveal]', standalone: true })
export class TitleRevealDirective implements AfterViewInit, OnDestroy {
  @Input() appTitleRevealStart = 'top 88%';
  @Input() appTitleRevealEnd = 'top 55%';
  @Input() appTitleRevealScrub = 0.6;
  private triggerId: string;

  constructor(private el: ElementRef<HTMLElement>) {
    this.triggerId = `title-reveal-${Math.random().toString(36).slice(2, 11)}`;
  }

  ngAfterViewInit(): void {
    const target = this.el.nativeElement;
    if (!target || typeof (gsap.effects as any)?.titleReveal !== 'function') return;

    (gsap.effects as any).titleReveal(target, {
      duration: 1,
      ease: 'power4.out',
      scrollTrigger: {
        trigger: target,
        start: this.appTitleRevealStart,
        end: this.appTitleRevealEnd,
        scrub: this.appTitleRevealScrub,
        id: this.triggerId
      }
    });
  }

  ngOnDestroy(): void {
    ScrollTrigger.getById(this.triggerId)?.kill();
  }
}
