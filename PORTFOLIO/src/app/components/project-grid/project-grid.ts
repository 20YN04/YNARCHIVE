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
    <section class="project-section" id="work">
      <!-- Section header -->
      <div class="project-header">
        <span class="section-num">02</span>
        <span class="section-label">Selected Works</span>
      </div>

      <!-- Sticky + scroll layout like Telha Clarke -->
      <div class="project-grid">
        <!-- Left: sticky text column -->
        <div class="project-info-col">
          <div class="project-info-sticky">
            <p class="project-years">17 — 26'</p>
          </div>
        </div>

        <!-- Right: scrolling project cards -->
        <div class="project-cards-col">
          @for (project of projects(); track project.title) {
            <article class="project-card" data-project-card>
              <figure class="project-figure">
                <img
                  class="project-image"
                  [src]="project.imageUrl"
                  [alt]="project.title"
                  data-project-image
                  loading="lazy"
                />
                <figcaption class="project-caption">
                  <span class="project-name">{{ project.title }}</span>
                  <span class="project-meta">{{ project.category }} {{ project.year }}</span>
                </figcaption>
              </figure>
            </article>
          }
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .project-section {
        padding: 5rem 0 3rem;
      }

      .project-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-bottom: 2.5rem;
        border-bottom: 1px solid rgba(10, 10, 10, 0.1);
        margin-bottom: 3rem;
      }

      .section-num {
        font-family: 'area-normal', sans-serif;
        font-size: 11px;
        letter-spacing: 0.32em;
        text-transform: uppercase;
        color: rgba(10, 10, 10, 0.4);
      }

      .section-label {
        font-family: 'area-normal', sans-serif;
        font-size: 11px;
        letter-spacing: 0.32em;
        text-transform: uppercase;
        color: rgba(10, 10, 10, 0.4);
      }

      /* Sticky + scroll grid */
      .project-grid {
        display: grid;
        grid-template-columns: 1fr 2fr;
        gap: 3rem;
      }

      .project-info-col {
        position: relative;
      }

      .project-info-sticky {
        position: sticky;
        top: 100px;
      }

      .project-years {
        font-family: 'area-normal', sans-serif;
        font-size: 14px;
        letter-spacing: 0.08em;
        color: rgba(10, 10, 10, 0.4);
        margin: 0;
      }

      .project-cards-col {
        display: flex;
        flex-direction: column;
        gap: 3rem;
      }

      .project-card {
        position: relative;
        will-change: transform, opacity;
      }

      .project-figure {
        position: relative;
        overflow: hidden;
        margin: 0;
        background: #f0f0f0;
      }

      .project-image {
        width: 100%;
        height: auto;
        display: block;
        object-fit: cover;
        transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        will-change: transform;
      }

      .project-card:hover .project-image {
        transform: scale(1.03);
      }

      .project-caption {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 1rem 0;
      }

      .project-name {
        font-family: 'area-normal', sans-serif;
        font-size: 14px;
        font-weight: 500;
        letter-spacing: 0.02em;
        color: #0a0a0a;
      }

      .project-meta {
        font-family: 'area-normal', sans-serif;
        font-size: 11px;
        letter-spacing: 0.15em;
        text-transform: uppercase;
        color: rgba(10, 10, 10, 0.4);
      }

      @media (max-width: 768px) {
        .project-grid {
          grid-template-columns: 1fr;
          gap: 2rem;
        }

        .project-info-sticky {
          position: relative;
          top: 0;
        }
      }
    `
  ]
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
