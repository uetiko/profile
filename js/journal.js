const extractImageFromHtml = html => {
  if (!html) return null;
  const match = html.match(/<img[^>]+src="([^">]+)"/i);
  return match ? match[1] : null;
};

const extractTextExcerpt = (html, max = 160) => {
  if (!html) return '';
  const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  return text.length > max ? text.slice(0, max) + '…' : text;
};

const parseJournalEntries = data => {
  const rawEntries = data?.feed?.entry || [];
  return rawEntries.map(entry => {
    try {
      const content = entry.content?.$t || entry.summary?.$t || '';
      const altLink = Array.isArray(entry.link) ? entry.link.find(link => link.rel === 'alternate')?.href : undefined;
      return {
        id: entry.id?.$t ?? '',
        title: entry.title?.$t ?? '',
        url: altLink ?? null,
        published: entry.published?.$t ?? null,
        excerpt: extractTextExcerpt(content),
        image: extractImageFromHtml(content)
      };
    } catch {
      return null;
    }
  }).filter(entry => entry !== null && entry.url);
};

async function fetchJournal({ limit = 10 } = {}) {
  const url = `https://blog.uetiko.com/feeds/posts/default?alt=json&max-results=${encodeURIComponent(limit)}`;
  const response = await fetch(url, { method: 'GET', headers: { Accept: 'application/json' } });
  if (!response.ok) throw new Error(`Journal feed error: HTTP ${response.status}`);
  return parseJournalEntries(await response.json());
}

const Journal = {
  props: ['t', 'telemetry', 'lang'],
  data() { return { items: [], loading: true, error: null }; },
  async mounted() {
    try {
      this.items = await fetchJournal({ limit: 10 });
      this.telemetry?.openWindow?.('journal', { count: this.items.length });
    } catch (error) {
      this.error = String(error?.message || error);
      this.telemetry?.error?.('journal', { message: this.error });
    } finally {
      this.loading = false;
    }
  },
  beforeUnmount() { this.telemetry?.closeWindow?.('journal', {}); },
  methods: {
    openPost(item) {
      this.telemetry?.cta?.('journal_open_post', { id: item.id, url: item.url, title: item.title });
      window.open(item.url, '_blank', 'noopener');
    },
    fmtDate(iso) {
      if (!iso) return '';
      try {
        const date = new Date(iso);
        return date.toLocaleDateString(this.lang || 'es', { year: 'numeric', month: 'short', day: '2-digit' });
      } catch { return iso; }
    }
  },
  template: `
    <section class="journal">
      <header class="journal-header"><h2>{{ t('journal_ui.title') }}</h2><p class="muted">{{ t('journal_ui.header_desc') }}</p></header>
      <div class="hr"></div>
      <p v-if="loading" class="muted">{{ t('journal_ui.loading') }}</p>
      <p v-else-if="error" class="muted">{{ t('journal_ui.error') }} ({{ error }})</p>
      <div v-else class="journal-list">
        <article v-for="it in items" :key="it.id" class="journal-item" @click="openPost(it)" @keydown.enter="openPost(it)" tabindex="0" :aria-label="t('journal_ui.open_post')">
          <div class="thumb"><img v-if="it.image" :src="it.image" :alt="it.title || t('journal_ui.no_title')" loading="lazy" /><div v-else class="thumb-fallback"></div></div>
          <div class="meta"><h3 class="title">{{ it.title || t('journal_ui.no_title') }}</h3><p class="sub muted"><span>{{ t('journal_ui.date') }}:</span> {{ fmtDate(it.published) }} · <span>{{ t('journal_ui.url') }}:</span> {{ it.url }}</p><p class="excerpt">{{ it.excerpt }}</p></div>
        </article>
      </div>
    </section>
  `
};

export { Journal, extractImageFromHtml, extractTextExcerpt, fetchJournal, parseJournalEntries };
