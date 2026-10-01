import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import "../styles/Story.css";

gsap.registerPlugin(ScrollTrigger);

function Story() {
  const storyRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: storyRef.current,
          start: "top 70%",
          end: "top 20%",
          scrub: 1,
        },
      });

      timeline
        .from(".story-label", {
          opacity: 0,
          y: 30,
        })
        .from(
          ".story-title-line",
          {
            opacity: 0,
            y: 60,
            stagger: 0.2,
          },
          "-=0.4",
        )
        .from(
          ".story-line",
          {
            scaleY: 0,
            transformOrigin: "top",
          },
          "-=0.3",
        )
        .from(
          ".story-text",
          {
            opacity: 0,
            y: 30,
            stagger: 0.2,
          },
          "-=0.2",
        )
        .from(
          ".story-date",
          {
            opacity: 0,
            y: 30,
          },
          "-=0.1",
        );
    }, storyRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="story" ref={storyRef}>
      <div className="story-container">
        <p className="story-label">NOTRE HISTOIRE</p>

        <h2 className="story-title">
          <span className="story-title-line">Deux chemins,</span>

          <span className="story-title-line">une rencontre.</span>
        </h2>

        <div className="story-line"></div>

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
          <span>15</span>

          <small>AOÛT</small>

          <span>2027</span>
        </div>
      </div>
    </section>
  );
}

export default Story;
