const messages = {
  es: {
    icons: { about: 'Acerca de mí', experience: 'Experiencia', skills: 'Skills', education: 'Educación', cv: 'Descargar CV', contact: 'Contacto' },
    menu: {
      about: 'Acerca de Angel',
      about_hint: 'Perfil y resumen ejecutivo',
      experience: 'Experiencia',
      skills: 'Competencias técnicas',
      education: 'Formación',
      download: 'Descargar CV (PDF)',
      contact: 'Contacto',
      compositor: 'Alternar compositor (vidrio/sólido)',
      badges: 'Distintivos',
      journal: 'Journal',
      projects: 'Proyectos', start: 'Inicio'
    },
    common: { download: 'Descargar', softskills: 'Habilidades blandas', enter: 'Entrar' },
    download: {
      title: 'Descarga de CV',
      hint: 'Versión ejecutiva en PDF para reclutadores.',
      btn_download: '⬇ Descargar CV (PDF)',
      btn_view: '🗎 Ver CV en visor',
      viewer_title: 'CV de Angel'
    },
    contact: {
      title: 'Contacto directo',
      footnote: 'Si deseas colaborar o tienes un proyecto interesante, no dudes en escribirme.'
    },
    journal_ui: {
      title: 'Journal',
      header_desc: 'Entradas recientes del blog. Lectura completa en blog.uetiko.com',
      loading: 'Cargando…',
      error: 'No disponible por ahora.',
      no_title: '(sin título)',
      date: 'Fecha',
      url: 'Enlace',
      open_post: 'Abrir entrada del journal'
    },
    projects: {
      title: 'Proyectos',
      groups: [
        {
          heading: 'Métricas personales',
          items: [
            { title: 'Actividad técnica acumulada', desc: 'Registro histórico de todas las horas de interacción técnica: editores, terminal, desarrollo, automatizaciones y trabajo operativo. Una visión continua de diez años de actividad medida.', badge: 'wakatime_user' },
            { title: 'Ritmo anual de contribución', desc: 'Compilación anual de commits realizados en proyectos personales, laborales y repositorios privados. Refleja constancia técnica en múltiples plataformas de control de versiones.', badge: 'wakatime_yearly' },
            { title: 'Actividad pública en GitHub', desc: 'Indicadores visibles de mi trabajo en repositorios abiertos: contribuciones, issues, PRs y actividad anual. Es la parte auditada públicamente de una práctica profesional mayoritariamente privada.', badge: 'github_stats' }
          ]
        },
        {
          heading: 'Stoyco',
          items: [
            { title: 'Landing Eladio', desc: 'Implementación real de una landing estilo Windows 95 para el artista Eladio (Rimas). Se partió de un HTML base y se reconstruyó como un escritorio funcional con música, imágenes y contenido interactivo.', badge: 'wakatime_eladio' },
            { title: 'Stoyco AWS Console', desc: 'Tiempo dedicado a la administración completa de la cuenta AWS de Stoyco: servicios, seguridad, recursos, monitoreo y operación diaria del entorno cloud.', badge: 'wakatime_stoyco_aws' },
            { title: 'Administración y reportes en base de datos', desc: 'Gestión y análisis de DocumentDB: consultas complejas, modelados, reportes operativos, limpieza de datos y diagramación de relaciones para analítica interna.', badge: 'wakatime_stoyco_db' },
            { title: 'Scripts varios (Node.js)', desc: 'Conjunto de scripts orientados a mantenimiento y saneamiento de datos sobre Amazon DocumentDB, usados para operaciones internas y automatizaciones puntuales.', badge: 'wakatime_stoyco_scripts' },
            { title: 'Core (.NET Core 6)', desc: 'Microservicio principal en .NET 6 desplegado en Kubernetes. Incluye soporte de bugs críticos y la reimplementación del módulo de saldo de Stoycoins.', badge: 'wakatime_stoyco_core' },
            { title: 'Microservicio Usuario (Node.js)', desc: 'Separación formal de la lógica de usuarios desde el microservicio Core. Implementado en Node.js y ejecutado en AWS Lambda para aislar responsabilidades y mejorar mantenibilidad.', badge: 'wakatime_stoyco_user' },
            { title: 'Backoffice (mantenimiento de errores críticos, Node.js)', desc: 'Mantenimiento operativo y corrección de errores críticos en el backoffice administrativo, desarrollado con Angular.', badge: 'wakatime_stoyco_backoffice' },
            { title: 'Queue multipropósito (follows, reports, Mailchimp)', desc: 'Cola de procesamiento para flujos internos: follows, reportes, Mailchimp y otros servicios. Diseñada para dar continuidad y estabilidad al sistema.', badge: 'wakatime_stoyco_queue' }
          ]
        },
        {
          heading: 'City Express (hoteles)',
          items: [
            { title: 'Channel Manager Backend (FastAPI)', desc: 'Apoyo técnico puntual al equipo interno de Norte19. Corrección de problemas en las integraciones con Booking y Expedia, ajuste de flujos de reservas y estabilización del pipeline de despliegue. Las migraciones de base de datos se automatizaron para evitar fallos al promover nuevas versiones.', badge: 'wakatime_cityexpress_backend' },
            { title: 'Channel Manager Frontend (Svelte)', desc: 'Corrección de errores críticos y normalización del manejo de respuestas. Se sustituyeron los retornos 200 genéricos por respuestas basadas en JSON:API, mejorando claridad, trazabilidad y mensajes de error para el usuario.', badge: 'wakatime_cityexpress_frontend' }
          ]
        },
        {
          heading: 'Vass',
          items: [
            { title: 'Wiki', desc: '', badge: 'wakatime_vass_wiki' },
            { title: 'Magento (Telefónica Chile)', desc: '', badge: 'wakatime_vass_magento' },
            { title: 'Banco Estado (Symfony)', desc: '', badge: 'wakatime_vass_bancostado' }
          ]
        },
        {
          heading: 'Enova',
          items: [
            { title: 'Mako', desc: '', badge: 'wakatime_enova_mako' }
          ]
        }
      ]
    },
    windows: {
      minimize: 'Minimizar',
      maximize: 'Maximizar',
      restore: 'Restaurar',
      close: 'Cerrar'
    },
    metadata: {
      document_title: 'Angel Barrientos — Escritorio retro',
      language: 'Idioma'
    },
    runtime: {
      title: 'No se pudo cargar el perfil',
      details: 'La experiencia no está disponible porque el contenido requerido no pudo validarse. Recarga la página para intentarlo de nuevo.',
      technical: 'Detalle técnico'
    },
    a11y: {
      desktop: 'Escritorio del perfil de Angel Barrientos',
      icon_about: 'Abrir Acerca de mí',
      icon_experience: 'Abrir Experiencia',
      icon_skills: 'Abrir Competencias',
      icon_education: 'Abrir Educación',
      icon_cv: 'Abrir descarga de CV',
      icon_contact: 'Abrir Contacto',
      start: 'Abrir menú de inicio',
      language: 'Cambiar idioma',
      minimize: 'Minimizar ventana',
      maximize: 'Maximizar ventana',
      restore: 'Restaurar ventana',
      close: 'Cerrar ventana',
      journal_post: 'Abrir entrada del journal'
    }
  },
  en: {
    icons: { about: 'About me', experience: 'Experience', skills: 'Skills', education: 'Education', cv: 'Download CV', contact: 'Contact' },
    menu: {
      about: 'About Angel', about_hint: 'Profile & executive summary', experience: 'Experience',
      skills: 'Technical skills', education: 'Education', download: 'Download CV (PDF)', contact: 'Contact',
      compositor: 'Toggle compositor (glass/solid)', badges: 'Badges', journal: 'Journal', projects: 'Projects', start: 'Start'
    },
    common: { download: 'Download', softskills: 'Soft skills', enter: 'Enter' },
    download: {
      title: 'CV download',
      hint: 'Executive PDF version for recruiters.',
      btn_download: '⬇ Download CV (PDF)',
      btn_view: '🗎 View CV',
      viewer_title: "Angel's CV"
    },
    contact: {
      title: 'Direct contact',
      footnote: "If you'd like to collaborate or have an interesting project, feel free to reach out."
    },
    journal_ui: {
      title: 'Journal',
      header_desc: 'Recent blog entries. Full reading at blog.uetiko.com',
      loading: 'Loading…',
      error: 'Not available right now.',
      no_title: '(untitled)',
      date: 'Date',
      url: 'Link',
      open_post: 'Open journal entry'
    },
    projects: {
      title: 'Projects',
      groups: [
        {
          heading: 'Personal Metrics',
          items: [
            { title: 'Cumulative technical activity', desc: 'Historical record of all technical interaction hours: editors, terminal, development, automations, and operational work. A continuous view of ten years of measured activity.', badge: 'wakatime_user' },
            { title: 'Annual contribution pace', desc: 'Annual compilation of commits across personal, work, and private repositories. Reflects consistent technical output across multiple version control platforms.', badge: 'wakatime_yearly' },
            { title: 'Public GitHub activity', desc: 'Visible indicators of my work on open repositories: contributions, issues, PRs, and yearly activity. The publicly audited portion of a largely private professional practice.', badge: 'github_stats' }
          ]
        },
        {
          heading: 'Stoyco',
          items: [
            { title: 'Landing Eladio', desc: 'Production implementation of a Windows 95-style landing for artist Eladio (Rimas). Built from a base HTML file into a functional desktop with music, images, and interactive content.', badge: 'wakatime_eladio' },
            { title: 'Stoyco AWS Console', desc: "Time dedicated to full administration of Stoyco's AWS account: services, security, resources, monitoring, and day-to-day cloud operations.", badge: 'wakatime_stoyco_aws' },
            { title: 'Database management and reporting', desc: 'DocumentDB management and analysis: complex queries, data modeling, operational reports, data cleanup, and relation diagramming for internal analytics.', badge: 'wakatime_stoyco_db' },
            { title: 'Various scripts (Node.js)', desc: 'Set of scripts for maintenance and data sanitization on Amazon DocumentDB, used for internal operations and targeted automations.', badge: 'wakatime_stoyco_scripts' },
            { title: 'Core (.NET Core 6)', desc: 'Main microservice in .NET 6 deployed on Kubernetes. Includes critical bug support and reimplementation of the Stoycoins balance module.', badge: 'wakatime_stoyco_core' },
            { title: 'User microservice (Node.js)', desc: 'Formal separation of user logic from the Core microservice. Implemented in Node.js and deployed on AWS Lambda to isolate responsibilities and improve maintainability.', badge: 'wakatime_stoyco_user' },
            { title: 'Backoffice (critical error maintenance, Node.js)', desc: 'Operational maintenance and critical error fixes in the administrative backoffice, built with Angular.', badge: 'wakatime_stoyco_backoffice' },
            { title: 'Multi-purpose queue (follows, reports, Mailchimp)', desc: 'Processing queue for internal flows: follows, reports, Mailchimp, and other services. Designed for continuity and system stability.', badge: 'wakatime_stoyco_queue' }
          ]
        },
        {
          heading: 'City Express (hotels)',
          items: [
            { title: 'Channel Manager Backend (FastAPI)', desc: 'Targeted technical support for the Norte19 internal team. Fixed integration issues with Booking and Expedia, adjusted reservation flows, and stabilized the deployment pipeline. Database migrations were automated to prevent failures when promoting new versions.', badge: 'wakatime_cityexpress_backend' },
            { title: 'Channel Manager Frontend (Svelte)', desc: 'Critical bug fixes and response handling normalization. Replaced generic 200 returns with JSON:API-based responses, improving clarity, traceability, and user-facing error messages.', badge: 'wakatime_cityexpress_frontend' }
          ]
        },
        {
          heading: 'Vass',
          items: [
            { title: 'Wiki', desc: '', badge: 'wakatime_vass_wiki' },
            { title: 'Magento (Telefónica Chile)', desc: '', badge: 'wakatime_vass_magento' },
            { title: 'Banco Estado (Symfony)', desc: '', badge: 'wakatime_vass_bancostado' }
          ]
        },
        {
          heading: 'Enova',
          items: [
            { title: 'Mako', desc: '', badge: 'wakatime_enova_mako' }
          ]
        }
      ]
    },
    windows: {
      minimize: 'Minimize',
      maximize: 'Maximize',
      restore: 'Restore',
      close: 'Close'
    },
    metadata: {
      document_title: 'Angel Barrientos — Retro Desktop',
      language: 'Language'
    },
    runtime: {
      title: 'The profile could not be loaded',
      details: 'The experience is unavailable because required content could not be validated. Reload the page to try again.',
      technical: 'Technical detail'
    },
    a11y: {
      desktop: 'Angel Barrientos profile desktop',
      icon_about: 'Open About me',
      icon_experience: 'Open Experience',
      icon_skills: 'Open Technical skills',
      icon_education: 'Open Education',
      icon_cv: 'Open CV download',
      icon_contact: 'Open Contact',
      start: 'Open start menu',
      language: 'Change language',
      minimize: 'Minimize window',
      maximize: 'Maximize window',
      restore: 'Restore window',
      close: 'Close window',
      journal_post: 'Open journal entry'
    }
  }
};

