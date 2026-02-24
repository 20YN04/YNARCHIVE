import { AfterViewInit, Component, OnDestroy, signal } from '@angular/core';

@Component({
  selector: 'app-hero',
  standalone: true,
  template: `
    <section class="hero-section" data-hero-section>
      <!-- MEGA TITLE BAR -->
      <div class="hero-title-wrapper" data-hero-title-mask>
        <h1 class="hero-title" data-hero-title>YNARCHIVE</h1>
      </div>

      <!-- NAVIGATION BAR -->
      <nav class="hero-nav" data-nav-bar>
        <div class="nav-links">
          <a href="#work" class="nav-link">Work,</a>
          <a href="#process" class="nav-link">Process,</a>
          <a href="#studio" class="nav-link">Studio</a>
        </div>
        <div class="nav-clock">
          <span class="clock-time">{{ timeHour() }}</span>
          <span class="clock-colon">:</span>
          <span class="clock-time">{{ timeMinute() }}</span>
          <span class="clock-period">{{ timePeriod() }}</span>
          <span class="clock-location">TESSENDERLO, BEL</span>
        </div>
        <div>
          <a href="#contact" class="nav-link">Contact</a>
        </div>
      </nav>

      <!-- HERO IMAGE -->
      <div class="hero-image-section" data-hero-image-wrapper>
        <figure class="hero-image-container" data-hero-image>
          <img
            class="hero-image"
            src="https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1800&q=80"
            alt="Featured project"
            data-hero-img
          />
        </figure>
      </div>

      <!-- BOTTOM SECTION -->
      <div class="hero-bottom" data-hero-bottom>
        <div class="hero-bottom-left">
          <span class="section-number">01</span>
          <span class="scroll-indicator" data-scroll-indicator>[Scroll]</span>
        </div>
        <div class="hero-bottom-right">
          <p class="hero-tagline" data-hero-tagline>
            Driven by Passion, Centered on Code, Embracing Craft
          </p>
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

      /* TITLE */
      .hero-title-wrapper {
        position: relative;
        z-index: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        height: clamp(140px, 22vw, 220px);
        overflow: hidden;
        background: #0a0a0a;
      }

      .hero-title {
        margin: 0;
        width: 100%;
        text-align: center;
        font-family: 'area-normal', sans-serif;
        font-size: clamp(4.5rem, 15.8vw, 17rem);
        font-weight: 700;
        line-height: 0.9;
        letter-spacing: -0.03em;
        text-transform: uppercase;
        color: #fff;
        padding-bottom: 10px;
        will-change: transform;
      }

      /* NAV BAR */
      .hero-nav {
        position: relative;
        z-index: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 60px;
        padding: 0 2.5rem;
        background: #fff;
        border-bottom: 1px solid #e8e8e8;
      }

      .nav-links {
        display: flex;
        gap: 2px;
      }

      .nav-link {
        font-family: 'area-normal', sans-serif;
        font-size: 14px;
        font-weight: 400;
        color: #0a0a0a;
        text-decoration: none;
        transition: opacity 0.3s ease;
        letter-spacing: 0.01em;
      }

      .nav-link:hover {
        opacity: 0.5;
      }

      .nav-clock {
        display: flex;
        align-items: center;
        gap: 2px;
        font-family: 'area-normal', sans-serif;
        font-size: 13px;
        color: #0a0a0a;
        letter-spacing: 0.02em;
      }

      .clock-colon {
        animation: colonBlink 1s steps(1, end) infinite;
      }

      .clock-period {
        margin-left: 6px;
        font-size: 11px;
        opacity: 0.5;
        text-transform: uppercase;
      }

      .clock-location {
        margin-left: 14px;
        font-size: 11px;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        opacity: 0.4;
      }

      @keyframes colonBlink {
        50% { opacity: 0; }
      }

      /* HERO IMAGE */
      .hero-image-section {
        position: relative;
        padding: 3.5rem 2.5rem;
        background: #fff;
      }

      .hero-image-container {
        position: relative;
        margin: 0 auto;
        width: 62%;
        min-width: 320px;
        max-width: 920px;
        aspect-ratio: 4 / 3;
        overflow: hidden;
      }

      .hero-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
        will-change: transform;
        transform: scale(1.15);
      }

      /* BOTTOM SECTION */
      .hero-bottom {
        position: relative;
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        padding: 0 2.5rem 2.5rem;
        background: #fff;
        min-height: 80px;
      }

      .hero-bottom-left {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }

      .section-number {
        font-family: 'area-normal', sans-serif;
        font-size: 11px;
        letter-spacing: 0.3em;
        text-transform: uppercase;
        color: rgba(10, 10, 10, 0.35);
      }

      .scroll-indicator {
        font-family: 'area-normal', sans-serif;
        font-size: 12px;
        letter-spacing: 0.05em;
        color: rgba(10, 10, 10, 0.25);
        animation: scrollBounce 2.5s ease-in-out infinite;
      }

      @keyframes scrollBounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(5px); }
      }

      .hero-bottom-right {
        max-width: 380px;
      }

      .hero-tagline {
        margin: 0;
        font-family: 'area-normal', sans-serif;
        font-size: clamp(16px, 1.4vw, 20px);
        font-weight: 400;
        line-height: 1.5;
        color: #0a0a0a;
        letter-spacing: -0.01em;
      }

      /* Responsive */
      @media (max-width: 768px) {
        .hero-nav {
          padding: 0 1.5rem;
        }

        .hero-image-section {
          padding: 2rem 1.5rem;
        }

        .hero-image-container {
          width: 100%;
          min-width: unset;
        }

        .hero-bottom {
          flex-direction: column;
          align-items: flex-start;
          gap: 20px;
          padding: 0 1.5rem 2rem;
        }

        .hero-bottom-right {
          max-width: 100%;
        }

        .nav-clock {
          display: none;
        }
      }
    `
  ]
})
export class HeroComponent implements AfterViewInit, OnDestroy {
  readonly timeHour = signal('00');
  readonly timeMinute = signal('00');
  readonly timePeriod = signal('AM');
  private clockTimer = window.setInterval(() => this.updateTime(), 1000);

  ngAfterViewInit(): void {
    this.updateTime();
  }

  ngOnDestroy(): void {
    window.clearInterval(this.clockTimer);
  }

  private updateTime(): void {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const hour12 = hours % 12 || 12;
    this.timeHour.set(String(hour12).padStart(2, '0'));
    this.timeMinute.set(String(minutes).padStart(2, '0'));
    this.timePeriod.set(hours >= 12 ? 'PM' : 'AM');
  }
}
