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

      <div class="hero-content" data-hero-content>
        <!-- Top info row -->
        <div class="hero-top" data-hero-top>
          <div class="hero-top-group">
            <span class="hero-top-label">Yentl Nerinckx</span>
            <span class="hero-top-sub">Designer &amp; Developer</span>
          </div>
          <div class="hero-top-group hero-top-right">
            <span class="hero-top-label">Available for freelance</span>
            <span class="hero-top-sub">Based in Belgium</span>
          </div>
        </div>

        <!-- Main statement — line-by-line mask reveal -->
        <div class="hero-statement">
          <div class="line-mask">
            <span class="hero-line" data-hero-line>I design &amp; build</span>
          </div>
          <div class="line-mask">
            <span class="hero-line hero-line--italic" data-hero-line>digital experiences</span>
          </div>
          <div class="line-mask">
            <span class="hero-line" data-hero-line>that feel <em class="hero-em">alive</em></span>
          </div>
        </div>

        <!-- Bottom row: anchors left, bio right -->
        <div class="hero-bottom" data-hero-bottom>
          <div class="hero-bottom-left">
            <!-- Draw line -->
            <div class="hero-draw-line" data-hero-draw-line></div>
            <div class="hero-anchors" data-hero-anchors>
              <div class="anchor-item" data-hero-anchor-item>
                <span class="anchor-num">(01)</span>
                <a href="#work" data-scroll-link class="anchor-link">Work</a>
              </div>
              <div class="anchor-item" data-hero-anchor-item>
                <span class="anchor-num">(02)</span>
                <a href="#about" data-scroll-link class="anchor-link">About</a>
              </div>
              <div class="anchor-item" data-hero-anchor-item>
                <span class="anchor-num">(03)</span>
                <a href="#contact" data-scroll-link class="anchor-link">Contact</a>
              </div>
            </div>
          </div>
          <div class="hero-bottom-right" data-hero-bio>
            <p class="hero-bio-text">
              Building brand experiences through digital media — creating
              interactive, performant &amp; memorable designs.
            </p>
          </div>
        </div>

        <!-- Scroll indicator -->
        <div class="hero-scroll-indicator" data-scroll-indicator>
          <span class="scroll-label">Scroll</span>
          <div class="scroll-track">
            <div class="scroll-progress" data-scroll-progress></div>
          </div>
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

      /* ═══ TOP INFO ═══ */
      .hero-top {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        padding-top: 5rem;
      }
      .hero-top-group {
        display: flex;
        flex-direction: column;
        gap: 3px;
        opacity: 0;
        transform: translateY(14px);
      }
      .hero-top-right { align-items: flex-end; }
      .hero-top-label {
        font-family: 'area-normal', sans-serif;
        font-size: 12px;
        font-weight: 500;
        color: rgba(255,255,255,0.8);
        letter-spacing: 0.02em;
      }
      .hero-top-sub {
        font-family: 'area-normal', sans-serif;
        font-size: 11px;
        font-weight: 400;
        letter-spacing: 0.06em;
        color: rgba(255,255,255,0.3);
        text-transform: uppercase;
      }

      /* ═══ MAIN STATEMENT ═══ */
      .hero-statement {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 0;
        padding: 2rem 0;
      }

      .line-mask {
        overflow: hidden;
        line-height: 1;
      }

      .hero-line {
        display: block;
        font-family: 'area-normal', sans-serif;
        font-size: clamp(2.8rem, 8.5vw, 8rem);
        font-weight: 700;
        letter-spacing: -0.035em;
        line-height: 1.05;
        color: #fff;
        transform: translateY(115%);
        will-change: transform;
      }

      .hero-line--italic {
        font-style: italic;
        font-weight: 300;
        color: rgba(255,255,255,0.85);
      }

      .hero-em {
        font-style: italic;
        font-weight: 300;
        position: relative;
      }

      /* ═══ BOTTOM ROW ═══ */
      .hero-bottom {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        gap: 2rem;
        padding-bottom: clamp(1.5rem, 3vw, 2.5rem);
      }

      .hero-bottom-left {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        flex: 1;
      }

      /* ── Draw line ── */
      .hero-draw-line {
        width: 100%;
        max-width: 400px;
        height: 1px;
        background: rgba(255,255,255,0.15);
        transform: scaleX(0);
        transform-origin: left center;
        will-change: transform;
      }

      /* ── Anchors ── */
      .hero-anchors {
        display: flex;
        gap: clamp(1.5rem, 4vw, 3rem);
      }
      .anchor-item {
        display: flex;
        align-items: baseline;
        gap: 0.5rem;
        opacity: 0;
        transform: translateY(16px);
      }
      .anchor-num {
        font-family: 'area-normal', sans-serif;
        font-size: 10px;
        font-weight: 500;
        color: rgba(255,255,255,0.3);
      }
      .anchor-link {
        font-family: 'area-normal', sans-serif;
        font-size: clamp(0.95rem, 1.6vw, 1.2rem);
        font-weight: 500;
        color: #fff;
        text-decoration: none;
        position: relative;
        display: inline-block;
      }
      .anchor-link::after {
        content: '';
        position: absolute;
        bottom: -2px;
        left: 0;
        width: 100%;
        height: 1px;
        background: rgba(255,255,255,0.35);
        transform: scaleX(0);
        transform-origin: right;
        transition: transform 0.5s cubic-bezier(0.625, 0.05, 0, 1);
      }
      .anchor-link:hover::after {
        transform: scaleX(1);
        transform-origin: left;
      }

      /* ── Bio ── */
      .hero-bottom-right {
        max-width: 340px;
        opacity: 0;
        transform: translateY(16px);
      }
      .hero-bio-text {
        font-family: 'area-normal', sans-serif;
        font-size: clamp(0.85rem, 1.2vw, 1rem);
        font-weight: 400;
        line-height: 1.7;
        color: rgba(255,255,255,0.45);
        margin: 0;
      }

      /* ═══ SCROLL INDICATOR ═══ */
      .hero-scroll-indicator {
        position: absolute;
        bottom: clamp(1.5rem, 3vw, 2.5rem);
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.6rem;
        opacity: 0;
      }
      .scroll-label {
        font-family: 'area-normal', sans-serif;
        font-size: 9px;
        letter-spacing: 0.2em;
        text-transform: uppercase;
        color: rgba(255,255,255,0.3);
      }
      .scroll-track {
        width: 1px;
        height: 40px;
        background: rgba(255,255,255,0.1);
        position: relative;
        overflow: hidden;
        border-radius: 1px;
      }
      .scroll-progress {
        position: absolute;
        top: -100%;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(255,255,255,0.5);
        will-change: transform;
      }

      /* ═══ RESPONSIVE ═══ */
      @media (max-width: 768px) {
        .hero-content {
          padding: 1.5rem clamp(1.5rem, 5vw, 2.5rem);
        }
        .hero-top { flex-direction: column; gap: 0.5rem; }
        .hero-top-right { align-items: flex-start; }
        .hero-bottom {
          flex-direction: column;
          align-items: flex-start;
          gap: 1.5rem;
        }
        .hero-bottom-right { max-width: 100%; }
        .hero-anchors { flex-wrap: wrap; gap: 1rem; }
        .hero-scroll-indicator { display: none; }
      }
    `
  ]
})
export class HeroComponent implements AfterViewInit, OnDestroy {
  private readonly el = inject(ElementRef);
  private tl?: gsap.core.Timeline;
  private scrollTriggers: ScrollTrigger[] = [];
  private scrollIndicatorAnim?: gsap.core.Tween;
  private rafId?: number;

  ngAfterViewInit(): void {
    this.rafId = requestAnimationFrame(() => {
      const host = this.el.nativeElement as HTMLElement;
      const topGroups = host.querySelectorAll('.hero-top-group');
      const lines = host.querySelectorAll('[data-hero-line]');
      const drawLine = host.querySelector('[data-hero-draw-line]') as HTMLElement;
      const anchorItems = host.querySelectorAll('[data-hero-anchor-item]');
      const bio = host.querySelector('[data-hero-bio]') as HTMLElement;
      const scrollIndicator = host.querySelector('[data-scroll-indicator]') as HTMLElement;
      const scrollProgress = host.querySelector('[data-scroll-progress]') as HTMLElement;
      const heroSection = host.querySelector('.hero-section') as HTMLElement;
      const heroContent = host.querySelector('[data-hero-content]') as HTMLElement;

      // ── Entrance timeline ──
      this.tl = gsap.timeline({
        defaults: { ease: 'power4.out' },
      });

      // 1. Top info groups fade + slide up
      this.tl.to(topGroups, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        stagger: 0.12,
      }, 0.1);

      // 2. Statement lines slide up one by one (editorial mask reveal)
      this.tl.to(lines, {
        y: 0,
        duration: 1.3,
        stagger: 0.1,
        ease: 'power4.out',
      }, 0.3);

      // 3. Draw line extends
      if (drawLine) {
        this.tl.to(drawLine, {
          scaleX: 1,
          duration: 1,
          ease: 'power2.inOut',
        }, '-=0.6');
      }

      // 4. Anchor items cascade
      this.tl.to(anchorItems, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.08,
        ease: 'power3.out',
      }, '-=0.5');

      // 5. Bio fades in
      if (bio) {
        this.tl.to(bio, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
        }, '-=0.4');
      }

      // 6. Scroll indicator appears + looping animation
      if (scrollIndicator && scrollProgress) {
        this.tl.to(scrollIndicator, {
          opacity: 1,
          duration: 0.6,
        }, '-=0.3');

        // Looping scroll progress animation
        this.scrollIndicatorAnim = gsap.to(scrollProgress, {
          top: '100%',
          duration: 1.8,
          ease: 'power1.inOut',
          repeat: -1,
          repeatDelay: 0.4,
        });
      }

      // ── Scroll parallax — content drifts up and fades ──
      if (heroContent && heroSection) {
        const contentST = gsap.to(heroContent, {
          y: -120,
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

      // Scroll indicator fades out faster
      if (scrollIndicator) {
        const indicatorST = gsap.to(scrollIndicator, {
          opacity: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: heroSection,
            start: '50px top',
            end: '200px top',
            scrub: 0.3,
          },
        });
        if (indicatorST.scrollTrigger) this.scrollTriggers.push(indicatorST.scrollTrigger);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.rafId) cancelAnimationFrame(this.rafId);
    this.tl?.kill();
    this.scrollIndicatorAnim?.kill();
    this.scrollTriggers.forEach(st => st.kill());
  }
}
