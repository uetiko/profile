# Retro Desktop – CV interactivo de Ángel Barrientos

Portafolio/CV presentado como **escritorio** con ventanas, barra de tareas y “Start”. Implementado en HTML/CSS/JS (Vanilla + Vue 3 por CDN), con **telemetría GA4**, **i18n** básico, **gestor de ventanas**, **compositor de efectos** y visor de documentos para el PDF del CV.

> Objetivo: mostrar perfil, experiencia y habilidades en una UI memorable, manteniendo código legible, extensible y estático (deploy sencillo en S3/CloudFront o cualquier hosting estático).

---

## Propósito

Este repositorio implementa un escritorio web de inspiración Win95/GNOME 1 con un administrador de ventanas, un compositor de efectos y una capa de telemetría integrada. El objetivo es ofrecer un entorno demostrativo, autosuficiente y legible, donde la interacción se piense como un sistema y no como un conjunto de trucos visuales. La aplicación se ejecuta como un sitio estático, sin build ni herramienta de empaquetado, y se sostiene sobre Vue 3 vía CDN. El archivo `index.html` contiene todo el núcleo funcional y la plantilla de interfaz, de modo que la arquitectura y el flujo de control pueden inspeccionarse sin obstáculos.

## Alcance y arquitectura

El escritorio se apoya en cuatro piezas con responsabilidades acotadas. El `WindowManager` mantiene la pila de ventanas, el z-index, la geometría y las banderas de estado; expone operaciones atómicas para crear, enfocar, minimizar, restaurar, maximizar y cerrar, y serializa el estilo inline para que el render en Vue sea determinista. El `EventBus` ofrece publicación y suscripción en memoria y define el contrato de eventos del ciclo de vida de una ventana, desde la apertura hasta el cierre, pasando por foco, blur, minimizado y restauración. El `EffectManager` registra efectos con nombre y los ejecuta bajo control del compositor, respetando las preferencias de movimiento reducido y la velocidad de animación. El `Compositor` orquesta las transiciones en respuesta a los eventos del bus y expone flags reactivos como “glass”, “wallpaper” y “fit” que se proyectan en el template. La interfaz de usuario en Vue solo refleja el estado de estas capas, sin lógica acoplada a efectos ni a detalles de apilamiento.

## Flujo de control

La interacción sigue un camino claro. Un gesto de usuario provoca una llamada a funciones de alto nivel como `openApp`, `minimize`, `restore` o `toggleMaximize`. Estas funciones delegan la mutación de estado en el `WindowManager` y publican en el `EventBus` los eventos asociados. El `Compositor` escucha esos eventos, recupera el elemento DOM de la ventana por su identificador estable y coordina los efectos pertinentes mediante el `EffectManager`. La barra de tareas es una proyección reactiva del arreglo de tareas que se sincroniza en la misma ruta de ejecución sin bifurcaciones ocultas. La telemetría aparece solo como un observador que registra vistas de página, aperturas, cierres, clics y descargas, y degrada con mensajes de depuración cuando `gtag` no está disponible.

## Window Manager

`WindowManager` encapsula la pila de ventanas y todas las operaciones atómicas sobre una unidad “ventana”. Cada instancia creada por `create` lleva identidad estable (`id`), metadatos (`title`, `icon`, `component`, `props`) y geometría (`x`, `y`, `w`, `h`) junto con banderas `minimized` y `maximized`. El administrador preserva un contador `z` que garantiza orden por apilamiento. El método `focus` actualiza el z-index de la ventana objetivo y reordena la pila de forma creciente para que el último foco quede al frente. `toggleMax` alterna maximización guardando un snapshot mínimo de la geometría normal en `win.prev` para restauración exacta. `style(win)` serializa el estado operativo de una ventana a CSS inline, incluyendo `display:none` cuando el estado es minimizado. `syncToDOM(id)` permite empujar al DOM cualquier cambio que no fluye por reactividad (p. ej. un toggle de maximizado que altera dimensiones inmediatamente). Cierre y minimizado son idempotentes y no fallan si el `id` no existe.

El administrador no conoce la barra de tareas ni emite eventos; es deliberadamente mudo. Cualquier efecto secundario se dispara desde el “shell” de la app que llama sus métodos y a la vez publica en el `EventBus` los eventos correspondientes.

## Event Bus

