import { AfterViewInit, Component, inject, OnDestroy, ViewChild, ViewContainerRef } from '@angular/core';
import { HomeComponent } from './pages/home/home';
import { PreloaderComponent } from './components/preloader/preloader.component';
import { ContactComponent } from './components/contact/contact';
import { WorkComponent } from './pages/work/work';
import { AboutComponent } from './pages/about/about';
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

    <!-- Main content rendered into the page container (dynamic pages) -->
    <div id="page-root">
      <ng-template #pageContainer></ng-template>
    </div>

    <!-- Page overlays for layered paper transition -->
    <div class="page-overlay page-overlay-back" data-page-overlay-back></div>
    <div class="page-overlay page-overlay-front" data-page-overlay-front></div>

    <!-- Floating CTA: label/link update by section (View Work → Next Project → Get in touch) -->
    <app-floating-cta />

    <!-- Footer -->
    <section class="footer-section" data-footer-section>
      <div class="footer-inner" data-footer-inner>
        <a href="/" data-nav-link data-page="home" class="footer-brand">YNARCHIVE</a>
        <div class="footer-links">
          <a href="/" data-nav-link data-page="home" class="footer-link">Home</a>
          <a href="/work" data-nav-link data-page="work" class="footer-link">Work</a>
          <a href="/about" data-nav-link data-page="about" class="footer-link">About</a>
          <a href="/contact" data-nav-link data-page="contact" class="footer-link">Contact</a>
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
  private popStateHandler?: (event: PopStateEvent) => void;
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
    // Helper: render a page component with overlay transition
    const pageOverlayFront = document.querySelector('[data-page-overlay-front]') as HTMLElement | null;
    const pageOverlayBack = document.querySelector('[data-page-overlay-back]') as HTMLElement | null;
    const resolvePageFromPath = (pathname: string): 'home' | 'work' | 'contact' | 'about' => {
      if (pathname === '/contact') return 'contact';
      if (pathname === '/work') return 'work';
      if (pathname === '/about') return 'about';
      return 'home';
    };
    const resolvePathFromPage = (page: 'home' | 'work' | 'contact' | 'about'): string => {
      if (page === 'contact') return '/contact';
      if (page === 'work') return '/work';
      if (page === 'about') return '/about';
      return '/';
    };

    const updateGlobalFooterVisibility = (_page: 'home' | 'work' | 'contact' | 'about') => {
      const footer = document.querySelector('[data-footer-section]') as HTMLElement | null;
      if (!footer) return;
      footer.style.display = '';
    };

    let currentPage: 'home' | 'work' | 'contact' | 'about' = resolvePageFromPath(window.location.pathname);

    const registerHomeHandoff = () => {
      const nav = document.querySelector('[data-nav-bar]') as HTMLElement | null;
      const heroSection = document.querySelector('[data-hero-section]') as HTMLElement | null;
      if (!nav || !heroSection) return;

      const existingMain = ScrollTrigger.getById('home-nav-handoff');
      if (existingMain) existingMain.kill();
      const existingDynamic = ScrollTrigger.getById('dynamic-home-nav-handoff');
      if (existingDynamic) existingDynamic.kill();

      gsap.set(nav, { opacity: 0, y: -10 });
      nav.style.pointerEvents = 'none';

      // Nav fades in as user scrolls past the hero section
      const handoffTrigger = ScrollTrigger.create({
        id: 'home-nav-handoff',
        trigger: heroSection,
        start: 'top top',
        end: '+=400',
        onUpdate: (self) => {
          const progress = self.progress;
          const reveal = progress < 0.2 ? 0 : Math.min(1, (progress - 0.2) / 0.8);

          gsap.set(nav, {
            opacity: reveal,
            y: -10 + reveal * 10,
          });

          nav.style.pointerEvents = progress > 0.7 ? 'auto' : 'none';
        },
      });

      handoffTrigger.update();
    };

    const runPaperIn = async () => {
      if (!pageOverlayFront || !pageOverlayBack) return;

      gsap.set(pageOverlayBack, { clipPath: 'inset(100% 0 0 0)', y: 40, rotate: 0.6, opacity: 0.92 });
      gsap.set(pageOverlayFront, { clipPath: 'inset(100% 0 0 0)', y: 88, rotate: -0.8, opacity: 1 });

      const inTl = gsap.timeline();
      inTl
        .to(pageOverlayBack, {
          clipPath: 'inset(0% 0 0 0)',
          y: 0,
          rotate: 0,
          duration: 0.42,
          ease: 'power3.out',
        }, 0)
        .to(pageOverlayFront, {
          clipPath: 'inset(0% 0 0 0)',
          y: 0,
          rotate: 0,
          duration: 0.52,
          ease: 'power4.out',
        }, 0.06);

      await inTl.then();
    };

    const runPaperOut = async () => {
      if (!pageOverlayFront || !pageOverlayBack) return;

      const outTl = gsap.timeline();
      outTl
        .to(pageOverlayFront, {
          clipPath: 'inset(0 0 100% 0)',
          y: -70,
          rotate: 0.7,
          duration: 0.5,
          ease: 'power3.inOut',
        }, 0)
        .to(pageOverlayBack, {
          clipPath: 'inset(0 0 100% 0)',
          y: -45,
          rotate: -0.5,
          duration: 0.44,
          ease: 'power2.inOut',
        }, 0.05);

      await outTl.then();
    };

    const showPage = async (name: string): Promise<void> => {
      if ((name === 'home' || name === 'work' || name === 'contact' || name === 'about') && currentPage === name) {
        return Promise.resolve();
      }
      await runPaperIn();
      // swap content
      this.pageContainer.clear();
      if (name === 'contact') {
        this.pageContainer.createComponent(ContactComponent);
        currentPage = 'contact';
      } else if (name === 'work') {
        this.pageContainer.createComponent(WorkComponent);
        currentPage = 'work';
      } else if (name === 'about') {
        this.pageContainer.createComponent(AboutComponent);
        currentPage = 'about';
      } else {
        this.pageContainer.createComponent(HomeComponent);
        currentPage = 'home';
      }
      updateGlobalFooterVisibility(currentPage);
      await runPaperOut();

      // Scroll to top on every page change
      window.scrollTo(0, 0);

      if (name === 'home') {
        requestAnimationFrame(() => {
          registerHomeHandoff();
          ScrollTrigger.refresh();
        });
      }
    };

    // initialize current page
    this.pageContainer.clear();
    if (currentPage === 'contact') {
      this.pageContainer.createComponent(ContactComponent);
    } else if (currentPage === 'work') {
      this.pageContainer.createComponent(WorkComponent);
    } else if (currentPage === 'about') {
      this.pageContainer.createComponent(AboutComponent);
    } else {
      this.pageContainer.createComponent(HomeComponent);
    }
    updateGlobalFooterVisibility(currentPage);
    history.replaceState({ page: currentPage }, '', resolvePathFromPage(currentPage));
    window.scrollTo(0, 0);
    requestAnimationFrame(() => window.scrollTo(0, 0));

    // handle browser back/forward
    this.popStateHandler = (ev: PopStateEvent) => {
      const state = (ev.state && (ev.state as any).page) || resolvePageFromPath(window.location.pathname);
      const page = state === 'contact' || state === 'work' || state === 'about' ? state : 'home';
      showPage(page);
    };
    window.addEventListener('popstate', this.popStateHandler);

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

    const navBar = document.querySelector('[data-nav-bar]') as HTMLElement | null;

    const footerSection = document.querySelector('[data-footer-section]');

    // Delegated nav clicks so links in dynamically rendered pages always work
    this.navClickHandler = (event: Event) => {
      const target = event.target as HTMLElement | null;
      const link = target?.closest('[data-nav-link]') as HTMLAnchorElement | null;
      if (!link) return;

      const href = link.getAttribute('href') || '';
      const hashMatch = href.match(/#([a-z0-9-]+)/i);
      const hashId = hashMatch ? hashMatch[1] : null;
      const page = link.getAttribute('data-page');

      if (page === 'home' || page === 'work' || page === 'contact' || page === 'about') {
        event.preventDefault();
        const path = resolvePathFromPage(page) + (hashId ? '#' + hashId : '');
        history.pushState({ page }, '', path);
        showPage(page).then(() => {
          if (hashId) {
            setTimeout(() => {
              const anchorTarget = document.getElementById(hashId);
              if (anchorTarget) {
                const navHeight = navBar ? navBar.offsetHeight : 60;
                const top = anchorTarget.getBoundingClientRect().top + window.scrollY - navHeight - 8;
                window.scrollTo({ top, behavior: 'smooth' });
              }
            }, 100);
          }
        });
        return;
      }

      if (href && href.startsWith('#')) {
        event.preventDefault();
        const id = href.slice(1);
        const anchorTarget = document.getElementById(id);
        if (anchorTarget) {
          const navHeight = navBar ? navBar.offsetHeight : 60;
          const top = anchorTarget.getBoundingClientRect().top + window.scrollY - navHeight - 8;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      }
    };
    document.addEventListener('click', this.navClickHandler);

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
        if (currentPage === 'home') {
          registerHomeHandoff();
          ScrollTrigger.refresh();
        }
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

    if (currentPage !== 'home') {
      registerHomeHandoff();
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

    // ─── Featured work + project cards: handled by FeaturedWorkComponent ───

    // ─── About section: label + staggered text line reveals ───
    const aboutSection = document.querySelector('[data-about-section]');
    const aboutLabel = document.querySelector('[data-about-section] [data-scroll-label]');
    const aboutLines = document.querySelectorAll('[data-about-section] [data-scroll-line]');
    if (aboutSection) {
      gsap.from(aboutSection, {
        scrollTrigger: {
          trigger: aboutSection,
          start: 'top 90%',
          end: 'top 48%',
          scrub: 0.8,
        },
        opacity: 0,
        y: 45,
      });
      if (aboutLabel) {
        gsap.from(aboutLabel, {
          scrollTrigger: { trigger: aboutSection, start: 'top 88%', end: 'top 55%', scrub: 0.6 },
          y: 24,
          opacity: 0,
        });
      }
      aboutLines.forEach((line, i) => {
        gsap.from(line, {
          scrollTrigger: {
            trigger: aboutSection,
            start: `top ${86 - i * 6}%`,
            end: `top ${50 - i * 4}%`,
            scrub: 0.5,
          },
          y: 36,
          opacity: 0,
        });
      });
    }

    // Project cards scroll animations: handled by FeaturedWorkComponent

    // View All link — subtle reveal
    const viewAllWrap = document.querySelector('.home-view-all');
    if (viewAllWrap) {
      gsap.from(viewAllWrap, {
        scrollTrigger: {
          trigger: viewAllWrap,
          start: 'top 90%',
          end: 'top 60%',
          scrub: 0.5,
        },
        opacity: 0,
        y: 24,
      });
    }

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
    if (this.navClickHandler) {
      document.removeEventListener('click', this.navClickHandler);
    }
    if (this.popStateHandler) {
      window.removeEventListener('popstate', this.popStateHandler);
    }
    ScrollTrigger.getAll().forEach(t => t.kill());
    this.timeline?.kill();
    document.body.style.overflow = '';
  }
}
