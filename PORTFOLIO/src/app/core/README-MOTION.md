# Portfolio motion system (Telha Clarke–style)

Reusable pieces you can keep in your dashboard library and reuse across projects.

---

## 1. Core engine

- **Lenis** (`npm i lenis`): Smooth scrolling. Started **after** the intro preloader in `LenisService` so the timeline is not affected.
- **Page transitions**: Your existing paper overlay in `app.ts` already avoids hard reloads: `showPage()` runs overlay in/out and swaps the component. No Taxi.js needed; the app is SPA with client-side routing.

**Usage:** `LenisService` is `providedIn: 'root'`. It starts in the preloader timeline `onComplete`. To disable smooth scroll: inject `LenisService` and call `.stop()`.

---

## 2. Intro loader

- **Preloader** (`components/preloader/preloader.component.ts`): Shows **YNARCHIVE** (slide-clock letters). No two-step wordmark:
  - **Step 1:** “YENTL” reveals (slow, deliberate).
  - **Step 2:** “NERINCKX” reveals.
- Timeline in `app.ts`: if `[data-wordmark-1]` and `[data-wordmark-2]` exist, the two-step sequence runs; otherwise the legacy letter stagger runs.

**Reuse:** Copy the `wordmark-wrap` + `data-preloader-step1` / `data-preloader-step2` block and adjust the text. Keep `data-wordmark-1` and `data-wordmark-2` on the spans so the timeline can target them.

---

## 3. Reusable title reveals (clip-path)

- **Effect:** `gsap.effects.titleReveal` in `core/gsap-effects.ts`. Reveals with an upward clip-path (not just fade).
- **Directive:** `appTitleReveal` in `core/directives/title-reveal.directive.ts`.

**Usage:**

- In template:  
  `<h2 appTitleReveal>Your heading</h2>`
- Optional inputs: `appTitleRevealStart="top 88%"`, `appTitleRevealEnd="top 55%"`, `appTitleRevealScrub="0.6"`.
- Or in code:  
  `(gsap.effects as any).titleReveal(el, { duration: 1, scrollTrigger: { trigger: el, start: 'top 85%', scrub: 0.5 } })`

**Registration:** `registerPortfolioEffects()` is called once in `app.ts` so effects are available app-wide.

---

## 4. Image transitions (clip-path)

- **Effect:** `gsap.effects.imageReveal` in `core/gsap-effects.ts`. Direction: `top` | `bottom` | `left` | `right`.
- **Directive:** `appImageReveal` in `core/directives/image-reveal.directive.ts`.

**Usage:**

- In template:  
  `<figure appImageReveal><img ... /></figure>`  
  or  
  `<figure appImageReveal appImageRevealDirection="bottom" appImageRevealStart="top 92%">...</figure>`
- Or in code:  
  `(gsap.effects as any).imageReveal(el, { direction: 'top', scrollTrigger: { trigger: el, start: 'top 92%', scrub: 0.8 } })`

Use generous spacing around images so the clip feels structural.

---

## 5. Dynamic floating CTA

- **Component:** `app-floating-cta` (`components/floating-cta/floating-cta.component.ts`).
- **Behaviour:** One fixed CTA. ScrollTrigger updates label and link by section (e.g. “View Work” → “Featured” → “About” → “Get in touch”).
- **Config:** Default sections in the component: `[data-hero-mega-title]`, `[data-rotor-section]`, `[data-about-section]`, `.footer-section`. Each has `label` and `href`.

**Reuse:** Edit the `DEFAULT_SECTIONS` array or add an `@Input() sections` to drive it from the parent. The CTA uses `data-nav-link` and `data-page` so your existing nav handler does client-side navigation.

---

## File map

| Item              | Path |
|-------------------|------|
| Lenis             | `core/lenis.service.ts` |
| GSAP effects      | `core/gsap-effects.ts` |
| Title reveal      | `core/directives/title-reveal.directive.ts` |
| Image reveal      | `core/directives/image-reveal.directive.ts` |
| Floating CTA      | `components/floating-cta/floating-cta.component.ts` |
| Preloader (intro) | `components/preloader/preloader.component.ts` |
| Registration      | `app.ts` (registerPortfolioEffects, Lenis start, floating CTA in template) |

All of the above are built to be reusable: move the `core/` folder and the floating-cta component into a shared library or duplicate them in another project and register effects + Lenis the same way.