`EventBus` es un pub/sub en memoria que modela los siguientes eventos relevantes: `window.opened`, `window.closing`, `window.minimizing`, `window.focus`, `window.blur`, `window.restored`, `window.maximized`, `compositor.toggleGlass`. Cada payload porta al menos `id` y, para eventos que implican animación destructiva, un callback `onDone` que se ejecuta cuando el compositor termina la transición. Esta convención garantiza que la mutación estructural (quitar ventana de `windows` y su tarea asociada) solo ocurra tras el cierre visual, evitando condiciones de carrera entre el DOM y el estado de Vue.

## Compositor y efectos

El compositor se inicializa con referencias al bus, al `StateManager` y al `EffectManager`. Expone flags observables como `glass`, `wallpaper` y `fit` que el template usa para clases o estilos. El compositor no define transiciones; registra en el `EffectManager` un catálogo de efectos con nombre. La coreografía es simple: al abrir una ventana, reproduce `transition:open` seguido de `material:shadow:strong`; al cerrar o minimizar ejecuta `transition:close` o `transition:minimize` y solo entonces invoca `onDone`. La recuperación de foco cambia la sombra de `weak` a `strong`. La restauración limpia residuos de clases “is-closing”, marca “is-open” y refuerza la sombra. La orden `compositor.toggleGlass` invierte el flag “glass” y dispara un efecto corto que ajusta `backdrop-filter` sin reflow agresivo. El compositor resuelve elementos de ventana con un selector por atributo `data-win-id`, de modo que no depende de referencias de Vue.

Los efectos registrados cubren transiciones de apertura y cierre, un minimizar con FLIP hacia el botón de tarea, restablecimiento con breve “scale” para evitar popping, sombras diferenciadas por foco, una animación de atención y un “shake” de feedback. La velocidad respeta `prefers-reduced-motion` y un factor multiplicador dinámico. No hay coupling con los estilos finales; los efectos solo añaden o quitan clases y esperan `transitionend` con un timeout de seguridad.

## State Manager

`StateManager` es un contenedor de claves de composición y preferencias. Expone `get`, `set`, `toggle` y `snapshot`. Los flags predeterminados activan el modo “glass”, un wallpaper nocturno, ajuste `cover`, efectos habilitados, reducción de movimiento según media query y un multiplicador de velocidad igual a 1. El compositor usa este estado para ajustar la experiencia de usuario y para normalizar la velocidad efectiva de los efectos.

## Integración con Vue y ciclo de vida

La aplicación Vue crea instancias de `WindowManager`, `EventBus`, `StateManager`, `EffectManager` y `Compositor`. Declara `windows` y `tasks` como arreglos reactivos que el template itera para renderizar ventanas y botones de la barra. La función `makeWin` es el único punto legítimo de creación: verifica existencia por `id`, restaura si ya estaba abierta y, si no existe, registra ventana y tarea, aplica foco y emite `window.opened` en un `requestAnimationFrame` para asegurar que el DOM de la ventana está materializado cuando el compositor intente animarla. Las operaciones `focus`, `minimize`, `restore`, `toggleMaximize` y `closeWindow` son envoltorios que combinan invocaciones del `WindowManager`, mantenimiento de `tasks` activo/inactivo y emisión ordenada de eventos del ciclo de vida.

El arrastre y el redimensionado no alteran directamente estilos de la ventana. El sistema crea un “ghost” durante la interacción y, al finalizar, actualiza las coordenadas y dimensiones en el modelo del `WindowManager`, tras lo cual un getter reactivo de estilo vuelve a serializar el CSS inline. Esta separación garantiza que el render de Vue permanece consistente y evita jitter por reasignaciones durante `mousemove`.

## Telemetría

La clase `Telemetry` construye un payload base con `event_id`, marca de tiempo ISO, `page_*`, `env`, `app`, `session_id` y, si está disponible, `client_id` de GA4 obtenido por callback. Todas las interacciones relevantes llaman a `send` con un nombre semántico y un diccionario corto de atributos. Si `gtag` no existe, la telemetría degrada en consola con el prefijo `[telemetry:fallback]`. El visor de documentos y acciones de UI reportan aperturas, cierres, descargas y CTA.

## Ciclo de vida de ventanas

