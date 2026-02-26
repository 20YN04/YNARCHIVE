import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  signal,
  computed
} from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { NavBarComponent } from '../../components/navbar/navbar';

gsap.registerPlugin(ScrollTrigger);

type Category = 'E-commerce' | 'SaaS' | 'Landing Pages';

interface WorkItem {
  id: string;
  title: string;
  year: number;
  category: Category;
  url: string;
  imageUrl: string;
  tags: string[];
}

interface GalleryRow {
  type: 'full' | 'split';
  items: WorkItem[];
}

@Component({
  selector: 'app-work',
  imports: [NavBarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="work-page min-h-screen bg-white text-[#0a0a0a] w-full" #container>
      <app-navbar [fixed]="false" [alwaysVisible]="true" [solidBackground]="true" activePage="work"></app-navbar>

      <!-- Telha Clarke style: 02 Selected Works, 17 - 25' -->
      <div class="work-inner mx-auto w-full max-w-[1400px] pt-16 pb-20">
        <div class="work-header">
          <span class="work-section-num">02</span>
          <span class="work-section-label">Selected Works</span>
        </div>

        <div class="work-grid">
          <div class="work-info-col">
            <div class="work-info-sticky">
              <p class="work-years">17 — 25'</p>
            </div>
          </div>
          <div class="work-cards-col">
            @for (item of filteredItems(); track item.id) {
              <article class="work-card" data-reveal-card>
                <a [href]="item.url" target="_blank" rel="noopener noreferrer"
                   class="work-card-link"
                   [attr.aria-label]="'View ' + item.title">
                  <img
                    class="work-card-image"
                    [src]="item.imageUrl"
                    [alt]="item.title"
                    loading="lazy"
                    data-parallax-image
                  />
                  <span class="work-card-arrow" aria-hidden="true">↗</span>
                </a>
                <div class="work-card-caption">
                  <span class="work-card-title">[ {{ item.title }} ]</span>
                  <span class="work-card-meta">{{ item.category }} {{ item.year }}</span>
                </div>
              </article>
            }
          </div>
        </div>

        <div class="work-all-wrap">
          <a href="/" data-nav-link data-page="home" class="work-all-link">All Work ({{ workItems().length }})</a>
        </div>
      </div>

      <!-- Talk to us footer (Telha style) -->
      <footer class="work-footer">
        <div class="work-footer-inner mx-auto w-full max-w-[1400px] py-14 md:py-20">
          <h2 class="work-footer-title">Talk to us about your project</h2>
          <a href="/contact" data-nav-link data-page="contact" class="work-footer-cta">Contact us</a>
        </div>
      </footer>
    </div>
  `,
  styles: [
    `
      :host { display: block; }
      .work-page { font-family: 'area-normal', sans-serif; }
      .work-inner, .work-footer-inner {
        padding-left: clamp(2rem, 6vw, 5rem);
        padding-right: clamp(2rem, 6vw, 5rem);
      }
      .work-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-bottom: 2.5rem;
        border-bottom: 1px solid rgba(10, 10, 10, 0.1);
        margin-bottom: 3rem;
      }
      .work-section-num, .work-section-label {
        font-family: 'area-normal', sans-serif;
        font-size: 11px;
        letter-spacing: 0.32em;
        text-transform: uppercase;
        color: rgba(10, 10, 10, 0.4);
      }
      .work-grid {
        display: grid;
        grid-template-columns: 1fr 2fr;
        gap: 3rem;
      }
      .work-info-col { position: relative; }
      .work-info-sticky { position: sticky; top: 100px; }
      .work-years {
        font-family: 'area-normal', sans-serif;
        font-size: 14px;
        letter-spacing: 0.08em;
        color: rgba(10, 10, 10, 0.4);
        margin: 0;
      }
      .work-cards-col {
        display: flex;
        flex-direction: column;
        gap: 3rem;
      }
      .work-card { will-change: transform, opacity; }
      .work-card-link {
        position: relative;
        display: block;
        overflow: hidden;
        background: #f0f0f0;
      }
      .work-card-image {
        width: 100%;
        height: auto;
        display: block;
        object-fit: cover;
        transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      }
      .work-card-link:hover .work-card-image { transform: scale(1.03); }
      .work-card-arrow {
        position: absolute;
        right: 1rem;
        bottom: 1rem;
        width: 2.5rem;
        height: 2.5rem;
        border-radius: 50%;
        background: rgba(0,0,0,0.8);
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1rem;
        opacity: 0;
        transform: scale(0.75);
        transition: opacity 0.3s, transform 0.3s;
      }
      .work-card-link:hover .work-card-arrow {
        opacity: 1;
        transform: scale(1);
      }
      .work-card-caption {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 1rem 0;
      }
      .work-card-title {
        font-family: 'area-normal', sans-serif;
        font-size: 14px;
        font-weight: 500;
        letter-spacing: 0.02em;
        color: #0a0a0a;
      }
      .work-card-meta {
        font-family: 'area-normal', sans-serif;
        font-size: 11px;
        letter-spacing: 0.15em;
        text-transform: uppercase;
        color: rgba(10, 10, 10, 0.4);
      }
      .work-all-wrap { margin-top: 2rem; padding-top: 2rem; border-top: 1px solid rgba(10,10,10,0.08); }
      .work-all-link {
        font-family: 'area-normal', sans-serif;
        font-size: 13px;
        letter-spacing: 0.05em;
        color: #0a0a0a;
        text-decoration: none;
        transition: opacity 0.3s;
      }
      .work-all-link:hover { opacity: 0.6; }
      .work-footer { border-top: 1px solid rgba(10,10,10,0.08); background: #fafafa; }
      .work-footer-inner { }
      .work-footer-title {
        font-family: 'area-normal', sans-serif;
        font-size: clamp(1.5rem, 4vw, 2.5rem);
        font-weight: 700;
        letter-spacing: -0.02em;
        line-height: 1.2;
        margin: 0 0 1rem;
        color: #0a0a0a;
      }
      .work-footer-cta {
        font-family: 'area-normal', sans-serif;
        font-size: 14px;
        text-decoration: underline;
        text-underline-offset: 4px;
        color: #0a0a0a;
        transition: opacity 0.3s;
      }
      .work-footer-cta:hover { opacity: 0.6; }
      @media (max-width: 768px) {
        .work-grid { grid-template-columns: 1fr; gap: 2rem; }
        .work-info-sticky { position: relative; top: 0; }
      }
    `
  ]
})
export class WorkComponent implements AfterViewInit, OnDestroy {
  @ViewChild('container', { static: true }) container!: ElementRef<HTMLElement>;

  readonly filterOptions: Array<'All' | Category> = ['All', 'E-commerce', 'SaaS', 'Landing Pages'];
  readonly activeFilter = signal<'All' | Category>('All');

  readonly workItems = signal<WorkItem[]>([
    {
      id: 'atlas-commerce',
      title: 'Atlas Commerce',
      year: 2026,
      category: 'E-commerce',
      url: 'https://example.com',
      imageUrl: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1800&q=80',
      tags: ['Web', 'UI', 'Shop']
    },
    {
      id: 'nova-saas',
      title: 'Nova Platform',
      year: 2025,
      category: 'SaaS',
      url: 'https://example.com',
      imageUrl: 'https://images.unsplash.com/photo-1518773553398-650c184e0bb3?auto=format&fit=crop&w=1800&q=80',
      tags: ['Dashboard', 'SaaS', 'Product']
    },
    {
      id: 'spline-landing',
      title: 'Spline Campaign',
      year: 2025,
      category: 'Landing Pages',
      url: 'https://example.com',
      imageUrl: 'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=1800&q=80',
      tags: ['Launch', 'Motion', 'Brand']
    },
    {
      id: 'district-store',
      title: 'District Storefront',
      year: 2024,
      category: 'E-commerce',
      url: 'https://example.com',
      imageUrl: 'https://images.unsplash.com/photo-1522199755839-a2bacb67c546?auto=format&fit=crop&w=1800&q=80',
      tags: ['Checkout', 'CMS', 'Shop']
    },
    {
      id: 'pulse-suite',
      title: 'Pulse Suite',
      year: 2024,
      category: 'SaaS',
      url: 'https://example.com',
      imageUrl: 'https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?auto=format&fit=crop&w=1800&q=80',
      tags: ['B2B', 'Data', 'UX']
    },
    {
      id: 'mono-launch',
      title: 'Mono Launch System',
      year: 2023,
      category: 'Landing Pages',
      url: 'https://example.com',
      imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1800&q=80',
      tags: ['Landing', 'Design', 'Performance']
    }
  ]);

  readonly filteredItems = computed(() => {
    const filter = this.activeFilter();
    if (filter === 'All') return this.workItems();
    return this.workItems().filter((item) => item.category === filter);
  });

  readonly galleryRows = computed<GalleryRow[]>(() => {
    const items = this.filteredItems();
    const rows: GalleryRow[] = [];
    let index = 0;
    let useFull = true;

    while (index < items.length) {
      if (useFull || index === items.length - 1) {
        rows.push({ type: 'full', items: [items[index]] });
        index += 1;
      } else {
        rows.push({ type: 'split', items: items.slice(index, index + 2) });
        index += 2;
      }
      useFull = !useFull;
    }

    return rows;
  });

  setFilter(option: 'All' | Category): void {
    this.activeFilter.set(option);
    queueMicrotask(() => this.setupScrollAnimations());
  }

  ngAfterViewInit(): void {
    this.setupScrollAnimations();
  }

  ngOnDestroy(): void {
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
  }

  private setupScrollAnimations(): void {
    const host = this.container?.nativeElement;
    if (!host) return;

    ScrollTrigger.getAll()
      .filter((trigger) => (trigger.vars.id as string | undefined)?.startsWith('work-'))
      .forEach((trigger) => trigger.kill());

    const cards = host.querySelectorAll<HTMLElement>('[data-reveal-card]');
    cards.forEach((card, index) => {
      gsap.fromTo(
        card,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            id: `work-reveal-${index}`,
            trigger: card,
            start: 'top 88%'
          }
        }
      );
    });

    const images = host.querySelectorAll<HTMLElement>('[data-parallax-image]');
    images.forEach((image, index) => {
      gsap.fromTo(
        image,
        { yPercent: -5 },
        {
          yPercent: 5,
          ease: 'none',
          scrollTrigger: {
            id: `work-parallax-${index}`,
            trigger: image,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.6
          }
        }
      );
    });
  }
}
