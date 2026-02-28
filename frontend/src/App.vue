<template>
  <v-app class="app-wrapper clean-layout">
    <v-navigation-drawer
      v-model="drawer"
      :permanent="$vuetify.display.mdAndUp"
      app
      width="260"
      class="app-drawer app-sidebar"
    >
      <div class="sidebar-header">
        <div class="sidebar-brand">
          <v-avatar color="rgba(255,255,255,0.12)" size="40" class="sidebar-logo">
            <v-icon color="primary" size="22">mdi-send</v-icon>
          </v-avatar>
          <div>
            <h2 class="sidebar-title">Dominant Logic</h2>
            <span class="sidebar-subtitle">Marketing Platform</span>
          </div>
        </div>
      </div>
      <v-list class="sidebar-list sidebar-nav" density="comfortable">
        <v-list-subheader class="nav-section-title">DASHBOARD</v-list-subheader>
        <v-list-item :to="{ name: 'Dashboard' }" class="nav-item" :class="{ 'v-list-item--active': $route.name === 'Dashboard' }">
          <template v-slot:prepend><v-icon :color="$route.name === 'Dashboard' ? 'primary' : undefined" icon="mdi-chart-bar" size="20" class="nav-icon"></v-icon></template>
          <v-list-item-title>Overview</v-list-item-title>
        </v-list-item>
        <v-list-item :to="{ name: 'Ads' }" class="nav-item" :class="{ 'v-list-item--active': $route.name === 'Ads' }">
          <template v-slot:prepend><v-icon :color="$route.name === 'Ads' ? 'primary' : undefined" icon="mdi-bullseye-arrow" size="20" class="nav-icon"></v-icon></template>
          <v-list-item-title>Campaigns</v-list-item-title>
        </v-list-item>
        <v-list-item :to="{ name: 'Insights' }" class="nav-item" :class="{ 'v-list-item--active': $route.name === 'Insights' }">
          <template v-slot:prepend><v-icon :color="$route.name === 'Insights' ? 'primary' : undefined" icon="mdi-chart-timeline-variant" size="20" class="nav-icon"></v-icon></template>
          <v-list-item-title>Analytics</v-list-item-title>
        </v-list-item>

        <v-list-subheader class="nav-section-title">MANAGEMENT</v-list-subheader>
        <v-list-item :to="{ name: 'Clients' }" class="nav-item" :class="{ 'v-list-item--active': $route.name === 'Clients' }">
          <template v-slot:prepend><v-icon :color="$route.name === 'Clients' ? 'primary' : undefined" icon="mdi-account-group" size="20" class="nav-icon"></v-icon></template>
          <v-list-item-title>Clients</v-list-item-title>
        </v-list-item>
        <v-list-item v-if="isMainUser" :to="{ name: 'Users' }" class="nav-item" :class="{ 'v-list-item--active': $route.name === 'Users' }">
          <template v-slot:prepend><v-icon :color="$route.name === 'Users' ? 'primary' : undefined" icon="mdi-account-multiple" size="20" class="nav-icon"></v-icon></template>
          <v-list-item-title>Users</v-list-item-title>
        </v-list-item>

        <v-list-subheader class="nav-section-title">DISTRIBUTION</v-list-subheader>
        <v-list-item :to="{ name: 'PostHistory' }" class="nav-item" :class="{ 'v-list-item--active': $route.name === 'PostHistory' }">
          <template v-slot:prepend><v-icon :color="$route.name === 'PostHistory' ? 'primary' : undefined" icon="mdi-share-variant" size="20" class="nav-icon"></v-icon></template>
          <v-list-item-title>Social Platforms</v-list-item-title>
        </v-list-item>
        <v-list-item :to="{ name: 'SchedulePosts' }" class="nav-item" :class="{ 'v-list-item--active': $route.name === 'SchedulePosts' }">
          <template v-slot:prepend><v-icon :color="$route.name === 'SchedulePosts' ? 'primary' : undefined" icon="mdi-calendar-clock" size="20" class="nav-icon"></v-icon></template>
          <v-list-item-title>Schedule Posts</v-list-item-title>
        </v-list-item>
        <v-list-item :to="{ name: 'Email' }" class="nav-item" :class="{ 'v-list-item--active': $route.name === 'Email' }">
          <template v-slot:prepend><v-icon :color="$route.name === 'Email' ? 'primary' : undefined" icon="mdi-email" size="20" class="nav-icon"></v-icon></template>
          <v-list-item-title>Email</v-list-item-title>
        </v-list-item>
        <v-list-item :to="{ name: 'Display' }" class="nav-item" :class="{ 'v-list-item--active': $route.name === 'Display' }">
          <template v-slot:prepend><v-icon :color="$route.name === 'Display' ? 'primary' : undefined" icon="mdi-monitor" size="20" class="nav-icon"></v-icon></template>
          <v-list-item-title>Display</v-list-item-title>
        </v-list-item>
        <v-list-item :to="{ name: 'Beacons' }" class="nav-item" :class="{ 'v-list-item--active': $route.name === 'Beacons' }">
          <template v-slot:prepend><v-icon :color="$route.name === 'Beacons' ? 'primary' : undefined" icon="mdi-bluetooth" size="20" class="nav-icon"></v-icon></template>
          <v-list-item-title>Beacons</v-list-item-title>
        </v-list-item>
        <v-list-item :to="{ name: 'Search' }" class="nav-item" :class="{ 'v-list-item--active': $route.name === 'Search' }">
          <template v-slot:prepend><v-icon :color="$route.name === 'Search' ? 'primary' : undefined" icon="mdi-magnify" size="20" class="nav-icon"></v-icon></template>
          <v-list-item-title>Search Marketing</v-list-item-title>
        </v-list-item>

        <v-list-subheader class="nav-section-title">TOOLS</v-list-subheader>
        <v-list-item :to="{ name: 'Optimization' }" class="nav-item" :class="{ 'v-list-item--active': $route.name === 'Optimization' }">
          <template v-slot:prepend><v-icon :color="$route.name === 'Optimization' ? 'primary' : undefined" icon="mdi-auto-fix" size="20" class="nav-icon"></v-icon></template>
          <v-list-item-title>Optimization</v-list-item-title>
        </v-list-item>
        <v-list-item :to="{ name: 'Reports' }" class="nav-item" :class="{ 'v-list-item--active': $route.name === 'Reports' }">
          <template v-slot:prepend><v-icon :color="$route.name === 'Reports' ? 'primary' : undefined" icon="mdi-file-document-outline" size="20" class="nav-icon"></v-icon></template>
          <v-list-item-title>Reports</v-list-item-title>
        </v-list-item>
      </v-list>
      <template v-slot:append>
        <div class="sidebar-footer">
          <div class="sidebar-footer-item" @click="logout">
            <v-icon size="20" class="mr-2">mdi-logout</v-icon>
            Logout
          </div>
        </div>
      </template>
    </v-navigation-drawer>

    <v-app-bar app elevation="0" height="64" class="app-bar app-header">
      <v-app-bar-nav-icon v-if="$vuetify.display.smAndDown" @click="drawer = !drawer" class="sidebar-toggle" />
      <div class="app-bar-heading">
        <span class="app-bar-title page-title">{{ pageTitle }}</span>
        <span v-if="pageSubtitle" class="app-bar-subtitle page-subtitle">{{ pageSubtitle }}</span>
      </div>
      <v-spacer class="app-bar-spacer" />
      <div class="app-bar-actions">
        <span class="app-bar-datetime">{{ currentDateTime }}</span>
        <v-btn icon variant="text" size="small" class="text-medium-emphasis" aria-label="Notifications">
          <v-icon size="20">mdi-bell-outline</v-icon>
        </v-btn>
        <v-btn variant="flat" color="primary" class="app-bar-btn" :to="{ name: 'Ads' }" prepend-icon="mdi-plus">
          <span class="app-bar-btn-text">New Campaign</span>
        </v-btn>
        <v-menu location="bottom" min-width="160">
          <template v-slot:activator="{ props }">
            <div v-bind="props" class="app-bar-user user-menu">
              <v-avatar color="grey-lighten-2" size="36" class="mr-2">
                <v-icon size="20" color="grey">mdi-account</v-icon>
              </v-avatar>
              <span class="app-bar-user-name">{{ user?.name || 'John Doe' }}</span>
              <v-icon size="18" class="ml-1 text-secondary">mdi-chevron-down</v-icon>
            </div>
          </template>
          <v-list><v-list-item @click="logout" title="Logout" prepend-icon="mdi-logout" /></v-list>
        </v-menu>
      </div>
    </v-app-bar>

    <v-main class="app-main">
      <div class="app-content">
        <div class="app-layout content-container app-page">
          <router-view />
        </div>
      </div>
    </v-main>

    <!-- Toast Notifications -->
    <v-snackbar
      v-model="$store.state.snackbar.show"
      :color="$store.state.snackbar.color"
      :timeout="$store.state.snackbar.timeout"
      location="top right"
      elevation="4"
      class="app-snackbar"
    >
      <div style="display: flex; align-items: center; width: 100%;">
        <v-icon 
          v-if="$store.state.snackbar.color === 'error'" 
          class="mr-3" 
          color="white" 
          size="20"
        >
          mdi-alert-circle
        </v-icon>
        <v-icon 
          v-else-if="$store.state.snackbar.color === 'success'" 
          class="mr-3" 
          color="white" 
          size="20"
        >
          mdi-check-circle
        </v-icon>
        <v-icon 
          v-else-if="$store.state.snackbar.color === 'warning'" 
          class="mr-3" 
          color="white" 
          size="20"
        >
          mdi-alert
        </v-icon>
        <span style="flex: 1; font-weight: 500;">{{ $store.state.snackbar.text }}</span>
      </div>
      <template v-slot:actions>
        <v-btn
          variant="text"
          @click="$store.dispatch('hideSnackbar')"
          style="color: rgba(255, 255, 255, 0.95); font-weight: 600; min-width: auto; padding: 0 12px;"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'App',
  data() {
    return {
      drawer: null
    };
  },
  computed: {
    currentDateTime() {
      const d = new Date();
      const date = d.toLocaleDateString('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/-/g, '/');
      const time = d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });
      return `${date}, ${time}`;
    },
    ...mapGetters(['user', 'isMainUser']),
    pageTitle() {
      const names = {
        Dashboard: 'Dashboard Overview',
        Ads: 'Campaigns',
        Display: 'Outdoor Advertising',
        Insights: 'Analytics',
        Clients: 'Clients',
        Notes: 'Notes',
        Email: 'Email',
        SMS: 'SMS',
        Search: 'Search Marketing',
        Optimization: 'Optimization Engine',
        Beacons: 'Bluetooth Beacons',
        Reports: 'Reports',
        Chatbot: 'Chatbot',
        Users: 'Users',
        Templates: 'Templates',
        PostHistory: 'Post History',
        SchedulePosts: 'Schedule Posts'
      };
      return names[this.$route.name] || this.$route.name || 'Dashboard Overview';
    },
    pageSubtitle() {
      if (this.$route.name === 'Dashboard') return 'Monitor your multi-channel marketing performance';
      if (this.$route.name === 'Display') return 'Manage billboards, digital screens, and outdoor campaigns';
      if (this.$route.name === 'Search') return 'SEO best practices so your clients appear first in search';
      if (this.$route.name === 'Optimization') return 'Ad spec advisor and self-optimizing recommendations';
      if (this.$route.name === 'Beacons') return 'Proximity marketing: prompt customers with ads in fenced locations';
      return '';
    },
    userInitial() {
      const name = this.user?.name || 'U';
      return name.charAt(0).toUpperCase();
    }
  },
  mounted() {
    // With login disabled, fetch default user so header shows name
    if (!this.user) {
      this.$store.dispatch('fetchUser').catch(() => {});
    }
  },
  methods: {
    logout() {
      this.$store.dispatch('logout');
      this.$router.push('/dashboard');
    },
    handleLogoError(event) {
      // Hide broken image if logo file doesn't exist yet
      event.target.style.display = 'none';
    }
  }
};
</script>

