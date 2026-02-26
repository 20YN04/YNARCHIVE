import { AfterViewInit, Component, inject } from '@angular/core';
import { HeroComponent } from '../../hero/hero';
import { LayoutComponent } from '../../components/layout/layout';
import { RotorGalleryComponent } from '../../components/rotor-gallery/rotor-gallery';
import { AboutSectionComponent } from '../../components/about-section/about-section';
import { WorkService } from '../../services/work.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeroComponent,
    LayoutComponent,
    RotorGalleryComponent,
    AboutSectionComponent,
  ],
  template: `
    <app-hero></app-hero>
    <app-layout>
      <app-rotor-gallery [items]="workService.featuredWorkItems()"></app-rotor-gallery>
      <app-about-section></app-about-section>
    </app-layout>
  `
})
export class HomeComponent implements AfterViewInit {
  readonly workService = inject(WorkService);

  ngAfterViewInit(): void {
    // noop — hero component handles its own animations
  }
}
