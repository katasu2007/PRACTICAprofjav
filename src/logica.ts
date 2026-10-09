export const CONFIG = {
  MAX_INTENTOS: 6, // unidad: intentos por partida
  MODULO_GENERADOR: 2_147_483_647, // unidad: estados posibles del generador
  MULTIPLICADOR_GENERADOR: 16_807, // unidad: factor del generador
} as const

export type EstadoLetra = 'correcta' | 'presente' | 'ausente'
export type EstadoPartida = 'enCurso' | 'ganada' | 'perdida'

export interface EntradaDiccionario {
  readonly palabra: string
  readonly traduccion: string
  readonly categoria: string
  readonly fuente: string
}

export interface LetraEvaluada {
  readonly letra: string
  readonly estado: EstadoLetra
}

export interface IntentoEvaluado {
  readonly palabra: string
  readonly letras: readonly LetraEvaluada[]
}

export interface AprendizajeFinal {
  readonly palabra: string
  readonly traduccion: string
  readonly categoria: string
  readonly fuente: string
}

export interface EstadoJuego {
  readonly palabraObjetivo: string
  intentos: IntentoEvaluado[]
  estado: EstadoPartida
  aprendizaje: AprendizajeFinal | null
}

export const FUENTE_DICCIONARIO =
  'https://www.ejemplos.co/palabras-en-nahuatl-y-su-significado/'

