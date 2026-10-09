import './estilo.css'
import {
  CONFIG,
  DICCIONARIO_NAHUAT,
  FUENTE_DICCIONARIO,
  crearPartidaDelDia,
  normalizarPalabra,
  obtenerEstadoTecla,
  proponerIntento,
  type EstadoJuego,
} from './logica'

const contenedor = document.querySelector<HTMLDivElement>('#app')

if (!contenedor) {
  throw new Error('No se encontró el contenedor principal de la aplicación.')
}

const app: HTMLDivElement = contenedor

type Vista = 'inicio' | 'estudio' | 'juego'

let partida: EstadoJuego | null = null
let propuesta = ''
let aviso = ''
let vista: Vista = 'inicio'
let busqueda = ''
let categoriaEstudio = 'Todas'
const fichasReveladas = new Set<string>()

const TECLADO = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'ñ'],
  ['borrar', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'enviar'],
]

const CATEGORIAS = [
  'Todas',
  ...new Set(DICCIONARIO_NAHUAT.map((entrada) => entrada.categoria)),
]

function escaparHTML(texto: string): string {
  return texto.replace(/[&<>"']/g, (caracter) => {
    const entidades: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    }
    return entidades[caracter]
  })
}

function iniciarPartida(): void {
  partida = crearPartidaDelDia()
  propuesta = ''
  aviso = ''
  vista = 'juego'
  dibujar()
}

function dibujarTablero(): string {
  if (!partida) return ''

  const longitud = Array.from(partida.palabraObjetivo).length
  const filas = Array.from({ length: CONFIG.MAX_INTENTOS }, (_, indiceFila) => {
    const intento = partida?.intentos[indiceFila]
    const esFilaActiva = indiceFila === partida?.intentos.length

    return `<div class="fila-tablero" role="row" aria-label="Intento ${indiceFila + 1}">
      ${Array.from({ length: longitud }, (_, indiceLetra) => {
        const evaluada = intento?.letras[indiceLetra]
        const letra = evaluada?.letra ?? (esFilaActiva ? propuesta[indiceLetra] : '')
        const clase = evaluada
          ? ` letra-${evaluada.estado}`
          : letra
            ? ' casilla-activa'
            : ''
        const etiqueta = evaluada
          ? `${letra}, ${evaluada.estado}`
          : letra || 'vacía'

        return `<div class="casilla${clase}" role="cell" aria-label="${escaparHTML(etiqueta)}">${escaparHTML(letra ?? '')}</div>`
      }).join('')}
    </div>`
  }).join('')

  return `<div class="tablero" style="--longitud-palabra:${longitud}" role="table" aria-label="Tablero de seis intentos por ${longitud} letras">${filas}</div>`
}

function dibujarTeclado(): string {
  return `<div class="teclado" aria-label="Teclado en pantalla">
    ${TECLADO.map(
      (fila) => `<div class="fila-teclado">
        ${fila
          .map((tecla) => {
            const esAccion = tecla === 'borrar' || tecla === 'enviar'
            const estado =
              esAccion || !partida
                ? ''
                : obtenerEstadoTecla(partida, tecla) ?? ''
            const claseEstado = estado ? ` tecla-${estado}` : ''
            const texto =
              tecla === 'borrar'
                ? '⌫ Borrar'
                : tecla === 'enviar'
                  ? 'Enviar'
                  : tecla
            const etiqueta =
              tecla === 'borrar'
                ? 'Borrar última letra'
                : tecla === 'enviar'
                  ? 'Enviar intento'
                  : `Letra ${tecla}`

            return `<button class="tecla${esAccion ? ' tecla-accion' : ''}${claseEstado}" type="button" data-tecla="${tecla}" aria-label="${etiqueta}">${texto}</button>`
          })
          .join('')}
      </div>`,
    ).join('')}
  </div>`
}

function encabezado(etiqueta: string): string {
  const volverAlJuego =
    partida?.estado === 'enCurso'
      ? '<button class="enlace-nav" type="button" data-accion="continuar">Volver a la partida</button>'
      : ''

  return `<header class="barra-superior">
    <a class="marca" href="#" aria-label="Náhuat Diario, inicio" data-accion="inicio"><span class="marca-sello" aria-hidden="true">N</span><span>NÁHUAT<br>DIARIO</span></a>
    <span class="insignia-dia">${etiqueta} <span aria-hidden="true">✦</span></span>
    ${volverAlJuego}
  </header>`
}

function piePagina(): string {
  return '<footer class="pie-pagina"><span>APRENDER · JUGAR · REVITALIZAR</span><span>NÁHUATL · VARIANTES DE MÉXICO</span></footer>'
}

