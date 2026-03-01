import { AfterViewInit, Component, ElementRef, inject, OnDestroy } from '@angular/core';
import { WorkService, type WorkItem } from '../../services/work.service';
import { MarqueeComponent } from '../marquee/marquee';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/** Extract a short client code from the project title (Jack Elder style). */
function toClientCode(item: WorkItem): string {
  const words = item.title.split(/\s+/);
  if (words.length === 1) return words[0].substring(0, 3).toUpperCase();
  // Take first word if short (like "BT"), otherwise first letters
  if (words[0].length <= 3) return words[0].toUpperCase();
  return words.map(w => w[0]).join('').substring(0, 3).toUpperCase();
}

/** Map tags to uppercase discipline labels. */
function toDisciplineTags(item: WorkItem): string[] {
  const fromTags = (item.tags ?? []).slice(0, 3).map((t) => t.toUpperCase());
  return [...new Set(fromTags)];
}

@Component({
  selector: 'app-featured-work',
  standalone: true,
  imports: [MarqueeComponent],
  template: `
    <section class="featured-work" data-featured-work>
      <!-- Big heading -->
      <div class="work-heading-wrap" data-work-heading>
        <h1 class="work-heading-display">W<span class="heading-alt">O</span>RK</h1>
      </div>

      <div class="work-spacer-sm"></div>

      <!-- Info overlay -->
      <div class="work-overlay">
        <div class="work-overlay-item">
          <span class="work-overlay-text">(02)</span>
        </div>
        <div class="work-overlay-item work-overlay-right">
          <span class="work-overlay-text">NOW FOR THE GOOD STUFF</span>
        </div>
      </div>

      <div class="work-spacer-sm"></div>

      <!-- Marquee -->
      <app-marquee
        text="Selected Projects"
        [dark]="false"
        [large]="false"
        [showArrows]="true"
        [duration]="18"
      ></app-marquee>

      <div class="work-spacer-lg"></div>

      <!-- Alternating zigzag cards -->
      <div class="cards-grid">
        @for (project of projects(); track project.id; let i = $index) {
          <div
            class="card-slot"
            [class.card-slot--right]="i % 2 !== 0"
            data-work-card
          >
            <a
              [href]="project.url"
              target="_blank"
              rel="noopener noreferrer"
              class="work-card"
              (mouseenter)="onCardEnter($event)"
              (mouseleave)="onCardLeave($event)"
            >
              <!-- Image with client label overlay -->
              <div class="card-image-wrap">
                <img
                  [src]="project.imageUrl"
                  [alt]="project.title"
                  class="card-image"
                  data-card-image
                  loading="lazy"
                />
                <span class="card-client-label">{{ toClientCode(project) }}</span>
              </div>

              <!-- Title + year -->
              <div class="card-heading-row">
                <h3 class="card-title">{{ project.title }}</h3>
                <span class="card-year">{{ project.year }}</span>
              </div>

              <!-- Tag pills -->
              <div class="card-tags">
                @for (tag of toDisciplineTags(project); track tag) {
                  <span class="card-tag">{{ tag }}</span>
                }
              </div>
            </a>
          </div>
        }
      </div>
    </section>
  `,
  styles: [
    `
      :host { display: block; }

      .featured-work {
        position: relative;
        padding: clamp(4rem, 8vw, 7rem) clamp(1.5rem, 4vw, 4rem);
      }

      .work-spacer-sm { height: clamp(1rem, 2vw, 2rem); }
      .work-spacer-lg { height: clamp(2rem, 4vw, 3rem); }

      /* ═══ BIG HEADING ═══ */
      .work-heading-wrap { text-align: center; }
      .work-heading-display {
        font-family: 'area-normal', sans-serif;
        font-size: clamp(5rem, 18vw, 16rem);
        font-weight: 800;
        letter-spacing: -0.04em;
        line-height: 0.9;
        color: #0a0a0a;
        margin: 0;
        text-transform: uppercase;
      }
      .heading-alt {
        font-style: italic;
        font-weight: 300;
      }

      /* ═══ OVERLAY INFO ═══ */
      .work-overlay {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .work-overlay-item { display: flex; }
      .work-overlay-right { justify-content: flex-end; }
      .work-overlay-text {
        font-family: 'area-normal', sans-serif;
        font-size: 11px;
        font-weight: 500;
        letter-spacing: 0.06em;
        color: rgba(10,10,10,0.5);
      }

      /* ═══ CARDS GRID ═══ */
      .cards-grid {
        display: flex;
        flex-direction: column;
        gap: clamp(3rem, 6vw, 5rem);
      }

      .card-slot {
        position: relative;
        width: 55%;
        align-self: flex-start;
      }
      .card-slot--right { align-self: flex-end; }

      .work-card {
        display: block;
        text-decoration: none;
        color: inherit;
      }

      .card-image-wrap {
        position: relative;
        width: 100%;
        aspect-ratio: 4 / 3;
        overflow: hidden;
        background: #f0f0f0;
      }
      .card-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
        will-change: transform;
        transform: scale(1);
        transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      }
      .card-client-label {
        position: absolute;
        bottom: 0;
        left: 0;
        font-family: 'area-normal', sans-serif;
        font-size: 10px;
        font-weight: 500;
        letter-spacing: 0.06em;
        color: rgba(10,10,10,0.6);
        background: rgba(255,255,255,0.85);
        padding: 3px 8px;
        line-height: 1;
      }

      /* ═══ TITLE + YEAR ═══ */
      .card-heading-row {
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        gap: 1rem;
        margin-top: 0.5rem;
      }
      .card-title {
        margin: 0;
        font-family: 'area-normal', sans-serif;
        font-size: clamp(1.3rem, 3vw, 2rem);
        font-weight: 600;
        letter-spacing: -0.03em;
        line-height: 1.15;
        color: #0a0a0a;
      }
      .card-year {
        font-family: 'area-normal', sans-serif;
        font-size: 14px;
        color: rgba(10,10,10,0.4);
      }

      .card-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 0.4rem;
        margin-top: 0.5rem;
      }
      .card-tag {
        font-family: 'area-normal', sans-serif;
        font-size: 9px;
        letter-spacing: 0.15em;
        text-transform: uppercase;
        color: rgba(10,10,10,0.55);
        font-weight: 500;
        padding: 4px 10px;
        border: 1px solid rgba(10,10,10,0.15);
      }

      @media (max-width: 900px) {
        .card-slot { width: 70%; }
      }
      @media (max-width: 600px) {
        .card-slot, .card-slot--right {
          width: 100%;
          align-self: stretch;
        }
      }
    `,
  ],
})
export class FeaturedWorkComponent implements AfterViewInit, OnDestroy {
  private readonly el = inject(ElementRef);
  private readonly workService = inject(WorkService);
  readonly projects = this.workService.workItems;
  toClientCode = toClientCode;
  toDisciplineTags = toDisciplineTags;

