import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { gsap } from 'gsap';
import { NavBarComponent } from '../navbar/navbar';
import { ContactService } from '../../services/contact.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NavBarComponent],
  template: `
    <div id="contact" class="contact-page min-h-screen bg-white text-[#0a0a0a] w-full" #container>
      <app-navbar [fixed]="false" [alwaysVisible]="true" [solidBackground]="true" activePage="contact"></app-navbar>
      <div class="contact-inner mx-auto w-full pt-32 pb-24">
        <h1 class="contact-headline">
          Based in Belgium but available for your projects in
          <br class="hidden lg:block" />
          <span class="contact-headline-rotating">
            <span #flipText class="contact-flip-text">the rest of the world</span>
          </span>
        </h1>
        <p class="contact-subhead">Talk to us about your project</p>

        <div class="contact-grid">
          <div class="contact-left">
            <form [formGroup]="contactForm" (ngSubmit)="onSubmit()" class="contact-form">
              <div class="contact-field">
                <label class="sr-only">Name</label>
                <input type="text" formControlName="name" placeholder="Name" class="contact-input" />
              </div>
              <div class="contact-field">
                <label class="sr-only">Email</label>
                <input type="email" formControlName="email" placeholder="Email" class="contact-input" />
              </div>
              <div class="contact-field">
                <label class="sr-only">Message</label>
                <textarea formControlName="message" placeholder="Message" rows="4" class="contact-input contact-textarea"></textarea>
              </div>
              <button type="submit" [disabled]="contactForm.invalid || submitting" class="contact-submit">
                {{ submitting ? 'Sending…' : 'Send Message' }}
              </button>
              @if (submitSuccess) {
                <p class="contact-message contact-message-success">Thanks! Your message was sent.</p>
              }
              @if (submitError) {
                <p class="contact-message contact-message-error">{{ submitError }}</p>
              }
            </form>
          </div>
          <div class="contact-right">
            <div class="contact-block">
              <span class="contact-label">N</span>
              <p class="contact-value">Tessenderlo<br>Belgium</p>
            </div>
            <div class="contact-block">
              <span class="contact-label">P</span>
              <a href="tel:+32475451358" class="contact-value contact-link">+32 475 45 13 58</a>
            </div>
            <div class="contact-block">
              <span class="contact-label">C</span>
              <a href="mailto:yentl.nerinckx@icloud.com" class="contact-value contact-link">yentl.nerinckx&#64;icloud.com</a>
            </div>
            <div class="contact-block contact-social-wrap">
              <span class="contact-label">S</span>
              <span class="contact-social">
                <a href="#" target="_blank" rel="noopener noreferrer" class="contact-social-link" aria-label="Instagram">Instagram</a>,
                <a href="#" target="_blank" rel="noopener noreferrer" class="contact-social-link" aria-label="LinkedIn">LinkedIn</a>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .contact-page { font-family: 'area-normal', sans-serif; width: 100%; }
    .contact-inner {
      max-width: var(--content-max-width);
      padding-left: clamp(2rem, 6vw, 5rem);
      padding-right: clamp(2rem, 6vw, 5rem);
    }
    .contact-headline {
      font-family: 'area-normal', sans-serif;
      font-size: clamp(2rem, 4.5vw, 3.5rem);
      font-weight: 500;
      letter-spacing: -0.02em;
      line-height: 1.15;
      margin: 0 0 1rem;
      color: #0a0a0a;
    }
    .contact-headline-rotating {
      display: inline-block;
      height: 1.15em;
      overflow: hidden;
      vertical-align: bottom;
    }
    .contact-flip-text { display: block; }
    .contact-subhead {
      font-family: 'area-normal', sans-serif;
      font-size: 1rem;
      color: rgba(10,10,10,0.6);
      margin: 0 0 2.5rem;
    }
    .contact-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 3rem;
      align-items: start;
    }
    .contact-form { display: flex; flex-direction: column; gap: 1.5rem; }
    .contact-field { position: relative; }
    .contact-input {
      width: 100%;
      background: transparent;
      border: 0;
      border-bottom: 1px solid rgba(10,10,10,0.2);
      padding: 0.75rem 0;
      font-family: 'area-normal', sans-serif;
      font-size: 1rem;
      color: #0a0a0a;
      outline: none;
      transition: border-color 0.2s;
    }
    .contact-input::placeholder { color: rgba(10,10,10,0.4); }
    .contact-input:focus { border-color: #0a0a0a; }
    .contact-textarea { resize: vertical; min-height: 100px; }
    .contact-submit {
      background: transparent;
      border: none;
      padding: 0;
      font-family: 'area-normal', sans-serif;
      font-size: 1rem;
      text-decoration: underline;
      text-underline-offset: 6px;
      cursor: pointer;
      color: #0a0a0a;
      opacity: 0.8;
      transition: opacity 0.2s;
      margin-top: 0.5rem;
    }
    .contact-submit:hover:not(:disabled) { opacity: 1; }
    .contact-submit:disabled { opacity: 0.35; cursor: not-allowed; }
    .contact-message { margin: 0.5rem 0 0; font-size: 14px; }
    .contact-message-success { color: #0a0a0a; }
    .contact-message-error { color: #b91c1c; }
    .contact-block {
      display: grid;
      grid-template-columns: 1.5rem 1fr;
      gap: 0.5rem 1rem;
      margin-bottom: 1.5rem;
    }
    .contact-label {
      font-family: 'area-normal', sans-serif;
      font-size: 11px;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: rgba(10,10,10,0.5);
    }
    .contact-value {
      font-family: 'area-normal', sans-serif;
      font-size: 14px;
      line-height: 1.5;
      color: #0a0a0a;
      margin: 0;
    }
    .contact-link { text-decoration: none; transition: opacity 0.2s; }
    .contact-link:hover { opacity: 0.6; }
    .contact-social-wrap { align-items: center; }
    .contact-social-link { color: inherit; text-decoration: underline; text-underline-offset: 4px; transition: opacity 0.2s; }
    .contact-social-link:hover { opacity: 0.6; }
    @media (max-width: 768px) {
      .contact-grid { grid-template-columns: 1fr; }
    }
    input:-webkit-autofill, input:-webkit-autofill:hover, input:-webkit-autofill:focus, input:-webkit-autofill:active,
    textarea:-webkit-autofill {
      -webkit-box-shadow: 0 0 0 30px #fff inset !important;
      -webkit-text-fill-color: #0a0a0a !important;
    }
  `]
})
export class ContactComponent implements OnInit {
  contactForm: FormGroup;
  submitting = false;
  submitSuccess = false;
  submitError: string | null = null;