function dibujarInicio(): void {
  app.innerHTML = `<main class="escena">
    ${encabezado('JUEGO DIARIO')}
    <section class="bienvenida" aria-labelledby="titulo-principal">
      <div class="arco-ruina" aria-hidden="true"><span class="sol-antiguo"></span><span class="pilar pilar-izquierdo"></span><span class="pilar pilar-derecho"></span><span class="dintel"></span><span class="escalon"></span></div>
      <p class="sobretitulo">UNA PALABRA · UNA LENGUA VIVA</p>
      <h1 id="titulo-principal">Descubrí el<br><span>náhuatl</span> de hoy</h1>
      <p class="texto-bienvenida">Explorá palabras del náhuatl, encontrá la palabra diaria y descubrí sus significados.</p>
      <div class="resumen-reglas"><span>Palabras de distintas longitudes</span><i aria-hidden="true"></i><span>6 intentos</span></div>
      <div class="acciones-inicio">
        <button class="boton-principal" type="button" data-accion="empezar">Jugar palabra diaria <span aria-hidden="true">→</span></button>
        <button class="boton-secundario" type="button" data-accion="estudiar">Estudiar vocabulario <span aria-hidden="true">✦</span></button>
      </div>
      <p class="nota-teclado">Grafías y significados pueden variar según la región. Fuente: Ejemplos.co.</p>
    </section>
    ${piePagina()}
  </main>`
}

function dibujarEstudio(): void {
  const busquedaNormalizada = normalizarPalabra(busqueda.trim())
  const entradas = DICCIONARIO_NAHUAT.filter((entrada) => {
    const coincideCategoria =
      categoriaEstudio === 'Todas' || entrada.categoria === categoriaEstudio
    const textoEntrada = normalizarPalabra(
      `${entrada.palabra} ${entrada.traduccion} ${entrada.categoria}`,
    )
    return coincideCategoria && textoEntrada.includes(busquedaNormalizada)
  })

  const opcionesCategoria = CATEGORIAS.map(
    (categoria) =>
      `<option value="${escaparHTML(categoria)}"${categoria === categoriaEstudio ? ' selected' : ''}>${escaparHTML(categoria)}</option>`,
  ).join('')

  const fichas = entradas
    .map((entrada) => {
      const revelada = fichasReveladas.has(entrada.palabra)
      return `<article class="ficha-estudio${revelada ? ' ficha-revelada' : ''}">
        <span class="ficha-categoria">${escaparHTML(entrada.categoria)}</span>
        <h3 lang="nah">${escaparHTML(entrada.palabra)}</h3>
        <p class="ficha-significado">${revelada ? escaparHTML(entrada.traduccion) : 'Tocá para descubrir su significado'}</p>
        <button class="boton-ficha" type="button" data-ficha="${escaparHTML(entrada.palabra)}" aria-expanded="${revelada}">${revelada ? 'Ocultar significado' : 'Revelar significado'}</button>
      </article>`
    })
    .join('')

  app.innerHTML = `<main class="escena escena-estudio">
    ${encabezado('CUADERNO DE PALABRAS')}
    <section class="zona-estudio" aria-labelledby="titulo-estudio">
      <p class="sobretitulo">OBSERVÁ · RECORDÁ · DESCUBRÍ</p>
      <h1 id="titulo-estudio">Cuaderno de palabras</h1>
      <p class="texto-estudio">Explorá el vocabulario por tema o buscá una palabra. Tocá cada ficha para revelar su significado.</p>
      <aside class="nota-fuente">
        El sitio fuente presenta formas de variantes del náhuatl y advierte que la escritura y los significados pueden cambiar según la región.
        <a href="${FUENTE_DICCIONARIO}" target="_blank" rel="noreferrer">Consultar la fuente</a>
      </aside>
      <div class="filtros-estudio">
        <label for="buscar-vocabulario">Buscar en el vocabulario</label>
        <input id="buscar-vocabulario" type="search" value="${escaparHTML(busqueda)}" placeholder="Palabra o significado" autocomplete="off">
        <label for="categoria-vocabulario">Tema</label>
        <select id="categoria-vocabulario">${opcionesCategoria}</select>
      </div>
      <p class="contador-fichas" aria-live="polite">Mostrando ${entradas.length} de ${DICCIONARIO_NAHUAT.length} palabras</p>
      <div class="rejilla-fichas">${fichas || '<p class="sin-resultados">No hay palabras que coincidan con esa búsqueda.</p>'}</div>
      <div class="acciones-estudio">
        <button class="boton-principal" type="button" data-accion="empezar">Jugar palabra diaria <span aria-hidden="true">→</span></button>
        <button class="boton-secundario" type="button" data-accion="inicio">Volver al inicio</button>
      </div>
    </section>
    ${piePagina()}
  </main>`
}

