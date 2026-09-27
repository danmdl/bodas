# Micaela & Adriaham

Invitación de casamiento en español. Next.js 16, React, TypeScript, Tailwind CSS, Framer Motion y GSAP ScrollTrigger. Lista para importar en Vercel.

## Todo se edita en un solo lugar

Abrí `config/wedding.ts`. Tiene comentarios en español.

| Qué actualizar                                     | Dónde                                              |
| -------------------------------------------------- | -------------------------------------------------- |
| Nombres y fecha principal                          | `names`, `dateLabel`, `compactDate`, `countdownTo` |
| Fotos y encuadres                                  | `hero.photo`, `story.photos`, `gallery`            |
| Historia de la pareja y cierre                    | `story.paragraphs`, `story.ending`                  |
| Fecha, dirección y mapa de cada evento             | `events`                                           |
| Horario confirmado, información y vestimenta       | `details`                                          |
| Alias para transferencias                          | `gifts.alias`                                      |
| Total recibido manualmente                         | `gifts.received`                                   |
| Moneda                                             | `gifts.currency`                                   |
| Metas por destino                                  | `destinations[].goal`                              |
| Mostrar porcentajes, destinos o nada               | `gifts.publicProgress`                             |
| Publicar montos o mantenerlos privados             | `gifts.showAmounts`                                |
| Fotos y texto de cada destino                      | `destinations`                                     |
| Versículos, traducción y fuentes                   | `faith`                                            |
| Fondo final                                        | `finale.backgroundImage`                           |

Las fotos se guardan en `public/photos`. Se incluyen las fotos reales de la pareja, comprimidas como WebP sin alterar sus rasgos, y ocho paisajes con licencia Unsplash. Todos los archivos se sirven localmente, sin depender de URLs externas para imágenes o fuentes.

El alias confirmado es `adrimadda.mp`. Se muestra en “Tu apoyo”, en el botón lateral persistente y en el diálogo para copiar. `null` significa pendiente. El horario de ceremonia y las metas quedan pendientes. No se inventó dinero recibido. Si se deja el alias en `null`, se muestra el aviso de próxima actualización.

La historia es el relato facilitado por la pareja, con correcciones de puntuación y tildes. Conserva el nombre Adrián que usaron en el relato, la bendición de sus padres espirituales y el 27 de julio sin agregar un año. La página no solicita confirmación de asistencia, reservas ni descargas de calendario.

### Avance del viaje

Cada `goal` es el costo de esa etapa, no una meta acumulada. Por ejemplo, con dos etapas de 1000 y 1500 recibidos, la primera queda al 100% y la segunda al 50%. El sistema reparte el total en el orden del recorrido.

Completá las ocho metas con valores positivos para habilitar el avance real. Hasta entonces se muestra un mensaje de próxima actualización. `publicProgress: 'unlocked'` muestra destinos alcanzados sin porcentajes. `'hidden'` oculta el resumen de avance.

Por defecto `showAmounts: false` elimina los montos exactos de las props públicas, del HTML y del JavaScript del navegador. La transformación sucede en `lib/wedding-data.ts`, en el servidor. Los porcentajes y los destinos se publican solo según el modo elegido. El código fuente y su historial sí contienen la configuración, así que mantené privado el repositorio si agregás montos sensibles. Si no querés guardar importes ni en el historial, reemplazá la lectura de configuración por variables de entorno de servidor.

No hay pasarela de pagos, conexión bancaria ni confirmaciones de transferencia. El progreso se actualiza manualmente y requiere un nuevo despliegue. Desbloquear un destino no significa que haya sido reservado.

### Fechas

La cuenta regresiva termina al comenzar el 14 de noviembre en Argentina. No implica una hora de ceremonia confirmada.

El civil está configurado para el 13/11/2026 a las 09:55 de Argentina. La ceremonia es el 14/11, con horario pendiente. Al cambiar una fecha, actualizá las etiquetas de `events` y la cuenta regresiva `countdownTo` si corresponde.

