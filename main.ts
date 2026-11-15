/**
 * SUPER SALTARÍN
 * Videojuego de plataformas de desplazamiento lateral para micro:bit
 * (inspirado en los clásicos juegos de plataformas).
 *
 * Controles:
 *   Botón A      -> saltar (en el menú: empezar partida)
 *   Botón B      -> súper salto (más alto y más largo)
 *   Botones A+B  -> pausa / continuar
 *
 * Pantalla 5x5 (fila 0 arriba, fila 4 abajo):
 *   - Saltarín (el jugador): LED brillante en la columna 1
 *   - Suelo: fila 4 tenue; si falta un LED, ¡es un hueco!
 *   - Enemigos: LED que parpadea en la fila 3. Salta por encima o písalos.
 *   - Monedas: LED tenue que titila en el aire. Cógelas saltando.
 *   - Corazón: LED que parpadea rápido. Da una vida extra.
 */

// ---------------- Constantes ----------------
const COL_JUGADOR = 1
const FILA_PIE = 3        // fila en la que está el jugador cuando pisa el suelo
const FILA_SUELO = 4
const ANCHO = 5

const MENU = 0
const JUGANDO = 1
const FIN = 2

const VIDAS_INICIALES = 3
const VIDAS_MAX = 5
const PUNTOS_POR_NIVEL = 15
const NIVEL_MAX = 9

// Trayectorias de salto (filas sucesivas del jugador)
const SALTO_NORMAL = [2, 1, 1, 2, 3]
const SALTO_SUPER = [2, 1, 0, 0, 1, 2, 3]
const REBOTE = [1, 2, 3]

// ---------------- Estado del mundo ----------------
// Cada array describe las 5 columnas visibles de la pantalla
let suelo: boolean[] = []
let enemigo: boolean[] = []
let moneda: number[] = []    // fila de la moneda o -1 si no hay
let corazon: number[] = []   // fila del corazón o -1 si no hay

// ---------------- Estado del jugador ----------------
let y = FILA_PIE
let yAnterior = FILA_PIE
let salto: number[] = []
let invencible = 0

// ---------------- Estado de la partida ----------------
let estado = MENU
let pausa = false
let mostrarMundo = false
let puntos = 0
let vidas = VIDAS_INICIALES
let nivel = 1
let record = 0
let velocidad = 320
let tick = 0
let frame = 0

// Entrada: se guarda la petición de salto y el tick en que se pidió
let pedirSalto = 0          // 0 = nada, 1 = salto normal, 2 = súper salto
let tickPeticion = 0

// Generador del terreno
let huecoRestante = 0
let distanciaSegura = 0

// ---------------- Sonidos ----------------
function sonar(nota: number, duracion: number) {
    music.play(music.tonePlayable(nota, duracion), music.PlaybackMode.InBackground)
}

function sonidoSalto() {
    sonar(Note.C5, music.beat(BeatFraction.Sixteenth))
}

function sonidoMoneda() {
    music.play(music.stringPlayable("B5 E6 - - - - - - ", 900), music.PlaybackMode.InBackground)
}

function sonidoPisoton() {
    music.play(music.stringPlayable("G4 C5 - - - - - - ", 700), music.PlaybackMode.InBackground)
}

function sonidoVida() {
    music.play(music.stringPlayable("C5 E5 G5 C6 - - - - ", 600), music.PlaybackMode.InBackground)
}

function sonidoGolpe() {
    music.play(music.stringPlayable("E4 C4 A3 F3 - - - - ", 400), music.PlaybackMode.UntilDone)
}

function sonidoNivel() {
    music.play(music.stringPlayable("C5 G4 C5 E5 G5 E5 C6 - ", 500), music.PlaybackMode.UntilDone)
}

function melodiaInicio() {
    // Melodía original (no pertenece a ningún juego existente)
    music.play(music.stringPlayable("E5 E5 - C5 E5 - G5 - ", 300), music.PlaybackMode.InBackground)
}

function melodiaFin() {
    music.play(music.stringPlayable("G4 E4 C4 - D4 B3 C4 - ", 220), music.PlaybackMode.UntilDone)
}

// ---------------- Mundo ----------------
function prepararMundo() {
    suelo = []
    enemigo = []
    moneda = []
    corazon = []
    for (let i = 0; i < ANCHO; i++) {
        suelo.push(true)
        enemigo.push(false)
        moneda.push(-1)
        corazon.push(-1)
    }
    huecoRestante = 0
    distanciaSegura = 4
}

