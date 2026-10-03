import { useLayoutEffect, useRef } from "react";

import { gsap, ScrollTrigger, SplitText } from "../lib/gsap";
import { waitForFonts } from "../lib/fonts";
import { wedding } from "../config/wedding";

import SectionHeader from "./SectionHeader";

import "../styles/EventDetails.css";

function EventDetails() {
  const rootRef = useRef(null);

  useLayoutEffect(() => {
    // Mouvement réduit : le CSS affiche tout
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const root = rootRef.current;
    const q = gsap.utils.selector(root);
    const ctx = gsap.context(() => {}, root);
    const cleanups = [];
    let cancelled = false;

    const build = () => {
      q(".program-row").forEach((row) => {
        const time = row.querySelector(".program-time");
        const title = row.querySelector(".program-title");
        const text = row.querySelector(".program-text");
        const index = row.querySelector(".program-index");
        const dot = row.querySelector(".program-dot");
        const segment = row.querySelector(".program-segment");
        const fill = row.querySelector(".program-segment-fill");

        gsap.set([time, title, text], { visibility: "visible" });

        const timeSplit = SplitText.create(time, {
          type: "chars",
          mask: "chars",
        });
        const titleSplit = SplitText.create(title, {
          type: "words",
          mask: "words",
        });

        cleanups.push(() => {
          timeSplit.revert();
          titleSplit.revert();
        });

        // Entrée de la ligne : heure, point, numéro, titre
        gsap
          .timeline({
            defaults: { ease: "expo.out" },
            scrollTrigger: {
              trigger: row,
              start: "top 78%",
              toggleActions: "play none none none",
            },
          })
          .fromTo(
            timeSplit.chars,
            { yPercent: 115, opacity: 0 },
            { yPercent: 0, opacity: 1, duration: 1.4, stagger: 0.07 },
            0,
          )
          .fromTo(
            dot,
            { scale: 0, opacity: 0 },
            { scale: 1, opacity: 1, duration: 1, ease: "back.out(2.5)" },
            0.1,
          )
          .fromTo(segment, { opacity: 0 }, { opacity: 1, duration: 1.2 }, 0.2)
          .fromTo(
            index,
            { opacity: 0, y: 12 },
            { opacity: 1, y: 0, duration: 1 },
            0.2,
          )
          .fromTo(
            titleSplit.words,
            { yPercent: 115, opacity: 0 },
            { yPercent: 0, opacity: 1, duration: 1.3, stagger: 0.08 },
            0.25,
          );

        // Paragraphe : révélation ligne par ligne (recalculée au redimensionnement)
        const textSplit = SplitText.create(text, {
          type: "lines",
          mask: "lines",
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.lines, {
              yPercent: 110,
              opacity: 0,
              duration: 1.3,
              stagger: 0.1,
              ease: "expo.out",
              scrollTrigger: {
                trigger: text,
                start: "top 90%",
                toggleActions: "play none none none",
              },
            }),
        });

        cleanups.push(() => textSplit.revert());

        // Le point s'allume quand la ligne atteint le milieu de l'écran
        ScrollTrigger.create({
          trigger: row,
          start: "top 62%",
          onEnter: () => row.classList.add("is-active"),
        });
        cleanups.push(() => row.classList.remove("is-active"));

        // Le trait doré se dessine jusqu'à l'étape suivante, au rythme du scroll
        if (fill) {
          gsap.fromTo(
            fill,
            { scaleY: 0 },
            {
              scaleY: 1,
              ease: "none",
              scrollTrigger: {
                trigger: row,
                start: "top 55%",
                end: "bottom 55%",
                scrub: true,
              },
            },
          );
        }
      });
    };

    waitForFonts().then(() => {
      if (cancelled) return;

      ctx.add(build);
    });

    return () => {
      cancelled = true;
      cleanups.forEach((cleanup) => cleanup());
      ctx.revert();
    };
  }, []);

  return (
    <section className="event-details" ref={rootRef}>
      <div className="event-container">
        <SectionHeader
          label="LE PROGRAMME"
          lines={["Un jour à", "partager ensemble"]}
        />

        <ol className="program-list">
          {wedding.program.map((item, index) => (
            <li className="program-row" key={item.title}>
              <time className="program-time" dateTime={item.time}>
                {item.time}
              </time>

              <span className="program-dot" aria-hidden="true" />

              <span className="program-segment" aria-hidden="true">
                <span className="program-segment-fill" />
              </span>

              <div className="program-content">
                <span className="program-index">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <h3 className="program-title">{item.title}</h3>

                <p className="program-text">{item.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export default EventDetails;
