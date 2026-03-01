import { Component } from '@angular/core';

@Component({
  selector: 'app-preloader',
  standalone: true,
  template: `
    <div class="preloader" data-preloader>
      <!-- Left info -->
      <div class="preloader-info preloader-left" data-preloader-info>
        <p class="info-line">YENTL NERINCKX</p>
        <p class="info-line info-sub">FULL STACK DEVELOPER</p>
      </div>

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

      <!-- Right info -->
      <div class="preloader-info preloader-right" data-preloader-info>
        <p class="info-line">TESSENDERLO</p>
        <p class="info-line info-sub">BEL</p>
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
        will-change: height, opacity;
        overflow: hidden;
      }

      .preloader-info {
        position: absolute;
        bottom: 2.5rem;
        opacity: 0;
        will-change: opacity;
      }

      .preloader-left {
        left: 2.5rem;
      }

      .preloader-right {
        right: 2.5rem;
        text-align: right;
      }

      .info-line {
        margin: 0;
        font-family: 'area-normal', sans-serif;
        font-size: 12px;
        font-weight: 600;
        letter-spacing: 0.15em;
        text-transform: uppercase;
        color: #fff;
        line-height: 1.6;
      }

      .info-sub {
        font-weight: 400;
        opacity: 0.5;
        font-size: 11px;
        letter-spacing: 0.2em;
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
