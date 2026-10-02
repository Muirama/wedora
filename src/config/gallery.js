const files = import.meta.glob("../assets/gallery/*.{jpg,jpeg,png,webp,avif}", {
  eager: true,
  query: "?url",
  import: "default",
});

const PLACEHOLDER_COUNT = 6;

// Ratios variés (largeur / hauteur) pour une mise en page éditoriale
const RATIOS = [0.8, 1, 0.75, 0.8, 0.75, 1];

// Dégradés des emplacements (palette sable / doré)
const TONES = [
  ["#ece3d4", "#d9c3a0"],
  ["#f1eadf", "#cdbba0"],
  ["#e5ded4", "#c9b08a"],
  ["#f3eee6", "#d4bfa0"],
  ["#e8dccb", "#bfa27a"],
  ["#ede5d8", "#d0b895"],
];

const uploaded = Object.entries(files)
  .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
  .map(([, src]) => ({ src }));

const source =
  uploaded.length > 0
    ? uploaded
    : Array.from({ length: PLACEHOLDER_COUNT }, () => ({ src: null }));

export const photos = source.map((photo, index) => ({
  id: index,
  src: photo.src,
  alt: `Photo ${index + 1} d'Andria et Soa`,
  ratio: RATIOS[index % RATIOS.length],
  tone: TONES[index % TONES.length],
}));
