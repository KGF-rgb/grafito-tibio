import { expect, test } from 'claude-code/testing'

import { checkColors, makeColors } from './make-colors.js'
import { DEFINICION_GRAFITO } from './register'

test('la paleta la pinta Desktop', () => {
  const { problems } = makeColors(DEFINICION_GRAFITO)

  expect(problems.filter(linea => linea.startsWith("Desktop won't paint"))).toEqual([])
})

test('el texto pasa la vara de contraste del sistema de diseño sobre cada superficie', () => {
  const avisos = makeColors(DEFINICION_GRAFITO).problems.filter(linea => /text-(primary|secondary|muted) on surface/.test(linea))

  expect(avisos).toEqual([])
})

test('al iniciar la sesión fija colores válidos y ningún fondo', async ($, on) => {
  let tema: unknown

  on('theme.set', (_, e) => {
    tema = e

    return { value: { isDrawn: true, requestId: 'tema' } }
  })
  on('session.start', (_, e) => ({ cwd: e.cwd }))

  await $.session.start({ cwd: '/', surface: 'desktop', isInteractive: true })

  const fijado = tema as { colors: unknown; backdrop?: unknown }
  // checkColors también lista avisos de contraste bajo la vara del sistema de diseño,
  // que sí se pintan; aquí solo fallan un nombre que no existe o un tema que Desktop ignora.
  const bloqueantes = checkColors(fijado.colors).filter(linea => /isn't a|won't paint/.test(linea))
  expect(bloqueantes).toEqual([])
  expect(fijado.backdrop).toBe(undefined)
})
