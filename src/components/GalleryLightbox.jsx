import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { pauseSmoothScroll, resumeSmoothScroll } from "../lib/smoothScroll";
import GalleryVisual from "./GalleryVisual";

const EASE = [0.16, 1, 0.3, 1];

const slide = {
  enter: (direction) => ({ opacity: 0, x: direction * 90, scale: 0.97 }),
  center: { opacity: 1, x: 0, scale: 1 },
  exit: (direction) => ({ opacity: 0, x: direction * -90, scale: 0.97 }),
};

function GalleryLightbox({ photos, startIndex, onClose }) {
  const [[index, direction], setPage] = useState([startIndex, 0]);
  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  const reduceMotion = useReducedMotion();

  const total = photos.length;
  const photo = photos[index];

  const paginate = useCallback(
    (step) => {
      setPage(([current]) => [(current + step + total) % total, step]);
    },
    [total],
  );

  // Scroll bloqué, clavier, focus
  useEffect(() => {
    pauseSmoothScroll();
    closeRef.current?.focus();

    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") paginate(1);
      if (event.key === "ArrowLeft") paginate(-1);

      // Garde le focus à l'intérieur du lightbox
      if (event.key === "Tab") {
        const buttons = dialogRef.current?.querySelectorAll("button");

        if (!buttons?.length) return;

        const first = buttons[0];
        const last = buttons[buttons.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      resumeSmoothScroll();
    };
  }, [onClose, paginate]);

  const handleDragEnd = (_, info) => {
    if (info.offset.x < -80 || info.velocity.x < -500) paginate(1);
    else if (info.offset.x > 80 || info.velocity.x > 500) paginate(-1);
  };

  const handleBackdropClick = (event) => {
    if (event.target.classList.contains("lightbox-stage")) onClose();
  };

  const fade = reduceMotion ? { duration: 0 } : { duration: 0.5, ease: EASE };

  return (
    <motion.div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label="Galerie photo"
      ref={dialogRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={fade}
    >
      <div className="lightbox-bar">
        <p className="lightbox-counter" aria-live="polite">
          {String(index + 1).padStart(2, "0")}
          <span> / {String(total).padStart(2, "0")}</span>
        </p>

        <button
          type="button"
          className="lightbox-button"
          onClick={onClose}
          aria-label="Fermer"
          ref={closeRef}
        >
          <svg
            viewBox="0 0 24 24"
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            aria-hidden="true"
          >
            <path d="M5 5l14 14M19 5L5 19" />
          </svg>
        </button>
      </div>

      <div className="lightbox-stage" onClick={handleBackdropClick}>
        <button
          type="button"
          className="lightbox-button lightbox-nav lightbox-nav--prev"
          onClick={() => paginate(-1)}
          aria-label="Photo précédente"
        >
          <svg
            viewBox="0 0 24 24"
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            aria-hidden="true"
          >
            <path d="M15 5l-7 7 7 7" />
          </svg>
        </button>

        <AnimatePresence mode="wait" custom={direction}>
          <motion.figure
            key={photo.id}
            className="lightbox-figure"
            custom={direction}
            variants={slide}
            initial="enter"
            animate="center"
            exit="exit"
            transition={
              reduceMotion ? { duration: 0 } : { duration: 0.45, ease: EASE }
            }
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.25}
            onDragEnd={handleDragEnd}
          >
            <GalleryVisual
              photo={photo}
              index={index}
              className="lightbox-visual"
            />
          </motion.figure>
        </AnimatePresence>

        <button
          type="button"
          className="lightbox-button lightbox-nav lightbox-nav--next"
          onClick={() => paginate(1)}
          aria-label="Photo suivante"
        >
          <svg
            viewBox="0 0 24 24"
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            aria-hidden="true"
          >
            <path d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </motion.div>
  );
}

export default GalleryLightbox;