const narrativeSchema = {
  about: {
    title: 'string', summary: 'string', profile: 'string', location_key: 'string',
    location: 'string', languages: 'string', value_key: 'string', value_detail: 'string',
    role_key: 'string', role_now: 'string', softskills: 'string'
  },
  experience: {
    title: 'string',
    items: [{ company: 'string', role: 'string?', period: 'string', bullets: ['string'], subtitle: 'string?' }]
  },
  skills: {
    title: 'string',
    left: [{ heading: 'string', rows: [{ label: 'string', value: 'string' }], descs: ['string'] }],
    right: [{ heading: 'string', rows: [{ label: 'string', value: 'string' }], descs: ['string'] }]
  },
  education: {
    title: 'string',
    formal: { title: 'string', meta: 'string', detail: 'string' },
    complementary: { title: 'string', items: ['string'] },
    current: { title: 'string', detail: 'string' }
  }
};

const requiredMessageNamespaces = ['icons', 'menu', 'common', 'download', 'contact', 'journal_ui', 'projects', 'windows', 'metadata', 'runtime', 'a11y'];
const requiredMessageKeys = [
  'icons.about', 'icons.experience', 'icons.skills', 'icons.education', 'icons.cv', 'icons.contact',
  'menu.about', 'menu.about_hint', 'menu.experience', 'menu.skills', 'menu.education', 'menu.download',
  'menu.contact', 'menu.compositor', 'menu.badges', 'menu.journal', 'menu.projects', 'menu.start', 'common.download', 'common.softskills', 'common.enter',
  'download.title', 'download.hint', 'download.btn_download', 'download.btn_view', 'download.viewer_title',
  'contact.title', 'contact.footnote', 'journal_ui.title', 'journal_ui.header_desc', 'journal_ui.loading',
  'journal_ui.error', 'journal_ui.no_title', 'journal_ui.date', 'journal_ui.url', 'journal_ui.open_post',
  'projects.title', 'projects.groups', 'windows.minimize', 'windows.maximize', 'windows.restore', 'windows.close',
  'metadata.document_title', 'metadata.language', 'runtime.title', 'runtime.details', 'runtime.technical',
  'a11y.desktop', 'a11y.icon_about', 'a11y.icon_experience', 'a11y.icon_skills', 'a11y.icon_education', 'a11y.icon_cv', 'a11y.icon_contact',
  'a11y.start', 'a11y.language', 'a11y.minimize', 'a11y.maximize', 'a11y.restore', 'a11y.close', 'a11y.journal_post'
];

