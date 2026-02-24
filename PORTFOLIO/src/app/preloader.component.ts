import { Component } from '@angular/core';

@Component({
  selector: 'app-preloader',
  standalone: true,
  template: `
    <div class="preloader" data-preloader>
      <div class="preloader-left">
        <p>FULL STACK DEVELOPER</p>
        <p>TESSENDERLO</p>
        <p>BELGIUM</p>
      </div>
      <div class="preloader-right">
        <div class="loading-text">Loading</div>
        <div class="counter" data-preloader-counter>0%</div>
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
        background: #000;
        z-index: 100;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 80px;
        will-change: transform;
      }
      
      .preloader-left p {
        color: #fff;
        font-size: 14px;
        letter-spacing: 0.1em;
        margin: 0 0 8px 0;
        text-transform: uppercase;
      }
      
      .preloader-left p:last-child {
        margin-bottom: 0;
      }
      
      .preloader-right {
        text-align: right;
      }
      
      .loading-text {
        color: #fff;
        font-size: 12px;
        text-transform: uppercase;
        letter-spacing: 0.2em;
        margin-bottom: 10px;
      }
      
      .counter {
        color: #fff;
        font-size: 48px;
        font-weight: bold;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }
    `
  ]
})
export class PreloaderComponent {}
