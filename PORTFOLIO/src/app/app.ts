import { AfterViewInit, Component, inject, OnDestroy, ViewChild, ViewContainerRef } from '@angular/core';
import { HomeComponent } from './pages/home/home';
import { PreloaderComponent } from './components/preloader/preloader.component';
import { LenisService } from './core/lenis.service';
import { InkDissolveService } from './core/ink-dissolve.service';
import { registerPortfolioEffects } from './core/gsap-effects';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
registerPortfolioEffects();

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

    <!-- Main content rendered into the page container -->
    <div id="page-root">
      <ng-template #pageContainer></ng-template>
    </div>

    <!-- Footer — Daniel Bate style: marquee + large name + socials -->
    <section id="footer" class="footer-section" data-footer-section>
      <div class="footer-inner">
        <div class="footer-stroke"></div>

        <!-- Marquee: Get in touch -->
        <div class="footer-marquee-wrap" data-footer-marquee>
          <div class="footer-marquee-scroll">
            <div class="footer-marquee-track">
              @for (i of marqueeItems; track i) {
                <span class="footer-marquee-text">Get in touch</span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 125 95" fill="none" class="footer-marquee-arrow">
                  <path d="M73.67 89.78L116.2 47.25 73.67 4.72" stroke="currentColor" stroke-width="12.15" stroke-miterlimit="10"/>
                  <path d="M116.2 47.25H.76" stroke="currentColor" stroke-width="12.15" stroke-miterlimit="10"/>
                </svg>
              }
            </div>
          </div>
        </div>

        <!-- Social links -->
        <div class="footer-social-row">
          <div class="footer-anchor-item">
            <span class="footer-anchor-num">(01)</span>
            <a href="mailto:yentl.nerinckx@icloud.com" class="footer-anchor-link" data-scroll-link>Email</a>
          </div>
          <div class="footer-anchor-item">
            <span class="footer-anchor-num">(02)</span>
            <a href="https://www.linkedin.com/in/yentl-nerinckx" target="_blank" rel="noopener noreferrer" class="footer-anchor-link">LinkedIn</a>
          </div>
          <div class="footer-anchor-item">
            <span class="footer-anchor-num">(03)</span>
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" class="footer-anchor-link">Instagram</a>
          </div>
        </div>

        <!-- Massive brand name -->
        <div class="footer-brand-wrap">
          <span class="footer-brand-display">YE<span class="footer-alt">N</span>TL NERI<span class="footer-alt">N</span>CKX</span>
        </div>
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
  private inkDissolve = inject(InkDissolveService);

  /** Used to duplicate the marquee text items in the footer */
  readonly marqueeItems = Array.from({ length: 8 }, (_, i) => i);

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

    // ─── INK DISSOLVE: letters dissolve into particles that flow to hero-top ───
    // Start dissolve while letters are still fully visible — particles overlap
    const dissolveStart = 1.8;
    tl.add(() => {
      const heroTop = document.querySelector('[data-hero-top]') as HTMLElement;
      const heroTopBrand = document.querySelector('[data-hero-top-brand]') as HTMLElement;
      if (!heroTop || !heroTopBrand) return;

      // Ensure hero-top groups are at final position but invisible
      const topGroups = heroTop.querySelectorAll('.hero-top-group');
      gsap.set(topGroups, { opacity: 0, y: 0 });
      gsap.set(heroTopBrand, { opacity: 0 });

      // Particles fly from preloader letters → converge on the YNARCHIVE brand text
      const letterEls = Array.from(letters) as HTMLElement[];
      this.inkDissolve.start(letterEls, heroTopBrand, () => {
        // Particles have converged — reveal the YNARCHIVE brand text (stays visible)
        gsap.to(heroTopBrand, {
          opacity: 1,
          duration: 0.35,
          ease: 'power2.out',
        });
        // Then reveal the surrounding info groups
        heroTop.setAttribute('data-ink-revealed', 'true');
        gsap.to(topGroups, {
          opacity: 1,
          duration: 0.5,
          stagger: 0.1,
          delay: 0.15,
          ease: 'power2.out',
        });
      });
    }, dissolveStart);

    // Fade original letters out gradually as particles take over (not instant)
    tl.to(letters, {
      opacity: 0,
      duration: 0.5,
      ease: 'power2.in',
      stagger: { each: 0.03, from: 'start' },
    }, dissolveStart + 0.1);

    // Preloader info fades
    tl.to(preloaderInfos, { opacity: 0, duration: 0.3, ease: 'power2.in' }, dissolveStart);

    // Preloader bg holds dark backdrop while particles fly, then fades
    const compressStart = 2.8;
    tl.to(preloader, {
      opacity: 0,
      duration: 0.8,
      ease: 'power2.inOut',
    }, compressStart);

    // ─── ACT 2: THICK BARS → THIN LINES ───
    // Side bars shrink from 40px to 1px
    tl.to([barLeft, barRight], {
      width: 1,
      duration: 1.0,
      ease: 'power3.inOut',
    }, 3.2);

    // Bottom bar shrinks
    tl.to(barBottom, {
      height: 1,
      duration: 1.0,
      ease: 'power3.inOut',
    }, 3.2);

    // Top bar shrinks to 0 (nav takes over)
    tl.to(barTop, {
      height: 0,
      duration: 1.0,
      ease: 'power3.inOut',
    }, 3.2);

    // Grid lines draw in from top
    tl.to(gridLines, {
      scaleY: 1,
      duration: 1.2,
      ease: 'power3.out',
      stagger: { each: 0.06, from: 'center' },
    }, 3.4);

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

    // ─── Page root is always dark — sections own their backgrounds ───
    const pageRoot = document.getElementById('page-root');
    if (pageRoot) {
      pageRoot.style.backgroundColor = '#0a0a0a';
    }

    // Navbar stays in dark mode throughout — all sections are dark now

    // ─── Scroll animations are handled by each section component ───

    // Footer reveal
    if (footerSection) {
      gsap.from(footerSection, {
        scrollTrigger: {
          trigger: footerSection,
          start: 'top 95%',
          end: 'top 60%',
          scrub: 0.5,
        },
        opacity: 0,
        y: 20,
      });
    }
  }

  ngOnDestroy(): void {
    if (this.navClickHandler) {
      document.removeEventListener('click', this.navClickHandler);
    }
    ScrollTrigger.getAll().forEach(t => t.kill());
    this.timeline?.kill();
    this.inkDissolve.destroy();
    document.body.style.overflow = '';
  }
}
