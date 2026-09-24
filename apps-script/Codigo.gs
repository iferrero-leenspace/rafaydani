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
  "Bebida preferida",
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

    var filas = personas.map(function (p, i) {
      return [
        ahora,
        limpiar_(datos.invitacion),
        limpiar_(p.nombre),
        limpiar_(p.asiste),
        limpiar_(p.restriccion),
        limpiar_(p.bebida),
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

function obtenerHoja_() {
  var libro = SpreadsheetApp.getActiveSpreadsheet();
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
