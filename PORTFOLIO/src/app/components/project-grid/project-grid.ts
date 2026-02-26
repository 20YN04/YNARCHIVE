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
      <!-- Palmer-style: section tag + headline + intro -->
      <div class="project-hero">
        <p class="project-section-tag">© Featured Projects (03) Creative Development</p>
        <h2 class="project-headline"># Featured Works</h2>
        <p class="project-intro">
          Every project blends design and development — bold ideas into
          <strong>sleek digital realities</strong>, built with intent and clarity.
        </p>
      </div>

      <div class="project-list">
        @for (project of projects(); track project.title; let i = $index) {
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
                <span class="project-num">({{ i < 9 ? '0' + (i + 1) : (i + 1) }})</span>
                <span class="project-name">{{ project.title }}</span>
                <span class="project-meta">{{ project.category }} · {{ project.year }}</span>
              </figcaption>
            </figure>
          </article>
        }
      </div>
    </section>
  `,
  styles: [
    `
      :host { display: block; }
      .project-section { padding: 5rem 0 3rem; }
      .project-hero { margin-bottom: 3rem; }
      .project-section-tag {
        font-family: 'area-normal', sans-serif;
        font-size: 11px;
        letter-spacing: 0.2em;
        text-transform: uppercase;
        color: rgba(10, 10, 10, 0.45);
        margin: 0 0 0.75rem;
      }
      .project-headline {
        font-family: 'area-normal', sans-serif;
        font-size: clamp(2rem, 6vw, 4rem);
        font-weight: 700;
        letter-spacing: -0.03em;
        line-height: 0.95;
        margin: 0 0 1rem;
        color: #0a0a0a;
      }
      .project-intro {
        font-family: 'area-normal', sans-serif;
        font-size: clamp(0.95rem, 1.3vw, 1.05rem);
        line-height: 1.6;
        color: rgba(10, 10, 10, 0.75);
        margin: 0;
        max-width: 38ch;
      }
      .project-intro strong { color: #0a0a0a; font-weight: 600; }
      .project-list {
        display: flex;
        flex-direction: column;
        gap: 3.5rem;
      }
      .project-card { will-change: transform, opacity; }
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
        aspect-ratio: 16 / 10;
        transition: transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        will-change: transform;
      }
      .project-card:hover .project-image { transform: scale(1.02); }
      .project-caption {
        display: flex;
        flex-wrap: wrap;
        align-items: baseline;
        gap: 0.5rem 1rem;
        padding: 0.75rem 0 0;
      }
      .project-num {
        font-family: 'area-normal', sans-serif;
        font-size: 11px;
        letter-spacing: 0.1em;
        color: rgba(10, 10, 10, 0.45);
      }
      .project-name {
        font-family: 'area-normal', sans-serif;
        font-size: clamp(1.1rem, 2vw, 1.4rem);
        font-weight: 600;
        letter-spacing: -0.02em;
        color: #0a0a0a;
      }
      .project-meta {
        font-family: 'area-normal', sans-serif;
        font-size: 11px;
        letter-spacing: 0.15em;
        text-transform: uppercase;
        color: rgba(10, 10, 10, 0.45);
      }
      @media (max-width: 768px) {
        .project-hero { margin-bottom: 2.5rem; }
        .project-list { gap: 2.5rem; }
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