const VOCABULARIO: readonly (readonly [string, string, string])[] = [
  ['chocolatl', 'chocolate', 'Palabras frecuentes'],
  ['comal', 'sartén donde se cuecen tortillas de maíz', 'Palabras frecuentes'],
  ['cuate', 'mellizo; amigo', 'Palabras frecuentes'],
  [
    'xical',
    'jícara: vasija elaborada con calabaza; se usa para beber pozol o tejate',
    'Palabras frecuentes',
  ],
  ['huey', 'grande; honorable y venerado', 'Palabras frecuentes'],
  ['popotl', 'escoba', 'Palabras frecuentes'],
  ['tianquizco', 'tianguis; mercado', 'Palabras frecuentes'],
  ['tomātl', 'tomate; agua gorda', 'Palabras frecuentes'],
  ['papalotl', 'mariposa', 'Palabras frecuentes y animales'],
  ['elotl', 'elote; mazorca de maíz', 'Palabras frecuentes'],
  ['ahuacamolli', 'guacamole; aguacate y salsa', 'Palabras frecuentes'],
  ['tzictli', 'goma de mascar', 'Palabras frecuentes'],
  ['macehualiztli', 'danza', 'Palabras frecuentes'],
  ['oquichtli', 'hombre; varón', 'Personas y familia'],
  ['cihuatl', 'mujer', 'Personas y familia'],
  ['colli', 'abuelo; anciano', 'Personas y familia'],
  ['cone', 'niño o niña', 'Personas y familia'],
  ['conetl', 'hijo', 'Personas y familia'],
  ['ichpochtli', 'muchacha; jovencita; señorita', 'Personas y familia'],
  ['huehue', 'anciano', 'Personas y familia'],
  ['icniuhtli', 'amigo; compañero', 'Personas y familia'],
  ['icnotl', 'huérfano', 'Personas y familia'],
  ['ilamatl', 'anciana; vieja', 'Personas y familia'],
  ['nantli', 'madre; mamá', 'Personas y familia'],
  ['piltzintli', 'niño', 'Personas y familia'],
  ['pochtecatl', 'comerciante; mercader', 'Personas y familia'],
  ['tahtli', 'padre; papá', 'Personas y familia'],
  [
    'telpochtli',
    'muchacho; joven; mozo de edad pequeña',
    'Personas y familia',
  ],
  ['temachtiani', 'profesor; maestro', 'Personas y familia'],
  ['momachtiani', 'alumno; aprendiz', 'Personas y familia'],
  ['tenamac', 'esposo; marido', 'Personas y familia'],
  ['tenamic', 'esposo; marido', 'Personas y familia'],
  ['tlatoani', 'gobernante; amo; gran señor', 'Personas y familia'],
  ['tlamatini', 'sabio; erudito', 'Personas y familia'],
  ['xocoyotl', 'hijo o hija menor', 'Personas y familia'],
  ['ahuacayol', 'testículo', 'Cuerpo'],
  ['camatl', 'boca', 'Cuerpo'],
  ['nacatl', 'carne', 'Cuerpo y comida'],
  ['cuaitl', 'cabeza', 'Cuerpo'],
  ['cuitlapantli', 'espalda', 'Cuerpo'],
  ['elpantli', 'pecho', 'Cuerpo'],
  ['icxitl', 'pie; pies', 'Cuerpo'],
  ['ixtelolotli', 'ojo', 'Cuerpo'],
  ['ixcuaitl', 'frente; parte de la cabeza', 'Cuerpo'],
  ['iztetl', 'uña', 'Cuerpo'],
  ['maitl', 'mano; manos', 'Cuerpo'],
  ['mapilli', 'dedo; dedos de la mano', 'Cuerpo'],
  ['metztli', 'muslo; pierna', 'Cuerpo'],
  ['molictli', 'codo', 'Cuerpo'],
  ['acolli', 'hombro', 'Cuerpo'],
  ['nenepilli', 'lengua (músculo)', 'Cuerpo'],
  ['tzontli', 'cabello', 'Cuerpo'],
  ['quechtli', 'cuello', 'Cuerpo'],
  ['tentli', 'labios', 'Cuerpo'],
  ['tzintamalli', 'nalga', 'Cuerpo'],
  ['tepilli', 'vagina', 'Cuerpo'],
  ['tepolli', 'pene', 'Cuerpo'],
  ['tzontecomatl', 'cabeza', 'Cuerpo'],
  ['xopilli', 'dedo del pie', 'Cuerpo'],
  ['axno', 'burro', 'Animales'],
  ['axolotl', 'ajolote', 'Animales'],
  ['azcatl', 'hormiga', 'Animales'],
  ['cahuayo', 'caballo', 'Animales'],
  ['chapolin', 'langosta', 'Animales'],
  ['coatl', 'serpiente', 'Animales'],
  ['copitl', 'luciérnaga', 'Animales'],
  ['coyotl', 'zorra', 'Animales'],
  ['cuacuahue', 'toro', 'Animales'],
  ['caxtil', 'gallo', 'Animales'],
  ['cuauhtli', 'águila', 'Animales'],
  ['cueyatl', 'rana', 'Animales'],
  ['epatl', 'zorrillo', 'Animales'],
  ['huexolotl', 'pavo', 'Animales'],
  ['huilotl', 'paloma', 'Animales'],
  ['huitzitzilin', 'colibrí', 'Animales'],
  ['ichcatl', 'oveja', 'Animales'],
  ['itzcuintli', 'perro', 'Animales'],
  ['mayatl', 'mayate; escarabajo volador', 'Animales'],
  ['michin', 'pez', 'Animales'],
  ['miztli', 'león', 'Animales'],
  ['mizton', 'gato', 'Animales'],
  ['moyotl', 'mosquito', 'Animales'],
  ['ozomatli', 'mono', 'Animales'],
  ['pinacatl', 'pinacate; escarabajo negro', 'Animales'],
  ['pioconetl', 'pollito', 'Animales'],
  ['pitzotl', 'puerco', 'Animales'],
  ['ahuehuetl', 'cedro', 'Plantas'],
  ['cuahuitl', 'árbol', 'Plantas'],
  ['malinalli', 'paja para casas', 'Plantas'],
  ['metl', 'maguey; pita', 'Plantas'],
  ['equilitl', 'quelite', 'Plantas'],
  ['acatl', 'caña', 'Comida'],
  ['ahuacatl', 'aguacate', 'Comida'],
  ['iztatl', 'sal', 'Comida'],
  ['atolli', 'atole', 'Comida'],
  ['cacahuatl', 'cacao', 'Comida'],
  ['centli', 'maíz', 'Comida'],
  ['chilli', 'chile', 'Comida'],
  ['tzapo', 'plátano', 'Comida'],
  ['etl', 'frijol', 'Comida'],
  ['xocotl', 'naranja', 'Comida'],
  ['molli', 'mole; guiso; salsa', 'Comida'],
  ['nanacatl', 'hongo', 'Comida'],
  ['pinolli', 'pinole', 'Comida'],
  ['pozolatl', 'pozole; bebida de maíz cocido', 'Comida'],
  ['tamalli', 'tamal', 'Comida'],
  ['texocotl', 'manzana', 'Comida'],
  ['tlaxcalli', 'tortilla; pan', 'Comida'],
  ['tzopelic', 'dulce', 'Comida'],
]

export const DICCIONARIO_NAHUAT: readonly EntradaDiccionario[] =
  VOCABULARIO.map(([palabra, traduccion, categoria]) => ({
    palabra,
    traduccion,
    categoria,
    fuente: FUENTE_DICCIONARIO,
  }))

