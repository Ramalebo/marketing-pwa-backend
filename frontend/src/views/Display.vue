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
      </v-tabs>
      <v-btn
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

    <!-- Campaign / location cards -->
    <v-row class="cards-row">
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
    <v-dialog v-model="addDialog" max-width="600" persistent scrollable>
      <v-card>
        <v-card-title class="d-flex align-center pa-4">
          <v-icon class="mr-2">mdi-map-marker-plus</v-icon>
          {{ editingId ? 'Edit location' : 'Add location' }}
          <v-spacer />
          <v-btn icon variant="text" @click="closeAddDialog"><v-icon>mdi-close</v-icon></v-btn>
        </v-card-title>
        <v-card-text class="pa-4 pt-0">
          <v-form ref="addForm" v-model="addFormValid">
            <v-select
              v-model="addForm.displayType"
              :items="displayTypeItems"
              item-title="title"
              item-value="value"
              label="Type"
              density="comfortable"
              variant="outlined"
              hide-details
              class="mb-3"
            />
            <v-text-field
              v-model="addForm.title"
              label="Title (e.g. Highway 101 - North)"
              required
              density="comfortable"
              variant="outlined"
              hide-details
              class="mb-3"
            />
            <v-text-field
              v-model="addForm.location"
              label="Location (e.g. San Francisco, CA)"
              density="comfortable"
              variant="outlined"
              hide-details
              class="mb-3"
            />
            <v-row dense>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="addForm.size"
                  label="Size (e.g. 14x48 ft)"
                  density="comfortable"
                  variant="outlined"
                  hide-details
                  class="mb-3"
                />
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="addForm.period"
                  label="Period (e.g. 3 months)"
                  density="comfortable"
                  variant="outlined"
                  hide-details
                  class="mb-3"
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
                  class="mb-3"
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
                  class="mb-3"
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
                  class="mb-3"
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
                  class="mb-3"
                />
              </v-col>
            </v-row>
            <v-text-field
              v-model="addForm.reach"
              label="Reach (optional, total)"
              type="number"
              min="0"
              density="comfortable"
              variant="outlined"
              hide-details
              class="mb-3"
            />
            <v-select
              v-model="addForm.status"
              :items="[{ title: 'Draft', value: 'draft' }, { title: 'Pending', value: 'pending' }, { title: 'Active', value: 'published' }]"
              item-title="title"
              item-value="value"
              label="Status"
              density="comfortable"
              variant="outlined"
              hide-details
              class="mb-3"
            />
            <v-textarea
              v-model="addForm.description"
              label="Description (optional)"
              rows="2"
              density="comfortable"
              variant="outlined"
              hide-details
            />
          </v-form>
        </v-card-text>
        <v-card-actions class="pa-4 pt-0">
          <v-spacer />
          <v-btn variant="text" @click="closeAddDialog">Cancel</v-btn>
          <v-btn color="primary" variant="elevated" :loading="addSaving" @click="saveAddForm">
            {{ editingId ? 'Save' : 'Add location' }}
          </v-btn>
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
      ]
    };
  },
  computed: {
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
  mounted() {
    this.loadItems();
  },
  methods: {
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
  flex: 1;
  min-width: 0;
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
</style>
