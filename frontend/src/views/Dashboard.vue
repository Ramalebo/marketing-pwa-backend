<template>
  <div class="dashboard-page">
    <!-- KPI Cards -->
    <v-row class="kpi-row">
      <v-col cols="12" sm="6" md="3">
        <div class="kpi-card">
          <div class="kpi-icon kpi-icon-reach">
            <v-icon color="white" size="22">mdi-account-group</v-icon>
          </div>
          <div class="kpi-content">
            <div class="kpi-value">2.8M</div>
            <div class="kpi-change positive">+12.5% from last month</div>
            <div class="kpi-label">Total Reach</div>
          </div>
        </div>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <div class="kpi-card">
          <div class="kpi-icon kpi-icon-engagement">
            <v-icon color="white" size="22">mdi-heart-outline</v-icon>
          </div>
          <div class="kpi-content">
            <div class="kpi-value">5.8%</div>
            <div class="kpi-change positive">+0.3% from last month</div>
            <div class="kpi-label">Engagement Rate</div>
          </div>
        </div>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <div class="kpi-card">
          <div class="kpi-icon kpi-icon-conversion">
            <v-icon color="white" size="22">mdi-cart-outline</v-icon>
          </div>
          <div class="kpi-content">
            <div class="kpi-value">0.2%</div>
            <div class="kpi-change negative">-0.2% from last month</div>
            <div class="kpi-label">Conversion Rate</div>
          </div>
        </div>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <div class="kpi-card">
          <div class="kpi-icon kpi-icon-spend">
            <v-icon color="white" size="22">mdi-currency-usd</v-icon>
          </div>
          <div class="kpi-content">
            <div class="kpi-value">R42,850</div>
            <div class="kpi-change positive">+8.2% from last month</div>
            <div class="kpi-label">Ad Spend</div>
          </div>
        </div>
      </v-col>
    </v-row>

    <!-- Charts row -->
    <v-row class="charts-row">
      <v-col cols="12" md="7">
        <div class="app-card chart-card">
          <div class="chart-header">
            <h3 class="chart-title">Performance Overview</h3>
            <v-select
              v-model="performanceRange"
              :items="['Last 7 days', 'Last 30 days', 'Last 90 days']"
              density="compact"
              hide-details
              variant="outlined"
              class="chart-select"
            />
          </div>
          <div class="chart-wrap">
            <Line v-if="lineData" :data="lineData" :options="lineOptions" />
          </div>
        </div>
      </v-col>
      <v-col cols="12" md="5">
        <div class="app-card chart-card">
          <h3 class="chart-title">Channel Distribution</h3>
          <div class="chart-wrap chart-wrap-doughnut">
            <Doughnut v-if="doughnutData" :data="doughnutData" :options="doughnutOptions" />
          </div>
        </div>
      </v-col>
    </v-row>

    <v-row class="dashboard-grid">
      <!-- Left: Active Campaigns -->
      <v-col cols="12" md="7" lg="6">
        <div class="app-section">
          <div class="section-header">
            <h2 class="app-section-title mb-0">Active Campaigns</h2>
            <router-link :to="{ name: 'Ads' }" class="section-link">View All</router-link>
          </div>
          <div class="app-card">
            <table class="dashboard-table">
              <thead>
                <tr>
                  <th>Campaign</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="campaign in activeCampaigns" :key="campaign.id">
                  <td>
                    <div class="table-campaign-title">{{ campaign.title }}</div>
                    <div class="table-campaign-desc">{{ campaign.description || 'No description' }}</div>
                  </td>
                  <td>
                    <span class="status-chip">Active</span>
                  </td>
                </tr>
                <tr v-if="activeCampaigns.length === 0">
                  <td colspan="2" class="table-empty">No active campaigns yet. Create one from Campaigns.</td>
                </tr>
              </tbody>
            </table>
            <div v-if="activeCampaigns.length > 0" class="table-footer">Page 1 of {{ totalCampaignPages }}</div>
          </div>
        </div>
      </v-col>

      <!-- Right: Channel Performance (card layout to match design) -->
      <v-col cols="12" md="5" lg="6">
        <div class="app-section">
          <h2 class="app-section-title">Channel Performance</h2>
          <div class="channel-performance-cards">
            <div
              v-for="(channel, idx) in channelPerformance"
              :key="channel.name"
              class="channel-perf-card"
            >
              <div class="channel-perf-icon" :style="{ background: channel.iconBg }">
                <v-icon :color="channel.iconColor" size="24">{{ channel.icon }}</v-icon>
              </div>
              <div class="channel-perf-body">
                <div class="channel-perf-value">{{ channel.value }}</div>
                <span class="channel-perf-change">+{{ channel.change }}</span>
                <div class="channel-perf-desc">{{ channel.description }}</div>
              </div>
            </div>
          </div>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import axios from 'axios';
