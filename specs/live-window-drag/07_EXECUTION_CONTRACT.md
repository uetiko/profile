# OBJECTIVE

Cambiar el arrastre de ventanas de desktop desde ghost-preview a movimiento visible en vivo, manteniendo el offset inicial, restringiendo continuamente la ventana al área sobre el panel inferior, consolidando sin salto y cumpliendo el umbral de rendimiento en Chromium del workstation actual.

# BASELINE

- Repositorio: `/home/abarrientos/work/personal/html/angel`.
- HEAD verificado antes de la especificación: `a1db5566c9f41a02c55b0fb3dfb53cf1e74afed5`.
- Rama verificada: `main`.
- Estado antes de crear artefactos de esta spec: limpio.
- Estado actual: los artefactos de `specs/live-window-drag/` son cambios no trackeados creados por esta tarea; deben preservarse.
- Código actual relevante: `js/app.js:208-252`, `index.html:145-181`, `css/style.css:82-91,134-136`, `js/windowing.js:48-62`.

## BRANCH_PREFLIGHT

- **REPOSITORY:** `angel`
- **POLICY_APPLICABILITY:** `UNVERIFIED`; no existe gobernanza local de ramas y sólo se observan `main` y `uetiko/main`.
- **WORK_ITEM_ID:** `MISSING`; no se proporcionó ticket.
- **WORK_TYPE:** `UNDETERMINED`; el objetivo deriva de una decisión UX, pero no se declaró tipo Git.
- **CURRENT_BRANCH:** `drag-live`.
- **WORKING_TREE:** `dirty` por los artefactos de esta especificación y los cambios de implementación de esta tarea; `PREEXISTING_CHANGE`: ninguno conocido en la zona antes de esta tarea.
- **EXPECTED_BASE:** `main`.
- **EXPECTED_WORK_BRANCH:** `drag-live`.
- **PR_TARGET:** `MISSING_DATA`; no se autoriza PR.
- **BRANCH_STATUS:** `MATCH`.
- **GIT_ACTIONS_AUTHORIZED:** crear `drag-live` desde `main` — autorizado y ejecutado; no commit, push, PR, merge ni tag.
- **NEXT_GIT_ACTION:** `NONE`.

# CURRENT_BEHAVIOR

Durante `DRAGGING`, `js/app.js:229-235` actualiza el estilo del ghost. La ventana real no cambia de posición hasta `endDrag` en `js/app.js:237-252`; al liberar puede saltar a la posición final. `README.md:45` documenta ese comportamiento histórico.

# DESIRED_BEHAVIOR

La ventana visible sigue al puntero durante el gesto, conserva el offset inicial, permanece dentro del área de trabajo situada sobre el panel inferior y termina exactamente en la última posición visible. Ventanas maximizadas y viewports estrechos conservan sus guardas actuales.

# SCOPE

- `js/app.js`: ciclo de drag, seguimiento, coalescencia, clamp y finalización.
- `js/windowing.js`: sólo operaciones existentes de geometría si son necesarias para consolidar sin introducir una nueva abstracción.
- `index.html`: bindings/representación del drag.
- `css/style.css`: reglas directamente necesarias para la representación del movimiento.
- Documentación afectada por el contrato histórico, si la implementación deja de describir correctamente el comportamiento.
- Validación funcional y de rendimiento definida por `AT-001`–`AT-007`.

# OUT_OF_SCOPE

- Redimensionado.
- Arrastre móvil/táctil o viewports `<=768px`.
- Semántica de maximizado, foco, minimizado y cierre fuera de sus guardas existentes.
- Wallpaper, fuentes, favicon, analytics, carga inicial y contenido.
- Rediseño global del compositor, blur, sombras, transiciones o arquitectura.
- Optimización para navegadores/GPU distintos del Chromium del workstation actual.
- Commit, push, PR, merge, tag o cualquier operación Git adicional.

# INVARIANTS

