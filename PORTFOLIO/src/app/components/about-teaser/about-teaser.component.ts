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
    <section class="about-teaser" data-about-teaser data-about-section>
      <span class="section-label" data-scroll-label>&#123; ABOUT &#125;</span>
      <div class="about-teaser-lines">
        <p class="about-teaser-lead" data-scroll-line><span class="line-inner">I pair strong visual and technical skills with a focus on user-centred design and clean code.</span></p>
        <p class="about-teaser-text" data-scroll-line><span class="line-inner">With experience across design and development, I help bring products and brands to life through thoughtful interfaces and solid implementation.</span></p>
      </div>
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
        max-width: 48ch;
      }

      .about-teaser-lines {
        overflow: hidden;
      }

      .about-teaser-lines [data-scroll-line] {
        overflow: hidden;
      }

      .about-teaser-lines .line-inner {
        display: block;
      }

      .section-label {
        display: block;
        font-family: 'area-normal', sans-serif;
        font-size: 10px;
        letter-spacing: 0.28em;
        text-transform: uppercase;
        color: rgba(10, 10, 10, 0.4);
        margin-bottom: 1.25rem;
      }

      .about-teaser-lead {
        margin: 0 0 1rem;
        font-family: 'area-normal', sans-serif;
        font-size: clamp(1.1rem, 1.6vw, 1.35rem);
        line-height: 1.5;
        color: #0a0a0a;
        font-weight: 500;
      }

      .about-teaser-text {
        margin: 0 0 1.5rem;
        font-family: 'area-normal', sans-serif;
        font-size: clamp(1rem, 1.35vw, 1.1rem);
        line-height: 1.65;
        color: rgba(10, 10, 10, 0.8);
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