<style scoped>
.app-drawer {
  background: var(--light-bg, #FEFEFE) !important;
  border-right: 1px solid var(--border-color, #DBDDDC) !important;
}

.sidebar-header {
  padding: 24px 20px 20px;
  border-bottom: 1px solid var(--border-color, #DBDDDC);
}

.sidebar-brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.sidebar-logo {
  flex-shrink: 0;
}

.sidebar-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--text-primary, #1a1a1a);
  letter-spacing: -0.02em;
  margin: 0;
}

.sidebar-list :deep(.v-list-subheader) {
  padding: 16px 16px 8px;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 1.2px;
  color: var(--text-secondary);
}

.sidebar-list :deep(.v-list-item) {
  min-height: 44px;
  margin: 0 8px 4px;
  border-radius: 8px;
  padding-inline-start: 12px;
  transition: background 0.15s ease;
  color: #1a1a1a !important;
}

/* Keep overlay behind text so label is always visible on hover/active */
.sidebar-list :deep(.v-list-item .v-list-item__overlay) {
  z-index: 0 !important;
}
.sidebar-list :deep(.v-list-item .v-list-item__content),
.sidebar-list :deep(.v-list-item .v-list-item-title) {
  position: relative !important;
  z-index: 1 !important;
  visibility: visible !important;
}

.sidebar-list :deep(.v-list-item .v-list-item-title) {
  color: #1a1a1a !important;
  opacity: 1 !important;
  font-weight: 500 !important;
}
.sidebar-list :deep(.v-list-item:hover .v-list-item-title),
.sidebar-list :deep(.v-list-item:hover .v-icon) {
  color: #1565C0 !important;
  opacity: 1 !important;
  visibility: visible !important;
}
.sidebar-list :deep(.v-list-item--active) {
  background: #E3F2FD !important;
  border-left: 3px solid #2196F3;
  padding-left: 9px;
}
.sidebar-list :deep(.v-list-item--active .v-list-item-title),
.sidebar-list :deep(.v-list-item--active .v-icon) {
  color: #1565C0 !important;
  font-weight: 600 !important;
  opacity: 1 !important;
  visibility: visible !important;
}

.sidebar-footer {
  border-top: 1px solid var(--border-color, #DBDDDC);
  padding: 16px 20px;
}
.sidebar-footer-item {
  display: flex;
  align-items: center;
  padding: 10px 12px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-secondary, #69737B);
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease;
}
.sidebar-footer-item:hover {
  background: #f3f4f6;
  color: var(--text-primary, #1a1a1a);
}

.app-bar {
  background: var(--light-bg, #FEFEFE) !important;
  border-bottom: 1px solid var(--border-color, #DBDDDC) !important;
  box-shadow: var(--shadow-sm, 0 1px 2px rgba(0,0,0,0.05));
}

.app-bar-heading {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 16px;
  min-width: 0;
  flex: 1;
}

.app-bar-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--text-primary, #1a1a1a);
  letter-spacing: -0.02em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.app-bar-subtitle {
  font-size: 14px;
  color: var(--text-secondary);
  margin-top: 2px;
}

.app-bar-btn {
  text-transform: none;
  font-weight: 600;
  margin-right: 16px;
}

.app-bar-user {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 6px 10px;
  border-radius: 8px;
  margin-right: 8px;
}

.app-bar-user:hover {
  background: #E3F2FD;
}

.app-bar-user-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary, #1a1a1a);
}

.app-bar-datetime {
  font-size: 13px;
  color: var(--text-secondary);
  margin-right: 16px;
  font-weight: 500;
}

/* Prevent app bar content from overlapping – allow wrap and consistent gap */
.app-bar :deep(.v-toolbar__content) {
  flex-wrap: wrap;
  gap: 8px;
  min-height: 64px;
  padding-right: 8px;
}

.app-bar-spacer {
  min-width: 8px;
}

.app-bar-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.app-bar-btn {
  flex-shrink: 0;
}

.app-content {
  background: var(--light-bg, #FEFEFE);
}

/* Snackbar below app bar – no overlap */
.app-snackbar {
  margin-top: 72px !important;
  margin-right: 16px !important;
  z-index: 2500;
}

@media (max-width: 960px) {
  .app-bar-title { font-size: 0.95rem; }
  .app-bar-subtitle { display: none; }
  .app-bar-datetime { display: none; }
}

@media (max-width: 600px) {
  .app-bar-btn-text { display: none; }
  .app-bar-user-name { max-width: 100px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
}
</style>

