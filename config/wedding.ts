/**
 * EDITÁ ACÁ el contenido. No hace falta cambiar los componentes.
 * Este archivo se importa solamente en el servidor. Los montos privados NO
 * se mandan al navegador cuando gifts.showAmounts es false.
 * Reemplazá fotos dentro de /public/photos y actualizá src y objectPosition.
 */
export type Photo = {
  src: string;
  alt: string;
  caption: string;
  objectPosition?: string;
};
export type WeddingEvent = {
  id: string;
  title: string;
  day: string;
  month: string;
  year: string;
  dateLabel: string;
  timeLabel: string;
  address: string;
  venue: string;
  mapUrl: string;
};
export type Destination = {
  id: string;
  name: string;
  region: string;
  code: string;
  description: string;
  image: string;
  imageAlt: string;
  coordinates: string;
  goal: number | null;
  accent: string;
  approxKmFromBuenosAires: number;
  distanceCity?: string;
};
export const wedding = {
  names: {
    first: "Micaela",
    second: "Adrián",
    full: "Micaela Ventre & Adrian Maddalena",
  },
  dateLabel: "14 de noviembre de 2026",
  compactDate: "14.11.2026",
  // Cuenta regresiva al comienzo del día en Argentina, no a una hora de ceremonia inventada.
  countdownTo: "2026-11-14T00:00:00-03:00",
  timezone: "America/Argentina/Buenos_Aires",
  hero: {
    eyebrow: "EL COMIENZO DE NUESTRA GRAN AVENTURA",
    tagline: "Una historia, un sí y un viaje por descubrir",
    photo: {
      src: "/photos/242544.webp",
      alt: "Micaela y Adriaham juntos, rodeados de luces cálidas",
      caption: "Nuestro lugar favorito: juntos.",
      objectPosition: "55% 34%",
    } satisfies Photo,
  },
  faith: {
    version: "RVR1960",
    marriage: {
      text: "Por tanto, lo que Dios juntó, no lo separe el hombre.",
      reference: "Mateo 19:6",
      url: "https://www.biblegateway.com/passage/?search=Mateo+19%3A6&version=RVR1960",
    },
    love: {
      text: "Todo lo sufre, todo lo cree, todo lo espera, todo lo soporta.",
      reference: "1 Corintios 13:7",
      url: "https://www.biblegateway.com/passage/?language=es&search=1cor+13%3A7&version=rvr1960",
    },
  },
  story: {
    eyebrow: "NUESTRA BREVE HISTORIA",
    title: "Fue Dios el que",
    titleAccent: "nos unió.",
    // Historia compartida por la pareja. Cada elemento se muestra como un párrafo.
    paragraphs: [
      "En un principio no parecía que esto podía suceder, pero todo comenzó cuando compartimos servicio juntos, más tiempo y momentos. Fue ahí donde nos permitimos conocernos más y ver en el otro cosas que nos iban atrayendo.",
      "Luego de un tiempo, buscando la bendición de Dios y de nuestros padres espirituales, Adrián tomó la iniciativa de pedir permiso para hablar conmigo y conocernos más. Nuestra mamá y pastora nos dio su bendición para hacerlo y avanzamos.",
      "A partir de ese día, y con su bendición, todo sucedió rápidamente.",
    ],
    ending:
      "El 26 de julio recibimos la bendición oficialmente como novios y hoy nos preparamos para nuestra boda.",
    handwritten: "Siempre, con vos.",
    photos: [
      {
        src: "/photos/346636.webp",
        alt: "Micaela y Adriaham juntos, abrazados",
        caption: "De todos los lugares, vos.",
        objectPosition: "50% 37%",
      },
      {
        src: "/photos/240930.webp",
        alt: "Una selfie de Micaela y Adriaham sonriendo",
        caption: "Lo simple. Lo nuestro.",
        objectPosition: "50% 50%",
      },
    ] satisfies Photo[],
  },
  events: [
    {
      id: "civil",
      title: "El primer sí",
      venue: "Civil",
      day: "13",
      month: "NOV",
      year: "2026",
      dateLabel: "13 de noviembre de 2026",
      timeLabel: "9:55 hs",
      address: "Belgrano 4279",
      // Pegá el enlace exacto de Google Maps cuando esté confirmado.
      mapUrl:
        "https://www.google.com/maps/search/?api=1&query=Belgrano+4279+General+San+Martin+Buenos+Aires",
    },
    {
      id: "ceremonia",
      title: "Nuestro sí ante Dios",
      venue: "Ceremonia en la iglesia",
      day: "14",
      month: "NOV",
      year: "2026",
      dateLabel: "14 de noviembre de 2026",
      timeLabel: "Horario a confirmar",
      address:
        "Ricardo Balbín 1860, entre Lincoln y Moreno, General San Martín",
      mapUrl:
        "https://maps.app.goo.gl/rKiwDp7rT3bp792TA",
    },
  ] satisfies WeddingEvent[],
  details: {
    note: "Estamos preparando cada detalle para compartir un día inolvidable. Pronto vas a encontrar toda la información acá.",
    definitiveTime: null as string | null,
    additionalInformation: null as string | null,
    dressCode: null as string | null,
  },
  gifts: {
    // Enlace público de la lista de regalos. Dejá vacío para ocultar el botón.
    registryUrl: "https://share.google/RXFxG6acGjV4HjeQF",
    title: "¿Hasta dónde nos lleva tu regalo?",
    introduction:
      "Tu compañía es nuestro mejor regalo. Si además querés ayudarnos a sumar kilómetros a esta aventura, tu apoyo nos acerca a un nuevo destino.",
    accountHolder: "", // Podés agregar el titular cuando esté confirmado.
    bank: "Transferencia por alias", // No asumimos el banco a partir del alias.
    alias: "adrimadda.mp" as string | null, // Alias confirmado por Dan.
    currency: "ARS",
    showAmounts: false, // false: los montos ni siquiera aparecen en el HTML o en el JavaScript público.
    publicProgress: "percentage" as "percentage" | "unlocked" | "hidden",
    received: 0, // Total REAL recibido. Actualización manual, sin integración bancaria.
  },
  // Referencia pública del viaje, independiente del dinero recibido y sus metas.
  // Actualizá manualmente precio, fechas y tipo de cambio al volver a cotizar.
  // El costo del vuelo proviene de la captura de Despegar compartida por Dan.
  travelReference: {
    enabled: true,
    people: 2,
    destination: "Copenhague",
    departureLabel: "25 al 30 de noviembre de 2026",
    quoteDateLabel: "26/9/2026",
    flightUsd: 4198,
    flightSource: "Despegar · referencia compartida",
    flightConditions:
      "Ida y vuelta para dos con Lufthansa, una escala. Precio con AstroPay.",
    flightUrl: "https://www.despegar.com.ar/vuelos/",
    // Distancia de EZE–CPH publicada por Lufthansa, ida + vuelta, sin sumar escalas.
    roundTripKm: 24190,
    distanceUrl:
      "https://www.lufthansa.com/lhg/ar/es/o-d/cy-cy/copenhague-buenos-aires",
    arsPerUsd: 1545, // BNA, dólar billete vendedor del 25/9/2026. Referencia, no dólar tarjeta.
    exchangeDateLabel: "25/9/2026",
    exchangeUrl: "https://www.bna.com.ar/Personas",
    suggestedGiftsArs: [50000, 100000, 200000],
    // Supuestos propios de planificación. NO son reservas ni cotizaciones fechadas.
    // Se llega el 26/11 y se vuelve el 30/11: cuatro noches y cinco días en destino.
    nights: 4,
    days: 5,
    roomPerNightUsd: [110, 180],
    mealsPerDayForTwoUsd: [70, 110],
    localTransportAndVisitsUsd: [100, 180],
    accommodationSource: "CABINN Copenhagen",
    accommodationUrl: "https://en.cabinn.com/hotel/cabinn-copenhagen",
    accommodationNote:
      "CABINN publica tarifas desde DKK 575 por noche. Para una habitación de dos estimamos US$110–180 por noche, sin disponibilidad confirmada para estas fechas.",
  },
  // Goals son metas INCREMENTALES por destino, no acumuladas. null = pendiente de definir.
  // Los destinos se desbloquean en orden. No son reservas confirmadas.
  destinations: [
    {
      id: "bariloche",
      approxKmFromBuenosAires: 1350,
      name: "Bariloche",
      region: "PATAGONIA, ARGENTINA",
      code: "BRC",
      description:
        "Lagos infinitos, aire de montaña y el primer capítulo de nuestra luna de miel.",
      image: "/photos/patagonia.webp",
      imageAlt: "Lago y montañas de la Patagonia",
      coordinates: "41°08′ S · 71°18′ O",
      goal: null,
      accent: "#adcbbb",
    },
    {
      id: "angostura",
      approxKmFromBuenosAires: 1350,
      name: "Villa La Angostura",
      region: "PATAGONIA, ARGENTINA",
      code: "VLA",
      description:
        "Perdernos entre bosques, caminos tranquilos y tardes junto al lago.",
      image: "/photos/angostura.webp",
      imageAlt: "Lago y bosque de Villa La Angostura",
      coordinates: "40°45′ S · 71°38′ O",
      goal: null,
      accent: "#b5c9a4",
    },
    {
      id: "calafate",
      approxKmFromBuenosAires: 2080,
      name: "El Calafate",
      region: "PATAGONIA, ARGENTINA",
      code: "FTE",
      description:
        "Frente al hielo eterno, guardar un instante que dure para siempre.",
      image: "/photos/glacier.webp",
      imageAlt: "Hielo azul y montañas de la Patagonia",
      coordinates: "50°20′ S · 72°16′ O",
      goal: null,
      accent: "#a8ccd8",
    },
    {
      id: "ushuaia",
      approxKmFromBuenosAires: 2370,
      name: "Ushuaia",
      region: "TIERRA DEL FUEGO, ARGENTINA",
      code: "USH",
      description:
        "Llegar al fin del mundo para sentir que lo nuestro recién empieza.",
      image: "/photos/ushuaia.webp",
      imageAlt: "La costa de Ushuaia con sus montañas nevadas",
      coordinates: "54°48′ S · 68°18′ O",
      goal: null,
      accent: "#a7bbd1",
    },
    {
      id: "madryn",
      approxKmFromBuenosAires: 1080,
      name: "Puerto Madryn",
      region: "PATAGONIA, ARGENTINA",
      code: "PMY",
      description:
        "El mar abierto, la inmensidad y nuevos recuerdos para llevar en la valija.",
      image: "/photos/madryn.webp",
      imageAlt: "Una ballena emerge del mar frente a Puerto Madryn",
      coordinates: "42°46′ S · 65°02′ O",
      goal: null,
      accent: "#a6c9c3",
    },
    {
      id: "noruega",
      approxKmFromBuenosAires: 12250,
      distanceCity: "Oslo",
      name: "Noruega",
      region: "ESCANDINAVIA, EUROPA",
      code: "NOR",
      description:
        "Mirar al cielo y encontrar auroras. Hay sueños que brillan todavía más de a dos.",
      image: "/photos/aurora.webp",
      imageAlt: "Auroras boreales iluminando la noche del norte",
      coordinates: "RUMBO AL NORTE",
      goal: null,
      accent: "#91c8b0",
    },
    {
      id: "dinamarca",
      approxKmFromBuenosAires: 12070,
      name: "Dinamarca",
      region: "ESCANDINAVIA, EUROPA",
      code: "DNK",
      description:
        "Calles para recorrer sin apuro, pequeñas cafeterías y la magia de lo cotidiano.",
      image: "/photos/dinamarca.webp",
      imageAlt: "El canal de Nyhavn y sus casas de colores en Copenhague",
      coordinates: "UN NUEVO HORIZONTE",
      goal: null,
      accent: "#b6b0d3",
    },
    {
      id: "escandinavia",
      approxKmFromBuenosAires: 12560,
      distanceCity: "Estocolmo",
      name: "Países Escandinavos",
      region: "EL SUEÑO CONTINÚA",
      code: "NORD",
      description:
        "Dejar lugar a lo inesperado. Que el siguiente destino nos encuentre siempre juntos.",
      image: "/photos/escandinavia.webp",
      imageAlt: "Un lago entre bosques de otoño en Suecia",
      coordinates: "PRÓXIMA PARADA: JUNTOS",
      goal: null,
      accent: "#c5b8d7",
    },
  ] satisfies Destination[],
  gallery: [
    {
      src: "/photos/242544.webp",
      alt: "La pareja sonríe entre luces cálidas",
      caption: "01 / Un sueño que empieza de a dos",
      objectPosition: "56% 36%",
    },
    {
      src: "/photos/231914.webp",
      alt: "Micaela y Adriaham compartiendo un recuerdo con una persona querida",
      caption: "02 / Las personas que nos acompañan",
      objectPosition: "55% 30%",
    },
    {
      src: "/photos/286364.webp",
      alt: "Micaela y Adriaham sonriendo juntos en una selfie",
      caption: "03 / Las risas de todos los días",
      objectPosition: "54% 48%",
    },
    {
      src: "/photos/346636.webp",
      alt: "Micaela y Adriaham abrazados",
      caption: "04 / Donde queremos estar",
      objectPosition: "50% 35%",
    },
    {
      src: "/photos/358997.webp",
      alt: "La pareja disfrutando de un momento al aire libre",
      caption: "05 / Un ratito con vos",
      objectPosition: "45% 45%",
    },
    {
      src: "/photos/361584.webp",
      alt: "Un abrazo de Micaela y Adriaham",
      caption: "06 / Nuestro lugar en el mundo",
      objectPosition: "56% 45%",
    },
  ] satisfies Photo[],
  finale: {
    backgroundImage: "/photos/aurora.webp",
    title: "Lo más lindo del viaje es compartirlo",
    subtitle: "Gracias por ser parte de nuestra historia",
  },
};
