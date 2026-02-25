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
    <div class="min-h-screen bg-white text-[#0a0a0a]" #container>
      <!-- Shared navbar — static, white solid bg -->
      <app-navbar [fixed]="false" [alwaysVisible]="true" [solidBackground]="true" activePage="work"></app-navbar>

      <!-- Hero title + filters -->
      <div class="mx-auto w-full max-w-[1400px] px-6 md:px-10 lg:px-14 pt-10 md:pt-14 lg:pt-16">
        <h1 class="font-bold text-[clamp(4rem,16vw,14rem)] leading-[0.9] tracking-tighter uppercase">
          PROJECTS
        </h1>

        <div class="mt-6 md:mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 border-y border-black/10 py-3.5">
          @for (option of filterOptions; track option) {
            <button
              type="button"
              class="text-xs uppercase tracking-[0.14em] bg-transparent border-none p-0 cursor-pointer transition-colors duration-200"
              [style.color]="activeFilter() === option ? '#0a0a0a' : 'rgba(10,10,10,0.4)'"
              (click)="setFilter(option)"
            >
              {{ option }}
            </button>
          }
        </div>
      </div>

      <!-- Project gallery -->
      <div class="mx-auto w-full max-w-[1400px] px-6 md:px-10 lg:px-14 pt-8 md:pt-10 pb-20">
        <div class="flex flex-col gap-8 md:gap-10 lg:gap-14">
          @for (row of galleryRows(); track $index) {
            @if (row.type === 'full') {
              <article class="group" data-reveal-card>
                <a [href]="row.items[0].url" target="_blank" rel="noopener noreferrer"
                   class="relative block overflow-hidden bg-neutral-50 border border-black/6"
                   [attr.aria-label]="'View ' + row.items[0].title">
                  <img
                    class="w-full h-auto block object-cover transition-transform duration-700 ease-[cubic-bezier(0.2,0.6,0.2,1)] group-hover:scale-[1.03]"
                    [src]="row.items[0].imageUrl"
                    [alt]="row.items[0].title"
                    loading="lazy"
                    data-parallax-image
                  />
                  <span
                    class="absolute right-4 bottom-4 size-14 rounded-full flex items-center justify-center bg-black/80 text-white text-xl opacity-0 scale-75 transition-all duration-300 group-hover:opacity-100 group-hover:scale-100 border border-white/40"
                    aria-hidden="true">↗</span>
                </a>
                <div class="flex items-end justify-between gap-4 pt-3">
                  <h2 class="text-[clamp(1.15rem,2.5vw,1.75rem)] tracking-tight leading-none">{{ row.items[0].title }}</h2>
                  <div class="text-right shrink-0">
                    <span class="block text-[11px] uppercase tracking-[0.18em] text-black/45">{{ row.items[0].year }}</span>
                    <div class="flex flex-wrap gap-1.5 mt-1 justify-end">
                      @for (tag of row.items[0].tags; track tag) {
                        <span class="text-[10px] uppercase tracking-widest text-black/60">{{ tag }}</span>
                      }
                    </div>
                  </div>
                </div>
              </article>

              <!-- Split row -->
            } @else {
              <div class="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
                @for (item of row.items; track item.id) {
                  <article class="group" data-reveal-card>
                    <a [href]="item.url" target="_blank" rel="noopener noreferrer"
                       class="relative block overflow-hidden bg-neutral-50 border border-black/6"
                       [attr.aria-label]="'View ' + item.title">
                      <img
                        class="w-full h-auto block object-cover transition-transform duration-700 ease-[cubic-bezier(0.2,0.6,0.2,1)] group-hover:scale-[1.03]"
                        [src]="item.imageUrl"
                        [alt]="item.title"
                        loading="lazy"
                        data-parallax-image
                      />
                      <span
                        class="absolute right-4 bottom-4 size-12 rounded-full flex items-center justify-center bg-black/80 text-white text-lg opacity-0 scale-75 transition-all duration-300 group-hover:opacity-100 group-hover:scale-100 border border-white/40"
                        aria-hidden="true">↗</span>
                    </a>
                    <div class="flex items-end justify-between gap-3 pt-3">
                      <h2 class="text-[clamp(1rem,2vw,1.4rem)] tracking-tight leading-none">{{ item.title }}</h2>
                      <div class="text-right shrink-0">
                        <span class="block text-[11px] uppercase tracking-[0.18em] text-black/45">{{ item.year }}</span>
                        <div class="flex flex-wrap gap-1.5 mt-1 justify-end">
                          @for (tag of item.tags; track tag) {
                            <span class="text-[10px] uppercase tracking-widest text-black/60">{{ tag }}</span>
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
      </div>

      <!-- LET'S TALK footer -->
      <footer class="border-t border-black/8 bg-neutral-50/80">
        <div class="mx-auto w-full max-w-[1400px] px-6 md:px-10 lg:px-14 py-14 md:py-20">
          <h2 class="font-bold text-[clamp(3rem,10vw,9rem)] leading-[0.9] tracking-tighter uppercase">
            LET'S TALK
          </h2>

          <div class="mt-10 md:mt-14 grid grid-cols-1 md:grid-cols-[1.2fr_1fr_auto] gap-10 items-start">
            <div>
              <p class="text-[11px] uppercase tracking-[0.2em] text-black/40 m-0">Business</p>
              <a href="mailto:yentl.nerinckx@icloud.com"
                 class="mt-2 inline-block text-lg md:text-xl lg:text-2xl leading-tight hover:opacity-60 transition-opacity duration-200">
                yentl.nerinckx&#64;icloud.com
              </a>
            </div>

            <div>
              <p class="text-[11px] uppercase tracking-[0.2em] text-black/40 m-0">Location</p>
              <p class="mt-2 text-lg md:text-xl lg:text-2xl leading-tight m-0">Tessenderlo, Belgium</p>
              <a href="/contact" data-nav-link data-page="contact"
                 class="mt-3 inline-block text-sm underline underline-offset-4 decoration-1 hover:opacity-60 transition-opacity duration-200">
                Contact page &#8594;
              </a>
            </div>

            <a href="/contact" data-nav-link data-page="contact"
               class="stamp relative size-28 border border-black/25 rounded-full no-underline text-[#0a0a0a] inline-flex items-center justify-center overflow-hidden hover:border-black/50 transition-colors duration-300"
               aria-label="Contact us">
              <svg class="absolute inset-0 w-full h-full animate-[spin_9s_linear_infinite]" viewBox="0 0 100 100">
                <defs>
                  <path id="stampPath" d="M 50,50 m -37,0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" fill="none" />
                </defs>
                <text font-size="8" letter-spacing="3" fill="currentColor">
                  <textPath href="#stampPath">CONTACT US · CONTACT US ·</textPath>
                </text>
              </svg>
              <span class="text-xl relative z-10">↗</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  `,
  styles: [`:host { display: block; }`]
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
