import { AfterViewInit, Component, ElementRef, inject, OnDestroy } from '@angular/core';
import { WorkService, type WorkItem } from '../../services/work.service';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/** Map tags to discipline labels. */
function toDisciplineTags(item: WorkItem): string[] {
  return [...new Set((item.tags ?? []).slice(0, 3).map((t) => t.toUpperCase()))];
}

@Component({
  selector: 'app-featured-work',
  standalone: true,
  template: `
    <section class="featured-work" data-featured-work>
      <!-- Section label -->
      <div class="work-label" data-work-label>
        <span class="label-num">(01)</span>
        <span class="label-text">Selected Projects</span>
      </div>

      <!-- Reveal cards -->
      <div class="reveal-list" data-reveal-list>
        @for (project of projects(); track project.id; let i = $index) {
          <div class="reveal-card" data-reveal-card [attr.data-card-idx]="i">
            <!-- Collapsed state: thin line + title row -->
            <div class="reveal-card-header" data-reveal-header>
              <span class="reveal-card-index">{{ (i + 1).toString().padStart(2, '0') }}</span>
              <h3 class="reveal-card-title">{{ project.title }}</h3>
              <div class="reveal-card-header-meta">
                <span class="reveal-card-year">{{ project.year }}</span>
                <div class="reveal-card-tags">
                  @for (tag of toDisciplineTags(project); track tag) {
                    <span class="reveal-card-tag">{{ tag }}</span>
                  }
                </div>
              </div>
            </div>

            <!-- Expanded state: image + details -->
            <div class="reveal-card-body" data-reveal-body>
              <div class="reveal-card-body-inner" data-reveal-inner>
                <a
                  [href]="project.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="reveal-card-link"
                >
                  <div class="reveal-card-image-wrap">
                    <img
                      [src]="project.imageUrl"
                      [alt]="project.title"
                      class="reveal-card-image"
                      data-reveal-image
                      loading="lazy"
                    />
                  </div>
                  <div class="reveal-card-details">
                    <span class="reveal-card-cta">View Project &rarr;</span>
                  </div>
                </a>
              </div>
            </div>

            <!-- Bottom line -->
            <div class="reveal-card-line" data-reveal-line></div>
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
        padding: clamp(4rem, 8vw, 6rem) clamp(1.5rem, 4vw, 4rem);
        background: #0a0a0a;
        color: #fff;
      }

      /* ── Label ── */
      .work-label {
        display: flex;
        align-items: baseline;
        gap: 0.75rem;
        margin-bottom: clamp(3rem, 6vw, 4rem);
        opacity: 0;
        transform: translateY(16px);
      }
      .label-num {
        font-family: 'area-normal', sans-serif;
        font-size: 11px;
        font-weight: 400;
        color: rgba(255,255,255,0.3);
      }
      .label-text {
        font-family: 'area-normal', sans-serif;
        font-size: 11px;
        font-weight: 500;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        color: rgba(255,255,255,0.5);
      }

      /* ═══ REVEAL LIST ═══ */
      .reveal-list {
        display: flex;
        flex-direction: column;
      }

      /* ═══ CARD ═══ */
      .reveal-card {
        position: relative;
        opacity: 0;
        transform: translateY(20px);
      }

      /* ── Header (always visible) ── */
      .reveal-card-header {
        display: flex;
        align-items: baseline;
        gap: clamp(1rem, 2vw, 2rem);
        padding: clamp(1rem, 2vw, 1.5rem) 0;
        cursor: pointer;
        transition: opacity 0.3s;
      }

      .reveal-card-index {
        font-family: 'area-normal', sans-serif;
        font-size: 11px;
        font-weight: 500;
        color: rgba(255,255,255,0.25);
        letter-spacing: 0.08em;
        flex-shrink: 0;
      }

      .reveal-card-title {
        margin: 0;
        font-family: 'area-normal', sans-serif;
        font-size: clamp(1.4rem, 3.5vw, 2.8rem);
        font-weight: 600;
        letter-spacing: -0.03em;
        line-height: 1.1;
        color: rgba(255,255,255,0.7);
        flex: 1;
        transition: color 0.4s;
      }

      /* Active card gets full white title */
      .reveal-card.is-active .reveal-card-title {
        color: #fff;
      }

      .reveal-card-header-meta {
        display: flex;
        align-items: baseline;
        gap: 0.75rem;
        flex-shrink: 0;
      }

      .reveal-card-year {
        font-family: 'area-normal', sans-serif;
        font-size: 12px;
        color: rgba(255,255,255,0.25);
      }

      .reveal-card-tags {
        display: flex;
        gap: 0.3rem;
        flex-wrap: wrap;
      }

      .reveal-card-tag {
        font-family: 'area-normal', sans-serif;
        font-size: 8px;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: rgba(255,255,255,0.3);
        font-weight: 500;
        padding: 2px 6px;
        border: 1px solid rgba(255,255,255,0.1);
        border-radius: 2px;
      }

      /* ── Body (expandable) ── */
      .reveal-card-body {
        height: 0;
        overflow: hidden;
        will-change: height;
      }

      .reveal-card-body-inner {
        padding: 0 0 clamp(1.5rem, 3vw, 2.5rem);
        clip-path: inset(0 0 100% 0);
        will-change: clip-path;
      }

      .reveal-card-link {
        display: grid;
        grid-template-columns: 1fr auto;
        gap: clamp(1.5rem, 3vw, 3rem);
        align-items: end;
        text-decoration: none;
        color: inherit;
      }

      .reveal-card-image-wrap {
        position: relative;
        width: 100%;
        aspect-ratio: 16 / 9;
        overflow: hidden;
        border-radius: 4px;
      }

      .reveal-card-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transform: scale(1.1);
        will-change: transform;
        transition: transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      }

      .reveal-card-link:hover .reveal-card-image {
        transform: scale(1.02);
      }

      .reveal-card-details {
        padding-bottom: 0.5rem;
      }

      .reveal-card-cta {
        font-family: 'area-normal', sans-serif;
        font-size: 13px;
        font-weight: 500;
        color: rgba(255,255,255,0.6);
        letter-spacing: 0.02em;
        white-space: nowrap;
        transition: color 0.3s;
      }

      .reveal-card-link:hover .reveal-card-cta {
        color: #fff;
      }

      /* ── Bottom line ── */
      .reveal-card-line {
        height: 1px;
        background: rgba(255,255,255,0.1);
        transform: scaleX(0);
        transform-origin: left center;
        will-change: transform;
      }

      /* ═══ RESPONSIVE ═══ */
      @media (max-width: 768px) {
        .reveal-card-header {
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        .reveal-card-header-meta {
          width: 100%;
          padding-left: calc(11px + 1rem);
        }
        .reveal-card-link {
          grid-template-columns: 1fr;
        }
        .reveal-card-details {
          padding-top: 0.75rem;
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
  private activeIndex = -1;
  private cardEls: HTMLElement[] = [];
  private headerListeners: (() => void)[] = [];

  ngAfterViewInit(): void {
    this.rafId = requestAnimationFrame(() => {
      setTimeout(() => this.setupAnimations(), 200);
    });
  }

  private setupAnimations(): void {
    const host = this.el.nativeElement as HTMLElement;
    const section = host.querySelector('[data-featured-work]') as HTMLElement;
    const cards = host.querySelectorAll('[data-reveal-card]');
    const label = host.querySelector('[data-work-label]') as HTMLElement;

    if (!section || !cards.length) return;

    this.cardEls = Array.from(cards) as HTMLElement[];

    // ── Label reveal ──
    if (label) {
      const t = gsap.to(label, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: label,
          start: 'top 90%',
          toggleActions: 'play none none none',
        },
      });
      if (t.scrollTrigger) this.triggers.push(t.scrollTrigger);
    }

    // ── Card entrance: staggered fade in + line draw ──
    cards.forEach((card, i) => {
      const el = card as HTMLElement;
      const line = el.querySelector('[data-reveal-line]') as HTMLElement;

      const entranceSt = ScrollTrigger.create({
        trigger: el,
        start: 'top 92%',
        once: true,
        onEnter: () => {
          gsap.to(el, {
            opacity: 1,
            y: 0,
            duration: 0.7,
            delay: 0.05 * i,
            ease: 'power3.out',
            onComplete: () => {
              // Open first card automatically after entrance
              if (i === 0 && this.activeIndex < 0) {
                this.openCard(0);
              }
            },
          });
          if (line) {
            gsap.to(line, {
              scaleX: 1,
              duration: 0.9,
              delay: 0.1 + 0.05 * i,
              ease: 'power2.inOut',
            });
          }
        },
      });
      this.triggers.push(entranceSt);
    });

    // ── Hover-based accordion: hover header to expand card ──
    this.cardEls.forEach((card, i) => {
      const header = card.querySelector('[data-reveal-header]') as HTMLElement;
      if (!header) return;

      const onEnter = () => {
        if (this.activeIndex !== i) {
          this.openCard(i);
        }
      };

      header.addEventListener('mouseenter', onEnter);
      this.headerListeners.push(() => header.removeEventListener('mouseenter', onEnter));
    });
  }

  private openCard(index: number): void {
    if (this.activeIndex === index) return;

    // Close previous
    if (this.activeIndex >= 0 && this.activeIndex < this.cardEls.length) {
      this.closeCard(this.cardEls[this.activeIndex]);
    }

    this.activeIndex = index;
    const card = this.cardEls[index];
    const body = card.querySelector('[data-reveal-body]') as HTMLElement;
    const inner = card.querySelector('[data-reveal-inner]') as HTMLElement;
    const image = card.querySelector('[data-reveal-image]') as HTMLElement;

    card.classList.add('is-active');

    if (body && inner) {
      gsap.to(body, {
        height: 'auto',
        duration: 0.7,
        ease: 'power3.inOut',
      });

      gsap.to(inner, {
        clipPath: 'inset(0 0 0% 0)',
        duration: 0.7,
        ease: 'power3.inOut',
      });

      if (image) {
        gsap.to(image, {
          scale: 1,
          duration: 1,
          delay: 0.1,
          ease: 'power2.out',
        });
      }
    }
  }

  private closeCard(card: HTMLElement): void {
    const body = card.querySelector('[data-reveal-body]') as HTMLElement;
    const inner = card.querySelector('[data-reveal-inner]') as HTMLElement;
    const image = card.querySelector('[data-reveal-image]') as HTMLElement;

    card.classList.remove('is-active');

    if (body && inner) {
      gsap.to(inner, {
        clipPath: 'inset(0 0 100% 0)',
        duration: 0.5,
        ease: 'power2.inOut',
      });

      gsap.to(body, {
        height: 0,
        duration: 0.5,
        delay: 0.08,
        ease: 'power2.inOut',
      });

      if (image) {
        gsap.set(image, { scale: 1.1, delay: 0.5 });
      }
    }
  }

  ngOnDestroy(): void {
    if (this.rafId) cancelAnimationFrame(this.rafId);
    this.headerListeners.forEach((fn) => fn());
    this.triggers.forEach((t) => t.kill());
  }
}
