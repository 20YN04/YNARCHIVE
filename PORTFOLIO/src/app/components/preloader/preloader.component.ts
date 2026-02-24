import { Component } from '@angular/core';

@Component({
  selector: 'app-preloader',
  standalone: true,
  template: `
    <div class="preloader" data-preloader>
      <!-- Slide-clock YNARCHIVE letters -->
      <div class="slide-clock" data-slide-clock>
        <div class="letter-mask"><span class="letter" data-letter>Y</span></div>
        <div class="letter-mask"><span class="letter" data-letter>N</span></div>
        <div class="letter-mask"><span class="letter" data-letter>A</span></div>
        <div class="letter-mask"><span class="letter" data-letter>R</span></div>
        <div class="letter-mask"><span class="letter" data-letter>C</span></div>
        <div class="letter-mask"><span class="letter" data-letter>H</span></div>
        <div class="letter-mask"><span class="letter" data-letter>I</span></div>
        <div class="letter-mask"><span class="letter" data-letter>V</span></div>
        <div class="letter-mask"><span class="letter" data-letter>E</span></div>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .preloader {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: #0a0a0a;
        z-index: 200;
        display: flex;
        align-items: center;
        justify-content: center;
        will-change: transform;
      }

      .slide-clock {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0;
      }

      .letter-mask {
        overflow: hidden;
        display: inline-flex;
        align-items: center;
        line-height: 1;
      }

      .letter {
        display: inline-block;
        font-family: 'area-normal', sans-serif;
        font-size: clamp(3.5rem, 12vw, 12rem);
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: -0.03em;
        color: #fff;
        line-height: 1;
        transform: translateY(110%);
        will-change: transform;
      }
    `
  ]
})
export class PreloaderComponent {}