Los enlaces de mapa son búsquedas de las direcciones suministradas. Podés reemplazarlos por los enlaces exactos del lugar cuando los tengas.

## Desarrollo y producción

Requiere Node.js 20.9 o posterior, recomendado Node.js 22 o 24.

```bash
npm ci
npm run dev
```

```bash
npm run build
npm start
```

La compilación normal conserva el optimizador de imágenes de Next.js para Vercel. No necesita variables de entorno ni base de datos.

En Vercel, importá este proyecto, elegí el preset Next.js y usá la compilación predeterminada `npm run build`. No establezcas `STATIC_EXPORT` allí. `npm run build:static` crea una versión portátil en `out/`, utilizada para la vista previa. Esa variante sirve los WebP ya comprimidos sin optimización dinámica.

El archivo `.openai/hosting.json` solo vincula la vista previa. Vercel no lo utiliza. El script `scripts/dev.mjs` admite las opciones del entorno de vista previa y también funciona como un `next dev` normal.

## Componentes

- `wedding-experience.tsx`: navegación, fechas, detalles, versículos, modales y cierre.
- `cinematic-hero.tsx`: constelación de retratos, aurora y tipografía en movimiento.
- `persistent-controls.tsx`: cuenta regresiva flotante a la izquierda y acceso lateral a “Tu apoyo”.
- `journey.tsx`: recorrido de ocho panoramas que avanza horizontalmente con el scroll vertical. Conserva tabs, flechas, teclado y gestos. CSS sticky conserva el layout, GSAP solo traslada la tira. Con movimiento reducido queda una galería horizontal natural.
- `photo-gallery.tsx`: segunda escena después de la portada. CSS sticky conserva el layout y GSAP mueve solamente la tira de fotos según el scroll. No usa pinning ni reubica nodos. Con movimiento reducido queda como galería horizontal natural.
- `event-dates.tsx`: dos fechas en columnas al cierre de la página, también en móvil.
- `gift-kilometers.tsx`: equivalencia simbólica de regalos y presupuesto de referencia.
- `lib/travel-reference.ts`: cálculo proporcional de kilómetros y estimación de estadía.
- `motion-primitives.tsx`: botones magnéticos y transiciones cortas.

## Accesibilidad y rendimiento

No se reproduce audio. Se respeta `prefers-reduced-motion`, se desactivan el paralaje y las galerías fijadas, y queda disponible el desplazamiento natural. Los diálogos usan el elemento nativo `dialog`, cierran con Escape y recuperan el foco. Hay enlace para saltar al contenido, foco visible y etiquetas accesibles.

Las imágenes reservan su espacio, la principal carga con prioridad y las demás usan carga diferida. Las fuentes WOFF2 se alojan localmente. GSAP se importa cuando la galería se aproxima al viewport. La portada ya no carga el canvas de partículas. La entrada usa opacidad y transformaciones, sin filtros blur ni clip-path animados. Los movimientos del puntero se limitan a uno por cuadro sin consultar medidas del layout. Las luces se pausan fuera de la portada. La introducción dura menos de un segundo y no bloquea los controles.

La indexación por buscadores está desactivada mediante `robots` en `app/layout.tsx`. Cambialo si desean que la invitación sea pública en los buscadores. Esa etiqueta no reemplaza el control de acceso.

## Verificación

```bash
npm run typecheck
node scripts/check-content.mjs
npm run build
```

Las pruebas se enfocan en privacidad de importes, modos de avance, distribución de metas, referencias del viaje y rutas de las fotos. El alias se puede copiar. Los versículos usan Reina-Valera 1960 y enlazan a sus fuentes.

## Créditos

Fotos de pareja suministradas por el usuario.

