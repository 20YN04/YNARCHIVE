import { Component, OnInit, OnDestroy, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { gsap } from 'gsap';
import { NavBarComponent } from '../navbar/navbar';

@Component({
  selector: 'app-contact',
  standalone: true, 
  imports: [CommonModule, ReactiveFormsModule, NavBarComponent],
  template: `
    <div id="contact" class="min-h-screen bg-[#d1d3d0] text-black font-sans" #container>
      <app-navbar></app-navbar>

      <div class="px-6 lg:px-12 pt-28 lg:pt-36 pb-16 lg:pb-20">
        <div class="mx-auto w-full max-w-375 grid grid-cols-1 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.9fr)] gap-12 lg:gap-24 items-start">
          <div class="left-col">
            <h1 class="text-[2.2rem] md:text-[3.2rem] lg:text-[4.1rem] leading-[1.02] font-medium tracking-tight max-w-[20ch]">
              <span class="relative z-20">Based in Belgium but available for your projects in</span>
              <span class="relative block h-[1.08em] mt-[-0.08em] overflow-hidden">
                <span #flipText class="absolute inset-0 z-10 block text-black/40">the rest of the world</span>
              </span>
            </h1>

            <div class="mt-10 lg:mt-14 w-full max-w-190">
              <form [formGroup]="contactForm" (ngSubmit)="onSubmit()" class="space-y-7">
                <div>
                  <label class="sr-only">Name</label>
                  <input type="text" formControlName="name" placeholder="Name"
                         class="w-full bg-transparent border-0 border-b border-black/20 py-3 lg:py-4 text-lg lg:text-xl text-black outline-none placeholder:text-black/40 focus:border-black focus:ring-0 transition-colors rounded-none" />
                </div>

                <div>
                  <label class="sr-only">Email</label>
                  <input type="email" formControlName="email" placeholder="Email"
                         class="w-full bg-transparent border-0 border-b border-black/20 py-3 lg:py-4 text-lg lg:text-xl text-black outline-none placeholder:text-black/40 focus:border-black focus:ring-0 transition-colors rounded-none" />
                </div>

                <div>
                  <label class="sr-only">Message</label>
                  <textarea formControlName="message" placeholder="Message" rows="5"
                            class="w-full bg-transparent border-0 border-b border-black/20 py-3 lg:py-4 text-lg lg:text-xl text-black outline-none placeholder:text-black/40 focus:border-black focus:ring-0 transition-colors resize-y min-h-32.5 rounded-none"></textarea>
                </div>

                <div class="pt-1">
                  <button type="submit" [disabled]="contactForm.invalid"
                          class="bg-transparent border-none p-0 text-lg lg:text-xl cursor-pointer underline underline-offset-8px decoration-1 opacity-80 hover:opacity-100 disabled:opacity-30 disabled:cursor-not-allowed transition-opacity font-medium">
                    Send Message
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div class="right-col pt-2 lg:pt-5">
            <div class="space-y-9 lg:space-y-10">
              <div class="grid grid-cols-[120px_1fr] lg:grid-cols-[150px_1fr] items-start gap-x-6">
                <span class="text-xs uppercase tracking-widest mt-2 font-medium">Business</span>
                <span class="text-xl lg:text-[1.6rem] leading-tight tracking-tight">
                  <a href="mailto:yentl.nerinckx@icloud.com" class="hover:underline underline-offset-[6px] decoration-1">yentl.nerinckx&#64;icloud.com</a>
                </span>
              </div>

              <div class="grid grid-cols-[120px_1fr] lg:grid-cols-[150px_1fr] items-start gap-x-6">
                <span class="text-xs uppercase tracking-widest mt-2 font-medium">Phone</span>
                <span class="text-xl lg:text-[1.6rem] leading-tight tracking-tight">
                  <a href="tel:+32475451358" class="hover:underline underline-offset-[6px] decoration-1">+32 475 45 13 58</a>
                </span>
              </div>

              <div class="grid grid-cols-[120px_1fr] lg:grid-cols-[150px_1fr] items-start gap-x-6">
                <span class="text-xs uppercase tracking-widest mt-2 font-medium">Address</span>
                <span class="text-xl lg:text-[1.6rem] leading-snug tracking-tight">Tessenderlo<br>Belgium</span>
              </div>
            </div>

            <div class="mt-12 lg:mt-16 flex items-center gap-2 text-base font-medium tracking-tight">
              <a href="VUL_HIER_JE_LINK_IN" target="_blank" class="hover:underline underline-offset-4 decoration-1 cursor-pointer">Instagram</a>,
              <a href="VUL_HIER_JE_LINK_IN" target="_blank" class="hover:underline underline-offset-4 decoration-1 cursor-pointer">LinkedIn</a>
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
      -webkit-box-shadow: 0 0 0 30px #d1d3d0 inset !important;
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