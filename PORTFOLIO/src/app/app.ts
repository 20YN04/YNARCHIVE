import { AfterViewInit, Component, inject, OnDestroy, ViewChild, ViewContainerRef } from '@angular/core';
import { HomeComponent } from './pages/home/home';
import { PreloaderComponent } from './components/preloader/preloader.component';
import { FloatingCtaComponent } from './components/floating-cta/floating-cta.component';
import { LenisService } from './core/lenis.service';
import { LoadingProgressService } from './core/loading-progress.service';
import { registerPortfolioEffects } from './core/gsap-effects';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
registerPortfolioEffects();

@Component({
  selector: 'app-root',
  imports: [PreloaderComponent, FloatingCtaComponent],
  template: `
    <!-- Preloader — slide-clock letters on black overlay -->
    <app-preloader />

    <!-- THICK BORDER BARS — frame the viewport, shrink to thin 1px lines -->
    <div class="fixed inset-0 z-90 pointer-events-none" data-frame-container>
      <div class="bar-top" data-bar-top></div>
      <div class="bar-bottom" data-bar-bottom></div>
      <div class="bar-left" data-bar-left></div>
      <div class="bar-right" data-bar-right></div>
    </div>

    <!-- ARCHITECTURAL GRID — thin vertical column guides (5 lines = 6 cols) -->
    <div class="fixed inset-0 z-85 pointer-events-none" data-grid-container>
      <div class="grid-line-v" style="left:16.666%" data-grid-line></div>
      <div class="grid-line-v" style="left:33.333%" data-grid-line></div>
      <div class="grid-line-v" style="left:50%" data-grid-line></div>
      <div class="grid-line-v" style="left:66.666%" data-grid-line></div>
      <div class="grid-line-v" style="left:83.333%" data-grid-line></div>
    </div>

    <!-- Main content rendered into the page container -->
    <div id="page-root">
      <ng-template #pageContainer></ng-template>
    </div>

    <!-- Floating CTA: label/link update by section (View Work → Next Project → Get in touch) -->
    <app-floating-cta />

    <!-- Footer -->
    <section class="footer-section" data-footer-section>
      <div class="footer-inner" data-footer-inner>
        <a href="#hero" data-scroll-link class="footer-brand">YNARCHIVE</a>
        <div class="footer-links">
          <a href="#hero" data-scroll-link class="footer-link">Home</a>
          <a href="#work" data-scroll-link class="footer-link">Work</a>
          <a href="#about" data-scroll-link class="footer-link">About</a>
          <a href="#contact" data-scroll-link class="footer-link">Contact</a>
        </div>
        <span class="footer-year">&copy; 2026</span>
      </div>
    </section>
  `,
  styleUrl: './app.css'
})
export class App implements AfterViewInit, OnDestroy {
  private timeline?: gsap.core.Timeline;
  private navClickHandler?: (event: Event) => void;
  @ViewChild('pageContainer', { read: ViewContainerRef, static: true }) pageContainer!: ViewContainerRef;
  private lenis = inject(LenisService);
  private loadingProgress = inject(LoadingProgressService);

