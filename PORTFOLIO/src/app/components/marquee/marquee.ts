import { Component, Input, computed } from '@angular/core';

/**
 * Jack Elder style: infinite horizontal marquee with repeating brand text.
 */
@Component({
  selector: 'app-marquee',
  standalone: true,
  template: `
    <div class="marquee" [class.marquee-dark]="dark">
      <div class="marquee-track" [style.--marquee-duration]="duration + 's'" aria-hidden="true">
        @for (i of trackIndices(); track i) {
          <span class="marquee-item">{{ text }}</span>
          <span class="marquee-sep" aria-hidden="true">·</span>
        }
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .marquee {
        overflow: hidden;
        white-space: nowrap;
        padding: 0.6rem 0;
        user-select: none;
      }

      .marquee-dark {
        background: #0a0a0a;
        color: #fff;
      }

      .marquee-track {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        animation: marquee linear infinite;
        animation-duration: var(--marquee-duration, 25s);
      }

      .marquee-item {
        font-family: 'area-normal', sans-serif;
        font-size: clamp(0.85rem, 1.8vw, 1.1rem);
        font-weight: 700;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }

      .marquee-sep {
        opacity: 0.4;
        font-weight: 400;
      }

      @keyframes marquee {
        0% { transform: translateX(0); }
        100% { transform: translateX(-50%); }
      }
    `,
  ],
})
export class MarqueeComponent {
  /** Text to repeat (e.g. YNARCHIVE). */
  @Input() text = 'YNARCHIVE';
  /** Number of copies per half (track is duplicated for seamless loop). */
  @Input() copies = 10;
  /** Animation duration in seconds for one full loop. */
  @Input() duration = 28;
  /** Dark background variant. */
  @Input() dark = false;

  /** Double the items so -50% translate creates seamless loop. */
  readonly trackIndices = computed(() => Array.from({ length: this.copies * 2 }, (_, i) => i));
}
