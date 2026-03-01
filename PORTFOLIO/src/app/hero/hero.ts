import { AfterViewInit, Component, ElementRef, inject, OnDestroy } from '@angular/core';
import { NavBarComponent } from '../components/navbar/navbar';
import { gsap } from 'gsap';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [NavBarComponent],
  template: `
    <section class="hero-section" data-hero-section>
      <app-navbar></app-navbar>

      <!-- Content wrapper — vertically centers the hero content -->
      <div class="hero-content">
        <!-- Label -->
        <span class="hero-label" data-hero-label>Product &amp; Visual Designer</span>

        <!-- Massive stacked headings -->
        <div class="hero-headings">
          <div class="heading-line-mask">
            <h1 class="heading-line" data-hero-heading>Functionality</h1>
          </div>
          <div class="heading-line-mask">
            <span class="heading-amp" data-hero-heading>&amp;</span>
          </div>
          <div class="heading-line-mask">
            <h1 class="heading-line" data-hero-heading>Aesthetics</h1>
          </div>
        </div>

        <!-- Bio paragraph -->
        <p class="hero-bio" data-hero-bio>
          I craft digital experiences where purposeful design meets clean engineering —
          blending form and function to build products that feel as good as they work.
        </p>
      </div>

      <!-- Scroll indicator pinned to bottom -->
      <span class="hero-scroll" data-hero-scroll>&#123; SCROLL &#125;</span>
    </section>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      /* ═══ SECTION — full viewport, dark ═══ */
      .hero-section {
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: center;
        min-height: 100vh;
        width: 100%;
        background: #0a0a0a;
        color: #fff;
        overflow: hidden;
      }

      /* ═══ CONTENT — centered block ═══ */
      .hero-content {
        position: relative;
        z-index: 1;
        display: flex;
        flex-direction: column;
        gap: 2rem;
        padding: 8rem clamp(2rem, 6vw, 6rem) 6rem;
        max-width: 1400px;
        width: 100%;
      }

      /* ═══ LABEL — small monospace uppercase ═══ */
      .hero-label {
        font-family: 'SF Mono', 'Fira Code', 'Cascadia Code', monospace;
        font-size: 11px;
        font-weight: 500;
        letter-spacing: 0.2em;
        text-transform: uppercase;
        color: rgba(255, 255, 255, 0.5);
        opacity: 0;
      }

      /* ═══ HEADINGS — massive stacked lines ═══ */
      .hero-headings {
        display: flex;
        flex-direction: column;
        gap: 0;
      }

      .heading-line-mask {
        overflow: hidden;
        line-height: 1;
      }

      .heading-line {
        margin: 0;
        font-family: 'area-normal', sans-serif;
        font-size: clamp(3.5rem, 12vw, 11rem);
        font-weight: 800;
        line-height: 1;
        letter-spacing: -0.04em;
        text-transform: uppercase;
        color: #fff;
        will-change: transform, opacity;
        transform: translateY(100%);
        opacity: 0;
      }

      .heading-amp {
        display: block;
        margin: 0;
        font-family: 'area-normal', sans-serif;
        font-size: clamp(2.5rem, 8vw, 7rem);
        font-weight: 300;
        font-style: italic;
        line-height: 1.1;
        letter-spacing: -0.02em;
        color: rgba(255, 255, 255, 0.4);
        padding-left: 0.15em;
        will-change: transform, opacity;
        transform: translateY(100%);
        opacity: 0;
      }

      /* ═══ BIO — short paragraph ═══ */
      .hero-bio {
        max-width: 520px;
        margin: 0;
        font-family: 'area-normal', sans-serif;
        font-size: clamp(0.95rem, 1.4vw, 1.15rem);
        font-weight: 400;
        line-height: 1.65;
        color: rgba(255, 255, 255, 0.55);
        opacity: 0;
      }

      /* ═══ SCROLL INDICATOR — bottom center ═══ */
      .hero-scroll {
        position: absolute;
        bottom: 2.5rem;
        left: 50%;
        transform: translateX(-50%);
        font-family: 'SF Mono', 'Fira Code', 'Cascadia Code', monospace;
        font-size: 11px;
        font-weight: 500;
        letter-spacing: 0.3em;
        text-transform: uppercase;
        color: rgba(255, 255, 255, 0.35);
        opacity: 0;
      }

      /* ═══ Responsive ═══ */
      @media (max-width: 768px) {
        .hero-content {
          padding: 6rem clamp(1.5rem, 5vw, 2.5rem) 5rem;
          gap: 1.5rem;
        }

        .hero-bio {
          max-width: 100%;
        }

        .hero-scroll {
          bottom: 1.5rem;
        }
      }
    `
  ]
})
export class HeroComponent implements AfterViewInit, OnDestroy {
  private readonly el = inject(ElementRef);
  private tl?: gsap.core.Timeline;
  private scrollTween?: gsap.core.Tween;
  private rafId?: number;

  ngAfterViewInit(): void {
    // Defer to next frame so the DOM is fully painted & measurable
    this.rafId = requestAnimationFrame(() => {
      const host = this.el.nativeElement as HTMLElement;
      const headings = host.querySelectorAll('[data-hero-heading]');
      const label = host.querySelector('[data-hero-label]');
      const bio = host.querySelector('[data-hero-bio]');
      const scroll = host.querySelector('[data-hero-scroll]');

    // ── Main entrance timeline ──
    this.tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

    // Label fades in first
    this.tl.to(label, {
      opacity: 1,
      duration: 0.6,
    });

    // Each heading line slides up & fades in, staggered
    this.tl.to(headings, {
      y: 0,
      opacity: 1,
      duration: 1,
      stagger: 0.15,
    }, '-=0.3');

    // Bio paragraph fades in after headings
    this.tl.to(bio, {
      opacity: 1,
      duration: 0.8,
      y: 0,
    }, '-=0.3');

    // Scroll indicator fades in
    this.tl.to(scroll, {
      opacity: 1,
      duration: 0.5,
    }, '-=0.4');

    // ── Scroll indicator bounce (infinite yoyo) ──
    this.scrollTween = gsap.to(scroll, {
      y: 8,
      duration: 1.2,
      ease: 'power1.inOut',
      yoyo: true,
      repeat: -1,
      delay: this.tl.duration(),
    });
    }); // end requestAnimationFrame
  }

  ngOnDestroy(): void {
    if (this.rafId) cancelAnimationFrame(this.rafId);
    this.tl?.kill();
    this.scrollTween?.kill();
  }
}
