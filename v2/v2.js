// Detalles propios de la v2. El resto de la lógica es el app.js compartido.
(function () {
  "use strict";

  var B = window.BODA;
  var partes = B.novios.split(/\s+y\s+/);

  // "Rafa y Dani" → "Rafa & Dani", con el & destacado.
  document.querySelectorAll("[data-nombres]").forEach(function (n) {
    n.textContent = "";
    partes.forEach(function (p, i) {
      if (i > 0) {
        var amp = document.createElement("span");
        amp.className = "amp";
        amp.textContent = "&";
        n.appendChild(amp);
      }
      n.appendChild(document.createTextNode(p));
    });
  });

  // Monograma con las iniciales: R&D.
  var iniciales = partes.map(function (p) { return p.trim().charAt(0).toUpperCase(); });
  document.querySelectorAll("[data-monograma]").forEach(function (n) {
    n.textContent = iniciales.join("&");
  });

  // Día de la semana de la fecha del casamiento, en hora de Uruguay.
  var dia = new Date(B.fechaISO).toLocaleDateString("es-UY", { weekday: "long", timeZone: "America/Montevideo" });
  document.querySelectorAll("[data-dia-semana]").forEach(function (n) {
    n.textContent = dia.charAt(0).toUpperCase() + dia.slice(1);
  });

  // Con <base href="../">, los links "#ancla" saldrían de la página: se hace el scroll a mano.
  document.querySelectorAll("[data-ancla]").forEach(function (a) {
    a.addEventListener("click", function (ev) {
      var destino = document.querySelector(a.getAttribute("href"));
      if (!destino) return;
      ev.preventDefault();
      destino.scrollIntoView({ behavior: "smooth" });
    });
  });

  // Cinta animada: se repite el texto hasta que un grupo llena cualquier ancho de
  // pantalla y se duplica el grupo, así el bucle no deja huecos ni cortes.
  var cinta = document.querySelector(".cinta");
  var pista = cinta && cinta.querySelector(".cinta__pista");
  if (pista) {
    var VELOCIDAD = 22; // px por segundo, igual en todas las pantallas
    var unidad = Array.prototype.map.call(pista.querySelector(".cinta__grupo").children, function (n) { return n.cloneNode(true); });
    var anchoArmado = 0;

    var armarCinta = function () {
      var ancho = cinta.clientWidth;
      if (!ancho) return;
      anchoArmado = ancho;
      var grupo = document.createElement("div");
      grupo.className = "cinta__grupo";
      pista.textContent = "";
      pista.appendChild(grupo);
      var agregar = function () { unidad.forEach(function (n) { grupo.appendChild(n.cloneNode(true)); }); };
      agregar();
      for (var i = 0; i < 40 && grupo.getBoundingClientRect().width < ancho; i++) agregar();
      pista.appendChild(grupo.cloneNode(true));
      pista.style.setProperty("--cinta-dur", Math.round(grupo.getBoundingClientRect().width / VELOCIDAD) + "s");
    };

    armarCinta();
    // Al cargar la tipografía cambia el ancho del texto: se vuelve a medir.
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(armarCinta);
    window.addEventListener("resize", function () {
      if (cinta.clientWidth !== anchoArmado) armarCinta();
    });
  }
})();