La creación se agota en una única puerta de entrada. La función `makeWin` verifica si la ventana ya existe; si existe, ejecuta `restore` y `focus`; si no existe, crea la instancia en el `WindowManager`, añade un descriptor reactivo con un getter `style` y registra la tarea visible en la barra. La emisión del evento `window.opened` se difiere a la siguiente animación de cuadro para garantizar que el DOM de la ventana ya esté materializado cuando el compositor dispare la transición de apertura. Las operaciones de minimizar y restaurar envían eventos al bus con un `onDone` que asegura que la mutación de estado y la actualización de la taskbar ocurran después de los efectos visuales. El cierre sigue la misma convención y retira tanto la ventana como su tarea una vez completada la transición de salida. La maximización alterna dimensiones completas de la ventana con un snapshot previo y sincroniza el estilo con el DOM para evitar discrepancias.

```
Desktop Environment
 ├── Compositor
 │     ├── Manages wallpaper, blur, and glass effects.
 │     ├── Controls the background rendering layer.
 │     └── Interfaces with CSS filters and display modes.
 │
 ├── WindowManager
 │     ├── Creates and tracks window instances.
 │     ├── Manages z-index stacking and focus.
 │     ├── Handles move, resize, minimize, and close.
 │     └── Connects with event hooks and desktop menu.
 │
 ├── Windows (instances)
 │     ├── Component template (Vue)
 │     └── Defined per module (About, Skills, Projects, etc.)
 │
 └── EventBus
       ├── Provides inter-component communication.
       └── Broadcasts actions like "open", "close", "focus".

```

## Cómo crear una nueva ventana

La creación se aborda desde el punto de extensión correcto: un nombre lógico para la app, un componente Vue para el contenido y un registro en el switch de `openApp`. Primero se implementa un componente con API de props y sin efectos secundarios globales. Un ejemplo minimalista que respeta el estilo existente sería:

```js
const Notes = {
  props: ['t'],
  template: `
    <section class="notes">
      <header><h2>Notas rápidas</h2></header>
      <textarea class="fill" placeholder="Escribe aquí..."></textarea>
    </section>
  `
};
```

La instancia Vue debe declararlo en `components`. A continuación se extiende la función `openApp` para aceptar un nuevo nombre y delegar a `makeWin` con un `id` estable, un título localizado, un icono textual y el nombre del componente. Un registro correcto tiene esta forma:

```js
const openApp = (name) => {
  switch (name) {
    case 'notes':
      makeWin('notes', 'Notas', '📝', 'Notes');
      break;
    // casos existentes...
  }
  telemetry.cta('open_app', { name });
};
```

No es necesario manipular `windows` ni `tasks` explícitamente. `makeWin` crea la entrada, establece el foco, sincroniza la tarea y emite `window.opened` para que el compositor ejecute la animación de apertura. Cualquier restauración posterior usará `wm.restore` y publicará `window.restored`, con lo que la ventana reaparece mediante `transition:restore`.

## Cómo añadir la app al menú “Start”

El menú es una lista de nodos en el DOM que invocan `openApp` y cierran el menú. Para exponer la nueva app, se agrega un `div` con clase `item` dentro del contenedor del menú que ya existe. La convención de clic es llamar a `openApp('notes')` y asignar `ui.menu=false` para cerrar. Un ejemplo canónico es:

```html
<div class="item" @click="openApp('notes'); ui.menu=false">
  <span>📝</span>
  <div>Notas</div>
  <span></span>
</div>
```

No se requieren cambios adicionales. La barra de tareas mostrará automáticamente un botón con el `title` de la ventana cuando esté abierta, ya que el arreglo `tasks` se alimenta en `makeWin`.

## Cómo crear un icono de escritorio para abrir la app

El escritorio es una cuadrícula de iconos que llaman a `openApp` y generan telemetría de clic. Para añadir un icono se agrega un bloque `div` con clase `icon` dentro del `nav` de la “desktop-grid”. La convención es permitir `@dblclick` para abrir la app y `@click` para registrar telemetría. Un ejemplo coherente con los iconos existentes es:

```html
<div class="icon" tabindex="0"
     @dblclick="openApp('notes')"
     @click="telemetry.click('icon', {element:'notes'})">
  <img alt="Notas" src="https://api.iconify.design/mdi:notebook-outline.svg" />
  <span>Notas</span>
</div>
```

El atributo `tabindex` provee foco por teclado y mantiene accesibilidad básica. No hace falta más código; el ciclo de vida es idéntico al del menú.

## Cómo añadir un acceso directo con parámetros

Si se quiere un acceso directo que abra un visor de documentos con un recurso específico, se invoca el “shell” de visor y se deja que `openViewer` cree una ventana efímera con `id` único por UUID. Un icono que abre un PDF concreto puede escribirse así:

