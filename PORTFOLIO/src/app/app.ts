import { AfterViewInit, Component, OnDestroy, ViewChild, ViewContainerRef } from '@angular/core';
import { HomeComponent } from './pages/home/home';
import { PreloaderComponent } from './components/preloader/preloader.component';
import { ContactComponent } from './components/contact/contact';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-root',
  imports: [PreloaderComponent],
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

    <!-- Footer -->
    <section class="footer-section" data-footer-section>
      <div class="footer-inner" data-footer-inner>
        <a href="/" data-nav-link data-page="home" class="footer-brand">YNARCHIVE</a>
        <div class="footer-links">
          <a href="/" data-nav-link data-page="home" class="footer-link">Home</a>
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

  ngAfterViewInit(): void {
    document.body.style.overflow = 'hidden';
    setTimeout(() => this.initAnimations(), 200);
  }

  private initAnimations(): void {
    // Helper: render a page component with overlay transition
    const pageOverlayFront = document.querySelector('[data-page-overlay-front]') as HTMLElement | null;
    const pageOverlayBack = document.querySelector('[data-page-overlay-back]') as HTMLElement | null;
    let currentPage: 'home' | 'contact' = window.location.pathname === '/contact' ? 'contact' : 'home';

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

    const showPage = async (name: string) => {
      if ((name === 'home' || name === 'contact') && currentPage === name) {
        return;
      }
      await runPaperIn();
      // swap content
      this.pageContainer.clear();
      if (name === 'contact') {
        this.pageContainer.createComponent(ContactComponent);
        currentPage = 'contact';
      } else {
        this.pageContainer.createComponent(HomeComponent);
        currentPage = 'home';
      }
      await runPaperOut();
    };

    // initialize current page
    this.pageContainer.clear();
    if (currentPage === 'contact') {
      this.pageContainer.createComponent(ContactComponent);
    } else {
      this.pageContainer.createComponent(HomeComponent);
    }
    history.replaceState({ page: currentPage }, '', currentPage === 'contact' ? '/contact' : '/');

    // handle browser back/forward
    this.popStateHandler = (ev: PopStateEvent) => {
      const state = (ev.state && (ev.state as any).page) || 'home';
      showPage(state === 'contact' ? 'contact' : 'home');
    };
    window.addEventListener('popstate', this.popStateHandler);

    // ── Query elements ──
    const preloader = document.querySelector('[data-preloader]') as HTMLElement;
    const letters = document.querySelectorAll('[data-letter]');
    const preloaderInfos = document.querySelectorAll('[data-preloader-info]');

    const barTop = document.querySelector('[data-bar-top]') as HTMLElement;
    const barBottom = document.querySelector('[data-bar-bottom]') as HTMLElement;
    const barLeft = document.querySelector('[data-bar-left]') as HTMLElement;
    const barRight = document.querySelector('[data-bar-right]') as HTMLElement;

    const gridLines = document.querySelectorAll('[data-grid-line]');

    const navBar = document.querySelector('[data-nav-bar]') as HTMLElement | null;
    const megaTitle = document.querySelector('[data-hero-mega-title]') as HTMLElement;
    const megaTitleText = document.querySelector('[data-hero-mega-text]') as HTMLElement;
    const titleLines = document.querySelectorAll('[data-hero-title-line]');
    const heroImage = document.querySelector('[data-hero-image]') as HTMLElement;
    const heroImg = document.querySelector('[data-hero-img]') as HTMLElement;
    const heroBottom = document.querySelector('[data-hero-bottom]') as HTMLElement;
    const scrollHint = document.querySelector('[data-scroll-hint]') as HTMLElement;

    const footerSection = document.querySelector('[data-footer-section]');

    // Delegated nav clicks so links in dynamically rendered pages always work
    this.navClickHandler = (event: Event) => {
      const target = event.target as HTMLElement | null;
      const link = target?.closest('[data-nav-link]') as HTMLAnchorElement | null;
      if (!link) return;

      const page = link.getAttribute('data-page');
      if (page === 'home' || page === 'contact') {
        event.preventDefault();
        history.pushState({ page }, '', page === 'contact' ? '/contact' : '/');
        showPage(page);
        return;
      }

      const href = link.getAttribute('href');
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
    // Mega title visible from the start (preloader covers it, then morphs into it)
    if (megaTitleText) gsap.set(megaTitleText, { opacity: 0 });
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
    // Preloader info fades in
    tl.to(preloaderInfos, {
      opacity: 1, duration: 0.8, ease: 'power2.out', stagger: 0.1,
    }, 0.2);

    // Letters slide up into view with stagger
    tl.to(letters, {
      y: '0%',
      duration: 0.9,
      ease: 'power4.out',
      stagger: { each: 0.06, from: 'start' },
    }, 0.3);

    // Preloader info fades out
    tl.to(preloaderInfos, {
      opacity: 0, duration: 0.3, ease: 'power2.in',
    }, 1.8);

    // Hold for a beat, then letters slide up and out
    tl.to(letters, {
      y: '-110%',
      duration: 0.6,
      ease: 'power3.in',
      stagger: { each: 0.04, from: 'end' },
    }, 2.0);

    // Preloader compresses into the mega title black box
    // Get mega title dimensions to know the target height
    const megaHeight = megaTitle ? megaTitle.offsetHeight : 200;
    tl.to(preloader, {
      height: megaHeight,
      top: 0,
      borderRadius: 0,
      duration: 1.2,
      ease: 'power4.inOut',
    }, 2.4);

    // Fade out preloader completely once it matches mega title
    tl.to(preloader, {
      opacity: 0,
      duration: 0.3,
      ease: 'power2.in',
    }, 3.5);

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

    // Mega title text fades in as preloader settles into position
    if (megaTitleText) {
      tl.to(megaTitleText, {
        opacity: 1,
        duration: 0.8,
        ease: 'power2.out',
      }, 3.2);
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

    // Mega title -> nav handoff (single scrub timeline for smooth transition)
    if (megaTitle && megaTitleText) {
      const handoffTl = gsap.timeline({
        scrollTrigger: {
          trigger: megaTitle,
          start: 'top top',
          end: '+=320',
          scrub: 1,
        },
      });

      handoffTl
        .to(megaTitleText, {
          opacity: 0,
          yPercent: -22,
          scale: 0.92,
          ease: 'none',
        }, 0)
        .to(megaTitle, {
          clipPath: 'inset(0 0 100% 0)',
          ease: 'none',
        }, 0);

      if (navBar) {
        handoffTl.to(navBar, {
          opacity: 1,
          y: 0,
          ease: 'none',
        }, 0.28);
      }

      if (navBar) {
        ScrollTrigger.create({
          trigger: megaTitle,
          start: 'top top',
          end: '+=320',
          onUpdate: (self) => {
            navBar.style.pointerEvents = self.progress > 0.85 ? 'auto' : 'none';
          },
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
