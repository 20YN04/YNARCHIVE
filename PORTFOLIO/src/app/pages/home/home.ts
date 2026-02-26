import { AfterViewInit, Component, inject } from '@angular/core';
import { HeroComponent } from '../../hero/hero';
import { LayoutComponent } from '../../components/layout/layout';
import { AboutTeaserComponent } from '../../components/about-teaser/about-teaser.component';
import { RotorGalleryComponent } from '../../components/rotor-gallery/rotor-gallery';
import { WorkService } from '../../services/work.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeroComponent,
    LayoutComponent,
    AboutTeaserComponent,
    RotorGalleryComponent,
  ],
  template: `
    <app-hero></app-hero>
    <app-layout>
      <app-about-teaser></app-about-teaser>
      <app-rotor-gallery [items]="workService.featuredWorkItems()"></app-rotor-gallery>
      <div class="home-view-all">
        <a href="/work" data-nav-link data-page="work" class="home-view-all-link">View All Projects →</a>
      </div>
    </app-layout>
  `,
  styles: [
    `
      .home-view-all {
        padding-bottom: clamp(3rem, 8vw, 5rem);
      }
      .home-view-all-link {
        font-family: 'area-normal', sans-serif;
        font-size: 13px;
        font-weight: 600;
        letter-spacing: 0.15em;
        text-transform: uppercase;
        color: #0a0a0a;
        text-decoration: none;
        padding-bottom: 4px;
        border-bottom: 1px solid transparent;
        transition: border-color 0.4s ease, opacity 0.3s ease;
      }
      .home-view-all-link:hover {
        border-bottom-color: #0a0a0a;
        opacity: 0.85;
      }
    `
  ]
})
export class HomeComponent implements AfterViewInit {
  readonly workService = inject(WorkService);

  ngAfterViewInit(): void {}
}
