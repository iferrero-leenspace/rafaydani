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
})();
