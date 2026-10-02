import { useLayoutEffect, useRef } from "react";

import { gsap, SplitText } from "../lib/gsap";
import { waitForFonts } from "../lib/fonts";

import "../styles/SectionHeader.css";

// En-tête de section animé : label, titre (mot par mot) et filet doré.
// <SectionHeader label="NOS SOUVENIRS" lines={["Première ligne", "Seconde ligne"]} />
// onDark : à utiliser sur les sections à fond sombre (texte clair).
function SectionHeader({
  label,
  lines,
  align = "center",
  accentLast = true,
  onDark = false,
}) {
  const rootRef = useRef(null);

  useLayoutEffect(() => {
    // Mouvement réduit : le CSS affiche tout
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const root = rootRef.current;
    const q = gsap.utils.selector(root);
    const ctx = gsap.context(() => {}, root);
    const splits = [];
    let cancelled = false;

    waitForFonts().then(() => {
      if (cancelled) return;

      ctx.add(() => {
        const titleLines = q(".section-header-line");

        gsap.set(titleLines, { visibility: "visible" });

        titleLines.forEach((line) => {
          splits.push(SplitText.create(line, { type: "words", mask: "words" }));
        });

        gsap
          .timeline({
            defaults: { ease: "expo.out" },
            scrollTrigger: { trigger: root, start: "top 80%", once: true },
          })
          .fromTo(
            q(".section-header-label"),
            { opacity: 0, y: 20, letterSpacing: "0.8em" },
            { opacity: 1, y: 0, letterSpacing: "0.45em", duration: 1.6 },
            0,
          )
          .fromTo(
            splits.flatMap((split) => split.words),
            { yPercent: 115, rotate: 4, opacity: 0 },
            { yPercent: 0, rotate: 0, opacity: 1, duration: 1.5, stagger: 0.1 },
            0.15,
          )
          .fromTo(
            q(".section-header-rule"),
            { opacity: 1, scaleX: 0 },
            { scaleX: 1, duration: 1.6, ease: "power3.inOut" },
            0.7,
          );
      });
    });

    return () => {
      cancelled = true;
      splits.forEach((split) => split.revert());
      ctx.revert();
    };
  }, []);

  return (
    <header
      className={`section-header-block section-header-block--${align}${onDark ? " section-header-block--on-dark" : ""}`}
      ref={rootRef}
    >
      <p className="section-header-label">{label}</p>

      <h2 className="section-header-title">
        {lines.map((line, index) => (
          <span
            key={line}
            className={
              accentLast && index === lines.length - 1
                ? "section-header-line section-header-line--accent"
                : "section-header-line"
            }
          >
            {line}
          </span>
        ))}
      </h2>

      <span className="section-header-rule" aria-hidden="true" />
    </header>
  );
}

export default SectionHeader;
