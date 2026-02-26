import { Component } from '@angular/core';
import { NavBarComponent } from '../../components/navbar/navbar';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [NavBarComponent],
  template: `
    <div class="about-page min-h-screen bg-white text-[#0a0a0a] w-full">
      <app-navbar [fixed]="false" [alwaysVisible]="true" [solidBackground]="true" activePage="about"></app-navbar>

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
            <ul class="about-stack-list">
              <li>HTML</li>
              <li>CSS</li>
              <li>Tailwind</li>
              <li>JavaScript</li>
              <li>TypeScript</li>
              <li>Angular</li>
              <li>Python</li>
              <li>PHP</li>
              <li>Laravel</li>
              <li>SQL</li>
              <li>Figma</li>
              <li>Adobe XD</li>
              <li>Agile</li>
              <li>Scrum</li>
            </ul>
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
        margin: 0 0 1rem;
      }
      .about-stack-list {
        list-style: none;
        margin: 0;
        padding: 0;
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem 1.5rem;
      }
      .about-stack-list li {
        font-family: 'area-normal', sans-serif;
        font-size: 14px;
        letter-spacing: 0.02em;
        color: #0a0a0a;
        padding: 0.4rem 0.75rem;
        background: rgba(10, 10, 10, 0.06);
        border-radius: 2px;
      }
      @media (max-width: 768px) {
        .about-content { grid-template-columns: 1fr; gap: 2.5rem; }
        .about-intro { max-width: none; }
      }
    `
  ]
})
export class AboutComponent {}
