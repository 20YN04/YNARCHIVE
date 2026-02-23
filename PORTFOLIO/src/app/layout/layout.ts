import { Component } from '@angular/core';

@Component({
  selector: 'app-layout',
  standalone: true,
  template: `
    <div class="min-h-screen bg-[#f8f8f8] text-[#1a1a1a]">
      <nav class="fixed left-0 top-0 z-50 w-full border-b border-black/10 bg-[#f8f8f8]">
        <div class="mx-auto flex max-w-[1200px] items-center justify-between px-6 py-4">
          <div class="font-area-normal text-xs font-bold uppercase tracking-[0.2em]">
            Site Title
          </div>
          <a class="text-xs uppercase tracking-[0.2em] hover:opacity-70" href="#">Menu</a>
        </div>
      </nav>
      <main class="mx-auto max-w-[1200px] px-6 pb-16 pt-24">
        <ng-content></ng-content>
      </main>
    </div>
  `
})
export class LayoutComponent {}
