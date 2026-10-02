import { wedding } from "../config/wedding";

// Affiche une vraie photo, ou un emplacement élégant tant qu'il n'y en a pas.
function GalleryVisual({ photo, index, className = "" }) {
  if (photo.src) {
    return (
      <img
        className={`gallery-visual ${className}`}
        src={photo.src}
        alt={photo.alt}
        loading="lazy"
        decoding="async"
        draggable="false"
      />
    );
  }

  const { first, second } = wedding.couple;

  return (
    <span
      className={`gallery-visual gallery-placeholder ${className}`}
      style={{ "--from": photo.tone[0], "--to": photo.tone[1] }}
      role="img"
      aria-label={photo.alt}
    >
      <span className="gallery-placeholder-mark">
        {first[0]} &amp; {second[0]}
      </span>
      <span className="gallery-placeholder-index">
        {String(index + 1).padStart(2, "0")}
      </span>
    </span>
  );
}

export default GalleryVisual;
