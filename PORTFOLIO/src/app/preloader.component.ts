import { Component } from '@angular/core';

@Component({
  selector: 'app-preloader',
  standalone: true,
  template: `
    <div class="preloader" data-preloader>
      <div class="preloader-left">
        <p>Design studio</p>
        <p>Architecture & interior</p>
        <p>Tessenderlo</p>
        <p>Belgium</p>
      </div>
      <div class="preloader-right">
        <div class="loading-text">Loading</div>
        <div class="counter" data-preloader-counter>0%</div>
      </div>
    </div>
  `
})
export class PreloaderComponent {}
