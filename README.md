# CEIP Cervantes - Educación Física: Instrumentos de Evaluación

Variante de la app de control de alumnado para el área de Educación Física.
Es un único archivo (`index.html`), sin instalación ni servidor.

**Autor:** Miguel Ángel González Lozano

## Instrumentos de evaluación (seleccionables)

| Instrumento | Cómo se registra | Resumen |
|---|---|---|
| Lista de cotejo | SÍ / NO | Totales y % de cumplimiento |
| Escala de observación | Nunca · A veces · Casi siempre · Siempre | Nivel medio (1-4) y distribución |
| Rúbrica | Inicial · En proceso · Logrado · Destacado | Nivel medio (1-4) y distribución |
| Pruebas de condición física | Valor numérico con unidad (cm, s, m, palieres...) | Primera, última, mín, máx y media |

Cada instrumento tiene sus propios indicadores, que se pueden editar, añadir y eliminar en la pestaña **Indicadores**.
Incluye indicadores de partida propios de EF (calentamiento, juego limpio, habilidades motrices, course-navette, salto de longitud, etc.).

## Otras funciones

- Grupos y carga masiva de alumnado pegando una lista.
- Registro diario por alumno, con navegación entre alumnos.
- Resumen por alumno con filtro de fechas e historial.
- Exportación a Google Docs (copiar y pegar, o descargar informe .html para abrir en Drive).
- Descarga de todos los registros de un grupo en CSV (todos los instrumentos).

## Publicar en GitHub Pages

1. Crea un repositorio nuevo en GitHub (por ejemplo `ceip-cervantes-ef`).
2. Sube `index.html` y `README.md` a la raíz.
3. En **Settings → Pages**, elige **Deploy from a branch**, rama `main`, carpeta `/ (root)` y pulsa **Save**.
4. En uno o dos minutos la web estará en `https://TU-USUARIO.github.io/ceip-cervantes-ef/`.

## Privacidad

Los datos se guardan solo en el `localStorage` del navegador de cada persona; no se envían a ningún servidor.
Esta variante usa su propio espacio de almacenamiento, por lo que no comparte datos con la app original.

## Dependencias (por CDN, versiones fijas)

Tailwind CSS 3.4.17, React 18.3.1, Babel Standalone 7.23.5 y la fuente Atkinson Hyperlegible. Requiere conexión a internet.
