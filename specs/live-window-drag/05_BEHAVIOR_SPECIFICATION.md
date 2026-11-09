# Resumen ejecutivo

Los escenarios siguientes describen ejemplos observables e independientes del movimiento de una ventana visible en escritorio.

# Matriz de cobertura

| Hard Specification | Caso de uso | Interacción | Escenarios |
|---|---|---|---|
| BR-001, BR-002, CF-001, CF-002 | UC-001 | Inicio y seguimiento | SC-001, SC-002 |
| BR-003, CF-003 | UC-001 | Cruce de límites | SC-003, SC-004 |
| BR-004, BR-006, CF-004 | UC-001 | Liberación | SC-005 |
| BR-005, CF-006 | UC-001 | Perfil de aceptación | SC-006 |
| FA-003, FA-004, AC-007 | UC-001 | Guardas | SC-007 |

# Feature: Movimiento visible de ventana

## SC-001 — Arrastre desde el punto inicial

- **Derivado de:** UC-001 · objetivo de reposicionar · interacción principal · CF-001, CF-002, CF-005 · BR-001, BR-002 · `IDLE → DRAGGING` · AC-001, AC-002.
- **Objetivo:** demostrar que la ventana visible sigue el desplazamiento relativo.
- **Given:** una ventana no maximizada está en `(120,120)` y el puntero pulsa la barra en `(220,139)`.
- **When:** el puntero se desplaza a `(320,239)` sin cruzar límites.
- **Then:** la ventana visible se presenta en `(220,220)` durante el gesto.
- **And:** la relación inicial de `(100,19)` entre puntero y ventana se conserva.
- **Estados:** `IDLE`, `DRAGGING`.
- **Casos límite:** el punto inicial no está centrado.
- **Reglas cubiertas:** BR-001, BR-002.
- **Restricciones:** escritorio.
- **AC asociados:** AC-001, AC-002.
- **Escenarios relacionados:** SC-005.

## SC-002 — Movimientos sucesivos antes del siguiente frame

- **Derivado de:** UC-001 · actualización continua · CF-002 · BR-001, BR-002 · AC-001, AC-002.
- **Objetivo:** demostrar que el estado visual presentado usa el movimiento más reciente sin acumular una posición incorrecta.
- **Given:** una ventana está en `DRAGGING` y su última posición visible es `(220,220)`.
- **When:** llegan varios movimientos antes de la siguiente presentación y el último movimiento representa `(260,240)`.
- **Then:** la siguiente presentación muestra la ventana en la posición relativa correspondiente a `(260,240)`.
- **And:** la ventana no muestra un contorno como único seguimiento visible.
- **Estados:** `DRAGGING`.
- **Casos límite:** múltiples movimientos por frame.
- **Reglas cubiertas:** BR-001, BR-002.
- **Restricciones:** la actualización presentada debe respetar AC-006.
- **AC asociados:** AC-001, AC-002, AC-006.
- **Escenarios relacionados:** SC-001, SC-006.

## SC-003 — Límite izquierdo y superior

- **Derivado de:** UC-001 · flujo alternativo FA-001 · CF-003 · BR-003 · AC-003.
- **Objetivo:** demostrar el clamp continuo en los límites mínimos.
- **Given:** una ventana de `720x460` está en `(120,120)` y el área de trabajo comienza en `(0,0)`.
- **When:** el usuario arrastra el puntero suficientemente hacia arriba y a la izquierda.
- **Then:** la ventana visible permanece en la posición mínima válida `(0,0)`.
- **And:** permanece allí mientras el puntero siga fuera del límite.
- **Estados:** `DRAGGING`.
- **Casos límite:** puntero fuera simultáneamente por dos bordes.
- **Reglas cubiertas:** BR-003.
- **AC asociados:** AC-003.
- **Escenarios relacionados:** SC-004, SC-005.

## SC-004 — Límite derecho e inferior

- **Derivado de:** UC-001 · flujo alternativo FA-002 · CF-003 · BR-003 · AC-003.
- **Objetivo:** demostrar el clamp continuo en los límites máximos.
- **Given:** el viewport mide `1440x900`, el panel ocupa `42px` y la ventana mide `720x460`.
- **When:** el usuario arrastra suficientemente hacia abajo y a la derecha.
- **Then:** la ventana visible permanece en la posición máxima válida `(720,398)`, calculada usando el área de trabajo de `858px` sobre el panel.
- **And:** no se desplaza fuera del área de trabajo ni queda oculta por el panel durante el gesto.
- **Estados:** `DRAGGING`.
- **Casos límite:** el puntero continúa desplazándose después de alcanzar ambos límites.
- **Reglas cubiertas:** BR-003.
- **AC asociados:** AC-003.
- **Escenarios relacionados:** SC-003, SC-005.

## SC-005 — Liberación sin salto y finalización única

- **Derivado de:** UC-001 · finalización · CF-004 · BR-004, BR-006 · `DRAGGING → COMMITTED` · AC-004, AC-005.
- **Objetivo:** demostrar que liberar consolida exactamente la última posición visible.
- **Given:** la ventana está en `(720,398)` durante `DRAGGING`.
- **When:** el usuario libera el puntero y se produce después una liberación adicional sin gesto activo.
**Then:** la ventana permanece en `(720,398)` inmediatamente antes y después de la primera liberación.
- **And:** la segunda liberación no cambia la posición ni inicia otra finalización.
- **Estados:** `DRAGGING`, `COMMITTED`, `IDLE`.
- **Casos límite:** liberación detenida en un límite.
- **Reglas cubiertas:** BR-004, BR-006.
- **AC asociados:** AC-004, AC-005.
- **Escenarios relacionados:** SC-003, SC-004.

## SC-006 — Perfil de rendimiento de drag

- **Derivado de:** UC-001 · verificación de fluidez · CF-006 · BR-005 · AC-006.
- **Objetivo:** demostrar el umbral no funcional en el entorno acordado.
- **Given:** Chromium en el workstation actual y una ventana de escritorio visible.
- **When:** se registra durante 2 segundos un arrastre desde una posición interior hacia el límite inferior derecho y se libera.
- **Then:** el p95 del intervalo entre frames es <=20 ms.
- **And:** no existen long tasks durante el gesto.
- **And:** la ventana visible sigue al puntero sin salto final.
- **Estados:** `DRAGGING`.
- **AC asociados:** AC-006.
- **Escenarios relacionados:** SC-002.

## SC-007 — Guardas de maximizado y viewport estrecho

- **Derivado de:** UC-001 · FA-003, FA-004 · excepciones · AC-007.
- **Objetivo:** demostrar que el nuevo flujo no cambia las guardas existentes.
- **Given:** una ventana maximizada o un viewport estrecho.
- **When:** el usuario pulsa la barra de título.
- **Then:** el gesto no inicia, la ventana no se mueve y se conserva el feedback/política existente.
- **Estados:** `IDLE`.
- **Reglas cubiertas:** restricciones funcionales.
- **AC asociados:** AC-007.
- **Escenarios relacionados:** SC-001.
