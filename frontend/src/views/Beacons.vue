<template>
  <div class="beacons-page">
    <div class="beacons-header">
      <div>
        <h1 class="beacons-title">Bluetooth Beacons</h1>
        <p class="beacons-subtitle">Proximity marketing: prompt customers with ads when they're in fenced locations</p>
      </div>
      <v-btn color="primary" variant="elevated" prepend-icon="mdi-bluetooth" @click="openDialog()">
        Add Beacon
      </v-btn>
    </div>

    <v-row class="kpi-row">
      <v-col cols="12" sm="6" md="3">
        <div class="kpi-card">
          <div class="kpi-icon kpi-icon-beacons">
            <v-icon color="white" size="22">mdi-bluetooth</v-icon>
          </div>
          <div class="kpi-content">
            <div class="kpi-value">{{ beacons.length }}</div>
            <div class="kpi-label">Total Beacons</div>
          </div>
        </div>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <div class="kpi-card">
          <div class="kpi-icon kpi-icon-active">
            <v-icon color="white" size="22">mdi-check-circle</v-icon>
          </div>
          <div class="kpi-content">
            <div class="kpi-value">{{ activeCount }}</div>
            <div class="kpi-label">Active</div>
          </div>
        </div>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <div class="kpi-card">
          <div class="kpi-icon kpi-icon-impressions">
            <v-icon color="white" size="22">mdi-eye</v-icon>
          </div>
          <div class="kpi-content">
            <div class="kpi-value">{{ totalImpressions }}</div>
            <div class="kpi-label">Impressions</div>
          </div>
        </div>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <div class="kpi-card">
          <div class="kpi-icon kpi-icon-areas">
            <v-icon color="white" size="22">mdi-map-marker-multiple</v-icon>
          </div>
          <div class="kpi-content">
            <div class="kpi-value">{{ areas.length }}</div>
            <div class="kpi-label">Areas</div>
          </div>
        </div>
      </v-col>
    </v-row>

    <v-tabs v-model="activeTab" class="beacons-tabs" bg-color="transparent">
      <v-tab value="list">Beacons</v-tab>
      <v-tab value="performance">Performance</v-tab>
    </v-tabs>

    <!-- Beacons list -->
    <template v-if="activeTab === 'list'">
      <v-card class="beacons-card" elevation="0">
        <div class="card-toolbar">
          <v-select
            v-model="filterArea"
            :items="areaOptions"
            item-title="label"
            item-value="value"
            label="Area"
            density="compact"
            variant="outlined"
            hide-details
            clearable
            class="filter-select"
            style="max-width: 200px;"
          />
          <v-btn variant="tonal" size="small" color="primary" @click="loadBeacons" :loading="loading">
            <v-icon size="18" class="mr-1">mdi-refresh</v-icon>
            Refresh
          </v-btn>
        </div>
        <v-table class="beacons-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>UUID / Major.Minor</th>
              <th>Location / Area</th>
              <th>Assigned Ad</th>
              <th>Status</th>
              <th width="120">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="b in filteredBeacons" :key="b.id">
              <td>
                <span class="font-weight-medium">{{ b.name }}</span>
              </td>
              <td>
                <code class="beacon-id">{{ b.uuid }} {{ b.major }}.{{ b.minor }}</code>
              </td>
              <td>
                <span v-if="b.locationName">{{ b.locationName }}</span>
                <span v-if="b.area" class="text-medium-emphasis ml-1">({{ b.area }})</span>
                <span v-if="!b.locationName && !b.area">—</span>
              </td>
              <td>
                <span v-if="b.ad">{{ b.ad.title }}</span>
                <span v-else class="text-medium-emphasis">—</span>
              </td>
              <td>
                <v-chip :color="b.status === 'active' ? 'success' : b.status === 'maintenance' ? 'warning' : 'grey'" size="small" variant="flat">
                  {{ b.status }}
                </v-chip>
              </td>
              <td>
                <v-btn icon variant="text" size="small" @click="openDialog(b)" title="Edit">
                  <v-icon size="18">mdi-pencil</v-icon>
                </v-btn>
                <v-btn icon variant="text" size="small" color="error" @click="confirmDelete(b)" title="Delete">
                  <v-icon size="18">mdi-delete-outline</v-icon>
                </v-btn>
              </td>
            </tr>
          </tbody>
        </v-table>
        <div v-if="filteredBeacons.length === 0 && !loading" class="empty-state pa-8 text-center">
          <v-icon size="48" color="grey-lighten-1" class="mb-2">mdi-bluetooth</v-icon>
          <p class="text-body-2 text-medium-emphasis">No beacons yet. Add one to start proximity marketing.</p>
          <v-btn color="primary" variant="elevated" prepend-icon="mdi-plus" @click="openDialog()" class="mt-2">Add Beacon</v-btn>
        </div>
      </v-card>
    </template>

    <!-- Performance -->
    <template v-if="activeTab === 'performance'">
      <v-card class="beacons-card" elevation="0">
        <div class="card-toolbar">
          <v-select
            v-model="perfArea"
            :items="areaOptions"
            item-title="label"
            item-value="value"
            label="Area"
            density="compact"
            variant="outlined"
            hide-details
            clearable
            class="filter-select"
            style="max-width: 200px;"
          />
          <v-btn variant="tonal" size="small" color="primary" @click="loadPerformance" :loading="perfLoading">
            <v-icon size="18" class="mr-1">mdi-refresh</v-icon>
            Refresh
          </v-btn>
        </div>
        <h3 class="section-title">By area</h3>
        <v-table class="beacons-table mb-6">
          <thead>
            <tr>
              <th>Area</th>
              <th>Beacons</th>
              <th>Impressions</th>
              <th>Enters</th>
              <th>Clicks</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in performance.byArea" :key="row.area">
              <td>{{ row.area }}</td>
              <td>{{ row.beacons }}</td>
              <td>{{ row.impressions }}</td>
              <td>{{ row.enters }}</td>
              <td>{{ row.clicks }}</td>
            </tr>
          </tbody>
        </v-table>
        <h3 class="section-title">By beacon</h3>
        <v-table class="beacons-table">
          <thead>
            <tr>
              <th>Beacon</th>
              <th>Area</th>
              <th>Impressions</th>
              <th>Enters</th>
              <th>Exits</th>
              <th>Clicks</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in performance.byBeacon" :key="row.beaconId">
              <td>{{ row.name }}</td>
              <td>{{ row.area || '—' }}</td>
              <td>{{ row.impressions }}</td>
              <td>{{ row.enters }}</td>
              <td>{{ row.exits }}</td>
              <td>{{ row.clicks }}</td>
              <td>
                <v-chip :color="row.status === 'active' ? 'success' : 'grey'" size="small" variant="flat">{{ row.status }}</v-chip>
              </td>
            </tr>
          </tbody>
        </v-table>
        <div v-if="performance.byBeacon.length === 0 && !perfLoading" class="empty-state pa-8 text-center">
          <p class="text-body-2 text-medium-emphasis">No performance data. Events are recorded when the client app reports enter/impression/click.</p>
        </div>
      </v-card>
    </template>

    <!-- Add/Edit dialog -->
    <v-dialog v-model="dialog" max-width="560" persistent>
      <v-card>
        <v-card-title class="d-flex align-center">
          <v-icon class="mr-2">mdi-bluetooth</v-icon>
          {{ editingBeacon ? 'Edit beacon' : 'Add beacon' }}
          <v-spacer />
          <v-btn icon variant="text" @click="closeDialog"><v-icon>mdi-close</v-icon></v-btn>
        </v-card-title>
        <v-divider />
        <v-card-text>
          <v-form ref="formRef" v-model="formValid">
            <v-text-field
              v-model="form.name"
              label="Name"
              placeholder="e.g. Mall North Entrance"
              variant="outlined"
              density="comfortable"
              hide-details
              class="mb-3"
            />
            <v-text-field
              v-model="form.uuid"
              label="UUID (iBeacon)"
              placeholder="e.g. 3ce2ef69-4414-469d-9d55-3ec7fcc38520"
              variant="outlined"
              density="comfortable"
              hide-details
              class="mb-3"
            />
            <v-row dense>
              <v-col cols="6">
                <v-text-field
                  v-model.number="form.major"
                  label="Major (0–65535)"
                  type="number"
                  min="0"
                  max="65535"
                  variant="outlined"
                  density="comfortable"
                  hide-details
                  class="mb-3"
                />
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model.number="form.minor"
                  label="Minor (0–65535)"
                  type="number"
                  min="0"
                  max="65535"
                  variant="outlined"
                  density="comfortable"
                  hide-details
                  class="mb-3"
                />
              </v-col>
            </v-row>
            <v-text-field
              v-model="form.locationName"
              label="Location name"
              placeholder="e.g. Sandton City"
              variant="outlined"
              density="comfortable"
              hide-details
              class="mb-3"
            />
            <v-text-field
              v-model="form.area"
              label="Area (for grouping)"
              placeholder="e.g. Mall North, Airport"
              variant="outlined"
              density="comfortable"
              hide-details
              class="mb-3"
            />
            <v-row dense>
              <v-col cols="6">
                <v-text-field
                  v-model="form.lat"
                  label="Latitude"
                  type="number"
                  step="any"
                  variant="outlined"
                  density="comfortable"
                  hide-details
                  class="mb-3"
                />
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="form.lng"
                  label="Longitude"
                  type="number"
                  step="any"
                  variant="outlined"
                  density="comfortable"
                  hide-details
                  class="mb-3"
                />
              </v-col>
            </v-row>
            <v-select
              v-model="form.adId"
              :items="publishedAds"
              item-title="title"
              item-value="id"
              label="Assigned ad (shown when user is near)"
              variant="outlined"
              density="comfortable"
              hide-details
              clearable
              class="mb-3"
            />
            <v-select
              v-model="form.status"
              :items="[{ title: 'Active', value: 'active' }, { title: 'Inactive', value: 'inactive' }, { title: 'Maintenance', value: 'maintenance' }]"
              item-title="title"
              item-value="value"
              label="Status"
              variant="outlined"
              density="comfortable"
              hide-details
              class="mb-3"
            />
          </v-form>
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="closeDialog">Cancel</v-btn>
          <v-btn color="primary" variant="elevated" :loading="saving" @click="saveBeacon">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="deleteDialog" max-width="400" persistent>
      <v-card>
        <v-card-title>Delete beacon?</v-card-title>
        <v-card-text>This will remove the beacon and its event history. This cannot be undone.</v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="deleteDialog = false">Cancel</v-btn>
          <v-btn color="error" variant="elevated" :loading="deleting" @click="deleteBeacon">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Beacons',
  data() {
    return {
      activeTab: 'list',
      beacons: [],
      areas: [],
      loading: false,
      filterArea: null,
      dialog: false,
      formValid: false,
      form: {
        name: '',
        uuid: '',
        major: 0,
        minor: 0,
        locationName: '',
        area: '',
        lat: null,
        lng: null,
        status: 'active',
        adId: null
      },
      editingBeacon: null,
      saving: false,
      deleteDialog: false,
      beaconToDelete: null,
      deleting: false,
      ads: [],
      performance: { byBeacon: [], byArea: [] },
      perfLoading: false,
      perfArea: null
    };
  },
  computed: {
    areaOptions() {
      const list = (this.areas || []).map(a => ({ label: a, value: a }));
      return [{ label: 'All areas', value: null }, ...list];
    },
    filteredBeacons() {
      if (!this.filterArea) return this.beacons;
      return this.beacons.filter(b => b.area === this.filterArea);
    },
    activeCount() {
      return (this.beacons || []).filter(b => b.status === 'active').length;
    },
    totalImpressions() {
      return (this.performance.byBeacon || []).reduce((s, r) => s + (r.impressions || 0), 0);
    },
    publishedAds() {
      return (this.ads || []).filter(a => a.status === 'published').map(a => ({ ...a, id: a.id || a._id }));
    }
  },
  watch: {
    activeTab(t) {
      if (t === 'performance') this.loadPerformance();
    }
  },
  mounted() {
    this.loadBeacons();
    this.loadAreas();
    this.loadAds();
    this.loadPerformance();
  },
  methods: {
    async loadBeacons() {
      this.loading = true;
      try {
        const params = {};
        if (this.filterArea) params.area = this.filterArea;
        const { data } = await axios.get('/beacons', { params });
        this.beacons = Array.isArray(data) ? data : [];
      } catch (e) {
        console.error('Load beacons:', e);
        this.beacons = [];
      } finally {
        this.loading = false;
      }
    },
    async loadAreas() {
      try {
        const { data } = await axios.get('/beacons/areas');
        this.areas = Array.isArray(data) ? data : [];
      } catch (e) {
        this.areas = [];
      }
    },
    async loadAds() {
      try {
        const { data } = await axios.get('/ads');
        this.ads = Array.isArray(data) ? data : [];
      } catch (e) {
        this.ads = [];
      }
    },
    async loadPerformance() {
      this.perfLoading = true;
      try {
        const params = {};
        if (this.perfArea) params.area = this.perfArea;
        const { data } = await axios.get('/beacons/performance', { params });
        this.performance = {
          byBeacon: (data && data.byBeacon) ? data.byBeacon : [],
          byArea: (data && data.byArea) ? data.byArea : []
        };
      } catch (e) {
        console.error('Load performance:', e);
        this.performance = { byBeacon: [], byArea: [] };
      } finally {
        this.perfLoading = false;
      }
    },
    openDialog(beacon = null) {
      this.editingBeacon = beacon;
      if (beacon) {
        this.form = {
          name: beacon.name,
          uuid: beacon.uuid,
          major: beacon.major ?? 0,
          minor: beacon.minor ?? 0,
          locationName: beacon.locationName || '',
          area: beacon.area || '',
          lat: beacon.lat != null ? beacon.lat : null,
          lng: beacon.lng != null ? beacon.lng : null,
          status: beacon.status || 'active',
          adId: beacon.adId != null ? beacon.adId : null
        };
      } else {
        this.form = {
          name: '',
          uuid: '',
          major: 0,
          minor: 0,
          locationName: '',
          area: '',
          lat: null,
          lng: null,
          status: 'active',
          adId: null
        };
      }
      this.dialog = true;
    },
    closeDialog() {
      this.dialog = false;
      this.editingBeacon = null;
    },
    async saveBeacon() {
      if (!this.form.name || !this.form.uuid) {
        this.$store.dispatch('showSnackbar', { text: 'Name and UUID are required', color: 'warning' });
        return;
      }
      this.saving = true;
      try {
        if (this.editingBeacon) {
          await axios.put(`/beacons/${this.editingBeacon.id}`, this.form);
          this.$store.dispatch('showSnackbar', { text: 'Beacon updated', color: 'success' });
        } else {
          await axios.post('/beacons', this.form);
          this.$store.dispatch('showSnackbar', { text: 'Beacon created', color: 'success' });
        }
        this.closeDialog();
        this.loadBeacons();
        this.loadAreas();
        this.loadPerformance();
      } catch (e) {
        this.$store.dispatch('showSnackbar', { text: e.response?.data?.message || 'Failed to save beacon', color: 'error' });
      } finally {
        this.saving = false;
      }
    },
    confirmDelete(b) {
      this.beaconToDelete = b;
      this.deleteDialog = true;
    },
    async deleteBeacon() {
      if (!this.beaconToDelete) return;
      this.deleting = true;
      try {
        await axios.delete(`/beacons/${this.beaconToDelete.id}`);
        this.$store.dispatch('showSnackbar', { text: 'Beacon deleted', color: 'success' });
        this.deleteDialog = false;
        this.beaconToDelete = null;
        this.loadBeacons();
        this.loadAreas();
        this.loadPerformance();
      } catch (e) {
        this.$store.dispatch('showSnackbar', { text: e.response?.data?.message || 'Failed to delete', color: 'error' });
      } finally {
        this.deleting = false;
      }
    }
  }
};
</script>

