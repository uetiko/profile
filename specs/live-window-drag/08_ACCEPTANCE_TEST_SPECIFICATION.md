# Resumen ejecutivo

La aceptación combina interacción observable en Chromium y un perfil de rendimiento durante drag. Las pruebas son independientes y no prescriben framework.

# Estrategia general de aceptación

- Ejecutar cada prueba con una ventana no maximizada visible y un viewport de escritorio, salvo AT-007.
- Medir posiciones visibles antes, durante y después del gesto.
- Para AT-006 registrar frame timing y long tasks en Chromium del workstation actual.
- Repetir una prueba no depende del estado producido por otra.

# Matriz de trazabilidad

| Hard Specification | UC | SC | Tests |
|---|---|---|---|
| BR-001, BR-002 | UC-001 | SC-001, SC-002 | AT-001, AT-002 |
| BR-003 | UC-001 | SC-003, SC-004 | AT-003 |
| BR-004, BR-006 | UC-001 | SC-005 | AT-004, AT-005 |
| BR-005 | UC-001 | SC-006 | AT-006 |
| Guardas | UC-001 | SC-007 | AT-007 |

# Pruebas

## AT-001 — Seguimiento visible desde punto arbitrario

- **Objetivo:** verificar AC-001 y AC-002.
- **Clasificación:** Positiva.
- **Escenario:** SC-001.
- **Caso de uso:** UC-001.
- **Reglas:** BR-001, BR-002.
- **AC:** AC-001, AC-002.
- **Precondiciones:** ventana no maximizada en `(120,120)`; viewport de escritorio.
- **Datos:** punto inicial de puntero `(220,139)`; destino `(320,239)`.
- **Acción:** iniciar drag desde el punto indicado y mover al destino sin liberar.
- **Resultado esperado:** la ventana visible se presenta en `(220,220)` y conserva la relación inicial del puntero.
- **Evidencia:** screenshot o lectura de bounding box durante el gesto; ausencia de ghost como único seguimiento.
- **Riesgos:** transición CSS o representación duplicada.
- **Prioridad:** Alta.
- **Automatizable:** Sí.

## AT-002 — Coalescencia sin posición atrasada

- **Objetivo:** verificar AC-001, AC-002 y AC-006 en movimientos sucesivos.
- **Clasificación:** Caso límite.
- **Escenario:** SC-002.
- **Caso de uso:** UC-001.
- **Reglas:** BR-001, BR-002, BR-005.
- **AC:** AC-001, AC-002, AC-006.
- **Precondiciones:** drag activo.
- **Datos:** varios movimientos antes de una presentación; último destino relativo `(260,240)`.
- **Acción:** emitir movimientos sucesivos y observar la siguiente presentación.
- **Resultado esperado:** la ventana muestra la posición del último movimiento procesado y no acumula backlog visible.
- **Evidencia:** traza de frame timing y posición final del frame observado.
- **Riesgos:** más de una actualización pesada por frame.
- **Prioridad:** Alta.
- **Automatizable:** Sí.

## AT-003 — Límites del área sobre el panel

- **Objetivo:** verificar AC-003.
- **Clasificación:** Caso límite.
- **Escenarios:** SC-003, SC-004.
- **Caso de uso:** UC-001.
- **Reglas:** BR-003.
- **AC:** AC-003.
- **Precondiciones:** viewport `1440x900`, panel de `42px`, ventana `720x460`.
- **Datos:** límites esperados: mínimo `(0,0)`, máximo `(720,398)`.
- **Acción:** arrastrar sucesivamente fuera de los bordes superior/izquierdo e inferior/derecho.
- **Resultado esperado:** la ventana permanece en los límites esperados durante el gesto y no queda oculta por el panel.
- **Evidencia:** bounding boxes durante el drag, antes de liberar.
- **Riesgos:** usar `innerHeight` completo en vez del área útil.
- **Prioridad:** Alta.
- **Automatizable:** Sí.

## AT-004 — Sin salto al liberar

- **Objetivo:** verificar AC-004.
- **Clasificación:** Positiva.
- **Escenario:** SC-005.
- **Caso de uso:** UC-001.
- **Reglas:** BR-004.
- **AC:** AC-004.
- **Precondiciones:** ventana en `(720,398)` durante drag.
- **Datos:** posición inmediatamente anterior y posterior a release.
- **Acción:** liberar el puntero.
- **Resultado esperado:** ambas posiciones son `(720,398)`; no hay cambio visual adicional.
- **Evidencia:** bounding box en frames adyacentes al release.
- **Riesgos:** consolidación con coordenadas sin clamp o cálculo duplicado.
- **Prioridad:** Alta.
- **Automatizable:** Sí.

## AT-005 — Finalización idempotente

- **Objetivo:** verificar AC-005.
- **Clasificación:** Regresión.
- **Escenario:** SC-005.
- **Caso de uso:** UC-001.
- **Reglas:** BR-006.
- **AC:** AC-005.
- **Precondiciones:** un gesto activo ya alcanzó una posición válida.
- **Datos:** primer release y release posterior sin gesto.
- **Acción:** liberar dos veces.
- **Resultado esperado:** sólo la primera liberación finaliza; la segunda no cambia geometría ni estado.
- **Evidencia:** posición y estado antes/después de ambas liberaciones.
- **Riesgos:** listeners globales residuales.
- **Prioridad:** Alta.
- **Automatizable:** Sí.

## AT-006 — Umbral de fluidez en Chromium

- **Objetivo:** verificar AC-006.
- **Clasificación:** No funcional.
- **Escenario:** SC-006.
- **Caso de uso:** UC-001.
- **Reglas:** BR-005.
- **AC:** AC-006.
- **Precondiciones:** Chromium en el workstation actual; ventana visible; captura de performance disponible.
- **Datos:** ventana de `720x460` en `(120,120)`; trayectoria de 2 segundos hacia `(720,398)`.
- **Acción:** capturar la traza completa mientras se ejecuta la trayectoria y consultar frame timing y long tasks.
- **Resultado esperado:** p95 del intervalo entre frames <=20 ms; cero long tasks durante drag; ventana sigue al puntero sin salto.
- **Evidencia:** traza Chromium y medición reproducible.
- **Riesgos:** variación de carga del workstation; registrar el entorno junto con el resultado.
- **Prioridad:** Alta.
- **Automatizable:** No.

## AT-007 — Guardas existentes

- **Objetivo:** verificar AC-007.
- **Clasificación:** Regresión.
- **Escenario:** SC-007.
- **Caso de uso:** UC-001.
- **Reglas:** restricciones de maximizado y viewport estrecho.
- **AC:** AC-007.
- **Precondiciones:** ejecutar una vez con ventana maximizada y otra con viewport `<=768px`.
- **Datos:** pulsación en barra de título.
- **Acción:** intentar iniciar drag en ambos contextos.
- **Resultado esperado:** no se inicia el gesto, la ventana no se mueve y se conserva el feedback/política existente.
- **Evidencia:** estado, posición y feedback observado.
- **Riesgos:** cambio accidental de guardas fuera del alcance.
- **Prioridad:** Alta.
- **Automatizable:** Sí.