const valueType = (value) => {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  return typeof value;
};

const validateAgainstSchema = (value, schema, path) => {
  if (typeof schema === 'string') {
    const optional = schema.endsWith('?');
    const expected = optional ? schema.slice(0, -1) : schema;
    if (value === undefined && optional) return;
    if (valueType(value) !== expected) throw new Error(`Invalid ${path}: expected ${expected}`);
    return;
  }
  if (Array.isArray(schema)) {
    if (!Array.isArray(value)) throw new Error(`Invalid ${path}: expected array`);
    value.forEach((item, index) => validateAgainstSchema(item, schema[0], `${path}[${index}]`));
    return;
  }
  if (valueType(value) !== 'object') throw new Error(`Invalid ${path}: expected object`);
  const expectedKeys = Object.keys(schema);
  const actualKeys = Object.keys(value);
  const unexpected = actualKeys.filter(key => !expectedKeys.includes(key));
  if (unexpected.length) throw new Error(`Invalid ${path}: unexpected key ${unexpected[0]}`);
  expectedKeys.forEach(key => validateAgainstSchema(value[key], schema[key], `${path}.${key}`));
};

const assertSameShape = (left, right, path = 'root') => {
  if (valueType(left) !== valueType(right)) throw new Error(`Asymmetric structure at ${path}: incompatible types`);
  if (Array.isArray(left)) {
    if (left.length !== right.length) throw new Error(`Asymmetric structure at ${path}: unequal array length`);
    left.forEach((item, index) => assertSameShape(item, right[index], `${path}[${index}]`));
    return;
  }
  if (valueType(left) !== 'object') return;
  const leftKeys = Object.keys(left).sort();
  const rightKeys = Object.keys(right).sort();
  if (leftKeys.length !== rightKeys.length || leftKeys.some((key, index) => key !== rightKeys[index])) throw new Error(`Asymmetric structure at ${path}: different keys`);
  leftKeys.forEach(key => assertSameShape(left[key], right[key], `${path}.${key}`));
};

