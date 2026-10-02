import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence } from "motion/react";

import { gsap } from "../lib/gsap";
import { waitForFonts } from "../lib/fonts";
import { photos } from "../config/gallery";

import SectionHeader from "./SectionHeader";
import GalleryVisual from "./GalleryVisual";
import GalleryLightbox from "./GalleryLightbox";

import "../styles/Gallery.css";

function Gallery() {
  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(null);

  useLayoutEffect(() => {
    // Mouvement réduit : le CSS affiche tout
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const root = rootRef.current;
    const ctx = gsap.context(() => {}, root);
    let cancelled = false;

    const build = () => {
      gsap.utils.toArray(".gallery-item", root).forEach((item) => {
        const frame = item.querySelector(".gallery-frame");
        const media = item.querySelector(".gallery-media");
        const visual = item.querySelector(".gallery-visual");
        const caption = item.querySelector(".gallery-caption");

        // Révélation : la photo se dévoile de bas en haut, en dézoomant
        gsap
          .timeline({
            scrollTrigger: { trigger: item, start: "top 88%", once: true },
          })
          .fromTo(
            frame,
            { clipPath: "inset(100% 0% 0% 0%)" },
            {
              clipPath: "inset(0% 0% 0% 0%)",
              duration: 1.6,
              ease: "expo.inOut",
            },
            0,
          )
          .fromTo(
            visual,
            { scale: 1.35 },
            { scale: 1, duration: 2.2, ease: "expo.out" },
            0,
          )
          .fromTo(
            caption,
            { opacity: 0, y: 10 },
            { opacity: 1, y: 0, duration: 1, ease: "expo.out" },
            0.9,
          );

        // Parallax : l'image glisse doucement dans son cadre pendant le scroll
        gsap.fromTo(
          media,
          { yPercent: -7 },
          {
            yPercent: 7,
            ease: "none",
            scrollTrigger: {
              trigger: item,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      });
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

  const openLightbox = (index, event) => {
    triggerRef.current = event.currentTarget;
    setActiveIndex(index);
  };

  const closeLightbox = useCallback(() => setActiveIndex(null), []);

  // Rend le focus à la photo ouverte une fois le lightbox refermé
  const restoreFocus = () => triggerRef.current?.focus({ preventScroll: true });

  return (
    <section className="gallery" ref={rootRef}>
      <div className="gallery-container">
        <SectionHeader
          label="NOS SOUVENIRS"
          lines={["Quelques moments", "de notre histoire"]}
        />

        <div className="gallery-grid">
          {photos.map((photo, index) => (
            <figure
              className="gallery-item"
              key={photo.id}
              style={{ "--ratio": photo.ratio }}
            >
              <button
                type="button"
                className="gallery-frame"
                onClick={(event) => openLightbox(index, event)}
                aria-label={`Agrandir la photo ${index + 1}`}
              >
                <span className="gallery-media">
                  <GalleryVisual photo={photo} index={index} />
                </span>

                <span className="gallery-hint" aria-hidden="true">
                  Voir
                </span>
              </button>

              <figcaption className="gallery-caption">
                {String(index + 1).padStart(2, "0")}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>

      {createPortal(
        <AnimatePresence onExitComplete={restoreFocus}>
          {activeIndex !== null && (
            <GalleryLightbox
              key="lightbox"
              photos={photos}
              startIndex={activeIndex}
              onClose={closeLightbox}
            />
          )}
        </AnimatePresence>,
        document.body,
      )}
    </section>
  );
}

export default Gallery;
