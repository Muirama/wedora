import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
} from "motion/react";

import { gsap } from "../lib/gsap";
import { waitForFonts } from "../lib/fonts";
import { wedding } from "../config/wedding";

import SectionHeader from "./SectionHeader";

import "../styles/Countdown.css";

const EASE = [0.16, 1, 0.3, 1];
const RADIUS = 56;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/* ---------- Calcul du temps restant (fuseau de Madagascar, voir config) ---------- */

function getTimeLeft() {
  const difference = wedding.date.getTime() - Date.now();

  if (difference <= 0) {
    return { done: true, days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  const total = Math.floor(difference / 1000);

  return {
    done: false,
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  };
}

// Se resynchronise sur chaque début de seconde : pas de dérive
function useTimeLeft() {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft);

  useEffect(() => {
    let timeout;

    const schedule = () => {
      timeout = setTimeout(tick, 1000 - (Date.now() % 1000) + 5);
    };

    const tick = () => {
      const next = getTimeLeft();

      setTimeLeft(next);

      if (!next.done) schedule();
    };

    schedule();

    return () => clearTimeout(timeout);
  }, []);

  return timeLeft;
}

const plural = (count, word) => `${count} ${word}${count > 1 ? "s" : ""}`;

/* ---------- Un chiffre qui "roule" quand il change ---------- */

function Digit({ char, instant }) {
  return (
    <span className="countdown-digit">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={char}
          className="countdown-digit-char"
          initial={{ y: "75%", opacity: 0, filter: "blur(6px)" }}
          animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
          exit={{ y: "-75%", opacity: 0, filter: "blur(6px)" }}
          transition={instant ? { duration: 0 } : { duration: 0.6, ease: EASE }}
        >
          {char}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

/* ---------- Une unité : anneau de progression + chiffres + libellé ---------- */

function Unit({ value, max, label, minDigits = 2, accent = false }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -20% 0px" });
  const reduceMotion = useReducedMotion();

  const fraction = Math.min(value / max, 1);
  const target = CIRCUMFERENCE * (1 - fraction);

  const offset = useMotionValue(CIRCUMFERENCE); // anneau vide au départ
  const targetRef = useRef(target);
  const [introDone, setIntroDone] = useState(false);

  useEffect(() => {
    targetRef.current = target;
  }, [target]);

  // Phase 1 : l'anneau se remplit quand la section entre à l'écran
  useEffect(() => {
    if (!inView || introDone) return;

    const controls = animate(offset, targetRef.current, {
      duration: reduceMotion ? 0 : 2.2,
      ease: EASE,
      onComplete: () => setIntroDone(true),
    });

    return () => controls.stop();
  }, [inView, introDone, offset, reduceMotion]);

  // Phase 2 : l'anneau se vide en continu ; quand l'unité repart à zéro
  // (ex. 0 s -> 59 s), il se remplit d'un coup au lieu de rembobiner
  useEffect(() => {
    if (!introDone) return;

    const current = offset.get();

    const controls = animate(
      offset,
      target,
      target < current || reduceMotion
        ? { duration: 0 }
        : { duration: 1, ease: "linear" },
    );

    return () => controls.stop();
  }, [introDone, target, offset, reduceMotion]);

  const chars = String(value).padStart(minDigits, "0").split("");

  return (
    <div className="countdown-unit" ref={ref}>
      <div className="countdown-dial">
        <svg
          className="countdown-ring"
          viewBox="0 0 120 120"
          aria-hidden="true"
        >
          <circle className="countdown-ring-track" cx="60" cy="60" r={RADIUS} />
          <motion.circle
            className={
              accent
                ? "countdown-ring-progress countdown-ring-progress--accent"
                : "countdown-ring-progress"
            }
            cx="60"
            cy="60"
            r={RADIUS}
            strokeDasharray={CIRCUMFERENCE}
            style={{ strokeDashoffset: offset }}
          />
        </svg>

        <div className="countdown-digits" aria-hidden="true">
          {chars.map((char, index) => (
            // clé calculée depuis la droite : unités et dizaines gardent leur identité
            <Digit
              key={chars.length - index}
              char={char}
              instant={reduceMotion}
            />
          ))}
        </div>
      </div>

      <span className="countdown-label">{label}</span>
    </div>
  );
}

/* ---------- Section ---------- */

function Countdown() {
  const rootRef = useRef(null);
  const timeLeft = useTimeLeft();

  useLayoutEffect(() => {
    // Mouvement réduit : le CSS affiche tout
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const root = rootRef.current;
    const q = gsap.utils.selector(root);
    const ctx = gsap.context(() => {}, root);
    let cancelled = false;

    waitForFonts().then(() => {
      if (cancelled) return;

      ctx.add(() => {
        const grid = q(".countdown-grid")[0];

        if (!grid) return; // le grand jour est passé : pas de compte à rebours

        gsap
          .timeline({
            defaults: { ease: "expo.out" },
            scrollTrigger: { trigger: grid, start: "top 82%", once: true },
          })
          .fromTo(
            q(".countdown-unit"),
            { opacity: 0, y: 50 },
            { opacity: 1, y: 0, duration: 1.6, stagger: 0.15 },
            0,
          )
          .fromTo(
            q(".countdown-date"),
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 1.2 },
            0.9,
          );
      });
    });

    return () => {
      cancelled = true;
      ctx.revert();
    };
  }, []);

  const { days, hours, minutes, seconds, done } = timeLeft;

  return (
    <section className="countdown" ref={rootRef}>
      <div className="countdown-container">
        <SectionHeader label="LE GRAND JOUR" lines={["Plus que…"]} onDark />

        {done ? (
          <p className="countdown-done">Le grand jour est arrivé</p>
        ) : (
          <>
            <p className="countdown-sr">
              {`Il reste ${plural(days, "jour")}, ${plural(hours, "heure")} et ${plural(minutes, "minute")} avant le mariage.`}
            </p>

            <div className="countdown-grid">
              <Unit value={days} max={365} label="JOURS" minDigits={2} />
              <Unit value={hours} max={24} label="HEURES" />
              <Unit value={minutes} max={60} label="MINUTES" />
              <Unit value={seconds} max={60} label="SECONDES" accent />
            </div>

            <p className="countdown-date">{wedding.dateLong.toUpperCase()}</p>
          </>
        )}
      </div>
    </section>
  );
}

export default Countdown;
