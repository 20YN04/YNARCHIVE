import { AfterViewInit, Component, ElementRef, inject, OnDestroy } from '@angular/core';
import { NavBarComponent } from '../components/navbar/navbar';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [NavBarComponent],
  template: `
    <section id="hero" class="hero-section" data-hero-section>
      <app-navbar></app-navbar>

      <div class="hero-content">
        <!-- Top bar — info row -->
        <div class="hero-bar" data-hero-bar>
          <div class="hero-bar-item">
            <span class="hero-bar-primary">Yentl Nerinckx</span>
            <span class="hero-bar-secondary">DESIGNER &amp; DEVELOPER</span>
          </div>
          <div class="hero-bar-item hero-bar-center">
            <span class="hero-bar-primary">Working at</span>
            <span class="hero-bar-secondary">YNARCHIVE Studio</span>
          </div>
        </div>

        <!-- Massive initials -->
        <div class="hero-initials">
          <div class="heading-line-mask">
            <h1 class="hero-initial" data-hero-heading>Y/</h1>
          </div>
          <div class="heading-line-mask heading-right">
            <h1 class="hero-initial" data-hero-heading>/N</h1>
          </div>
        </div>

        <!-- Anchor links row -->
        <div class="hero-anchors" data-hero-anchors>
          <div class="anchor-item">
            <span class="anchor-num">(01)</span>
            <a href="#work" data-scroll-link class="anchor-link" data-hero-anchor>
              <span data-btn-chars>Work</span>
            </a>
          </div>
          <div class="anchor-item">
            <span class="anchor-num">(02)</span>
            <a href="#about" data-scroll-link class="anchor-link" data-hero-anchor>
              <span data-btn-chars>About</span>
            </a>
          </div>
          <div class="anchor-item">
            <span class="anchor-num">(03)</span>
            <a href="#contact" data-scroll-link class="anchor-link" data-hero-anchor>
              <span data-btn-chars>Contact</span>
            </a>
          </div>
        </div>

        <!-- Bio -->
        <div class="hero-about" data-hero-bio>
          <p class="hero-bio-text">
            I design &amp; develop impactful digital experiences through
            UI/UX, branding, interactions, and clean engineering.
          </p>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      :host { display: block; }

      .hero-section {
        position: relative;
        display: flex;
        flex-direction: column;
        min-height: 100vh;
        width: 100%;
        background: #0a0a0a;
        color: #fff;
        overflow: hidden;
      }

      .hero-content {
        position: relative;
        z-index: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        flex: 1;
        padding: clamp(1.5rem, 3vw, 2rem) clamp(2rem, 6vw, 5rem);
        max-width: var(--content-max-width, 1920px);
        width: 100%;
        margin: 0 auto;
      }

      /* ── Top bar ── */
      .hero-bar {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        padding-top: 5rem;
        opacity: 0;
      }
      .hero-bar-item {
        display: flex;
        flex-direction: column;
        gap: 2px;
      }
      .hero-bar-center { align-items: center; }
      .hero-bar-primary {
        font-family: 'area-normal', sans-serif;
        font-size: 13px;
        font-weight: 500;
        color: #fff;
      }
      .hero-bar-secondary {
        font-family: 'area-normal', sans-serif;
        font-size: 11px;
        font-weight: 400;
        letter-spacing: 0.06em;
        color: rgba(255,255,255,0.4);
        text-transform: uppercase;
      }

      /* ── Initials ── */
      .hero-initials {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex: 1;
        padding: 2rem 0;
      }
      .heading-line-mask {
        overflow: hidden;
        line-height: 0.85;
      }
      .heading-right { text-align: right; }
      .hero-initial {
        margin: 0;
        font-family: 'area-normal', sans-serif;
        font-size: clamp(6rem, 22vw, 20rem);
        font-weight: 800;
        letter-spacing: -0.04em;
        line-height: 0.85;
        color: #fff;
        will-change: transform, opacity;
        transform: translateY(110%);
        opacity: 0;
      }

      /* ── Anchor links ── */
      .hero-anchors {
        display: flex;
        gap: clamp(2rem, 5vw, 4rem);
        padding-bottom: 1.5rem;
        opacity: 0;
      }
      .anchor-item {
        display: flex;
        align-items: baseline;
        gap: 0.5rem;
      }
      .anchor-num {
        font-family: 'area-normal', sans-serif;
        font-size: 11px;
        font-weight: 500;
        color: rgba(255,255,255,0.35);
      }
      .anchor-link {
        font-family: 'area-normal', sans-serif;
        font-size: clamp(1rem, 2vw, 1.35rem);
        font-weight: 500;
        color: #fff;
        text-decoration: none;
        position: relative;
        overflow: hidden;
        display: inline-block;
      }
      .anchor-link::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 1px;
        background: rgba(255,255,255,0.3);
        transform: scaleX(0);
        transform-origin: right;
        transition: transform 0.5s cubic-bezier(0.625, 0.05, 0, 1);
      }
      .anchor-link:hover::after {
        transform: scaleX(1);
        transform-origin: left;
      }

      /* ── Bio ── */
      .hero-about {
        max-width: 480px;
        padding-bottom: clamp(1.5rem, 3vw, 2.5rem);
        opacity: 0;
      }
      .hero-bio-text {
        font-family: 'area-normal', sans-serif;
        font-size: clamp(0.95rem, 1.4vw, 1.15rem);
        font-weight: 400;
        line-height: 1.65;
        color: rgba(255,255,255,0.55);
        margin: 0;
      }

      /* ── Responsive ── */
      @media (max-width: 768px) {
        .hero-content {
          padding: 1.5rem clamp(1.5rem, 5vw, 2.5rem);
        }
        .hero-bar { flex-direction: column; gap: 0.75rem; }
        .hero-bar-center { align-items: flex-start; }
        .hero-anchors { flex-wrap: wrap; gap: 1rem; }
        .hero-about { max-width: 100%; }
      }
    `
  ]
})
export class HeroComponent implements AfterViewInit, OnDestroy {
  private readonly el = inject(ElementRef);
  private tl?: gsap.core.Timeline;
  private scrollTriggers: ScrollTrigger[] = [];
  private rafId?: number;

