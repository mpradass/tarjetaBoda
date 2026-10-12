import { wedding } from './config.js';
import './style.css';

document.documentElement.classList.add('js');
const namesMarkup = `${wedding.names.first} <span>&amp;</span> ${wedding.names.second}`;
document.querySelectorAll('[data-names]').forEach((element) => { element.innerHTML = namesMarkup; });
document.querySelectorAll('[data-venue]').forEach((element) => { element.textContent = wedding.venue; });
document.querySelector('[data-address]').textContent = wedding.address;
document.querySelector('[data-invitation-message]').textContent = wedding.invitationMessage;
document.querySelector('[data-story]').textContent = wedding.story;
document.querySelector('[data-rsvp-deadline]').textContent = wedding.rsvpDeadline;
document.querySelector('[data-contact]').textContent = wedding.contact;
document.querySelector('[data-contact]').href = `mailto:${wedding.contact}`;

const weddingDate = new Date(wedding.date);
const dateOptions = { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Madrid' };
const longDate = new Intl.DateTimeFormat('es-ES', { weekday: 'long', ...dateOptions }).format(weddingDate);
const shortDate = new Intl.DateTimeFormat('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'Europe/Madrid' }).format(weddingDate).replaceAll('/', ' · ');
document.querySelectorAll('[data-date-long], [data-ceremony-date]').forEach((element) => { element.textContent = longDate; });
document.querySelectorAll('[data-date-short]').forEach((element) => { element.textContent = shortDate; });
const ceremonyTime = `${new Intl.DateTimeFormat('es-ES', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Madrid' }).format(weddingDate)} h`;
document.querySelector('[data-ceremony-time]').textContent = ceremonyTime;

const calendarLink = document.querySelector('#calendar-link');
calendarLink.addEventListener('click', (event) => {
  event.preventDefault();
  const dateParts = Object.fromEntries(
    new Intl.DateTimeFormat('en', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      timeZone: 'Europe/Madrid',
    }).formatToParts(weddingDate)
      .filter(({ type }) => type !== 'literal')
      .map(({ type, value }) => [type, value]),
  );
  const eventDate = `${dateParts.year}${dateParts.month}${dateParts.day}`;
  const nextDay = new Date(Date.UTC(Number(dateParts.year), Number(dateParts.month) - 1, Number(dateParts.day) + 1))
    .toISOString()
    .slice(0, 10)
    .replaceAll('-', '');
  const escapeCalendarText = (text) => text
    .replaceAll('\\', '\\\\')
    .replace(/\r?\n/g, '\\n')
    .replaceAll(',', '\\,')
    .replaceAll(';', '\\;');
  const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const encoder = new TextEncoder();
  const foldLine = (line) => {
    const parts = [];
    let part = '';
    let byteLength = 0;
    for (const character of line) {
      const characterLength = encoder.encode(character).length;
      if (byteLength + characterLength > 75) {
        parts.push(part);
        part = ' ';
        byteLength = 1;
      }
      part += character;
      byteLength += characterLength;
    }
    parts.push(part);
    return parts.join('\r\n');
  };
  const calendar = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Invitacion de boda//Calendario//ES',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:boda-${eventDate}@invitacion.local`,
    `DTSTAMP:${stamp}`,
    `DTSTART;VALUE=DATE:${eventDate}`,
    `DTEND;VALUE=DATE:${nextDay}`,
    `SUMMARY:${escapeCalendarText(`Boda de ${wedding.names.first} y ${wedding.names.second}`)}`,
    `LOCATION:${escapeCalendarText(`${wedding.venue}, ${wedding.address}`)}`,
    `DESCRIPTION:${escapeCalendarText(`Celebración de nuestra boda. La ceremonia comienza a las ${ceremonyTime}.`)}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].map(foldLine).join('\r\n') + '\r\n';
  const file = new Blob([calendar], { type: 'text/calendar;charset=utf-8' });
  const downloadUrl = URL.createObjectURL(file);
  const download = document.createElement('a');
  download.href = downloadUrl;
  download.download = `boda-${eventDate}.ics`;
  document.body.append(download);
  download.click();
  download.remove();
  window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
});

const photoSources = [wedding.photos.couple, ...wedding.photos.strip];
document.querySelectorAll('.invitation__window img, .closing__photo img').forEach((image) => { image.src = wedding.photos.couple; });
document.querySelectorAll('.photo-strip img').forEach((image, index) => { image.src = wedding.photos.strip[index]; });
document.querySelectorAll('.collage__photo img, .story__image img').forEach((image, index) => { image.src = photoSources[index + 1]; });

const mapLink = document.querySelector('#map-link');
if (wedding.mapUrl) {
  mapLink.href = wedding.mapUrl;
} else {
  mapLink.removeAttribute('href');
  mapLink.setAttribute('aria-disabled', 'true');
  mapLink.insertAdjacentHTML('afterend', '<p class="setup-note">Añade el enlace de Google Maps en src/config.js.</p>');
}

const rsvpLink = document.querySelector('#rsvp-link');
const rsvpNote = document.querySelector('#rsvp-note');
if (wedding.rsvpUrl) {
  rsvpLink.href = wedding.rsvpUrl;
  rsvpNote.hidden = true;
} else {
  rsvpLink.removeAttribute('href');
  rsvpLink.setAttribute('aria-disabled', 'true');
}

document.querySelector('#schedule-list').innerHTML = wedding.schedule.map(({ time, title, detail }) => `
  <li class="schedule__item"><time datetime="${time}">${time}</time><div><h3>${title}</h3><p>${detail}</p></div></li>
`).join('');

const invitation = document.querySelector('#invitation');
const openButton = document.querySelector('#open-invitation');
const photoStrip = document.querySelector('#photo-strip');
openButton.addEventListener('click', () => {
  const isOpen = invitation.classList.toggle('is-open');
  openButton.setAttribute('aria-expanded', String(isOpen));
  photoStrip.setAttribute('aria-hidden', String(!isOpen));
  openButton.innerHTML = isOpen
    ? 'Cerrar invitación <span aria-hidden="true">↗</span>'
    : 'Abrir invitación <span aria-hidden="true">↗</span>';
});

const countdownElements = {
  days: document.querySelector('[data-days]'),
  hours: document.querySelector('[data-hours]'),
  minutes: document.querySelector('[data-minutes]'),
  seconds: document.querySelector('[data-seconds]'),
};
const countdownMessage = document.querySelector('#countdown-message');
function updateCountdown() {
  const remaining = weddingDate.getTime() - Date.now();
  if (remaining <= 0) {
    document.querySelector('#countdown').hidden = true;
    countdownMessage.hidden = false;
    return;
  }
  const totalSeconds = Math.floor(remaining / 1000);
  countdownElements.days.textContent = String(Math.floor(totalSeconds / 86400)).padStart(3, '0');
  countdownElements.hours.textContent = String(Math.floor((totalSeconds % 86400) / 3600)).padStart(2, '0');
  countdownElements.minutes.textContent = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
  countdownElements.seconds.textContent = String(totalSeconds % 60).padStart(2, '0');
}
updateCountdown();
window.setInterval(updateCountdown, 1000);

const revealSections = document.querySelectorAll('.intro, .collage, .details, .countdown, .story, .schedule, .rsvp');
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealSections.forEach((section) => revealObserver.observe(section));
} else {
  revealSections.forEach((section) => section.classList.add('is-visible'));
}