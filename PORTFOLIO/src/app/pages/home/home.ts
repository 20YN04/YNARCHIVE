import { AfterViewInit, Component, ElementRef, inject, OnDestroy } from '@angular/core';
import { HeroComponent } from '../../hero/hero';
import { FeaturedWorkComponent } from '../../components/featured-work/featured-work';
import { AboutSectionComponent } from '../../components/about-section/about-section';
import { ContactSectionComponent } from '../../components/contact-section/contact-section';
import { MarqueeComponent } from '../../components/marquee/marquee';
import { WorkService } from '../../services/work.service';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeroComponent,
    FeaturedWorkComponent,
    AboutSectionComponent,
    ContactSectionComponent,
    MarqueeComponent,
  ],
  template: `
    <!-- ═══ HERO — sticky, scales down as you leave ═══ -->
    <div class="section-pin" data-pin-hero>
      <app-hero></app-hero>
    </div>

    <!-- ═══ MARQUEE DIVIDER: hero → work ═══ -->
    <div class="marquee-divider marquee-divider--dark" data-divider-1>
      <app-marquee
        text="Selected Projects"
        [dark]="true"
        [large]="true"
        [showArrows]="true"
        [bordered]="true"
        [duration]="22"
      ></app-marquee>
    </div>

    <!-- ═══ BOUNDARY TEXT: spans hero→work ═══ -->
    <div class="boundary-text boundary-text--work" data-boundary-work>
      <span class="boundary-word">W<span class="boundary-alt">O</span>RK</span>
    </div>

    <!-- ═══ WORK — clips open over hero, sticky so about clips over it ═══ -->
    <div class="section-clip" data-clip-work>
      <section id="work" class="section-work" data-section-work>
        <app-featured-work></app-featured-work>
      </section>
    </div>

    <!-- ═══ MARQUEE DIVIDER: work → about ═══ -->
    <div class="marquee-divider marquee-divider--light" data-divider-2>
      <app-marquee
        text="A bit about me"
        [dark]="false"
        [large]="true"
        [showArrows]="true"
        [bordered]="true"
        [duration]="20"
      ></app-marquee>
    </div>

    <!-- ═══ BOUNDARY TEXT: spans work→about ═══ -->
    <div class="boundary-text boundary-text--about" data-boundary-about>
      <span class="boundary-word boundary-word--light">AB<span class="boundary-alt">O</span>UT</span>
    </div>

    <!-- ═══ ABOUT — clips open over work ═══ -->
    <div class="section-clip" data-clip-about>
      <app-about-section></app-about-section>
    </div>

    <!-- ═══ MARQUEE DIVIDER: about → contact ═══ -->
    <div class="marquee-divider marquee-divider--dark" data-divider-3>
      <app-marquee
        text="Let's talk"
        [dark]="true"
        [large]="true"
        [showArrows]="true"
        [bordered]="true"
        [duration]="18"
      ></app-marquee>
    </div>

    <!-- ═══ CONTACT — flows from about (both dark, no clip needed) ═══ -->
    <app-contact-section></app-contact-section>

    <!-- ═══ TRAVELING LINE — vertical thread connecting sections ═══ -->
    <div class="traveling-line" data-traveling-line>
      <div class="traveling-dot" data-traveling-dot></div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        position: relative;
      }

      /* ═══ STICKY PIN — hero stays in place, next section slides over ═══ */
      .section-pin {
        position: relative;
        z-index: 1;
      }

      /* ═══ CLIP REVEAL — section clips open with rounded corners ═══ */
      .section-clip {
        position: relative;
        z-index: 2;
        will-change: clip-path;
        clip-path: inset(0 0 0 0);
      }

      .section-work {
        position: relative;
        background: #fff;
        color: #0a0a0a;
      }

      /* ═══ MARQUEE DIVIDERS ═══ */
      .marquee-divider {
        position: relative;
        z-index: 3;
        overflow: hidden;
      }
      .marquee-divider--dark {
        background: #0a0a0a;
        color: #fff;
      }
      .marquee-divider--light {
        background: #fff;
        color: #0a0a0a;
      }

      /* ═══ BOUNDARY-SPANNING TEXT ═══ */
      .boundary-text {
        position: relative;
        z-index: 4;
        display: flex;
        justify-content: center;
        align-items: center;
        pointer-events: none;
        overflow: hidden;
        height: 0;
      }
      .boundary-word {
        font-family: 'area-normal', sans-serif;
        font-size: clamp(5rem, 18vw, 16rem);
        font-weight: 800;
        letter-spacing: -0.04em;
        line-height: 0.85;
        text-transform: uppercase;
        color: #0a0a0a;
        opacity: 0;
        transform: translateY(40px);
        will-change: transform, opacity;
      }
      .boundary-word--light {
        color: #fff;
      }
      .boundary-alt {
        font-style: italic;
        font-weight: 300;
      }

      /* ═══ TRAVELING LINE ═══ */
      .traveling-line {
        position: fixed;
        top: 0;
        left: 50%;
        width: 1px;
        height: 100vh;
        background: linear-gradient(
          to bottom,
          transparent 0%,
          rgba(255, 255, 255, 0.08) 30%,
          rgba(255, 255, 255, 0.08) 70%,
          transparent 100%
        );
        z-index: 0;
        pointer-events: none;
        opacity: 0;
        mix-blend-mode: difference;
      }
      .traveling-dot {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: #fff;
        transform: translate(-50%, -50%);
        mix-blend-mode: difference;
        opacity: 0.6;
      }
    `,
  ],
})
export class HomeComponent implements AfterViewInit, OnDestroy {
  private readonly el = inject(ElementRef);
  readonly workService = inject(WorkService);
  private scrollTriggers: ScrollTrigger[] = [];

