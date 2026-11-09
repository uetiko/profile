# Clarification Ledger

## CLAR-001

QUESTION: ¿Qué comportamiento debe ser el contrato objetivo de las ventanas?
WHY_IT_MATTERS: Decide si el resultado visible durante el gesto es la ventana real o un preview separado.
CLASSIFICATION: MATERIAL_DECISION
ANSWER: Movimiento en vivo; la ventana completa sigue al puntero.
SOURCE: HUMAN · selección explícita en esta sesión
AFFECTS: BR-001 · AC-001 · AC-002 · SC-001
STATUS: APPLIED

## CLAR-002

QUESTION: ¿Qué comportamiento debe cumplir el arrastre en escritorio respecto al rendimiento?
WHY_IT_MATTERS: Convierte “fluido” en un criterio verificable.
CLASSIFICATION: MATERIAL_DECISION
ANSWER: 60 Hz estable: p95 del intervalo entre frames <=20 ms, cero long tasks durante el drag y seguimiento visual continuo.
SOURCE: HUMAN · selección explícita en esta sesión
AFFECTS: BR-005 · AC-006 · AT-006
STATUS: APPLIED

## CLAR-003

QUESTION: ¿Qué debe ocurrir cuando el puntero intenta arrastrar una ventana fuera del escritorio?
WHY_IT_MATTERS: Define la geometría visible durante el gesto y evita reintroducir un salto al finalizar.
CLASSIFICATION: MATERIAL_DECISION
ANSWER: Restringir continuamente; la ventana se detiene en los límites durante el movimiento y no cambia de posición al soltar.
SOURCE: HUMAN · selección explícita en esta sesión
AFFECTS: BR-003 · AC-003 · SC-003
STATUS: APPLIED

## CLAR-004

QUESTION: ¿En qué entorno se verifica el umbral de rendimiento?
WHY_IT_MATTERS: Hace reproducible el criterio cuantitativo de 60 Hz.
CLASSIFICATION: MATERIAL_DECISION
ANSWER: Chromium en el workstation actual.
SOURCE: HUMAN · selección explícita en esta sesión
AFFECTS: BR-005 · AC-006 · AT-006
STATUS: APPLIED

## CLAR-005

QUESTION: ¿Los límites continuos del arrastre deben incluir el panel inferior o restringir la ventana al área de trabajo situada encima del panel?
WHY_IT_MATTERS: Define el área geométrica efectiva y evita que la ventana quede oculta por el panel.
CLASSIFICATION: MATERIAL_DECISION
ANSWER: Área sobre el panel; la ventana no cubre ni queda oculta por el panel.
SOURCE: HUMAN · selección explícita en esta sesión
AFFECTS: BR-003 · AC-003 · SC-003 · SC-004
STATUS: APPLIED

## CLAR-006

QUESTION: ¿La ventana debe conservar durante el arrastre la distancia exacta entre el punto donde se pulsa la barra de título y la esquina de la ventana?
WHY_IT_MATTERS: Define si el inicio del movimiento conserva la interacción actual o reposiciona la ventana respecto a otra referencia.
CLASSIFICATION: MATERIAL_DECISION
ANSWER: Conservar offset actual; el puntero no salta dentro de la ventana.
SOURCE: HUMAN · selección explícita en esta sesión
AFFECTS: BR-002 · AC-002 · SC-001 · TASK-001 · AT-001
STATUS: APPLIED