// Crea la columna que aparece por la derecha de la pantalla
function generarColumna() {
    let g = true
    let e = false
    let m = -1
    let c = -1

    if (huecoRestante > 0) {
        // Seguimos dibujando un hueco que ya ha empezado
        g = false
        huecoRestante += -1
        distanciaSegura = 4
        if (randint(0, 2) == 0) {
            m = 1       // moneda de premio sobre el hueco
        }
    } else if (distanciaSegura > 0) {
        // Zona segura: solo suelo y, a veces, una moneda
        distanciaSegura += -1
        if (randint(0, 4) == 0) {
            m = randint(1, 2)
        }
    } else {
        const r = randint(0, 99)
        const probHueco = 8 + nivel * 2
        const probEnemigo = 10 + nivel * 3
        const probMoneda = 18
        const probCorazon = 2
        if (r < probHueco) {
            g = false
            // Anchura del hueco: 1 al principio, hasta 3 en niveles altos
            let anchoMax = 1
            if (nivel >= 3) {
                anchoMax = 2
            }
            if (nivel >= 6) {
                anchoMax = 3
            }
            huecoRestante = randint(1, anchoMax) - 1
            distanciaSegura = 4
        } else if (r < probHueco + probEnemigo) {
            e = true
            distanciaSegura = 4
        } else if (r < probHueco + probEnemigo + probMoneda) {
            // Las monedas muy altas (fila 0) solo se cogen con el súper salto
            m = randint(0, 2)
        } else if (r < probHueco + probEnemigo + probMoneda + probCorazon && vidas < VIDAS_MAX) {
            c = 1
        }
    }

    suelo.push(g)
    enemigo.push(e)
    moneda.push(m)
    corazon.push(c)
}

// Desplaza el mundo una columna hacia la izquierda
function desplazarMundo() {
    suelo.shift()
    enemigo.shift()
    moneda.shift()
    corazon.shift()
    generarColumna()
}

// ---------------- Jugador ----------------
// Se puede saltar si estaba pisando suelo (aunque el hueco acabe de llegar
// bajo sus pies: así el salto no se pierde por una centésima)
function puedeSaltar(): boolean {
    return y == FILA_PIE && salto.length == 0
}

function copiar(lista: number[]): number[] {
    let copia: number[] = []
    for (let v of lista) {
        copia.push(v)
    }
    return copia
}

function moverJugador() {
    yAnterior = y

    // ¿Hay una petición de salto reciente (de este tick o del anterior)?
    if (pedirSalto != 0 && tick - tickPeticion <= 1 && puedeSaltar()) {
        if (pedirSalto == 2) {
            salto = copiar(SALTO_SUPER)
        } else {
            salto = copiar(SALTO_NORMAL)
        }
        pedirSalto = 0
        sonidoSalto()
    }

    if (salto.length > 0) {
        y = salto.shift()
    } else if (y < FILA_PIE) {
        y += 1                       // gravedad
    } else if (y == FILA_PIE && !(suelo[COL_JUGADOR])) {
        y = FILA_SUELO               // ¡se cae por el hueco!
    }
}

// ---------------- Colisiones ----------------
function comprobarColisiones() {
    // Monedas
    if (moneda[COL_JUGADOR] >= 0 && moneda[COL_JUGADOR] == y) {
        if (y == 0) {
            puntos += 3              // moneda alta: vale más
        } else {
            puntos += 1
        }
        moneda[COL_JUGADOR] = -1
        sonidoMoneda()
    }

    // Corazón (vida extra)
    if (corazon[COL_JUGADOR] >= 0 && corazon[COL_JUGADOR] == y) {
        corazon[COL_JUGADOR] = -1
        if (vidas < VIDAS_MAX) {
            vidas += 1
        }
        sonidoVida()
    }

    // Enemigos
    if (enemigo[COL_JUGADOR]) {
        if (y == FILA_PIE - 1 && yAnterior < y) {
            // Viene cayendo justo encima: ¡pisotón!
            enemigo[COL_JUGADOR] = false
            puntos += 2
            salto = copiar(REBOTE)
            sonidoPisoton()
        } else if (y == FILA_PIE && invencible == 0) {
            perderVida()
            return
        }
    }

    // Caída por un hueco
    if (y >= FILA_SUELO) {
        perderVida()
    }
}

// ---------------- Vidas, niveles y fin ----------------
function perderVida() {
    mostrarMundo = false
    vidas += -1
    // Animación: el jugador parpadea
    for (let i = 0; i < 3; i++) {
        led.plotBrightness(COL_JUGADOR, Math.min(y, FILA_SUELO), 255)
        basic.pause(100)
        led.unplot(COL_JUGADOR, Math.min(y, FILA_SUELO))
        basic.pause(100)
    }
    sonidoGolpe()
    if (vidas <= 0) {
        terminarPartida()
        return
    }
    basic.showIcon(IconNames.Heart)
    basic.showNumber(vidas)
    basic.clearScreen()
    // Reaparece en suelo firme y con unos instantes de invencibilidad
    prepararMundo()
    y = FILA_PIE
    yAnterior = FILA_PIE
    salto = []
    pedirSalto = 0
    invencible = 12
    mostrarMundo = true
}

