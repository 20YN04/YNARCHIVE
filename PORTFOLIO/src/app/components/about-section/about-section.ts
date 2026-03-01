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

        <!-- Large statement — ink bleed word reveal -->
        <div class="about-statement" data-about-statement>
          <p class="statement-text" data-ink-bleed="heavy">
            Taking everyday ideas and transforming them into tangible
            digital experiences through design &amp; development.
          </p>
        </div>

        <!-- Two-column detail -->
        <div class="about-columns" data-about-columns>
          <div class="about-col about-col-left">
            <p class="about-body" data-ink-bleed="light">
              I design &amp; develop impactful digital experiences through
              UI/UX, branding, interactions, and clean engineering.
            </p>
            <p class="about-body" data-ink-bleed="light">
              Starting my journey as a developer and designer, later
              specialising in frontend engineering and creative development.
              Building brand experiences through digital media, creating
              interactive &amp; performant designs.
            </p>
            <p class="about-body" data-ink-bleed="light">
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

      /* ── Ink Bleed Words ── */
      .ink-word {
        display: inline-block;
        will-change: filter, transform, opacity;
      }

      /* ── Stack group reveal lines ── */
      .stack-group {
        position: relative;
        padding-left: 0;
      }
      .stack-group::before {
        content: '';
        position: absolute;
        top: 0;
        left: -1rem;
        width: 0;
        height: 100%;
        border-left: 1px solid rgba(255,255,255,0.15);
        transition: width 0.6s ease;
      }
      .stack-group.revealed {
        padding-left: 1rem;
      }
      .stack-group.revealed::before {
        width: 1px;
      }

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
    // Longer delay to ensure DOM is laid out and home.ts clip-path is ready
    requestAnimationFrame(() => {
      setTimeout(() => this.setupAnimations(), 400);
    });
  }

  private setupAnimations(): void {
    const host = this.el.nativeElement as HTMLElement;

    const toggle = 'play none none reverse';

    // ── Label reveal ──
    const label = host.querySelector('[data-about-label]') as HTMLElement;
    if (label) {
      gsap.set(label, { opacity: 0, y: 20 });
      gsap.to(label, {
        opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
        scrollTrigger: {
          trigger: label,
          start: 'top 90%',
          end: 'top 50%',
          toggleActions: toggle,
          invalidateOnRefresh: true,
        },
      });
    }

    // ── Ink Bleed word reveals ──
    host.querySelectorAll('[data-ink-bleed]').forEach((el) => {
      const intensity = (el as HTMLElement).getAttribute('data-ink-bleed') || 'light';
      this.initInkBleed(el as HTMLElement, intensity as 'heavy' | 'light');
    });

    // ── Columns container reveal ──
    const cols = host.querySelector('[data-about-columns]') as HTMLElement;
    if (cols) {
      gsap.set(cols, { opacity: 0, y: 40 });
      gsap.to(cols, {
        opacity: 1, y: 0, duration: 1, ease: 'power3.out',
        scrollTrigger: {
          trigger: cols,
          start: 'top 92%',
          end: 'top 50%',
          toggleActions: toggle,
          invalidateOnRefresh: true,
        },
      });
    }

    // ── Tech stack: staggered group reveal ──
    const stackGroups = host.querySelectorAll('.stack-group');
    if (stackGroups.length) {
      gsap.set(stackGroups, { opacity: 0, y: 20 });
      const stackContainer = host.querySelector('[data-about-stack]') as HTMLElement;
      if (stackContainer) {
        const stackTl = gsap.timeline({
          scrollTrigger: {
            trigger: stackContainer,
            start: 'top 88%',
            end: 'top 50%',
            toggleActions: toggle,
            invalidateOnRefresh: true,
          },
        });
        stackTl.to(stackGroups, {
          opacity: 1, y: 0, duration: 0.7,
          stagger: 0.12,
          ease: 'power3.out',
          onComplete: () => {
            stackGroups.forEach(g => (g as HTMLElement).classList.add('revealed'));
          },
          onReverseComplete: () => {
            stackGroups.forEach(g => (g as HTMLElement).classList.remove('revealed'));
          },
        });
      }
    }

    // ── Stack heading ──
    const stackHeading = host.querySelector('.stack-heading') as HTMLElement;
    if (stackHeading) {
      gsap.set(stackHeading, { opacity: 0, y: 14 });
      gsap.to(stackHeading, {
        opacity: 1, y: 0, duration: 0.7, ease: 'power3.out',
        scrollTrigger: {
          trigger: stackHeading,
          start: 'top 92%',
          end: 'top 55%',
          toggleActions: toggle,
          invalidateOnRefresh: true,
        },
      });
    }

    // ── CV link ──
    const cv = host.querySelector('[data-about-cv]') as HTMLElement;
    if (cv) {
      gsap.set(cv, { opacity: 0, y: 16 });
      gsap.to(cv, {
        opacity: 1, y: 0, duration: 0.7, ease: 'power3.out',
        scrollTrigger: {
          trigger: cv,
          start: 'top 95%',
          end: 'top 60%',
          toggleActions: toggle,
          invalidateOnRefresh: true,
        },
      });
    }

    ScrollTrigger.refresh();
  }

  /**
   * Ink Bleed: words start blurred & oversized (like wet ink blots)
   * and sharpen into crisp text on scroll. Reverses on scroll back.
   */
  private initInkBleed(el: HTMLElement, intensity: 'heavy' | 'light'): void {
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    const textNodes: Text[] = [];
    let node: Text | null;
    while ((node = walker.nextNode() as Text | null)) textNodes.push(node);

    textNodes.forEach((textNode) => {
      const words = textNode.textContent?.split(/(\s+)/) || [];
      const frag = document.createDocumentFragment();
      words.forEach((word) => {
        if (/^\s+$/.test(word)) {
          frag.appendChild(document.createTextNode(word));
        } else if (word) {
          const span = document.createElement('span');
          span.className = 'ink-word';
          span.textContent = word;
          frag.appendChild(span);
        }
      });
      textNode.parentNode?.replaceChild(frag, textNode);
    });

    const wordSpans = Array.from(el.querySelectorAll('.ink-word')) as HTMLElement[];
    if (!wordSpans.length) return;

    const isHeavy = intensity === 'heavy';
    const blurPx = isHeavy ? 14 : 7;
    const scaleFactor = isHeavy ? 1.2 : 1.08;
    const yPx = isHeavy ? 10 : 5;

    // Set initial blurred/oversized state
    wordSpans.forEach((span) => {
      span.style.opacity = '0.05';
      span.style.filter = `blur(${blurPx}px)`;
      span.style.transform = `scale(${scaleFactor}) translateY(${yPx}px)`;
    });

    // Build a timeline so it can reverse on scroll back
    const tl = gsap.timeline({
      paused: true,
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        end: 'top 40%',
        toggleActions: 'play none none reverse',
        invalidateOnRefresh: true,
      },
    });

    wordSpans.forEach((span, i) => {
      const delay = i * (isHeavy ? 0.04 : 0.02);
      tl.to(span, {
        duration: isHeavy ? 0.6 : 0.4,
        ease: 'power2.out',
        onUpdate: function(this: gsap.core.Tween) {
          const p = this.progress();
          const blur = blurPx * (1 - p);
          const scale = 1 + (scaleFactor - 1) * (1 - p);
          const y = yPx * (1 - p);
          span.style.opacity = String(0.05 + 0.95 * p);
          span.style.filter = `blur(${blur}px)`;
          span.style.transform = `scale(${scale}) translateY(${y}px)`;
        },
      }, delay);
    });
  }

  ngOnDestroy(): void {
    this.scrollTriggers.forEach((st) => st.kill());
    this.scrollTriggers = [];
  }
}
