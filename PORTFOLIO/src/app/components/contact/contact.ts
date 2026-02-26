import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { gsap } from 'gsap';

@Component({
  selector: 'app-contact',
  standalone: true, 
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div id="contact" class="contact-page min-h-screen bg-[#d1d3d0] text-black px-6 lg:px-24 pt-32 lg:pt-48 pb-24 relative flex flex-col" #container>

      <div class="contact-inner grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-16 lg:gap-32 items-start w-full max-w-[1600px] mx-auto">

        <div class="left-col flex flex-col w-full">
          <h1 class="contact-headline text-[2.5rem] lg:text-[4rem] xl:text-[4.5rem] leading-[1.03] font-medium tracking-tight mb-16 lg:mb-20 max-w-[95%]">
            Based in Belgium but available for your projects in
            <br class="hidden lg:block" />
            <span class="inline-block text-black/60 h-[1.1em] align-bottom overflow-hidden">
              <span #flipText class="block">the rest of the world</span>
            </span>
          </h1>

          <div class="w-full lg:max-w-[80%]">
            <form [formGroup]="contactForm" (ngSubmit)="onSubmit()" class="space-y-8">
              
              <div class="relative">
                <label class="sr-only">Name</label>
                <input type="text" formControlName="name" placeholder="Name"
                       class="w-full bg-transparent border-0 border-b border-black/20 py-4 text-lg lg:text-xl text-black outline-none placeholder:text-black/40 focus:border-black focus:ring-0 transition-colors rounded-none" />
              </div>

              <div class="relative">
                <label class="sr-only">Email</label>
                <input type="email" formControlName="email" placeholder="Email"
                       class="w-full bg-transparent border-0 border-b border-black/20 py-4 text-lg lg:text-xl text-black outline-none placeholder:text-black/40 focus:border-black focus:ring-0 transition-colors rounded-none" />
              </div>

              <div class="relative mt-4">
                <label class="sr-only">Message</label>
                <textarea formControlName="message" placeholder="Message" rows="4"
                          class="w-full bg-transparent border-0 border-b border-black/20 py-4 text-lg lg:text-xl text-black outline-none placeholder:text-black/40 focus:border-black focus:ring-0 transition-colors resize-y min-h-[100px] rounded-none"></textarea>
              </div>

              <div class="pt-4">
                <button type="submit" [disabled]="contactForm.invalid"
                        class="bg-transparent border-none p-0 text-xl cursor-pointer underline underline-offset-8 decoration-1 opacity-80 hover:opacity-100 disabled:opacity-30 disabled:cursor-not-allowed transition-opacity font-medium">
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>

        <div class="right-col flex flex-col pt-4 lg:pt-6">
          <div class="contact-details space-y-10 lg:space-y-12">
            
            <div class="grid grid-cols-[120px_1fr] lg:grid-cols-[160px_1fr] items-start gap-x-4">
              <span class="text-xs uppercase tracking-widest mt-2 font-medium">BUSINESS</span>
              <span class="text-xl lg:text-[1.7rem] leading-tight hover:underline underline-offset-[6px] decoration-1 cursor-pointer tracking-tight">
                <a href="mailto:yentl.nerinckx@icloud.com">yentl.nerinckx&#64;icloud.com</a>
              </span>
            </div>

            <div class="grid grid-cols-[120px_1fr] lg:grid-cols-[160px_1fr] items-start gap-x-4">
              <span class="text-xs uppercase tracking-widest mt-2 font-medium">PHONE</span>
              <span class="text-xl lg:text-[1.7rem] leading-tight hover:underline underline-offset-[6px] decoration-1 cursor-pointer tracking-tight">
                <a href="tel:+32475451358">+32 475 45 13 58</a>
              </span>
            </div>

          </div>
        </div>

      </div>

      <div class="contact-social mt-24 lg:mt-0 lg:absolute lg:bottom-12 lg:left-24 flex items-center gap-1 text-base font-medium tracking-tight">
        <a href="#" target="_blank" rel="noopener noreferrer" class="hover:underline underline-offset-4 decoration-1 cursor-pointer" aria-label="Instagram">Instagram</a>,
        <a href="#" target="_blank" rel="noopener noreferrer" class="hover:underline underline-offset-4 decoration-1 cursor-pointer ml-1" aria-label="LinkedIn">LinkedIn</a>
      </div>

    </div>
  `,
  styles: [`
    .contact-page {
      font-family: 'area-normal', sans-serif;
    }
    .contact-headline,
    .contact-inner input,
    .contact-inner textarea,
    .contact-inner button,
    .contact-details,
    .contact-social {
      font-family: 'area-normal', sans-serif;
    }
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
export class ContactComponent implements OnInit {
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
}