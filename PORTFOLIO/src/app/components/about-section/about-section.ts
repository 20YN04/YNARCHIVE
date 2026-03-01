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

        <!-- Section label -->
        <div class="about-label" data-about-label>
          <span class="label-num">(02)</span>
          <span class="label-text">About</span>
        </div>

        <!-- Large statement — scroll-driven word reveal -->
        <div class="about-statement" data-about-statement>
          <p class="statement-text" data-highlight-text>
            Taking everyday ideas and transforming them into tangible
            digital experiences through design &amp; development.
          </p>
        </div>

        <!-- Two-column detail -->
        <div class="about-columns" data-about-columns>
          <div class="about-col about-col-left">
            <p class="about-body" data-highlight-text>
              I design &amp; develop impactful digital experiences through
              UI/UX, branding, interactions, and clean engineering.
            </p>
            <p class="about-body" data-highlight-text>
              Starting my journey as a developer and designer, later
              specialising in frontend engineering and creative development.
              Building brand experiences through digital media, creating
              interactive &amp; performant designs.
            </p>
            <p class="about-body" data-highlight-text>
              In 2025, I started combining deep frontend expertise with design
              thinking — taking projects from wireframe all the way to
              deployment.
            </p>
          </div>

          <div class="about-col about-col-right">
            <!-- Tech & Tools -->
            <div class="about-stack" data-about-stack>
              <h3 class="stack-heading">Tech &amp; tools</h3>
              <div class="stack-list">
                <div class="stack-group">
                  <span class="stack-label">Frontend</span>
                  <span class="stack-items">HTML, CSS, Tailwind, JavaScript, TypeScript, Angular, React</span>
                </div>
                <div class="stack-group">
                  <span class="stack-label">Backend &amp; data</span>
                  <span class="stack-items">Python, PHP, Laravel, Node.js, SQL</span>
                </div>
                <div class="stack-group">
                  <span class="stack-label">Design</span>
                  <span class="stack-items">Figma, Adobe XD</span>
                </div>
                <div class="stack-group">
                  <span class="stack-label">Process</span>
                  <span class="stack-items">Agile, Scrum, Git</span>
                </div>
              </div>
            </div>

            <!-- CV link -->
            <a href="/YentlNerinckxCv.pdf" download class="about-cv-link" data-about-cv>
              Download CV &rarr;
            </a>
          </div>
        </div>

      </div>
    </section>
  `,
  styles: [
    `
      :host { display: block; }

      .about-section {
        position: relative;
        padding: clamp(8rem, 16vw, 14rem) clamp(1.5rem, 4vw, 4rem);
        background: #0a0a0a;
        color: #fff;
      }

      .about-inner {
        max-width: var(--content-max-width, 1400px);
        margin: 0 auto;
      }

      /* ── Label ── */
      .about-label {
        display: flex;
        align-items: baseline;
        gap: 0.75rem;
        margin-bottom: clamp(3rem, 7vw, 6rem);
        opacity: 0;
      }
      .label-num {
        font-family: 'area-normal', sans-serif;
        font-size: 11px;
        font-weight: 400;
        color: rgba(255,255,255,0.3);
      }
      .label-text {
        font-family: 'area-normal', sans-serif;
        font-size: 11px;
        font-weight: 500;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        color: rgba(255,255,255,0.5);
      }

      /* ── Large statement ── */
      .about-statement {
        margin-bottom: clamp(5rem, 10vw, 8rem);
      }
      .statement-text {
        font-family: 'area-normal', sans-serif;
        font-size: clamp(1.6rem, 4vw, 3rem);
        font-weight: 600;
        line-height: 1.25;
        letter-spacing: -0.025em;
        color: #fff;
        margin: 0;
        max-width: 20ch;
      }

      /* ── Two-column layout ── */
      .about-columns {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: clamp(3rem, 6vw, 6rem);
      }

      .about-body {
        font-family: 'area-normal', sans-serif;
        font-size: clamp(0.95rem, 1.3vw, 1.1rem);
        font-weight: 400;
        line-height: 1.7;
        color: rgba(255,255,255,0.6);
        margin: 0 0 1.5rem;
        max-width: 45ch;
      }
      .about-body:last-child { margin-bottom: 0; }

      /* ── Stack ── */
      .about-stack {
        margin-bottom: 2.5rem;
      }
      .stack-heading {
        font-family: 'area-normal', sans-serif;
        font-size: 11px;
        font-weight: 500;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: rgba(255,255,255,0.4);
        margin: 0 0 1.5rem;
      }
      .stack-list {
        display: flex;
        flex-direction: column;
        gap: 1.25rem;
      }
      .stack-group {
        display: flex;
        flex-direction: column;
        gap: 0.3rem;
      }
      .stack-label {
        font-family: 'area-normal', sans-serif;
        font-size: 11px;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        color: rgba(255,255,255,0.3);
      }
      .stack-items {
        font-family: 'area-normal', sans-serif;
        font-size: 14px;
        font-weight: 400;
        line-height: 1.6;
        color: rgba(255,255,255,0.7);
        letter-spacing: 0.01em;
      }

      /* ── CV link ── */
      .about-cv-link {
        display: inline-block;
        font-family: 'area-normal', sans-serif;
        font-size: 13px;
        font-weight: 600;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        color: #fff;
        text-decoration: none;
        padding-bottom: 4px;
        border-bottom: 1px solid rgba(255,255,255,0.4);
        transition: opacity 0.25s ease;
      }
      .about-cv-link:hover { opacity: 0.7; }

      /* ── Responsive ── */
      @media (max-width: 768px) {
        .about-columns {
          grid-template-columns: 1fr;
          gap: 3rem;
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

    // ── Highlight text reveal — word-by-word fade on scroll ──
    const highlightEls = host.querySelectorAll('[data-highlight-text]');
    highlightEls.forEach((el) => this.initHighlightText(el as HTMLElement));

    // ── General reveals ──
    const reveal = (selector: string, from: gsap.TweenVars) => {
      const target = host.querySelector(selector);
      if (!target) return;
      const tween = gsap.from(target, {
        ...from,
        scrollTrigger: {
          trigger: target,
          start: 'top 90%',
          end: 'top 60%',
          scrub: 0.5,
        },
      });
      if (tween.scrollTrigger) this.scrollTriggers.push(tween.scrollTrigger);
    };

    reveal('[data-about-label]', { y: 16, opacity: 0 });
    reveal('[data-about-columns]', { y: 40, opacity: 0 });
    reveal('[data-about-stack]', { y: 30, opacity: 0 });
    reveal('[data-about-cv]', { y: 16, opacity: 0 });

    ScrollTrigger.refresh();
  }

  private initHighlightText(el: HTMLElement): void {
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    const textNodes: Text[] = [];
    let node: Text | null;
    while ((node = walker.nextNode() as Text | null)) {
      textNodes.push(node);
    }

    textNodes.forEach((textNode) => {
      const words = textNode.textContent?.split(/(\s+)/) || [];
      const frag = document.createDocumentFragment();
      words.forEach((word) => {
        if (/^\s+$/.test(word)) {
          frag.appendChild(document.createTextNode(word));
        } else if (word) {
          const span = document.createElement('span');
          span.className = 'highlight-word';
          span.textContent = word;
          frag.appendChild(span);
        }
      });
      textNode.parentNode?.replaceChild(frag, textNode);
    });

    const wordSpans = el.querySelectorAll('.highlight-word');
    if (!wordSpans.length) return;

    gsap.set(wordSpans, { opacity: 0.15 });

    const tween = gsap.to(wordSpans, {
      opacity: 1,
      stagger: 0.05,
      ease: 'none',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        end: 'bottom 55%',
        scrub: true,
      },
    });
    if (tween.scrollTrigger) this.scrollTriggers.push(tween.scrollTrigger);
  }

  ngOnDestroy(): void {
    this.scrollTriggers.forEach((st) => st.kill());
    this.scrollTriggers = [];
  }
}
