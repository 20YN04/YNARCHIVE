import { Component } from '@angular/core';

@Component({
  selector: 'app-layout',
  standalone: true,
  template: `
    <div class="min-h-screen bg-[#f8f8f8] text-[#1a1a1a]">
      <nav class="fixed left-0 top-0 z-50 w-full border-b border-black/15 bg-[#f8f8f8]">
        <div class="mx-auto flex max-w-[1400px] items-center justify-between px-[clamp(1.25rem,4vw,3.5rem)] py-5">
          <div class="font-area-normal text-[11px] font-semibold uppercase tracking-[0.32em]">
            YNARCHIVE
          </div>
          <a class="text-[11px] uppercase tracking-[0.32em] hover:opacity-70" href="#">Menu</a>
        </div>
      </nav>
      <main class="mx-auto max-w-[1400px] px-[clamp(1.25rem,4vw,3.5rem)] pb-20 pt-28">
        <ng-content></ng-content>
      </main>
    </div>
  `
})
export class LayoutComponent {}
