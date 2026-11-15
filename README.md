# 🍄 Super Saltarín — videojuego de plataformas para micro:bit

Juego de plataformas de desplazamiento lateral, inspirado en los clásicos
de saltar huecos y pisar enemigos, hecho para la pantalla de 5×5 LEDs de la
**BBC micro:bit** con **MakeCode (JavaScript)**.

> El protagonista es un personaje original, **Saltarín**, y la música también
> es original: se toma la idea del género, sin copiar personajes ni canciones
> de juegos comerciales.

## 🎮 Controles

| Control | Acción |
|---|---|
| **Botón A** | Saltar · en el menú: empezar partida |
| **Botón B** | Súper salto (más alto y más largo) |
| **A + B** | Pausa / continuar |
| **Agitar** (en el menú) | Ver el récord |

## 👀 Qué se ve en la pantalla

```
fila 0   . . . o .     o = moneda alta (solo con súper salto, vale 3)
fila 1   . . . . .
fila 2   . . o . .     o = moneda (vale 1)
fila 3   . J . . E     J = Saltarín (siempre en la columna 1)   E = enemigo (parpadea)
fila 4   _ _ _   _     _ = suelo (tenue)   hueco = ¡cuidado, te caes!
```

- **Enemigo**: salta por encima o **písalo** cayendo desde arriba (+2 puntos y rebote).
- **Hueco**: si no saltas, te caes y pierdes una vida.
- **Corazón** (parpadea rápido): vida extra (máximo 5).
- Empiezas con **3 vidas**. Tras perder una, parpadeas unos instantes y eres invencible.
- Cada **15 puntos** subes de **nivel** (hasta el 9): el juego va más rápido,
  aparecen más enemigos y los huecos son más anchos (hasta 3 columnas).

## 🚀 Cómo cargarlo en la micro:bit

**Opción 1 – Importar desde GitHub**
1. Abre <https://makecode.microbit.org>.
2. Pulsa **Importar → Importar URL** y pega la URL de este repositorio.
3. Conecta la micro:bit por USB y pulsa **Descargar**.

**Opción 2 – Copiar y pegar**
1. En <https://makecode.microbit.org> crea un **Nuevo proyecto**.
2. Cambia a la pestaña **JavaScript**.
3. Borra lo que haya y pega el contenido de [`main.ts`](main.ts).
4. Pruébalo en el simulador de la izquierda y pulsa **Descargar**.

Funciona en micro:bit **V1 y V2** (en la V2 se oyen los sonidos por el altavoz
integrado; en la V1 hace falta conectar unos auriculares o un zumbador a los
pines 0 y GND).

## 🧠 Cómo está programado

| Parte | Funciones |
|---|---|
| Mundo | `prepararMundo`, `generarColumna`, `desplazarMundo` — el nivel se genera al azar columna a columna, dejando siempre una zona segura tras cada obstáculo para que todo sea superable |
| Jugador | `moverJugador`, `puedeSaltar` — el salto es una lista de filas (`SALTO_NORMAL`, `SALTO_SUPER`) que se recorre tick a tick; si no salta, actúa la gravedad |
| Colisiones | `comprobarColisiones` — monedas, corazones, pisotones, golpes y caídas |
| Partida | `empezarPartida`, `perderVida`, `comprobarNivel`, `terminarPartida` |
| Pantalla | `dibujar` usa distintos **brillos** de LED para diferenciar suelo, enemigos, monedas y jugador |

Hay dos bucles `basic.forever`: uno mueve el juego a la velocidad del nivel y
otro redibuja la pantalla cada 60 ms para que los objetos parpadeen.

### Ideas para ampliarlo en clase
- Guardar el récord con la radio y competir entre varias micro:bit.
- Usar el acelerómetro (inclinar) para saltar.
- Añadir un enemigo volador en la fila 2 que obligue a agacharse.
- Añadir una "bandera" de meta al final de cada nivel.
