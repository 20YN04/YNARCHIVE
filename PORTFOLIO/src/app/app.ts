import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { HeroComponent } from './hero/hero';
import { ProjectGridComponent } from './components/project-grid/project-grid';
import { LayoutComponent } from './components/layout/layout';
import { PreloaderComponent } from './components/preloader/preloader.component';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-root',
  imports: [HeroComponent, LayoutComponent, PreloaderComponent, ProjectGridComponent],
  template: `
    <!-- Preloader -->
    <app-preloader />

    <!-- 1. CURTAIN PANELS — 5 vertical white panels that shrink away (scaleY) -->
    <div class="fixed inset-0 z-[95] pointer-events-none" data-curtain-container>
      <div class="curtain-panel" style="left:0;width:20%" data-curtain-panel></div>
      <div class="curtain-panel" style="left:20%;width:20%" data-curtain-panel></div>
      <div class="curtain-panel" style="left:40%;width:20%" data-curtain-panel></div>
      <div class="curtain-panel" style="left:60%;width:20%" data-curtain-panel></div>
      <div class="curtain-panel" style="left:80%;width:20%" data-curtain-panel></div>
    </div>

    <!-- 2. ARCHITECTURAL GRID — thin skeleton lines that persist then fade -->
    <div class="fixed inset-0 z-[85] pointer-events-none" data-grid-container>
      <!-- Vertical column lines (6-col grid at ~16.66% intervals) -->
      <div class="grid-line-v" style="left:16.666%" data-grid-line></div>
      <div class="grid-line-v" style="left:33.333%" data-grid-line></div>
      <div class="grid-line-v" style="left:50%" data-grid-line></div>
      <div class="grid-line-v" style="left:66.666%" data-grid-line></div>
      <div class="grid-line-v" style="left:83.333%" data-grid-line></div>
      <!-- Outer frame border -->
      <div class="grid-border-top" data-grid-border></div>
      <div class="grid-border-bottom" data-grid-border></div>
      <div class="grid-border-left" data-grid-border></div>
      <div class="grid-border-right" data-grid-border></div>
    </div>

    <app-hero />
    <app-layout>
      <app-project-grid />
    </app-layout>

    <!-- 5. FOOTER TRANSITION — closing frame section -->
    <section class="footer-transition" data-footer-section>
      <div class="footer-inner" data-footer-inner>
        <span class="footer-label">YNARCHIVE</span>
        <span class="footer-year">© 2026</span>
      </div>
    </section>
  `,
  styleUrl: './app.css'
})
export class App implements AfterViewInit, OnDestroy {
  private timeline?: gsap.core.Timeline;

  ngAfterViewInit(): void {
    document.body.style.overflow = 'hidden';
    setTimeout(() => this.initAnimations(), 150);
  }

