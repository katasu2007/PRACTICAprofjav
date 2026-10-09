import { describe, expect, it } from 'vitest'
import {
  CONFIG,
  DICCIONARIO_NAHUAT,
  crearPartida,
  crearPartidaDelDia,
  evaluarIntento,
  normalizarPalabra,
  obtenerEstadoTecla,
  proponerIntento,
  seleccionarPalabra,
  type EstadoJuego,
} from '../src/logica'

function crearPartidaDePrueba(palabraObjetivo: string): EstadoJuego {
  return {
    palabraObjetivo,
    intentos: [],
    estado: 'enCurso',
    aprendizaje: null,
  }
}

describe('Lógica de NÁHUAT DIARIO', () => {
  it('mantiene la misma palabra objetivo durante el mismo día', () => {
    const partidaMañana = crearPartidaDelDia(new Date(2026, 9, 8, 9))
    const partidaTarde = crearPartidaDelDia(new Date(2026, 9, 8, 18))

    expect(partidaMañana.palabraObjetivo).toBe(partidaTarde.palabraObjetivo)
    expect(
      DICCIONARIO_NAHUAT.some(
        (entrada) => entrada.palabra === partidaMañana.palabraObjetivo,
      ),
    ).toBe(true)
  })

  it('arma una partida inicial con seis intentos y un objetivo del vocabulario', () => {
    const partida = crearPartida(100_000)

    expect(partida.estado).toBe('enCurso')
    expect(partida.intentos).toHaveLength(0)
    expect(CONFIG.MAX_INTENTOS - partida.intentos.length).toBe(6)
    expect(partida.palabraObjetivo).toBe(
      seleccionarPalabra(100_000).palabra,
    )
    expect(
      DICCIONARIO_NAHUAT.some(
        (entrada) => entrada.palabra === partida.palabraObjetivo,
      ),
    ).toBe(true)
    expect(partida.aprendizaje).toBeNull()
  })

  it('evalúa palabras de longitudes variables y permite grafías sin diacríticos', () => {
    expect(normalizarPalabra('tomātl')).toBe('tomatl')
    expect(evaluarIntento('comal', 'comal')?.map(({ estado }) => estado)).toEqual(
      Array.from({ length: 'comal'.length }, () => 'correcta'),
    )
    expect(evaluarIntento('cuacuahue', 'cuacuahue')).toHaveLength(9)
    expect(evaluarIntento('cuate', 'cuacuahue')).toBeNull()
  })

  it('acepta una palabra del vocabulario de la longitud del objetivo y evalúa cada letra', () => {
    const partida = crearPartidaDePrueba('comal')

    expect(proponerIntento(partida, 'coatl')).toBe(true)
    expect(partida.intentos).toHaveLength(1)
    expect(partida.intentos[0].palabra).toBe('coatl')
    expect(partida.intentos[0].letras.map(({ estado }) => estado)).toEqual([
      'correcta',
      'correcta',
      'presente',
      'ausente',
      'correcta',
    ])
    expect(obtenerEstadoTecla(partida, 'c')).toBe('correcta')
    expect(partida.estado).toBe('enCurso')
  })

  it('rechaza palabras desconocidas y palabras del vocabulario de otra longitud', () => {
    const partida = crearPartidaDePrueba('comal')

    expect(proponerIntento(partida, 'hola')).toBe(false)
    expect(proponerIntento(partida, 'chocolatl')).toBe(false)
    expect(partida.intentos).toHaveLength(0)
    expect(partida.estado).toBe('enCurso')
  })

  it('termina en victoria y revela la traducción y categoría al adivinar', () => {
    const partida = crearPartidaDePrueba('tomātl')

    expect(proponerIntento(partida, 'tomatl')).toBe(true)
    expect(partida.estado).toBe('ganada')
    expect(partida.aprendizaje).toMatchObject({
      palabra: 'tomātl',
      traduccion: 'tomate; agua gorda',
      categoria: 'Palabras frecuentes',
    })
  })

  it('termina en derrota y revela el aprendizaje después de seis intentos fallidos', () => {
    const partida = crearPartidaDePrueba('comal')
    const intentosFallidos = DICCIONARIO_NAHUAT.filter(
      (entrada) =>
        Array.from(normalizarPalabra(entrada.palabra)).length ===
          partida.palabraObjetivo.length &&
        normalizarPalabra(entrada.palabra) !== partida.palabraObjetivo,
    ).slice(0, CONFIG.MAX_INTENTOS)

    expect(intentosFallidos).toHaveLength(CONFIG.MAX_INTENTOS)
    for (const intento of intentosFallidos) {
      expect(proponerIntento(partida, intento.palabra)).toBe(true)
    }

    expect(partida.estado).toBe('perdida')
    expect(partida.aprendizaje).toMatchObject({
      palabra: 'comal',
      traduccion: 'sartén donde se cuecen tortillas de maíz',
    })
  })

  it('rechaza nuevos intentos cuando la partida ya fue ganada o perdida', () => {
    const ganada = crearPartidaDePrueba('cuate')
    expect(proponerIntento(ganada, 'cuate')).toBe(true)
    expect(proponerIntento(ganada, 'comal')).toBe(false)

    const perdida = crearPartidaDePrueba('comal')
    const fallos = DICCIONARIO_NAHUAT.filter(
      (entrada) =>
        entrada.palabra.length === perdida.palabraObjetivo.length &&
        entrada.palabra !== perdida.palabraObjetivo,
    ).slice(0, CONFIG.MAX_INTENTOS)
    for (const fallo of fallos) {
      proponerIntento(perdida, fallo.palabra)
    }
    expect(perdida.estado).toBe('perdida')
    expect(proponerIntento(perdida, 'comal')).toBe(false)
  })

  it('recorre una partida completa hasta acertar y revela el significado en español', () => {
    const partida = crearPartidaDePrueba('axolotl')
    const intentosPrevios = DICCIONARIO_NAHUAT.filter(
      (entrada) =>
        Array.from(normalizarPalabra(entrada.palabra)).length ===
          partida.palabraObjetivo.length &&
        normalizarPalabra(entrada.palabra) !== partida.palabraObjetivo,
    ).slice(0, 2)

    for (const intento of intentosPrevios) {
      expect(proponerIntento(partida, intento.palabra)).toBe(true)
      expect(partida.estado).toBe('enCurso')
    }
    expect(proponerIntento(partida, 'axolotl')).toBe(true)
    expect(partida.estado).toBe('ganada')
    expect(partida.aprendizaje).toMatchObject({
      palabra: 'axolotl',
      traduccion: 'ajolote',
    })
  })
})