- La ventana visible es la representación principal durante el drag; no se conserva un ghost competidor que produzca dos posiciones observables.
- El offset de inicio no cambia durante el gesto.
- Los límites usan el área situada encima del panel inferior, no el viewport completo.
- `POINTER_RELEASE` finaliza una sola vez y no produce un salto.
- Movimientos fuera de un gesto activo no cambian la ventana.
- Las guardas de ventana maximizada y viewport estrecho permanecen vigentes.
- No se destruyen ni sobrescriben cambios ajenos en el working tree.

# AUTHORIZED_DECISIONS

Estas son decisiones humanas cerradas que delimitan el contrato y autorizan la ubicación de trabajo; no autorizan commit, push, PR, merge ni tag:

- `CLAR-001`: movimiento en vivo de la ventana visible.
- `CLAR-002`: p95 de intervalo entre frames `<=20 ms`, cero long tasks y seguimiento continuo.
- `CLAR-003`: restringir continuamente la ventana dentro de los límites.
- `CLAR-004`: aceptar cuantitativamente en Chromium del workstation actual.
- `CLAR-005`: usar el área de trabajo sobre el panel inferior.
- Rama de trabajo `drag-live` creada desde `main` sin work item ID, autorizada explícitamente por el owner.

# ASSUMPTIONS

Ninguna.

# DEPENDENCIES

- DOM y geometría actuales de la ventana.
- Panel inferior de 42 px definido por el layout actual; si esa geometría cambia antes de ejecutar, detenerse y reportar.
- Herramientas Chromium capaces de observar bounding boxes, frame timing y long tasks.

# CONSTRAINTS

- Mantener el cambio limitado al flujo de drag.
- No añadir APIs, persistencia, contratos externos ni dependencias.
- No retirar blur/sombras por hipótesis no perfilada.
- La documentación debe dejar de afirmar ghost-preview como comportamiento vigente si se elimina ese flujo.

# INPUTS

- `specs/live-window-drag/02_PROBLEM_DEFINITION.md`
- `specs/live-window-drag/03_HARD_SPECIFICATION.md`
- `specs/live-window-drag/04_USE_CASE_DEFINITION.md`
- `specs/live-window-drag/05_BEHAVIOR_SPECIFICATION.md`
- `specs/live-window-drag/06_TASK_BREAKDOWN.md`
- `specs/live-window-drag/08_ACCEPTANCE_TEST_SPECIFICATION.md`
- `specs/live-window-drag/CLARIFICATION_LEDGER.md`
- Evidencia diagnóstica: perfil de drag y reposo descrito en la conversación; no tratar el perfil como autorización de cambios.

# IMPLEMENTATION_GUIDELINES

- Mantener una única fuente de verdad para la posición consolidada.
- Separar la recepción de movimientos de la presentación visual para evitar backlog de frames.
- Presentar como máximo la posición pendiente más reciente por frame.
- Aplicar el clamp contra el área útil sobre el panel durante el movimiento y al consolidar.
- Evitar transiciones que interpongan interpolación visual entre puntero y ventana durante el drag.
- Eliminar el ghost del flujo si la ventana real ya es la representación visible; no dejar listeners o estilos muertos.
- No cambiar el comportamiento de resize ni de las guardas fuera del flujo autorizado.

# VALIDATION

Ejecutar `AT-001` a `AT-005` y `AT-007` como escenarios funcionales independientes. Ejecutar `AT-006` con Chromium en el workstation actual, capturando frame timing y long tasks durante una trayectoria de 2 segundos desde `(120,120)` hacia `(720,398)` en una ventana de `720x460` y viewport `1440x900`. Revisar el diff completo, los archivos fuera de scope, `git diff --check` y la preservación de los artefactos de esta spec.

# ACCEPTANCE_CRITERIA

- **AC-001:** `AT-001`, `AT-002` — la ventana visible sigue al puntero; el ghost no es el único seguimiento.
- **AC-002:** `AT-001`, `AT-002` — se conserva el offset de inicio.
- **AC-003:** `AT-003` — límites continuos dentro del área sobre el panel.
- **AC-004:** `AT-004` — no hay salto al liberar.
- **AC-005:** `AT-005` — finalización única e idempotente.
- **AC-006:** `AT-002`, `AT-006` — p95 de frame interval `<=20 ms`, cero long tasks y seguimiento continuo.
- **AC-007:** `AT-007` — guardas de maximizado y viewport estrecho preservadas.

