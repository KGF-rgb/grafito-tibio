# Grafito tibio

Tema para Claude Code en la app de escritorio: grises cálidos casi neutros con acento salvia, en
modo oscuro y claro, y un fondo de ondas finas que se desplazan despacio en el borde derecho, lejos
de la columna del chat. Pensado para sesiones largas sin cansar la vista: sin negro puro ni blanco
puro, y acentos de saturación moderada.

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

El tema se dibuja en la app de escritorio y en la móvil; la terminal no dibuja temas.

## Consumo

El fondo anima solo la posición de dos grupos de líneas, en ciclos de 48 s y 64 s, y el vidrio de
los paneles va sin desenfoque, que es lo que más carga la GPU. Respeta la preferencia del sistema de
reducir el movimiento. Para quitar el fondo y dejar solo los colores, se borra `backdrop` de la
constante `TEMA` en `hooks/register.tsx`.

## Archivos

| Archivo | Qué es |
|---|---|
| `.claude-plugin/plugin.json` | Manifiesto del plugin |
| `.claude-plugin/marketplace.json` | Marketplace con una sola entrada, este repositorio |
| `hooks/hooks.json` | Nombra el módulo que se carga |
| `hooks/register.tsx` | Paleta, escena del fondo y los dos ganchos: inicio de sesión y fondo |
| `hooks/make-colors.js` y `.d.ts` | Generador de paleta del skill `plugin-authoring` de Claude Code 2.1.325, sin cambios |
| `hooks/tema.test.tsx` | Pruebas: Desktop pinta la paleta, los nombres de color existen, la escena cabe |
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
