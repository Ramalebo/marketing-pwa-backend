<template>
  <div class="display-page">
    <div class="display-header">
      <div>
        <h1 class="display-title">Outdoor Advertising</h1>
        <p class="display-subtitle">Manage billboards, digital screens, and outdoor campaigns</p>
      </div>
      <v-btn color="primary" variant="elevated" prepend-icon="mdi-plus" @click="openAddDialog">
        Book Location
      </v-btn>
    </div>

    <!-- KPI cards -->
    <v-row class="kpi-row">
      <v-col cols="12" sm="6" md="3">
        <div class="kpi-card">
          <div class="kpi-icon kpi-icon-locations">
            <v-icon color="white" size="22">mdi-monitor-dashboard</v-icon>
          </div>
          <div class="kpi-content">
            <div class="kpi-value">{{ kpis.activeLocations }}</div>
            <div class="kpi-label">Active Locations</div>
          </div>
        </div>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <div class="kpi-card">
          <div class="kpi-icon kpi-icon-impressions">
            <v-icon color="white" size="22">mdi-eye</v-icon>
          </div>
          <div class="kpi-content">
            <div class="kpi-value">{{ kpis.dailyImpressions }}</div>
            <div class="kpi-label">Daily Impressions</div>
          </div>
        </div>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <div class="kpi-card">
          <div class="kpi-icon kpi-icon-spend">
            <v-icon color="white" size="22">mdi-currency-usd</v-icon>
          </div>
          <div class="kpi-content">
            <div class="kpi-value">{{ kpis.monthlySpend }}</div>
            <div class="kpi-label">Monthly Spend</div>
          </div>
        </div>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <div class="kpi-card">
          <div class="kpi-icon kpi-icon-pins">
            <v-icon color="white" size="22">mdi-map-marker</v-icon>
          </div>
          <div class="kpi-content">
            <div class="kpi-value">{{ kpis.locations }}</div>
            <div class="kpi-label">Locations</div>
          </div>
        </div>
      </v-col>
    </v-row>

    <!-- Tabs + Add per type -->
    <div class="tabs-row">
      <v-tabs v-model="activeTab" class="display-tabs" bg-color="transparent">
        <v-tab value="billboards">Billboards</v-tab>
        <v-tab value="digital">Digital Screens</v-tab>
        <v-tab value="delivery">Delivery Box Ads</v-tab>
        <v-tab value="taxi">Taxi/Car Ads</v-tab>
        <v-tab value="available">Available Locations</v-tab>
        <v-tab value="tracking">Tracking</v-tab>
      </v-tabs>
      <v-btn
        v-if="activeTab !== 'tracking'"
        color="primary"
        variant="tonal"
        size="small"
        :prepend-icon="'mdi-plus'"
        @click="openAddDialog"
        class="add-tab-btn"
      >
        Add {{ addButtonLabel }}
      </v-btn>
    </div>

    <!-- Tracking: Live Map + Impressions -->
    <template v-if="activeTab === 'tracking'">
      <v-row class="tracking-row">
        <v-col cols="12">
          <v-card class="tracking-map-card" elevation="0">
            <div class="tracking-map-header">
              <h2 class="tracking-map-title">
                <v-icon color="primary" size="24" class="mr-2">mdi-map-marker-path</v-icon>
                Live Fleet &amp; Impression Tracking
              </h2>
              <div class="d-flex align-center">
                <v-checkbox
                  v-model="showHeatmap"
                  label="Show impression heatmap"
                  density="compact"
                  hide-details
                  color="primary"
                  class="mr-4"
                />
                <v-btn variant="tonal" size="small" color="primary" @click="loadTrackingData" :loading="trackingLoading">
                  <v-icon size="18" class="mr-1">mdi-refresh</v-icon>
                  Refresh
                </v-btn>
              </div>
            </div>
            <div class="tracking-map-wrap map-grid">
              <svg class="tracking-map-svg" viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice">
                <defs>
                  <radialGradient id="heatGradient">
                    <stop offset="0%" stop-color="#ef4444" stop-opacity="0.6" />
                    <stop offset="100%" stop-color="#ef4444" stop-opacity="0" />
                  </radialGradient>
                </defs>
                <!-- Heatmap zones (billboard/digital high-traffic areas) -->
                <g v-if="showHeatmap" opacity="0.35">
                  <circle cx="200" cy="180" r="70" fill="url(#heatGradient)" />
                  <circle cx="580" cy="320" r="90" fill="url(#heatGradient)" />
                  <circle cx="400" cy="260" r="55" fill="url(#heatGradient)" />
                </g>
                <!-- Vehicle markers -->
                <g v-for="v in trackingVehicles" :key="v.id" class="vehicle-marker">
                  <circle
                    :cx="vehicleX(v)"
                    :cy="vehicleY(v)"
                    r="14"
                    fill="#2196F3"
                    stroke="white"
                    stroke-width="2"
                    class="vehicle-dot"
                  />
                  <text
                    :x="vehicleX(v) + 18"
                    :y="vehicleY(v) + 5"
                    font-size="12"
                    fill="#374151"
                    font-weight="600"
                  >
                    {{ v.name }}
                  </text>
                </g>
              </svg>
            </div>
            <div class="tracking-map-legend">
              <span><span class="legend-dot legend-dot-vehicle"></span> Fleet (taxi/delivery)</span>
              <span><span class="legend-dot legend-dot-heat"></span> High traffic (impressions)</span>
            </div>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="7">
          <v-card class="app-card impression-tracking-card" elevation="0">
            <h3 class="card-heading mb-4">
              <v-icon color="primary" size="22" class="mr-2">mdi-eye</v-icon>
              Billboard &amp; Digital Screen Impressions
            </h3>
            <v-table density="comfortable" class="impression-table">
              <thead>
                <tr>
                  <th>Location</th>
                  <th>Type</th>
                  <th>Est. / day</th>
                  <th>Recorded today</th>
                  <th>Total recorded</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in trackingImpressions" :key="row.adId">
                  <td>{{ row.title }}</td>
                  <td><v-chip size="small" variant="flat" color="grey-lighten-2">{{ row.displayType }}</v-chip></td>
                  <td>{{ formatImpNum(row.impressionsPerDay) }}</td>
                  <td>{{ formatImpNum(row.recordedToday) }}</td>
                  <td>{{ formatImpNum(row.recordedTotal) }}</td>
                  <td>
                    <v-btn variant="text" size="small" color="primary" @click="recordImpression(row)">
                      + Record
                    </v-btn>
                  </td>
                </tr>
                <tr v-if="trackingImpressions.length === 0 && !trackingLoading">
                  <td colspan="6" class="text-center text-medium-emphasis py-6">No billboards or digital screens yet. Add locations in Billboards or Digital Screens tabs.</td>
                </tr>
              </tbody>
            </v-table>
          </v-card>
        </v-col>
        <v-col cols="12" md="5">
          <v-card class="app-card calculator-card" elevation="0">
            <h3 class="card-heading mb-4">
              <v-icon color="primary" size="22" class="mr-2">mdi-calculator</v-icon>
              Impression Calculator
            </h3>
            <div class="calculator-form">
              <v-select
                v-model="calcMethod"
                :items="calcMethodItems"
                item-title="label"
                item-value="value"
                label="Method"
                density="default"
                variant="outlined"
                hide-details="auto"
                class="app-select mb-3"
              />
              <v-text-field
                v-model.number="calcArea"
                label="Surface area (sq ft)"
                type="number"
                min="0"
                density="compact"
                variant="outlined"
                hide-details
                class="mb-3"
              />
              <v-text-field
                v-if="calcMethod === 'time'"
                v-model.number="calcHours"
                label="Daily hours lit"
                type="number"
                min="0"
                max="24"
                density="compact"
                variant="outlined"
                hide-details
                class="mb-3"
              />
              <v-select
                v-if="calcMethod === 'weather'"
                v-model="calcWeather"
                :items="[{ title: 'Sunny', value: 'sunny' }, { title: 'Cloudy', value: 'cloudy' }, { title: 'Rainy', value: 'rainy' }]"
                item-title="title"
                item-value="value"
                label="Weather"
                density="default"
                variant="outlined"
                hide-details="auto"
                class="app-select mb-3"
              />
            </div>
            <div class="calculator-result">
              <div class="calculator-result-label">Estimated impressions</div>
              <div class="calculator-result-value">{{ calculatedImpressions.toLocaleString() }}</div>
              <div class="calculator-result-meta">Based on {{ calcMethod }} model</div>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </template>

    <!-- Campaign / location cards -->
    <v-row v-else class="cards-row">
      <v-col v-for="item in filteredItems" :key="item.id" cols="12" md="6" lg="4">
        <v-card class="location-card" elevation="0">
          <div class="card-image-wrap">
            <v-img
              v-if="cardImage(item)"
              :src="cardImage(item)"
              cover
              height="180"
              class="card-image"
            />
            <div v-else class="card-image card-image-placeholder">
              <v-icon size="64" color="grey-lighten-1">mdi-image-area</v-icon>
            </div>
            <v-chip
              class="card-status"
              :color="item.status === 'published' || item.status === 'active' ? 'primary' : 'grey'"
              size="small"
              variant="flat"
            >
              {{ item.status === 'published' ? 'active' : (item.status || 'pending') }}
            </v-chip>
          </div>
          <v-card-title class="card-title">{{ item.title }}</v-card-title>
          <v-card-subtitle v-if="item.location" class="card-location">
            <v-icon size="16" class="mr-1">mdi-map-marker</v-icon>
            {{ item.location }}
          </v-card-subtitle>
          <v-card-text class="card-details">
            <v-row dense>
              <v-col v-if="item.size" cols="6">
                <span class="detail-label">Size</span>
                <div class="detail-value">{{ item.size }}</div>
              </v-col>
              <v-col cols="6">
                <span class="detail-label">Cost</span>
                <div class="detail-value">{{ formatCost(item.spend) }}</div>
              </v-col>
              <v-col cols="6">
                <span class="detail-label">Impressions</span>
                <div class="detail-value">{{ formatImpressions(item) }}</div>
              </v-col>
              <v-col v-if="item.period" cols="6">
                <span class="detail-label">Period</span>
                <div class="detail-value">{{ item.period }}</div>
              </v-col>
            </v-row>
            <div v-if="item.startDate || item.endDate" class="card-daterange">
              <span>{{ formatDate(item.startDate) }}</span>
              <v-icon size="14" class="mx-1">mdi-arrow-right</v-icon>
              <span>{{ formatDate(item.endDate) }}</span>
            </div>
          </v-card-text>
          <v-card-actions class="card-actions">
            <v-btn variant="text" size="small" color="primary" @click="openAddDialog(item)">Edit</v-btn>
            <v-spacer />
            <v-btn icon variant="text" size="small" color="error" @click="deleteItem(item)">
              <v-icon size="18">mdi-delete-outline</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-row v-if="filteredItems.length === 0 && !loading">
      <v-col cols="12">
        <v-card class="empty-state" elevation="0">
          <v-icon size="64" color="grey-lighten-1" class="mb-3">mdi-billboard</v-icon>
          <div class="text-h6 mb-2">No outdoor campaigns yet</div>
          <p class="text-body-2 text-medium-emphasis mb-4">Add a location with the button above—choose the tab (Billboards, Digital Screens, etc.) then click "Add" or "Book Location".</p>
          <v-btn color="primary" variant="elevated" prepend-icon="mdi-plus" @click="openAddDialog">Add location</v-btn>
        </v-card>
      </v-col>
    </v-row>

    <!-- Add / Edit location dialog -->
    <v-dialog v-model="addDialog" max-width="600" persistent scrollable content-class="add-location-dialog">
      <v-card class="add-location-card">
        <v-card-title class="add-location-title d-flex align-center">
          <v-icon class="mr-2">mdi-map-marker-plus</v-icon>
          {{ editingId ? 'Edit location' : 'Add location' }}
          <v-spacer />
          <v-btn icon variant="text" @click="closeAddDialog"><v-icon>mdi-close</v-icon></v-btn>
        </v-card-title>
        <v-divider />
        <v-card-text class="add-location-body">
          <v-form ref="addForm" v-model="addFormValid">
            <v-select
              v-model="addForm.displayType"
              :items="displayTypeItems"
              item-title="title"
              item-value="value"
              label="Display type"
              placeholder="Select type"
              density="default"
              variant="outlined"
              hide-details="auto"
              class="app-select add-location-field mb-4"
            />
            <v-text-field
              v-model="addForm.title"
              label="Title"
              placeholder="e.g. Highway 101 - North"
              required
              density="comfortable"
              variant="outlined"
              hide-details
              class="add-location-field mb-4"
            />
            <v-text-field
              v-model="addForm.location"
              label="Location"
              placeholder="e.g. San Francisco, CA"
              density="comfortable"
              variant="outlined"
              hide-details
              class="add-location-field mb-4"
            />
            <v-row dense>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="addForm.size"
                  label="Size"
                  placeholder="e.g. 14x48 ft"
                  density="comfortable"
                  variant="outlined"
                  hide-details
                  class="add-location-field mb-4"
                />
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="addForm.period"
                  label="Period"
                  placeholder="e.g. 3 months"
                  density="comfortable"
                  variant="outlined"
                  hide-details
                  class="add-location-field mb-4"
                />
              </v-col>
            </v-row>
            <v-row dense>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model.number="addForm.impressionsPerDay"
                  label="Impressions per day"
                  type="number"
                  min="0"
                  density="comfortable"
                  variant="outlined"
                  hide-details
                  class="add-location-field mb-4"
                  placeholder="125000"
                />
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model.number="addForm.spend"
                  label="Cost per month ($)"
                  type="number"
                  min="0"
                  step="0.01"
                  density="comfortable"
                  variant="outlined"
                  hide-details
                  class="add-location-field mb-4"
                  placeholder="8500"
                />
              </v-col>
            </v-row>
            <v-row dense>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="addForm.startDate"
                  label="Start date"
                  type="date"
                  density="comfortable"
                  variant="outlined"
                  hide-details
                  class="add-location-field mb-4"
                />
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="addForm.endDate"
                  label="End date"
                  type="date"
                  density="comfortable"
                  variant="outlined"
                  hide-details
                  class="add-location-field mb-4"
                />
              </v-col>
            </v-row>
            <v-text-field
              v-model="addForm.reach"
              label="Reach (optional)"
              type="number"
              min="0"
              density="comfortable"
              variant="outlined"
              hide-details
              class="add-location-field mb-4"
            />
            <v-select
              v-model="addForm.status"
              :items="[{ title: 'Draft', value: 'draft' }, { title: 'Pending', value: 'pending' }, { title: 'Active', value: 'published' }]"
              item-title="title"
              item-value="value"
              label="Status"
              density="default"
              variant="outlined"
              hide-details="auto"
              class="app-select add-location-field mb-4"
            />
            <v-textarea
              v-model="addForm.description"
              label="Description (optional)"
              placeholder="Notes about this location"
              rows="2"
              density="comfortable"
              variant="outlined"
              hide-details
              class="add-location-field"
            />
          </v-form>
        </v-card-text>
        <v-divider />
        <v-card-actions class="add-location-actions">
          <v-spacer />
          <v-btn variant="text" @click="closeAddDialog" style="font-weight: 500; text-transform: none;">Cancel</v-btn>
          <v-btn color="primary" variant="elevated" :loading="addSaving" @click="saveAddForm" style="font-weight: 600; text-transform: none; letter-spacing: 0.3px;">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import axios from 'axios';

