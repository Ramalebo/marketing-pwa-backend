<template>
  <div class="schedule-posts-container">
    <v-container fluid class="pa-6">
      <v-row class="page-header mb-6">
        <v-col cols="12">
          <div class="d-flex align-center justify-space-between flex-wrap ga-3">
            <div>
              <h1 class="page-title">Schedule Posts</h1>
              <p class="page-subtitle mb-0">
                Schedule campaigns to publish to social platforms at a specific date and time
              </p>
            </div>
            <div class="d-flex align-center ga-2">
              <v-btn
                color="primary"
                prepend-icon="mdi-clock-check"
                variant="tonal"
                size="default"
                :loading="processingDue"
                :disabled="processingDue"
                @click="processDue"
              >
                Run due now
              </v-btn>
              <v-btn
                color="primary"
                prepend-icon="mdi-plus"
                variant="elevated"
                size="default"
                @click="openScheduleDialog"
              >
                Schedule post
              </v-btn>
            </div>
          </div>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" md="3">
          <div class="card">
            <div class="card-header">
              <v-icon color="primary" size="20" class="mr-2">mdi-filter</v-icon>
              <span class="card-title">Status</span>
            </div>
            <div class="card-body pa-4">
              <v-select
                v-model="filterStatus"
                :items="statusOptions"
                item-title="title"
                item-value="value"
                label="Filter by status"
                clearable
                density="default"
                variant="outlined"
                hide-details="auto"
                class="app-select"
                @update:model-value="loadScheduled"
              ></v-select>
            </div>
          </div>
        </v-col>
        <v-col cols="12" md="9">
          <div class="card">
            <div class="card-header d-flex align-center">
              <v-icon color="primary" size="24" class="mr-3">mdi-calendar-clock</v-icon>
              <span class="card-title">Scheduled &amp; past</span>
              <v-spacer></v-spacer>
              <v-text-field
                v-model="searchQuery"
                prepend-inner-icon="mdi-magnify"
                label="Search..."
                variant="outlined"
                density="compact"
                hide-details
                clearable
                class="schedule-search"
                style="max-width: 280px;"
              ></v-text-field>
            </div>
            <div class="card-body pa-0">
              <v-data-table
                :headers="headers"
                :items="filteredPosts"
                :loading="loading"
                class="elevation-0 dra-data-table"
                :items-per-page="10"
                :items-per-page-options="[10, 25, 50]"
              >
                <template v-slot:item.adTitle="{ item }">
                  <span class="text-primary" style="font-weight: 500;">
                    {{ item.ad?.title || '—' }}
                  </span>
                </template>
                <template v-slot:item.platform="{ item }">
                  <v-chip
                    :color="getPlatformColor(item.platform)"
                    size="small"
                    variant="flat"
                    style="font-weight: 500;"
                  >
                    <v-icon start size="16">{{ getPlatformIcon(item.platform) }}</v-icon>
                    {{ item.platform }}
                  </v-chip>
                </template>
                <template v-slot:item.scheduledAt="{ item }">
                  <span style="font-size: 14px;">
                    {{ formatDateTime(item.scheduledAt) }}
                  </span>
                </template>
                <template v-slot:item.status="{ item }">
                  <v-chip
                    :color="getStatusColor(item.status)"
                    size="small"
                    variant="flat"
                    style="font-weight: 500; text-transform: capitalize;"
                  >
                    {{ item.status }}
                  </v-chip>
                </template>
                <template v-slot:item.actions="{ item }">
                  <div v-if="item.status === 'scheduled'" class="d-flex align-center ga-1">
                    <v-btn
                      icon="mdi-pencil"
                      size="small"
                      variant="text"
                      color="primary"
                      @click="openEditDialog(item)"
                      title="Reschedule"
                    ></v-btn>
                    <v-btn
                      icon="mdi-close-circle"
                      size="small"
                      variant="text"
                      color="error"
                      @click="cancelSchedule(item)"
                      title="Cancel"
                    ></v-btn>
                    <v-btn
                      icon="mdi-delete"
                      size="small"
                      variant="text"
                      color="grey"
                      @click="deleteSchedule(item)"
                      title="Delete"
                    ></v-btn>
                  </div>
                  <span v-else class="text-secondary" style="font-size: 12px;">—</span>
                </template>
                <template v-slot:no-data>
                  <div class="empty-state pa-8">
                    <v-icon size="48" color="grey-lighten-1" class="mb-3">mdi-calendar-blank</v-icon>
                    <p class="mb-0">No scheduled posts</p>
                    <p class="text-body-2 text-secondary mb-3">Schedule a campaign to publish later</p>
                    <v-btn color="primary" variant="elevated" prepend-icon="mdi-plus" @click="openScheduleDialog">Schedule post</v-btn>
                  </div>
                </template>
              </v-data-table>
            </div>
          </div>
        </v-col>
      </v-row>

      <!-- Schedule / Edit dialog -->
      <v-dialog v-model="scheduleDialog" max-width="520" persistent>
        <v-card>
          <v-card-title class="d-flex align-center pa-4" style="background: linear-gradient(135deg, #f9fafb 0%, #ffffff 100%); border-bottom: 1px solid #e5e7eb;">
            <v-icon class="mr-3" color="primary">mdi-calendar-plus</v-icon>
            <span>{{ editingItem ? 'Reschedule post' : 'Schedule post' }}</span>
          </v-card-title>
          <v-card-text class="pa-4">
            <v-form ref="scheduleFormRef" v-model="scheduleFormValid" class="form-dialog-fields">
              <v-select
                v-model="scheduleForm.adId"
                :items="ads"
                item-title="title"
                item-value="id"
                label="Campaign (Ad)"
                variant="outlined"
                density="default"
                hide-details="auto"
                class="app-select mb-4"
                :disabled="!!editingItem"
              ></v-select>
              <v-select
                v-model="scheduleForm.platforms"
                :items="platformOptions"
                item-title="title"
                item-value="value"
                label="Platforms"
                multiple
                chips
                variant="outlined"
                density="default"
                hide-details="auto"
                class="app-select mb-4"
                :disabled="!!editingItem"
              ></v-select>
              <v-text-field
                v-model="scheduleForm.scheduledAt"
                label="Date & time"
                type="datetime-local"
                variant="outlined"
                density="default"
                hide-details
                class="mb-4"
              ></v-text-field>
              <v-text-field
                v-model="scheduleForm.message"
                label="Message override (optional)"
                variant="outlined"
                density="default"
                hide-details
                class="mb-4"
                placeholder="Leave blank to use campaign description"
              ></v-text-field>
              <v-text-field
                v-if="scheduleForm.platforms && scheduleForm.platforms.includes('whatsapp')"
                v-model="scheduleForm.whatsappPhone"
                label="WhatsApp number"
                variant="outlined"
                density="default"
                hide-details
                placeholder="e.g. +27..."
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions class="pa-4" style="background: #f9fafb; border-top: 1px solid #e5e7eb;">
            <v-spacer></v-spacer>
            <v-btn variant="text" @click="closeScheduleDialog" style="font-weight: 500; text-transform: none;">Cancel</v-btn>
            <v-btn
              color="primary"
              variant="elevated"
              :loading="saving"
              :disabled="!scheduleFormValid || !scheduleForm.adId || !scheduleForm.platforms?.length || !scheduleForm.scheduledAt"
              @click="saveSchedule"
              style="font-weight: 600; text-transform: none; letter-spacing: 0.3px;"
            >
              Save
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'SchedulePosts',
  data() {
    return {
      loading: false,
      saving: false,
      processingDue: false,
      scheduledPosts: [],
      ads: [],
      filterStatus: null,
      searchQuery: '',
      scheduleDialog: false,
      scheduleFormValid: false,
      editingItem: null,
      scheduleForm: {
        adId: null,
        platforms: [],
        scheduledAt: '',
        message: '',
        whatsappPhone: ''
      },
      statusOptions: [
        { title: 'Scheduled', value: 'scheduled' },
        { title: 'Published', value: 'published' },
        { title: 'Cancelled', value: 'cancelled' },
        { title: 'Failed', value: 'failed' }
      ],
      platformOptions: [
        { title: 'Facebook', value: 'facebook' },
        { title: 'Instagram', value: 'instagram' },
        { title: 'WhatsApp', value: 'whatsapp' }
      ],
      headers: [
        { title: 'Campaign', key: 'adTitle', sortable: true },
        { title: 'Platform', key: 'platform', sortable: true },
        { title: 'Scheduled for', key: 'scheduledAt', sortable: true },
        { title: 'Status', key: 'status', sortable: true },
        { title: 'Actions', key: 'actions', sortable: false, width: '120' }
      ]
    };
  },
  computed: {
    filteredPosts() {
      let list = [...this.scheduledPosts];
      if (this.searchQuery) {
        const q = this.searchQuery.toLowerCase();
        list = list.filter(p => (p.ad?.title || '').toLowerCase().includes(q) || (p.platform || '').toLowerCase().includes(q));
      }
      return list;
    }
  },
  mounted() {
    this.loadScheduled();
    this.loadAds();
  },
  methods: {
    async loadScheduled() {
      this.loading = true;
      try {
        const params = {};
        if (this.filterStatus) params.status = this.filterStatus;
        const { data } = await axios.get('/scheduled-posts', { params });
        this.scheduledPosts = Array.isArray(data) ? data : [];
      } catch (e) {
        this.$store.dispatch('showSnackbar', { text: e.response?.data?.message || 'Failed to load scheduled posts', color: 'error' });
        this.scheduledPosts = [];
      } finally {
        this.loading = false;
      }
    },
    async loadAds() {
      try {
        const { data } = await axios.get('/ads');
        this.ads = Array.isArray(data) ? data : [];
      } catch {
        this.ads = [];
      }
    },
    openScheduleDialog() {
      this.editingItem = null;
      this.scheduleForm = {
        adId: null,
        platforms: [],
        scheduledAt: this.defaultDatetimeLocal(),
        message: '',
        whatsappPhone: ''
      };
      this.scheduleDialog = true;
    },
    openEditDialog(item) {
      this.editingItem = item;
      this.scheduleForm = {
        adId: item.adId,
        platforms: [item.platform],
        scheduledAt: this.toDatetimeLocal(item.scheduledAt),
        message: item.message || '',
        whatsappPhone: item.whatsappPhone || ''
      };
      this.scheduleDialog = true;
    },
    closeScheduleDialog() {
      this.scheduleDialog = false;
      this.editingItem = null;
    },
    defaultDatetimeLocal() {
      const d = new Date();
      d.setMinutes(d.getMinutes() + 30);
      d.setMinutes(Math.ceil(d.getMinutes() / 15) * 15);
      return this.toDatetimeLocal(d.toISOString());
    },
    toDatetimeLocal(iso) {
      if (!iso) return '';
      const d = new Date(iso);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const h = String(d.getHours()).padStart(2, '0');
      const min = String(d.getMinutes()).padStart(2, '0');
      return `${y}-${m}-${day}T${h}:${min}`;
    },
    async saveSchedule() {
      if (this.editingItem) {
        const at = new Date(this.scheduleForm.scheduledAt).toISOString();
        try {
          this.saving = true;
          await axios.patch(`/scheduled-posts/${this.editingItem.id}`, { scheduledAt: at });
          this.$store.dispatch('showSnackbar', { text: 'Rescheduled', color: 'success' });
          this.closeScheduleDialog();
          this.loadScheduled();
        } catch (e) {
          this.$store.dispatch('showSnackbar', { text: e.response?.data?.message || 'Update failed', color: 'error' });
        } finally {
          this.saving = false;
        }
        return;
      }
      const at = new Date(this.scheduleForm.scheduledAt).toISOString();
      if (new Date(at) <= new Date()) {
        this.$store.dispatch('showSnackbar', { text: 'Please choose a future date and time', color: 'error' });
        return;
      }
      try {
        this.saving = true;
        await axios.post('/scheduled-posts', {
          adId: this.scheduleForm.adId,
          platforms: this.scheduleForm.platforms,
          scheduledAt: at,
          message: this.scheduleForm.message || undefined,
          whatsappPhone: this.scheduleForm.platforms?.includes('whatsapp') ? this.scheduleForm.whatsappPhone : undefined
        });
        this.$store.dispatch('showSnackbar', { text: 'Post(s) scheduled', color: 'success' });
        this.closeScheduleDialog();
        this.loadScheduled();
      } catch (e) {
        this.$store.dispatch('showSnackbar', { text: e.response?.data?.message || 'Schedule failed', color: 'error' });
      } finally {
        this.saving = false;
      }
    },
    async cancelSchedule(item) {
      if (!confirm('Cancel this scheduled post? It will not be published.')) return;
      try {
        await axios.patch(`/scheduled-posts/${item.id}`, { status: 'cancelled' });
        this.$store.dispatch('showSnackbar', { text: 'Cancelled', color: 'success' });
        this.loadScheduled();
      } catch (e) {
        this.$store.dispatch('showSnackbar', { text: e.response?.data?.message || 'Cancel failed', color: 'error' });
      }
    },
    async deleteSchedule(item) {
      if (!confirm('Delete this scheduled post?')) return;
      try {
        await axios.delete(`/scheduled-posts/${item.id}`);
        this.$store.dispatch('showSnackbar', { text: 'Deleted', color: 'success' });
        this.loadScheduled();
      } catch (e) {
        this.$store.dispatch('showSnackbar', { text: e.response?.data?.message || 'Delete failed', color: 'error' });
      }
    },
    async processDue() {
      this.processingDue = true;
      try {
        const { data } = await axios.post('/scheduled-posts/process-due');
        const ok = (data.results || []).filter(r => r.success).length;
        this.$store.dispatch('showSnackbar', { text: `Processed ${data.processed || 0} (${ok} published)`, color: ok ? 'success' : 'info' });
        this.loadScheduled();
      } catch (e) {
        this.$store.dispatch('showSnackbar', { text: e.response?.data?.message || 'Process failed', color: 'error' });
      } finally {
        this.processingDue = false;
      }
    },
    formatDateTime(val) {
      if (!val) return '—';
      return new Date(val).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
    },
    getPlatformIcon(platform) {
      const icons = { facebook: 'mdi-facebook', instagram: 'mdi-instagram', whatsapp: 'mdi-whatsapp' };
      return icons[platform] || 'mdi-share-variant';
    },
    getPlatformColor(platform) {
      const colors = { facebook: 'blue', instagram: 'pink', whatsapp: 'green' };
      return colors[platform] || 'grey';
    },
    getStatusColor(status) {
      const colors = { scheduled: 'primary', published: 'success', cancelled: 'grey', failed: 'error' };
      return colors[status] || 'grey';
    }
  }
};
</script>

<style scoped>
.schedule-posts-container {
  min-height: 100%;
}
.schedule-search {
  max-width: 300px;
}
.empty-state {
  text-align: center;
  padding: 48px 24px;
}
</style>
