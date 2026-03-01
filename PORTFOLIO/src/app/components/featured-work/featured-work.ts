import { AfterViewInit, Component, ElementRef, inject, OnDestroy } from '@angular/core';
import { WorkService, type WorkItem } from '../../services/work.service';
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
  template: `
    <section class="featured-work" data-featured-work>
      <!-- Sticky "Featured work" label — top-left -->
      <div class="section-label-wrap">
        <span class="section-bullet">•</span>
        <span class="section-label">Featured work</span>
      </div>

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

              <!-- Title below image -->
              <h3 class="card-title">{{ project.title }}</h3>

              <!-- Tag pills -->
              <div class="card-tags">
                @for (tag of toDisciplineTags(project); track tag) {
                  <span class="card-tag">{{ tag }}</span>
                }
              </div>
            </a>

            <!-- Decorative square between cards -->
            @if (i < projects().length - 1) {
              <div class="card-square" [class.card-square--right]="i % 2 !== 0"></div>
            }
          </div>
        }
      </div>
    </section>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      /* ═══ SECTION ═══ */
      .featured-work {
        position: relative;
        padding: clamp(4rem, 8vw, 7rem) clamp(1.5rem, 4vw, 4rem);
      }

      /* ═══ STICKY LABEL — top-left (like Jack Elder "• Featured work") ═══ */
      .section-label-wrap {
        position: sticky;
        top: 1.5rem;
        z-index: 5;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: clamp(2rem, 4vw, 3rem);
        pointer-events: none;
      }

      .section-bullet {
        font-size: 10px;
        color: #0a0a0a;
      }

      .section-label {
        font-family: 'area-normal', sans-serif;
        font-size: 11px;
        font-weight: 500;
        letter-spacing: 0.08em;
        color: #0a0a0a;
        margin: 0;
      }

      /* ═══ CARDS GRID — alternating zigzag ═══ */
      .cards-grid {
        display: flex;
        flex-direction: column;
        gap: clamp(3rem, 6vw, 5rem);
      }

      /* ═══ CARD SLOT — controls left/right position ═══ */
      .card-slot {
        position: relative;
        width: 55%;
        align-self: flex-start;
      }

      .card-slot--right {
        align-self: flex-end;
      }

      /* ═══ CARD LINK ═══ */
      .work-card {
        display: block;
        text-decoration: none;
        color: inherit;
      }

      /* ═══ IMAGE — with overlapping client label ═══ */
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

      /* Client label — overlapping bottom-left of image */
      .card-client-label {
        position: absolute;
        bottom: 0;
        left: 0;
        font-family: 'area-normal', sans-serif;
        font-size: 10px;
        font-weight: 500;
        letter-spacing: 0.06em;
        color: rgba(10, 10, 10, 0.6);
        background: rgba(255, 255, 255, 0.85);
        padding: 3px 8px;
        line-height: 1;
      }

      /* ═══ TITLE — large, below image ═══ */
      .card-title {
        margin: 0.75rem 0 0;
        font-family: 'area-normal', sans-serif;
        font-size: clamp(1.5rem, 3.5vw, 2.5rem);
        font-weight: 600;
        letter-spacing: -0.03em;
        line-height: 1.15;
        color: #0a0a0a;
      }

      /* ═══ TAGS — bordered pills ═══ */
      .card-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 0.4rem;
        margin-top: 0.6rem;
      }

      .card-tag {
        font-family: 'area-normal', sans-serif;
        font-size: 9px;
        letter-spacing: 0.15em;
        text-transform: uppercase;
        color: rgba(10, 10, 10, 0.55);
        font-weight: 500;
        padding: 4px 10px;
        border: 1px solid rgba(10, 10, 10, 0.15);
      }

      /* ═══ DECORATIVE SQUARE — between cards, centered ═══ */
      .card-square {
        position: absolute;
        bottom: -2rem;
        right: -3rem;
        width: 12px;
        height: 12px;
        background: #0a0a0a;
      }

      .card-square--right {
        right: auto;
        left: -3rem;
      }

      /* ═══ Responsive ═══ */
      @media (max-width: 900px) {
        .card-slot {
          width: 70%;
        }

        .card-square {
          display: none;
        }
      }

      @media (max-width: 600px) {
        .card-slot,
        .card-slot--right {
          width: 100%;
          align-self: stretch;
        }

        .card-image-wrap {
          aspect-ratio: 4 / 3;
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