const TAB_TO_DISPLAY_TYPE = {
  billboards: 'billboard',
  digital: 'digital',
  delivery: 'delivery',
  taxi: 'taxi',
  available: null
};

const DISPLAY_TYPE_LABELS = {
  billboard: 'Billboard',
  digital: 'Digital Screen',
  delivery: 'Delivery Box Ad',
  taxi: 'Taxi/Car Ad'
};

export default {
  name: 'Display',
  data() {
    return {
      activeTab: 'billboards',
      items: [],
      loading: false,
      addDialog: false,
      addFormValid: false,
      addSaving: false,
      editingId: null,
      addForm: {
        displayType: 'billboard',
        title: '',
        location: '',
        size: '',
        period: '',
        impressionsPerDay: null,
        spend: null,
        startDate: null,
        endDate: null,
        reach: null,
        status: 'draft',
        description: ''
      },
      displayTypeItems: [
        { title: 'Billboards', value: 'billboard' },
        { title: 'Digital Screens', value: 'digital' },
        { title: 'Delivery Box Ads', value: 'delivery' },
        { title: 'Taxi/Car Ads', value: 'taxi' }
      ],
      // Tracking tab
      trackingVehicles: [],
      trackingImpressions: [],
      showHeatmap: true,
      trackingLoading: false,
      // Calculator
      calcMethod: 'basic',
      calcArea: 100,
      calcHours: 12,
      calcWeather: 'sunny'
    };
  },
  computed: {
    calcMethodItems() {
      return [
        { label: 'Basic (area)', value: 'basic' },
        { label: 'Time (hours lit)', value: 'time' },
        { label: 'Weather adjusted', value: 'weather' }
      ];
    },
    calculatedImpressions() {
      let base = (this.calcArea || 0) * 100;
      if (this.calcMethod === 'time') base = base * ((this.calcHours || 0) / 24);
      if (this.calcMethod === 'weather') {
        const f = this.calcWeather === 'sunny' ? 1.2 : this.calcWeather === 'rainy' ? 0.8 : 1;
        base = base * f;
      }
      return Math.max(0, Math.floor(base));
    },
    addButtonLabel() {
      const t = TAB_TO_DISPLAY_TYPE[this.activeTab];
      return t ? DISPLAY_TYPE_LABELS[t] || 'Location' : 'Location';
    },
    kpis() {
      const active = this.items.filter(a => ['published', 'approved', 'pending'].includes(a.status));
      const totalReach = active.reduce((acc, a) => acc + (Number(a.reach) || 0), 0);
      const totalImpressionsPerDay = active.reduce((acc, a) => acc + (Number(a.impressionsPerDay) || 0), 0);
      const totalSpend = active.reduce((acc, a) => acc + (Number(a.spend) || 0), 0);
      const locations = new Set(active.map(a => (a.location || '').trim()).filter(Boolean)).size;
      return {
        activeLocations: active.length,
        dailyImpressions: totalImpressionsPerDay >= 1000000 ? (totalImpressionsPerDay / 1000000).toFixed(1) + 'M' : (totalImpressionsPerDay >= 1000 ? (totalImpressionsPerDay / 1000) + 'K' : String(totalImpressionsPerDay)),
        monthlySpend: totalSpend >= 1000 ? '$' + (totalSpend / 1000).toFixed(1) + 'K' : '$' + Math.round(totalSpend),
        locations: locations || active.length
      };
    },
    filteredItems() {
      const displayType = TAB_TO_DISPLAY_TYPE[this.activeTab];
      if (this.activeTab === 'available') {
        return this.items.filter(a => a.status === 'draft' || a.status === 'pending');
      }
      if (displayType) {
        return this.items.filter(a => (a.displayType || 'billboard') === displayType);
      }
      return this.items;
    }
  },
  watch: {
    activeTab(tab) {
      if (tab === 'tracking') this.loadTrackingData();
    }
  },
  mounted() {
    this.loadItems();
    if (this.activeTab === 'tracking') this.loadTrackingData();
  },
  methods: {
    async loadTrackingData() {
      this.trackingLoading = true;
      try {
        await Promise.all([this.loadTrackingVehicles(), this.loadTrackingImpressions()]);
      } finally {
        this.trackingLoading = false;
      }
    },
    async loadTrackingVehicles() {
      try {
        const { data } = await axios.get('/display/vehicles');
        this.trackingVehicles = data || [];
      } catch (e) {
        console.error('Load fleet:', e);
        this.trackingVehicles = [];
      }
    },
    async loadTrackingImpressions() {
      try {
        const { data } = await axios.get('/display/impressions');
        this.trackingImpressions = data || [];
      } catch (e) {
        console.error('Load impressions:', e);
        this.trackingImpressions = [];
      }
    },
    vehicleX(v) {
      const baseLng = 28.0473;
      const lng = v.lng != null ? v.lng : baseLng;
      return 100 + ((lng - baseLng) * 800);
    },
    vehicleY(v) {
      const baseLat = -26.2041;
      const lat = v.lat != null ? v.lat : baseLat;
      return 250 - ((lat - baseLat) * 600);
    },
    formatImpNum(n) {
      if (n == null || n === '') return '—';
      const num = Number(n);
      if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
      if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
      return String(num);
    },
    async recordImpression(row) {
      try {
        await axios.post('/display/impressions', { adId: row.adId, count: 1 });
        this.$store.dispatch('showSnackbar', { text: 'Impression recorded', color: 'success' });
        await this.loadTrackingImpressions();
      } catch (e) {
        this.$store.dispatch('showSnackbar', { text: e.response?.data?.message || 'Failed to record', color: 'error' });
      }
    },
    cardImage(item) {
      const images = item.content?.images || [];
      const first = images[0];
      if (typeof first === 'string') return first;
      if (first?.url) return first.url;
      return null;
    },
    formatCost(spend) {
      const n = Number(spend) || 0;
      return '$' + (n >= 1000 ? (n / 1000).toFixed(1) + 'K' : Math.round(n)) + '/month';
    },
    formatImpressions(item) {
      const perDay = item.impressionsPerDay != null ? Number(item.impressionsPerDay) : null;
      if (perDay != null) return (perDay >= 1000 ? (perDay / 1000) + 'K' : perDay) + '/day';
      const reach = Number(item.reach) || 0;
      if (reach) return (reach >= 1000 ? (reach / 1000) + 'K' : reach) + '/day';
      return '—';
    },
    formatDate(d) {
      if (!d) return '—';
      try {
        const dt = new Date(d);
        return dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      } catch (_) {
        return d;
      }
    },
    async loadItems() {
      this.loading = true;
      try {
        const { data } = await axios.get('/ads', { params: { channel: 'display' } });
        this.items = data || [];
      } catch (e) {
        console.error('Error loading display ads:', e);
        this.items = [];
      } finally {
        this.loading = false;
      }
    },
    openAddDialog(item = null) {
      this.editingId = item ? item.id : null;
      if (item) {
        this.addForm = {
          displayType: item.displayType || 'billboard',
          title: item.title || '',
          location: item.location || '',
          size: item.size || '',
          period: item.period || '',
          impressionsPerDay: item.impressionsPerDay != null ? Number(item.impressionsPerDay) : null,
          spend: item.spend != null ? Number(item.spend) : null,
          startDate: item.startDate || null,
          endDate: item.endDate || null,
          reach: item.reach != null ? Number(item.reach) : null,
          status: item.status || 'draft',
          description: item.description || ''
        };
      } else {
        const displayType = TAB_TO_DISPLAY_TYPE[this.activeTab] || 'billboard';
        this.addForm = {
          displayType,
          title: '',
          location: '',
          size: '',
          period: '',
          impressionsPerDay: null,
          spend: null,
          startDate: null,
          endDate: null,
          reach: null,
          status: 'draft',
          description: ''
        };
      }
      this.addDialog = true;
    },
    closeAddDialog() {
      this.addDialog = false;
      this.editingId = null;
    },
    async saveAddForm() {
      if (!this.addForm.title || !this.addForm.title.trim()) {
        this.$store.dispatch('showSnackbar', { text: 'Please enter a title', color: 'error' });
        return;
      }
      this.addSaving = true;
      try {
        const payload = {
          channel: 'display',
          displayType: this.addForm.displayType || 'billboard',
          title: this.addForm.title.trim(),
          location: this.addForm.location ? this.addForm.location.trim() : null,
          size: this.addForm.size ? this.addForm.size.trim() : null,
          period: this.addForm.period ? this.addForm.period.trim() : null,
          impressionsPerDay: this.addForm.impressionsPerDay != null ? Number(this.addForm.impressionsPerDay) : null,
          spend: this.addForm.spend != null ? Number(this.addForm.spend) : null,
          startDate: this.addForm.startDate || null,
          endDate: this.addForm.endDate || null,
          reach: this.addForm.reach != null ? Number(this.addForm.reach) : null,
          status: this.addForm.status || 'draft',
          description: this.addForm.description ? this.addForm.description.trim() : null,
          type: 'image',
          content: { images: [], videos: [], text: '' }
        };
        if (this.editingId) {
          await axios.put(`/ads/${this.editingId}`, payload);
          this.$store.dispatch('showSnackbar', { text: 'Location updated', color: 'success' });
        } else {
          await axios.post('/ads', payload);
          this.$store.dispatch('showSnackbar', { text: 'Location added', color: 'success' });
        }
        this.closeAddDialog();
        await this.loadItems();
      } catch (e) {
        this.$store.dispatch('showSnackbar', {
          text: e.response?.data?.message || 'Failed to save',
          color: 'error'
        });
      } finally {
        this.addSaving = false;
      }
    },
    deleteItem(item) {
      if (!confirm(`Delete "${item.title}"?`)) return;
      axios.delete(`/ads/${item.id}`).then(() => this.loadItems()).catch(e => {
        this.$store.dispatch('showSnackbar', { text: e.response?.data?.message || 'Delete failed', color: 'error' });
      });
    }
  }
};
</script>