# DEFINITION_OF_DONE

- Implementación completa dentro de `SCOPE`, sin stubs ni código muerto del preview.
- `AT-001`–`AT-007` ejecutados y resultados registrados.
- `AC-001`–`AC-007` satisfechos.
- El perfil Chromium cumple AC-006.
- Diff completo revisado; `git diff --check` sin errores.
- Cambios ajenos preservados y ningún archivo fuera de alcance modificado.
- Documentación vigente (`README.md`) actualizada si contradice el contrato implementado.
- No se ejecutaron operaciones Git de escritura sin autorización separada.

# DELIVERABLES

- Código actualizado en los archivos autorizados.
- Evidencia de AT-001–AT-007.
- Resultado de perfil Chromium.
- Diff revisado y reporte de archivos afectados.

# REPORTING_FORMAT

Reportar: archivos modificados; AC/AT ejecutados; frame p95; long tasks; resultado funcional por AT; riesgos restantes; archivos fuera de scope; estado Git; y cualquier bloqueo con `DECISION_REQUIRED` o `STOP_REPORT`.

# STOP_CONDITIONS

Detenerse y reportar si:

- el preflight de rama sigue `UNKNOWN` y ejecutar exigiría cambiar o crear rama sin autorización;
- el working tree contiene cambios ajenos que interfieren materialmente;
- el panel, viewport o contrato de límites ya no coincide con los inputs;
- una decisión de semántica UX, compatibilidad o arquitectura queda abierta;
- cumplir AC-006 requiere modificar blur, sombras, infraestructura o configuración fuera de scope;
- una prueba contradice una decisión cerrada o una fuente autoritativa;
- falta acceso al Chromium del workstation o a la evidencia necesaria;
- la solución requiere cambiar resize, móvil, persistencia o contratos no incluidos.

# SPEC_QUALITY_RESULT

**evaluated_at:** 2026-11-08
**artifacts:** `02`–`05`, `08`.

| Check | Result | Evidence | Material |
|---|---|---|---|
| SQ1 Problem clarity | PASS | `02` separates observed ghost-preview behavior from target outcome. | — |
| SQ2 Scope determinacy | PASS | `02` and `03` define in/out scope, including mobile, resize and load performance exclusions. | — |
| SQ3 Requirement testability | PASS | `03` BR-001–BR-006 and AC-001–AC-007 have observable results and downstream ATs. | — |
| SQ4 Technology leakage | PASS | `03` remains behavior-oriented; Chromium is a closed acceptance constraint from `CLAR-004`. | — |
| SQ5 Vague language | PASS | “continuamente” and “sin salto” are operationalized by frame, bounding-box and release criteria; performance uses numeric thresholds and a 2-second trajectory. | — |
| SQ6 Actor completeness | PASS | `03` identifies the desktop user and the pointer interaction. | — |
| SQ7 Failure semantics | PASS | `03` specifies bounds, maximized/mobile guards, cancellation and duplicate release. | — |
| SQ8 Success measurability | PASS | `AC-001`–`AC-007` and `AT-001`–`AT-007` define objective evidence. | — |
| SQ9 Dependencies/constraints | PASS | `02`/`03` state panel geometry, Chromium environment and existing guards. | — |
| SQ10 Placeholder closure | PASS | No material `TODO`, `TBD`, `TKTK`, open question or unresolved assumption remains in requirements. | — |

**material_fails:** NONE
**result:** PASS

# SPEC_COHERENCE_RESULT

**evaluated_at:** 2026-11-08
**artifacts:** `02`–`08` and `CLARIFICATION_LEDGER.md`.

