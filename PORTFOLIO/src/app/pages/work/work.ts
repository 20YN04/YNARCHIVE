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

interface DisplayCell {
  item: WorkItem;
  isHero: boolean;
  aspect: 'wide' | 'tall';
  /** Vertical offset in px so some cards sit lower (uneven layout). */
  offsetY: number;
}

interface DisplayRow {
  key: string;
  cells: DisplayCell[];
}

@Component({
  selector: 'app-work',
  imports: [NavBarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="work-page min-h-screen w-full bg-white text-[#0a0a0a]" #container>
      <app-navbar [fixed]="false" [alwaysVisible]="true" [solidBackground]="true" activePage="work"></app-navbar>

      <div class="work-inner mx-auto w-full max-w-[1400px] pt-20 pb-24">
        <!-- Header: All Work + filters rondom de titel, smooth open/dicht -->
        <header class="work-header">
          <div class="work-header-left">
            <h1 class="work-title">All Work <span class="work-count">({{ filteredItems().length }})</span></h1>
            <div class="work-filter-panel" [class.is-open]="showFilters()" [attr.aria-hidden]="!showFilters()">
              <div class="work-filter-list">
                @for (opt of filterOptionsWithCount(); track opt.value) {
                  <button
                    type="button"
                    class="work-filter-opt"
                    [class.work-filter-opt-active]="activeFilter() === opt.value"
                    (click)="setFilter(opt.value)"
                  >/ {{ opt.label }} ({{ opt.count }})</button>
                }
              </div>
              <button type="button" class="work-filter-close" (click)="toggleFilters()">Close</button>
            </div>
          </div>
          <button type="button" class="work-filters-btn" (click)="toggleFilters()" [attr.aria-expanded]="showFilters()">
            Filters {{ showFilters() ? '−' : '+' }}
          </button>
        </header>

        <!-- Grid: 1 hero (full width) + rest in 2 cols with random tall/wide -->
        <div class="work-grid" id="work-list">
          @for (row of displayRows(); track row.key; let rowIndex = $index) {
            @for (cell of row.cells; track cell.item.id) {
              <article
                class="work-card"
                [class.work-card-hero]="cell.isHero"
                [class.work-card-tall]="cell.aspect === 'tall'"
                [style.margin-top.px]="cell.isHero ? 0 : cell.offsetY"
                data-reveal-card
              >
                <a [href]="cell.item.url" target="_blank" rel="noopener noreferrer" class="work-card-link" [attr.aria-label]="'View ' + cell.item.title">
                  <div class="work-card-frame">
                    <img
                      class="work-card-image"
                      [src]="cell.item.imageUrl"
                      [alt]="cell.item.title"
                      loading="lazy"
                      data-parallax-image
                    />
                  </div>
                  <div class="work-card-meta">
                    <span class="work-card-title">{{ cell.item.title }}</span>
                    <span class="work-card-open">Open project →</span>
                  </div>
                  <span class="work-card-cat-year">{{ cell.item.category }} · {{ cell.item.year }}</span>
                </a>
              </article>
            }
          }
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      :host { display: block; }
      .work-page { font-family: 'area-normal', sans-serif; }
      .work-inner {
        padding-left: clamp(2rem, 6vw, 5rem);
        padding-right: clamp(2rem, 6vw, 5rem);
      }
      .work-header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        margin-bottom: 3rem;
        gap: 1rem;
      }
      .work-header-left {
        display: flex;
        flex-wrap: wrap;
        align-items: baseline;
        gap: 0.5rem 1.25rem;
        min-width: 0;
      }
      .work-title {
        font-family: 'area-normal', sans-serif;
        font-size: clamp(2rem, 5vw, 3.5rem);
        font-weight: 700;
        letter-spacing: -0.02em;
        line-height: 1.1;
        margin: 0;
        color: #0a0a0a;
      }
      .work-count {
        font-size: 0.6em;
        font-weight: 400;
        color: rgba(10, 10, 10, 0.45);
        vertical-align: 0.35em;
      }
      .work-filter-panel {
        display: flex;
        flex-wrap: wrap;
        align-items: baseline;
        gap: 0.5rem 1.25rem;
        max-height: 0;
        opacity: 0;
        overflow: hidden;
        pointer-events: none;
        transition: max-height 0.4s ease, opacity 0.35s ease;
      }
      .work-filter-panel.is-open {
        max-height: 180px;
        opacity: 1;
        pointer-events: auto;
      }
      .work-filter-list {
        display: flex;
        flex-wrap: wrap;
        align-items: baseline;
        gap: 0.5rem 1.25rem;
      }
      .work-filters-btn {
        font-family: 'area-normal', sans-serif;
        font-size: clamp(1.15rem, 2.8vw, 1.75rem);
        font-weight: 700;
        letter-spacing: -0.02em;
        color: rgba(10, 10, 10, 0.5);
        background: none;
        border: none;
        cursor: pointer;
        padding: 0.25rem 0;
        transition: color 0.2s;
        flex-shrink: 0;
      }
      .work-filters-btn:hover { color: #0a0a0a; }
      .work-filter-opt {
        font-family: 'area-normal', sans-serif;
        font-size: 14px;
        color: rgba(10, 10, 10, 0.38);
        background: none;
        border: none;
        cursor: pointer;
        padding: 0.25rem 0;
        transition: color 0.2s;
      }
      .work-filter-opt:hover { color: rgba(10, 10, 10, 0.6); }
      .work-filter-opt-active { color: #0a0a0a; font-weight: 600; }
      .work-filter-close {
        font-family: 'area-normal', sans-serif;
        font-size: 13px;
        color: rgba(10, 10, 10, 0.4);
        background: none;
        border: none;
        cursor: pointer;
        padding: 0.25rem 0;
        transition: color 0.2s;
      }
      .work-filter-close:hover { color: #0a0a0a; }
      .work-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        row-gap: clamp(4rem, 8vw, 6rem);
        column-gap: clamp(2.5rem, 5vw, 4rem);
      }
      .work-card-hero {
        grid-column: 1 / -1;
      }
      .work-card-hero .work-card-frame {
        aspect-ratio: 21 / 9;
      }
      .work-card { will-change: transform, opacity; }
      .work-card-link {
        display: block;
        text-decoration: none;
        color: inherit;
      }
      .work-card-frame {
        position: relative;
        overflow: hidden;
        background: #f5f5f5;
        margin-bottom: 1rem;
      }
      .work-card:not(.work-card-hero) .work-card-frame {
        aspect-ratio: 4 / 3;
      }
      .work-card-tall:not(.work-card-hero) .work-card-frame {
        aspect-ratio: 3 / 4;
      }
      .work-card-image {
        width: 100%;
        height: 100%;
        display: block;
        object-fit: cover;
        transition: transform 0.5s ease;
      }
      .work-card-link:hover .work-card-image { transform: scale(1.02); }
      .work-card-meta {
        display: flex;
        flex-wrap: wrap;
        align-items: baseline;
        justify-content: space-between;
        gap: 0.5rem;
      }
      .work-card-title {
        font-family: 'area-normal', sans-serif;
        font-size: clamp(1rem, 1.5vw, 1.25rem);
        font-weight: 600;
        letter-spacing: -0.01em;
        color: #0a0a0a;
      }
      .work-card-open {
        font-family: 'area-normal', sans-serif;
        font-size: 12px;
        color: rgba(10, 10, 10, 0.5);
        transition: color 0.2s;
      }
      .work-card-link:hover .work-card-open { color: #0a0a0a; }
      .work-card-cat-year {
        font-family: 'area-normal', sans-serif;
        font-size: 12px;
        color: rgba(10, 10, 10, 0.5);
        display: block;
        margin-top: 0.15rem;
      }
      @media (max-width: 600px) {
        .work-grid {
          grid-template-columns: 1fr;
          row-gap: 3.5rem;
        }
        .work-card-hero .work-card-frame {
          aspect-ratio: 16 / 10;
        }
        .work-card:not(.work-card-hero) .work-card-frame,
        .work-card-tall:not(.work-card-hero) .work-card-frame {
          aspect-ratio: 4 / 3;
        }
        .work-header { flex-direction: column; align-items: flex-start; margin-bottom: 2rem; }
      }
    `
  ]
})
export class WorkComponent implements AfterViewInit, OnDestroy {
  @ViewChild('container', { static: true }) container!: ElementRef<HTMLElement>;

  readonly filterOptions: Array<'All' | Category> = ['All', 'E-commerce', 'SaaS', 'Landing Pages'];
  readonly activeFilter = signal<'All' | Category>('All');
  readonly showFilters = signal(false);

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

  readonly filterOptionsWithCount = computed(() => {
    const items = this.workItems();
    const total = items.length;
    return this.filterOptions.map((value) => ({
      value,
      label: value === 'All' ? 'All Work' : value,
      count: value === 'All' ? total : items.filter((i) => i.category === value).length
    }));
  });

  /** Stable “random” 0..max from string. */
  private static hashId(id: string, max: number): number {
    let h = 0;
    for (let i = 0; i < id.length; i++) h = (h << 5) - h + id.charCodeAt(i) | 0;
    return Math.abs(h) % (max + 1);
  }

  /** Vertical offsets (px) for uneven layout – same id always gets same offset. */
  private static readonly OFFSETS = [0, 36, 72, 24, 56];

  /** Layout: 1 hero (full width) + rest in rows of 2, random tall/wide + random offset down. */
  readonly displayRows = computed<DisplayRow[]>(() => {
    const items = this.filteredItems();
    if (items.length === 0) return [];
    const rows: DisplayRow[] = [];
    const [hero, ...rest] = items;
    rows.push({
      key: 'hero',
      cells: [{ item: hero, isHero: true, aspect: 'wide', offsetY: 0 }]
    });
    for (let i = 0; i < rest.length; i += 2) {
      const slice = rest.slice(i, i + 2);
      const cells: DisplayCell[] = slice.map((item) => ({
        item,
        isHero: false,
        aspect: WorkComponent.hashId(item.id, 1) === 0 ? 'wide' : 'tall',
        offsetY: WorkComponent.OFFSETS[WorkComponent.hashId(item.id, WorkComponent.OFFSETS.length - 1)]
      }));
      rows.push({ key: `row-${i}`, cells });
    }
    return rows;
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

  toggleFilters(): void {
    this.showFilters.update((v) => !v);
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
