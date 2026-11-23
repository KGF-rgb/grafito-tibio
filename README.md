# Grafito tibio

Tema para Claude Code en la app de escritorio: grises cálidos casi neutros con acento salvia, en
modo oscuro y claro. Pensado para sesiones largas sin cansar la vista: sin negro puro ni blanco
puro, y acentos de saturación moderada. En oscuro se parece al tema normal de Claude; lo que más
cambia es el acento, que pasa a verde salvia.

## Instalar

En la línea de comandos de una sesión de Claude Code en la terminal:

```
/plugin install grafito-tibio --marketplace KGF-rgb/grafito-tibio
```

Responde `y` para agregar el marketplace y escoge el alcance de usuario. Desde un shell:

```
claude plugin install grafito-tibio --marketplace KGF-rgb/grafito-tibio
```

En la app de escritorio, donde `/plugin` no corre: + junto al cuadro de mensaje, Plugins, Add
marketplace con `KGF-rgb/grafito-tibio`, y luego Add plugin.

El tema se dibuja en la app de escritorio y en la móvil; la terminal no dibuja temas. Solo hay un
tema activo a la vez: si tienes otro instalado, gana el último que se aplica.

## Cambios

- **0.2.0**: solo colores. Se quitaron las ondas animadas del fondo, que en la pestaña Code quedaban
  tapadas por el panel del chat y gastaban GPU sin verse, y el aviso de estado que quedaba pegado
  abajo al abrir una sesión.
- **0.1.0**: primera versión, con ondas lentas en el borde derecho.

## Archivos

| Archivo | Qué es |
|---|---|
| `.claude-plugin/plugin.json` | Manifiesto del plugin |
| `.claude-plugin/marketplace.json` | Marketplace con una sola entrada, este repositorio |
| `hooks/hooks.json` | Nombra el módulo que se carga |
| `hooks/register.tsx` | Paleta y el gancho de inicio de sesión que la aplica |
| `hooks/make-colors.js` y `.d.ts` | Generador de paleta del skill `plugin-authoring` de Claude Code 2.1.325, sin cambios |
| `hooks/tema.test.tsx` | Pruebas: Desktop pinta la paleta, el texto pasa el contraste, los nombres de color existen y no fija fondo |
| `tsconfig.json` | Lo escribe el motor de Claude Code; `.claude-plugin/types` se regenera sola |

## Probar cambios

```
claude plugin test <carpeta>
claude plugin validate <carpeta>
```

## Desinstalar

```
claude plugin uninstall grafito-tibio
```

## Licencia

MIT, ver `LICENSE`. No cubre `hooks/make-colors.js` ni `hooks/make-colors.d.ts`, que vienen de
Claude Code.
