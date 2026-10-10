// Generador de links personalizados. Lo usan generar.html (invitación original)
// y v2/generar.html (invitación v2): el atributo data-destino del <script> dice a
// qué versión apuntan los links ("" = original, "v2/" = v2).
(function () {
  "use strict";

  var $ = function (s) { return document.querySelector(s); };
  var destino = (document.currentScript && document.currentScript.getAttribute("data-destino")) || "";

  // Raíz del sitio: la URL de esta página sin "generar", "v2/", query ni hash.
  var raiz = location.origin + location.pathname.replace(/(v2\/)?generar(\.html)?\/?$/, "");
  var base = raiz + destino;

  function encode(obj) {
    var bytes = new TextEncoder().encode(JSON.stringify(obj));
    var bin = "";
    bytes.forEach(function (b) { bin += String.fromCharCode(b); });
    return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }

  function actualizarWhatsapp() {
    $("#whatsapp").href = "https://wa.me/?text=" + encodeURIComponent($("#mensaje-wa").value);
  }

  $("#generar").addEventListener("click", function () {
    var personas = $("#personas").value.split("\n").map(function (s) { return s.trim(); }).filter(Boolean);
    if (!personas.length) { alert("Escribí al menos una persona."); return; }
    var grupo = $("#grupo").value.trim() || personas.join(" y ");
    var link = base + "?i=" + encode({ g: grupo, p: personas });

    $("#link").textContent = link;
    $("#probar").href = link;
    var singular = personas.length === 1;
    $("#mensaje-wa").value =
      "¡Hola " + grupo + "! Con mucha alegría queremos " + (singular ? "invitarte" : "invitarlos") +
      " a nuestro casamiento el 19 de diciembre. En este link " + (singular ? "encontrarás" : "encontrarán") +
      " todos los detalles y el formulario para confirmar:\n\n" +
      link + "\n\nRafa y Dani";
    actualizarWhatsapp();
    $("#resultado").hidden = false;
  });

  $("#mensaje-wa").addEventListener("input", actualizarWhatsapp);

  $("#copiar").addEventListener("click", function () {
    var ta = $("#mensaje-wa");
    ta.select();
    (navigator.clipboard ? navigator.clipboard.writeText(ta.value) : Promise.resolve(document.execCommand("copy")))
      .then(function () {
        var t = $("#toast");
        t.textContent = "Mensaje copiado";
        t.classList.add("visible");
        setTimeout(function () { t.classList.remove("visible"); }, 2000);
      });
  });
})();
