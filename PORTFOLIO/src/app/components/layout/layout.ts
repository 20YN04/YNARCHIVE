import { Component } from '@angular/core';

@Component({
  selector: 'app-layout',
  standalone: true,
  template: `
    <div class="min-h-screen bg-[#f8f8f8] text-[#1a1a1a]">
      <main class="mx-auto max-w-350 px-[clamp(1.25rem,4vw,3.5rem)] pb-20 pt-0">
        <ng-content></ng-content>
      </main>
    </div>
  `
})
export class LayoutComponent {}
