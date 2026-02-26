import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild
} from '@angular/core';
import { gsap } from 'gsap';

/**
 * Homepage About Teaser: short summary + "More About Me" link to /about.
 * GSAP hover: slow-drawing underline on the link.
 */
@Component({
  selector: 'app-about-teaser',
  standalone: true,
  template: `
    <section class="about-teaser" data-about-teaser>
      <p class="about-teaser-text">
        I'm Yentl — designer and developer based in Tessenderlo, Belgium.
        I focus on clear, purposeful work from concept to code.
      </p>
      <a
        href="/about"
        data-nav-link
        data-page="about"
        class="about-teaser-link"
        #aboutLink
        (mouseenter)="onLinkHover(true)"
        (mouseleave)="onLinkHover(false)"
      >
        <span class="about-teaser-link-text">More About Me</span>
        <span class="about-teaser-link-line" #underline></span>
      </a>
    </section>
  `,
  styles: [
    `
      .about-teaser {
        padding: clamp(4rem, 12vw, 8rem) 0;
        max-width: 42ch;
      }

      .about-teaser-text {
        margin: 0 0 1.5rem;
        font-family: 'area-normal', sans-serif;
        font-size: clamp(1.05rem, 1.5vw, 1.2rem);
        line-height: 1.65;
        color: rgba(10, 10, 10, 0.85);
      }

      .about-teaser-link {
        position: relative;
        display: inline-block;
        font-family: 'area-normal', sans-serif;
        font-size: 13px;
        font-weight: 600;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: #0a0a0a;
        text-decoration: none;
      }

      .about-teaser-link-text {
        position: relative;
        z-index: 1;
      }

      .about-teaser-link-line {
        position: absolute;
        left: 0;
        bottom: -2px;
        width: 100%;
        height: 1px;
        background: #0a0a0a;
        transform: scaleX(0);
        transform-origin: left;
      }
    `
  ]
})
export class AboutTeaserComponent implements AfterViewInit, OnDestroy {
  @ViewChild('underline') underlineRef!: ElementRef<HTMLElement>;

  onLinkHover(enter: boolean): void {
    const el = this.underlineRef?.nativeElement;
    if (!el) return;
    gsap.to(el, {
      scaleX: enter ? 1 : 0,
      duration: enter ? 0.6 : 0.35,
      ease: 'power2.out'
    });
  }

  ngAfterViewInit(): void {
    gsap.set(this.underlineRef?.nativeElement, { scaleX: 0 });
  }

  ngOnDestroy(): void {}
}
