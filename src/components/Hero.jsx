import { useLayoutEffect, useRef, useState } from "react";

import { gsap, SplitText } from "../lib/gsap";
import { scrollToTarget } from "../lib/smoothScroll";
import { wedding } from "../config/wedding";

import "../styles/Hero.css";

const PARTICLE_COUNT = 22;

function createParticles() {
  return Array.from({ length: PARTICLE_COUNT }, (_, id) => ({
    id,
    top: gsap.utils.random(4, 96),
    left: gsap.utils.random(3, 97),
    size: gsap.utils.random(2, 5),
  }));
}

// Attend que les polices soient chargées (max 1,5 s) pour que SplitText
// découpe le texte avec la bonne police.
function waitForFonts() {
  const loading = Promise.all([
    document.fonts.load("400 1em 'Cormorant Garamond Variable'"),
    document.fonts.load("italic 400 1em 'Cormorant Garamond Variable'"),
    document.fonts.load("400 1em 'Jost Variable'"),
  ]).catch(() => {});

  const timeout = new Promise((resolve) => setTimeout(resolve, 1500));

  return Promise.race([loading, timeout]);
}

function Hero() {
  const rootRef = useRef(null);
  const [particles] = useState(createParticles);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const q = gsap.utils.selector(root);

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const finePointer = window.matchMedia(
      "(hover: hover) and (pointer: fine)",
    ).matches;

    // Mouvement réduit : tout est affiché directement, sans animation
    if (reduceMotion) {
      gsap.set(q("[data-hero], .hero-name"), {
        opacity: 1,
        visibility: "visible",
      });
      return;
    }

    const ctx = gsap.context(() => {}, root);
    const splits = [];
    const cleanups = [];
    let cancelled = false;

    /* ---------- 1. Intro ---------- */
    const playIntro = () => {
      const names = q(".hero-name");

      gsap.set(names, { visibility: "visible" });

      names.forEach((name) => {
        splits.push(SplitText.create(name, { type: "chars", mask: "chars" }));
      });

      const [first, second] = splits;
      const letters = { yPercent: 115, rotate: 6, opacity: 0 };
      const lettersIn = {
        yPercent: 0,
        rotate: 0,
        opacity: 1,
        duration: 1.5,
        stagger: 0.06,
        ease: "expo.out",
      };

      gsap
        .timeline({ delay: 0.15, defaults: { ease: "expo.out" } })
        .fromTo(
          q(".hero-halo"),
          { opacity: 0, scale: 0.6 },
          { opacity: 1, scale: 1, duration: 2.4, stagger: 0.25 },
          0,
        )
        .fromTo(
          q(".hero-particle"),
          { opacity: 0 },
          { opacity: 1, duration: 1.6, stagger: 0.05 },
          0.5,
        )
        .fromTo(
          q(".hero-eyebrow"),
          { opacity: 0, y: 20, letterSpacing: "0.9em" },
          { opacity: 1, y: 0, letterSpacing: "0.45em", duration: 1.8 },
          0.2,
        )
        .fromTo(first.chars, letters, lettersIn, 0.5)
        .fromTo(
          q(".hero-amp"),
          { opacity: 0, scale: 0.3, rotate: -30 },
          {
            opacity: 1,
            scale: 1,
            rotate: 0,
            duration: 1.4,
            ease: "back.out(1.8)",
          },
          1.1,
        )
        .fromTo(second.chars, letters, lettersIn, 1.25)
        .fromTo(
          q(".hero-rule"),
          { opacity: 1, scaleX: 0 },
          { scaleX: 1, duration: 1.6, ease: "power3.inOut" },
          2.0,
        )
        .fromTo(
          q(".hero-date"),
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 1.2 },
          2.2,
        )
        .fromTo(
          q(".hero-cta-wrap"),
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 1.2 },
          2.5,
        )
        .fromTo(
          q(".hero-scroll"),
          { opacity: 0 },
          { opacity: 1, duration: 1.2 },
          3.0,
        );
    };

    /* ---------- 2. Décor en mouvement permanent ---------- */
    const floatDecor = () => {
      q(".hero-halo").forEach((halo, index) => {
        gsap.to(halo, {
          x: gsap.utils.random(40, 70) * (index % 2 ? -1 : 1),
          y: gsap.utils.random(30, 60),
          duration: gsap.utils.random(7, 10),
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });
      });

      q(".hero-particle").forEach((particle) => {
        gsap.to(particle, {
          y: gsap.utils.random(-120, -40),
          x: gsap.utils.random(-25, 25),
          duration: gsap.utils.random(5, 9),
          delay: gsap.utils.random(0, 3),
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });
      });
    };

    /* ---------- 3. Parallax au scroll ---------- */
    const scrollParallax = () => {
      gsap
        .timeline({
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        })
        .to(q(".hero-content"), { yPercent: -14, opacity: 0, ease: "none" }, 0)
        .to(q(".hero-halo"), { yPercent: 45, ease: "none" }, 0)
        .to(q(".hero-scroll"), { opacity: 0, ease: "none", duration: 0.3 }, 0);
    };

    /* ---------- 4. Parallax souris + bouton magnétique (desktop) ---------- */
    const pointerEffects = () => {
      const bg = q(".hero-bg")[0];
      const content = q(".hero-content")[0];
      const cta = q(".hero-cta")[0];

      const bgX = gsap.quickTo(bg, "x", { duration: 1.6, ease: "power3" });
      const bgY = gsap.quickTo(bg, "y", { duration: 1.6, ease: "power3" });
      const contentX = gsap.quickTo(content, "x", {
        duration: 1.6,
        ease: "power3",
      });
      const contentY = gsap.quickTo(content, "y", {
        duration: 1.6,
        ease: "power3",
      });

      const onMove = (event) => {
        const x = event.clientX / window.innerWidth - 0.5;
        const y = event.clientY / window.innerHeight - 0.5;

        bgX(x * -50);
        bgY(y * -50);
        contentX(x * 14);
        contentY(y * 14);
      };

      const ctaX = gsap.quickTo(cta, "x", {
        duration: 0.8,
        ease: "elastic.out(1, 0.5)",
      });
      const ctaY = gsap.quickTo(cta, "y", {
        duration: 0.8,
        ease: "elastic.out(1, 0.5)",
      });

      const onCtaMove = (event) => {
        const rect = cta.getBoundingClientRect();
        ctaX((event.clientX - (rect.left + rect.width / 2)) * 0.3);
        ctaY((event.clientY - (rect.top + rect.height / 2)) * 0.4);
      };

      const onCtaLeave = () => {
        ctaX(0);
        ctaY(0);
      };

      root.addEventListener("pointermove", onMove);
      cta.addEventListener("pointermove", onCtaMove);
      cta.addEventListener("pointerleave", onCtaLeave);

      cleanups.push(() => {
        root.removeEventListener("pointermove", onMove);
        cta.removeEventListener("pointermove", onCtaMove);
        cta.removeEventListener("pointerleave", onCtaLeave);
      });
    };

    waitForFonts().then(() => {
      if (cancelled) return;

      ctx.add(() => {
        playIntro();
        floatDecor();
        scrollParallax();
        if (finePointer) pointerEffects();
      });
    });

    return () => {
      cancelled = true;
      cleanups.forEach((cleanup) => cleanup());
      splits.forEach((split) => split.revert());
      ctx.revert();
    };
  }, []);

  const handleDiscover = () => {
    const next = rootRef.current?.nextElementSibling;

    if (next) scrollToTarget(next);
  };

  const { couple, dateParts } = wedding;

  return (
    <section className="hero" ref={rootRef}>
      <div className="hero-bg" aria-hidden="true">
        <div className="hero-halo hero-halo--1" data-hero />
        <div className="hero-halo hero-halo--2" data-hero />
        <div className="hero-halo hero-halo--3" data-hero />

        {particles.map((particle) => (
          <span
            key={particle.id}
            className="hero-particle"
            data-hero
            style={{
              top: `${particle.top}%`,
              left: `${particle.left}%`,
              width: particle.size,
              height: particle.size,
            }}
          />
        ))}
      </div>

      <div className="hero-content">
        <p className="hero-eyebrow" data-hero>
          NOTRE HISTOIRE COMMENCE
        </p>

        <h1 className="hero-names">
          <span className="hero-name hero-name--first">{couple.first}</span>
          <span className="hero-amp" data-hero>
            &amp;
          </span>
          <span className="hero-name hero-name--second">{couple.second}</span>
        </h1>

        <span className="hero-rule" data-hero aria-hidden="true" />

        <p className="hero-date" data-hero>
          <span>{dateParts.day}</span>
          <i aria-hidden="true" />
          <span>{dateParts.month}</span>
          <i aria-hidden="true" />
          <span>{dateParts.year}</span>
        </p>

        <div className="hero-cta-wrap" data-hero>
          <button type="button" className="hero-cta" onClick={handleDiscover}>
            <span className="hero-cta-label">Découvrir notre histoire</span>
            <svg
              className="hero-cta-arrow"
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              aria-hidden="true"
            >
              <path d="M12 4v16M5 13l7 7 7-7" />
            </svg>
          </button>
        </div>
      </div>

      <div className="hero-scroll" data-hero aria-hidden="true">
        <span>DÉFILER</span>
        <i />
      </div>
    </section>
  );
}

export default Hero;
