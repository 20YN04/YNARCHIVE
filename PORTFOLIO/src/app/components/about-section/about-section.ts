import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  inject,
} from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

@Component({
  selector: 'app-about-section',
  standalone: true,
  template: `
    <section id="about" class="about-section" data-about-section>
      <div class="about-inner">
        <!-- Label -->
        <div class="section-label-wrap" data-about-label>
          <span class="section-bullet">&bull;</span>
          <span class="section-label">About</span>
        </div>

        <!-- Intro -->
        <div class="about-intro" data-about-intro>
          <h2 class="about-title">
            I'm Yentl — designer &amp; developer<br />
            based in Tessenderlo, Belgium.
          </h2>
          <p class="about-lead">
            I focus on clear, purposeful work: from concept and design to code
            and delivery. I like to combine design thinking with solid
            development, and I'm comfortable working in agile setups.
          </p>
          <p class="about-body">
            Whether it's a website, an app, or a visual identity, I aim for
            quality and clarity.
          </p>
          <a
            href="/YentlNerinckxCv.pdf"
            download
            class="about-cv-link"
          >
            Download CV
          </a>
        </div>

        <!-- Tech & Tools -->
        <div class="about-stack" data-about-stack>
          <h3 class="about-stack-heading">Tech &amp; tools</h3>
          <div class="about-stack-grid">
            <div class="about-stack-group">
              <span class="about-stack-label">Frontend</span>
              <div class="about-stack-tags">
                <span>HTML</span><span>CSS</span><span>Tailwind</span>
                <span>JavaScript</span><span>TypeScript</span>
                <span>Angular</span><span>React</span>
              </div>
            </div>
            <div class="about-stack-group">
              <span class="about-stack-label">Backend &amp; data</span>
              <div class="about-stack-tags">
                <span>Python</span><span>PHP</span><span>Laravel</span>
                <span>Node.js</span><span>SQL</span>
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
                <span>Agile</span><span>Scrum</span><span>Git</span>
              </div>
            </div>
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
        position: relative;
        padding: clamp(6rem, 14vw, 10rem) clamp(1.5rem, 4vw, 4rem);
        background: #fafafa;
      }

      .about-inner {
        max-width: var(--content-max-width);
        margin: 0 auto;
      }

      /* ── Label ── */
      .section-label-wrap {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 2rem;
      }
      .section-bullet {
        font-size: 10px;
        color: #0a0a0a;
      }
      .section-label {
        font-family: 'area-normal', sans-serif;
        font-size: 11px;
        font-weight: 500;
        letter-spacing: 0.08em;
        color: #0a0a0a;
      }

      /* ── Intro ── */
      .about-intro {
        max-width: 56ch;
        margin-bottom: clamp(3rem, 6vw, 5rem);
      }
      .about-title {
        font-family: 'area-normal', sans-serif;
        font-size: clamp(1.6rem, 3.5vw, 2.4rem);
        font-weight: 600;
        letter-spacing: -0.02em;
        line-height: 1.2;
        margin: 0 0 1.25rem;
        color: #0a0a0a;
      }
      .about-lead {
        font-family: 'area-normal', sans-serif;
        font-size: clamp(1.05rem, 1.5vw, 1.2rem);
        line-height: 1.55;
        margin: 0 0 0.75rem;
        color: #0a0a0a;
        font-weight: 500;
      }
      .about-body {
        font-family: 'area-normal', sans-serif;
        font-size: clamp(0.95rem, 1.2vw, 1.05rem);
        line-height: 1.65;
        margin: 0 0 1.5rem;
        color: rgba(10, 10, 10, 0.75);
      }
      .about-cv-link {
        display: inline-block;
        font-family: 'area-normal', sans-serif;
        font-size: 13px;
        font-weight: 600;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: #0a0a0a;
        text-decoration: none;
        padding-bottom: 4px;
        border-bottom: 1px solid #0a0a0a;
        transition: opacity 0.25s ease;
      }
      .about-cv-link:hover {
        opacity: 0.7;
      }

      /* ── Tech stack ── */
      .about-stack {
        border-top: 1px solid rgba(10, 10, 10, 0.08);
        padding-top: 2rem;
      }
      .about-stack-heading {
        font-family: 'area-normal', sans-serif;
        font-size: clamp(1.25rem, 2.5vw, 1.75rem);
        font-weight: 600;
        letter-spacing: -0.02em;
        margin: 0 0 1.25rem;
        color: #0a0a0a;
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
        border-bottom: 1px solid rgba(10, 10, 10, 0.15);
        transition: border-color 0.2s, color 0.2s;
      }
      .about-stack-tags span:hover {
        border-color: rgba(10, 10, 10, 0.4);
        color: rgba(10, 10, 10, 0.9);
      }

      @media (max-width: 768px) {
        .about-stack-group {
          flex-direction: column;
          align-items: flex-start;
          gap: 0.35rem;
        }
        .about-stack-label {
          min-width: auto;
        }
      }
    `,
  ],
})
export class AboutSectionComponent implements AfterViewInit, OnDestroy {
  private readonly el = inject(ElementRef);
  private scrollTriggers: ScrollTrigger[] = [];

  ngAfterViewInit(): void {
    requestAnimationFrame(() => {
      setTimeout(() => this.setupAnimations(), 100);
    });
  }

  private setupAnimations(): void {
    const host = this.el.nativeElement as HTMLElement;
    const label = host.querySelector('[data-about-label]');
    const intro = host.querySelector('[data-about-intro]');
    const stack = host.querySelector('[data-about-stack]');

    const reveal = (
      trigger: Element | null,
      targets: Element | Element[] | null,
      from: gsap.TweenVars
    ) => {
      if (!trigger || !targets) return;
      const tween = gsap.from(targets, {
        ...from,
        scrollTrigger: {
          trigger,
          start: 'top 88%',
          end: 'top 55%',
          scrub: 0.6,
        },
      });
      if (tween.scrollTrigger) this.scrollTriggers.push(tween.scrollTrigger);
    };

    reveal(label, label, { y: 24, opacity: 0 });
    reveal(intro, intro, { y: 40, opacity: 0 });
    reveal(stack, stack, { y: 48, opacity: 0 });

    ScrollTrigger.refresh();
  }

  ngOnDestroy(): void {
    this.scrollTriggers.forEach((st) => st.kill());
    this.scrollTriggers = [];
  }
}
