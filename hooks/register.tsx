import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'

// Grises cálidos casi neutros y acento salvia, pensados para no cansar la vista:
// poco color, texto blanco hueso en vez de blanco puro y superficies a pocos
// puntos de luminosidad entre sí.
export const DEFINICION_GRAFITO: Parameters<typeof makeColors>[0] = {
  label: 'Grafito tibio',
  roles: { accent: '#5f8a5b', danger: '#b0503f', success: '#5c8a3e', warning: '#a8791c', pro: '#7a5f9c' },
  light: {
    gray: {
      anchors: {
        'surface-0': '#e6e3dd',
        'surface-1': '#eeebe6',
        'surface-2': '#f6f4f0',
        'text-primary': '#23211e',
        'text-secondary': '#4d4a45',
        'text-muted': '#67635d',
      },
    },
  },
  dark: {
    gray: {
      anchors: {
        'surface-0': '#191816',
        'surface-1': '#1f1e1b',
        'surface-2': '#252421',
        'surface-3': '#292824',
        'text-primary': '#dbd6cc',
        'text-secondary': '#aba59a',
        'text-muted': '#9a958b',
      },
    },
  },
}

export const NOMBRE_ESCENA = 'ondas'

const COLOR_ONDA = '#8aa886'
const ALTURAS_ONDAS = [140, 195, 250, 305, 360, 415, 470, 525]

// Cada onda nace en x = 1180 y pasa del borde derecho (1600) con margen, para que
// el desplazamiento de 120 unidades nunca deje ver su extremo.
function trazarOnda(altura: number): string {
  return `<path d="M1180 ${altura} q20 -10 40 0${' t40 0'.repeat(14)}"/>`
}

function agruparOndas(clase: string, paridad: 0 | 1): string {
  const trazos = ALTURAS_ONDAS.filter((_, indice) => indice % 2 === paridad).map(trazarOnda)

  return `<g class="${clase}">${trazos.join('')}</g>`
}

// Solo se anima transform en dos grupos, con ciclos de 48 s y 64 s: lo resuelve la
// GPU por composición y no hay desenfoque ni filtros, que son lo que cuesta.
// xMaxYMin ancla el dibujo a la esquina superior derecha, lejos de la columna del
// chat y del cuadro de mensaje.
export const ESCENA_ONDAS = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" preserveAspectRatio="xMaxYMin slice">
<style>
.a{animation:deriva 48s ease-in-out infinite alternate}
.b{animation:deriva 64s ease-in-out infinite alternate-reverse}
@keyframes deriva{to{transform:translateX(-120px)}}
@media (prefers-reduced-motion:reduce){.a,.b{animation:none}}
</style>
<g fill="none" stroke="${COLOR_ONDA}" stroke-width="1.5" stroke-linecap="round" stroke-opacity=".22">
${agruparOndas('a', 0)}${agruparOndas('b', 1)}
</g>
</svg>`

const { theme, problems } = makeColors(DEFINICION_GRAFITO)

// El vidrio va sin desenfoque (blur 0): el desenfoque sobre toda la ventana es lo
// que más carga la GPU. La opacidad deja ver las ondas apenas detrás de los paneles.
const TEMA: ThemeSetArgs = {
  colors: theme,
  backdrop: { scene: NOMBRE_ESCENA, glass: { blur: 0, opacity: 0.85 } },
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    const sinPintar = problems.find(linea => linea.startsWith("Desktop won't paint"))

    if (sinPintar !== undefined) {
      $.ui.toast(sinPintar)
    }
    const resultado = await $.theme.set(TEMA)

    if (!resultado.isDrawn) {
      $.ui.status(resultado.reason)
    }

    return next(e)
  })

  on('ui.render', { component: 'Backdrop' }, ($, e, next) => {
    if (e.surface !== 'desktop' && e.surface !== 'mobile') {
      return next(e)
    }
    if (e.props.scene !== NOMBRE_ESCENA) {
      return next(e)
    }

    const { Svg } = $.ui.resolve(e)

    return <Svg source={ESCENA_ONDAS} alt="Ondas finas que se desplazan despacio en el borde derecho" isInteractive />
  })
}
