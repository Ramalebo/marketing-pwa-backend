<template>
  <div class="search-marketing-page">
    <!-- Page header -->
    <div class="clean-page-header mb-6">
      <h1 class="clean-page-header__title">Search Marketing</h1>
      <p class="clean-page-header__subtitle">Best practices for SEO so your clients are the first option when customers search.</p>
    </div>

    <!-- Goal callout -->
    <v-alert
      type="info"
      variant="tonal"
      class="mb-6"
      border="start"
      density="comfortable"
    >
      <strong>Goal:</strong> Optimise websites and content so search engines (Google, Bing) rank your clients at the top for relevant queries. Use this guide to check and improve on-page SEO, keywords, technical health, and content.
    </v-alert>

    <!-- SEO checklist / action guide -->
    <div class="app-card pa-6 mb-6">
      <h2 class="section-title mb-4">
        <v-icon color="primary" class="mr-2">mdi-format-list-checks</v-icon>
        SEO action guide
      </h2>
      <p class="text-body-2 text-medium-emphasis mb-4">Work through this list per client or campaign to ensure search visibility.</p>
      <v-row>
        <v-col cols="12" md="6">
          <div class="seo-checklist">
            <div v-for="(item, i) in checklistOnPage" :key="'on-' + i" class="checklist-item">
              <v-checkbox
                v-model="item.done"
                hide-details
                density="compact"
                color="primary"
                :label="item.label"
                class="checklist-checkbox"
              />
            </div>
          </div>
        </v-col>
        <v-col cols="12" md="6">
          <div class="seo-checklist">
            <div v-for="(item, i) in checklistTechnical" :key="'tech-' + i" class="checklist-item">
              <v-checkbox
                v-model="item.done"
                hide-details
                density="compact"
                color="primary"
                :label="item.label"
                class="checklist-checkbox"
              />
            </div>
          </div>
        </v-col>
      </v-row>
      <div class="mt-4 pt-4" style="border-top: 1px solid #e5e7eb;">
        <v-btn variant="tonal" color="primary" size="small" @click="resetChecklist">Reset checklist</v-btn>
      </div>
    </div>

    <!-- Quick reference: Meta & keywords -->
    <div class="app-card pa-6 mb-6">
      <h2 class="section-title mb-4">
        <v-icon color="primary" class="mr-2">mdi-tag-multiple</v-icon>
        Meta & keyword guidance
      </h2>
      <p class="text-body-2 text-medium-emphasis mb-4">Use these as reference when writing titles and descriptions for client pages.</p>
      <v-row>
        <v-col cols="12" md="4">
          <v-text-field
            v-model="metaGuide.targetKeyword"
            label="Primary keyword (focus for this page)"
            placeholder="e.g. digital marketing Johannesburg"
            variant="outlined"
            density="comfortable"
            hide-details="auto"
          />
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field
            v-model="metaGuide.metaTitle"
            label="Meta title (50–60 characters)"
            placeholder="e.g. Digital Marketing Agency | Johannesburg"
            variant="outlined"
            density="comfortable"
            hide-details="auto"
          />
          <div class="text-caption text-medium-emphasis mt-1">{{ (metaGuide.metaTitle || '').length }} / 60</div>
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field
            v-model="metaGuide.metaDescription"
            label="Meta description (150–160 characters)"
            placeholder="Short summary with keyword and CTA"
            variant="outlined"
            density="comfortable"
            hide-details="auto"
          />
          <div class="text-caption text-medium-emphasis mt-1">{{ (metaGuide.metaDescription || '').length }} / 160</div>
        </v-col>
      </v-row>
    </div>

    <!-- Best practices cards -->
    <h2 class="section-title mb-4">Best practices</h2>
    <v-row>
      <v-col cols="12" sm="6" md="3">
        <div class="practice-card">
          <div class="practice-card__icon practice-card__icon--onpage">
            <v-icon size="28">mdi-file-document-edit</v-icon>
          </div>
          <h3 class="practice-card__title">On-page SEO</h3>
          <ul class="practice-card__list">
            <li>Include primary keyword in title, H1, and first paragraph</li>
            <li>Use H2/H3 for structure; add keywords where natural</li>
            <li>Meta title 50–60 chars; meta description 150–160 chars</li>
            <li>One clear H1 per page</li>
          </ul>
        </div>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <div class="practice-card">
          <div class="practice-card__icon practice-card__icon--technical">
            <v-icon size="28">mdi-cog</v-icon>
          </div>
          <h3 class="practice-card__title">Technical SEO</h3>
          <ul class="practice-card__list">
            <li>Fast load times (core web vitals)</li>
            <li>Mobile-friendly (responsive) design</li>
            <li>HTTPS and valid sitemap.xml</li>
            <li>Clean URLs; fix broken links</li>
          </ul>
        </div>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <div class="practice-card">
          <div class="practice-card__icon practice-card__icon--content">
            <v-icon size="28">mdi-text-box</v-icon>
          </div>
          <h3 class="practice-card__title">Content & keywords</h3>
          <ul class="practice-card__list">
            <li>Quality content that answers search intent</li>
            <li>Long-tail keywords for less competition</li>
            <li>Internal links to related pages</li>
            <li>Fresh, accurate content; update regularly</li>
          </ul>
        </div>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <div class="practice-card">
          <div class="practice-card__icon practice-card__icon--local">
            <v-icon size="28">mdi-map-marker</v-icon>
          </div>
          <h3 class="practice-card__title">Local SEO</h3>
          <ul class="practice-card__list">
            <li>Google Business Profile claimed and complete</li>
            <li>NAP consistent (name, address, phone) everywhere</li>
            <li>Local keywords (e.g. “city + service”)</li>
            <li>Reviews and local citations</li>
          </ul>
        </div>
      </v-col>
    </v-row>

    <!-- Do's and don'ts -->
    <v-row class="mt-6">
      <v-col cols="12" md="6">
        <div class="app-card pa-6 h-100">
          <h3 class="practice-card__title text-success mb-3">
            <v-icon color="success" size="20" class="mr-1">mdi-check-circle</v-icon>
            Do
          </h3>
          <ul class="practice-card__list">
            <li>Write for humans first; optimise for search second</li>
            <li>Use descriptive, keyword-rich alt text for images</li>
            <li>Build quality backlinks from relevant sites</li>
            <li>Track rankings and traffic; adjust strategy</li>
          </ul>
        </div>
      </v-col>
      <v-col cols="12" md="6">
        <div class="app-card pa-6 h-100">
          <h3 class="practice-card__title text-error mb-3">
            <v-icon color="error" size="20" class="mr-1">mdi-close-circle</v-icon>
            Don't
          </h3>
          <ul class="practice-card__list">
            <li>Keyword stuff or hide text</li>
            <li>Duplicate content across pages</li>
            <li>Ignore mobile experience or page speed</li>
            <li>Buy links or use black-hat tactics</li>
          </ul>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: 'Search',
  data() {
    return {
      metaGuide: {
        targetKeyword: '',
        metaTitle: '',
        metaDescription: ''
      },
      checklistOnPage: [
        { label: 'Primary keyword in page title (H1)', done: false },
        { label: 'Meta title 50–60 characters with keyword', done: false },
        { label: 'Meta description 150–160 characters with CTA', done: false },
        { label: 'Headings (H2/H3) used for structure', done: false },
        { label: 'Keyword in first paragraph', done: false },
        { label: 'Alt text on important images', done: false }
      ],
      checklistTechnical: [
        { label: 'Page loads quickly (Core Web Vitals)', done: false },
        { label: 'Mobile-friendly layout', done: false },
        { label: 'HTTPS enabled', done: false },
        { label: 'Sitemap submitted (e.g. Search Console)', done: false },
        { label: 'No broken links on page', done: false },
        { label: 'Clean, readable URLs', done: false }
      ]
    };
  },
  methods: {
    resetChecklist() {
      this.checklistOnPage.forEach(i => { i.done = false; });
      this.checklistTechnical.forEach(i => { i.done = false; });
    }
  }
};
</script>

<style scoped>
.search-marketing-page {
  padding-bottom: 48px;
}

.section-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  display: flex;
  align-items: center;
}

.seo-checklist {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.checklist-item {
  display: flex;
  align-items: center;
}

.checklist-checkbox :deep(.v-label) {
  font-size: 0.875rem;
  color: #374151;
}

.practice-card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 20px;
  height: 100%;
  transition: box-shadow 0.2s, border-color 0.2s;
}

.practice-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  border-color: #d1d5db;
}

.practice-card__icon {
  width: 52px;
  height: 52px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
}

.practice-card__icon--onpage { background: #dbeafe; color: #2563eb; }
.practice-card__icon--technical { background: #e0e7ff; color: #4f46e5; }
.practice-card__icon--content { background: #d1fae5; color: #059669; }
.practice-card__icon--local { background: #fef3c7; color: #d97706; }

.practice-card__title {
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 10px 0;
}

.practice-card__list {
  margin: 0;
  padding-left: 18px;
  font-size: 0.8125rem;
  color: #4b5563;
  line-height: 1.6;
}

.practice-card__list li {
  margin-bottom: 6px;
}

.practice-card__list li:last-child {
  margin-bottom: 0;
}
</style>
