(function () {
  "use strict";

  var B = window.BODA;
  var $ = function (sel) { return document.querySelector(sel); };

  function get(obj, path) {
    return path.split(".").reduce(function (o, k) { return o == null ? o : o[k]; }, obj);
  }

  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) {
      if (k === "text") node.textContent = attrs[k];
      else if (k === "class") node.className = attrs[k];
      else node.setAttribute(k, attrs[k]);
    });
    (children || []).forEach(function (c) { node.appendChild(c); });
    return node;
  }

  // ---------- Datos de config.js en la página ----------
  document.querySelectorAll("[data-bind]").forEach(function (n) {
    n.textContent = get(B, n.getAttribute("data-bind"));
  });
  document.querySelectorAll("[data-href]").forEach(function (n) {
    n.href = get(B, n.getAttribute("data-href"));
  });
  B.fiesta.caminoSugerido.forEach(function (paso) {
    $("#camino").appendChild(el("li", { text: paso }));
  });

  // ---------- Invitación personalizada (?i=...) ----------
  // El link lleva codificados el nombre de la invitación y las personas incluidas.
  // Se genera con generar.html.
  function decodeInvite(code) {
    try {
      var b64 = code.replace(/-/g, "+").replace(/_/g, "/");
      while (b64.length % 4) b64 += "=";
      var bytes = Uint8Array.from(atob(b64), function (c) { return c.charCodeAt(0); });
      var data = JSON.parse(new TextDecoder().decode(bytes));
      if (!data || !Array.isArray(data.p) || !data.p.length) return null;
      return { grupo: String(data.g || data.p.join(" y ")), personas: data.p.map(String) };
    } catch (e) {
      return null;
    }
  }

  function unirNombres(lista) {
    if (lista.length === 1) return lista[0];
    return lista.slice(0, -1).join(", ") + " y " + lista[lista.length - 1];
  }

  var codigo = new URLSearchParams(location.search).get("i") || "";
  var invitacion = codigo ? decodeInvite(codigo) : null;

  if (invitacion) {
    $("#sobre-para").textContent = invitacion.grupo;
    $("#para").hidden = false;
    invitacion.personas.forEach(function (p) {
      $("#para-lista").appendChild(el("li", { text: p }));
    });
    var n = invitacion.personas.length;
    $("#para-nota").textContent = n === 1
      ? "Reservamos 1 lugar a tu nombre."
      : "Reservamos " + n + " lugares en su honor.";
  }

  // ---------- Sobre + música ----------
  var audio = $("#audio");
  var btnMusica = $("#musica");

  function actualizarBoton() {
    btnMusica.classList.toggle("pausada", audio.paused);
    btnMusica.setAttribute("aria-label", audio.paused ? "Reproducir música" : "Pausar música");
  }

  if (B.musica) {
    audio.src = B.musica;
    audio.volume = 0.6;
    audio.addEventListener("play", actualizarBoton);
    audio.addEventListener("pause", actualizarBoton);
    audio.addEventListener("error", function () { btnMusica.hidden = true; });
    btnMusica.addEventListener("click", function () {
      if (audio.paused) audio.play().catch(function () {});
      else audio.pause();
    });
  }

  $("#abrir").addEventListener("click", function () {
    document.body.classList.remove("cerrado");
    if (B.musica) {
      btnMusica.hidden = false;
      actualizarBoton();
      audio.play().catch(function () { actualizarBoton(); });
    }
  });

  // ---------- Cuenta regresiva ----------
  var fecha = new Date(B.fechaISO);
  function pad(v) { return String(v).padStart(2, "0"); }
  function tick() {
    var ms = Math.max(0, fecha - new Date());
    var s = Math.floor(ms / 1000);
    $("#c-dias").textContent = Math.floor(s / 86400);
    $("#c-horas").textContent = pad(Math.floor(s / 3600) % 24);
    $("#c-min").textContent = pad(Math.floor(s / 60) % 60);
    $("#c-seg").textContent = pad(s % 60);
  }
  tick();
  setInterval(tick, 1000);

  // ---------- Agendar (Google Calendar) ----------
  function gcal(d) { return d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, ""); }
  var fin = new Date(fecha.getTime() + 10.5 * 3600 * 1000); // 16:30 → 03:00
  $("#agendar").href = "https://calendar.google.com/calendar/render?action=TEMPLATE" +
    "&text=" + encodeURIComponent("Casamiento " + B.novios) +
    "&dates=" + gcal(fecha) + "/" + gcal(fin) +
    "&location=" + encodeURIComponent(B.ceremonia.lugar + ", " + B.ceremonia.direccion) +
    "&details=" + encodeURIComponent(
      "Ceremonia " + B.ceremonia.hora + ": " + B.ceremonia.lugar + ", " + B.ceremonia.direccion + "\n" +
      "Fiesta " + B.fiesta.hora + ": " + B.fiesta.lugar + ", " + B.fiesta.direccion + "\n" +
      "Dress code: " + B.dressCode + "\n" + location.href.split("#")[0]
    );

  // ---------- Galería ----------
  if (B.fotos && B.fotos.length) {
    $("#galeria").hidden = false;
    B.fotos.forEach(function (src) {
      $("#fotos").appendChild(el("img", { src: src, alt: "", loading: "lazy" }));
    });
  }

  // ---------- Cuentas bancarias ----------
  var toastTimer;
  function toast(msg) {
    var t = $("#toast");
    t.textContent = msg;
    t.classList.add("visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove("visible"); }, 2200);
  }

  function copiar(texto) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(texto);
    var ta = el("textarea", { readonly: "" });
    ta.value = texto;
    ta.style.position = "fixed"; ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    ta.remove();
    return Promise.resolve();
  }

  B.regalos.cuentas.forEach(function (c) {
    var btn = el("button", { class: "btn btn--linea", type: "button", text: "Copiar número" });
    btn.addEventListener("click", function () {
      copiar(c.numero).then(function () { toast("Número de cuenta copiado"); });
    });
    $("#cuentas").appendChild(el("div", { class: "cuenta-banco" }, [
      el("p", { class: "cuenta-banco__moneda caps", text: c.moneda }),
      el("p", { class: "cuenta-banco__num", text: c.numero }),
      el("p", { class: "texto-suave", text: c.banco + " · " + c.tipo }),
      btn,
    ]));
  });

  // ---------- Confirmación de asistencia ----------
  var limite = new Date(B.rsvp.fechaLimiteISO);
  var claveLocal = "rsvp-" + (codigo || "general");

  function campoPersona(nombre, idx) {
    var id = "p" + idx;
    var extra = el("div", { class: "persona__extra", hidden: "" }, [
      el("div", {}, [
        el("label", { for: id + "-restr", text: "Restricción alimentaria" }),
        el("input", { id: id + "-restr", type: "text", placeholder: "Ninguna, vegetariano, celíaco…" }),
      ]),
      el("div", {}, [
        el("label", { for: id + "-bebida", text: "Bebida preferida" }),
        (function () {
          var s = el("select", { id: id + "-bebida" }, [el("option", { value: "", text: "Elegí una opción" })]);
          B.rsvp.bebidas.forEach(function (b) { s.appendChild(el("option", { value: b, text: b })); });
          return s;
        })(),
      ]),
    ]);

    var opciones = el("div", { class: "opciones", role: "radiogroup", "aria-label": "Asistencia de " + (nombre || "invitado") }, [
      el("input", { type: "radio", name: id + "-asiste", id: id + "-si", value: "Sí" }),
      el("label", { for: id + "-si", text: "Asistiré" }),
      el("input", { type: "radio", name: id + "-asiste", id: id + "-no", value: "No" }),
      el("label", { for: id + "-no", text: "No podré ir" }),
    ]);
    opciones.addEventListener("change", function () {
      extra.hidden = !$("#" + id + "-si").checked;
    });

    var hijos = [];
    if (nombre) hijos.push(el("p", { class: "persona__nombre", text: nombre }));
    hijos.push(opciones, extra);
    return el("div", { class: "persona", "data-id": id, "data-nombre": nombre || "" }, hijos);
  }

  var personas = invitacion ? invitacion.personas : [null];
  personas.forEach(function (p, i) { $("#personas").appendChild(campoPersona(p, i)); });
  if (!invitacion) $("#form-general").hidden = false;

  function mostrarGracias(datos) {
    var van = datos.personas.filter(function (p) { return p.asiste === "Sí"; }).length;
    $("#gracias-texto").textContent = van
      ? "Recibimos tu confirmación. ¡Nos vemos el " + B.fechaTexto.replace(/ \d{4}$/, "") + "!"
      : "Recibimos tu respuesta. ¡Te vamos a extrañar!";
    $("#form").hidden = true;
    $("#gracias").hidden = false;
  }

  if (new Date() > limite) {
    $("#form").hidden = true;
    $("#rsvp-cerrado").hidden = false;
  } else {
    try {
      var previa = JSON.parse(localStorage.getItem(claveLocal) || "null");
      if (previa) mostrarGracias(previa);
    } catch (e) { /* almacenamiento no disponible */ }
  }

  $("#modificar").addEventListener("click", function () {
    $("#gracias").hidden = true;
    $("#form").hidden = false;
  });

  $("#form").addEventListener("submit", function (ev) {
    ev.preventDefault();
    var error = $("#form-error");
    error.textContent = "";

    var nombreGeneral = $("#nombre-general").value.trim();
    if (!invitacion && !nombreGeneral) {
      error.textContent = "Por favor, escribí tu nombre.";
      return;
    }

    var lista = [];
    var faltan = false;
    document.querySelectorAll(".persona").forEach(function (div) {
      var id = div.getAttribute("data-id");
      var marcado = div.querySelector("input[type=radio]:checked");
      if (!marcado) { faltan = true; return; }
      var va = marcado.value === "Sí";
      lista.push({
        nombre: div.getAttribute("data-nombre") || nombreGeneral,
        asiste: marcado.value,
        restriccion: va ? $("#" + id + "-restr").value.trim() : "",
        bebida: va ? $("#" + id + "-bebida").value : "",
      });
    });
    if (faltan) {
      error.textContent = invitacion && invitacion.personas.length > 1
        ? "Indicá si asiste cada una de las personas."
        : "Indicá si vas a asistir.";
      return;
    }

    var datos = {
      invitacion: invitacion ? invitacion.grupo : nombreGeneral,
      codigo: codigo || "general",
      personas: lista,
      mensaje: $("#mensaje").value.trim(),
    };

    if (!B.rsvp.endpoint) {
      error.textContent = "El formulario todavía no está conectado. ¡Probá de nuevo en unos días!";
      return;
    }

    var btn = $("#enviar");
    btn.disabled = true;
    btn.textContent = "Enviando…";

    // text/plain evita el preflight de CORS; Apps Script responde { ok, error }.
    fetch(B.rsvp.endpoint, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(datos),
    }).then(function (res) {
      return res.json();
    }).then(function (res) {
      if (!res || !res.ok) throw new Error(res && res.error);
      try { localStorage.setItem(claveLocal, JSON.stringify(datos)); } catch (e) { /* ignorar */ }
      mostrarGracias(datos);
    }).catch(function (err) {
      if (window.console) console.error("RSVP:", err);
      error.textContent = "No pudimos enviar la confirmación. Intentá de nuevo en unos minutos.";
    }).then(function () {
      btn.disabled = false;
      btn.textContent = "Enviar confirmación";
    });
  });

  // ---------- Aparición al hacer scroll ----------
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("visible"); io.unobserve(e.target); }
      });
    }, { threshold: 0.15 });
    reveals.forEach(function (r) { io.observe(r); });
  } else {
    reveals.forEach(function (r) { r.classList.add("visible"); });
  }
})();
