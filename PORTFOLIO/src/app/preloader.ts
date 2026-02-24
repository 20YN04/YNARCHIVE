import { Component } from '@angular/core';

@Component({
  selector: 'app-preloader',
  standalone: true,
  template: `
    <div class="preloader-root fixed inset-0 z-[100]" data-preloader>
      <div class="preloader-mask absolute inset-0 bg-black"></div>
      <div class="preloader-content">
        <div class="preloader-left">
          <div>FULL STACK DEVELOPER</div>
          <div>TESSENDERLO</div>
          <div>BELGIUM</div>
        </div>
        <div class="preloader-right">
          <div class="preloader-loading">Loading</div>
          <div class="preloader-counter" data-preloader-counter>0%</div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .preloader-root {
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .preloader-content {
        position: relative;
        z-index: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        padding: 0 80px;
      }

      .preloader-left {
        width: 40%;
        color: #ffffff;
        font-size: 14px;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        display: grid;
        gap: 8px;
      }

      .preloader-right {
        width: 20%;
        text-align: right;
        color: #ffffff;
      }

      .preloader-loading {
        font-size: 12px;
        letter-spacing: 0.2em;
        text-transform: uppercase;
      }

      .preloader-counter {
        font-size: 48px;
        font-weight: 700;
        line-height: 1;
      }
    `
  ]
})
export class PreloaderComponent {}
