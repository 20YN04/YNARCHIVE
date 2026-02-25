import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { gsap } from 'gsap';
import { NavBarComponent } from '../navbar/navbar';

@Component({
  selector: 'app-contact',
  standalone: true, 
  imports: [CommonModule, ReactiveFormsModule, NavBarComponent],
  template: `
    <div id="contact" class="min-h-screen bg-white text-[#0a0a0a]" #container>
      <app-navbar [fixed]="false" [alwaysVisible]="true" [solidBackground]="true" activePage="contact"></app-navbar>

      <div class="mx-auto w-full max-w-[1400px] px-6 md:px-10 lg:px-14 pt-10 md:pt-14 lg:pt-16 pb-16 lg:pb-24">
        <!-- Hero title -->
        <h1 class="font-bold text-[clamp(3rem,12vw,10rem)] leading-[0.9] tracking-tighter uppercase">
          GET IN TOUCH
        </h1>
        <p class="mt-4 md:mt-6 max-w-[46ch] text-base md:text-lg text-black/60 leading-relaxed">
          <span>Based in Belgium but available for your projects in</span>
          <span class="relative inline-block h-[1.2em] w-[12ch] overflow-hidden align-bottom">
            <span #flipText class="absolute inset-0 text-black/40">the world</span>
          </span>
        </p>

        <!-- Two-column layout -->
        <div class="mt-12 md:mt-16 lg:mt-20 grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-start">
          <!-- Left: Form -->
          <div>
            <form [formGroup]="contactForm" (ngSubmit)="onSubmit()" class="flex flex-col gap-8">
              <div>
                <label class="sr-only" for="contact-name">Name</label>
                <input id="contact-name" type="text" formControlName="name" placeholder="Name"
                       class="w-full bg-transparent border-0 border-b border-black/15 py-3 text-lg text-[#0a0a0a] outline-none placeholder:text-black/30 focus:border-black transition-colors duration-200 rounded-none" />
              </div>
              <div>
                <label class="sr-only" for="contact-email">Email</label>
                <input id="contact-email" type="email" formControlName="email" placeholder="Email"
                       class="w-full bg-transparent border-0 border-b border-black/15 py-3 text-lg text-[#0a0a0a] outline-none placeholder:text-black/30 focus:border-black transition-colors duration-200 rounded-none" />
              </div>
              <div>
                <label class="sr-only" for="contact-message">Message</label>
                <textarea id="contact-message" formControlName="message" placeholder="Message" rows="5"
                          class="w-full bg-transparent border-0 border-b border-black/15 py-3 text-lg text-[#0a0a0a] outline-none placeholder:text-black/30 focus:border-black transition-colors duration-200 resize-y min-h-32 rounded-none"></textarea>
              </div>
              <div>
                <button type="submit" [disabled]="contactForm.invalid"
                        class="bg-transparent border-none p-0 text-lg cursor-pointer underline underline-offset-8 decoration-1 text-[#0a0a0a] opacity-80 hover:opacity-100 disabled:opacity-25 disabled:cursor-not-allowed transition-opacity duration-200 font-medium">
                  Send Message
                </button>
              </div>
            </form>
          </div>

          <!-- Right: Info -->
          <div class="flex flex-col gap-8">
            <div class="border-b border-black/8 pb-6">
              <p class="text-[11px] uppercase tracking-[0.2em] text-black/40">Business</p>
              <a href="mailto:yentl.nerinckx@icloud.com"
                 class="mt-2 block text-lg md:text-xl tracking-tight hover:opacity-60 transition-opacity duration-200">
                yentl.nerinckx&#64;icloud.com
              </a>
            </div>

            <div class="border-b border-black/8 pb-6">
              <p class="text-[11px] uppercase tracking-[0.2em] text-black/40">Phone</p>
              <a href="tel:+32475451358"
                 class="mt-2 block text-lg md:text-xl tracking-tight hover:opacity-60 transition-opacity duration-200">
                +32 475 45 13 58
              </a>
            </div>

            <div class="border-b border-black/8 pb-6">
              <p class="text-[11px] uppercase tracking-[0.2em] text-black/40">Address</p>
              <p class="mt-2 text-lg md:text-xl tracking-tight leading-snug">Tessenderlo<br>Belgium</p>
            </div>

            <div class="flex items-center gap-3 text-sm tracking-tight">
              <a href="VUL_HIER_JE_LINK_IN" target="_blank" class="underline underline-offset-4 decoration-1 hover:opacity-60 transition-opacity duration-200">Instagram</a>
              <span class="text-black/20">·</span>
              <a href="VUL_HIER_JE_LINK_IN" target="_blank" class="underline underline-offset-4 decoration-1 hover:opacity-60 transition-opacity duration-200">LinkedIn</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    input:-webkit-autofill,
    input:-webkit-autofill:hover, 
    input:-webkit-autofill:focus, 
    input:-webkit-autofill:active,
    textarea:-webkit-autofill {
      -webkit-box-shadow: 0 0 0 30px #fff inset !important;
      -webkit-text-fill-color: black !important;
      transition: background-color 5000s ease-in-out 0s;
    }
  `]
})
export class ContactComponent implements OnInit, AfterViewInit {
  contactForm: FormGroup;
  
  @ViewChild('container', { static: true }) container!: ElementRef;
  @ViewChild('flipText', { static: true }) flipText!: ElementRef;

  locations = [
    'the rest of the world',
    'France',
    'Germany',
    'the Netherlands',
    'Italy',
    'Spain',
    'Denmark',
    'Sweden'
  ];

  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      message: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    gsap.fromTo(this.container.nativeElement.children, 
      { y: 60, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, stagger: 0.15, ease: "power3.out", delay: 0.2 }
    );

    this.startTextAnimation();
  }

  ngAfterViewInit(): void {
    // ...existing code...
  }

  startTextAnimation(): void {
    let currentIndex = 0;
    const el = this.flipText.nativeElement;

    setInterval(() => {
      gsap.to(el, { 
        yPercent: -100, 
        opacity: 0, 
        duration: 0.4, 
        ease: "power2.in", 
        onComplete: () => {
          currentIndex = (currentIndex + 1) % this.locations.length;
          el.innerText = this.locations[currentIndex];
          gsap.set(el, { yPercent: 100 });
          gsap.to(el, { 
            yPercent: 0, 
            opacity: 1, 
            duration: 0.4, 
            ease: "power2.out" 
          });
        }
      });
    }, 2500);
  }

  onSubmit(): void {
    if (this.contactForm.valid) {
      console.log('Formulier Data:', this.contactForm.value);
      this.contactForm.reset();
    }
  }

  // ...existing code...
}