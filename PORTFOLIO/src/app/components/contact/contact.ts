import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { gsap } from 'gsap';

@Component({
  selector: 'app-contact',
  standalone: true, 
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div id="contact" class="min-h-screen bg-[#d1d3d0] text-black px-6 lg:px-12 pt-20 pb-16 font-sans" #container>

      <div class="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">

        <!-- Left: heading + form -->
        <div class="left-col">
          <h1 class="text-[2.2rem] lg:text-[3.2rem] leading-[1.03] font-medium tracking-tight mb-8">
            Based in Belgium but available for your projects in
            <br class="hidden lg:block" />
            <span class="inline-block text-black/60 h-[1.1em] align-bottom overflow-hidden">
              <span #flipText class="block">the rest of the world</span>
            </span>
          </h1>

          <div class="w-full lg:max-w-[90%]">
            <form [formGroup]="contactForm" (ngSubmit)="onSubmit()" class="space-y-6">
              <div>
                <label class="sr-only">Name</label>
                <input type="text" formControlName="name" placeholder="Name"
                       class="w-full bg-transparent border-0 border-b border-black/20 py-3 text-lg text-black outline-none placeholder:text-black/40 focus:border-black focus:ring-0 transition-colors" />
              </div>

              <div>
                <label class="sr-only">Email</label>
                <input type="email" formControlName="email" placeholder="Email"
                       class="w-full bg-transparent border-0 border-b border-black/20 py-3 text-lg text-black outline-none placeholder:text-black/40 focus:border-black focus:ring-0 transition-colors" />
              </div>

              <div>
                <label class="sr-only">Message</label>
                <textarea formControlName="message" placeholder="Message" rows="6"
                          class="w-full bg-transparent border-0 border-b border-black/20 py-3 text-lg text-black outline-none placeholder:text-black/40 focus:border-black focus:ring-0 transition-colors resize-y min-h-[120px]"></textarea>
              </div>

              <div>
                <button type="submit" [disabled]="contactForm.invalid"
                        class="bg-transparent border-none p-0 text-lg lg:text-xl cursor-pointer underline underline-offset-[6px] opacity-80 hover:opacity-100 disabled:opacity-30 disabled:cursor-not-allowed transition-opacity font-medium">
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Right: contact details + image -->
        <div class="right-col flex flex-col justify-between">
          <div class="contact-details space-y-8">
            <div class="grid grid-cols-[120px_1fr] items-start gap-x-6">
              <span class="text-xs uppercase tracking-widest mt-2 font-medium">BUSINESS</span>
              <span class="text-xl lg:text-2xl hover:underline underline-offset-[6px] cursor-pointer tracking-tight">
                <a href="mailto:yentl.nerinckx@icloud.com">yentl.nerinckx@icloud.com</a>
              </span>
            </div>

            <div class="grid grid-cols-[120px_1fr] items-start gap-x-6">
              <span class="text-xs uppercase tracking-widest mt-2 font-medium">PHONE</span>
              <span class="text-xl lg:text-2xl hover:underline underline-offset-[6px] cursor-pointer tracking-tight">
                <a href="tel:+32475451358">+32 475 45 13 58</a>
              </span>
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
export class ContactComponent implements OnInit {
  contactForm: FormGroup;
  
  @ViewChild('container', { static: true }) container!: ElementRef;
  @ViewChild('flipText', { static: true }) flipText!: ElementRef;

  // De woorden die door de rotatie gaan
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
    // 1. De initiële fade-in van de hele pagina
    gsap.fromTo(this.container.nativeElement.children, 
      { y: 60, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, stagger: 0.15, ease: "power3.out", delay: 0.2 }
    );

    // 2. Start de tekst-rotatie
    this.startTextAnimation();
  }

  startTextAnimation(): void {
    let currentIndex = 0;
    const el = this.flipText.nativeElement;

    // Elke 2.5 seconden wisselt het woord. Dit is snel genoeg voor dynamiek, maar traag genoeg om te lezen.
    setInterval(() => {
      
      // Animatie UIT: schuif omhoog en verdwijn
      gsap.to(el, { 
        yPercent: -100, 
        opacity: 0, 
        duration: 0.4, 
        ease: "power2.in", 
        onComplete: () => {
          
          // Verander de tekst achter de schermen
          currentIndex = (currentIndex + 1) % this.locations.length;
          el.innerText = this.locations[currentIndex];

          // Zet het element stiekem beneden klaar
          gsap.set(el, { yPercent: 100 });

          // Animatie IN: schuif omhoog naar de normale positie
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