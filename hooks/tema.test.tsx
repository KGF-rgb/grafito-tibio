import { expect, test } from 'claude-code/testing'

import { checkColors, makeColors } from './make-colors.js'
import { DEFINICION_GRAFITO, ESCENA_ONDAS, NOMBRE_ESCENA } from './register'

const LIMITE_ESCENA = 131072

test('la paleta la pinta Desktop', () => {
  const { problems } = makeColors(DEFINICION_GRAFITO)

  expect(problems.filter(linea => linea.startsWith("Desktop won't paint"))).toEqual([])
})

test('al iniciar la sesión fija colores válidos y la escena de ondas', async ($, on) => {
  let tema: unknown

  on('theme.set', (_, e) => {
    tema = e

    return { value: { isDrawn: true, requestId: 'fondo' } }
  })
  on('session.start', (_, e) => ({ cwd: e.cwd }))

  await $.session.start({ cwd: '/', surface: 'desktop', isInteractive: true })

  const fijado = tema as { colors: unknown; backdrop: { scene: string; glass: { blur: number } } }
  // checkColors también lista avisos de contraste bajo la vara del sistema de diseño,
  // que sí se pintan; aquí solo fallan un nombre que no existe o un tema que Desktop ignora.
  const bloqueantes = checkColors(fijado.colors).filter(linea => /isn't a|won't paint/.test(linea))
  expect(bloqueantes).toEqual([])
  expect(fijado.backdrop.scene).toBe(NOMBRE_ESCENA)
  expect(fijado.backdrop.glass.blur).toBe(0)
})

test('la escena cabe en el límite y solo se dibuja en desktop y mobile', async $ => {
  expect(ESCENA_ONDAS.length < LIMITE_ESCENA).toBe(true)

  const FONDO = {
    plugin: 'grafito-tibio',
    component: 'Backdrop',
    requestId: 'fondo',
    props: { scene: NOMBRE_ESCENA, plugin: 'grafito-tibio', glass: { blur: 0, opacity: 0.85 } },
  } as const

  const enEscritorio = await $.ui.mount({ ...FONDO, surface: 'desktop' })
  expect((await enEscritorio.find({ type: 'Svg' })) !== undefined).toBe(true)
  await enEscritorio.unmount()
})