const getMessageValue = (catalog, key) => key.split('.').reduce((current, segment) => current?.[segment], catalog);

const validateMessageLanguage = (language) => {
  const catalog = messages[language];
  if (!catalog || typeof catalog !== 'object' || Array.isArray(catalog)) throw new Error(`Invalid message catalog: ${language}`);
  requiredMessageKeys.forEach(key => {
    const value = getMessageValue(catalog, key);
    if (value === undefined || value === null) throw new Error(`Missing message key: ${language}.${key}`);
    if (key !== 'projects.groups' && typeof value !== 'string') throw new Error(`Invalid message key type: ${language}.${key}`);
  });
  if (!Array.isArray(catalog.projects.groups)) throw new Error(`Invalid message key type: ${language}.projects.groups`);
  catalog.projects.groups.forEach((group, groupIndex) => {
    if (!group || typeof group.heading !== 'string' || !Array.isArray(group.items)) throw new Error(`Invalid projects group: ${language}.projects.groups[${groupIndex}]`);
    group.items.forEach((item, itemIndex) => {
      if (!item || typeof item.title !== 'string' || typeof item.desc !== 'string' || typeof item.badge !== 'string') throw new Error(`Invalid project item: ${language}.projects.groups[${groupIndex}].items[${itemIndex}]`);
    });
  });
};