import { Line, Doughnut } from 'vue-chartjs';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Filler,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Filler, Tooltip, Legend);

const PAGE_SIZE = 5;

export default {
  name: 'Dashboard',
  components: { Line, Doughnut },
  data() {
    return {
      performanceRange: 'Last 30 days',
      activeCampaigns: [],
      totalCampaignPages: 1,
      channelPerformance: [
        { name: 'Social Media', value: '1200K', change: '12.5%', description: 'Facebook, Instagram, Twitter', icon: 'mdi-share-variant', iconBg: '#E3F2FD', iconColor: '#2196F3' },
        { name: 'Email Marketing', value: '850K', change: '8.3%', description: 'Newsletter, Campaigns', icon: 'mdi-email', iconBg: '#E8F5E9', iconColor: '#4CAF50' },
        { name: 'Display Ads', value: '650K', change: '15.2%', description: 'Banner, Native', icon: 'mdi-monitor', iconBg: '#F3E5F5', iconColor: '#9C27B0' }
      ],
      lineData: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        datasets: [
          {
            label: 'Reach',
            data: [550000, 650000, 800000, 980000],
            borderColor: '#2196F3',
            backgroundColor: 'rgba(33, 150, 243, 0.1)',
            fill: true,
            tension: 0.3
          },
          {
            label: 'Engagement',
            data: [15000, 18000, 22000, 25000],
            borderColor: '#4CAF50',
            backgroundColor: 'rgba(76, 175, 80, 0.1)',
            fill: true,
            tension: 0.3
          }
        ]
      },
      lineOptions: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom' }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback(value) {
                if (value >= 1000000) return (value / 1000000) + 'M';
                if (value >= 1000) return (value / 1000) + 'K';
                return value;
              }
            }
          }
        }
      },
      doughnutData: {
        labels: ['Social Media', 'Email', 'Display', 'Search'],
        datasets: [{
          data: [42, 30, 23, 5],
          backgroundColor: ['#2196F3', '#4CAF50', '#9C27B0', '#FF9800'],
          borderWidth: 0
        }]
      },
      doughnutOptions: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom' }
        },
        cutout: '60%'
      }
    };
  },
  async mounted() {
    await this.loadCampaigns();
    this.updateChannelFromData();
  },
  methods: {
    async loadCampaigns() {
      try {
        const res = await axios.get('/ads');
        const all = res.data || [];
        const active = all.filter(a => ['published', 'approved', 'pending', 'draft'].includes(a.status)).slice(0, PAGE_SIZE);
        this.activeCampaigns = active.map(a => ({
          id: a.id,
          title: a.title,
          description: (a.description || '').slice(0, 60)
        }));
        this.totalCampaignPages = Math.max(1, Math.ceil(all.length / PAGE_SIZE));
      } catch (e) {
        console.error('Error loading campaigns:', e);
      }
    },
    updateChannelFromData() {
      try {
        axios.get('/clients').then(({ data: clients }) => {
          const k = (clients.length * 1000) / 1000;
          const val = k >= 1000 ? (k / 1000).toFixed(1) + 'K' : k;
          if (this.channelPerformance[0]) this.channelPerformance[0].value = (Number.parseFloat(val) || 0) + 'K';
        }).catch(() => {});
      } catch (_) {}
    }
  }
};
</script>

