// Génère un fichier .ics (Apple Calendar, Google Agenda, Outlook...)
// directement dans le navigateur, sans serveur.

// 2027-08-15T07:00:00.000Z  ->  20270815T070000Z
const toICSDate = (date) =>
  date
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}/, "");

// Échappement imposé par le format iCalendar
const escapeText = (text) =>
  String(text)
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");

export function buildCalendarFile({
  title,
  start,
  end,
  location,
  description,
}) {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Wedora//Mariage//FR",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${toICSDate(start)}-mariage@wedora`,
    `DTSTAMP:${toICSDate(new Date())}`,
    `DTSTART:${toICSDate(start)}`,
    `DTEND:${toICSDate(end)}`,
    `SUMMARY:${escapeText(title)}`,
    `LOCATION:${escapeText(location)}`,
    `DESCRIPTION:${escapeText(description)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ];

  return lines.join("\r\n");
}

export function downloadCalendarEvent({ filename, ...event }) {
  const blob = new Blob([buildCalendarFile(event)], {
    type: "text/calendar;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();

  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
