// Smooth scroll (Lenis) synchronisé avec GSAP / ScrollTrigger.
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "./gsap";

let lenis = null;
let tick = null;

export function startSmoothScroll() {
  if (lenis) return;

  // Pas de smooth scroll pour ceux qui demandent moins d'animations
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  lenis = new Lenis({ lerp: 0.09, smoothWheel: true });

  lenis.on("scroll", ScrollTrigger.update);

  tick = (time) => lenis.raf(time * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);
}

export function stopSmoothScroll() {
  if (!lenis) return;

  gsap.ticker.remove(tick);
  lenis.destroy();

  lenis = null;
  tick = null;
}

export function scrollToTarget(target) {
  if (lenis) {
    lenis.scrollTo(target, {
      duration: 1.8,
      easing: (t) => 1 - Math.pow(1 - t, 4),
    });
    return;
  }

  target.scrollIntoView({ behavior: "smooth" });
}
