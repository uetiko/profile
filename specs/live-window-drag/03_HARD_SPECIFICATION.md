# Resumen ejecutivo

Esta especificación define el comportamiento objetivo del arrastre de ventanas de escritorio: la ventana visible acompaña continuamente al puntero, permanece dentro de los límites del escritorio y consolida sin salto la posición mostrada al finalizar.

# Objetivo funcional

Permitir que un usuario de escritorio arrastre una ventana visible desde su barra de título y observe una correspondencia continua entre el desplazamiento del puntero y la posición de la ventana.

# Problema que se resuelve

El comportamiento actual desplaza un contorno separado y deja inmóvil la ventana real hasta `mouseup`. La especificación sustituye ese contrato UX por movimiento visible en vivo, decisión registrada en `CLAR-001`.

# Contexto de negocio

El proyecto es un portafolio interactivo presentado como escritorio. La manipulación de ventanas es una interacción primaria de la presentación.

# Alcance funcional

- Iniciar el arrastre de una ventana no maximizada desde su barra de título en escritorio.
- Mantener la ventana visible siguiendo el puntero durante el gesto.
- Restringir continuamente la ventana al área visible del escritorio.
- Finalizar el arrastre conservando la última posición visible.
- Mantener el foco de la ventana iniciado por la interacción.
- Cumplir el criterio de rendimiento acordado en Chromium del workstation actual.

# Fuera de alcance

- Arrastre en viewports estrechos/móviles, donde la política existente deshabilita el drag.
- Redimensionado.
- Persistencia entre sesiones.
- Cambios al wallpaper, fuentes, analytics, carga inicial, blur, sombras o transiciones no necesarios para este comportamiento.
- Optimización para navegadores, GPUs o equipos distintos del entorno de aceptación acordado.

# Actores

- **Usuario de escritorio:** inicia y controla el gesto de arrastre con un puntero.

# Entidades involucradas

- **Ventana:** unidad visible con posición y dimensiones actuales.
- **Puntero:** fuente de coordenadas del gesto.
- **Escritorio visible:** área que contiene las ventanas y define sus límites.
- **Gesto de arrastre:** interacción desde el inicio hasta la liberación del puntero.

# Reglas de negocio

## BR-001 — Movimiento visible en vivo

**SOURCE:** `CLAR-001` · decisión humana aplicada.

Mientras un gesto de arrastre esté activo, la ventana visible debe reflejar el desplazamiento actual del puntero; no se sustituye por un contorno separado como representación principal.

## BR-002 — Desplazamiento relativo al punto de inicio

El desplazamiento de la ventana debe conservar la diferencia entre la posición inicial del puntero y la posición inicial de la ventana durante todo el gesto.

**SOURCE:** `CLAR-006` · decisión humana aplicada; el comportamiento actual observado en `js/app.js:233-234` es evidencia de continuidad, no la fuente de la decisión.

## BR-003 — Límites continuos

**SOURCE:** `CLAR-003` y `CLAR-005` · decisiones humanas aplicadas.

La posición visible de la ventana debe restringirse continuamente para que sus límites permanezcan dentro del área de trabajo situada encima del panel inferior. Al liberar el puntero no debe producirse un reajuste adicional causado por esos límites.

## BR-004 — Consolidación sin salto

Al finalizar el gesto, la posición consolidada debe ser igual a la última posición visible durante el gesto. La ventana no debe saltar a una posición distinta al liberar el puntero.

**SOURCE:** `CLAR-001` · decisión humana aplicada.

## BR-005 — Rendimiento de interacción

**SOURCE:** `CLAR-002` y `CLAR-004` · decisiones humanas aplicadas.

En Chromium en el workstation actual, durante la trayectoria de aceptación de 2 segundos desde una posición interior hacia el límite inferior derecho, el p95 del intervalo entre frames debe ser menor o igual a 20 ms, no deben observarse long tasks y la ventana debe mantener seguimiento visual continuo.

## BR-006 — Finalización segura

La liberación del puntero debe finalizar el gesto activo una sola vez y dejar la ventana en la última posición válida, incluso si el puntero se libera después de alcanzar un límite.

**SOURCE:** necesidad de conservar un estado final válido; deriva de BR-003 y BR-004.

# Capacidades funcionales

- **CF-001 — Iniciar arrastre:** reconocer un gesto válido en la barra de título de una ventana arrastrable.
- **CF-002 — Actualizar posición:** calcular y mostrar la posición de la ventana durante el gesto.
- **CF-003 — Aplicar límites:** impedir que la ventana salga del área de trabajo situada encima del panel mientras se actualiza.
- **CF-004 — Finalizar y consolidar:** terminar el gesto y conservar la última posición visible.
- **CF-005 — Mantener foco:** conservar la ventana como objetivo activo de la interacción.
- **CF-006 — Verificar fluidez:** observar el criterio cuantitativo y la ausencia de tareas largas en el entorno acordado.

# Flujo funcional principal

1. El usuario pulsa la barra de título de una ventana no maximizada en un viewport de escritorio.
2. El sistema inicia un gesto y conserva la relación entre puntero y ventana.
3. El usuario desplaza el puntero.
4. El sistema actualiza la posición visible de la ventana y aplica los límites del área de trabajo situada encima del panel.
5. El usuario libera el puntero.
6. El sistema finaliza una sola vez y conserva la última posición visible.

# Flujos alternativos

- **FA-001 — Límite izquierdo/superior:** si el desplazamiento calculado cruza el límite mínimo, la ventana permanece en ese límite mientras el puntero continúa desplazándose.
- **FA-002 — Límite derecho/inferior:** si el desplazamiento calculado cruza el límite máximo del área situada encima del panel, la ventana permanece en ese límite mientras el puntero continúa desplazándose.
- **FA-003 — Ventana maximizada:** el gesto no inicia y se conserva la política existente de feedback para una ventana maximizada.
- **FA-004 — Viewport estrecho:** el gesto no inicia y se conserva la política existente que deshabilita el drag en viewports estrechos.