function dibujarPartida(): void {
  if (!partida) return

  const restantes = CONFIG.MAX_INTENTOS - partida.intentos.length
  const longitud = Array.from(partida.palabraObjetivo).length
  app.innerHTML = `<main class="escena escena-juego">
    ${encabezado('PALABRA DEL DÍA')}
    <section class="zona-juego" aria-labelledby="titulo-juego">
      <div class="encabezado-juego"><p class="sobretitulo">LA PIEDRA GUARDA UNA PALABRA</p><h1 id="titulo-juego">¿Cuál es la palabra?</h1><p class="instruccion">Ingresá una palabra náhuatl de ${longitud} letras.</p></div>
      <p class="contador-intentos" aria-live="polite">Intentos disponibles: <strong>${restantes}</strong> de ${CONFIG.MAX_INTENTOS}</p>
      ${dibujarTablero()}
      <form class="formulario-intento" data-formulario>
        <label class="etiqueta-oculta" for="entrada-palabra">Tu palabra de ${longitud} letras</label>
        <input id="entrada-palabra" class="entrada-palabra" type="text" maxlength="${longitud}" autocomplete="off" autocapitalize="none" spellcheck="false" value="${escaparHTML(propuesta)}" placeholder="Escribí una palabra" aria-describedby="aviso-intento">
        <button class="boton-principal boton-enviar" type="submit">Probar palabra <span aria-hidden="true">→</span></button>
      </form>
      <p id="aviso-intento" class="aviso" aria-live="polite">${escaparHTML(aviso || 'Las propuestas deben ser palabras del cuaderno y tener la misma longitud que la palabra diaria.')}</p>
      ${dibujarTeclado()}
      <div class="leyenda" aria-label="Significado de los colores"><span><i class="muestra muestra-correcta"></i>Letra y lugar correctos</span><span><i class="muestra muestra-presente"></i>Está en otra posición</span><span><i class="muestra muestra-ausente"></i>No está en la palabra</span></div>
    </section>
    ${piePagina()}
  </main>`
}

function dibujarFinal(): void {
  if (!partida?.aprendizaje) return

  const victoria = partida.estado === 'ganada'
  const aprendizaje = partida.aprendizaje
  app.innerHTML = `<main class="escena escena-final">
    ${encabezado('PALABRA DEL DÍA')}
    <section class="tarjeta-final" aria-labelledby="titulo-final">
      <div class="sello-final ${victoria ? 'sello-victoria' : 'sello-derrota'}" aria-hidden="true">${victoria ? '✦' : '◇'}</div>
      <p class="sobretitulo">${victoria ? '¡PALABRA DESCUBIERTA!' : 'LA PIEDRA REVELÓ SU SECRETO'}</p>
      <h1 id="titulo-final">${victoria ? '¡Muy bien!' : 'Mañana habrá otra palabra'}</h1>
      <div class="palabra-revelada" lang="nah">${escaparHTML(aprendizaje.palabra)}</div>
      <p class="significado"><span>EN ESPAÑOL</span><strong>${escaparHTML(aprendizaje.traduccion)}</strong></p>
      <div class="dato-cultural"><span class="etiqueta-dato">${escaparHTML(aprendizaje.categoria)}</span><p>Forma y traducción tomadas de la variante que presenta la fuente.</p><a href="${aprendizaje.fuente}" target="_blank" rel="noreferrer">Ver fuente</a></div>
      <button class="boton-principal" type="button" data-accion="reiniciar">Volver a jugar <span aria-hidden="true">→</span></button>
      <button class="boton-secundario" type="button" data-accion="estudiar">Estudiar palabras</button>
      <p class="nota-teclado">${partida.intentos.length} de ${CONFIG.MAX_INTENTOS} intentos utilizados</p>
    </section>
    ${piePagina()}
  </main>`
}

function dibujar(): void {
  if (partida && partida.estado !== 'enCurso') {
    dibujarFinal()
  } else if (vista === 'estudio') {
    dibujarEstudio()
  } else if (vista === 'juego' && partida) {
    dibujarPartida()
  } else {
    dibujarInicio()
  }
}

function actualizarPropuesta(nuevaPropuesta: string): void {
  if (!partida) return

  const longitud = Array.from(partida.palabraObjetivo).length
  propuesta = Array.from(normalizarPalabra(nuevaPropuesta))
    .slice(0, longitud)
    .join('')
  dibujarPartida()
  app.querySelector<HTMLInputElement>('#entrada-palabra')?.focus()
}

