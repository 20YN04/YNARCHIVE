import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ContactService } from '../../services/contact.service';

@Component({
  selector: 'app-contact-section',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <section id="contact" class="contact-section" data-contact-section>
      <div class="contact-inner">
        <!-- Label -->
        <div class="section-label-wrap" data-contact-label>
          <span class="section-bullet">&bull;</span>
          <span class="section-label">Contact</span>
        </div>

        <!-- Headline -->
        <div class="contact-headline-wrap" data-contact-headline>
          <h2 class="contact-headline">
            Based in Belgium but available for your projects in
            <br class="lg-break" />
            <span class="contact-headline-rotating">
              <span #flipText class="contact-flip-text">the rest of the world</span>
            </span>
          </h2>
          <p class="contact-subhead">Talk to us about your project</p>
        </div>

        <!-- Grid: form + info -->
        <div class="contact-grid" data-contact-grid>
          <div class="contact-left">
            <form
              [formGroup]="contactForm"
              (ngSubmit)="onSubmit()"
              class="contact-form"
            >
              <div class="contact-field">
                <label class="sr-only">Name</label>
                <input
                  type="text"
                  formControlName="name"
                  placeholder="Name"
                  class="contact-input"
                />
              </div>
              <div class="contact-field">
                <label class="sr-only">Email</label>
                <input
                  type="email"
                  formControlName="email"
                  placeholder="Email"
                  class="contact-input"
                />
              </div>
              <div class="contact-field">
                <label class="sr-only">Message</label>
                <textarea
                  formControlName="message"
                  placeholder="Message"
                  rows="4"
                  class="contact-input contact-textarea"
                ></textarea>
              </div>
              <button
                type="submit"
                [disabled]="contactForm.invalid || submitting"
                class="contact-submit"
              >
                {{ submitting ? 'Sending…' : 'Send Message' }}
              </button>
              @if (submitSuccess) {
                <p class="contact-message contact-message-success">
                  Thanks! Your message was sent.
                </p>
              }
              @if (submitError) {
                <p class="contact-message contact-message-error">
                  {{ submitError }}
                </p>
              }
            </form>
          </div>

          <div class="contact-right">
            <div class="contact-block">
              <span class="contact-label-letter">N</span>
              <p class="contact-value">Tessenderlo<br />Belgium</p>
            </div>
            <div class="contact-block">
              <span class="contact-label-letter">P</span>
              <a href="tel:+32475451358" class="contact-value contact-link"
                >+32 475 45 13 58</a
              >
            </div>
            <div class="contact-block">
              <span class="contact-label-letter">C</span>
              <a
                href="mailto:yentl.nerinckx@icloud.com"
                class="contact-value contact-link"
                >yentl.nerinckx&#64;icloud.com</a
              >
            </div>
            <div class="contact-block contact-social-wrap">
              <span class="contact-label-letter">S</span>
              <span class="contact-social">
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="contact-social-link"
                  >Instagram</a
                >,
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="contact-social-link"
                  >LinkedIn</a
                >
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .contact-section {
        position: relative;
        padding: clamp(6rem, 14vw, 10rem) clamp(1.5rem, 4vw, 4rem);
        background: #0a0a0a;
        color: #fff;
      }

      .contact-inner {
        max-width: var(--content-max-width);
        margin: 0 auto;
      }

      /* ── Label ── */
      .section-label-wrap {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 2rem;
      }
      .section-bullet {
        font-size: 10px;
        color: rgba(255, 255, 255, 0.6);
      }
      .section-label {
        font-family: 'area-normal', sans-serif;
        font-size: 11px;
        font-weight: 500;
        letter-spacing: 0.08em;
        color: rgba(255, 255, 255, 0.6);
      }

      /* ── Headline ── */
      .contact-headline {
        font-family: 'area-normal', sans-serif;
        font-size: clamp(1.8rem, 4vw, 3rem);
        font-weight: 500;
        letter-spacing: -0.02em;
        line-height: 1.15;
        margin: 0 0 0.75rem;
        color: #fff;
      }
      .lg-break {
        display: none;
      }
      @media (min-width: 1024px) {
        .lg-break {
          display: block;
        }
      }
      .contact-headline-rotating {
        display: inline-block;
        height: 1.15em;
        overflow: hidden;
        vertical-align: bottom;
      }
      .contact-flip-text {
        display: block;
      }
      .contact-subhead {
        font-family: 'area-normal', sans-serif;
        font-size: 1rem;
        color: rgba(255, 255, 255, 0.5);
        margin: 0 0 clamp(2rem, 4vw, 3.5rem);
      }

      /* ── Grid ── */
      .contact-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 3rem;
        align-items: start;
      }

      /* ── Form ── */
      .contact-form {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }
      .contact-field {
        position: relative;
      }
      .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        border: 0;
      }
      .contact-input {
        width: 100%;
        background: transparent;
        border: 0;
        border-bottom: 1px solid rgba(255, 255, 255, 0.2);
        padding: 0.75rem 0;
        font-family: 'area-normal', sans-serif;
        font-size: 1rem;
        color: #fff;
        outline: none;
        transition: border-color 0.2s;
      }
      .contact-input::placeholder {
        color: rgba(255, 255, 255, 0.35);
      }
      .contact-input:focus {
        border-color: rgba(255, 255, 255, 0.7);
      }
      .contact-textarea {
        resize: vertical;
        min-height: 100px;
      }
      .contact-submit {
        background: transparent;
        border: none;
        padding: 0;
        font-family: 'area-normal', sans-serif;
        font-size: 1rem;
        text-decoration: underline;
        text-underline-offset: 6px;
        cursor: pointer;
        color: #fff;
        opacity: 0.8;
        transition: opacity 0.2s;
        margin-top: 0.5rem;
      }
      .contact-submit:hover:not(:disabled) {
        opacity: 1;
      }
      .contact-submit:disabled {
        opacity: 0.35;
        cursor: not-allowed;
      }
      .contact-message {
        margin: 0.5rem 0 0;
        font-size: 14px;
      }
      .contact-message-success {
        color: rgba(255, 255, 255, 0.8);
      }
      .contact-message-error {
        color: #ef4444;
      }

      /* ── Info blocks ── */
      .contact-block {
        display: grid;
        grid-template-columns: 1.5rem 1fr;
        gap: 0.5rem 1rem;
        margin-bottom: 1.5rem;
      }
      .contact-label-letter {
        font-family: 'area-normal', sans-serif;
        font-size: 11px;
        letter-spacing: 0.15em;
        text-transform: uppercase;
        color: rgba(255, 255, 255, 0.4);
      }
      .contact-value {
        font-family: 'area-normal', sans-serif;
        font-size: 14px;
        line-height: 1.5;
        color: rgba(255, 255, 255, 0.85);
        margin: 0;
      }
      .contact-link {
        text-decoration: none;
        color: rgba(255, 255, 255, 0.85);
        transition: opacity 0.2s;
      }
      .contact-link:hover {
        opacity: 0.6;
      }
      .contact-social-wrap {
        align-items: center;
      }
      .contact-social-link {
        color: rgba(255, 255, 255, 0.85);
        text-decoration: underline;
        text-underline-offset: 4px;
        transition: opacity 0.2s;
      }
      .contact-social-link:hover {
        opacity: 0.6;
      }

      /* ── Autofill fix ── */
      input:-webkit-autofill,
      input:-webkit-autofill:hover,
      input:-webkit-autofill:focus,
      input:-webkit-autofill:active,
      textarea:-webkit-autofill {
        -webkit-box-shadow: 0 0 0 30px #0a0a0a inset !important;
        -webkit-text-fill-color: #fff !important;
      }

      @media (max-width: 768px) {
        .contact-grid {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class ContactSectionComponent implements AfterViewInit, OnDestroy {
  private readonly el = inject(ElementRef);
  private readonly fb = inject(FormBuilder);
  private readonly contactService = inject(ContactService);

  @ViewChild('flipText', { static: true }) flipText!: ElementRef;

  contactForm: FormGroup;
  submitting = false;
  submitSuccess = false;
  submitError: string | null = null;

  private scrollTriggers: ScrollTrigger[] = [];
  private flipInterval: any;

  locations = [
    'the rest of the world',
    'France',
    'Germany',
    'the Netherlands',
    'Italy',
    'Spain',
    'Denmark',
    'Sweden',
  ];

  constructor() {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      message: ['', Validators.required],
    });
  }

  ngAfterViewInit(): void {
    this.startTextAnimation();
    requestAnimationFrame(() => {
      setTimeout(() => this.setupAnimations(), 100);
    });
  }

  private setupAnimations(): void {
    const host = this.el.nativeElement as HTMLElement;
    const label = host.querySelector('[data-contact-label]');
    const headline = host.querySelector('[data-contact-headline]');
    const grid = host.querySelector('[data-contact-grid]');

    const reveal = (
      trigger: Element | null,
      targets: Element | Element[] | null,
      from: gsap.TweenVars
    ) => {
      if (!trigger || !targets) return;
      const tween = gsap.from(targets, {
        ...from,
        scrollTrigger: {
          trigger,
          start: 'top 88%',
          end: 'top 55%',
          scrub: 0.6,
        },
      });
      if (tween.scrollTrigger) this.scrollTriggers.push(tween.scrollTrigger);
    };

    reveal(label, label, { y: 24, opacity: 0 });
    reveal(headline, headline, { y: 40, opacity: 0 });
    reveal(grid, grid, { y: 50, opacity: 0 });

    ScrollTrigger.refresh();
  }

  private startTextAnimation(): void {
    let currentIndex = 0;
    const el = this.flipText?.nativeElement;
    if (!el) return;
    this.flipInterval = setInterval(() => {
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
            ease: 'power2.out',
          });
        },
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
        const msg =
          err?.error?.error ??
          err?.message ??
          'Something went wrong. Please try again.';
        this.submitError = msg;
      },
    });
  }

  ngOnDestroy(): void {
    if (this.flipInterval) clearInterval(this.flipInterval);
    this.scrollTriggers.forEach((st) => st.kill());
    this.scrollTriggers = [];
  }
}
