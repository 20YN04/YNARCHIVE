import { AfterViewInit, Component, ElementRef, Input, OnDestroy, computed, inject } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Daniel Bate style: infinite horizontal marquee with arrows,
 * scroll-direction aware speed changes.
 */
@Component({
  selector: 'app-marquee',
  standalone: true,
  template: `
    <div
      class="marquee"
      [class.marquee-dark]="dark"
      [class.marquee-large]="large"
      [class.marquee-bordered]="bordered"
      data-marquee
    >
      <div class="marquee-scroll" data-marquee-scroll>
        @for (i of trackIndices(); track i) {
          <div class="marquee-collection" data-marquee-collection>
            @for (j of itemIndices(); track j) {
              <div class="marquee-item">
                <span class="marquee-text">{{ text }}</span>
                @if (showArrows) {
                  <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 125 95" fill="none" class="marquee-arrow">
                    <path d="M73.6748 89.7824L116.207 47.2501L73.6748 4.71783" stroke="currentColor" stroke-width="12.15" stroke-miterlimit="10"/>
                    <path d="M116.207 47.25L0.762451 47.25" stroke="currentColor" stroke-width="12.15" stroke-miterlimit="10"/>
                  </svg>
                }
              </div>
            }
          </div>
        }
      </div>
    </div>
  `,
  styles: [
    `
      :host { display: block; }

      .marquee {
        overflow: hidden;
        white-space: nowrap;
        user-select: none;
        padding: 0.75rem 0;
      }

      .marquee-bordered {
        border-top: 1px solid rgba(255,255,255,0.1);
        border-bottom: 1px solid rgba(255,255,255,0.1);
      }

      .marquee-dark { color: #fff; }

      .marquee-scroll {
        display: flex;
        width: fit-content;
      }

      .marquee-collection {
        display: flex;
        flex-shrink: 0;
        will-change: transform;
      }

      .marquee-item {
        display: flex;
        align-items: center;
        gap: 1.5rem;
        padding: 0 1.5rem;
      }

      .marquee-text {
        font-family: 'area-normal', sans-serif;
        font-size: clamp(0.9rem, 1.5vw, 1.15rem);
        font-weight: 600;
        letter-spacing: 0.04em;
        text-transform: uppercase;
        white-space: nowrap;
      }

      .marquee-large .marquee-text {
        font-size: clamp(1.5rem, 3.5vw, 3rem);
        font-weight: 700;
        letter-spacing: -0.01em;
      }

      .marquee-arrow {
        width: clamp(20px, 2.5vw, 32px);
        height: auto;
        transition: transform 0.5s cubic-bezier(0.625, 0.05, 0, 1);
      }

      .marquee-large .marquee-arrow {
        width: clamp(28px, 3.5vw, 48px);
      }

      .marquee-large .marquee-item {
        gap: 2rem;
        padding: 0 2rem;
      }

      :host-context(.marquee-inverted) .marquee-arrow {
        transform: rotate(180deg);
      }
    `,
  ],
})
export class MarqueeComponent implements AfterViewInit, OnDestroy {
  private readonly el = inject(ElementRef);

  @Input() text = 'YNARCHIVE';
  @Input() copies = 3;
  @Input() itemsPerCopy = 5;
  @Input() duration = 20;
  @Input() dark = false;
  @Input() large = false;
  @Input() bordered = false;
  @Input() showArrows = true;

  private animation?: gsap.core.Tween;
  private scrollTrigger?: ScrollTrigger;

  readonly trackIndices = computed(() => Array.from({ length: this.copies }, (_, i) => i));
  readonly itemIndices = computed(() => Array.from({ length: this.itemsPerCopy }, (_, i) => i));

  ngAfterViewInit(): void {
    requestAnimationFrame(() => this.setupMarquee());
  }

  private setupMarquee(): void {
    const host = this.el.nativeElement as HTMLElement;
    const collections = host.querySelectorAll('[data-marquee-collection]');
    const marquee = host.querySelector('[data-marquee]') as HTMLElement;

    if (!collections.length || !marquee) return;

    // Animate each collection independently for seamless loop
    this.animation = gsap.to(collections, {
      xPercent: -100,
      repeat: -1,
      duration: this.duration,
      ease: 'linear',
    });

    // Scroll direction awareness – invert speed on scroll
    this.scrollTrigger = ScrollTrigger.create({
      trigger: marquee,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: (self) => {
        if (!this.animation) return;
        const dir = self.direction === 1 ? 1 : -1;
        gsap.to(this.animation, {
          timeScale: dir,
          duration: 0.3,
          overwrite: true,
        });
      },
    });
  }

  ngOnDestroy(): void {
    this.animation?.kill();
    this.scrollTrigger?.kill();
  }
}