<style scoped>
.display-page {
  max-width: 1280px;
  margin: 0 auto;
}

.display-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 24px;
}

.display-header > div {
  min-width: 0;
}

.display-header .v-btn {
  flex-shrink: 0;
}

.display-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 4px 0;
}

.display-subtitle {
  font-size: 0.9375rem;
  color: #6b7280;
  margin: 0;
}

.kpi-row { margin-bottom: 24px; }

.kpi-card {
  background: #fff;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  padding: 20px;
  display: flex;
  align-items: flex-start;
  gap: 16px;
  transition: box-shadow 0.2s ease;
}

.kpi-card:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}

.kpi-icon {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.kpi-icon-locations { background: #dbeafe; }
.kpi-icon-impressions { background: #d1fae5; }
.kpi-icon-spend { background: #ede9fe; }
.kpi-icon-pins { background: #fed7aa; }

.kpi-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 2px;
}

.kpi-label {
  font-size: 12px;
  color: #6b7280;
}

.tabs-row {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 24px;
}

.display-tabs {
  flex: 1 1 200px;
  min-width: 0;
  overflow: hidden;
}

.display-tabs :deep(.v-tabs) {
  min-width: 0;
}

.display-tabs :deep(.v-tabs__container),
.display-tabs :deep(.v-tabs__wrapper) {
  overflow-x: auto;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;
}

.display-tabs :deep(.v-tab) {
  font-weight: 500;
  text-transform: none;
}

.add-tab-btn {
  flex-shrink: 0;
}

.cards-row { margin-top: 0; }

.location-card {
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.card-image-wrap {
  position: relative;
  height: 180px;
  background: #f3f4f6;
}

.card-image { width: 100%; height: 100%; object-fit: cover; }

.card-image-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-status {
  position: absolute;
  top: 12px;
  right: 12px;
  text-transform: capitalize;
}

.card-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1a1a1a;
  padding: 16px 16px 0;
}

.card-location {
  padding: 4px 16px 8px;
  font-size: 13px;
  color: #6b7280;
  display: flex;
  align-items: center;
}

.card-details {
  padding: 12px 16px;
  flex: 1;
}

.detail-label {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #9ca3af;
  display: block;
  margin-bottom: 2px;
}

.detail-value {
  font-size: 14px;
  font-weight: 600;
  color: #1a1a1a;
}

.card-daterange {
  font-size: 12px;
  color: #6b7280;
  margin-top: 12px;
  display: flex;
  align-items: center;
}

.card-actions {
  padding: 8px 16px 16px;
  border-top: 1px solid #f3f4f6;
}

.empty-state {
  text-align: center;
  padding: 48px 24px;
  border: 1px dashed #e5e7eb;
  border-radius: 12px;
}

/* Add location dialog: prevent overlap, clear spacing */
.add-location-card {
  position: relative;
  z-index: 1;
  overflow: visible;
}

.add-location-title {
  padding: 20px 24px !important;
  font-size: 1.125rem;
  font-weight: 600;
}

.add-location-body {
  padding: 24px !important;
  max-height: min(70vh, 520px);
  overflow-y: auto;
}

.add-location-body .add-location-field {
  min-height: 56px;
}

.add-location-actions {
  padding: 16px 24px !important;
}

/* Ensure dialog overlay stacks above page content */
:deep(.add-location-dialog) {
  z-index: 2400;
}

:deep(.add-location-dialog .v-overlay__content) {
  align-items: center;
  justify-content: center;
}

/* Tracking tab */
.tracking-row {
  margin-bottom: 24px;
}

.tracking-map-card {
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  overflow: hidden;
}

.tracking-map-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  padding: 16px 20px;
  border-bottom: 1px solid #e5e7eb;
  background: #fafafa;
}

.tracking-map-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
  display: flex;
  align-items: center;
}

.tracking-map-wrap {
  position: relative;
  height: 420px;
  background: #f3f4f6;
}

.map-grid {
  background-image: linear-gradient(#e5e7eb 1px, transparent 1px),
    linear-gradient(90deg, #e5e7eb 1px, transparent 1px);
  background-size: 40px 40px;
}

.tracking-map-svg {
  width: 100%;
  height: 100%;
  display: block;
}

.vehicle-marker {
  cursor: pointer;
}

.vehicle-dot {
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
}

.tracking-map-legend {
  padding: 12px 20px;
  font-size: 12px;
  color: #6b7280;
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
  border-top: 1px solid #e5e7eb;
  background: #fff;
}

.legend-dot {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 6px;
  vertical-align: middle;
}

.legend-dot-vehicle {
  background: #2196F3;
  border: 1px solid #fff;
  box-shadow: 0 1px 2px rgba(0,0,0,0.2);
}

.legend-dot-heat {
  background: #ef4444;
  opacity: 0.6;
}

.impression-tracking-card,
.calculator-card {
  padding: 20px 24px;
}

.card-heading {
  font-size: 1rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
  display: flex;
  align-items: center;
}

.impression-table {
  font-size: 14px;
}

.impression-table th {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #6b7280;
}

.calculator-result {
  margin-top: 20px;
  padding: 20px;
  background: #1a1a1a;
  border-radius: 8px;
  color: #fff;
  text-align: center;
}

.calculator-result-label {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #9ca3af;
  margin-bottom: 4px;
}

.calculator-result-value {
  font-size: 2rem;
  font-weight: 700;
  color: #fff;
}

.calculator-result-meta {
  font-size: 12px;
  color: #9ca3af;
  margin-top: 4px;
}
</style>
