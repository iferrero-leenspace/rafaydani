# Rafa y Dani · 19.12.2026

Invitación web del casamiento. Es un sitio estático (HTML, CSS y JS, sin build) con la estética del save the date.

| Archivo | Para qué |
|---|---|
| `config.js` | **Todos los datos editables**: fecha, lugares, mapas, camino sugerido, cuentas, bebidas, música, fotos. |
| `index.html` | La invitación. |
| `generar.html` | Arma el link personalizado de cada grupo de invitados y el mensaje de WhatsApp. |
| `apps-script/Codigo.gs` | Script que anota las confirmaciones en una planilla de Google. |

## Invitaciones personalizadas

Cada grupo recibe su propio link. La invitación muestra "Esta invitación es para: Juan Pérez, Ana López" y "Reservamos 2 lugares", y el formulario pide la confirmación de cada persona por separado. Así queda claro quiénes están invitados.

1. Abrir `…/generar.html` en el sitio publicado.
2. Poner el saludo (p. ej. "Familia Pérez") y las personas, una por línea.
3. Copiar el mensaje o tocar "Enviar por WhatsApp".

Los nombres van dentro del link. No hay una lista de invitados guardada en el repositorio.

## Confirmaciones en una planilla de Google

1. Crear una planilla nueva en Google Sheets (p. ej. "Confirmaciones casamiento").
2. Ir a **Extensiones → Apps Script**, borrar lo que haya y pegar el contenido de `apps-script/Codigo.gs`. Guardar.
3. **Implementar → Nueva implementación** → tipo **Aplicación web**:
   - Ejecutar como: **Yo**
   - Quién tiene acceso: **Cualquier usuario**
4. Autorizar los permisos y copiar la **URL de la aplicación web** (termina en `/exec`).
5. Pegarla en `config.js` → `rsvp.endpoint`.

Cada persona queda en una fila con: fecha de envío, invitación, nombre, asiste (Sí/No), restricción alimentaria, bebida preferida y mensaje. La hoja "Confirmaciones" se crea sola con el primer envío. Si alguien modifica su respuesta se agrega una fila nueva: vale la más reciente.

Después del 19 de noviembre el formulario se cierra solo.

### Si las confirmaciones no llegan

- La hoja **"Confirmaciones"** es una pestaña nueva (abajo, al lado de "Hoja 1").
- Abrir la URL `/exec` en el navegador: tiene que mostrar `{"ok":true,...}`. Si pide iniciar sesión o dice que no hay permiso, la implementación no está en "Cualquier usuario".
- En Apps Script, ejecutar la función `prueba` y mirar **Ejecuciones** (menú izquierdo) para ver errores.
- Después de cambiar el código hay que publicar una versión nueva: **Implementar → Administrar implementaciones → ✏️ → Versión: Nueva versión → Implementar**. La URL no cambia.

## Publicar en GitHub Pages

1. Unir esta rama a `main`.
2. En GitHub: **Settings → Pages → Build and deployment** → Source: *Deploy from a branch* → `main` / `(root)`.
3. El sitio queda en `https://iferrero-leenspace.github.io/rafaydani/`.

La imagen de la vista previa de WhatsApp (`og:image` en `index.html`) apunta a esa dirección. Si cambia el dominio, hay que actualizarla.

## Pendientes

- **Fotos**: subirlas a `assets/fotos/` y listarlas en `config.js` → `fotos`. Sin fotos, la galería no se muestra.
- **Música**: subir la canción como `assets/musica.mp3`. Sin archivo, el botón de música no aparece. Arranca cuando el invitado toca "Abrir invitación".
- **Titular de las cuentas**, si quieren mostrarlo junto al número.

## Probar en la compu

```sh
npx http-server -p 8080
```

y abrir http://localhost:8080.