<style scoped>
.dashboard-page {
  max-width: 1280px;
  margin: 0 auto;
}

.dashboard-grid {
  margin: 0 -12px;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.section-link {
  font-size: 14px;
  font-weight: 600;
  color: #2196F3;
  text-decoration: none;
  transition: color 0.15s ease;
}

.section-link:hover {
  color: #1976D2;
}

.dashboard-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.dashboard-table th {
  text-align: left;
  padding: 14px 20px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.5px;
  color: var(--text-secondary);
  text-transform: uppercase;
  background: #f9fafb;
  border-bottom: 1px solid var(--border-color, #DBDDDC);
}

.dashboard-table td {
  padding: 16px 20px;
  border-bottom: 1px solid #f3f4f6;
  vertical-align: top;
}

.dashboard-table tbody tr:hover td {
  background: #E3F2FD;
}

.dashboard-table tbody tr:last-child td {
  border-bottom: none;
}

.table-campaign-title {
  font-weight: 600;
  color: var(--text-primary, #1a1a1a);
  margin-bottom: 2px;
}

.table-campaign-desc {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.4;
}

.status-chip {
  display: inline-block;
  padding: 5px 12px;
  font-size: 12px;
  font-weight: 600;
  color: #1976D2;
  background: #E3F2FD;
  border-radius: 6px;
}

/* KPI cards - match reference */
.kpi-row {
  margin-bottom: 24px;
}

.kpi-card {
  background: #fff;
  border-radius: 8px;
  border: 1px solid #DBDDDC;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);
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

.kpi-icon-reach { background: #BBDEFB; }
.kpi-icon-engagement { background: #C8E6C9; }
.kpi-icon-conversion { background: #FFE0B2; }
.kpi-icon-spend { background: #FFCDD2; }

.kpi-content { min-width: 0; }

.kpi-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 4px;
}

.kpi-change {
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 2px;
}

.kpi-change.positive { color: #4CAF50; }
.kpi-change.negative { color: #f44336; }

.kpi-label {
  font-size: 12px;
  color: #69737B;
}

/* Charts */
.charts-row { margin-bottom: 24px; }

.chart-card {
  padding: 20px 24px;
  min-height: 320px;
}

.chart-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.chart-title {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 16px 0;
}

.chart-header .chart-title { margin-bottom: 0; }

.chart-select {
  max-width: 140px;
}

.chart-wrap {
  height: 260px;
  position: relative;
}

.chart-wrap-doughnut {
  height: 240px;
}

.table-empty {
  text-align: center;
  padding: 48px 20px !important;
  color: var(--text-secondary);
  font-size: 14px;
}

.table-footer {
  padding: 12px 20px;
  font-size: 12px;
  color: var(--text-muted, #9ca3af);
  text-align: right;
  border-top: 1px solid var(--border-color, #DBDDDC);
  background: #fafafa;
}

/* Channel Performance – card layout (Social Media, Email, Display) */
.channel-performance-cards {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.channel-perf-card {
  display: flex;
  align-items: center;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  border: 1px solid #DBDDDC;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);
  transition: box-shadow 0.2s ease;
}

.channel-perf-card:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}

.channel-perf-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-right: 16px;
}

.channel-perf-body {
  min-width: 0;
}

.channel-perf-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 2px;
}

.channel-perf-change {
  font-size: 13px;
  font-weight: 600;
  color: #2E7D32;
  margin-right: 6px;
}

.channel-perf-desc {
  font-size: 13px;
  color: #69737B;
  margin-top: 4px;
}
</style>
