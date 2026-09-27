/**
 * Recibe las confirmaciones de la web y las anota en la planilla.
 * Cada persona queda en una fila. Instalación: ver README.md.
 */

var HOJA = "Confirmaciones";
var ENCABEZADOS = [
  "Fecha de envío",
  "Invitación",
  "Nombre",
  "Asiste",
  "Restricción alimentaria",
  "Mensaje",
  "Código",
];

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var datos = JSON.parse(e.postData.contents);
    var hoja = obtenerHoja_();
    var ahora = new Date();
    var personas = Array.isArray(datos.personas) ? datos.personas : [];
    var codigo = limpiar_(datos.codigo);

    // Si alguna de estas personas ya había confirmado con este mismo link, se
    // borra su fila anterior: la nueva respuesta reemplaza a la vieja.
    borrarFilasAnteriores_(hoja, codigo, personas.map(function (p) { return limpiar_(p.nombre); }));

    var filas = personas.map(function (p, i) {
      return [
        ahora,
        limpiar_(datos.invitacion),
        limpiar_(p.nombre),
        limpiar_(p.asiste),
        limpiar_(p.restriccion),
        i === 0 ? limpiar_(datos.mensaje) : "",
        limpiar_(datos.codigo),
      ];
    });

    if (filas.length) {
      hoja.getRange(hoja.getLastRow() + 1, 1, filas.length, ENCABEZADOS.length).setValues(filas);
    }
    return ContentService.createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

// Abrir la URL /exec en el navegador sirve para verificar que la implementación funciona.
function doGet() {
  var respuesta;
  try {
    respuesta = { ok: true, planilla: SpreadsheetApp.getActiveSpreadsheet().getName(), hoja: obtenerHoja_().getName() };
  } catch (err) {
    respuesta = { ok: false, error: String(err) };
  }
  return ContentService.createTextOutput(JSON.stringify(respuesta))
    .setMimeType(ContentService.MimeType.JSON);
}

// Ejecutar desde el editor (botón "Ejecutar") para probar que se escribe en la planilla.
function prueba() {
  var resultado = doPost({ postData: { contents: JSON.stringify({
    invitacion: "PRUEBA (borrar)",
    codigo: "prueba",
    personas: [{ nombre: "Prueba", asiste: "Sí", restriccion: "Vegetariano" }],
    mensaje: "Fila de prueba, se puede borrar",
  }) } });
  Logger.log(resultado.getContent());
}

// Borra las filas de estas personas (mismo código de invitación + nombre)
// que ya estuvieran en la planilla, de abajo hacia arriba para no correr
// los índices de fila mientras se borra.
function borrarFilasAnteriores_(hoja, codigo, nombres) {
  var ultimaFila = hoja.getLastRow();
  if (ultimaFila < 2 || !nombres.length) return;

  var colCodigo = ENCABEZADOS.indexOf("Código") + 1;
  var colNombre = ENCABEZADOS.indexOf("Nombre") + 1;
  var datos = hoja.getRange(2, 1, ultimaFila - 1, ENCABEZADOS.length).getValues();

  for (var i = datos.length - 1; i >= 0; i--) {
    var fila = datos[i];
    if (String(fila[colCodigo - 1]) === codigo && nombres.indexOf(String(fila[colNombre - 1])) !== -1) {
      hoja.deleteRow(i + 2);
    }
  }
}

function obtenerHoja_() {
  var libro = SpreadsheetApp.getActiveSpreadsheet();
  if (!libro) {
    throw new Error("El script no está vinculado a una planilla: crealo desde la planilla con Extensiones → Apps Script.");
  }
  var hoja = libro.getSheetByName(HOJA);
  if (!hoja) {
    hoja = libro.insertSheet(HOJA);
    hoja.appendRow(ENCABEZADOS);
    hoja.setFrozenRows(1);
    hoja.getRange(1, 1, 1, ENCABEZADOS.length).setFontWeight("bold");
  }
  return hoja;
}

// Evita que un texto que empiece con "=" se interprete como fórmula.
function limpiar_(v) {
  var s = v == null ? "" : String(v).slice(0, 500);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}
