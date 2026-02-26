import { AfterViewInit, Component } from '@angular/core';
import { NavBarComponent } from '../components/navbar/navbar';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [NavBarComponent],
  template: `
    <section class="hero-section" data-hero-section>
      <!-- MEGA TITLE — YNARCHIVE, flush at top, compresses into nav on scroll -->
      <div class="hero-mega-title" data-hero-mega-title>
        <span class="mega-title-text" data-hero-mega-text>YNARCHIVE</span>
      </div>

      <app-navbar></app-navbar>

      <!-- HERO TITLE — single line like Telha Clarke -->
      <div class="hero-title-block" data-hero-title-block>
        <div class="title-line-mask">
          <h1 class="hero-title-line" data-hero-title-line>Driven by History, Centered on Context, Embracing Culture</h1>
        </div>
      </div>

      <!-- HERO IMAGE — parallax mask (container moves down, image moves up) -->
      <div class="hero-image-outer" data-hero-image-outer>
        <figure class="hero-image-container" data-hero-image>
          <img
            class="hero-image"
            src="https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1800&q=80"
            alt="Featured project"
            data-hero-img
          />
        </figure>
      </div>

      <!-- BOTTOM — section number + scroll hint -->
      <div class="hero-bottom" data-hero-bottom>
        <div class="hero-bottom-left">
          <span class="section-number">01</span>
          <span class="section-label">STUDIO</span>
        </div>
        <div class="hero-bottom-center">
          <span class="scroll-hint" data-scroll-hint>[ Scroll down ]</span>
        </div>
        <div class="hero-bottom-right">
          <span class="location-label">Tessenderlo, BEL</span>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .hero-section {
        position: relative;
        min-height: 100vh;
        width: 100%;
        background: #fff;
      }

      /* ═══ MEGA TITLE — flush at very top ═══ */
      .hero-mega-title {
        position: relative;
        z-index: 2;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        height: clamp(140px, 22vw, 220px);
        background: #0a0a0a;
        clip-path: inset(0 0 0 0);
        will-change: clip-path;
      }

      .mega-title-text {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        padding-bottom: 40px;
        text-align: center;
        font-family: 'area-normal', sans-serif;
        font-size: clamp(4rem, 14vw, 15rem);
        font-weight: 700;
        line-height: 1;
        letter-spacing: -0.03em;
        text-transform: uppercase;
        color: #fff;
        white-space: nowrap;
        will-change: transform, opacity;
      }

      /* ═══ NAVIGATION — fixed, transparent, just text ═══ */
      .hero-nav {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 140;
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 64px;
        padding: 0 2.5rem;
        background: transparent;
        color: #0a0a0a;
        opacity: 0;
        pointer-events: none;
        transform: translateY(-10px);
      }

      .nav-left, .nav-right {
        display: flex;
        align-items: center;
        gap: 1rem;
      }

      .nav-right {
        gap: 1rem;
      }

      .nav-brand {
        font-family: 'area-normal', sans-serif;
        font-size: 14px;
        font-weight: 700;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: inherit;
        text-decoration: none;
      }

      .nav-center {
        display: flex;
        gap: 3px;
      }

      .nav-link {
        font-family: 'area-normal', sans-serif;
        font-size: 13px;
        font-weight: 400;
        color: inherit;
        text-decoration: none;
        transition: opacity 0.3s ease;
        letter-spacing: 0.01em;
      }

      .nav-link:hover {
        opacity: 0.5;
      }

      .nav-clock {
        font-family: 'area-normal', sans-serif;
        font-size: 12px;
        letter-spacing: 0.02em;
        opacity: 0.6;
      }

      .clock-colon {
        animation: blink 1s steps(1, end) infinite;
      }

      .clock-period {
        margin-left: 4px;
        font-size: 10px;
        opacity: 0.5;
        text-transform: uppercase;
      }

      @keyframes blink {
        50% { opacity: 0; }
      }

      /* (mega title styles are above, before nav) */

      /* ═══ HERO TITLE — single line like Telha Clarke ═══ */
      .hero-title-block {
        padding: 4rem clamp(2rem, 6vw, 5rem) 2rem;
      }

      .title-line-mask {
        overflow: hidden;
        line-height: 1.15;
      }

      .hero-title-line {
        margin: 0;
        font-family: 'area-normal', sans-serif;
        font-size: clamp(1.75rem, 4.5vw, 4rem);
        font-weight: 700;
        line-height: 1.15;
        letter-spacing: -0.02em;
        color: #0a0a0a;
        transform: translateY(110%);
        will-change: transform;
      }

      /* ═══ HERO IMAGE — parallax mask ═══ */
      .hero-image-outer {
        position: relative;
        padding: 0 clamp(2rem, 6vw, 5rem) 2.5rem;
        will-change: transform;
      }

      .hero-image-container {
        position: relative;
        margin: 0 auto;
        width: 100%;
        max-width: 1100px;
        aspect-ratio: 16 / 9;
        overflow: hidden;
      }

      .hero-image {
        width: 100%;
        height: 115%;
        object-fit: cover;
        object-position: center;
        will-change: transform;
        transform: scale(1.1) translateY(5%);
      }

      /* ═══ BOTTOM ═══ */
      .hero-bottom {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 1.5rem clamp(2rem, 6vw, 5rem) 3rem;
      }

      .hero-bottom-left,
      .hero-bottom-center,
      .hero-bottom-right {
        flex: 1;
      }

      .hero-bottom-center {
        text-align: center;
      }

      .hero-bottom-right {
        text-align: right;
      }

      .section-number {
        font-family: 'area-normal', sans-serif;
        font-size: 11px;
        letter-spacing: 0.3em;
        text-transform: uppercase;
        color: rgba(10, 10, 10, 0.3);
        margin-right: 1rem;
      }

      .section-label {
        font-family: 'area-normal', sans-serif;
        font-size: 11px;
        letter-spacing: 0.2em;
        text-transform: uppercase;
        color: rgba(10, 10, 10, 0.3);
      }

      .scroll-hint {
        font-family: 'area-normal', sans-serif;
        font-size: 11px;
        letter-spacing: 0.05em;
        color: rgba(10, 10, 10, 0.2);
        animation: scrollBounce 2.5s ease-in-out infinite;
      }

      @keyframes scrollBounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(4px); }
      }

      .location-label {
        font-family: 'area-normal', sans-serif;
        font-size: 11px;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        color: rgba(10, 10, 10, 0.3);
      }

      /* ═══ Responsive ═══ */
      @media (max-width: 768px) {
        .hero-mega-title {
          height: clamp(80px, 15vw, 120px);
        }
        .hero-nav {
          padding: 0 clamp(1.25rem, 4vw, 2rem);
        }
        .hero-title-block {
          padding: 2.5rem clamp(1.5rem, 5vw, 2.5rem) 2rem;
        }
        .hero-image-outer {
          padding: 0 clamp(1.5rem, 5vw, 2.5rem) 1.5rem;
        }
        .hero-bottom {
          flex-direction: column;
          gap: 12px;
          padding: 1rem clamp(1.5rem, 5vw, 2.5rem) 2rem;
          text-align: left;
        }
        .hero-bottom-center,
        .hero-bottom-right {
          text-align: left;
        }
      }
    `
  ]
})
export class HeroComponent implements AfterViewInit {
  ngAfterViewInit(): void {
    // ...existing code...
  }
}