  private triggers: ScrollTrigger[] = [];
  private rafId?: number;

  ngAfterViewInit(): void {
    this.rafId = requestAnimationFrame(() => {
      setTimeout(() => this.setupScrollAnimations(), 150);
    });
  }

  private setupScrollAnimations(): void {
    const cards = this.el.nativeElement.querySelectorAll('[data-work-card]');
    if (!cards.length) return;

    gsap.set(cards, { opacity: 0, y: 50 });

    ScrollTrigger.batch(cards, {
      onEnter: (batch) => {
        gsap.to(batch, {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'power3.out',
          stagger: 0.15,
          overwrite: true,
        });
      },
      onLeaveBack: (batch) => {
        gsap.to(batch, {
          opacity: 0,
          y: 50,
          duration: 0.4,
          ease: 'power2.in',
          stagger: 0.08,
          overwrite: true,
        });
      },
      start: 'top 88%',
    });

    // Parallax on card images — subtle upward drift
    const images = this.el.nativeElement.querySelectorAll('[data-card-image]');
    images.forEach((img: Element) => {
      gsap.to(img, {
        y: -30,
        ease: 'none',
        scrollTrigger: {
          trigger: img.closest('.card-slot') || img,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.5,
        },
      });
    });

    ScrollTrigger.refresh();
    this.triggers = ScrollTrigger.getAll();
  }

  onCardEnter(event: MouseEvent): void {
    const card = event.currentTarget as HTMLElement;
    const img = card.querySelector('[data-card-image]');
    if (img) {
      gsap.to(img, { scale: 1.04, duration: 0.5, ease: 'power2.out' });
    }
  }

  onCardLeave(event: MouseEvent): void {
    const card = event.currentTarget as HTMLElement;
    const img = card.querySelector('[data-card-image]');
    if (img) {
      gsap.to(img, { scale: 1, duration: 0.5, ease: 'power2.out' });
    }
  }

  ngOnDestroy(): void {
    if (this.rafId) cancelAnimationFrame(this.rafId);
    this.triggers.forEach((t) => t.kill());
  }
}
