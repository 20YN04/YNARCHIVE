import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  OnDestroy,
  ViewChild,
  signal
} from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export interface FloatingCtaSection {
  selector: string;
  label: string;
  href: string;
}

const DEFAULT_SECTIONS: FloatingCtaSection[] = [
  { selector: '[data-hero-mega-title], .hero-section', label: 'View Work', href: '/work' },
  { selector: '[data-about-teaser]', label: 'About', href: '/about' },
  { selector: '[data-rotor-section]', label: 'View All Projects', href: '/work' },
  { selector: '.footer-section, [data-footer-section]', label: 'Get in touch', href: '/contact' }
];

/**
 * Persistent floating CTA that updates label and link based on the section in view.
 * Keeps the UI uncluttered with a single dynamic button.
 */
@Component({
  selector: 'app-floating-cta',
  standalone: true,
  template: `
    <a
      #link
      [href]="currentHref()"
      [attr.data-page]="ctaPage()"
      data-nav-link
      class="floating-cta"
      [class.visible]="isVisible()"
    >{{ currentLabel() }}</a>
  `,
  styles: [
    `
      .floating-cta {
        position: fixed;
        bottom: clamp(1.5rem, 4vw, 2.5rem);
        right: clamp(1.5rem, 4vw, 2.5rem);
        z-index: 100;
        font-family: 'area-normal', sans-serif;
        font-size: 12px;
        font-weight: 600;
        letter-spacing: 0.2em;
        text-transform: uppercase;
        color: #0a0a0a;
        background: #fff;
        padding: 0.75rem 1.25rem;
        border: 1px solid rgba(10, 10, 10, 0.15);
        text-decoration: none;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.35s ease, border-color 0.2s, color 0.2s;
      }
      .floating-cta.visible {
        opacity: 1;
        pointer-events: auto;
      }
      .floating-cta:hover {
        border-color: #0a0a0a;
      }
    `
  ]
})
export class FloatingCtaComponent implements AfterViewInit, OnDestroy {
  @ViewChild('link', { read: ElementRef }) linkEl!: ElementRef<HTMLAnchorElement>;

  currentLabel = signal('View Work');
  currentHref = signal('/work');
  isVisible = signal(false);
  ctaPage = signal('work');

  private sections: FloatingCtaSection[] = DEFAULT_SECTIONS;
  private triggers: ScrollTrigger[] = [];
  private cleanup?: () => void;

  ngAfterViewInit(): void {
    const el = this.linkEl?.nativeElement;
    if (!el) return;

    const updateCta = (label: string, href: string): void => {
      this.currentLabel.set(label);
      this.currentHref.set(href);
      const p = (href || '/').replace(/^\//, '');
      this.ctaPage.set(p || 'home');
      this.isVisible.set(true);
    };

    this.sections.forEach((section, i) => {
      const triggerEl = document.querySelector(section.selector);
      if (!triggerEl) return;

      const st = ScrollTrigger.create({
        trigger: triggerEl,
        start: 'top 70%',
        end: 'bottom 30%',
        onEnter: () => updateCta(section.label, section.href),
        onEnterBack: () => updateCta(section.label, section.href),
        id: `float-cta-${i}`
      });
      this.triggers.push(st);
    });

    if (this.sections.length > 0) {
      const first = this.sections[0];
      this.currentLabel.set(first.label);
      this.currentHref.set(first.href);
      const p = (first.href || '/').replace(/^\//, '');
      this.ctaPage.set(p || 'home');
      this.isVisible.set(true);
      ScrollTrigger.refresh();
    }
  }

  ngOnDestroy(): void {
    this.triggers.forEach((t) => t.kill());
    this.cleanup?.();
  }
}
