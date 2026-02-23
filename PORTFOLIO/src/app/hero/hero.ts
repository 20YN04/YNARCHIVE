import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-hero',
  standalone: true,
  template: `
    <section class="pt-10">
      <div class="flex items-center justify-between text-[11px] uppercase tracking-[0.32em] text-[#1a1a1a]/60">
        <span>01</span>
        <span>Portfolio</span>
      </div>
      <div class="mt-6 overflow-hidden">
        <h1 class="hero-title font-area-normal text-[clamp(3.5rem,10vw,9rem)] font-semibold uppercase tracking-[0.14em]">
          YNARCHIVE
        </h1>
      </div>
      <figure #heroFigure class="hero-figure mt-12 h-[58vh] w-full">
        <div class="hero-media h-full w-full"></div>
      </figure>
    </section>
  `,
  styles: [
    `
      .hero-title {
        transform: translateY(110%);
        filter: blur(6px);
        animation: hero-rise 1.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      }

      @keyframes hero-rise {
        to {
          filter: blur(0);
          transform: translateY(0);
        }
      }

      .hero-figure {
        overflow: hidden;
        opacity: 0;
        transform: scale(1.1);
        transition: transform 0.9s ease, opacity 0.9s ease;
      }

      .hero-figure.is-visible {
        opacity: 1;
        transform: scale(1);
      }

      .hero-media {
        background: linear-gradient(135deg, #dedede 0%, #bdbdbd 50%, #ececec 100%);
        border: 1px solid #1a1a1a;
      }
    `
  ]
})
export class HeroComponent implements AfterViewInit {
  @ViewChild('heroFigure') private readonly heroFigure?: ElementRef<HTMLElement>;

  ngAfterViewInit(): void {
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
}
