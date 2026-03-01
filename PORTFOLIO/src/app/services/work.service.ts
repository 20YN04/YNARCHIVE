import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

export type WorkCategory = 'E-commerce' | 'SaaS' | 'Landing Pages';

export interface WorkItem {
  id: string;
  title: string;
  year: number;
  category: WorkCategory;
  url: string;
  imageUrl: string;
  tags: string[];
}

const DEFAULT_WORK_ITEMS: WorkItem[] = [
  {
    id: 'atlas-commerce',
    title: 'Atlas Commerce',
    year: 2026,
    category: 'E-commerce',
    url: 'https://example.com',
    imageUrl: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&w=1800&q=80',
    tags: ['Web', 'UI', 'Shop']
  },
  {
    id: 'nova-saas',
    title: 'Nova Platform',
    year: 2025,
    category: 'SaaS',
    url: 'https://example.com',
    imageUrl: 'https://images.unsplash.com/photo-1545235617-9465d2a55698?auto=format&fit=crop&w=1800&q=80',
    tags: ['Dashboard', 'SaaS', 'Product']
  },
  {
    id: 'spline-landing',
    title: 'Spline Campaign',
    year: 2025,
    category: 'Landing Pages',
    url: 'https://example.com',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1800&q=80',
    tags: ['Launch', 'Motion', 'Brand']
  },
  {
    id: 'district-store',
    title: 'District Storefront',
    year: 2024,
    category: 'E-commerce',
    url: 'https://example.com',
    imageUrl: 'https://images.unsplash.com/photo-1555421689-d68471e189f2?auto=format&fit=crop&w=1800&q=80',
    tags: ['Checkout', 'CMS', 'Shop']
  },
  {
    id: 'pulse-suite',
    title: 'Pulse Suite',
    year: 2024,
    category: 'SaaS',
    url: 'https://example.com',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1800&q=80',
    tags: ['B2B', 'Data', 'UX']
  },
  {
    id: 'mono-launch',
    title: 'Mono Launch System',
    year: 2023,
    category: 'Landing Pages',
    url: 'https://example.com',
    imageUrl: 'https://images.unsplash.com/photo-1634942537034-2531766767d1?auto=format&fit=crop&w=1800&q=80',
    tags: ['Landing', 'Design', 'Performance']
  }
];

/** API project shape (may differ from WorkItem). */
interface ApiProject {
  id?: string;
  title: string;
  year: number;
  category: string;
  url?: string;
  imageUrl: string;
  tags?: string[];
}

@Injectable({ providedIn: 'root' })
export class WorkService {
  private readonly http = inject(HttpClient);

  readonly workItems = signal<WorkItem[]>(DEFAULT_WORK_ITEMS);

  /** Image URLs for rotor (legacy). */
  readonly featuredImageUrls = computed(() =>
    this.workItems().map((w) => w.imageUrl).slice(0, 8)
  );

  /** Featured works for rotor: imageUrl + url so items are clickable. */
  readonly featuredWorkItems = computed(() =>
    this.workItems().slice(0, 8).map((w) => ({ imageUrl: w.imageUrl, url: w.url }))
  );

  constructor() {
    this.loadWorks();
  }

  private loadWorks(): void {
    this.http
      .get<ApiProject[]>(`${environment.apiUrl}/projects`)
      .subscribe({
        next: (list) => {
          if (!list || list.length === 0) return; // Keep defaults if API returns empty
          const items = list.map((p, i) => this.mapToWorkItem(p, i));
          this.workItems.set(items);
        },
        error: () => {
          // Keep default list on error or missing API
        }
      });
  }

  private mapToWorkItem(p: ApiProject, index: number): WorkItem {
    const category = this.normalizeCategory(p.category);
    return {
      id: p.id ?? `work-${index}-${p.title.toLowerCase().replace(/\s+/g, '-')}`,
      title: p.title,
      year: p.year,
      category,
      url: p.url ?? '#',
      imageUrl: p.imageUrl,
      tags: p.tags ?? []
    };
  }

  private normalizeCategory(cat: string): WorkCategory {
    const c = cat?.toLowerCase() ?? '';
    if (c.includes('e-commerce') || c.includes('ecommerce')) return 'E-commerce';
    if (c.includes('saas')) return 'SaaS';
    if (c.includes('landing') || c.includes('page')) return 'Landing Pages';
    return 'E-commerce';
  }
}
