import { Component, inject } from '@angular/core';
import { WorkService, type WorkItem } from '../../services/work.service';

/** Map category/tags to Jack Elder–style discipline labels (uppercase). */
function toDisciplineTags(item: WorkItem): string[] {
  const fromCategory = item.category.toUpperCase().replace(/-/g, ' ');
  const fromTags = (item.tags ?? []).slice(0, 3).map((t) => t.toUpperCase());
  const combined = [fromCategory, ...fromTags].filter(Boolean);
  return [...new Set(combined)];
}

@Component({
  selector: 'app-featured-work',
  standalone: true,
  template: `
    <section class="featured-work" data-featured-work data-rotor-section>
      <span class="section-label" data-scroll-label>&#123; SCROLL &#125;</span>
      <h2 class="featured-work-heading" data-scroll-heading>Featured work</h2>

      <div class="featured-work-scroll" #scrollTrack>
        @for (project of projects(); track project.id) {
          <a
            [href]="project.url"
            target="_blank"
            rel="noopener noreferrer"
            class="featured-work-card"
            data-project-card
          >
            <div class="card-image-wrap">
              <img
                [src]="project.imageUrl"
                [alt]="project.title"
                class="card-image"
                data-project-image
                loading="lazy"
              />
            </div>
            <div class="card-meta">
              <span class="card-disciplines">
                @for (tag of toDisciplineTags(project); track tag) {
                  <span class="card-tag">{{ tag }}</span>
                }
              </span>
              <h3 class="card-title">{{ project.title }}</h3>
              <span class="card-client">[{{ project.category }}]</span>
            </div>
          </a>
        }
      </div>
    </section>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .featured-work {
        padding: clamp(3rem, 8vw, 5rem) 0;
      }

      .section-label {
        display: block;
        font-family: 'area-normal', sans-serif;
        font-size: 10px;
        letter-spacing: 0.28em;
        text-transform: uppercase;
        color: rgba(10, 10, 10, 0.4);
        margin-bottom: 0.75rem;
      }

      .featured-work-heading {
        font-family: 'area-normal', sans-serif;
        font-size: 10px;
        letter-spacing: 0.28em;
        text-transform: uppercase;
        color: rgba(10, 10, 10, 0.4);
        margin: 0 0 2rem;
        font-weight: 600;
      }

      .featured-work-scroll {
        display: flex;
        gap: 2rem;
        overflow-x: auto;
        overflow-y: hidden;
        padding-bottom: 1rem;
        scroll-snap-type: x mandatory;
        -webkit-overflow-scrolling: touch;
      }

      .featured-work-scroll::-webkit-scrollbar {
        height: 6px;
      }

      .featured-work-scroll::-webkit-scrollbar-track {
        background: rgba(10, 10, 10, 0.06);
      }

      .featured-work-scroll::-webkit-scrollbar-thumb {
        background: rgba(10, 10, 10, 0.2);
        border-radius: 3px;
      }

      .featured-work-card {
        flex: 0 0 min(320px, 85vw);
        scroll-snap-align: start;
        text-decoration: none;
        color: inherit;
        display: block;
        transition: transform 0.25s ease;
      }

      .featured-work-card:hover {
        transform: translateY(-4px);
      }

      .card-image-wrap {
        position: relative;
        aspect-ratio: 4 / 3;
        overflow: hidden;
        background: #f0f0f0;
        margin-bottom: 1rem;
      }

      .card-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.5s ease;
      }

      .featured-work-card:hover .card-image {
        transform: scale(1.03);
      }

      .card-meta {
        display: flex;
        flex-direction: column;
        gap: 0.35rem;
      }

      .card-disciplines {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
      }

      .card-tag {
        font-family: 'area-normal', sans-serif;
        font-size: 9px;
        letter-spacing: 0.2em;
        text-transform: uppercase;
        color: rgba(10, 10, 10, 0.5);
        font-weight: 500;
      }

      .card-title {
        font-family: 'area-normal', sans-serif;
        font-size: clamp(1.1rem, 2vw, 1.35rem);
        font-weight: 600;
        letter-spacing: -0.02em;
        line-height: 1.2;
        margin: 0;
        color: #0a0a0a;
      }

      .card-client {
        font-family: 'area-normal', sans-serif;
        font-size: 11px;
        letter-spacing: 0.1em;
        color: rgba(10, 10, 10, 0.5);
      }

      @media (max-width: 768px) {
        .featured-work-scroll {
          gap: 1.5rem;
        }
        .featured-work-card {
          flex: 0 0 280px;
        }
      }
    `,
  ],
})
export class FeaturedWorkComponent {
  private readonly workService = inject(WorkService);
  readonly projects = this.workService.workItems;

  toDisciplineTags = toDisciplineTags;
}