export function normalizarPalabra(palabra: string): string {
  return palabra
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

function buscarEntrada(palabra: string): EntradaDiccionario | undefined {
  const normalizada = normalizarPalabra(palabra)
  return DICCIONARIO_NAHUAT.find(
    (entrada) => normalizarPalabra(entrada.palabra) === normalizada,
  )
}

export function generarNumeroAleatorio(semilla: number): number {
  if (!Number.isSafeInteger(semilla)) {
    throw new RangeError('La semilla debe ser un número entero seguro.')
  }

  const modulo = CONFIG.MODULO_GENERADOR
  const semillaNormalizada =
    ((semilla % (modulo - 1)) + (modulo - 1)) % (modulo - 1)
  const siguienteEstado =
    ((semillaNormalizada + 1) * CONFIG.MULTIPLICADOR_GENERADOR) % modulo

  return siguienteEstado / modulo
}

export function seleccionarPalabra(semilla: number): EntradaDiccionario {
  const indice = Math.floor(
    generarNumeroAleatorio(semilla) * DICCIONARIO_NAHUAT.length,
  )
  return DICCIONARIO_NAHUAT[indice]
}

export function crearPartida(semilla: number): EstadoJuego {
  return {
    palabraObjetivo: seleccionarPalabra(semilla).palabra,
    intentos: [],
    estado: 'enCurso',
    aprendizaje: null,
  }
}

export function crearPartidaDelDia(fecha: Date = new Date()): EstadoJuego {
  const fechaLocal = new Date(
    fecha.getFullYear(),
    fecha.getMonth(),
    fecha.getDate(),
  )
  return crearPartida(fechaLocal.getTime())
}

export function obtenerEstadoTecla(
  partida: EstadoJuego,
  letra: string,
): EstadoLetra | null {
  const prioridad: Record<EstadoLetra, number> = {
    ausente: 1,
    presente: 2,
    correcta: 3,
  }
  let estado: EstadoLetra | null = null

  for (const intento of partida.intentos) {
    for (const evaluada of intento.letras) {
      if (
        evaluada.letra === normalizarPalabra(letra) &&
        (!estado || prioridad[evaluada.estado] > prioridad[estado])
      ) {
        estado = evaluada.estado
      }
    }
  }

  return estado
}

export function evaluarIntento(
  intento: string,
  palabraObjetivo: string,
): LetraEvaluada[] | null {
  const letrasIntento = Array.from(normalizarPalabra(intento))
  const letrasObjetivo = Array.from(normalizarPalabra(palabraObjetivo))

  if (
    letrasIntento.length === 0 ||
    letrasIntento.length !== letrasObjetivo.length
  ) {
    return null
  }

  const estados: EstadoLetra[] = Array(letrasIntento.length).fill('ausente')
  const letrasDisponibles = new Map<string, number>()

  for (let indice = 0; indice < letrasIntento.length; indice += 1) {
    if (letrasIntento[indice] === letrasObjetivo[indice]) {
      estados[indice] = 'correcta'
    } else {
      const letra = letrasObjetivo[indice]
      letrasDisponibles.set(letra, (letrasDisponibles.get(letra) ?? 0) + 1)
    }
  }

  for (let indice = 0; indice < letrasIntento.length; indice += 1) {
    if (estados[indice] === 'correcta') {
      continue
    }

    const letra = letrasIntento[indice]
    const cantidadDisponible = letrasDisponibles.get(letra) ?? 0

    if (cantidadDisponible > 0) {
      estados[indice] = 'presente'
      letrasDisponibles.set(letra, cantidadDisponible - 1)
    } else {
      estados[indice] = 'ausente'
    }
  }

  return letrasIntento.map((letra, indice) => ({
    letra,
    estado: estados[indice],
  }))
}

export function proponerIntento(
  partida: EstadoJuego,
  propuesta: string,
): boolean {
  if (
    partida.estado !== 'enCurso' ||
    partida.intentos.length >= CONFIG.MAX_INTENTOS
  ) {
    return false
  }

  const respuesta = buscarEntrada(partida.palabraObjetivo)
  const entrada = buscarEntrada(propuesta)
  if (
    !respuesta ||
    !entrada ||
    normalizarPalabra(entrada.palabra).length !==
      normalizarPalabra(partida.palabraObjetivo).length
  ) {
    return false
  }

  const letras = evaluarIntento(entrada.palabra, partida.palabraObjetivo)
  if (!letras) {
    return false
  }

  partida.intentos.push({ palabra: entrada.palabra, letras })

  if (
    normalizarPalabra(entrada.palabra) ===
    normalizarPalabra(partida.palabraObjetivo)
  ) {
    partida.estado = 'ganada'
  } else if (partida.intentos.length === CONFIG.MAX_INTENTOS) {
    partida.estado = 'perdida'
  }

  if (partida.estado !== 'enCurso') {
    partida.aprendizaje = {
      palabra: respuesta.palabra,
      traduccion: respuesta.traduccion,
      categoria: respuesta.categoria,
      fuente: respuesta.fuente,
    }
  }

  return true
}
