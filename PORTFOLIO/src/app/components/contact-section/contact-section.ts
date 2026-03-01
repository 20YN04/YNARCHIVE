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

        <!-- Headline with word-by-word reveal -->
        <div class="contact-headline-wrap" data-contact-headline>
          <h2 class="contact-headline" data-split-headline>
            Based in Belgium but available for your projects in
            <br class="lg-break" />
            <span class="contact-headline-rotating">
              <span #flipText class="contact-flip-text">the rest of the world</span>
            </span>
          </h2>
          <p class="contact-subhead" data-contact-subhead>Talk to us about your project</p>
        </div>

        <!-- Draw-line divider -->
        <div class="draw-line" data-draw-line></div>

        <!-- Grid: form + info -->
        <div class="contact-grid" data-contact-grid>
          <div class="contact-left">
            <form
              [formGroup]="contactForm"
              (ngSubmit)="onSubmit()"
              class="contact-form"
            >
              <div class="contact-field" data-contact-field>
                <label class="sr-only">Name</label>
                <input
                  type="text"
                  formControlName="name"
                  placeholder="Name"
                  class="contact-input"
                />
                <span class="input-line" data-input-line></span>
              </div>
              <div class="contact-field" data-contact-field>
                <label class="sr-only">Email</label>
                <input
                  type="email"
                  formControlName="email"
                  placeholder="Email"
                  class="contact-input"
                />
                <span class="input-line" data-input-line></span>
              </div>
              <div class="contact-field" data-contact-field>
                <label class="sr-only">Message</label>
                <textarea
                  formControlName="message"
                  placeholder="Message"
                  rows="4"
                  class="contact-input contact-textarea"
                ></textarea>
                <span class="input-line" data-input-line></span>
              </div>
              <button
                type="submit"
                [disabled]="contactForm.invalid || submitting"
                class="contact-submit"
                data-magnetic-btn
                (mouseenter)="onBtnEnter($event)"
                (mousemove)="onBtnMove($event)"
                (mouseleave)="onBtnLeave($event)"
              >
                <span class="submit-inner" data-submit-inner>
                  {{ submitting ? 'Sending...' : 'Send Message' }}
                </span>
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
            <div class="contact-block" data-contact-block>
              <span class="contact-label-letter" data-letter-clip>
                <span class="letter-inner">N</span>
              </span>
              <p class="contact-value">Tessenderlo<br />Belgium</p>
            </div>
            <div class="contact-block" data-contact-block>
              <span class="contact-label-letter" data-letter-clip>
                <span class="letter-inner">P</span>
              </span>
              <a href="tel:+32475451358" class="contact-value contact-link"
                >+32 475 45 13 58</a
              >
            </div>
            <div class="contact-block" data-contact-block>
              <span class="contact-label-letter" data-letter-clip>
                <span class="letter-inner">C</span>
              </span>
              <a
                href="mailto:yentl.nerinckx@icloud.com"
                class="contact-value contact-link"
                >yentl.nerinckx&#64;icloud.com</a
              >
            </div>
            <div class="contact-block contact-social-wrap" data-contact-block>
              <span class="contact-label-letter" data-letter-clip>
                <span class="letter-inner">S</span>
              </span>
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
        opacity: 0;
        transform: translateY(20px);
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

      /* Words start hidden for split reveal */
      .headline-word {
        display: inline-block;
        overflow: hidden;
        vertical-align: bottom;
      }
      .headline-word-inner {
        display: inline-block;
        transform: translateY(110%);
        will-change: transform;
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
        opacity: 0;
        transform: translateY(16px);
      }

      /* ── Draw line ── */
      .draw-line {
        width: 100%;
        height: 1px;
        background: rgba(255, 255, 255, 0.15);
        margin-bottom: clamp(2rem, 4vw, 3.5rem);
        transform: scaleX(0);
        transform-origin: left center;
        will-change: transform;
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
        opacity: 0;
        transform: translateY(30px);
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
        border-bottom: 1px solid rgba(255, 255, 255, 0.12);
        padding: 0.75rem 0;
        font-family: 'area-normal', sans-serif;
        font-size: 1rem;
        color: #fff;
        outline: none;
        transition: border-color 0.3s;
      }
      .contact-input::placeholder {
        color: rgba(255, 255, 255, 0.3);
        transition: color 0.3s;
      }
      .contact-input:focus::placeholder {
        color: rgba(255, 255, 255, 0.1);
      }
      .contact-input:focus {
        border-color: transparent;
      }

      /* ── Animated focus line (draws from center outward) ── */
      .input-line {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 1px;
        background: #fff;
        transform: scaleX(0);
        transform-origin: center;
        transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
        pointer-events: none;
      }
      .contact-input:focus ~ .input-line {
        transform: scaleX(1);
      }

      .contact-textarea {
        resize: vertical;
        min-height: 100px;
      }

      /* ── Magnetic submit button ── */
      .contact-submit {
        position: relative;
        background: transparent;
        border: 1px solid rgba(255, 255, 255, 0.25);
        padding: 1rem 2.5rem;
        font-family: 'area-normal', sans-serif;
        font-size: 0.95rem;
        letter-spacing: 0.04em;
        cursor: pointer;
        color: #fff;
        border-radius: 40px;
        margin-top: 0.75rem;
        overflow: hidden;
        will-change: transform;
        transition: border-color 0.4s, background-color 0.4s;
        align-self: flex-start;
      }
      .submit-inner {
        display: inline-block;
        position: relative;
        z-index: 1;
        will-change: transform;
      }
      .contact-submit:hover:not(:disabled) {
        border-color: rgba(255, 255, 255, 0.6);
        background: rgba(255, 255, 255, 0.05);
      }
      .contact-submit:disabled {
        opacity: 0.3;
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
        opacity: 0;
        transform: translateX(30px);
      }
      .contact-label-letter {
        font-family: 'area-normal', sans-serif;
        font-size: 11px;
        letter-spacing: 0.15em;
        text-transform: uppercase;
        color: rgba(255, 255, 255, 0.4);
        overflow: hidden;
        display: inline-block;
      }
      .letter-inner {
        display: inline-block;
        transform: translateY(110%);
        will-change: transform;
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

  // ═══════════════════════════════════════════
  // SCROLL ANIMATIONS
  // ═══════════════════════════════════════════
  private setupAnimations(): void {
    const host = this.el.nativeElement as HTMLElement;

    // ─── 1. Label reveal ───
    const label = host.querySelector('[data-contact-label]') as HTMLElement;
    if (label) {
      const t = gsap.to(label, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: label,
          start: 'top 90%',
          toggleActions: 'play none none none',
        },
      });
      if (t.scrollTrigger) this.scrollTriggers.push(t.scrollTrigger);
    }

    // ─── 2. Split-text headline: word-by-word slide-up reveal ───
    this.setupSplitHeadline(host);

    // ─── 3. Subhead fade-in ───
    const subhead = host.querySelector('[data-contact-subhead]') as HTMLElement;
    if (subhead) {
      const t = gsap.to(subhead, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: subhead,
          start: 'top 88%',
          toggleActions: 'play none none none',
        },
      });
      if (t.scrollTrigger) this.scrollTriggers.push(t.scrollTrigger);
    }

    // ─── 4. Draw-line divider ───
    const drawLine = host.querySelector('[data-draw-line]') as HTMLElement;
    if (drawLine) {
      const t = gsap.to(drawLine, {
        scaleX: 1,
        duration: 1.2,
        ease: 'power2.inOut',
        scrollTrigger: {
          trigger: drawLine,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      });
      if (t.scrollTrigger) this.scrollTriggers.push(t.scrollTrigger);
    }

    // ─── 5. Form fields: staggered slide-up ───
    const fields = host.querySelectorAll('[data-contact-field]');
    fields.forEach((field, i) => {
      const t = gsap.to(field, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        delay: i * 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: field,
          start: 'top 92%',
          toggleActions: 'play none none none',
        },
      });
      if (t.scrollTrigger) this.scrollTriggers.push(t.scrollTrigger);
    });

    // ─── 6. Submit button reveal ───
    const submitBtn = host.querySelector('[data-magnetic-btn]') as HTMLElement;
    if (submitBtn) {
      gsap.set(submitBtn, { opacity: 0, y: 20 });
      const t = gsap.to(submitBtn, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        delay: 0.4,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: submitBtn,
          start: 'top 92%',
          toggleActions: 'play none none none',
        },
      });
      if (t.scrollTrigger) this.scrollTriggers.push(t.scrollTrigger);
    }

    // ─── 7. Info blocks: staggered slide-in from right ───
    const blocks = host.querySelectorAll('[data-contact-block]');
    blocks.forEach((block, i) => {
      const t = gsap.to(block, {
        opacity: 1,
        x: 0,
        duration: 0.8,
        delay: i * 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: block,
          start: 'top 92%',
          toggleActions: 'play none none none',
        },
      });
      if (t.scrollTrigger) this.scrollTriggers.push(t.scrollTrigger);
    });

    // ─── 8. Label letters clip-reveal (N, P, C, S slide up) ───
    const letterInners = host.querySelectorAll('[data-letter-clip] .letter-inner');
    letterInners.forEach((letter, i) => {
      const clip = letter.parentElement!;
      const t = gsap.to(letter, {
        y: 0,
        duration: 0.6,
        delay: 0.3 + i * 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: clip,
          start: 'top 92%',
          toggleActions: 'play none none none',
        },
      });
      if (t.scrollTrigger) this.scrollTriggers.push(t.scrollTrigger);
    });

    ScrollTrigger.refresh();
  }

  // ─── SPLIT HEADLINE INTO WORDS, REVEAL ONE BY ONE ───
  private setupSplitHeadline(host: HTMLElement): void {
    const headline = host.querySelector('[data-split-headline]') as HTMLElement;
    if (!headline) return;

    // Only split text nodes (leave the rotating span intact)
    const walker = document.createTreeWalker(headline, NodeFilter.SHOW_TEXT, null);
    const textNodes: Text[] = [];
    let node: Node | null;
    while ((node = walker.nextNode())) {
      if (node.parentElement?.closest('.contact-headline-rotating')) continue;
      if (node.textContent?.trim()) textNodes.push(node as Text);
    }

    const wordSpans: HTMLElement[] = [];

    textNodes.forEach((textNode) => {
      const parent = textNode.parentNode!;
      const words = textNode.textContent!.split(/(\s+)/);
      const frag = document.createDocumentFragment();

      words.forEach((word) => {
        if (!word.trim()) {
          frag.appendChild(document.createTextNode(word));
          return;
        }
        const outer = document.createElement('span');
        outer.className = 'headline-word';
        const inner = document.createElement('span');
        inner.className = 'headline-word-inner';
        inner.textContent = word;
        outer.appendChild(inner);
        frag.appendChild(outer);
        wordSpans.push(inner);
      });

      parent.replaceChild(frag, textNode);
    });

    // Staggered reveal
    if (wordSpans.length) {
      const t = gsap.to(wordSpans, {
        y: 0,
        stagger: 0.04,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: headline,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      });
      if (t.scrollTrigger) this.scrollTriggers.push(t.scrollTrigger);
    }
  }

  // ═══════════════════════════════════════════
  // MAGNETIC BUTTON
  // ═══════════════════════════════════════════
  onBtnEnter(_event: MouseEvent): void {}

  onBtnMove(event: MouseEvent): void {
    const btn = (event.currentTarget as HTMLElement);
    const inner = btn.querySelector('[data-submit-inner]') as HTMLElement;
    if (!inner || btn.hasAttribute('disabled')) return;

    const rect = btn.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;

    gsap.to(btn, {
      x: x * 0.15,
      y: y * 0.15,
      duration: 0.4,
      ease: 'power2.out',
    });
    gsap.to(inner, {
      x: x * 0.08,
      y: y * 0.08,
      duration: 0.4,
      ease: 'power2.out',
    });
  }

  onBtnLeave(event: MouseEvent): void {
    const btn = event.currentTarget as HTMLElement;
    const inner = btn.querySelector('[data-submit-inner]') as HTMLElement;
    gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
    if (inner) {
      gsap.to(inner, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
    }
  }

  // ═══════════════════════════════════════════
  // FLIP TEXT ROTATION
  // ═══════════════════════════════════════════
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