| Pass | Result | Evidence |
|---|---|---|
| DUPLICATION | PASS | One UC and one authoritative BR/AC registry; downstream references preserve IDs. |
| TERMINOLOGY_DRIFT | PASS | `DRAGGING`, `IDLE`, `COMMITTED`, ventana visible, área sobre el panel and offset are used consistently. |
| SEMANTIC_CONTRADICTION | PASS | No artifact requires ghost-preview after `CLAR-001`; all limits use the area above the panel after `CLAR-005`. |
| UNDER_SPECIFICATION | PASS | Entities, states, events, limits and release behavior are defined in `03`. |
| SCOPE_INCONSISTENCY | PASS | Mobile, resize, load assets and unrelated compositor work are excluded consistently. |
| BUSINESS_RULE_TO_BEHAVIOR | PASS | BR-001–BR-006 map to SC-001–SC-007. |
| BEHAVIOR_TO_AC | PASS | Each material scenario has one or more AC references. |
| AC_TO_TASK | PASS | AC-001–AC-007 are assigned to TASK-001–TASK-003 without added behavior. |
| AC_TO_ACCEPTANCE_TEST | PASS | AC-001–AC-007 map to AT-001–AT-007 with matching thresholds and coordinates. |
| EXECUTION_CONTRACT_PRESERVATION | PASS | This contract preserves scope, exclusions, decisions and acceptance criteria. |
| GOVERNANCE_CONSISTENCY | PASS | No se asumen commit, push, PR, arquitectura ni producto; la rama `drag-live` fue autorizada explícitamente. |
| CLARIFICATION_APPLICATION | PASS | `CLAR-001`–`CLAR-006` are `APPLIED`; affected artifacts contain the selected behavior. |

**findings:** NONE
**result:** PASS

# READINESS_RESULT

- **evaluated_by:** Main Session.
- **evaluated_at:** 2026-11-08.
- **spec_complete:** YES — etapas 02, 03, 04, 05, 06, 08 y 07 presentes.
- **spec_quality:** PASS — requisitos materiales observables, trazables y verificables; no quedan placeholders materiales.
- **spec_coherence:** PASS — BR/UC/SC/AC/TASK/AT conservan significado; `CLAR-001`–`CLAR-006` están aplicadas.
- **clarifications:** NONE — `CLAR-001`–`CLAR-006` están `APPLIED` y no hay abiertas.
- **open_material_items:** NONE.
- **non_material_items:** `PR_TARGET` `MISSING_DATA` — no se autoriza publicar PR en esta tarea.
- **reference_integrity:** PASS — referencias declaradas se resolvieron en los artefactos fuente y cada AC material tiene SC, AT y tarea.
- **deferred_promises:** PASS — no hay promesas materiales diferidas.
- **claim_consistency:** PASS — las matrices fueron contrastadas con los IDs y relaciones presentes.
- **observations:** La especificación funcional está completa y la ejecución queda autorizada en `drag-live`; `EXECUTION_READY` no autoriza operaciones Git adicionales.
- **execution_ready:** YES.
- **blocking_reasons:** NONE.
- **decisions_required:** NONE.

SPECIFICATION_STATE
- **need:** movimiento en vivo y fluido de ventanas de escritorio.
- **entry_point:** Etapa 02, problema ya diagnosticado y decisiones UX cerradas.
- **state:** `EXECUTION_READY`.
- **artifacts:** `specs/live-window-drag/02_PROBLEM_DEFINITION.md`, `03_HARD_SPECIFICATION.md`, `04_USE_CASE_DEFINITION.md`, `05_BEHAVIOR_SPECIFICATION.md`, `06_TASK_BREAKDOWN.md`, `07_EXECUTION_CONTRACT.md`, `08_ACCEPTANCE_TEST_SPECIFICATION.md`, `CLARIFICATION_LEDGER.md`.
- **clarifications:** NONE abiertas; `CLAR-001`–`CLAR-006` aplicadas.
- **assumptions:** NONE.
- **discovery:** perfil runtime y baseline Git ya disponibles.
- **next:** implementar en `drag-live`; no ejecutar commit, push, PR, merge ni tag.

SPECIFICATION_STATUS: SPEC_COMPLETE
STATUS: EXECUTION_READY
