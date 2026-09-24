// ============================================================
//  Datos del casamiento: todo lo que se edita está acá.
// ============================================================
window.BODA = {
  novios: "Rafa y Dani",

  // Hora de Uruguay (UTC-3)
  fechaISO: "2026-12-19T16:30:00-03:00",
  fechaTexto: "19 de diciembre 2026",

  ceremonia: {
    lugar: "Nuestra Señora del Rosario y Santo Domingo",
    direccion: "Mario Cassinoni 1337",
    hora: "16:30 h",
    mapa: "https://maps.app.goo.gl/WExcYxj1u3Y58aFm9",
  },

  fiesta: {
    lugar: "Bodega Spinoglio",
    direccion: "Av. Don Pedro de Mendoza 8238",
    hora: "18:30 a 03:00 h",
    mapa: "https://maps.app.goo.gl/CQQY63GWiS4WSJUX6",
    caminoSugerido: ["Ruta 8", "Ruta 102", "Av. Don Pedro de Mendoza"],
  },

  dressCode: "Formal elegante",

  regalos: {
    texto:
      "Nuestro mejor regalo es tu compañía, pero si deseás tener un detalle con nosotros, podés hacerlo a través de las siguientes cuentas:",
    cuentas: [
      { banco: "Banco Itaú", tipo: "Caja de ahorro", numero: "2359733", moneda: "USD" },
      { banco: "Banco Itaú", tipo: "Cuenta corriente", numero: "2359725", moneda: "UYU" },
    ],
  },

  rsvp: {
    fechaLimiteISO: "2026-11-19T23:59:59-03:00",
    fechaLimiteTexto: "19 de noviembre",
    // URL de la aplicación web de Google Apps Script (ver README).
    // Mientras esté vacía, el formulario avisa que todavía no está activo.
    endpoint: "",
    bebidas: [
      "Vino tinto",
      "Vino blanco",
      "Espumante",
      "Cerveza",
      "Whisky",
      "Gin / tragos",
      "Sin alcohol",
    ],
  },

  // Archivo de audio en /assets (p. ej. "assets/musica.mp3"). Vacío = sin música.
  musica: "assets/musica.mp3",
  cancion: "Mirrors · Justin Timberlake",

  // Fotos para la galería (p. ej. ["assets/fotos/1.jpg", ...]). Vacío = sección oculta.
  fotos: [],
};
