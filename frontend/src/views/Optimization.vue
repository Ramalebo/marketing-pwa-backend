<template>
  <div class="optimization-page">
    <div class="clean-page-header mb-6">
      <h1 class="clean-page-header__title">Optimization Engine</h1>
      <p class="clean-page-header__subtitle">Self-optimizing marketing: get ad spec recommendations that follow industry best practices for the best results.</p>
    </div>

    <v-alert type="info" variant="tonal" class="mb-6" border="start" density="comfortable">
      <strong>From monitoring to self-optimizing.</strong> The platform advises on ad specifications (headline length, creative ratios, placement, CTA) so your campaigns align with what performs best on each channel. Use the advisor below or get recommendations when creating ads in Campaigns.
    </v-alert>

    <!-- Platform selector + recommendations -->
    <div class="app-card pa-6 mb-6">
      <h2 class="section-title mb-4">
        <v-icon color="primary" class="mr-2">mdi-auto-fix</v-icon>
        Ad Spec Advisor
      </h2>
      <p class="text-body-2 text-medium-emphasis mb-4">Select a platform to see recommended specs and tips that bring the best results.</p>
      <v-row>
        <v-col cols="12" md="4">
          <v-select
            v-model="selectedPlatform"
            :items="advisorPlatforms"
            label="Platform"
            variant="outlined"
            density="comfortable"
            hide-details="auto"
            @update:model-value="loadRecommendations"
          />
        </v-col>
      </v-row>

      <template v-if="recommendations && recommendations.found">
        <v-divider class="my-6" />
        <h3 class="text-subtitle-1 font-weight-bold mb-3">Recommended specs</h3>
        <v-row>
          <v-col cols="12" md="6">
            <div class="spec-block mb-4">
              <div class="spec-block__label">Headline</div>
              <div class="spec-block__value">
                Optimal: {{ recommendations.headline?.optimalMax != null ? recommendations.headline.optimalMax + ' chars' : 'N/A' }}
                <span v-if="recommendations.headline?.max"> · Max {{ recommendations.headline.max }}</span>
              </div>
              <p v-if="recommendations.headline?.tip" class="spec-block__tip">{{ recommendations.headline.tip }}</p>
            </div>
            <div class="spec-block mb-4">
              <div class="spec-block__label">Description / primary text</div>
              <div class="spec-block__value">
                Optimal: {{ recommendations.description?.optimalMax != null ? recommendations.description.optimalMax + ' chars' : 'N/A' }}
                <span v-if="recommendations.description?.max"> · Max {{ recommendations.description.max }}</span>
              </div>
              <p v-if="recommendations.description?.tip" class="spec-block__tip">{{ recommendations.description.tip }}</p>
            </div>
          </v-col>
          <v-col cols="12" md="6">
            <div class="spec-block mb-4">
              <div class="spec-block__label">Creative</div>
              <div class="spec-block__value">
                <span v-if="recommendations.creative?.aspectRatios?.length">{{ recommendations.creative.aspectRatios.join(', ') }}</span>
                <span v-else>—</span>
              </div>
              <p v-if="recommendations.creative?.tip" class="spec-block__tip">{{ recommendations.creative.tip }}</p>
            </div>
            <div class="spec-block mb-4">
              <div class="spec-block__label">Placement</div>
              <div class="spec-block__value">{{ (recommendations.placement?.preferred || []).join(', ') || '—' }}</div>
              <p v-if="recommendations.placement?.tip" class="spec-block__tip">{{ recommendations.placement.tip }}</p>
            </div>
            <div class="spec-block mb-4">
              <div class="spec-block__label">CTA</div>
              <div class="spec-block__value">{{ (recommendations.cta?.highPerformers || []).join(', ') || '—' }}</div>
              <p v-if="recommendations.cta?.tip" class="spec-block__tip">{{ recommendations.cta.tip }}</p>
            </div>
          </v-col>
        </v-row>
        <div v-if="recommendations.tips?.length" class="mt-4 pt-4" style="border-top: 1px solid #e5e7eb;">
          <h4 class="text-caption font-weight-bold text-medium-emphasis mb-2">Quick tips</h4>
          <ul class="tips-list">
            <li v-for="(t, i) in recommendations.tips" :key="i">{{ t }}</li>
          </ul>
        </div>
      </template>
      <p v-else-if="recommendations && !recommendations.found" class="text-body-2 text-medium-emphasis mt-4">{{ recommendations.message }}</p>
    </div>

    <!-- Live advise: paste headline/description -->
    <div class="app-card pa-6 mb-6">
      <h2 class="section-title mb-4">
        <v-icon color="primary" class="mr-2">mdi-check-decagram</v-icon>
        Check your copy
      </h2>
      <p class="text-body-2 text-medium-emphasis mb-4">Enter your headline and description to see compliance and optimization hints for the selected platform.</p>
      <v-row>
        <v-col cols="12" md="4">
          <v-select
            v-model="advisePlatform"
            :items="advisorPlatforms"
            label="Platform"
            variant="outlined"
            density="comfortable"
            hide-details="auto"
          />
        </v-col>
      </v-row>
      <v-row class="mt-2">
        <v-col cols="12" md="6">
          <v-text-field
            v-model="adviseHeadline"
            label="Headline"
            variant="outlined"
            density="comfortable"
            hide-details="auto"
            placeholder="Paste or type headline"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-textarea
            v-model="adviseDescription"
            label="Description"
            variant="outlined"
            rows="2"
            hide-details="auto"
            placeholder="Paste or type description"
          />
        </v-col>
      </v-row>
      <v-btn color="primary" variant="elevated" class="mt-4" @click="runAdvise">Get advice</v-btn>

      <template v-if="adviceResult">
        <v-divider class="my-6" />
        <div v-for="c in adviceResult.compliance" :key="c.field + c.status" class="advice-row mb-3">
          <v-icon v-if="c.status === 'ok'" color="success" size="20" class="mr-2">mdi-check-circle</v-icon>
          <v-icon v-else color="error" size="20" class="mr-2">mdi-alert-circle</v-icon>
          <span>{{ c.field }}: {{ c.status === 'ok' ? c.current + ' / ' + c.max + ' chars' : c.message }}</span>
        </div>
        <div v-for="(o, i) in adviceResult.optimizations" :key="'opt-' + i" class="advice-row optimization-hint mb-3">
          <v-icon color="primary" size="20" class="mr-2">mdi-lightbulb-outline</v-icon>
          <span><strong>{{ o.field }}</strong>: {{ o.tip }} (current {{ o.current }} chars{{ o.optimalMax ? ', optimal ≤' + o.optimalMax : '' }})</span>
        </div>
        <p v-if="adviceResult.optimizations?.length === 0 && adviceResult.compliance?.length > 0 && !adviceResult.compliance.some(c => c.status === 'over')" class="text-success text-body-2 mt-3">Copy is within spec. Consider the recommended tips above for best performance.</p>
      </template>
    </div>

    <!-- Ecosystem blurb -->
    <div class="app-card pa-6">
      <h2 class="section-title mb-3">
        <v-icon color="primary" class="mr-2">mdi-chart-timeline-variant</v-icon>
        Self-optimizing ecosystem
      </h2>
      <p class="text-body-2 mb-3">Dominant Logic uses industry best practices to advise on ad specs across platforms. As you create and edit campaigns:</p>
      <ul class="eco-list mb-4">
        <li><strong>Campaigns</strong> — When you choose a platform, the Ad Spec Advisor shows recommended specs and checks your headline and description against optimal lengths.</li>
        <li><strong>Search Marketing</strong> — SEO checklist and meta guidance so clients rank first in search.</li>
        <li><strong>This page</strong> — Query recommendations by platform and validate copy before you publish.</li>
      </ul>
      <p class="text-body-2 text-medium-emphasis mb-0">The platform evolves from a monitoring tool into a marketing engine that steers you toward specs that bring the best results.</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Optimization',
  data() {
    return {
      advisorPlatforms: [],
      selectedPlatform: null,
      recommendations: null,
      advisePlatform: null,
      adviseHeadline: '',
      adviseDescription: '',
      adviceResult: null
    };
  },
  mounted() {
    this.loadPlatforms();
  },
  methods: {
    async loadPlatforms() {
      try {
        const { data } = await axios.get('/optimization/platforms');
        this.advisorPlatforms = data.platforms || [];
        if (this.advisorPlatforms.length && !this.selectedPlatform) {
          this.selectedPlatform = this.advisorPlatforms[0];
          this.advisePlatform = this.advisorPlatforms[0];
          this.loadRecommendations();
        }
      } catch (e) {
        console.error(e);
        this.advisorPlatforms = ['Meta Ads', 'Google Ads', 'TikTok Ads', 'LinkedIn Ads', 'YouTube Ads', 'Pinterest Ads', 'X (Twitter) Ads', 'Snapchat Ads', 'Reddit Ads', 'Telegram Ads'];
        this.selectedPlatform = this.advisorPlatforms[0];
        this.advisePlatform = this.advisorPlatforms[0];
        this.loadRecommendations();
      }
    },
    async loadRecommendations() {
      if (!this.selectedPlatform) return;
      try {
        const { data } = await axios.get('/optimization/recommendations', {
          params: { platform: this.selectedPlatform }
        });
        this.recommendations = data;
      } catch (e) {
        console.error(e);
        this.recommendations = { found: false, message: 'Could not load recommendations.' };
      }
    },
    async runAdvise() {
      if (!this.advisePlatform) return;
      this.adviceResult = null;
      try {
        const { data } = await axios.post('/optimization/advise', {
          platform: this.advisePlatform,
          headline: this.adviseHeadline || undefined,
          description: this.adviseDescription || undefined
        });
        this.adviceResult = data;
      } catch (e) {
        this.$store.dispatch('showSnackbar', { text: e.response?.data?.message || 'Advise request failed', color: 'error' });
      }
    }
  }
};
</script>

<style scoped>
.optimization-page { padding-bottom: 48px; }
.section-title { font-size: 1.125rem; font-weight: 600; color: #111827; display: flex; align-items: center; }
.spec-block__label { font-size: 0.75rem; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px; }
.spec-block__value { font-size: 0.9375rem; color: #111827; margin-bottom: 4px; }
.spec-block__tip { font-size: 0.8125rem; color: #6b7280; margin: 0; line-height: 1.5; }
.tips-list { margin: 0; padding-left: 20px; font-size: 0.875rem; color: #4b5563; line-height: 1.7; }
.advice-row { display: flex; align-items: flex-start; }
.optimization-hint { color: #374151; font-size: 0.875rem; }
.eco-list { padding-left: 20px; font-size: 0.9375rem; color: #4b5563; line-height: 1.7; }
.eco-list li { margin-bottom: 8px; }
</style>