const validateMessages = () => {
  ['es', 'en'].forEach(language => {
    if (!messages[language] || typeof messages[language] !== 'object' || Array.isArray(messages[language])) throw new Error(`Invalid message catalog: ${language}`);
    requiredMessageNamespaces.forEach(namespace => {
      if (!messages[language][namespace] || typeof messages[language][namespace] !== 'object') throw new Error(`Missing message namespace: ${language}.${namespace}`);
    });
  });
  validateMessageLanguage('es');
  validateMessageLanguage('en');
  assertSameShape(messages.es, messages.en, 'messages');
};

const createTranslator = (lang, narrative) => (key) => {
  const source = messages[lang]?.[key.split('.')[0]] ? messages[lang] : narrative[lang];
  const value = key.split('.').reduce((current, segment) => current?.[segment], source);
  if (value === undefined || value === null) throw new Error(`Missing translation key: ${lang}.${key}`);
  return value;
};

const loadNarrative = async () => {
  const narrative = { es: null, en: null };
  await Promise.all(['es', 'en'].map(async (language) => {
    const response = await fetch(`./content/profile.${language}.json`, { headers: { Accept: 'application/json' } });
    if (!response.ok) throw new Error(`Narrative resource error: HTTP ${response.status}`);
    let content;
    try { content = await response.json(); } catch { throw new Error(`Narrative resource error: invalid JSON (${language})`); }
    validateAgainstSchema(content, narrativeSchema, `narrative.${language}`);
    narrative[language] = content;
  }));

  assertSameShape(narrative.es, narrative.en, 'narrative');
  return narrative;
};
const i18n = (lang, narrative) => createTranslator(lang, narrative);

const initialLanguage = (language = navigator.language) => (language || 'es').startsWith('es') ? 'es' : 'en';

export {
  assertSameShape,
  createTranslator,
  initialLanguage,
  loadNarrative,
  messages,
  narrativeSchema,
  validateAgainstSchema,
  i18n,
  validateMessages
};
