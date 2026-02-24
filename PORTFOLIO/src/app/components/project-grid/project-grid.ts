import { Component, OnInit, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';

interface Project {
  title: string;
  year: number;
  category: string;
  imageUrl: string;
}

@Component({
  selector: 'app-project-grid',
  standalone: true,
  template: `
    <section class="py-20">
      <div class="flex items-center justify-between text-[11px] uppercase tracking-[0.32em] text-[#1a1a1a]/60">
        <span>02</span>
        <span>Selected Works</span>
      </div>
      <div class="mt-10 columns-1 gap-10 md:columns-2">
        @for (project of projects(); track project.title) {
          <article class="group mb-10 break-inside-avoid">
            <figure class="relative overflow-hidden border border-[#1a1a1a] bg-[#efefef]">
              <img
                class="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02] group-hover:opacity-80"
                [src]="project.imageUrl"
                [alt]="project.title"
                loading="lazy"
              />
              <figcaption
                class="pointer-events-none absolute bottom-0 left-0 right-0 flex items-end justify-between bg-black/70 px-4 py-3 font-area-normal text-[11px] uppercase tracking-[0.28em] text-white opacity-0 transition duration-300 group-hover:opacity-100"
              >
                <span>{{ project.title }}</span>
                <span>{{ project.year }}</span>
              </figcaption>
            </figure>
            <p class="mt-3 text-[11px] uppercase tracking-[0.28em] text-[#1a1a1a]/60">
              {{ project.category }}
            </p>
          </article>
        }
      </div>
    </section>
  `
})
export class ProjectGridComponent implements OnInit {
  readonly projects = signal<Project[]>([]);
  private readonly http = inject(HttpClient);

  ngOnInit(): void {
    this.http
      .get<Project[]>(`${environment.apiUrl}/projects`)
      .subscribe((projects) => this.projects.set(projects));
  }
}
