import { AfterViewInit, Component } from '@angular/core';
import { HeroComponent } from '../../hero/hero';
import { LayoutComponent } from '../../components/layout/layout';
import { RotorGalleryComponent } from '../../components/rotor-gallery/rotor-gallery';
import { AboutSectionComponent } from '../../components/about-section/about-section';
import { ProjectGridComponent } from '../../components/project-grid/project-grid';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeroComponent,
    LayoutComponent,
    RotorGalleryComponent,
    AboutSectionComponent,
    ProjectGridComponent,
  ],
  template: `
    <app-hero></app-hero>
    <app-layout>
      <app-rotor-gallery></app-rotor-gallery>
      <app-about-section></app-about-section>
      <app-project-grid></app-project-grid>
    </app-layout>
  `
})
export class HomeComponent implements AfterViewInit {
  ngAfterViewInit(): void {
    // noop — hero component handles its own animations
  }
}
