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

const { theme, problems } = makeColors(DEFINICION_GRAFITO)

// Solo colores, sin fondo: la versión 0.1.0 traía ondas animadas, pero en la pestaña
// Code de la app de escritorio el panel del chat es opaco y las tapaba por completo,
// así que gastaban GPU sin verse.
export const TEMA: ThemeSetArgs = { colors: theme }

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    const sinPintar = problems.find(linea => linea.startsWith("Desktop won't paint"))

    if (sinPintar !== undefined) {
      $.ui.toast(sinPintar)
    }
    // Sin aviso de estado cuando no se dibuja: la app de escritorio arranca la sesión sin
    // ventana, el motor guarda el tema y lo pinta al conectarse, y el aviso quedaba pegado.
    await $.theme.set(TEMA)

    return next(e)
  })
}
