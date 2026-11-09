# Resumen ejecutivo

La ejecución se divide en tres tareas pequeñas: cambiar el ciclo de drag y su consolidación, ajustar la representación visual/geométrica y verificar el comportamiento completo. No se autoriza implementación por este documento.

# Estrategia de implementación

Preservar foco, guardas de maximizado/móvil y geometría persistente. Sustituir el preview como representación principal por la ventana visible, coalescer presentación y consolidar la última posición visible. Mantener el cambio acotado al flujo de drag.

# Grafo de dependencias

```text
TASK-001 ──┐
           ├── TASK-003
TASK-002 ──┘
```

`TASK-001` y `TASK-002` pueden ejecutarse en paralelo si mantienen el contrato de interfaces existente. `TASK-003` depende de ambos.

# Fases

## FASE-001 — Movimiento visible

- **Objetivo:** implementar el comportamiento de movimiento en vivo y sus límites.
- **Dependencias:** ninguna.
- **Entregables:** cambio en el controlador de drag y consolidación coherente.

## FASE-002 — Presentación y límites visuales

- **Objetivo:** asegurar que la ventana visible representa el movimiento sin salto y no queda bajo el panel.
- **Dependencias:** ninguna.
- **Entregables:** reglas visuales mínimas y eliminación del preview como representación principal.

## FASE-003 — Verificación

- **Objetivo:** demostrar criterios funcionales y de rendimiento.
- **Dependencias:** FASE-001, FASE-002.
- **Entregables:** evidencia de escenario completo y perfil Chromium.

# Tareas

## TASK-001 — Actualizar ciclo de drag y consolidación

- **Objetivo:** hacer que el estado visible siga el puntero durante `DRAGGING` y que `POINTER_RELEASE` conserve exactamente la última posición válida.
- **Descripción:** actualizar el controlador de arrastre para conservar la relación inicial, aplicar límites del área sobre el panel, presentar el movimiento de forma coalescida y consolidar una sola vez al finalizar.
- **Alcance:** `js/app.js`, `js/windowing.js` sólo si la consolidación exige una operación existente; movimiento, límites, finalización y guardas del flujo.
- **Fuera de alcance:** redimensionado, móvil, maximizado, analytics, carga inicial y cambios generales del compositor.
- **Entradas:** `03_HARD_SPECIFICATION.md`, `04_USE_CASE_DEFINITION.md`, `05_BEHAVIOR_SPECIFICATION.md`.
- **Salidas:** controlador de drag coherente con BR-001–BR-006.
- **Casos de uso:** UC-001.
- **Escenarios:** SC-001, SC-002, SC-003, SC-004, SC-005, SC-007.
- **Reglas:** BR-001, BR-002, BR-003, BR-004, BR-006.
- **Criterios:** AC-001, AC-002, AC-003, AC-004, AC-005, AC-007.
- **Dependencias:** ninguna.
- **Puede ejecutarse en paralelo:** Sí, con TASK-002 si no se pisan las mismas líneas sin integración.
- **Riesgos:** doble finalización, desalineación entre posición provisional y consolidada, límites calculados contra el viewport completo.
- **Validación esperada:** AT-001–AT-005 y AT-007.
- **Definición de terminado:** todos los estados y límites del flujo están implementados; no existe salto al liberar; guardas existentes preservadas.
- **Preparada para ejecución:** Sí.

## TASK-002 — Ajustar representación visual del movimiento

- **Objetivo:** asegurar que la ventana visible sea la representación principal del drag y que el preview histórico no cause una segunda posición visible.
- **Descripción:** ajustar sólo los estilos o bindings necesarios para que la ventana pueda seguir al puntero sin heredar transiciones incompatibles y sin quedar oculta por el panel.
- **Alcance:** `index.html`, `css/style.css` y reglas visuales directamente asociadas al drag.
- **Fuera de alcance:** retirar blur/sombras globales, rediseñar el compositor, cambiar la apariencia de ventanas fuera del drag.
- **Entradas:** `03_HARD_SPECIFICATION.md`, `05_BEHAVIOR_SPECIFICATION.md`.
- **Salidas:** representación visible compatible con BR-001, BR-003 y BR-004.
- **Casos de uso:** UC-001.
- **Escenarios:** SC-001, SC-002, SC-003, SC-004, SC-005.
- **Reglas:** BR-001, BR-003, BR-004.
- **Criterios:** AC-001, AC-003, AC-004.
- **Dependencias:** ninguna.
- **Puede ejecutarse en paralelo:** Sí, con TASK-001 con integración controlada.
- **Riesgos:** conservar simultáneamente ghost y ventana real, transición CSS que produzca retraso o salto.
- **Validación esperada:** AT-001, AT-003, AT-004.
- **Definición de terminado:** no hay dos representaciones compitiendo durante drag; la ventana visible permanece dentro del área de trabajo.
- **Preparada para ejecución:** Sí.

## TASK-003 — Verificar comportamiento y rendimiento

- **Objetivo:** demostrar todos los criterios de aceptación en Chromium del workstation actual.
- **Descripción:** ejecutar los escenarios funcionales, medir intervalos entre frames y long tasks durante la trayectoria de aceptación de 2 segundos, y revisar la regresión de guardas.
- **Alcance:** validación de `AC-001`–`AC-007`; evidencia de navegador y revisión del diff.
- **Fuera de alcance:** optimización para otros equipos o cambios adicionales derivados de observaciones no causales.
- **Entradas:** implementación de TASK-001/TASK-002, `08_ACCEPTANCE_TEST_SPECIFICATION.md`.
- **Salidas:** reporte de resultados y artefactos de perfilado observacional.
- **Casos de uso:** UC-001.
- **Escenarios:** SC-001–SC-007.
- **Reglas:** BR-001–BR-006.
- **Criterios:** AC-001–AC-007.
- **Dependencias:** TASK-001, TASK-002.
- **Puede ejecutarse en paralelo:** No.
- **Riesgos:** perfil no representativo de otros equipos; evidencia insuficiente de GPU fuera del entorno acordado.
- **Validación esperada:** AT-001–AT-007.
- **Definición de terminado:** todos los AT ejecutados; AC-006 cumple; ningún criterio funcional falla; diff y `git diff --check` revisados.
- **Preparada para ejecución:** Sí.

# Cobertura

Cada escenario SC-001–SC-007 pertenece a al menos una tarea; cada AC-001–AC-007 tiene trabajo asociado; ninguna tarea extiende el alcance funcional de la Hard Specification.
