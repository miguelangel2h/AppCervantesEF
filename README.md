# CEIP Cervantes - Control de Alumnos e Indicadores

Aplicación web para el control diario del alumnado y el registro de indicadores de evaluación.
Es un único archivo (`index.html`) sin instalación ni servidor.

**Autor:** Miguel Ángel González Lozano

## Funciones

- Grupos y carga masiva de alumnado pegando una lista (un nombre por línea).
- Registro diario por alumno con indicadores SÍ / NO.
- Indicadores editables: modificar, añadir y eliminar.
- Resumen por alumno con filtro de fechas, totales, porcentajes e historial.
- Logo del colegio personalizable (clic sobre el logo en la cabecera).

## Publicar en GitHub Pages

1. Crea un repositorio nuevo en GitHub (por ejemplo `ceip-cervantes`).
2. Sube `index.html` y `README.md` a la raíz del repositorio.
3. Ve a **Settings → Pages**.
4. En **Build and deployment**, elige **Deploy from a branch**, rama `main` y carpeta `/ (root)`. Pulsa **Save**.
5. En uno o dos minutos la web estará en `https://TU-USUARIO.github.io/ceip-cervantes/`.

## Privacidad de los datos

Los datos del alumnado se guardan solo en el `localStorage` del navegador de quien usa la app.
No se envían a ningún servidor ni se suben a GitHub. Cada dispositivo o navegador tiene sus propios datos,
y borrar los datos del navegador los elimina.

## Dependencias (por CDN, versiones fijas)

Tailwind CSS 3.4.17, React 18.3.1, Babel Standalone 7.23.5 y la fuente Atkinson Hyperlegible (Google Fonts).
Se necesita conexión a internet para cargarlas.