```html
<div class="icon" tabindex="0"
     @dblclick="openViewer({src:'/manuales/mi-guia.pdf', type:'pdf', title:'Guía de usuario'})"
     @click="telemetry.click('icon', {element:'user_guide'})">
  <img alt="Guía" src="https://api.iconify.design/mdi:file-pdf-box.svg" />
  <span>Guía</span>
</div>
```

El visor emite telemetría de apertura y descarga, monta un `iframe` si el `type` es `pdf` y registra cierre cuando se destruye. Este flujo no necesita registro en `openApp` porque no es una app persistente sino un documento bajo el componente `DocumentViewer`.

## Secuencia de minimizar, restaurar y cerrar

La minimización es cooperativa entre UI, bus y `WindowManager`. El botón de minimizar del título emite una CTA de telemetría, ejecuta un efecto de minimizar hacia la barra de tareas y solo después marca `minimized=true` en el modelo. La restauración invierte el proceso: `wm.restore` limpia la bandera, marca la tarea como activa, emite `window.restored` para que el compositor establezca `is-open` y refuerce la sombra, y finalmente publica `window.focus`. El cierre usa `window.closing` con callback `onDone`; el compositor reproduce `transition:close`, ejecuta el callback y entonces se retiran la ventana y su tarea de sus respectivos arreglos. No se recomienda manipular `windows` ni `tasks` directamente fuera de estos envoltorios.

## Arrastre y redimensionado

El arrastre se inicia en el `@mousedown` del `header` de la ventana. Si la ventana está maximizada se publica un evento de feedback y no se permite el movimiento. Durante la operación se activa el “ghost” para evitar reflows costosos; al terminar se materializan las nuevas coordenadas en el objeto gestionado por `WindowManager` y se limpia el estado del “ghost”. El redimensionado usa el mismo patrón con mínimos de anchura y altura y límites duros respecto al tamaño de la ventana gráfica. Tras confirmar el tamaño final, `wm.syncToDOM` no es necesario porque la geometría se refleja por el getter reactivo `style`.

## Compositor: interruptor “glass”

El menú incluye una acción que alterna el modo “glass” del compositor. La invocación emite `compositor.toggleGlass`, el `StateManager` invierte la bandera y el compositor reexpone el nuevo valor para que el template ajuste las clases. Un efecto corto asegura que el cambio de `backdrop-filter` no genere un salto visual.

## Recomendaciones de extensión

Cualquier nueva app debe declararse como componente puro que recibe `props` y emite eventos bien nombrados sin depender del contexto global. El nombre lógico en `openApp` debe ser estable, en minúsculas y sin espacios. Los iconos de escritorio y del menú no deben encapsular lógica distinta de abrir la app o invocar `openViewer`. El código que modifique geometría o banderas de una ventana debe pasar por los métodos del `WindowManager` para preservar la invariancia de la pila y del z-index. Las animaciones deben agregarse como nuevos efectos registrados en el `EffectManager` y la orquestación debe mantenerse dentro del compositor para que los componentes de contenido permanezcan ajenos al sistema de ventanas.

## Anexo: plantilla mínima para una app nueva

El patrón completo para agregar una app llamada “Notes” incluye tres pasos: declarar el componente, registrarlo en `components` y extender `openApp`. El icono de escritorio y la entrada del menú se añaden en el HTML del template, invocando `openApp('notes')`. No se modifican `windows` ni `tasks` manualmente y no se añade lógica de efectos al componente.

```js
// 1) Componente
const Notes = {
  props: ['t'],
  template: `
    <section class="notes">
      <header class="notes-header">
        <h2>Notas</h2>
      </header>
      <textarea class="notes-editor" placeholder="Escribe aquí..."></textarea>
    </section>
  `
};

// 2) Registro en createApp({ components: { ..., Notes } })

// 3) Switch de openApp
const openApp = (name) => {
  switch (name) {
    case 'notes':
      makeWin('notes', 'Notas', '📝', 'Notes');
      break;
    // casos ya existentes
  }
  telemetry.cta('open_app', { name });
};
```

Con esta plantilla se integra una app coherente con el sistema de ventanas, con foco, minimizado, restauración y cierre animados, botón en la barra de tareas y apertura desde menú o icono de escritorio sin dependencias adicionales ni conocimiento del compositor o del administrador de efectos.
