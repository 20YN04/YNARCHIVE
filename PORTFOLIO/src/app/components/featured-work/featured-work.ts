import { AfterViewInit, Component, ElementRef, inject, OnDestroy } from '@angular/core';
import { WorkService, type WorkItem } from '../../services/work.service';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/** Map category/tags to Jack Elder–style discipline labels (uppercase). */
function toDisciplineTags(item: WorkItem): string[] {
  const fromCategory = item.category.toUpperCase().replace(/-/g, ' ');
  const fromTags = (item.tags ?? []).slice(0, 3).map((t) => t.toUpperCase());
  const combined = [fromCategory, ...fromTags].filter(Boolean);
  return [...new Set(combined)];
}

@Component({
  selector: 'app-featured-work',
  standalone: true,
  template: `
    <section class="featured-work" data-featured-work>
      <!-- Section header -->
      <div class="section-header">
        <span class="section-label">Featured Work</span>
      </div>

      <!-- Full-width stacked cards -->
      <div class="cards-stack">
        @for (project of projects(); track project.id) {
          <a
            [href]="project.url"
            target="_blank"
            rel="noopener noreferrer"
            class="work-card"
            data-work-card
            (mouseenter)="onCardEnter($event)"
            (mouseleave)="onCardLeave($event)"
          >
            <!-- Client label — top-left -->
            <span class="card-client">{{ project.category }}</span>

            <!-- Large image -->
            <div class="card-image-wrap">
              <img
                [src]="project.imageUrl"
                [alt]="project.title"
                class="card-image"
                data-card-image
                loading="lazy"
              />
            </div>

            <!-- Title + tags row -->
            <div class="card-info">
              <h3 class="card-title">{{ project.title }}</h3>
              <div class="card-tags">
                @for (tag of toDisciplineTags(project); track tag) {
                  <span class="card-tag">{{ tag }}</span>
                }
              </div>
            </div>
          </a>
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
        padding: clamp(4rem, 10vw, 8rem) clamp(1.5rem, 4vw, 4rem);
      }

      /* ═══ HEADER ═══ */
      .section-header {
        margin-bottom: clamp(2.5rem, 5vw, 4rem);
        border-bottom: 1px solid rgba(10, 10, 10, 0.1);
        padding-bottom: 1rem;
      }

      .section-label {
        font-family: 'SF Mono', 'Fira Code', 'Cascadia Code', monospace;
        font-size: 11px;
        font-weight: 500;
        letter-spacing: 0.2em;
        text-transform: uppercase;
        color: rgba(10, 10, 10, 0.4);
      }

      /* ═══ CARDS STACK — full-width vertical list ═══ */
      .cards-stack {
        display: flex;
        flex-direction: column;
        gap: clamp(3rem, 6vw, 5rem);
      }

      /* ═══ CARD ═══ */
      .work-card {
        display: block;
        text-decoration: none;
        color: inherit;
        opacity: 0;
        transform: translateY(60px);
        will-change: transform, opacity;
      }

      /* Client label — small, top-left */
      .card-client {
        display: inline-block;
        font-family: 'SF Mono', 'Fira Code', 'Cascadia Code', monospace;
        font-size: 10px;
        font-weight: 500;
        letter-spacing: 0.18em;
        text-transform: uppercase;
        color: rgba(10, 10, 10, 0.45);
        margin-bottom: 0.75rem;
      }

      /* Image wrapper */
      .card-image-wrap {
        position: relative;
        width: 100%;
        aspect-ratio: 16 / 9;
        overflow: hidden;
        background: #f0f0f0;
        border-radius: 4px;
      }

      .card-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
        will-change: transform;
        transform: scale(1);
      }

      /* Info row: title left, tags right */
      .card-info {
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: 0.75rem;
        margin-top: 1rem;
      }

      .card-title {
        margin: 0;
        font-family: 'area-normal', sans-serif;
        font-size: clamp(1.4rem, 3vw, 2.25rem);
        font-weight: 700;
        letter-spacing: -0.03em;
        line-height: 1.15;
        color: #0a0a0a;
      }

      .card-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 0.75rem;
        align-items: center;
      }

      .card-tag {
        font-family: 'SF Mono', 'Fira Code', 'Cascadia Code', monospace;
        font-size: 9px;
        letter-spacing: 0.2em;
        text-transform: uppercase;
        color: rgba(10, 10, 10, 0.4);
        font-weight: 500;
        padding: 4px 10px;
        border: 1px solid rgba(10, 10, 10, 0.1);
        border-radius: 100px;
      }

      /* ═══ Responsive ═══ */
      @media (max-width: 768px) {
        .featured-work {
          padding: clamp(3rem, 8vw, 5rem) clamp(1.25rem, 4vw, 2rem);
        }

        .card-image-wrap {
          aspect-ratio: 4 / 3;
        }

        .card-info {
          flex-direction: column;
          gap: 0.5rem;
        }
      }
    `,
  ],
})
export class FeaturedWorkComponent implements AfterViewInit, OnDestroy {
  private readonly el = inject(ElementRef);
  private readonly workService = inject(WorkService);
  readonly projects = this.workService.workItems;
  toDisciplineTags = toDisciplineTags;

  private triggers: ScrollTrigger[] = [];
  private rafId?: number;

  /* ── ScrollTrigger batch: staggered reveal on scroll ── */
  ngAfterViewInit(): void {
    // Defer setup — signal-driven @for may not have rendered cards yet
    this.rafId = requestAnimationFrame(() => {
      setTimeout(() => this.setupScrollAnimations(), 100);
    });
  }

  private setupScrollAnimations(): void {
    const cards = this.el.nativeElement.querySelectorAll('[data-work-card]');
    if (!cards.length) return;

    // Ensure initial state is set explicitly
    gsap.set(cards, { opacity: 0, y: 60 });

    ScrollTrigger.batch(cards, {
      onEnter: (batch) => {
        gsap.to(
          batch,
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            stagger: 0.2,
            overwrite: true,
          }
        );
      },
      onLeaveBack: (batch) => {
        gsap.to(batch, {
          opacity: 0,
          y: 60,
          duration: 0.4,
          ease: 'power2.in',
          stagger: 0.1,
          overwrite: true,
        });
      },
      start: 'top 85%',
    });

    // Refresh so ScrollTrigger picks up positions correctly
    ScrollTrigger.refresh();

    // Store triggers for cleanup
    this.triggers = ScrollTrigger.getAll().filter((t) =>
      cards[0]?.closest('[data-featured-work]')
    );
  }

  /* ── Image hover: GSAP scale ── */
  onCardEnter(event: MouseEvent): void {
    const card = event.currentTarget as HTMLElement;
    const img = card.querySelector('[data-card-image]');
    if (img) {
      gsap.to(img, { scale: 1.05, duration: 0.4, ease: 'power2.out' });
    }
  }

  onCardLeave(event: MouseEvent): void {
    const card = event.currentTarget as HTMLElement;
    const img = card.querySelector('[data-card-image]');
    if (img) {
      gsap.to(img, { scale: 1, duration: 0.4, ease: 'power2.out' });
    }
  }

  ngOnDestroy(): void {
    if (this.rafId) cancelAnimationFrame(this.rafId);
    this.triggers.forEach((t) => t.kill());
  }
}
