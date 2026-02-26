import { Component } from '@angular/core';

@Component({
  selector: 'app-layout',
  standalone: true,
  template: `
    <div class="min-h-screen bg-white text-[#0a0a0a] w-full">
      <main class="layout-main mx-auto w-full max-w-[1400px] pb-20 pt-0">
        <ng-content></ng-content>
      </main>
    </div>
  `,
  styles: [`
    .layout-main {
      padding-left: clamp(2rem, 6vw, 5rem);
      padding-right: clamp(2rem, 6vw, 5rem);
    }
  `]
})
export class LayoutComponent {}
