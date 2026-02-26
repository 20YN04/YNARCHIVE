import { Component, inject, computed } from '@angular/core';
import { WorkService } from '../../services/work.service';
import { ImageRevealDirective } from '../../core/directives/image-reveal.directive';

/**
 * Homepage Selected Work: 2–3 best projects, staggered layout, clip-path reveal.
 * "View All Projects" link to /work at the bottom.
 */
@Component({
  selector: 'app-selected-work',
  standalone: true,
  imports: [ImageRevealDirective],
  template: `
    <section class="selected-work" data-selected-work>
      <h2 class="selected-work-heading">Selected Work</h2>
      <div class="selected-work-grid">
        @for (project of featured(); track project.id) {
          <article class="selected-work-item">
            <a
              [href]="project.url"
              target="_blank"
              rel="noopener noreferrer"
              class="selected-work-link"
            >
              <div class="selected-work-image-wrap" appImageReveal [appImageRevealDirection]="$index % 2 === 0 ? 'top' : 'bottom'">
                <img
                  [src]="project.imageUrl"
                  [alt]="project.title"
                  class="selected-work-image"
                  loading="lazy"
                />
              </div>
              <div class="selected-work-meta">
                <span class="selected-work-title">{{ project.title }}</span>
                <span class="selected-work-cat">{{ project.category }} · {{ project.year }}</span>
              </div>
            </a>
          </article>
        }
      </div>
      <a
        href="/work"
        data-nav-link
        data-page="work"
        class="selected-work-all"
      >
        <span class="selected-work-all-text">View All Projects</span>
        <span class="selected-work-all-arrow">→</span>
      </a>
    </section>
  `,
  styles: [
    `
      .selected-work {
        padding: clamp(4rem, 12vw, 8rem) 0;
      }

      .selected-work-heading {
        margin: 0 0 clamp(2.5rem, 6vw, 4rem);
        font-family: 'area-normal', sans-serif;
        font-size: clamp(1.75rem, 3.5vw, 2.25rem);
        font-weight: 700;
        letter-spacing: -0.02em;
        color: #0a0a0a;
      }

      .selected-work-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: clamp(2rem, 4vw, 3.5rem);
      }

      .selected-work-item:nth-child(3) {
        grid-column: 1 / -1;
        max-width: 60%;
        justify-self: start;
      }

      .selected-work-link {
        display: block;
        text-decoration: none;
        color: inherit;
      }

      .selected-work-image-wrap {
        position: relative;
        overflow: hidden;
        background: #f2f2f2;
        aspect-ratio: 16 / 10;
        margin-bottom: 1rem;
      }

      .selected-work-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
        transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      }

      .selected-work-link:hover .selected-work-image {
        transform: scale(1.02);
      }

      .selected-work-meta {
        display: flex;
        flex-wrap: wrap;
        align-items: baseline;
        gap: 0.5rem 1rem;
      }

      .selected-work-title {
        font-family: 'area-normal', sans-serif;
        font-size: clamp(1rem, 1.25vw, 1.2rem);
        font-weight: 600;
        color: #0a0a0a;
        transition: opacity 0.3s ease;
      }

      .selected-work-link:hover .selected-work-title {
        opacity: 0.8;
      }

      .selected-work-cat {
        font-family: 'area-normal', sans-serif;
        font-size: 12px;
        color: rgba(10, 10, 10, 0.5);
      }

      .selected-work-all {
        display: inline-flex;
        align-items: center;
        gap: 0.75rem;
        margin-top: clamp(2.5rem, 5vw, 4rem);
        font-family: 'area-normal', sans-serif;
        font-size: 13px;
        font-weight: 600;
        letter-spacing: 0.15em;
        text-transform: uppercase;
        color: #0a0a0a;
        text-decoration: none;
        padding-bottom: 4px;
        border-bottom: 1px solid transparent;
        transition: border-color 0.4s ease, opacity 0.3s ease;
      }

      .selected-work-all:hover {
        border-bottom-color: #0a0a0a;
        opacity: 0.85;
      }

      .selected-work-all-arrow {
        transition: transform 0.35s ease;
      }

      .selected-work-all:hover .selected-work-all-arrow {
        transform: translateX(4px);
      }

      @media (max-width: 700px) {
        .selected-work-grid {
          grid-template-columns: 1fr;
        }
        .selected-work-item:nth-child(3) {
          max-width: none;
        }
      }
    `
  ]
})
export class SelectedWorkComponent {
  private work = inject(WorkService);
  featured = computed(() => this.work.workItems().slice(0, 3));
}
