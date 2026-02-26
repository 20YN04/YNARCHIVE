import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Reusable GSAP effects for the portfolio — register once at app init.
 * Use via gsap.effects.titleReveal(element, config) or the titleReveal directive.
 */

export function registerPortfolioEffects(): void {
  // Editorial title reveal: upward clip-path mask (smooth, not just fade)
  gsap.registerEffect({
    name: 'titleReveal',
    effect: (targets: gsap.TweenTarget, config: Record<string, unknown>) => {
      const duration = (config['duration'] as number) ?? 1;
      const ease = (config['ease'] as string) ?? 'power4.out';
      const delay = (config['delay'] as number) ?? 0;
      const scrollTrigger = config['scrollTrigger'] as object | undefined;
      return gsap.fromTo(
        targets,
        { clipPath: 'inset(100% 0 0 0)', opacity: 0.6 },
        { clipPath: 'inset(0% 0 0 0)', opacity: 1, duration, ease, delay, ...(scrollTrigger ? { scrollTrigger } : {}) }
      );
    },
    defaults: { duration: 1, ease: 'power4.out', delay: 0 },
    extendTimeline: true
  });

  // Image reveal: structural clip-path (reveal from top or direction)
  gsap.registerEffect({
    name: 'imageReveal',
    effect: (targets: gsap.TweenTarget, config: Record<string, unknown>) => {
      const direction = (config['direction'] as string) ?? 'top';
      const duration = (config['duration'] as number) ?? 1.2;
      const ease = (config['ease'] as string) ?? 'power4.inOut';
      const scrollTrigger = config['scrollTrigger'] as object | undefined;
      const fromInset = direction === 'top' ? 'inset(100% 0 0 0)' :
        direction === 'bottom' ? 'inset(0 0 100% 0)' :
        direction === 'left' ? 'inset(0 0 0 100%)' : 'inset(0 100% 0 0)';
      return gsap.fromTo(
        targets,
        { clipPath: fromInset },
        { clipPath: 'inset(0 0 0 0)', duration, ease, ...(scrollTrigger ? { scrollTrigger } : {}) }
      );
    },
    defaults: { direction: 'top', duration: 1.2, ease: 'power4.inOut' },
    extendTimeline: true
  });
}
