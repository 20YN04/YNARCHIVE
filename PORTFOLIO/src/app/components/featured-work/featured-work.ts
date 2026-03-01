import { AfterViewInit, Component, ElementRef, inject, OnDestroy } from '@angular/core';
import { WorkService, type WorkItem } from '../../services/work.service';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/** Extract a short client code from the project title. */
function toClientCode(item: WorkItem): string {
  const words = item.title.split(/\s+/);
  if (words.length === 1) return words[0].substring(0, 3).toUpperCase();
  if (words[0].length <= 3) return words[0].toUpperCase();
  return words.map(w => w[0]).join('').substring(0, 3).toUpperCase();
}

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

      <!-- Horizontal scroll track -->
      <div class="h-scroll-wrapper" data-h-scroll-wrapper>
        <div class="h-scroll-track" data-h-scroll-track>
          @for (project of projects(); track project.id; let i = $index) {
            <div class="h-card" data-h-card>
              <a
                [href]="project.url"
                target="_blank"
                rel="noopener noreferrer"
                class="h-card-link"
                (mouseenter)="onCardEnter($event)"
                (mouseleave)="onCardLeave($event)"
              >
                <div class="h-card-image-wrap">
                  <img
                    [src]="project.imageUrl"
                    [alt]="project.title"
                    class="h-card-image"
                    data-card-image
                    loading="lazy"
                  />
                  <span class="h-card-index">{{ (i + 1).toString().padStart(2, '0') }}</span>
                </div>
                <div class="h-card-info">
                  <h3 class="h-card-title">{{ project.title }}</h3>
                  <span class="h-card-year">{{ project.year }}</span>
                  <div class="h-card-tags">
                    @for (tag of toDisciplineTags(project); track tag) {
                      <span class="h-card-tag">{{ tag }}</span>
                    }
                  </div>
                </div>
              </a>
            </div>
          }

          <!-- End card — CTA -->
          <div class="h-card h-card-end">
            <div class="h-card-end-inner">
              <span class="h-card-end-num">{{ projects().length }}</span>
              <span class="h-card-end-label">Projects &amp; counting</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      :host { display: block; }

      .featured-work {
        position: relative;
        padding: clamp(4rem, 8vw, 6rem) 0;
        overflow: hidden;
      }

      /* ── Label ── */
      .work-label {
        display: flex;
        align-items: baseline;
        gap: 0.75rem;
        padding: 0 clamp(1.5rem, 4vw, 4rem);
        margin-bottom: clamp(2rem, 4vw, 3rem);
      }
      .label-num {
        font-family: 'area-normal', sans-serif;
        font-size: 11px;
        font-weight: 400;
        color: rgba(10,10,10,0.3);
      }
      .label-text {
        font-family: 'area-normal', sans-serif;
        font-size: 11px;
        font-weight: 500;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        color: rgba(10,10,10,0.5);
      }

      /* ── Horizontal scroll ── */
      .h-scroll-wrapper {
        overflow: visible;
        width: 100%;
      }

      .h-scroll-track {
        display: flex;
        gap: clamp(1.5rem, 3vw, 2.5rem);
        padding: 0 clamp(1.5rem, 4vw, 4rem);
        will-change: transform;
      }

      /* ── Cards ── */
      .h-card {
        flex: 0 0 auto;
        width: clamp(300px, 40vw, 520px);
      }

      .h-card-link {
        display: block;
        text-decoration: none;
        color: inherit;
      }

      .h-card-image-wrap {
        position: relative;
        width: 100%;
        aspect-ratio: 3 / 4;
        overflow: hidden;
        background: #f0f0f0;
        border-radius: 4px;
      }

      .h-card-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
        will-change: transform;
        transform: scale(1);
        transition: transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      }

      .h-card-index {
        position: absolute;
        top: 1rem;
        left: 1rem;
        font-family: 'area-normal', sans-serif;
        font-size: 11px;
        font-weight: 500;
        letter-spacing: 0.06em;
        color: rgba(10,10,10,0.5);
        background: rgba(255,255,255,0.85);
        padding: 4px 10px;
        border-radius: 2px;
      }

      .h-card-info {
        padding-top: 0.75rem;
      }

      .h-card-title {
        margin: 0;
        font-family: 'area-normal', sans-serif;
        font-size: clamp(1.1rem, 2vw, 1.5rem);
        font-weight: 600;
        letter-spacing: -0.02em;
        color: #0a0a0a;
      }

      .h-card-year {
        display: block;
        font-family: 'area-normal', sans-serif;
        font-size: 12px;
        color: rgba(10,10,10,0.35);
        margin-top: 0.2rem;
      }

      .h-card-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 0.35rem;
        margin-top: 0.5rem;
      }

      .h-card-tag {
        font-family: 'area-normal', sans-serif;
        font-size: 9px;
        letter-spacing: 0.14em;
        text-transform: uppercase;
        color: rgba(10,10,10,0.5);
        font-weight: 500;
        padding: 3px 8px;
        border: 1px solid rgba(10,10,10,0.12);
        border-radius: 2px;
      }

      /* ── End card ── */
      .h-card-end {
        display: flex;
        align-items: center;
        justify-content: center;
        min-width: clamp(200px, 25vw, 320px);
      }

      .h-card-end-inner {
        text-align: center;
      }

      .h-card-end-num {
        display: block;
        font-family: 'area-normal', sans-serif;
        font-size: clamp(3rem, 8vw, 6rem);
        font-weight: 800;
        letter-spacing: -0.04em;
        color: #0a0a0a;
        line-height: 1;
      }

      .h-card-end-label {
        font-family: 'area-normal', sans-serif;
        font-size: 11px;
        font-weight: 500;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: rgba(10,10,10,0.4);
        margin-top: 0.5rem;
        display: block;
      }

      @media (max-width: 600px) {
        .h-card {
          width: 80vw;
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
      setTimeout(() => this.setupHorizontalScroll(), 200);
    });
  }

  private setupHorizontalScroll(): void {
    const wrapper = this.el.nativeElement.querySelector('[data-h-scroll-wrapper]') as HTMLElement;
    const track = this.el.nativeElement.querySelector('[data-h-scroll-track]') as HTMLElement;
    const section = this.el.nativeElement.querySelector('[data-featured-work]') as HTMLElement;

    if (!wrapper || !track || !section) return;

    // Calculate how far the track needs to scroll
    const calculateScroll = () => {
      const trackWidth = track.scrollWidth;
      const viewWidth = wrapper.offsetWidth;
      return -(trackWidth - viewWidth);
    };

    let xEnd = calculateScroll();

    // Pin the section and scroll horizontally
    const tween = gsap.to(track, {
      x: () => calculateScroll(),
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top 15%',
        end: () => `+=${Math.abs(xEnd) * 1.2}`,
        scrub: 0.8,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onRefresh: () => {
          xEnd = calculateScroll();
        },
      },
    });

    if (tween.scrollTrigger) this.triggers.push(tween.scrollTrigger);

    // Parallax on individual card images
    const images = this.el.nativeElement.querySelectorAll('[data-card-image]');
    images.forEach((img: Element) => {
      const parent = img.closest('.h-card') as HTMLElement;
      if (!parent) return;
      gsap.to(img, {
        xPercent: -8,
        ease: 'none',
        scrollTrigger: {
          trigger: parent,
          containerAnimation: tween,
          start: 'left right',
          end: 'right left',
          scrub: 0.3,
        },
      });
    });

    ScrollTrigger.refresh();
  }

  onCardEnter(event: MouseEvent): void {
    const card = event.currentTarget as HTMLElement;
    const img = card.querySelector('[data-card-image]');
    if (img) {
      gsap.to(img, { scale: 1.06, duration: 0.6, ease: 'power2.out' });
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
