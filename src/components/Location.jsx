import { useLayoutEffect, useRef } from "react";

import { gsap } from "../lib/gsap";
import { waitForFonts } from "../lib/fonts";
import { downloadCalendarEvent } from "../lib/calendar";
import { wedding } from "../config/wedding";

import SectionHeader from "./SectionHeader";

import "../styles/Location.css";

const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1);

function Location() {
  const rootRef = useRef(null);
  const { couple, venue, dateLong, timeLabel, program } = wedding;

  useLayoutEffect(() => {
    // Mouvement réduit : le CSS affiche tout
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const root = rootRef.current;
    const q = gsap.utils.selector(root);
    const ctx = gsap.context(() => {}, root);
    let cancelled = false;

    const build = () => {
      /* ---------- Informations : filets qui se dessinent, lignes qui montent ---------- */
      gsap
        .timeline({
          defaults: { ease: "expo.out" },
          scrollTrigger: {
            trigger: q(".location-details")[0],
            start: "top 82%",
            once: true,
          },
        })
        .fromTo(
          q(".location-row-rule"),
          { opacity: 1, scaleX: 0 },
          { scaleX: 1, duration: 1.6, ease: "power3.inOut", stagger: 0.15 },
          0,
        )
        .fromTo(
          q(".location-row"),
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 1.3, stagger: 0.15 },
          0.1,
        )
        .fromTo(
          q(".location-action"),
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 1.1, stagger: 0.12 },
          0.7,
        );

      /* ---------- Carte : révélation, rues dessinées, épingle qui tombe ---------- */
      const roads = q(".location-road");

      gsap.set(roads, { drawSVG: "0%" });
      gsap.set(q(".location-pin"), { y: -70 });

      gsap
        .timeline({
          defaults: { ease: "expo.out" },
          scrollTrigger: {
            trigger: q(".location-map")[0],
            start: "top 80%",
            once: true,
          },
        })
        .fromTo(
          q(".location-map"),
          { clipPath: "inset(0% 0% 0% 100%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 1.6, ease: "expo.inOut" },
          0,
        )
        .to(
          roads,
          {
            drawSVG: "100%",
            duration: 2.4,
            stagger: 0.1,
            ease: "power2.inOut",
          },
          0.5,
        )
        .fromTo(
          q(".location-garden"),
          { opacity: 0, scale: 0.4, svgOrigin: "225 250" },
          { opacity: 1, scale: 1, duration: 1.6 },
          1.3,
        )
        .to(
          q(".location-pin"),
          { y: 0, opacity: 1, duration: 1.3, ease: "bounce.out" },
          1.8,
        )
        .fromTo(
          q(".location-chip"),
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 1 },
          2.4,
        );

      /* ---------- Parallax lent de la carte ---------- */
      gsap.fromTo(
        q(".location-map-svg"),
        { yPercent: -4 },
        {
          yPercent: 4,
          ease: "none",
          scrollTrigger: {
            trigger: q(".location-map")[0],
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
      ctx.revert();
    };
  }, []);

  const addToCalendar = () => {
    downloadCalendarEvent({
      filename: `mariage-${couple.first}-${couple.second}.ics`.toLowerCase(),
      title: `Mariage de ${couple.first} & ${couple.second}`,
      start: wedding.date,
      end: wedding.endDate,
      location: `${venue.name}, ${venue.addressLines.join(", ")}`,
      description: program
        .map((item) => `${item.time} ${item.title}`)
        .join(" · "),
    });
  };

  return (
    <section className="location" ref={rootRef}>
      <div className="location-container">
        <div className="location-content">
          <SectionHeader
            label="LE LIEU"
            lines={["Nous nous", "retrouverons ici."]}
            align="left"
          />

          <dl className="location-details">
            <div className="location-row">
              <i className="location-row-rule" aria-hidden="true" />
              <dt className="location-row-label">LIEU</dt>
              <dd className="location-row-value location-row-value--name">
                {venue.name}
              </dd>
            </div>

            <div className="location-row">
              <i className="location-row-rule" aria-hidden="true" />
              <dt className="location-row-label">ADRESSE</dt>
              <dd className="location-row-value">
                {venue.addressLines.map((line) => (
                  <span className="location-line" key={line}>
                    {line}
                  </span>
                ))}
              </dd>
            </div>

            <div className="location-row">
              <i className="location-row-rule" aria-hidden="true" />
              <dt className="location-row-label">QUAND</dt>
              <dd className="location-row-value">
                <span className="location-line">{capitalize(dateLong)}</span>
                <span className="location-note">À partir de {timeLabel}</span>
              </dd>
            </div>
          </dl>

          <div className="location-actions">
            <a
              href={venue.mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="location-button location-action"
            >
              <span>Ouvrir dans Google Maps</span>
              <svg
                viewBox="0 0 24 24"
                width="14"
                height="14"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.3"
                aria-hidden="true"
              >
                <path d="M7 17L17 7M8 7h9v9" />
              </svg>
            </a>

            <button
              type="button"
              className="location-link location-action"
              onClick={addToCalendar}
            >
              Ajouter au calendrier
            </button>
          </div>
        </div>

        <a
          className="location-map"
          href={venue.mapsUrl}
          target="_blank"
          rel="noreferrer"
          aria-label={`Voir ${venue.name} sur Google Maps`}
        >
          <svg
            className="location-map-svg"
            viewBox="0 0 400 500"
            preserveAspectRatio="xMidYMid slice"
            aria-hidden="true"
          >
            <circle className="location-garden" cx="225" cy="250" r="82" />

            <path
              className="location-road location-road--minor"
              d="M60 -10 C80 120 90 250 70 520"
            />
            <path
              className="location-road location-road--minor"
              d="M200 -10 C210 150 190 330 230 520"
            />
            <path
              className="location-road location-road--minor"
              d="M330 -10 C320 140 350 300 340 520"
            />
            <path
              className="location-road location-road--minor"
              d="M-10 110 C120 100 260 130 410 100"
            />
            <path
              className="location-road location-road--minor"
              d="M-10 345 C100 360 250 330 410 372"
            />
            <path className="location-road" d="M-10 220 L410 205" />
            <path
              className="location-road"
              d="M140 -10 C150 120 130 330 150 520"
            />
            <path
              className="location-road location-road--main"
              d="M-20 430 C120 390 200 310 280 245 S380 120 430 80"
            />

            <g className="location-pin">
              <circle className="location-pin-ring" cx="225" cy="250" r="9" />
              <circle
                className="location-pin-ring location-pin-ring--late"
                cx="225"
                cy="250"
                r="9"
              />
              <circle className="location-pin-dot" cx="225" cy="250" r="9" />
              <circle className="location-pin-core" cx="225" cy="250" r="3.2" />
            </g>
          </svg>

          <span className="location-compass" aria-hidden="true">
            N
          </span>

          <span className="location-chip">
            <span className="location-chip-name">{venue.name}</span>
            <span className="location-chip-cta">
              Ouvrir la carte
              <svg
                viewBox="0 0 24 24"
                width="12"
                height="12"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                aria-hidden="true"
              >
                <path d="M7 17L17 7M8 7h9v9" />
              </svg>
            </span>
          </span>
        </a>
      </div>
    </section>
  );
}

export default Location;