<style scoped>
.beacons-page { padding: 0 4px; }
.beacons-header { display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 16px; margin-bottom: 24px; }
.beacons-title { font-size: 1.5rem; font-weight: 700; color: var(--text-primary, #1a1a1a); margin: 0 0 4px 0; }
.beacons-subtitle { font-size: 14px; color: var(--text-secondary); margin: 0; }
.kpi-row { margin-bottom: 24px; }
.kpi-card { display: flex; align-items: center; gap: 16px; padding: 20px; border-radius: 12px; background: var(--light-bg, #fff); border: 1px solid var(--border-color, #e5e7eb); }
.kpi-icon { width: 48px; height: 48px; border-radius: 10px; display: flex; align-items: center; justify-content: center; }
.kpi-icon-beacons { background: #6366f1; }
.kpi-icon-active { background: #10b981; }
.kpi-icon-impressions { background: #3b82f6; }
.kpi-icon-areas { background: #8b5cf6; }
.kpi-content { flex: 1; min-width: 0; }
.kpi-value { font-size: 1.5rem; font-weight: 700; color: var(--text-primary, #1a1a1a); }
.kpi-label { font-size: 13px; color: var(--text-secondary); margin-top: 2px; }
.beacons-tabs { margin-bottom: 16px; }
.beacons-card { border: 1px solid var(--border-color, #e5e7eb); border-radius: 12px; padding: 20px; }
.card-toolbar { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
.beacons-table { width: 100%; }
.beacons-table th { font-weight: 600; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; color: var(--text-secondary); }
.beacon-id { font-size: 12px; background: #f3f4f6; padding: 2px 6px; border-radius: 4px; }
.section-title { font-size: 1rem; font-weight: 600; margin: 0 0 12px 0; color: var(--text-primary, #1a1a1a); }
</style>