function enviarPropuesta(): void {
  if (!partida) return

  const aceptada = proponerIntento(partida, propuesta)
  if (!aceptada) {
    aviso =
      'La propuesta no se aceptó. Elegí una palabra del cuaderno con la longitud indicada.'
    dibujarPartida()
    app.querySelector<HTMLInputElement>('#entrada-palabra')?.focus()
    return
  }

  propuesta = ''
  aviso = ''
  dibujar()
}

app.addEventListener('click', (evento: MouseEvent) => {
  const objetivo = evento.target
  if (!(objetivo instanceof Element)) return

  const botonAccion = objetivo.closest<HTMLElement>('[data-accion]')
  if (botonAccion?.dataset.accion === 'empezar' || botonAccion?.dataset.accion === 'reiniciar') {
    iniciarPartida()
    return
  }
  if (botonAccion?.dataset.accion === 'estudiar') {
    vista = 'estudio'
    dibujar()
    return
  }
  if (botonAccion?.dataset.accion === 'continuar' && partida) {
    vista = 'juego'
    dibujar()
    return
  }
  if (botonAccion?.dataset.accion === 'inicio') {
    partida = null
    propuesta = ''
    aviso = ''
    vista = 'inicio'
    dibujar()
    return
  }

  const botonFicha = objetivo.closest<HTMLButtonElement>('[data-ficha]')
  if (botonFicha?.dataset.ficha) {
    const palabra = botonFicha.dataset.ficha
    if (fichasReveladas.has(palabra)) {
      fichasReveladas.delete(palabra)
    } else {
      fichasReveladas.add(palabra)
    }
    dibujarEstudio()
    return
  }

  const botonTeclado = objetivo.closest<HTMLButtonElement>('[data-tecla]')
  if (!botonTeclado || !partida || partida.estado !== 'enCurso') return

  const tecla = botonTeclado.dataset.tecla
  if (tecla === 'enviar') {
    enviarPropuesta()
  } else if (tecla === 'borrar') {
    actualizarPropuesta(propuesta.slice(0, -1))
  } else if (
    tecla &&
    Array.from(propuesta).length <
      Array.from(partida.palabraObjetivo).length
  ) {
    actualizarPropuesta(propuesta + tecla)
  }
})

app.addEventListener('input', (evento: Event) => {
  const objetivo = evento.target
  if (objetivo instanceof HTMLInputElement && objetivo.id === 'entrada-palabra') {
    propuesta = Array.from(normalizarPalabra(objetivo.value))
      .slice(0, partida ? Array.from(partida.palabraObjetivo).length : 0)
      .join('')
    aviso = ''
    dibujarPartida()
    const entrada = app.querySelector<HTMLInputElement>('#entrada-palabra')
    entrada?.focus()
    entrada?.setSelectionRange(propuesta.length, propuesta.length)
  } else if (
    objetivo instanceof HTMLInputElement &&
    objetivo.id === 'buscar-vocabulario'
  ) {
    busqueda = objetivo.value
    dibujarEstudio()
    const campo = app.querySelector<HTMLInputElement>('#buscar-vocabulario')
    campo?.focus()
    campo?.setSelectionRange(busqueda.length, busqueda.length)
  }
})

app.addEventListener('change', (evento: Event) => {
  const objetivo = evento.target
  if (
    objetivo instanceof HTMLSelectElement &&
    objetivo.id === 'categoria-vocabulario'
  ) {
    categoriaEstudio = objetivo.value
    dibujarEstudio()
  }
})

app.addEventListener('submit', (evento: SubmitEvent) => {
  if (!(evento.target instanceof HTMLFormElement)) return
  evento.preventDefault()
  enviarPropuesta()
})

document.addEventListener('keydown', (evento: KeyboardEvent) => {
  if (!partida || partida.estado !== 'enCurso' || vista !== 'juego') return
  if (evento.altKey || evento.ctrlKey || evento.metaKey) return

  if (evento.key === 'Enter') {
    if (
      evento.target instanceof HTMLElement &&
      evento.target.closest('button, a')
    ) {
      return
    }
    evento.preventDefault()
    enviarPropuesta()
  } else if (evento.key === 'Backspace') {
    evento.preventDefault()
    actualizarPropuesta(propuesta.slice(0, -1))
  } else if (
    Array.from(propuesta).length <
      Array.from(partida.palabraObjetivo).length &&
    /^[a-zñ]$/i.test(evento.key)
  ) {
    evento.preventDefault()
    actualizarPropuesta(propuesta + evento.key)
  }
})

dibujar()
