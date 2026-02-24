import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild, signal } from '@angular/core';

@Component({
  selector: 'app-hero',
  standalone: true,
  template: `
    <section class="hero-root pt-0">
      <div class="hero-band overflow-hidden bg-black text-white">
        <h1
          class="hero-title hero-title-full text-center font-area-normal text-[10vw] font-bold uppercase leading-[0.85] tracking-[-0.02em] md:text-[14vw] lg:text-[18vw]"
          data-hero-title
        >
          YNARCHIVE
        </h1>
      </div>
      <nav class="hero-nav flex h-[70px] items-center justify-between bg-white px-10 text-[15px] text-black" data-nav-bar>
        <div class="hidden items-center gap-2 md:flex">
          <a class="nav-link" href="#">Work</a>
          <span>,</span>
          <a class="nav-link" href="#">Process</a>
          <span>,</span>
          <a class="nav-link" href="#">Studio</a>
        </div>
        <div class="hidden items-center gap-6 md:flex">
          <div class="time-widget font-mono text-[#999999]">
            <span>{{ timeHour() }}</span><span class="time-colon">:</span><span>{{ timeMinute() }}</span>
            <span class="ml-2">{{ timePeriod() }}</span>
          </div>
          <div class="text-black">Tessenderlo, BEL</div>
        </div>
        <a class="nav-link hidden md:inline" href="#">Contact</a>
        <button class="md:hidden" type="button">Menu</button>
      </nav>
      <section class="hero-image-area bg-white px-10 pt-16">
        <figure #heroFigure class="hero-figure mx-auto w-[calc(100%-40px)] max-w-[900px] md:w-[68vw]" data-hero-image>
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
        <div class="hero-scroll">[Scroll down]</div>
        <div class="hero-tagline">
          Driven by History, Centered on Context, Embracing Culture
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      .hero-title {
        opacity: 1;
      }

      .hero-band {
        width: 100vw;
        margin-left: calc(50% - 50vw);
        margin-right: calc(50% - 50vw);
        min-height: clamp(180px, 20vh, 220px);
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .time-colon {
        display: inline-block;
        animation: blink 1s steps(1, end) infinite;
      }

      .nav-link {
        position: relative;
        text-decoration: none;
        color: inherit;
      }

      .nav-link::after {
        content: "";
        position: absolute;
        left: 0;
        bottom: -2px;
        width: 100%;
        height: 1px;
        background: currentColor;
        transform: scaleX(0);
        transform-origin: left;
        transition: transform 0.25s ease;
      }

      .nav-link:hover::after {
        transform: scaleX(1);
      }

      @keyframes blink {
        50% {
          opacity: 0;
        }
      }

      .hero-title-full {
        width: 100vw;
        margin-left: calc(50% - 50vw);
        margin-right: calc(50% - 50vw);
        padding-inline: 0;
        padding-bottom: 0.08em;
        white-space: nowrap;
      }

      :host-context(.preloading) .hero-title {
        opacity: 1;
      }

      @keyframes hero-rise {
        to {
          filter: blur(0);
          transform: translateY(0);
        }
      }

      .hero-root {
        position: relative;
      }

      .hero-figure {
        overflow: hidden;
        opacity: 0;
        transform: scale(1.1);
        transition: transform 0.9s ease, opacity 0.9s ease;
        aspect-ratio: 16 / 10;
      }

      .hero-figure.is-visible {
        opacity: 1;
        transform: scale(1);
      }

      .hero-image-area {
        padding-bottom: clamp(2.5rem, 8vw, 5rem);
      }

      .hero-bottom {
        position: relative;
        min-height: 120px;
        padding: 40px;
      }

      .hero-scroll {
        position: absolute;
        left: 40px;
        bottom: 40px;
        font-size: 13px;
        color: #cccccc;
        animation: scroll-bounce 2s ease-in-out infinite;
      }

      .hero-tagline {
        position: absolute;
        right: 40px;
        bottom: 40px;
        max-width: 400px;
        font-size: 20px;
        color: #1a1a1a;
        text-align: left;
      }

      @keyframes scroll-bounce {
        0%,
        100% {
          transform: translateY(0);
        }
        50% {
          transform: translateY(-6px);
        }
      }

      @media (max-width: 768px) {
        .hero-bottom {
          min-height: 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .hero-scroll,
        .hero-tagline {
          position: static;
        }
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
