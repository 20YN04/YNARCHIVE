import { Component } from '@angular/core';
import { NavBarComponent } from '../../components/navbar/navbar';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [NavBarComponent],
  template: `
    <div class="about-page min-h-screen bg-white text-[#0a0a0a] w-full">
      <app-navbar [fixed]="false" [alwaysVisible]="true" [solidBackground]="true" [activePage]="currentPage"></app-navbar>

      <div class="about-inner mx-auto w-full max-w-[1400px] pt-16 pb-20">
        <h1 class="about-title">About</h1>

        <div class="about-content">
          <div class="about-intro">
            <p class="about-lead">
              I'm Yentl — designer and developer based in Tessenderlo, Belgium.
              I focus on clear, purposeful work: from concept and design to code and delivery.
            </p>
            <p class="about-body">
              I like to combine design thinking with solid development, and I'm comfortable
              working in agile setups. Whether it's a website, an app, or a visual identity,
              I aim for quality and clarity.
            </p>
          </div>

          <div class="about-stack">
            <h2 class="about-stack-title">Tech &amp; tools</h2>
            <div class="about-stack-grid">
              <div class="about-stack-group">
                <span class="about-stack-label">Frontend</span>
                <div class="about-stack-tags">
                  <span>HTML</span><span>CSS</span><span>Tailwind</span><span>JavaScript</span><span>TypeScript</span><span>Angular</span>
                </div>
              </div>
              <div class="about-stack-group">
                <span class="about-stack-label">Backend &amp; data</span>
                <div class="about-stack-tags">
                  <span>Python</span><span>PHP</span><span>Laravel</span><span>SQL</span>
                </div>
              </div>
              <div class="about-stack-group">
                <span class="about-stack-label">Design</span>
                <div class="about-stack-tags">
                  <span>Figma</span><span>Adobe XD</span>
                </div>
              </div>
              <div class="about-stack-group">
                <span class="about-stack-label">Process</span>
                <div class="about-stack-tags">
                  <span>Agile</span><span>Scrum</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      :host { display: block; }
      .about-page { font-family: 'area-normal', sans-serif; }
      .about-inner {
        padding-left: clamp(2rem, 6vw, 5rem);
        padding-right: clamp(2rem, 6vw, 5rem);
      }
      .about-title {
        font-family: 'area-normal', sans-serif;
        font-size: clamp(2rem, 5vw, 3.5rem);
        font-weight: 700;
        letter-spacing: -0.02em;
        line-height: 1.15;
        margin: 0 0 2.5rem;
        color: #0a0a0a;
      }
      .about-content {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 4rem;
        align-items: start;
      }
      .about-intro { max-width: 36ch; }
      .about-lead {
        font-family: 'area-normal', sans-serif;
        font-size: clamp(1.05rem, 1.5vw, 1.15rem);
        line-height: 1.6;
        margin: 0 0 1.25rem;
        color: #0a0a0a;
      }
      .about-body {
        font-family: 'area-normal', sans-serif;
        font-size: clamp(0.95rem, 1.2vw, 1.05rem);
        line-height: 1.65;
        margin: 0;
        color: rgba(10, 10, 10, 0.8);
      }
      .about-stack-title {
        font-family: 'area-normal', sans-serif;
        font-size: 11px;
        letter-spacing: 0.25em;
        text-transform: uppercase;
        color: rgba(10, 10, 10, 0.5);
        margin: 0 0 1.25rem;
      }
      .about-stack-grid {
        display: flex;
        flex-direction: column;
        gap: 1.25rem;
      }
      .about-stack-group {
        display: flex;
        flex-wrap: wrap;
        align-items: baseline;
        gap: 0.5rem 1rem;
      }
      .about-stack-label {
        font-family: 'area-normal', sans-serif;
        font-size: 11px;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: rgba(10, 10, 10, 0.45);
        min-width: 7rem;
      }
      .about-stack-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 0.35rem 0.75rem;
      }
      .about-stack-tags span {
        font-family: 'area-normal', sans-serif;
        font-size: 13px;
        letter-spacing: 0.02em;
        color: #0a0a0a;
        padding: 0.25rem 0.5rem;
        background: transparent;
        border-bottom: 1px solid rgba(10, 10, 10, 0.15);
        border-radius: 0;
        transition: border-color 0.2s, color 0.2s;
      }
      .about-stack-tags span:hover {
        border-color: rgba(10, 10, 10, 0.4);
        color: rgba(10, 10, 10, 0.9);
      }
      @media (max-width: 768px) {
        .about-content { grid-template-columns: 1fr; gap: 2.5rem; }
        .about-intro { max-width: none; }
        .about-stack-group { flex-direction: column; align-items: flex-start; gap: 0.35rem; }
        .about-stack-label { min-width: auto; }
      }
    `
  ]
})
export class AboutComponent {
  readonly currentPage = 'about' as const;
}
