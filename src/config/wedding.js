// Source unique de vérité : noms, date, lieu, programme.
// Modifier ici met à jour tout le site.

const TIMEZONE = "Indian/Antananarivo"; // UTC+3

// Heure de la cérémonie, avec le fuseau explicite (+03:00)
const DATE = new Date("2027-08-15T10:00:00+03:00");

// Fin de la journée (utilisée pour l'événement "Ajouter au calendrier")
const END_DATE = new Date("2027-08-15T23:00:00+03:00");

const format = (options) =>
  new Intl.DateTimeFormat("fr-FR", { timeZone: TIMEZONE, ...options });

const parts = format({
  day: "numeric",
  month: "long",
  year: "numeric",
}).formatToParts(DATE);

const getPart = (type) => parts.find((part) => part.type === type).value;

const VENUE_NAME = "Le Jardin des Roses";
const VENUE_ADDRESS = [
  "25 Avenue de l'Indépendance",
  "Antananarivo, Madagascar",
];

export const wedding = {
  couple: {
    first: "Andria",
    second: "Soa",
  },

  date: DATE,
  endDate: END_DATE,
  timezone: TIMEZONE,

  dateParts: {
    day: getPart("day"),
    month: getPart("month").toUpperCase(),
    year: getPart("year"),
  },

  // "dimanche 15 août 2027" (le jour de la semaine est calculé, plus d'erreur possible)
  dateLong: format({
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(DATE),

  // "10h00"
  timeLabel: format({ hour: "2-digit", minute: "2-digit" })
    .format(DATE)
    .replace(":", "h"),

  rsvpDeadline: "1er juillet 2027",

  venue: {
    name: VENUE_NAME,
    addressLines: VENUE_ADDRESS,

    // Par défaut : recherche Google Maps à partir du nom et de l'adresse.
    // Pour un lien exact, remplace par le lien "Partager" de Google Maps.
    mapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      `${VENUE_NAME}, ${VENUE_ADDRESS.join(", ")}`,
    )}`,
  },

  program: [
    {
      time: "10:00",
      title: "Cérémonie",
      text: "Nous vous donnons rendez-vous pour célébrer notre union entourés de nos familles et de nos proches.",
    },
    {
      time: "13:00",
      title: "Réception",
      text: "Après la cérémonie, retrouvons-nous autour d'un déjeuner pour partager ce moment ensemble.",
    },
    {
      time: "19:00",
      title: "Soirée",
      text: "La journée se poursuivra avec un dîner, de la musique et une soirée pleine de souvenirs.",
    },
  ],
};
