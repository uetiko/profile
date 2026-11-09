# Resumen ejecutivo

Se modela la interacción del usuario de escritorio que mueve una ventana visible desde su barra de título, incluyendo límites, finalización y guardas existentes.

# Matriz de cobertura

| Capacidad | Casos de uso |
|---|---|
| CF-001 Iniciar arrastre | UC-001 |
| CF-002 Actualizar posición | UC-001 |
| CF-003 Aplicar límites | UC-001 |
| CF-004 Finalizar y consolidar | UC-001 |
| CF-005 Mantener foco | UC-001 |
| CF-006 Verificar fluidez | UC-001 |

# UC-001 — Mover ventana visible

- **Objetivo:** reposicionar una ventana de escritorio mediante un gesto continuo de puntero.
- **Descripción:** el usuario inicia el gesto en una barra de título válida, desplaza el puntero y libera; el sistema muestra y consolida la posición acotada de la ventana.
- **Interacción:** el usuario pulsa, mueve y libera; el sistema inicia, actualiza, limita y finaliza el gesto.
- **Capacidades funcionales utilizadas:** CF-001, CF-002, CF-003, CF-004, CF-005, CF-006.
- **Actor principal:** Usuario de escritorio.
- **Actores secundarios:** ninguno.
- **Evento disparador:** DRAG_START válido en la barra de título.
- **Precondiciones:** la ventana existe, está visible, no está maximizada y el viewport no es estrecho.
- **Flujo principal:**
  1. El usuario pulsa la barra de título.
  2. El sistema inicia `DRAGGING` y conserva la relación entre puntero y ventana.
  3. El usuario mueve el puntero.
  4. El sistema presenta la ventana en la posición relativa y acotada más reciente.
  5. El usuario libera.
  6. El sistema consolida esa posición y vuelve a estado inactivo.
- **Flujos alternativos:**
  - Si el movimiento cruza un borde, el sistema mantiene la ventana en el límite correspondiente durante el gesto.
  - Si la ventana está maximizada, no se inicia el gesto y se conserva el feedback existente.
  - Si el viewport es estrecho, no se inicia el gesto y se conserva la política existente.
- **Excepciones:** una liberación sin gesto activo no cambia la ventana; una cancelación conserva la última posición válida.
- **Postcondiciones:** la ventana queda en la última posición visible y válida; el gesto no sigue activo.
- **Estados involucrados:** `IDLE`, `DRAGGING`, `COMMITTED`.
- **Reglas de negocio aplicables:** BR-001, BR-002, BR-003, BR-004, BR-005, BR-006.
- **Restricciones aplicables:** escritorio únicamente; Chromium del workstation para el umbral cuantitativo.
- **Criterios de aceptación:** AC-001, AC-002, AC-003, AC-004, AC-005, AC-006, AC-007.
- **Casos límite relevantes:** inicio en cualquier punto de la barra, cruce de bordes, retorno desde un borde, movimientos múltiples antes de presentación y liberación en un borde.
- **Dependencias funcionales:** geometría de ventana, límites del escritorio, presentación visual y ciclo de foco existentes.
- **Derivado de:** `03_HARD_SPECIFICATION.md` — alcance, BR-001–BR-006, CF-001–CF-006, flujo principal, flujos alternativos, casos límite y AC-001–AC-007.
- **Utilizado posteriormente por:** `SC-001`–`SC-007`, `TASK-001`–`TASK-003`, `AT-001`–`AT-007`.
