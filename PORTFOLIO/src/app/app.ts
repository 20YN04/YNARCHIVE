import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { HeroComponent } from './hero/hero';
import { ProjectGridComponent } from './components/project-grid/project-grid';
import { LayoutComponent } from './components/layout/layout';
import { PreloaderComponent } from './components/preloader/preloader.component';
import { gsap } from 'gsap';

@Component({
  selector: 'app-root',
  imports: [HeroComponent, LayoutComponent, PreloaderComponent, ProjectGridComponent],
  template: `
    <!-- Preloader is ALWAYS in DOM, we just animate it out -->
    <app-preloader />
    <app-hero />
    <app-layout>
      <app-project-grid />
    </app-layout>
  `,
  styleUrl: './app.css'
})
export class App implements AfterViewInit, OnDestroy {
  private timeline?: gsap.core.Timeline;

  ngAfterViewInit(): void {
    // Lock scroll immediately
    document.body.style.overflow = 'hidden';

    // Small delay to ensure ALL child components are rendered
    setTimeout(() => {
      this.initAnimations();
    }, 100);
  }

  private initAnimations(): void {
    const preloader = document.querySelector('[data-preloader]');
    const counter = document.querySelector('[data-preloader-counter]');
    const heroTitle = document.querySelector('[data-hero-title]');
    const navBar = document.querySelector('[data-nav-bar]');
    const heroImage = document.querySelector('[data-hero-image]');

    // Validate all elements exist
    if (!preloader || !counter || !heroTitle || !navBar || !heroImage) {
      console.error('Missing elements:', { preloader, counter, heroTitle, navBar, heroImage });
      // Fallback: just hide preloader and show content
      if (preloader) {
        (preloader as HTMLElement).style.display = 'none';
      }
      document.body.style.overflow = '';
      return;
    }

    // Set initial states BEFORE animation
    gsap.set(heroTitle, { opacity: 0, y: 100 });
    gsap.set(navBar, { opacity: 0, y: -20 });
    gsap.set(heroImage, { opacity: 0, scale: 1.1 });

    this.timeline = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = '';
        // Hide preloader completely after animation
        (preloader as HTMLElement).style.display = 'none';
      }
    });

    // Counter animation
    const counterValue = { value: 0 };
    const counterEl = counter as HTMLElement;

    this.timeline.to(counterValue, {
      value: 100,
      duration: 2.5,
      ease: 'none',
      onUpdate: () => {
        counterEl.textContent = `${Math.round(counterValue.value)}%`;
      }
    });

    // Preloader exit - slides UP
    this.timeline.to(preloader, {
      yPercent: -100,
      duration: 1,
      ease: 'power4.inOut'
    });

    // Hero title reveals (overlap with preloader exit)
    this.timeline.to(heroTitle, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      ease: 'power3.out'
    }, '-=0.5');

    // Nav bar reveals
    this.timeline.to(navBar, {
      y: 0,
      opacity: 1,
      duration: 0.6,
      ease: 'power2.out'
    }, '-=0.6');

    // Hero image reveals
    this.timeline.to(heroImage, {
      scale: 1,
      opacity: 1,
      duration: 1.2,
      ease: 'power2.out'
    }, '-=0.8');
  }

  ngOnDestroy(): void {
    this.timeline?.kill();
    document.body.style.overflow = '';
  }
}
