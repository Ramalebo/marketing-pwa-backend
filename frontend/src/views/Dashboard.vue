<template>
  <div class="dashboard-page">
    <!-- KPI Cards (from API) -->
    <v-row class="kpi-row">
      <v-col cols="12" sm="6" md="3">
        <div class="kpi-card">
          <div class="kpi-icon kpi-icon-reach">
            <v-icon color="white" size="22">mdi-account-group</v-icon>
          </div>
          <div class="kpi-content">
            <div class="kpi-value">{{ kpis.totalReach }}</div>
            <div class="kpi-change" :class="parseFloat(kpis.totalReachChange) >= 0 ? 'positive' : 'negative'">{{ formatChange(kpis.totalReachChange) }} from last period</div>
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
            <div class="kpi-value">{{ kpis.engagementRate }}</div>
            <div class="kpi-change" :class="parseFloat(kpis.engagementChange) >= 0 ? 'positive' : 'negative'">{{ formatChange(kpis.engagementChange) }} from last period</div>
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
            <div class="kpi-value">{{ kpis.conversionRate }}</div>
            <div class="kpi-change" :class="parseFloat(kpis.conversionChange) >= 0 ? 'positive' : 'negative'">{{ formatChange(kpis.conversionChange) }} from last period</div>
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
            <div class="kpi-value">{{ kpis.totalSpend }}</div>
            <div class="kpi-change" :class="parseFloat(kpis.totalSpendChange) >= 0 ? 'positive' : 'negative'">{{ formatChange(kpis.totalSpendChange) }} from last period</div>
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
                  <th>Reach</th>
                  <th>Engagement</th>
                  <th>Spend</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(campaign, idx) in activeCampaigns" :key="campaign.id">
                  <td>
                    <div class="table-campaign-row">
                      <v-icon size="20" :color="idx === 0 ? 'primary' : 'secondary'" class="table-campaign-icon">
                        {{ campaign.icon || (idx === 0 ? 'mdi-rocket-launch' : 'mdi-star') }}
                      </v-icon>
                      <div>
                        <div class="table-campaign-title">{{ campaign.title }}</div>
                        <div class="table-campaign-desc">{{ campaign.description || 'No description' }}</div>
                      </div>
                    </div>
                  </td>
                  <td><span class="status-chip">Active</span></td>
                  <td class="table-metric">{{ campaign.reach }}</td>
                  <td class="table-metric">{{ campaign.engagement }}</td>
                  <td class="table-metric">{{ campaign.spend }}</td>
                </tr>
                <tr v-if="activeCampaigns.length === 0">
                  <td colspan="5" class="table-empty">No active campaigns yet. Create one from Campaigns.</td>
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
                <span class="channel-perf-change">{{ formatChange(channel.change) }}</span>
                <div class="channel-perf-desc">{{ channel.description }}</div>
              </div>
            </div>
          </div>
        </div>
      </v-col>
    </v-row>

    <!-- AI Insights + Quick Actions row -->
    <v-row class="insights-row">
      <v-col cols="12" md="7">
        <div class="app-card ai-insights-card">
          <h3 class="card-heading">
            <v-icon color="primary" size="22" class="mr-2">mdi-lightbulb-outline</v-icon>
            AI Insights
          </h3>
          <div class="ai-insight budget-allocation">
            <v-icon size="20" color="warning" class="mr-2">mdi-alert</v-icon>
            <span><strong>{{ aiInsight.type }}.</strong> {{ aiInsight.message }}</span>
          </div>
        </div>
      </v-col>
      <v-col cols="12" md="5">
        <div class="app-card quick-actions-card">
          <h3 class="card-heading">Quick Actions</h3>
          <div class="quick-actions-grid">
            <router-link :to="{ name: 'Ads' }" class="quick-action-btn">
              <v-icon size="24" color="primary">mdi-plus</v-icon>
              <span>Create Campaign</span>
            </router-link>
            <button type="button" class="quick-action-btn" @click="duplicateBestCampaign">
              <v-icon size="24" color="success">mdi-content-copy</v-icon>
              <span>Duplicate Best</span>
            </button>
            <button type="button" class="quick-action-btn" @click="exportReport">
              <v-icon size="24" color="warning">mdi-download</v-icon>
              <span>Export Report</span>
            </button>
            <router-link :to="{ name: 'Ads' }" class="quick-action-btn" title="Settings">
              <v-icon size="24" color="secondary">mdi-cog</v-icon>
              <span>Settings</span>
            </router-link>
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
      kpis: {
        totalReach: '0',
        totalReachChange: '0',
        engagementRate: '0%',
        engagementChange: '0',
        conversionRate: '0%',
        conversionChange: '0',
        totalSpend: 'R0',
        totalSpendChange: '0'
      },
      channelPerformance: [],
      aiInsight: { type: 'Budget Allocation', message: 'Loading…' },
      trend: { labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'], reach: [0, 0, 0, 0], engagement: [0, 0, 0, 0] },
      distribution: { labels: ['Social Media', 'Email', 'Display', 'Search'], values: [100, 0, 0, 0] },
      lineOptions: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom' } },
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
      doughnutOptions: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom' } },
        cutout: '60%'
      }
    };
  },
  computed: {
    lineData() {
      return {
        labels: this.trend.labels,
        datasets: [
          {
            label: 'Reach',
            data: this.trend.reach,
            borderColor: '#2196F3',
            backgroundColor: 'rgba(33, 150, 243, 0.1)',
            fill: true,
            tension: 0.3
          },
          {
            label: 'Engagement',
            data: this.trend.engagement,
            borderColor: '#4CAF50',
            backgroundColor: 'rgba(76, 175, 80, 0.1)',
            fill: true,
            tension: 0.3
          }
        ]
      };
    },
    doughnutData() {
      return {
        labels: this.distribution.labels,
        datasets: [{
          data: this.distribution.values,
          backgroundColor: ['#2196F3', '#4CAF50', '#9C27B0', '#FF9800'],
          borderWidth: 0
        }]
      };
    }
  },
  async mounted() {
    await Promise.all([this.loadDashboard(), this.loadCampaigns()]);
  },
  methods: {
    formatChange(val) {
      if (val == null || val === '') return '+0%';
      const s = String(val).replace(/%/g, '').trim();
      const n = parseFloat(s);
      if (Number.isNaN(n)) return String(val).includes('%') ? val : val + '%';
      const prefix = n >= 0 ? '+' : '';
      return `${prefix}${n}%`;
    },
    formatReach(n) {
      const num = parseInt(n, 10) || 0;
      if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
      if (num >= 1000) return (num / 1000) + 'K';
      return String(num);
    },
    formatSpend(n) {
      const num = parseFloat(n) || 0;
      if (num >= 1000) return 'R' + (num / 1000).toFixed(1).replace('.', ',') + 'K';
      return 'R' + Math.round(num);
    },
    async loadDashboard() {
      try {
        const { data } = await axios.get('/dashboard');
        this.kpis = data.kpis || this.kpis;
        this.channelPerformance = data.channelPerformance || [];
        this.aiInsight = data.aiInsight || this.aiInsight;
        if (data.trend) {
          this.trend = { labels: data.trend.labels || this.trend.labels, reach: data.trend.reach || this.trend.reach, engagement: data.trend.engagement || this.trend.engagement };
        }
        if (data.distribution) {
          this.distribution = { labels: data.distribution.labels || this.distribution.labels, values: data.distribution.values || this.distribution.values };
        }
      } catch (e) {
        console.error('Error loading dashboard:', e);
      }
    },
    async loadCampaigns() {
      try {
        const res = await axios.get('/ads');
        const all = res.data || [];
        const active = all.filter(a => ['published', 'approved', 'pending', 'draft'].includes(a.status)).slice(0, PAGE_SIZE);
        this.activeCampaigns = active.map((a, idx) => ({
          id: a.id,
          title: a.title,
          description: (a.description || '').slice(0, 60),
          icon: idx === 0 ? 'mdi-rocket-launch' : 'mdi-star',
          reach: this.formatReach(a.reach),
          engagement: (a.engagement != null ? Number(a.engagement).toFixed(1) : '—') + '%',
          spend: a.spend != null ? this.formatSpend(a.spend) : '—'
        }));
        this.totalCampaignPages = Math.max(1, Math.ceil(all.length / PAGE_SIZE));
      } catch (e) {
        console.error('Error loading campaigns:', e);
      }
    },
    duplicateBestCampaign() {
      this.$router.push({ name: 'Ads' });
    },
    exportReport() {
      const blob = new Blob([JSON.stringify({
        exportedAt: new Date().toISOString(),
        campaigns: this.activeCampaigns,
        channelPerformance: this.channelPerformance
      }, null, 2)], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `dashboard-report-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(a.href);
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

.table-campaign-row {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.table-campaign-icon {
  flex-shrink: 0;
  margin-top: 2px;
}

.table-metric {
  font-weight: 600;
  color: #1a1a1a;
  white-space: nowrap;
}

.insights-row {
  margin-top: 0;
  margin-bottom: 24px;
}

.card-heading {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 16px 0;
  display: flex;
  align-items: center;
}

.ai-insights-card {
  padding: 20px 24px;
}

.ai-insight {
  display: flex;
  align-items: flex-start;
  padding: 14px 16px;
  border-radius: 8px;
  font-size: 14px;
  line-height: 1.5;
}

.ai-insight.budget-allocation {
  background: #FFF8E1;
  border-left: 4px solid #FFC107;
}

.quick-actions-card {
  padding: 20px 24px;
}

.quick-actions-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.quick-action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px;
  background: #fff;
  border: 1px solid #DBDDDC;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  color: #1a1a1a;
  text-decoration: none;
  cursor: pointer;
  transition: box-shadow 0.2s ease, background 0.2s ease;
}

.quick-action-btn:hover {
  background: #f5f5f5;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}
</style>
