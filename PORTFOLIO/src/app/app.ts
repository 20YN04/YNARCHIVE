import { AfterViewInit, Component, OnDestroy, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { HeroComponent } from './hero/hero';
import { ProjectGridComponent } from './project-grid';
import { LayoutComponent } from './layout/layout';
import { PreloaderComponent } from './preloader';
import { gsap } from 'gsap';

@Component({
  selector: 'app-root',
  imports: [HeroComponent, LayoutComponent, PreloaderComponent, ProjectGridComponent, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements AfterViewInit, OnDestroy {
  protected readonly title = signal('PORTFOLIO');
  readonly showPreloader = signal(true);

  private timeline?: gsap.core.Timeline;

  ngAfterViewInit(): void {
    const preloader = document.querySelector('[data-preloader]');
    const counter = document.querySelector('[data-preloader-counter]');
    const heroTitle = document.querySelector('[data-hero-title]');
    const navBar = document.querySelector('[data-nav-bar]');
    const heroImage = document.querySelector('[data-hero-image]');

    if (!preloader || !counter || !heroTitle || !navBar || !heroImage) {
      this.showPreloader.set(false);
      return;
    }

    this.timeline = gsap.timeline({
      onComplete: () => this.onPreloaderDone()
    });

    this.timeline.to(counter, {
      innerText: 100,
      duration: 2.5,
      snap: { innerText: 1 },
      ease: 'none',
      onUpdate: function () {
        const value = Math.round(Number(this.targets()[0].innerText));
        this.targets()[0].innerText = `${value}%`;
      }
    });

    this.timeline.to(preloader, {
      yPercent: -100,
      duration: 1,
      ease: 'power4.inOut'
    });

    this.timeline.from(
      heroTitle,
      {
        y: 100,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
      },
      '-=0.5'
    );

    this.timeline.from(
      navBar,
      {
        y: -20,
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out'
      },
      '-=0.6'
    );

    this.timeline.from(
      heroImage,
      {
        scale: 1.1,
        opacity: 0,
        duration: 1.2,
        ease: 'power2.out'
      },
      '-=0.8'
    );
  }

  onPreloaderDone(): void {
    this.showPreloader.set(false);
  }

  ngOnDestroy(): void {
    this.timeline?.kill();
  }
}