Paisajes bajo [licencia Unsplash](https://unsplash.com/license):

- Nahuel Huapi, Diego Costa: https://unsplash.com/photos/dark-ocean-water-with-misty-mountains-under-a-cloudy-sky--sAOHPT31lE
- Perito Moreno, Florian Delée: https://unsplash.com/photos/perito-moreno-glacier-with-mountains-in-the-background-Gu9DzCxbdK0
- Aurora de Senja, Noruega, Shashidhar S: https://unsplash.com/photos/green-aurora-borealis-over-snow-covered-mountains-and-water-wz4aOjvwpCA

- Villa La Angostura, Fermin Rodriguez Penelas: https://unsplash.com/photos/green-trees-near-body-of-water-during-daytime-WKlkL2EiBE4
- Ushuaia, Diego Costa: https://unsplash.com/photos/snow-capped-mountains-overlook-a-coastal-town-and-calm-sea-WVvrIRLxox4
- Puerto Madryn, Cristian Tarzi: https://unsplash.com/photos/a-humpback-whale-spouting-out-of-the-water-f7SzLcfqktQ
- Nyhavn, Dinamarca, Nick Karvounis: https://unsplash.com/photos/nyhavn-copenhagen-denmark-z9omP7AT_2s
- Suecia, Peter van der Meulen: https://unsplash.com/photos/an-aerial-view-of-a-lake-surrounded-by-trees-EqtvTJ-ufnM

Los paisajes son inspiración para cada etapa. Las fotos de Senja y Suecia representan el norte de Europa. No implican reservas confirmadas.

Cormorant Garamond y Manrope, distribuidas bajo SIL Open Font License. Íconos Lucide bajo licencia ISC.


## Referencia de viaje y kilómetros simbólicos

`travelReference` en `config/wedding.ts` permite modificar fechas, precio del vuelo, tipo de cambio, gastos supuestos y los tres ejemplos de regalos. `enabled: false` oculta esta ilustración. Es información pública de planificación, independiente de los importes recibidos, que siguen ocultos.

Base: captura de Despegar facilitada por Dan, recibida el 26/9/2026. Dos personas, EZE–CPH del 25 al 30/11/2026, Lufthansa con una escala, US$4.198 con AstroPay. No se comprobó disponibilidad en tiempo real ni se reservó. La llegada es el 26/11, por eso la estadía ilustrativa tiene cuatro noches y cinco días.

Fuentes consultadas el 26/9/2026:

- [BNA](https://www.bna.com.ar/Personas): dólar billete vendedor AR$1.545 del 25/9/2026. Referencia de conversión, no precio final de pago con tarjeta.
- [Lufthansa, distancia EZE–CPH](https://www.lufthansa.com/lhg/ar/es/o-d/cy-cy/copenhague-buenos-aires): 12.095 km por sentido. Se usan 24.190 km de ida y vuelta sin sumar escalas.
- [CABINN Copenhagen](https://en.cabinn.com/hotel/cabinn-copenhagen): tarifa general anunciada desde DKK 575 por noche, sin validación para las fechas y ocupación de este ejemplo.

Supuestos propios para la estadía de dos: habitación US$110–180 por noche, comidas US$70–110 por día, traslados locales y visitas US$100–180 en total. Sumados al vuelo dan US$5.100–5.650 redondeados a US$50. No son un paquete cotizado. Seguro y posibles impuestos o cargos personales adicionales quedan fuera.

La ilustración es `aporteARS / arsPorUSD / pasajesParaDosUSD × kilómetrosIdaVuelta`, redondeada a 10 km. AR$100.000 corresponden a unos 370 km simbólicos con esta base. Nunca representa millas canjeables, un precio real por kilómetro ni actualiza las metas del viaje. El cambio y la tarifa se actualizan manualmente.

Las distancias de los panoramas se calcularon entre centros de ciudad en línea recta con la fórmula haversine, redondeadas a 10 km. Oslo representa Noruega y Estocolmo la etapa de países escandinavos. No representan distancias de carretera ni itinerarios reservados.

## Actualizaciones en Vercel

Conectá el proyecto existente de Vercel al repositorio `danmdl/bodas` y elegí `main` como rama de producción. Los nuevos commits en esa rama disparan una compilación y publicación automática cuando la integración está habilitada.
