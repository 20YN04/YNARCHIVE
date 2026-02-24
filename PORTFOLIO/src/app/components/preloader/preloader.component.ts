import { Component } from '@angular/core';

@Component({
  selector: 'app-preloader',
  standalone: true,
  template: `
    <div class="preloader" data-preloader>
      <!-- Big centered YNARCHIVE watermark -->
      <h1 class="preloader-title" data-preloader-title>YNARCHIVE</h1>

      <!-- Content overlay -->
      <div class="preloader-content">
        <!-- Left column -->
        <div class="preloader-left" data-preloader-left>
          <p class="preloader-label">Full stack developer</p>
          <p class="preloader-label">& Creative technologist</p>
        </div>

        <!-- Right column -->
        <div class="preloader-right" data-preloader-right>
          <p class="preloader-label">Tessenderlo</p>
          <p class="preloader-label">Belgium</p>
        </div>

        <!-- Bottom center: Loading + counter -->
        <div class="preloader-bottom" data-preloader-bottom>
          <div class="preloader-loading-label">Loading</div>
          <div class="preloader-counter" data-preloader-counter>0%</div>
        </div>
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
        z-index: 100;
        overflow: hidden;
        will-change: transform;
      }

      .preloader-title {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        margin: 0;
        font-family: 'area-normal', sans-serif;
        font-size: clamp(4rem, 14vw, 15rem);
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: -0.03em;
        line-height: 0.9;
        color: rgba(255, 255, 255, 0.06);
        white-space: nowrap;
        pointer-events: none;
        z-index: 1;
      }

      .preloader-content {
        position: relative;
        z-index: 2;
        width: 100%;
        height: 100%;
        display: flex;
        padding: 3rem 2.5rem;
      }

      .preloader-left {
        position: absolute;
        top: 3rem;
        left: 2.5rem;
      }

      .preloader-right {
        position: absolute;
        top: 3rem;
        right: 2.5rem;
        text-align: right;
      }

      .preloader-label {
        font-family: 'area-normal', sans-serif;
        font-size: 13px;
        font-weight: 400;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: rgba(255, 255, 255, 0.6);
        margin: 0 0 6px 0;
        line-height: 1.5;
      }

      .preloader-bottom {
        position: absolute;
        bottom: 3rem;
        left: 50%;
        transform: translateX(-50%);
        text-align: center;
      }

      .preloader-loading-label {
        font-family: 'area-normal', sans-serif;
        font-size: 11px;
        text-transform: uppercase;
        letter-spacing: 0.25em;
        color: rgba(255, 255, 255, 0.4);
        margin-bottom: 12px;
      }

      .preloader-counter {
        font-family: 'area-normal', sans-serif;
        font-size: clamp(3rem, 6vw, 5rem);
        font-weight: 700;
        color: #fff;
        letter-spacing: -0.03em;
        line-height: 1;
      }

      @media (max-width: 768px) {
        .preloader-content {
          padding: 2rem 1.5rem;
        }
        .preloader-left {
          top: 2rem;
          left: 1.5rem;
        }
        .preloader-right {
          top: 2rem;
          right: 1.5rem;
        }
        .preloader-bottom {
          bottom: 2rem;
        }
        .preloader-label {
          font-size: 11px;
        }
      }
    `
  ]
})
export class PreloaderComponent {}
