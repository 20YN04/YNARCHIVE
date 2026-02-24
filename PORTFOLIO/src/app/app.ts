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
    <!-- Preloader — slide-clock letters on black overlay -->
    <app-preloader />

    <!-- THICK BORDER BARS — frame the viewport, shrink to thin 1px lines -->
    <div class="fixed inset-0 z-[90] pointer-events-none" data-frame-container>
      <div class="bar-top" data-bar-top></div>
      <div class="bar-bottom" data-bar-bottom></div>
      <div class="bar-left" data-bar-left></div>
      <div class="bar-right" data-bar-right></div>
    </div>

    <!-- ARCHITECTURAL GRID — thin vertical column guides (5 lines = 6 cols) -->
    <div class="fixed inset-0 z-[85] pointer-events-none" data-grid-container>
      <div class="grid-line-v" style="left:16.666%" data-grid-line></div>
      <div class="grid-line-v" style="left:33.333%" data-grid-line></div>
      <div class="grid-line-v" style="left:50%" data-grid-line></div>
      <div class="grid-line-v" style="left:66.666%" data-grid-line></div>
      <div class="grid-line-v" style="left:83.333%" data-grid-line></div>
    </div>

    <!-- Main content -->
    <app-hero />
    <app-layout>
      <app-project-grid />
    </app-layout>

    <!-- Footer -->
    <section class="footer-section" data-footer-section>
      <div class="footer-inner" data-footer-inner>
        <span class="footer-label">YNARCHIVE</span>
        <span class="footer-year">&copy; 2025</span>
      </div>
    </section>
  `,
  styleUrl: './app.css'
})
export class App implements AfterViewInit, OnDestroy {
  private timeline?: gsap.core.Timeline;

  ngAfterViewInit(): void {
    document.body.style.overflow = 'hidden';
    setTimeout(() => this.initAnimations(), 200);
  }

  private initAnimations(): void {
    // ── Query elements ──
    const preloader = document.querySelector('[data-preloader]') as HTMLElement;
    const letters = document.querySelectorAll('[data-letter]');

    const barTop = document.querySelector('[data-bar-top]') as HTMLElement;
    const barBottom = document.querySelector('[data-bar-bottom]') as HTMLElement;
    const barLeft = document.querySelector('[data-bar-left]') as HTMLElement;
    const barRight = document.querySelector('[data-bar-right]') as HTMLElement;

    const gridLines = document.querySelectorAll('[data-grid-line]');

    const navBar = document.querySelector('[data-nav-bar]') as HTMLElement;
    const megaTitle = document.querySelector('[data-hero-mega-title]') as HTMLElement;
    const megaTitleText = document.querySelector('[data-hero-mega-text]') as HTMLElement;
    const titleLines = document.querySelectorAll('[data-hero-title-line]');
    const heroImage = document.querySelector('[data-hero-image]') as HTMLElement;
    const heroImg = document.querySelector('[data-hero-img]') as HTMLElement;
    const heroBottom = document.querySelector('[data-hero-bottom]') as HTMLElement;
    const scrollHint = document.querySelector('[data-scroll-hint]') as HTMLElement;

    const footerSection = document.querySelector('[data-footer-section]');

    if (!preloader || letters.length === 0) {
      console.error('Missing critical animation elements');
      if (preloader) preloader.style.display = 'none';
      document.body.style.overflow = '';
      return;
    }

    // ══════════════════════════════════════════════
    // INITIAL STATES
    // ══════════════════════════════════════════════

    // Letters start below their masks
    gsap.set(letters, { y: '110%' });

    // Thick bars — visible at full thickness
    gsap.set(barTop, { height: 40 });
    gsap.set(barBottom, { height: 40 });
    gsap.set(barLeft, { width: 40 });
    gsap.set(barRight, { width: 40 });

    // Grid lines — invisible, will draw in after bars shrink
    gsap.set(gridLines, { scaleY: 0, transformOrigin: 'top' });

    // Hero elements — hidden
    // Nav starts completely hidden (CSS handles initial opacity:0 + pointer-events:none)
    if (megaTitle) gsap.set(megaTitle, { opacity: 0 });
    if (megaTitleText) gsap.set(megaTitleText, { y: '110%' });
    gsap.set(titleLines, { y: '110%' });
    if (heroImage) gsap.set(heroImage, { clipPath: 'inset(100% 0 0 0)' });
    if (heroImg) gsap.set(heroImg, { scale: 1.1, y: '5%' });
    if (heroBottom) gsap.set(heroBottom, { opacity: 0, y: 25 });
    if (scrollHint) gsap.set(scrollHint, { opacity: 0 });

    // ══════════════════════════════════════════════
    // MASTER TIMELINE
    // ══════════════════════════════════════════════
    this.timeline = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = '';
        preloader.style.display = 'none';
      }
    });
    const tl = this.timeline;

    // ─── ACT 1: SLIDE-CLOCK LETTERS (0s → 2.6s) ───
    // Letters slide up into view with stagger
    tl.to(letters, {
      y: '0%',
      duration: 0.9,
      ease: 'power4.out',
      stagger: { each: 0.06, from: 'start' },
    }, 0.3);

    // Hold for a beat, then letters slide up and out
    tl.to(letters, {
      y: '-110%',
      duration: 0.6,
      ease: 'power3.in',
      stagger: { each: 0.04, from: 'end' },
    }, 2.0);

    // Preloader background wipes up
    tl.to(preloader, {
      clipPath: 'inset(0 0 100% 0)',
      duration: 0.9,
      ease: 'power4.inOut',
    }, 2.4);

    // ─── ACT 2: THICK BARS → THIN LINES (2.6s → 3.8s) ───
    // Side bars shrink from 40px to 1px
    tl.to([barLeft, barRight], {
      width: 1,
      duration: 1.0,
      ease: 'power3.inOut',
    }, 2.8);

    // Bottom bar shrinks
    tl.to(barBottom, {
      height: 1,
      duration: 1.0,
      ease: 'power3.inOut',
    }, 2.8);

    // Top bar shrinks to 0 (nav takes over)
    tl.to(barTop, {
      height: 0,
      duration: 1.0,
      ease: 'power3.inOut',
    }, 2.8);

    // Grid lines draw in from top
    tl.to(gridLines, {
      scaleY: 1,
      duration: 1.2,
      ease: 'power3.out',
      stagger: { each: 0.06, from: 'center' },
    }, 3.0);

    // ─── ACT 3: HERO REVEAL (3.2s → 5.0s) ───
    // NOTE: Nav stays hidden — it only appears via ScrollTrigger when mega title scrolls out

    // Mega title reveals (this is the top element the user sees after preloader)
    if (megaTitle) {
      tl.to(megaTitle, {
        opacity: 1, duration: 0.6, ease: 'power2.out',
      }, 3.4);
    }
    if (megaTitleText) {
      tl.to(megaTitleText, {
        y: '0%', duration: 1.0, ease: 'power4.out',
      }, 3.5);
    }

    // Title lines stagger reveal (each line slides up from its mask)
    tl.to(titleLines, {
      y: '0%',
      duration: 1.0,
      ease: 'power4.out',
      stagger: 0.15,
    }, 3.6);

    // Hero image parallax mask reveal
    if (heroImage) {
      tl.to(heroImage, {
        clipPath: 'inset(0% 0 0 0)',
        duration: 1.4,
        ease: 'power4.inOut',
      }, 3.8);
    }

    // Image scale settles and counter-translates
    if (heroImg) {
      tl.to(heroImg, {
        scale: 1.0, y: '0%', duration: 2.0, ease: 'power2.out',
      }, 4.0);
    }

    // Bottom info
    if (heroBottom) {
      tl.to(heroBottom, {
        opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
      }, 4.4);
    }

    if (scrollHint) {
      tl.to(scrollHint, {
        opacity: 1, duration: 0.6, ease: 'power2.out',
      }, 4.8);
    }

    // ══════════════════════════════════════════════
    // SCROLL-TRIGGERED INTERACTIONS
    // ══════════════════════════════════════════════

    // Thin bars + grid lines fade out on scroll
    gsap.to([barTop, barBottom, barLeft, barRight], {
      scrollTrigger: {
        trigger: 'body',
        start: '60px top',
        end: '400px top',
        scrub: 0.5,
      },
      opacity: 0,
    });

    gsap.to(Array.from(gridLines), {
      scrollTrigger: {
        trigger: 'body',
        start: '100px top',
        end: '500px top',
        scrub: 0.8,
      },
      opacity: 0,
    });

    // Mega title compresses on scroll — text shrinks & fades
    if (megaTitle && megaTitleText) {
      gsap.to(megaTitleText, {
        scrollTrigger: {
          trigger: megaTitle,
          start: 'top 60px',
          end: 'center 60px',
          scrub: 0.3,
        },
        scale: 0.15,
        opacity: 0,
        ease: 'none',
      });

      // Mega title height collapses
      gsap.to(megaTitle, {
        scrollTrigger: {
          trigger: megaTitle,
          start: 'top 60px',
          end: 'bottom 60px',
          scrub: 0.4,
        },
        height: 0,
        ease: 'none',
      });

      // Nav appears exactly when mega title finishes collapsing
      if (navBar) {
        ScrollTrigger.create({
          trigger: megaTitle,
          start: 'center 60px',
          onEnter: () => navBar.classList.add('nav-visible'),
          onLeaveBack: () => navBar.classList.remove('nav-visible'),
        });

        // Nav switches to white once mega title is fully gone
        ScrollTrigger.create({
          trigger: megaTitle,
          start: 'bottom 60px',
          onEnter: () => navBar.classList.add('nav-scrolled'),
          onLeaveBack: () => navBar.classList.remove('nav-scrolled'),
        });
      }
    }

    // Hero image parallax — counter-movement for depth
    if (heroImg && heroImage) {
      gsap.to(heroImg, {
        scrollTrigger: {
          trigger: heroImage,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
        y: -80,
        ease: 'none',
      });
    }

    // Project images — parallax on scroll
    const projectImages = document.querySelectorAll('[data-project-image]');
    projectImages.forEach((img) => {
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

    // Project cards — staggered fade-in
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
        y: 50,
      });
    });

    // Footer reveal
    if (footerSection) {
      gsap.from(footerSection, {
        scrollTrigger: {
          trigger: footerSection,
          start: 'top 95%',
          end: 'top 50%',
          scrub: 0.5,
        },
        opacity: 0,
        y: 30,
      });
    }
  }

  ngOnDestroy(): void {
    ScrollTrigger.getAll().forEach(t => t.kill());
    this.timeline?.kill();
    document.body.style.overflow = '';
  }
}
