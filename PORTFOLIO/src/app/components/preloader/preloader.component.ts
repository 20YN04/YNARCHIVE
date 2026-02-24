import { Component } from '@angular/core';

@Component({
  selector: 'app-preloader',
  standalone: true,
  template: `
    <div class="fixed top-0 left-0 z-100 h-screen w-screen bg-black will-change-transform" data-preloader>
      <h1 class="pointer-events-none absolute top-1/2 left-1/2 m-0 w-full -translate-x-1/2 -translate-y-1/2 px-[1vw] text-center font-['area-normal',sans-serif] text-[clamp(4.5rem,15.8vw,17rem)] leading-none font-bold uppercase tracking-[-0.03em] text-white">
        YNARCHIVE
      </h1>
      <div class="relative z-10 flex h-full items-start justify-between px-20 pt-14">
        <div>
          <p class="mb-2 text-sm uppercase tracking-widest text-white">FULL STACK DEVELOPER</p>
          <p class="mb-2 text-sm uppercase tracking-widest text-white">TESSENDERLO</p>
          <p class="m-0 text-sm uppercase tracking-widest text-white">BELGIUM</p>
        </div>
        <div class="text-right">
          <div class="mb-2.5 text-xs uppercase tracking-[0.2em] text-white">Loading</div>
          <div class="text-5xl font-bold text-white" data-preloader-counter>0%</div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `
  ]
})
export class PreloaderComponent {}
