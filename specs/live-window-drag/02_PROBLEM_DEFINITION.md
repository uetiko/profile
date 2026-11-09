# Resumen ejecutivo

El escritorio web presenta las ventanas mediante un modelo de arrastre con contorno previo: durante el gesto se desplaza un elemento `.ghost` y la ventana real cambia de posición al soltar. Aunque los perfiles realizados no muestran saturación sostenida del hilo principal, esta discontinuidad hace que la interacción se perciba pesada y no satisface la decisión de producto de que la ventana visible acompañe al puntero.

# Definición del problema

## Qué ocurre

Durante un arrastre de escritorio, la ventana visible permanece inmóvil; un contorno separado sigue el puntero y la ventana salta a la posición final en `mouseup`.

## Por qué es un problema

El resultado visible no corresponde al gesto continuo del usuario. La falta de seguimiento directo se percibe como falta de fluidez aun cuando el presupuesto de frame no esté saturado.

## Evidencia

- `js/app.js:208-252`: `onDrag` actualiza `drag.ghostStyle`; `WindowManager.move` se invoca en `endDrag`.
- `index.html:181`: el template materializa el ghost.
- `README.md:45`: el comportamiento actual está documentado como intencional.
- Diagnóstico runtime: la ventana permaneció en `(120,120)` mientras el ghost llegó a `(360,240)`, y saltó a `(600,360)` al soltar.
- El perfil medido mantuvo rAF alrededor de 16.5 ms y no registró long tasks; por tanto, la evidencia no atribuye el problema principal a bloqueo sostenido del main thread.

# Contexto de negocio

La aplicación es un CV/portafolio interactivo presentado como escritorio. El movimiento de ventanas es parte central de la metáfora visual y de la calidad percibida de la interacción.

# Objetivo de negocio

Hacer que el arrastre de ventanas en escritorio se perciba directo y continuo: la ventana visible debe acompañar al puntero y terminar exactamente donde se mostró al finalizar el gesto.

# Valor esperado

- Interacción coherente con un gestor de ventanas de escritorio.
- Eliminación del salto final propio del preview actual.
- Rendimiento observable y repetible en el entorno de aceptación acordado.

# Stakeholders involucrados

- Owner del proyecto: decide la semántica UX y los criterios de aceptación.
- Visitante del portafolio: realiza y percibe el arrastre.

# Actores identificados

- Usuario de escritorio con puntero.

# Procesos afectados

- Inicio de arrastre desde la barra de título.
- Seguimiento visual durante movimiento.
- Finalización y consolidación de posición.
- Restricción de la posición a los límites visibles del escritorio.

# Sistemas involucrados

- Shell Vue del escritorio.
- `WindowManager` y su geometría de ventanas.
- DOM/CSS de `.window` y `.ghost`.
- Runtime Chromium con composición acelerada.

# Dependencias conocidas

- La geometría final continúa perteneciendo a `WindowManager`.
- El comportamiento actual de foco se dispara al iniciar la interacción.
- En viewports estrechos (`<=768px`) el arrastre está deshabilitado actualmente; esta necesidad no modifica esa política.

# Restricciones conocidas

- La ventana visible, no un contorno sustituto, debe seguir el puntero (`CLAR-001`).
- El área efectiva de límites termina encima del panel inferior; la ventana no debe quedar oculta por el panel (`CLAR-005`).
- La aceptación de rendimiento usa Chromium en el workstation actual (`CLAR-004`).

# Riesgos identificados

- Actualizaciones sin coalescencia pueden multiplicar trabajo de estilo/render ante dispositivos de alta frecuencia.
- Cambiar la representación visual durante drag puede interactuar con `transform`, transiciones, blur y sombras existentes.
- Una medición en un solo workstation no prueba rendimiento equivalente en hardware distinto.

# Ambigüedades detectadas

Ninguna material abierta. `FUNCTIONAL_SCOPE`, `ACTORS_AND_PERMISSIONS`, `PRIMARY_FLOWS`, `EDGE_AND_FAILURE_CASES`, `NON_FUNCTIONAL_REQUIREMENTS`, `CONSTRAINTS`, `TERMINOLOGY`, `SUCCESS_AND_ACCEPTANCE` y `OPEN_DECISIONS` están `CLEAR`. `DOMAIN_RULES`, `EXTERNAL_INTEGRATIONS` y permisos diferenciados no aplican a esta interacción local.

# Contradicciones detectadas

No hay contradicción entre fuentes: el contrato histórico de ghost-preview está documentado, y `CLAR-001` lo sustituye explícitamente como contrato objetivo para esta tarea.

# Información faltante

- Rendimiento en otros navegadores, GPUs o equipos. No bloquea porque queda fuera del entorno de aceptación acordado.

# Fuera del problema

- Rendimiento de carga inicial, wallpaper, fuentes, favicon y analytics.
- Redimensionado de ventanas.
- Arrastre táctil o móvil.
- Cambios generales al compositor, blur, sombras o transiciones sin evidencia discriminante.
- Persistencia de posiciones entre sesiones.

# Preguntas pendientes

Ninguna.

# Evaluación de madurez

**Nivel 4 — completamente definido.** El fallo observable, su mecanismo, actor, alcance, semántica objetivo, límites y umbral de aceptación están cerrados por evidencia y decisiones humanas registradas. Preparado para Hard Specification.