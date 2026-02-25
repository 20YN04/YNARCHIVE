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
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

type Category = 'E-commerce' | 'SaaS' | 'Landing Pages';
type GalleryRowType = 'full' | 'split';

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
  type: GalleryRowType;
  items: WorkItem[];
}

@Component({
  selector: 'app-work',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="work-page min-h-screen bg-white text-[#0a0a0a]" #container>
      <header class="work-header border-b border-black/10">
        <div class="mx-auto max-w-350 px-[clamp(1.25rem,4vw,3.5rem)] h-16 flex items-center justify-between gap-6">
          <a href="/" data-nav-link data-page="home" class="brand-link">YNARCHIVE</a>
          <nav class="flex items-center gap-4 md:gap-6">
            <a href="/work" data-nav-link data-page="work" class="nav-link nav-link-active">Work</a>
            <a href="#about" class="nav-link">About</a>
            <a href="/contact" data-nav-link data-page="contact" class="nav-link">Contact</a>
          </nav>
        </div>
      </header>

      <main>
        <section class="mx-auto max-w-350 px-[clamp(1.25rem,4vw,3.5rem)] pt-8 md:pt-12 lg:pt-14">
          <h1 class="projects-title">PROJECTS</h1>

          <div class="mt-6 md:mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 border-y border-black/10 py-3">
            @for (option of filterOptions; track option) {
              <button
                type="button"
                class="filter-link"
                [class.filter-link-active]="activeFilter() === option"
                (click)="setFilter(option)"
              >
                {{ option }}
              </button>
            }
          </div>
        </section>

        <section class="mx-auto max-w-350 px-[clamp(1.25rem,4vw,3.5rem)] pt-8 md:pt-10 lg:pt-12 pb-18">
          <div class="flex flex-col gap-6 md:gap-8 lg:gap-10">
            @for (row of galleryRows(); track $index) {
              @if (row.type === 'full') {
                <article class="project-card reveal-card" data-reveal-card>
                  <a [href]="row.items[0].url" target="_blank" rel="noopener noreferrer" class="project-media" [attr.aria-label]="'View ' + row.items[0].title">
                    <img
                      class="project-image"
                      [src]="row.items[0].imageUrl"
                      [alt]="row.items[0].title"
                      loading="lazy"
                      data-parallax-image
                    />
                    <span class="project-hover-cta" aria-hidden="true">↗</span>
                  </a>
                  <div class="project-meta-row">
                    <h2 class="project-title">{{ row.items[0].title }}</h2>
                    <div class="meta-right">
                      <span class="meta-year">{{ row.items[0].year }}</span>
                      <div class="meta-tags">
                        @for (tag of row.items[0].tags; track tag) {
                          <span class="meta-tag">{{ tag }}</span>
                        }
                      </div>
                    </div>
                  </div>
                </article>
              } @else {
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                  @for (item of row.items; track item.id) {
                    <article class="project-card reveal-card" data-reveal-card>
                      <a [href]="item.url" target="_blank" rel="noopener noreferrer" class="project-media" [attr.aria-label]="'View ' + item.title">
                        <img
                          class="project-image"
                          [src]="item.imageUrl"
                          [alt]="item.title"
                          loading="lazy"
                          data-parallax-image
                        />
                        <span class="project-hover-cta" aria-hidden="true">↗</span>
                      </a>
                      <div class="project-meta-row">
                        <h2 class="project-title">{{ item.title }}</h2>
                        <div class="meta-right">
                          <span class="meta-year">{{ item.year }}</span>
                          <div class="meta-tags">
                            @for (tag of item.tags; track tag) {
                              <span class="meta-tag">{{ tag }}</span>
                            }
                          </div>
                        </div>
                      </div>
                    </article>
                  }
                </div>
              }
            }
          </div>
        </section>

        <section id="about" class="mx-auto max-w-350 px-[clamp(1.25rem,4vw,3.5rem)] pb-20">
          <div class="border-t border-black/10 pt-9 md:pt-12">
            <p class="text-[11px] uppercase tracking-[0.28em] text-black/45">About The Work</p>
            <p class="mt-4 max-w-[68ch] text-base md:text-lg text-black/75 leading-relaxed">
              This page is fully data-driven. Update the <span class="font-medium">workItems</span> list to add or remove projects,
              categories, years, tags, and URLs without changing the gallery layout logic.
            </p>
          </div>
        </section>
      </main>

      <footer class="border-t border-black/10 bg-neutral-100/70">
        <div class="mx-auto max-w-350 px-[clamp(1.25rem,4vw,3.5rem)] py-12 md:py-16 lg:py-20">
          <h2 class="talk-title">LET'S TALK</h2>

          <div class="mt-8 md:mt-10 grid grid-cols-1 md:grid-cols-[1.2fr_1fr_auto] gap-8 md:gap-10 items-start">
            <div>
              <p class="footer-label">Business</p>
              <a href="mailto:yentl.nerinckx@icloud.com" class="footer-link-inline">yentl.nerinckx&#64;icloud.com</a>
            </div>

            <div>
              <p class="footer-label">Location</p>
              <p class="footer-value">Tessenderlo, Belgium</p>
              <a href="/contact" data-nav-link data-page="contact" class="footer-link-inline mt-2 inline-block">Contact page</a>
            </div>

            <a href="/contact" data-nav-link data-page="contact" class="stamp" aria-label="Contact us">
              <span class="stamp-ring">CONTACT US • CONTACT US • CONTACT US • </span>
              <span class="stamp-center">↗</span>
            </a>
          </div>
        </div>
      </footer>
    </section>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .work-header {
        position: sticky;
        top: 0;
        z-index: 30;
        background: rgba(255, 255, 255, 0.92);
        backdrop-filter: blur(6px);
      }

      .brand-link {
        font-family: 'area-normal', sans-serif;
        font-size: 14px;
        font-weight: 700;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        text-decoration: none;
        color: inherit;
      }

      .nav-link {
        position: relative;
        font-family: 'area-normal', sans-serif;
        font-size: 13px;
        text-decoration: none;
        color: rgba(10, 10, 10, 0.74);
        transition: color 0.25s ease;
      }

      .nav-link::after {
        content: '';
        position: absolute;
        left: 0;
        bottom: -4px;
        width: 100%;
        height: 1px;
        background: #0a0a0a;
        transform: scaleX(0);
        transform-origin: left;
        transition: transform 0.28s ease;
      }

      .nav-link:hover,
      .nav-link-active {
        color: #0a0a0a;
      }

      .nav-link:hover::after,
      .nav-link-active::after {
        transform: scaleX(1);
      }

      .projects-title {
        margin: 0;
        font-family: 'area-normal', sans-serif;
        font-size: clamp(4.25rem, 18vw, 16rem);
        font-weight: 700;
        line-height: 0.9;
        letter-spacing: -0.04em;
        text-transform: uppercase;
      }

      .filter-link {
        background: transparent;
        border: none;
        padding: 0;
        cursor: pointer;
        position: relative;
        font-family: 'area-normal', sans-serif;
        font-size: 12px;
        letter-spacing: 0.16em;
        text-transform: uppercase;
        color: rgba(10, 10, 10, 0.55);
        transition: color 0.25s ease;
      }

      .filter-link::after {
        content: '';
        position: absolute;
        left: 0;
        bottom: -4px;
        width: 100%;
        height: 1px;
        background: #0a0a0a;
        transform: scaleX(0);
        transform-origin: left;
        transition: transform 0.28s ease;
      }

      .filter-link:hover,
      .filter-link-active {
        color: #0a0a0a;
      }

      .filter-link:hover::after,
      .filter-link-active::after {
        transform: scaleX(1);
      }

      .project-media {
        position: relative;
        display: block;
        overflow: hidden;
        background: #f3f3f1;
        border: 1px solid rgba(10, 10, 10, 0.1);
      }

      .project-image {
        width: 100%;
        height: auto;
        display: block;
        object-fit: cover;
        transition: transform 0.7s cubic-bezier(0.2, 0.6, 0.2, 1);
        will-change: transform;
      }

      .project-media:hover .project-image {
        transform: scale(1.04);
      }

      .project-hover-cta {
        position: absolute;
        right: 1rem;
        bottom: 1rem;
        width: 56px;
        height: 56px;
        border-radius: 9999px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border: 1px solid rgba(255, 255, 255, 0.6);
        background: rgba(10, 10, 10, 0.82);
        color: #fff;
        font-size: 1.3rem;
        opacity: 0;
        transform: scale(0.75);
        transition: opacity 0.3s ease, transform 0.3s ease;
      }

      .project-media:hover .project-hover-cta {
        opacity: 1;
        transform: scale(1);
      }

      .project-meta-row {
        display: grid;
        grid-template-columns: minmax(0, 1fr) auto;
        gap: 1rem;
        align-items: end;
        padding-top: 0.8rem;
      }

      .project-title {
        margin: 0;
        font-family: 'area-normal', sans-serif;
        font-size: clamp(1.2rem, 2.5vw, 2rem);
        letter-spacing: -0.02em;
      }

      .meta-right {
        text-align: right;
      }

      .meta-year {
        display: block;
        font-size: 11px;
        letter-spacing: 0.2em;
        text-transform: uppercase;
        color: rgba(10, 10, 10, 0.52);
      }

      .meta-tags {
        display: flex;
        justify-content: flex-end;
        flex-wrap: wrap;
        gap: 0.3rem;
        margin-top: 0.35rem;
      }

      .meta-tag {
        font-size: 10px;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: rgba(10, 10, 10, 0.74);
      }

      .talk-title {
        margin: 0;
        font-family: 'area-normal', sans-serif;
        font-size: clamp(3rem, 12vw, 10rem);
        line-height: 0.9;
        letter-spacing: -0.04em;
        text-transform: uppercase;
      }

      .footer-label {
        margin: 0;
        font-size: 11px;
        letter-spacing: 0.22em;
        text-transform: uppercase;
        color: rgba(10, 10, 10, 0.44);
      }

      .footer-link-inline,
      .footer-value {
        margin-top: 0.45rem;
        display: inline-block;
        font-size: clamp(1.1rem, 2.2vw, 1.6rem);
        line-height: 1.2;
        color: #0a0a0a;
        text-decoration: none;
      }

      .footer-link-inline {
        position: relative;
      }

      .footer-link-inline::after {
        content: '';
        position: absolute;
        left: 0;
        bottom: -3px;
        width: 100%;
        height: 1px;
        background: #0a0a0a;
        transform: scaleX(0);
        transform-origin: left;
        transition: transform 0.28s ease;
      }

      .footer-link-inline:hover::after {
        transform: scaleX(1);
      }

      .stamp {
        position: relative;
        width: 118px;
        height: 118px;
        border: 1px solid rgba(10, 10, 10, 0.35);
        border-radius: 9999px;
        text-decoration: none;
        color: #0a0a0a;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
      }

      .stamp-ring {
        position: absolute;
        width: 100%;
        text-align: center;
        font-size: 9px;
        letter-spacing: 0.16em;
        text-transform: uppercase;
        white-space: nowrap;
        animation: stamp-rotate 9s linear infinite;
      }

      .stamp-center {
        font-size: 1.3rem;
      }

      @keyframes stamp-rotate {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }

      @media (max-width: 767px) {
        .meta-right {
          text-align: left;
        }

        .meta-tags {
          justify-content: flex-start;
        }
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
        { y: 26, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: 'power2.out',
          scrollTrigger: {
            id: `work-reveal-${index}`,
            trigger: card,
            start: 'top 86%'
          }
        }
      );
    });

    const images = host.querySelectorAll<HTMLElement>('[data-parallax-image]');
    images.forEach((image, index) => {
      gsap.fromTo(
        image,
        { yPercent: -7 },
        {
          yPercent: 7,
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
