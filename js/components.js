const About = {
  props: ['t'],
  template: `
    <section class="about">
      <header class="about-header">
        <div class="about-avatar"><img src="./favicon-32x32.png"></div>
        <div>
          <h2 class="about-name">{{ t('about.title')}}</h2>
          <p class="about-summary">{{ t('about.summary') }}</p>
        </div>
      </header>
      <div class="hr"></div>
      <article class="about-col"><p class="muted">{{ t('about.profile') }}</p></article>
      <section class="about-info grid cols-2">
        <div class="about-col"><p><strong>{{ t('about.location_key') }}</strong><span class="muted">{{ t('about.location')}}</span><br><span class="muted">{{ t('about.languages') }}</span></p></div>
        <div class="about-col"><p><strong>{{ t('about.value_key') }}:</strong> <span class="muted">{{ t('about.value_detail') }}</span></p></div>
        <div class="about-col"><p><strong>{{ t('about.role_key') }}</strong> <span class="muted">{{ t('about.role_now') }}</span></p></div>
        <div class="about-col"><p><strong>{{ t('common.softskills') }}:</strong> <span class="muted">{{ t('about.softskills') }}</span></p></div>
      </section>
    </section>
  `
};

const Experience = {
  props: ['t'],
  template: `
    <section class="experience">
      <h2 class="exp-title">{{ t('experience.title') }}</h2>
      <article v-for="item in t('experience.items')" :key="item.company" class="exp-card">
        <header><h3>{{ item.company }}</h3><p v-if="item.role" class="role">{{ item.role }} <span v-if="item.period" class="period">({{ item.period }})</span></p></header>
        <ul v-if="item.bullets && item.bullets.length"><li v-for="b in item.bullets" :key="b">{{ b }}</li></ul>
        <p v-if="item.subtitle" class="role muted">{{ item.subtitle }}</p>
      </article>
    </section>
  `
};

const Skills = {
  props: ['t'],
  template: `
    <section class="skills">
      <h2 class="skills-title">{{ t('skills.title') }}</h2>
      <div class="skills-grid">
        <div class="skills-col"><div v-for="block in t('skills.left')" :key="block.heading" class="skills-block"><h3>{{ block.heading }}</h3><p v-for="row in block.rows" :key="row.label"><strong>{{ row.label }}:</strong> {{ row.value }}</p><p v-for="desc in block.descs" :key="desc" class="desc">{{ desc }}</p></div></div>
        <div class="skills-col"><div v-for="block in t('skills.right')" :key="block.heading" class="skills-block"><h3>{{ block.heading }}</h3><p v-for="row in block.rows" :key="row.label"><strong>{{ row.label }}:</strong> {{ row.value }}</p><p v-for="desc in block.descs" :key="desc" class="desc">{{ desc }}</p></div></div>
      </div>
    </section>
  `
};

const Education = {
  props: ['t'],
  template: `
    <section class="education">
      <h2 class="edu-title">{{ t('education.title') }}</h2>
      <article class="edu-block"><header><h3>{{ t('education.formal.title') }}</h3><p class="edu-meta">{{ t('education.formal.meta') }}</p></header><p class="edu-detail">{{ t('education.formal.detail') }}</p></article>
      <article class="edu-block"><header><h3>{{ t('education.complementary.title') }}</h3></header><ul class="edu-list"><li v-for="item in t('education.complementary.items')" :key="item">{{ item }}</li></ul></article>
      <article class="edu-block"><header><h3>{{ t('education.current.title') }}</h3></header><p class="edu-detail">{{ t('education.current.detail') }}</p></article>
    </section>
  `
};

const Download = {
  props: ['t'],
  emits: ['open-viewer', 'download'],
  template: `
    <section class="download">
      <header class="download-header"><h2 class="download-title">{{ t('download.title') }}</h2><p class="muted">{{ t('download.hint') }}</p></header>
      <div class="download-actions">
        <a class="btn-download" href="/cv/angel-barrientos.pdf" download @click="$emit('download')">{{ t('download.btn_download') }}</a>
        <button class="btn-view" @click.prevent="$emit('open-viewer',{src:'/cv/angel-barrientos.pdf',type:'pdf',title:t('download.viewer_title')})">{{ t('download.btn_view') }}</button>
      </div>
      <div class="hr"></div>
      <footer class="download-footer"><nav><a class="link" href="https://linkedin.com/in/uetiko" target="_blank" rel="noopener">LinkedIn</a><span>·</span><a class="link" href="https://github.com/uetiko" target="_blank" rel="noopener">GitHub</a><span>·</span><a class="link" href="https://blog.uetiko.com" target="_blank" rel="noopener">Blog</a></nav></footer>
    </section>
  `
};

const Contact = {
  props: ['t'],
  template: `
    <section class="contact">
      <h2 class="contact-title">{{ t('contact.title') }}</h2>
      <div class="contact-card"><div class="contact-row"><span class="contact-icon">📧</span><a class="contact-link" href="mailto:uetiko@gmail.com">uetiko@gmail.com</a></div><div class="contact-row"><span class="contact-icon">🌐</span><a class="contact-link" href="https://linkedin.com/in/uetiko" target="_blank" rel="noopener">LinkedIn</a><span>·</span><a class="contact-link" href="https://github.com/uetiko" target="_blank" rel="noopener">GitHub</a><span>·</span><a class="contact-link" href="https://blog.uetiko.com" target="_blank" rel="noopener">Blog</a></div></div>
      <div class="hr"></div><p class="muted contact-footnote">{{ t('contact.footnote') }}</p>
    </section>
  `
};

const DocumentViewer = {
  props: ['src', 'type', 'title', 'telemetry', 't'],
  template: `
    <section class="doc-viewer">
      <header class="doc-header"><h3 class="doc-title">{{ title }}</h3><div class="doc-actions"><a class="btn-doc" :href="src" download @click="telemetry.download({file_name: src.split('/').pop(), element:'download_link'})">⬇ {{ t('common.download') }}</a></div></header>
      <div class="doc-frame"><component :is="componentType" :src="src" class="doc-content" /></div>
    </section>
  `,
  computed: {
    componentType() {
      switch (this.type) {
        case 'image': return 'img';
        case 'pdf': return 'iframe';
        default: return 'iframe';
      }
    }
  },
  mounted() { this.telemetry.openWindow('document_viewer', { file: this.src, type: this.type }); },
  unmounted() { this.telemetry.closeWindow('document_viewer', { file: this.src }); }
};

export { About, Contact, DocumentViewer, Download, Education, Experience, Skills };