  ngAfterViewInit(): void {
    if (typeof history !== 'undefined' && history.scrollRestoration) {
      history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
    document.body.style.overflow = 'hidden';
    setTimeout(() => this.initAnimations(), 200);
  }

  private initAnimations(): void {
    // ── Scroll-to-section helper ──
    const scrollToSection = (id: string) => {
      const target = document.getElementById(id);
      if (!target) return;
      const navBar = document.querySelector('[data-nav-bar]') as HTMLElement | null;
      const navHeight = navBar ? navBar.offsetHeight : 64;
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 8;
      window.scrollTo({ top, behavior: 'smooth' });
    };

    // ── Render the one-page home ──
    this.pageContainer.clear();
    this.pageContainer.createComponent(HomeComponent);
    history.replaceState({}, '', '/');
    window.scrollTo(0, 0);
    requestAnimationFrame(() => window.scrollTo(0, 0));

    // ── Nav handoff: nav fades in as user scrolls past hero ──
    const registerHomeHandoff = () => {
      const nav = document.querySelector('[data-nav-bar]') as HTMLElement | null;
      const heroSection = document.querySelector('[data-hero-section]') as HTMLElement | null;
      if (!nav || !heroSection) return;

      const existing = ScrollTrigger.getById('home-nav-handoff');
      if (existing) existing.kill();

      gsap.set(nav, { opacity: 0, y: -10 });
      nav.style.pointerEvents = 'none';

      ScrollTrigger.create({
        id: 'home-nav-handoff',
        trigger: heroSection,
        start: 'top top',
        end: '+=400',
        onUpdate: (self) => {
          const progress = self.progress;
          const reveal = progress < 0.2 ? 0 : Math.min(1, (progress - 0.2) / 0.8);
          gsap.set(nav, { opacity: reveal, y: -10 + reveal * 10 });
          nav.style.pointerEvents = progress > 0.7 ? 'auto' : 'none';
          // Add solid background once past hero
          if (progress > 0.5) {
            nav.classList.add('hero-nav-solid');
          } else {
            nav.classList.remove('hero-nav-solid');
          }
        },
      });
    };

    // ── Delegated click handler for scroll-to-section links ──
    this.navClickHandler = (event: Event) => {
      const target = event.target as HTMLElement | null;
      const link = target?.closest('[data-scroll-link]') as HTMLAnchorElement | null;
      if (!link) return;

      const href = link.getAttribute('href') || '';
      if (href.startsWith('#')) {
        event.preventDefault();
        const id = href.slice(1);
        if (id === 'hero') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          scrollToSection(id);
        }
      }
    };
    document.addEventListener('click', this.navClickHandler);

    // ── Query elements ──
    const preloader = document.querySelector('[data-preloader]') as HTMLElement;
    const preloaderLoading = document.querySelector('[data-preloader-loading]') as HTMLElement;
    const letters = document.querySelectorAll('[data-letter]');
    const preloaderInfos = document.querySelectorAll('[data-preloader-info]');

    const barTop = document.querySelector('[data-bar-top]') as HTMLElement;
    const barBottom = document.querySelector('[data-bar-bottom]') as HTMLElement;
    const barLeft = document.querySelector('[data-bar-left]') as HTMLElement;
    const barRight = document.querySelector('[data-bar-right]') as HTMLElement;

    const gridLines = document.querySelectorAll('[data-grid-line]');

    const footerSection = document.querySelector('[data-footer-section]');

    if (!preloader || letters.length === 0) {
      if (preloader) preloader.style.display = 'none';
      document.body.style.overflow = '';
      this.lenis.start();
      return;
    }

    // ══════════════════════════════════════════════
    // INITIAL STATES
    // ══════════════════════════════════════════════

    // Letters start below their masks
    gsap.set(letters, { y: '110%' });
    if (preloaderLoading) gsap.set(preloaderLoading, { opacity: 0 });
    const progressProxy = { value: 0 };

    // Thick bars — visible at full thickness
    gsap.set(barTop, { height: 40 });
    gsap.set(barBottom, { height: 40 });
    gsap.set(barLeft, { width: 40 });
    gsap.set(barRight, { width: 40 });

    // Grid lines — invisible, will draw in after bars shrink
    gsap.set(gridLines, { scaleY: 0, transformOrigin: 'top' });

    // Hero animations are handled by the HeroComponent itself

    // ══════════════════════════════════════════════
    // MASTER TIMELINE
    // ══════════════════════════════════════════════
    this.timeline = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = '';
        preloader.style.display = 'none';
        this.lenis.start();
        registerHomeHandoff();
        ScrollTrigger.refresh();
      }
    });
    const tl = this.timeline;

    // Loading % (0→100) only while preloader is visible; ends when compress starts
    const preloaderVisibleDuration = 3.35;
    tl.to(progressProxy, {
      value: 100,
      duration: preloaderVisibleDuration,
      ease: 'none',
      onUpdate: () => this.loadingProgress.setProgress(progressProxy.value),
    }, 0);
    if (preloaderLoading) {
      tl.to(preloaderLoading, { opacity: 1, duration: 0.35, ease: 'power2.out' }, 0);
      tl.to(preloaderLoading, { opacity: 0, duration: 0.25, ease: 'power2.in' }, 1.85);
    }

    // ─── ACT 1: SLIDE-CLOCK LETTERS (YNARCHIVE) ───
    tl.to(preloaderInfos, {
      opacity: 1, duration: 0.8, ease: 'power2.out', stagger: 0.1,
    }, 0.2);

    tl.to(letters, {
      y: '0%',
      duration: 0.9,
      ease: 'power4.out',
      stagger: { each: 0.06, from: 'start' },
    }, 0.3);

    tl.to(preloaderInfos, { opacity: 0, duration: 0.3, ease: 'power2.in' }, 1.8);

    tl.to(letters, {
      y: '-110%',
      duration: 0.6,
      ease: 'power3.in',
      stagger: { each: 0.04, from: 'end' },
    }, 2.0);

    // Preloader fades out after letter animation
    const compressStart = 2.4;
    tl.to(preloader, {
      opacity: 0,
      duration: 0.6,
      ease: 'power2.inOut',
    }, compressStart);

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

    // ─── ACT 3: HERO ───
    // Hero reveal is handled by HeroComponent's own GSAP timeline.
    // The preloader fades out above, revealing the hero underneath.

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

    // It's always the home page now, so register handoff immediately

    // ─── Scroll-driven color shifts ───
    // Animate the body + navbar color as sections come into view
    const pageRoot = document.getElementById('page-root');
    const navBar = document.querySelector('[data-nav-bar]') as HTMLElement | null;

    if (pageRoot) {
      // Hero is dark, so page root starts dark
      gsap.set(pageRoot, { backgroundColor: '#0a0a0a' });

      // Work section enters → shift to white
      const workSection = document.querySelector('[data-section-work]');
      if (workSection) {
        ScrollTrigger.create({
          trigger: workSection,
          start: 'top 80%',
          end: 'top 20%',
          scrub: 0.5,
          onUpdate: (self) => {
            const p = self.progress;
            // Interpolate #0a0a0a → #ffffff
            const v = Math.round(10 + (255 - 10) * p);
            gsap.set(pageRoot, { backgroundColor: `rgb(${v},${v},${v})` });
          },
        });
      }

      // About section → shift to #fafafa (subtle)
      const aboutSection = document.querySelector('[data-about-section]');
      if (aboutSection) {
        ScrollTrigger.create({
          trigger: aboutSection,
          start: 'top 80%',
          end: 'top 30%',
          scrub: 0.5,
          onUpdate: (self) => {
            const p = self.progress;
            // #ffffff → #fafafa
            const v = Math.round(255 - 5 * p);
            gsap.set(pageRoot, { backgroundColor: `rgb(${v},${v},${v})` });
          },
        });
      }

      // Contact section → shift back to dark
      const contactSection = document.querySelector('[data-contact-section]');
      if (contactSection) {
        ScrollTrigger.create({
          trigger: contactSection,
          start: 'top 80%',
          end: 'top 20%',
          scrub: 0.5,
          onUpdate: (self) => {
            const p = self.progress;
            // #fafafa → #0a0a0a
            const v = Math.round(250 - (250 - 10) * p);
            gsap.set(pageRoot, { backgroundColor: `rgb(${v},${v},${v})` });

            // Switch navbar to dark mode when entering contact
            if (navBar) {
              if (p > 0.5) {
                navBar.classList.add('hero-nav-dark');
              } else {
                navBar.classList.remove('hero-nav-dark');
              }
            }
          },
        });
      }
    }

    // ─── Scroll animations are handled by each section component ───

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

      // Footer sits in the dark contact zone — invert colors
      const footerEl = footerSection as HTMLElement;
      footerEl.style.color = '#fff';
      footerEl.style.borderTopColor = 'rgba(255,255,255,0.1)';
    }
  }

  ngOnDestroy(): void {
    if (this.navClickHandler) {
      document.removeEventListener('click', this.navClickHandler);
    }
    ScrollTrigger.getAll().forEach(t => t.kill());
    this.timeline?.kill();
    document.body.style.overflow = '';
  }
}
