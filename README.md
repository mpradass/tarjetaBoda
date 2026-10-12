# Invitación web de boda

Plantilla responsive en Vite, HTML, CSS y JavaScript. Los nombres, fecha, textos, programa, enlaces y fotografías de ejemplo se personalizan en `src/config.js`. La fecha debe incluir su zona horaria en formato ISO 8601, por ejemplo `2027-05-22T17:00:00+02:00`.

## Arrancar en Codespaces

```bash
npm install
npm run dev
```

Abre el puerto que indique Codespaces. Para probar la versión compilada, ejecuta `npm run build` y luego `npm run preview`.

## Personalizar

Edita `src/config.js`: cambia los datos de la pareja, la fecha, la ubicación, los enlaces (`mapUrl` y `rsvpUrl`), el contacto, los textos y los horarios. El mapa de ejemplo abre una búsqueda de Google Maps; el formulario de asistencia queda desactivado hasta añadir un enlace real. La web no simula el envío de confirmaciones. El botón «Guardar la fecha» descarga un archivo de calendario con la fecha, ubicación y hora de la ceremonia.

Sustituye en `public/images/` `photo-couple.jpg`, `photo-one.jpg`, `photo-two.jpg` y `photo-three.jpg` por fotografías propias, conservando los nombres. Se muestran en blanco y negro en las composiciones; utiliza archivos JPG optimizados para web y conserva proporciones parecidas para evitar recortes inesperados. Las imágenes de esta plantilla son fotografías de muestra, no de una pareja real.

## Publicar

```bash
npm run build
```

El sitio estático listo para publicar se genera en `dist/`. Sube esa carpeta a un alojamiento estático compatible o conecta el repositorio con tu proveedor de publicación.