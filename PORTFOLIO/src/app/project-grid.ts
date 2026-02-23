import { Component, OnInit, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../environments/environment';

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
    <section class="py-16">
      <div class="columns-1 gap-8 md:columns-2">
        @for (project of projects(); track project.title) {
          <article class="group mb-8 break-inside-avoid">
            <figure class="relative overflow-hidden border border-[#1a1a1a]">
              <img
                class="h-full w-full object-cover transition duration-300 group-hover:opacity-70"
                [src]="project.imageUrl"
                [alt]="project.title"
                loading="lazy"
              />
              <figcaption
                class="pointer-events-none absolute bottom-0 left-0 right-0 flex items-end justify-between bg-black/60 px-4 py-3 font-area-normal text-xs uppercase tracking-[0.18em] text-white opacity-0 transition duration-300 group-hover:opacity-100"
              >
                <span>{{ project.title }}</span>
                <span>{{ project.year }}</span>
              </figcaption>
            </figure>
            <p class="mt-2 text-[11px] uppercase tracking-[0.2em] text-[#1a1a1a]/60">
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
