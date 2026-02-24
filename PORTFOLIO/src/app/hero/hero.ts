import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild, signal } from '@angular/core';

@Component({
  selector: 'app-hero',
  standalone: true,
  template: `
    <section class="hero hero-root pt-0">
      <div class="mega-title-bar">
        <h1 class="hero-title" data-hero-title>YNARCHIVE</h1>
      </div>
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
      <section class="hero-image-container">
        <figure #heroFigure class="hero-image-wrapper" data-hero-image>
          <img
            class="h-full w-full object-cover"
            [style.transform]="'translateY(' + parallaxY() + 'px)'"
            src="https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1800&q=80"
            alt="Architectural project"
            loading="lazy"
          />
        </figure>
      </section>
      <div class="hero-bottom">
        <span class="scroll-indicator">[Scroll down]</span>
        <p class="tagline">Driven by History, Centered on Context, Embracing Culture</p>
      </div>
    </section>
  `,
  styles: [
    `
      .time-colon {
        display: inline-block;
        animation: blink 1s steps(1, end) infinite;
      }

      @keyframes blink {
        50% {
          opacity: 0;
        }
      }

      .hero-root {
        position: relative;
      }
    `
  ]
})
export class HeroComponent implements AfterViewInit, OnDestroy {
  @ViewChild('heroFigure') private readonly heroFigure?: ElementRef<HTMLElement>;
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
    const target = this.heroFigure?.nativeElement;
    if (!target) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          return;
        }

        target.classList.add('is-visible');
        observer.disconnect();
      },
      { threshold: 0.2 }
    );

    observer.observe(target);
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
