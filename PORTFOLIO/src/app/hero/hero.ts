import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-hero',
  standalone: true,
  template: `
    <section class="pt-10">
      <div class="overflow-hidden text-center">
        <h1 class="hero-title font-area-normal text-6xl font-bold uppercase tracking-[0.18em] sm:text-7xl md:text-8xl lg:text-9xl">
          YNARCHIVE
        </h1>
      </div>
      <figure
        #heroFigure
        class="hero-figure mx-auto mt-12 h-[55vh] w-full max-w-[1200px]"
      >
        <div class="hero-media h-full w-full"></div>
      </figure>
    </section>
  `,
  styles: [
    `
      .hero-title {
        transform: translateY(100%);
        animation: hero-rise 1.5s ease forwards;
      }

      @keyframes hero-rise {
        to {
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