  private initAnimations(): void {
    // ── Query all elements ──
    const preloader = document.querySelector('[data-preloader]') as HTMLElement;
    const counter = document.querySelector('[data-preloader-counter]') as HTMLElement;
    const preloaderLeft = document.querySelector('[data-preloader-left]');
    const preloaderRight = document.querySelector('[data-preloader-right]');
    const preloaderBottom = document.querySelector('[data-preloader-bottom]');
    const preloaderTitle = document.querySelector('[data-preloader-title]');

    const curtainPanels = document.querySelectorAll('[data-curtain-panel]');
    const gridLines = document.querySelectorAll('[data-grid-line]');
    const gridBorders = document.querySelectorAll('[data-grid-border]');

    const heroTitle = document.querySelector('[data-hero-title]');
    const heroTitleWrapper = document.querySelector('[data-hero-title-mask]');
    const navBar = document.querySelector('[data-nav-bar]');
    const heroImage = document.querySelector('[data-hero-image]');
    const heroImg = document.querySelector('[data-hero-img]');
    const heroBottom = document.querySelector('[data-hero-bottom]');

    const footerSection = document.querySelector('[data-footer-section]');
    const footerInner = document.querySelector('[data-footer-inner]');

    if (!preloader || !counter || !heroTitle || !navBar || !heroImage) {
      console.error('Missing animation elements');
      if (preloader) preloader.style.display = 'none';
      document.body.style.overflow = '';
      return;
    }

    // ══════════════════════════════════════════════
    // INITIAL STATES
    // ══════════════════════════════════════════════

    // Preloader content
    gsap.set([preloaderLeft, preloaderRight], { opacity: 0, y: 15 });
    gsap.set(preloaderBottom, { opacity: 0, y: 20 });
    gsap.set(preloaderTitle, { opacity: 0, scale: 0.95 });

    // Curtain panels — fully visible initially (cover everything)
    gsap.set(curtainPanels, { scaleY: 1, transformOrigin: 'top' });

    // Grid lines — invisible, will draw from top
    gsap.set(gridLines, { scaleY: 0, transformOrigin: 'top' });
    // Grid borders — invisible
    gsap.set(gridBorders, { opacity: 0 });

    // Hero elements hidden
    gsap.set(heroTitle, { yPercent: 110 });
    gsap.set(navBar, { opacity: 0, y: -20 });
    gsap.set(heroImage, { clipPath: 'inset(100% 0 0 0)' });
    gsap.set(heroImg, { scale: 1.3 });
    gsap.set(heroBottom, { opacity: 0, y: 25 });

    // ══════════════════════════════════════════════
    // MASTER TIMELINE
    // ══════════════════════════════════════════════
    this.timeline = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = '';
        preloader.style.display = 'none';
        // Remove curtain container once done
        const curtainContainer = document.querySelector('[data-curtain-container]');
        if (curtainContainer) (curtainContainer as HTMLElement).style.display = 'none';
      }
    });
    const tl = this.timeline;

    // ─── ACT 1: PRELOADER (0s - 3.3s) ───
    // Content fades in
    tl.to([preloaderLeft, preloaderRight], {
      opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.1,
    }, 0.3);

    tl.to(preloaderBottom, {
      opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
    }, 0.5);

    tl.to(preloaderTitle, {
      opacity: 1, scale: 1, duration: 1.5, ease: 'power2.out',
    }, 0.3);

    // Counter 0% → 100%
    const counterObj = { value: 0 };
    tl.to(counterObj, {
      value: 100, duration: 2.8, ease: 'power2.inOut',
      onUpdate: () => { counter.textContent = `${Math.round(counterObj.value)}%`; }
    }, 0.5);

    // Fade preloader content out
    tl.to([preloaderLeft, preloaderRight, preloaderBottom, preloaderTitle], {
      opacity: 0, y: -10, duration: 0.4, ease: 'power2.in',
    }, 3.0);

    // Preloader wipes up
    tl.to(preloader, {
      clipPath: 'inset(0 0 100% 0)', duration: 1.0, ease: 'power4.inOut',
    }, 3.3);

    // ─── ACT 2: CURTAIN REVEAL — staggered scaleY(0) (3.3s - 4.6s) ───
    // The white panels shrink from bottom up with rhythmic stagger
    tl.to(curtainPanels, {
      scaleY: 0,
      transformOrigin: 'bottom',
      duration: 0.8,
      ease: 'power3.inOut',
      stagger: {
        each: 0.1,
        from: 'center', // panels retract from center outward
      },
    }, 3.6);

    // ─── ACT 3: ARCHITECTURAL GRID — lines draw in (3.8s - 4.8s) ───
    // Vertical lines draw from top to bottom
    tl.to(gridLines, {
      scaleY: 1,
      duration: 1.2,
      ease: 'power3.out',
      stagger: { each: 0.08, from: 'center' },
    }, 3.8);

    // Border frame appears
    tl.to(gridBorders, {
      opacity: 1,
      duration: 0.8,
      ease: 'power2.out',
      stagger: 0.05,
    }, 4.0);

    // ─── ACT 4: HERO REVEAL (4.0s - 5.6s) ───
    // Title slides up from overflow-hidden mask
    tl.to(heroTitle, {
      yPercent: 0, duration: 1.1, ease: 'power4.out',
    }, 4.2);

    // Nav bar
    tl.to(navBar, {
      y: 0, opacity: 1, duration: 0.9, ease: 'power3.out',
    }, 4.4);

    // Hero image clip-path reveal (wipe up)
    tl.to(heroImage, {
      clipPath: 'inset(0 0 0% 0)', duration: 1.4, ease: 'power4.inOut',
    }, 4.4);

    // Image zooms down from 1.3 → 1
    tl.to(heroImg, {
      scale: 1, duration: 2.0, ease: 'power2.out',
    }, 4.6);

    // Bottom info
    tl.to(heroBottom, {
      opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
    }, 5.0);

    // ══════════════════════════════════════════════
    // SCROLL-DRIVEN INTERACTIONS
    // ══════════════════════════════════════════════

    // 3a. Grid borders fade out on scroll (the "cage" opens up)
    gsap.to(Array.from(gridBorders), {
      scrollTrigger: {
        trigger: 'body',
        start: '50px top',
        end: '350px top',
        scrub: 0.6,
      },
      opacity: 0,
    });

    // 3b. Grid lines smoothly fade out on scroll
    gsap.to(Array.from(gridLines), {
      scrollTrigger: {
        trigger: 'body',
        start: '100px top',
        end: '500px top',
        scrub: 0.8,
      },
      opacity: 0,
    });

    // 3c. Hero title wrapper (black box) scrolls away
    if (heroTitleWrapper) {
      gsap.to(heroTitleWrapper, {
        scrollTrigger: {
          trigger: heroTitleWrapper,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.5,
        },
        y: -80,
        opacity: 0,
        ease: 'none',
      });
    }

    // 3d. Hero image parallax — counter-movement for depth
    if (heroImg) {
      gsap.to(heroImg, {
        scrollTrigger: {
          trigger: heroImage,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
        y: 100,
        ease: 'none',
      });
    }

    // 4. Project images — staggered reveal on scroll + parallax
    const projectImages = document.querySelectorAll('[data-project-image]');
    projectImages.forEach((img) => {
      // Parallax
      gsap.to(img, {
        scrollTrigger: {
          trigger: img.parentElement,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
        y: -60,
        ease: 'none',
      });
    });

    // 4b. Project cards fade-in on scroll
    const projectCards = document.querySelectorAll('[data-project-card]');
    projectCards.forEach((card) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top 90%',
          end: 'top 60%',
          scrub: 0.5,
        },
        opacity: 0,
        y: 60,
      });
    });

    // 5. Footer transition — grid lines re-form as thick border
    if (footerSection) {
      gsap.from(footerSection, {
        scrollTrigger: {
          trigger: footerSection,
          start: 'top 95%',
          end: 'top 50%',
          scrub: 0.5,
        },
        opacity: 0,
        y: 40,
      });
    }
  }

  ngOnDestroy(): void {
    ScrollTrigger.getAll().forEach(t => t.kill());
    this.timeline?.kill();
    document.body.style.overflow = '';
  }
}
