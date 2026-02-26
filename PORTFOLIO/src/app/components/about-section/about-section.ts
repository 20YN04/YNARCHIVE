import { Component } from '@angular/core';
import { TitleRevealDirective } from '../../core/directives/title-reveal.directive';

@Component({
  selector: 'app-about-section',
  standalone: true,
  imports: [TitleRevealDirective],
  template: `
    <section class="about-section" id="about" data-about-section>
      <div class="about-header">
        <span class="section-num">02</span>
        <span class="section-label">About</span>
      </div>

      <div class="about-grid">
        <div class="about-intro">
          <h2 class="about-heading" appTitleReveal>Hello — I'm Yentl.</h2>
          <p class="about-role">Designer &amp; developer based in Tessenderlo, Belgium.</p>
        </div>
        <div class="about-content">
          <p class="about-body">
            I focus on thoughtful design and solid implementation — from concept to code.
            Whether it's a website, an app, or a visual identity, I like to keep things clear,
            purposeful, and a bit personal.
          </p>
          <p class="about-body">
            When I'm not at the screen, I'm probably sketching, reading, or exploring.
            Always open to new projects and collaborations.
          </p>
          <div class="about-meta">
            <span class="about-meta-item">Tessenderlo, Belgium</span>
            <span class="about-meta-item">Available for projects</span>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .about-section {
        padding: 5rem 0 3rem;
      }

      .about-header {
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

      .about-grid {
        display: grid;
        grid-template-columns: 1fr 1.5fr;
        gap: 3rem;
        align-items: start;
      }

      .about-intro {
        position: sticky;
        top: 100px;
      }

      .about-heading {
        margin: 0 0 0.5rem;
        font-family: 'area-normal', sans-serif;
        font-size: clamp(1.75rem, 3vw, 2.25rem);
        font-weight: 700;
        letter-spacing: -0.02em;
        line-height: 1.2;
        color: #0a0a0a;
      }

      .about-role {
        margin: 0;
        font-family: 'area-normal', sans-serif;
        font-size: 14px;
        letter-spacing: 0.05em;
        color: rgba(10, 10, 10, 0.6);
      }

      .about-content {
        display: flex;
        flex-direction: column;
        gap: 1.25rem;
      }

      .about-body {
        margin: 0;
        font-family: 'area-normal', sans-serif;
        font-size: clamp(0.95rem, 1.2vw, 1.05rem);
        line-height: 1.65;
        letter-spacing: 0.01em;
        color: rgba(10, 10, 10, 0.85);
      }

      .about-meta {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem 2rem;
        margin-top: 0.5rem;
      }

      .about-meta-item {
        font-family: 'area-normal', sans-serif;
        font-size: 11px;
        letter-spacing: 0.15em;
        text-transform: uppercase;
        color: rgba(10, 10, 10, 0.45);
      }

      @media (max-width: 768px) {
        .about-section {
          padding: 3rem 0 2rem;
        }

        .about-grid {
          grid-template-columns: 1fr;
          gap: 2rem;
        }

        .about-intro {
          position: relative;
          top: 0;
        }
      }
    `
  ]
})
export class AboutSectionComponent {}
