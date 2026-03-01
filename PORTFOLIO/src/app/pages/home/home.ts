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

    <!-- Featured Work — white bg -->
    <section id="work" class="section-work" data-section-work>
      <app-featured-work></app-featured-work>
    </section>

    <!-- About — dark bg, flows straight from work -->
    <app-about-section></app-about-section>

    <!-- Contact — dark bg, seamless with about -->
    <app-contact-section></app-contact-section>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .section-work {
        position: relative;
        background: #fff;
      }
    `,
  ],
})
export class HomeComponent implements AfterViewInit {
  readonly workService = inject(WorkService);

  ngAfterViewInit(): void {}
}