function comprobarNivel() {
    const nivelNuevo = Math.min(NIVEL_MAX, 1 + Math.idiv(puntos, PUNTOS_POR_NIVEL))
    if (nivelNuevo > nivel) {
        nivel = nivelNuevo
        velocidad = Math.max(130, 320 - (nivel - 1) * 25)
        mostrarMundo = false
        basic.clearScreen()
        sonidoNivel()
        basic.showString("N" + nivel)
        basic.clearScreen()
        mostrarMundo = true
    }
}

function empezarPartida() {
    puntos = 0
    vidas = VIDAS_INICIALES
    nivel = 1
    velocidad = 320
    tick = 0
    y = FILA_PIE
    yAnterior = FILA_PIE
    salto = []
    pedirSalto = 0
    invencible = 0
    pausa = false
    prepararMundo()
    melodiaInicio()
    basic.showNumber(3)
    basic.showNumber(2)
    basic.showNumber(1)
    basic.clearScreen()
    estado = JUGANDO
    mostrarMundo = true
}

function terminarPartida() {
    estado = FIN
    mostrarMundo = false
    basic.showIcon(IconNames.Sad)
    melodiaFin()
    if (puntos > record) {
        record = puntos
        basic.showString("RECORD!")
    }
    basic.showString("PUNTOS")
    basic.showNumber(puntos)
    basic.pause(500)
    estado = MENU
}

// ---------------- Dibujo ----------------
function dibujar() {
    for (let x = 0; x < ANCHO; x++) {
        for (let f = 0; f < 5; f++) {
            let brillo = 0
            if (f == FILA_SUELO && suelo[x]) {
                brillo = 25
            }
            if (f == FILA_PIE && enemigo[x]) {
                brillo = frame % 6 < 3 ? 160 : 70
            }
            if (moneda[x] == f) {
                brillo = frame % 4 < 2 ? 40 : 90
            }
            if (corazon[x] == f) {
                brillo = frame % 2 == 0 ? 255 : 0
            }
            if (x == COL_JUGADOR && f == y) {
                brillo = 255
                if (invencible > 0 && frame % 2 == 0) {
                    brillo = 60
                }
            }
            led.plotBrightness(x, f, brillo)
        }
    }
}

// Animación del menú: Saltarín salta sin parar
let pasoMenu = 0
const MENU_Y = [3, 2, 1, 1, 2, 3, 3, 3]
function dibujarMenu() {
    basic.clearScreen()
    for (let x = 0; x < ANCHO; x++) {
        led.plotBrightness(x, FILA_SUELO, 25)
    }
    led.plotBrightness(2, MENU_Y[pasoMenu % MENU_Y.length], 255)
    pasoMenu += 1
}

// ---------------- Controles ----------------
input.onButtonPressed(Button.A, function () {
    if (estado == MENU) {
        estado = -1   // evita empezar dos veces mientras se prepara
        empezarPartida()
    } else if (estado == JUGANDO && !pausa) {
        pedirSalto = 1
        tickPeticion = tick
    }
})

input.onButtonPressed(Button.B, function () {
    if (estado == JUGANDO && !pausa) {
        pedirSalto = 2
        tickPeticion = tick
    }
})

input.onButtonPressed(Button.AB, function () {
    if (estado == JUGANDO) {
        pausa = !pausa
        if (pausa) {
            mostrarMundo = false
            basic.showLeds(`
                . # . # .
                . # . # .
                . # . # .
                . # . # .
                . # . # .
                `)
        } else {
            basic.clearScreen()
            mostrarMundo = true
        }
    }
})

// Agitar la micro:bit en el menú muestra el récord
input.onGesture(Gesture.Shake, function () {
    if (estado == MENU) {
        estado = -1
        basic.showString("REC")
        basic.showNumber(record)
        estado = MENU
    }
})

// ---------------- Bucles principales ----------------
// Bucle de juego: avanza el mundo a la velocidad del nivel
basic.forever(function () {
    if (estado == JUGANDO && !pausa && mostrarMundo) {
        tick += 1
        desplazarMundo()
        moverJugador()
        if (invencible > 0) {
            invencible += -1
        }
        comprobarColisiones()
        if (estado == JUGANDO) {
            comprobarNivel()
        }
        basic.pause(velocidad)
    } else if (estado == MENU) {
        dibujarMenu()
        basic.pause(150)
    } else {
        basic.pause(50)
    }
})

// Bucle de dibujo: refresca la pantalla y hace parpadear los objetos
basic.forever(function () {
    if (estado == JUGANDO && mostrarMundo && !pausa) {
        frame += 1
        dibujar()
    }
    basic.pause(60)
})

// ---------------- Inicio ----------------
estado = -1
prepararMundo()
basic.showString("SUPER SALTARIN")
estado = MENU
