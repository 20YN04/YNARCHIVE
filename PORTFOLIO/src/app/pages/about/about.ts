import { AfterViewInit, Component, ElementRef, OnDestroy, inject } from '@angular/core';
import { NavBarComponent } from '../../components/navbar/navbar';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [NavBarComponent],
  template: `
    <div class="about-page min-h-screen bg-white text-[#0a0a0a] w-full">
      <app-navbar [fixed]="false" [alwaysVisible]="true" [solidBackground]="true"></app-navbar>

      <div class="about-inner" #aboutInner>
        <span class="section-label" data-about-scroll-label>&#123; ABOUT &#125;</span>
        <h1 class="about-title" data-about-scroll-title>About</h1>

        <div class="about-intro" data-about-scroll-intro>
          <p class="about-lead">
            I'm Yentl — designer and developer based in Tessenderlo, Belgium.
            I focus on clear, purposeful work: from concept and design to code and delivery.
          </p>
          <p class="about-body">
            I like to combine design thinking with solid development, and I'm comfortable
            working in agile setups. Whether it's a website, an app, or a visual identity,
            I aim for quality and clarity.
          </p>
          <a href="/YentlNerinckxCv.pdf" download class="about-cv-link">Download CV</a>
        </div>

        <section class="about-section" data-about-scroll-section>
          <span class="section-label">&#123; ABOUT &#125;</span>
          <h2 class="about-section-title">Tech &amp; tools</h2>
          <div class="about-stack-grid">
            <div class="about-stack-group">
              <span class="about-stack-label">Frontend</span>
              <div class="about-stack-tags">
                <span>HTML</span><span>CSS</span><span>Tailwind</span><span>JavaScript</span><span>TypeScript</span><span>Angular</span><span>React</span>
              </div>
            </div>
            <div class="about-stack-group">
              <span class="about-stack-label">Backend &amp; data</span>
              <div class="about-stack-tags">
                <span>Python</span><span>PHP</span><span>Laravel</span><span>Node.js</span><span>SQL</span>
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
        </section>
      </div>
    </div>
  `,
  styles: [
    `
      :host { display: block; }
      .about-page { font-family: 'area-normal', sans-serif; }
      .about-inner {
        max-width: var(--content-max-width);
        margin: 0 auto;
        padding: 6rem clamp(2rem, 6vw, 5rem) 5rem;
      }

      .section-label {
        display: block;
        font-size: 10px;
        letter-spacing: 0.28em;
        text-transform: uppercase;
        color: rgba(10, 10, 10, 0.4);
        margin-bottom: 0.75rem;
      }

      .about-title {
        font-size: clamp(2rem, 5vw, 3.5rem);
        font-weight: 700;
        letter-spacing: -0.02em;
        line-height: 1.15;
        margin: 0 0 2.5rem;
        color: #0a0a0a;
      }

      .about-intro {
        max-width: 52ch;
        margin-bottom: 4rem;
      }

      .about-intro .about-cv-link {
        margin-top: 1.5rem;
        margin-bottom: 0;
      }

      .about-lead {
        font-size: clamp(1.15rem, 1.8vw, 1.5rem);
        line-height: 1.45;
        margin: 0 0 1rem;
        color: #0a0a0a;
        font-weight: 500;
      }

      .about-body {
        font-size: clamp(1rem, 1.25vw, 1.1rem);
        line-height: 1.65;
        margin: 0;
        color: rgba(10, 10, 10, 0.8);
      }

      .about-section {
        margin-bottom: 4rem;
      }

      .about-section-title {
        font-size: clamp(1.5rem, 3.5vw, 2.25rem);
        font-weight: 700;
        letter-spacing: -0.02em;
        margin: 0 0 0.75rem;
        color: #0a0a0a;
      }

      .about-section-intro {
        font-size: clamp(0.95rem, 1.2vw, 1.05rem);
        line-height: 1.6;
        color: rgba(10, 10, 10, 0.75);
        margin: 0 0 1.5rem;
        max-width: 42ch;
      }

      .about-cv-link {
        display: inline-block;
        font-size: 13px;
        font-weight: 600;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: #0a0a0a;
        text-decoration: none;
        margin-bottom: 2rem;
        padding-bottom: 4px;
        border-bottom: 1px solid #0a0a0a;
        transition: opacity 0.25s ease;
      }
      .about-cv-link:hover {
        opacity: 0.7;
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
        .about-inner {
          padding: 5rem clamp(1.5rem, 5vw, 2rem) 3rem;
        }
        .about-intro { margin-bottom: 3rem; }
        .about-section { margin-bottom: 3rem; }
        .about-stack-group {
          flex-direction: column;
          align-items: flex-start;
          gap: 0.35rem;
        }
        .about-stack-label {
          min-width: auto;
        }
      }
    `
  ]
})
export class AboutComponent implements AfterViewInit, OnDestroy {
  private readonly el = inject(ElementRef);
  private scrollTriggers: ScrollTrigger[] = [];

  ngAfterViewInit(): void {
    const host = this.el.nativeElement as HTMLElement;
    const label = host.querySelector('[data-about-scroll-label]');
    const title = host.querySelector('[data-about-scroll-title]');
    const intro = host.querySelector('[data-about-scroll-intro]');
    const section = host.querySelector('[data-about-scroll-section]');

    const register = (triggerEl: Element | null, targets: Element | Element[] | null, from: gsap.TweenVars) => {
      if (!triggerEl || !targets) return;
      const st = gsap.from(targets, {
        ...from,
        scrollTrigger: {
          trigger: triggerEl,
          start: 'top 88%',
          end: 'top 55%',
          scrub: 0.6,
        },
      });
      const stInstance = st.scrollTrigger;
      if (stInstance) this.scrollTriggers.push(stInstance);
    };

    register(label, label, { y: 24, opacity: 0 });
    register(title, title, { y: 32, opacity: 0 });
    register(intro, intro, { y: 40, opacity: 0 });
    register(section, section, { y: 48, opacity: 0 });

    requestAnimationFrame(() => ScrollTrigger.refresh());
  }

  ngOnDestroy(): void {
    this.scrollTriggers.forEach((st) => st.kill());
    this.scrollTriggers = [];
  }
}