  ngAfterViewInit(): void {
    this.rafId = requestAnimationFrame(() => {
      const host = this.el.nativeElement as HTMLElement;
      const headings = host.querySelectorAll('[data-hero-heading]');
      const bar = host.querySelector('[data-hero-bar]');
      const anchors = host.querySelector('[data-hero-anchors]');
      const bio = host.querySelector('[data-hero-bio]');
      const heroSection = host.querySelector('.hero-section') as HTMLElement;
      const heroContent = host.querySelector('.hero-content') as HTMLElement;

      // ── Entrance timeline ──
      this.tl = gsap.timeline({
        defaults: { ease: 'power4.out' },
      });

      // Bar fades in
      this.tl.to(bar, { opacity: 1, duration: 0.8 }, 0.2);

      // Initials slide up
      this.tl.to(headings, {
        y: 0,
        opacity: 1,
        duration: 1.2,
        stagger: 0.15,
      }, 0.3);

      // Anchors fade in
      this.tl.to(anchors, { opacity: 1, duration: 0.8 }, '-=0.5');

      // Bio fades in
      this.tl.to(bio, { opacity: 1, duration: 0.8 }, '-=0.4');

      // ── Scroll parallax ──
      if (heroContent && heroSection) {
        const contentST = gsap.to(heroContent, {
          y: -100,
          opacity: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: heroSection,
            start: 'top top',
            end: 'bottom top',
            scrub: 0.3,
          },
        });
        if (contentST.scrollTrigger) this.scrollTriggers.push(contentST.scrollTrigger);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.rafId) cancelAnimationFrame(this.rafId);
    this.tl?.kill();
    this.scrollTriggers.forEach(st => st.kill());
  }
}
