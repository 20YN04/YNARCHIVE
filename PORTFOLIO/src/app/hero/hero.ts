import { AfterViewInit, Component, OnDestroy, signal } from '@angular/core';

@Component({
  selector: 'app-hero',
  standalone: true,
  template: `
    <section class="relative min-h-screen w-full bg-white">
      <!-- MEGA TITLE BAR -->
      <div class="relative z-1 flex h-50 items-center justify-center overflow-hidden bg-black">
        <h1 class="m-0 w-full px-[1vw] text-center font-['area-normal',sans-serif] text-[clamp(4.5rem,15.8vw,17rem)] leading-none font-bold uppercase tracking-[-0.03em] text-white opacity-100" data-hero-title style="padding-bottom: 40px;">YNARCHIVE</h1>
      </div>
      
      <!-- NAVIGATION BAR -->
      <nav class="relative z-1 flex h-17.5 items-center justify-between border-b border-[#f0f0f0] bg-white px-10" data-nav-bar>
        <div class="text-[15px]">
          <a class="mr-1 text-black no-underline transition-opacity duration-300 hover:opacity-60" href="#work">Work,</a>
          <a class="mr-1 text-black no-underline transition-opacity duration-300 hover:opacity-60" href="#process">Process,</a>
          <a class="text-black no-underline transition-opacity duration-300 hover:opacity-60" href="#studio">Studio</a>
        </div>
        <div class="flex items-center gap-1 font-mono text-sm">
          <span>{{ timeHour() }}</span><span class="time-colon">:</span><span>{{ timeMinute() }}</span>
          <span class="ml-2">{{ timePeriod() }}</span>
          <span class="ml-2 font-['area-normal',sans-serif] text-black">TESSENDERLO, BEL</span>
        </div>
        <div>
          <a class="text-[15px] text-black no-underline transition-opacity duration-300 hover:opacity-60" href="#contact">Contact</a>
        </div>
      </nav>
      
      <!-- HERO IMAGE -->
      <section class="relative bg-white px-10 py-20">
        <figure class="relative mx-auto aspect-4/3 w-[60%] min-w-160 max-w-225 overflow-hidden" data-hero-image>
          <img
            class="h-full w-full object-cover will-change-transform"
            [style.transform]="'translateY(' + parallaxY() + 'px)'"
            src="https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1800&q=80"
            alt="Architectural project"
          />
        </figure>
      </section>
      
      <!-- BOTTOM ELEMENTS -->
      <div class="relative h-25 bg-white px-10">
        <span class="scroll-indicator absolute bottom-10 left-10 text-[13px] text-[#ccc]">[Scroll down]</span>
        <p class="absolute right-10 bottom-10 m-0 max-w-87.5 text-left text-[20px] leading-[1.4] text-black">Driven by History, Centered on Context, Embracing Culture</p>
      </div>
    </section>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .time-colon {
        animation: blink 1s steps(1, end) infinite;
      }
      
      @keyframes blink {
        50% { opacity: 0; }
      }

      .scroll-indicator {
        animation: bounce 2s infinite;
      }
      
      @keyframes bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(5px); }
      }
    `
  ]
})
export class HeroComponent implements AfterViewInit, OnDestroy {
  readonly timeHour = signal('00');
  readonly timeMinute = signal('00');
  readonly timePeriod = signal('AM');
  readonly parallaxY = signal(0);
  private clockTimer = window.setInterval(() => this.updateTime(), 1000);
  private readonly onScroll = () => this.updateParallax();

  ngAfterViewInit(): void {
    this.updateTime();
    this.updateParallax();
    window.addEventListener('scroll', this.onScroll, { passive: true });
  }

  ngOnDestroy(): void {
    window.clearInterval(this.clockTimer);
    window.removeEventListener('scroll', this.onScroll);
  }

  private updateTime(): void {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const hour12 = hours % 12 || 12;
    this.timeHour.set(String(hour12).padStart(2, '0'));
    this.timeMinute.set(String(minutes).padStart(2, '0'));
    this.timePeriod.set(hours >= 12 ? 'PM' : 'AM');
  }

  private updateParallax(): void {
    const offset = Math.min(60, window.scrollY * 0.08);
    this.parallaxY.set(offset);
  }
}
