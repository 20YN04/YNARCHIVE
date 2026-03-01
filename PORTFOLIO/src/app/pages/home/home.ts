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

    <!-- Transition zone: dark → light -->
    <div class="transition-zone transition-dark-to-light" data-transition-hero-work></div>

    <!-- Featured Work -->
    <section id="work" class="section-work" data-section-work>
      <app-featured-work></app-featured-work>
    </section>

    <!-- About -->
    <app-about-section></app-about-section>

    <!-- Transition zone: light → dark -->
    <div class="transition-zone transition-light-to-dark" data-transition-about-contact></div>

    <!-- Contact -->
    <app-contact-section></app-contact-section>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      /* ═══ TRANSITION ZONES — smooth color gradient wipes ═══ */
      .transition-zone {
        position: relative;
        height: clamp(120px, 20vh, 280px);
        width: 100%;
        pointer-events: none;
        z-index: 1;
      }

      /* Dark → Light (hero → work) */
      .transition-dark-to-light {
        background: linear-gradient(to bottom, #0a0a0a 0%, #141414 20%, #ffffff 100%);
        margin-top: -1px; /* seamless with hero */
      }

      /* Light → Dark (about → contact) */
      .transition-light-to-dark {
        background: linear-gradient(to bottom, #fafafa 0%, #1a1a1a 60%, #0a0a0a 100%);
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