  @ViewChild('container', { static: true }) container!: ElementRef;
  @ViewChild('flipText', { static: true }) flipText!: ElementRef;

  constructor(
    private fb: FormBuilder,
    private contactService: ContactService
  ) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      message: ['', Validators.required]
    });
  }

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

  ngOnInit(): void {
    const el = this.container?.nativeElement;
    if (el) {
      gsap.fromTo(el.querySelector('.contact-inner'),
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.15 }
      );
    }
    this.startTextAnimation();
  }

  startTextAnimation(): void {
    let currentIndex = 0;
    const el = this.flipText?.nativeElement;
    if (!el) return;
    setInterval(() => {
      gsap.to(el, {
        yPercent: -100,
        opacity: 0,
        duration: 0.4,
        ease: 'power2.in',
        onComplete: () => {
          currentIndex = (currentIndex + 1) % this.locations.length;
          el.innerText = this.locations[currentIndex];
          gsap.set(el, { yPercent: 100 });
          gsap.to(el, {
            yPercent: 0,
            opacity: 1,
            duration: 0.4,
            ease: 'power2.out'
          });
        }
      });
    }, 2500);
  }

  onSubmit(): void {
    if (!this.contactForm.valid || this.submitting) return;
    this.submitting = true;
    this.submitSuccess = false;
    this.submitError = null;
    const payload = this.contactForm.value;
    this.contactService.submit(payload).subscribe({
      next: () => {
        this.submitting = false;
        this.submitSuccess = true;
        this.contactForm.reset();
        setTimeout(() => (this.submitSuccess = false), 5000);
      },
      error: (err) => {
        this.submitting = false;
        this.submitError = err?.error?.error ?? 'Something went wrong. Please try again.';
      }
    });
  }
}