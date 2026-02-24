import { AfterViewInit, Component, OnDestroy, signal } from '@angular/core';

@Component({
  selector: 'app-hero',
  standalone: true,
  template: `
    <section class="hero hero-root">
      <!-- MEGA TITLE BAR -->
      <div class="mega-title-bar">
        <h1 class="hero-title" data-hero-title>YNARCHIVE</h1>
      </div>
      
      <!-- NAVIGATION BAR -->
      <nav class="nav-bar" data-nav-bar>
        <div class="nav-links">
          <a href="#work">Work,</a>
          <a href="#process">Process,</a>
          <a href="#studio">Studio</a>
        </div>
        <div class="nav-clock">
          <span>{{ timeHour() }}</span><span class="time-colon">:</span><span>{{ timeMinute() }}</span>
          <span class="ml-2">{{ timePeriod() }}</span>
          <span class="location">Tessenderlo, BEL</span>
        </div>
        <div class="nav-contact">
          <a href="#contact">Contact</a>
        </div>
      </nav>
      
      <!-- HERO IMAGE -->
      <section class="hero-image-container">
        <figure class="hero-image-wrapper" data-hero-image>
          <img
            class="hero-img"
            [style.transform]="'translateY(' + parallaxY() + 'px)'"
            src="https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1800&q=80"
            alt="Architectural project"
          />
        </figure>
      </section>
      
      <!-- BOTTOM ELEMENTS -->
      <div class="hero-bottom">
        <span class="scroll-indicator">[Scroll down]</span>
        <p class="tagline">Driven by History, Centered on Context, Embracing Culture</p>
      </div>
    </section>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      
      .hero-root {
        position: relative;
        width: 100%;
        min-height: 100vh;
        background: #fff;
      }
      
      /* MEGA TITLE BAR */
      .mega-title-bar {
        background: #000;
        height: 200px;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        position: relative;
        z-index: 1;
      }
      
      .hero-title {
        color: #fff;
        font-size: 18vw;
        font-weight: bold;
        text-transform: uppercase;
        letter-spacing: -0.02em;
        white-space: nowrap;
        margin: 0;
        line-height: 1;
        opacity: 1;
      }
      
      /* NAVIGATION BAR */
      .nav-bar {
        height: 70px;
        background: #fff;
        border-bottom: 1px solid #f0f0f0;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 40px;
        position: relative;
        z-index: 1;
      }
      
      .nav-links a {
        color: #000;
        text-decoration: none;
        font-size: 15px;
        margin-right: 2px;
        transition: opacity 0.3s;
      }
      
      .nav-links a:hover {
        opacity: 0.6;
      }
      
      .nav-clock {
        font-family: monospace;
        font-size: 14px;
        display: flex;
        align-items: center;
        gap: 4px;
      }
      
      .time-colon {
        animation: blink 1s steps(1, end) infinite;
      }
      
      @keyframes blink {
        50% { opacity: 0; }
      }
      
      .location {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        color: #000;
        margin-left: 8px;
      }
      
      .ml-2 {
        margin-left: 8px;
      }
      
      .nav-contact a {
        color: #000;
        text-decoration: none;
        font-size: 15px;
        transition: opacity 0.3s;
      }
      
      .nav-contact a:hover {
        opacity: 0.6;
      }
      
      /* HERO IMAGE */
      .hero-image-container {
        padding: 80px 40px;
        position: relative;
        background: #fff;
      }
      
      .hero-image-wrapper {
        width: 60%;
        max-width: 900px;
        margin: 0 auto;
        aspect-ratio: 4/3;
        overflow: hidden;
        position: relative;
      }
      
      .hero-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        will-change: transform;
      }
      
      /* BOTTOM ELEMENTS */
      .hero-bottom {
        position: relative;
        height: 100px;
        padding: 0 40px;
        background: #fff;
      }
      
      .scroll-indicator {
        position: absolute;
        left: 40px;
        bottom: 40px;
        font-size: 13px;
        color: #ccc;
        animation: bounce 2s infinite;
      }
      
      @keyframes bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(5px); }
      }
      
      .tagline {
        position: absolute;
        right: 40px;
        bottom: 40px;
        max-width: 350px;
        font-size: 20px;
        line-height: 1.4;
        color: #000;
        text-align: left;
        margin: 0;
      }
    `
  ]
})
export class HeroComponent implements AfterViewInit, OnDestroy {
  readonly timeHour = signal('00');
  readonly timeMinute = signal('00');
  readonly timePeriod = signal('AM');
  readonly parallaxY = signal(0);
  private clockTimer = window.setInterval(() => this.updateTime(), 1000);
  private readonly onScroll = () => this.updateParallax();

  ngAfterViewInit(): void {
    this.updateTime();
    this.updateParallax();
    window.addEventListener('scroll', this.onScroll, { passive: true });
  }

  ngOnDestroy(): void {
    window.clearInterval(this.clockTimer);
    window.removeEventListener('scroll', this.onScroll);
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

  private updateParallax(): void {
    const offset = Math.min(60, window.scrollY * 0.08);
    this.parallaxY.set(offset);
  }
}
