import { useLayoutEffect, useRef } from "react";

import { gsap, SplitText } from "../lib/gsap";
import { waitForFonts } from "../lib/fonts";
import { wedding } from "../config/wedding";

import "../styles/Story.css";

function Story() {
  const rootRef = useRef(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const q = gsap.utils.selector(root);

    // Mouvement réduit : le CSS affiche tout, rien à animer
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const dayElement = q(".story-date-day")[0];
    const ctx = gsap.context(() => {}, root);
    const cleanups = [];
    let cancelled = false;

    const build = () => {
      /* ---------- Label + titre ---------- */
      const titleLines = q(".story-title-line");

      gsap.set(titleLines, { visibility: "visible" });

      const titleSplits = titleLines.map((line) =>
        SplitText.create(line, { type: "words", mask: "words" }),
      );
      cleanups.push(() => titleSplits.forEach((split) => split.revert()));

      gsap
        .timeline({
          defaults: { ease: "expo.out" },
          scrollTrigger: {
            trigger: q(".story-title")[0],
            start: "top 78%",
            once: true,
          },
        })
        .fromTo(
          q(".story-label"),
          { opacity: 0, y: 20, letterSpacing: "0.8em" },
          { opacity: 1, y: 0, letterSpacing: "0.45em", duration: 1.6 },
          0,
        )
        .fromTo(
          titleSplits.flatMap((split) => split.words),
          { yPercent: 115, rotate: 4, opacity: 0 },
          { yPercent: 0, rotate: 0, opacity: 1, duration: 1.5, stagger: 0.1 },
          0.15,
        );

      /* ---------- Deux chemins qui se rejoignent (dessinés au scroll) ---------- */
      const [left, right, joined] = q(".story-path");
      const dot = q(".story-dot")[0];

      gsap.set([left, right, joined], { drawSVG: "0%" });
      gsap.set(dot, { scale: 0, svgOrigin: "120 196" });
      gsap.set(q(".story-paths"), { opacity: 1 });

      gsap
        .timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: q(".story-paths")[0],
            start: "top 85%",
            end: "bottom 55%",
            scrub: 0.8,
          },
        })
        .to([left, right], { drawSVG: "100%", duration: 0.6 }, 0)
        .to(joined, { drawSVG: "100%", duration: 0.3 }, 0.6)
        .to(dot, { scale: 1, duration: 0.1, ease: "back.out(3)" }, 0.9);

      /* ---------- Paragraphes : révélation ligne par ligne ---------- */
      q(".story-text").forEach((paragraph) => {
        gsap.set(paragraph, { visibility: "visible" });

        // autoSplit : les lignes sont recalculées si l'écran est redimensionné
        const split = SplitText.create(paragraph, {
          type: "lines",
          mask: "lines",
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.lines, {
              yPercent: 110,
              opacity: 0,
              duration: 1.4,
              stagger: 0.12,
              ease: "expo.out",
              scrollTrigger: {
                trigger: paragraph,
                start: "top 88%",
                once: true,
              },
            }),
        });

        cleanups.push(() => split.revert());
      });

      /* ---------- Date : traits qui se dessinent + compteur ---------- */
      const counter = { value: 0 };

      gsap
        .timeline({
          defaults: { ease: "expo.out" },
          scrollTrigger: {
            trigger: q(".story-date")[0],
            start: "top 88%",
            once: true,
          },
        })
        .fromTo(
          q(".story-date-rule"),
          { opacity: 1, scaleX: 0 },
          { scaleX: 1, duration: 1.8, ease: "power3.inOut" },
          0,
        )
        .fromTo(
          q(".story-date-item"),
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 1.4, stagger: 0.15 },
          0.2,
        )
        .to(
          counter,
          {
            value: Number(wedding.dateParts.day),
            duration: 1.8,
            ease: "power2.out",
            snap: { value: 1 },
            onUpdate: () => {
              dayElement.textContent = String(counter.value);
            },
          },
          0.2,
        );

      /* ---------- Grand "&" en fond : parallax lent ---------- */
      gsap.fromTo(
        q(".story-ghost span"),
        { yPercent: -14, rotate: -6 },
        {
          yPercent: 14,
          rotate: 6,
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );
    };

    waitForFonts().then(() => {
      if (cancelled) return;

      ctx.add(build);
    });

    return () => {
      cancelled = true;
      cleanups.forEach((cleanup) => cleanup());
      ctx.revert();
      dayElement.textContent = wedding.dateParts.day;
    };
  }, []);

  const { dateParts } = wedding;

  return (
    <section className="story" id="story" ref={rootRef}>
      <div className="story-ghost" aria-hidden="true">
        <span>&amp;</span>
      </div>

      <div className="story-container">
        <p className="story-label" data-story>
          NOTRE HISTOIRE
        </p>

        <h2 className="story-title">
          <span className="story-title-line">Deux chemins,</span>
          <span className="story-title-line story-title-line--accent">
            une rencontre.
          </span>
        </h2>

        <svg
          className="story-paths"
          data-story
          viewBox="0 0 240 200"
          aria-hidden="true"
        >
          <path
            className="story-path story-path--left"
            d="M20 0 C20 80 120 60 120 130"
          />
          <path
            className="story-path story-path--right"
            d="M220 0 C220 80 120 60 120 130"
          />
          <path className="story-path story-path--joined" d="M120 130 V192" />
          <circle className="story-dot" cx="120" cy="196" r="3.5" />
        </svg>

        <p className="story-text">
          Tout a commencé par une rencontre inattendue. Deux personnes, deux
          histoires, deux chemins qui se sont croisés pour ne plus jamais se
          séparer.
        </p>

        <p className="story-text">
          Aujourd'hui, nous sommes heureux de partager avec vous le début d'un
          nouveau chapitre de notre vie.
        </p>

        <div className="story-date">
          <i className="story-date-rule story-date-rule--left" data-story />

          <span className="story-date-item story-date-day" data-story>
            {dateParts.day}
          </span>
          <small className="story-date-item story-date-month" data-story>
            {dateParts.month}
          </small>
          <span className="story-date-item story-date-year" data-story>
            {dateParts.year}
          </span>

          <i className="story-date-rule story-date-rule--right" data-story />
        </div>
      </div>
    </section>
  );
}

export default Story;