  ngAfterViewInit(): void {
    requestAnimationFrame(() => {
      setTimeout(() => this.initTransitions(), 200);
    });
  }

  private initTransitions(): void {
    const host = this.el.nativeElement as HTMLElement;

    // ─── 1. HERO SCALE-DOWN (zooms out as you scroll past) ───
    const heroPin = host.querySelector('[data-pin-hero]') as HTMLElement;
    if (heroPin) {
      const heroSection = heroPin.querySelector('[data-hero-section]') as HTMLElement;
      if (heroSection) {
        const st = ScrollTrigger.create({
          trigger: heroPin,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.3,
          onUpdate: (self) => {
            const p = self.progress;
            const scale = 1 - p * 0.06; // 1 → 0.94
            const radius = p * 16; // 0 → 16px
            const brightness = 1 - p * 0.3; // 1 → 0.7
            heroSection.style.transform = `scale(${scale})`;
            heroSection.style.borderRadius = `${radius}px`;
            heroSection.style.filter = `brightness(${brightness})`;
          },
        });
        this.scrollTriggers.push(st);
      }
    }

    // ─── 2. WORK CLIP-PATH REVEAL (dark → white wipe) ───
    const clipWork = host.querySelector('[data-clip-work]') as HTMLElement;
    if (clipWork) {
      const st = ScrollTrigger.create({
        trigger: clipWork,
        start: 'top 95%',
        end: 'top 20%',
        scrub: 0.4,
        onUpdate: (self) => {
          const p = self.progress;
          // Start with rounded inset, expand to full
          const insetY = (1 - p) * 8; // 8% → 0%
          const insetX = (1 - p) * 4; // 4% → 0%
          const radius = (1 - p) * 1.2; // 1.2rem → 0
          clipWork.style.clipPath = `inset(${insetY}% ${insetX}% ${insetY}% ${insetX}% round ${radius}rem)`;
        },
      });
      this.scrollTriggers.push(st);
    }

    // ─── 3. ABOUT CLIP-PATH REVEAL (white → dark wipe) ───
    const clipAbout = host.querySelector('[data-clip-about]') as HTMLElement;
    if (clipAbout) {
      const st = ScrollTrigger.create({
        trigger: clipAbout,
        start: 'top 95%',
        end: 'top 20%',
        scrub: 0.4,
        onUpdate: (self) => {
          const p = self.progress;
          const insetY = (1 - p) * 8;
          const insetX = (1 - p) * 4;
          const radius = (1 - p) * 1.2;
          clipAbout.style.clipPath = `inset(${insetY}% ${insetX}% ${insetY}% ${insetX}% round ${radius}rem)`;
        },
      });
      this.scrollTriggers.push(st);
    }

    // ─── 4. WORK SECTION SCALE-DOWN (recedes as about comes) ───
    const workSection = host.querySelector('[data-section-work]') as HTMLElement;
    if (workSection && clipAbout) {
      const st = ScrollTrigger.create({
        trigger: clipAbout,
        start: 'top 100%',
        end: 'top 30%',
        scrub: 0.3,
        onUpdate: (self) => {
          const p = self.progress;
          const scale = 1 - p * 0.05;
          const radius = p * 12;
          const brightness = 1 - p * 0.25;
          workSection.style.transform = `scale(${scale})`;
          workSection.style.borderRadius = `${radius}px`;
          workSection.style.filter = `brightness(${brightness})`;
        },
      });
      this.scrollTriggers.push(st);
    }

    // ─── 5. BOUNDARY TEXT ANIMATIONS ───
    const boundaryWork = host.querySelector('[data-boundary-work] .boundary-word') as HTMLElement;
    if (boundaryWork) {
      const parent = boundaryWork.parentElement!;
      // Expand height, reveal & slide text
      gsap.to(parent, {
        height: 'clamp(6rem, 20vw, 18rem)',
        scrollTrigger: {
          trigger: parent,
          start: 'top 90%',
          end: 'top 50%',
          scrub: 0.4,
        },
      });
      const tween = gsap.to(boundaryWork, {
        opacity: 1,
        y: 0,
        scrollTrigger: {
          trigger: parent,
          start: 'top 85%',
          end: 'top 45%',
          scrub: 0.5,
        },
      });
      if (tween.scrollTrigger) this.scrollTriggers.push(tween.scrollTrigger);

      // Fade out as you scroll past
      const fadeOut = gsap.to(boundaryWork, {
        opacity: 0,
        y: -30,
        scrollTrigger: {
          trigger: parent,
          start: 'top 30%',
          end: 'top 5%',
          scrub: 0.3,
        },
      });
      if (fadeOut.scrollTrigger) this.scrollTriggers.push(fadeOut.scrollTrigger);
    }

    const boundaryAbout = host.querySelector('[data-boundary-about] .boundary-word') as HTMLElement;
    if (boundaryAbout) {
      const parent = boundaryAbout.parentElement!;
      gsap.to(parent, {
        height: 'clamp(6rem, 20vw, 18rem)',
        scrollTrigger: {
          trigger: parent,
          start: 'top 90%',
          end: 'top 50%',
          scrub: 0.4,
        },
      });
      const tween = gsap.to(boundaryAbout, {
        opacity: 1,
        y: 0,
        scrollTrigger: {
          trigger: parent,
          start: 'top 85%',
          end: 'top 45%',
          scrub: 0.5,
        },
      });
      if (tween.scrollTrigger) this.scrollTriggers.push(tween.scrollTrigger);

      const fadeOut = gsap.to(boundaryAbout, {
        opacity: 0,
        y: -30,
        scrollTrigger: {
          trigger: parent,
          start: 'top 30%',
          end: 'top 5%',
          scrub: 0.3,
        },
      });
      if (fadeOut.scrollTrigger) this.scrollTriggers.push(fadeOut.scrollTrigger);
    }

    // ─── 6. MARQUEE DIVIDERS — fade-in reveal ───
    host.querySelectorAll('[data-divider-1], [data-divider-2], [data-divider-3]').forEach((div) => {
      const tween = gsap.from(div, {
        opacity: 0,
        y: 20,
        scrollTrigger: {
          trigger: div,
          start: 'top 95%',
          end: 'top 70%',
          scrub: 0.4,
        },
      });
      if (tween.scrollTrigger) this.scrollTriggers.push(tween.scrollTrigger);
    });

    // ─── 7. TRAVELING LINE — appears after hero, tracks with scroll ───
    const travelLine = host.querySelector('[data-traveling-line]') as HTMLElement;
    const travelDot = host.querySelector('[data-traveling-dot]') as HTMLElement;
    if (travelLine && travelDot) {
      // Fade in after hero
      const lineIn = gsap.to(travelLine, {
        opacity: 1,
        scrollTrigger: {
          trigger: host,
          start: '500px top',
          end: '800px top',
          scrub: 0.5,
        },
      });
      if (lineIn.scrollTrigger) this.scrollTriggers.push(lineIn.scrollTrigger);

      // Dot moves up and down within the line based on scroll velocity
      const dotSt = ScrollTrigger.create({
        trigger: host,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.2,
        onUpdate: (self) => {
          // Map scroll progress to dot y position
          const dotY = 10 + self.progress * 80; // 10% → 90%
          travelDot.style.top = `${dotY}%`;
        },
      });
      this.scrollTriggers.push(dotSt);

      // Fade out near footer
      const lineOut = gsap.to(travelLine, {
        opacity: 0,
        scrollTrigger: {
          trigger: host,
          start: 'bottom 200%',
          end: 'bottom 120%',
          scrub: 0.5,
        },
      });
      if (lineOut.scrollTrigger) this.scrollTriggers.push(lineOut.scrollTrigger);
    }

    // ─── 8. PARALLAX SPEED DIFFERENCES ───
    // Hero content already has faster parallax in hero.ts
    // About section: slightly slower scroll speed (content drifts up slower)
    const aboutInner = host.querySelector('[data-about-section] .about-inner') as HTMLElement;
    if (aboutInner) {
      const tween = gsap.to(aboutInner, {
        y: -40,
        ease: 'none',
        scrollTrigger: {
          trigger: aboutInner.closest('[data-about-section]') || aboutInner,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.8, // higher scrub = laggier = slower feel
        },
      });
      if (tween.scrollTrigger) this.scrollTriggers.push(tween.scrollTrigger);
    }

    ScrollTrigger.refresh();
  }

  ngOnDestroy(): void {
    this.scrollTriggers.forEach((st) => st.kill());
    this.scrollTriggers = [];
  }
}