# Casos límite

- El puntero empieza en cualquier punto de la barra de título, no necesariamente en su centro.
- El puntero se mueve varios píxeles entre dos actualizaciones observadas.
- El puntero alcanza un límite y vuelve hacia el interior antes de liberar.
- El puntero se libera mientras la ventana está detenida en un límite.
- El gesto recibe múltiples eventos de movimiento antes de que se pinte el siguiente frame.

# Estados

- `IDLE`: no hay gesto activo; la ventana muestra su posición consolidada.
- `DRAGGING`: el gesto está activo; la ventana muestra una posición provisional válida y sigue al puntero.
- `COMMITTED`: el gesto terminó; la última posición visible pasa a ser la posición consolidada.

# Eventos

- `DRAG_START` — el usuario pulsa una barra de título válida.
- `POINTER_MOVE` — el puntero cambia de coordenadas durante un gesto activo.
- `FRAME_PRESENTATION` — el sistema presenta la actualización visual correspondiente al estado más reciente.
- `POINTER_RELEASE` — el usuario libera el puntero.
- `DRAG_CANCELLED` — el gesto deja de ser válido sin una liberación normal, si la plataforma lo produce.

# Transiciones

| Estado actual | Evento | Estado siguiente | Resultado observable |
|---|---|---|---|
| `IDLE` | `DRAG_START` válido | `DRAGGING` | Se inicia el seguimiento de la ventana. |
| `IDLE` | `DRAG_START` no válido | `IDLE` | No cambia la ventana. |
| `DRAGGING` | `POINTER_MOVE` | `DRAGGING` | La ventana muestra la posición relativa y acotada más reciente. |
| `DRAGGING` | `FRAME_PRESENTATION` | `DRAGGING` | La posición visible corresponde al último movimiento procesado. |
| `DRAGGING` | `POINTER_RELEASE` | `COMMITTED` | La última posición visible queda consolidada sin salto. |
| `DRAGGING` | `DRAG_CANCELLED` | `COMMITTED` | Se conserva la última posición válida observada. |
| `COMMITTED` | — | `IDLE` | La ventana queda lista para otra interacción. |

Transiciones prohibidas: un `POINTER_MOVE` fuera de `DRAGGING` no cambia la ventana; una segunda finalización del mismo gesto no cambia la posición ni emite otro cierre lógico.

# Restricciones funcionales

- El movimiento objetivo aplica sólo a ventanas no maximizadas en escritorio.
- La posición final debe pertenecer al mismo espacio de coordenadas que la posición inicial.
- No se modifica la semántica de foco, maximizado, redimensionado ni móvil fuera de lo necesario para este flujo.

# Restricciones no funcionales conocidas

- Entorno obligatorio de aceptación: Chromium en el workstation actual (`CLAR-004`).
- Objetivo de interacción: p95 de intervalo entre frames <=20 ms y cero long tasks durante el drag (`CLAR-002`).

# Excepciones funcionales

- Ventana maximizada: no inicia drag.
- Viewport estrecho: no inicia drag.
- Evento de movimiento fuera de un gesto activo: se ignora.

# Criterios de aceptación

## AC-001 — Seguimiento visible

**DERIVED_FROM:** `BR-001` · `CF-001` · `CF-002`.

Dado un arrastre válido en escritorio, mientras el puntero se desplaza la ventana visible cambia de posición continuamente; no aparece un contorno como único elemento que sigue al puntero.

## AC-002 — Relación de desplazamiento

**DERIVED_FROM:** `BR-002` · `CF-002`.

Dado un inicio en una posición arbitraria de la barra de título, la ventana conserva durante el drag la misma diferencia entre el punto inicial del puntero y la posición de la ventana.

## AC-003 — Límites durante el gesto

**DERIVED_FROM:** `BR-003` · `CF-003`.

Cuando el desplazamiento calculado cruza cualquier borde del área de trabajo situada encima del panel, la ventana permanece dentro de ese borde durante el gesto y no espera a la liberación para corregirse.

## AC-004 — Sin salto al liberar

**DERIVED_FROM:** `BR-004` · `CF-004`.

La posición de la ventana inmediatamente antes y después de liberar el puntero es la misma, salvo la confirmación interna de la posición; no hay salto visual.

## AC-005 — Finalización única

**DERIVED_FROM:** `BR-006` · `CF-004`.

Un gesto terminado por una liberación deja una única posición final válida y una liberación posterior sin gesto activo no produce un segundo cambio.

## AC-006 — Rendimiento de aceptación

**DERIVED_FROM:** `BR-005` · `CF-006`.

En Chromium del workstation actual, una traza de un arrastre representativo muestra p95 del intervalo entre frames <=20 ms, cero long tasks durante el gesto y seguimiento visual continuo.

## AC-007 — Guardas existentes preservadas

**DERIVED_FROM:** restricciones funcionales · `FA-003` · `FA-004`.

Una ventana maximizada o un viewport estrecho no inicia el nuevo flujo de arrastre y conserva el comportamiento existente de feedback/bloqueo.

# Riesgos funcionales

- Si el seguimiento visual se desacopla de la posición consolidada, puede reaparecer el salto final.
- Si los límites se aplican sólo al finalizar, se viola BR-003 y AC-003.
- Si se procesan más actualizaciones que frames presentables, puede degradarse AC-006.

# Ambigüedades remanentes

Ninguna.

# Supuestos documentados

Ninguno.

# Preguntas abiertas

Ninguna.
