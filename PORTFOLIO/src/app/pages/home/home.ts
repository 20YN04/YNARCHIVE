import { AfterViewInit, Component, inject } from '@angular/core';
import { HeroComponent } from '../../hero/hero';
import { FeaturedWorkComponent } from '../../components/featured-work/featured-work';
import { AboutSectionComponent } from '../../components/about-section/about-section';
import { ContactSectionComponent } from '../../components/contact-section/contact-section';
import { WorkService } from '../../services/work.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeroComponent,
    FeaturedWorkComponent,
    AboutSectionComponent,
    ContactSectionComponent,
  ],
  template: `
    <app-hero></app-hero>

    <!-- Featured Work -->
    <section id="work">
      <app-featured-work></app-featured-work>
    </section>

    <!-- About -->
    <app-about-section></app-about-section>

    <!-- Contact -->
    <app-contact-section></app-contact-section>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class HomeComponent implements AfterViewInit {
  readonly workService = inject(WorkService);

  ngAfterViewInit(): void {}
}
