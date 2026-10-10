// ============================================================
//  Datos del casamiento: todo lo que se edita está acá.
// ============================================================
window.BODA = {
  novios: "Rafa y Dani",

  // Foto(s) de fondo de la portada. "posicion" es un CSS background-position:
  // el primer número mueve el recorte a los costados, el segundo hacia
  // arriba o abajo (se ajusta mirando cómo queda la portada).
  //
  // Con más de una foto en la lista aparece un botón arriba a la derecha
  // para pasar de una a otra (para elegir entre varias antes de decidir).
  // Cuando ya esté decidida, dejar una sola y el botón desaparece solo.
  // Lista vacía ([]) = portada sin foto.
  heroFotoAlternativas: [
    { foto: "assets/fotos/1.jpg", posicion: "48.7288% 83.0593%" },
    { foto: "assets/portada-bosque.jpg", posicion: "50% 72%" },
  ],

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
    endpoint: "https://script.google.com/macros/s/AKfycbx-beT-BTMRnUpseXnpc-GreSXqudYhXcSpyB3XrB8lhBsrToJ0RpaiYhMbDFhPuGLI/exec",
    restricciones: [
      "Vegetariano",
      "Vegano",
      "Celíaco",
      "Intolerante a la lactosa",
      "Otros",
    ],
  },

  // Archivo de audio en /assets (p. ej. "assets/musica.mp3"). Vacío = sin música.
  musica: "assets/musica.mp3",
  cancion: "Mirrors · Justin Timberlake",

  // Fotos para la galería: siempre 6, para la cuadrícula de 3x2 en escritorio.
  fotos: [
    "assets/fotos/1.jpg",
    "assets/fotos/2.jpg",
    "assets/fotos/3.jpg",
    "assets/fotos/4.jpg",
    "assets/fotos/6.jpg",
    "assets/fotos/5.jpg",
  ],
};
