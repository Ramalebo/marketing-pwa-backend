<template>
  <div class="insights-container">
    <v-container fluid class="pa-6">
      <!-- Header Section -->
      <v-row class="mb-6">
        <v-col cols="12">
          <div>
            <h1 class="text-h4 font-weight-bold mb-2" style="color: #1a1a1a; letter-spacing: -0.5px;">
              Data Insights & Analytics
            </h1>
            <p class="text-body-1 mb-0" style="color: #6b7280;">
              View comprehensive analytics and insights about your clients and campaigns
            </p>
          </div>
        </v-col>
      </v-row>

      <!-- Stats Cards -->
      <v-row class="mb-6">
        <v-col cols="12" md="3" v-for="stat in stats" :key="stat.label">
          <v-card
            elevation="0"
            style="border-radius: 12px; border: 1px solid #e5e7eb; transition: all 0.3s;"
            @mouseenter="$event.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'"
            @mouseleave="$event.currentTarget.style.boxShadow = 'none'"
          >
            <v-card-text class="pa-6">
              <div class="text-h4 font-weight-bold mb-2" style="color: #1a1a1a;">
                {{ stat.value }}
              </div>
              <div class="text-body-2" style="color: #6b7280; font-weight: 500;">
                {{ stat.label }}
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Location Analytics -->
      <v-row class="mb-6">
        <v-col cols="12" md="6">
          <v-card
            elevation="0"
            style="border-radius: 12px; border: 1px solid #e5e7eb;"
          >
            <v-card-title 
              class="d-flex align-center pa-4"
              style="background: linear-gradient(135deg, #f9fafb 0%, #ffffff 100%); border-bottom: 1px solid #e5e7eb;"
            >
              <v-icon class="mr-3" color="primary" size="24">mdi-map-marker</v-icon>
              <span class="text-h6 font-weight-semibold" style="color: #1a1a1a;">Clients by Location</span>
            </v-card-title>
            <v-card-text class="pa-0">
              <v-list v-if="Object.keys(locationData).length > 0">
                <v-list-item
                  v-for="(count, country) in locationData"
                  :key="country"
                  class="px-4 py-3"
                  style="border-bottom: 1px solid #e5e7eb;"
                >
                  <v-list-item-title style="color: #1a1a1a; font-weight: 600;">
                    {{ country }}
                  </v-list-item-title>
                  <v-list-item-subtitle style="color: #6b7280;">
                    {{ count }} {{ count === 1 ? 'client' : 'clients' }}
                  </v-list-item-subtitle>
                  <template v-slot:append>
                    <v-progress-linear
                      :model-value="(count / totalClients) * 100"
                      color="primary"
                      height="8"
                      style="width: 120px; border-radius: 4px;"
                    ></v-progress-linear>
                  </template>
                </v-list-item>
              </v-list>
              <div v-else class="pa-8 text-center">
                <v-icon size="48" color="grey-lighten-1" class="mb-2">mdi-map-marker-off</v-icon>
                <div class="text-body-2" style="color: #9ca3af;">No location data available</div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="6">
          <v-card
            elevation="0"
            style="border-radius: 12px; border: 1px solid #e5e7eb;"
          >
            <v-card-title 
              class="d-flex align-center pa-4"
              style="background: linear-gradient(135deg, #f9fafb 0%, #ffffff 100%); border-bottom: 1px solid #e5e7eb;"
            >
              <v-icon class="mr-3" color="primary" size="24">mdi-earth</v-icon>
              <span class="text-h6 font-weight-semibold" style="color: #1a1a1a;">Client Locations Map</span>
            </v-card-title>
            <v-card-text class="pa-0">
              <div v-if="locations.length === 0" class="text-center pa-8">
                <v-icon size="64" color="grey-lighten-1" class="mb-4">mdi-map-marker-off</v-icon>
                <div class="text-h6 mb-2" style="color: #6b7280;">No location data available</div>
                <div class="text-body-2" style="color: #9ca3af;">
                  Add location information to clients to see them here
                </div>
              </div>
              <v-list v-else>
                <v-list-item
                  v-for="location in locations"
                  :key="location.id"
                  class="px-4 py-3"
                  style="border-bottom: 1px solid #e5e7eb;"
                >
                  <v-list-item-title style="color: #1a1a1a; font-weight: 600;">
                    {{ location.name }}
                  </v-list-item-title>
                  <v-list-item-subtitle style="color: #6b7280;">
                    {{ location.city }}, {{ location.country }}
                  </v-list-item-subtitle>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- All Clients Table -->
      <v-row>
        <v-col cols="12">
          <v-card
            elevation="0"
            style="border-radius: 12px; border: 1px solid #e5e7eb;"
          >
            <v-card-title 
              class="d-flex align-center pa-4"
              style="background: linear-gradient(135deg, #f9fafb 0%, #ffffff 100%); border-bottom: 1px solid #e5e7eb;"
            >
              <v-icon class="mr-3" color="primary" size="24">mdi-account-group</v-icon>
              <span class="text-h6 font-weight-semibold" style="color: #1a1a1a;">All Clients</span>
            </v-card-title>
            <v-card-text class="pa-0">
              <v-data-table
                :headers="headers"
                :items="clients"
                :loading="loading"
                class="elevation-0"
                :items-per-page="10"
                :items-per-page-options="[10, 25, 50]"
              >
                <template v-slot:item.location="{ item }">
                  <span style="color: #6b7280;">
                    {{ item.location?.city || '—' }}{{ item.location?.city && item.location?.country ? ', ' : '' }}{{ item.location?.country || '' }}
                  </span>
                </template>
                <template v-slot:no-data>
                  <div class="pa-12 text-center">
                    <v-icon size="64" color="grey-lighten-1" class="mb-4">mdi-account-group-outline</v-icon>
                    <div class="text-h6 mb-2" style="color: #6b7280;">No clients found</div>
                    <div class="text-body-2" style="color: #9ca3af;">
                      Add clients to see them in the analytics
                    </div>
                  </div>
                </template>
              </v-data-table>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Insights',
  data() {
    return {
      loading: false,
      stats: [],
      locationData: {},
      locations: [],
      clients: [],
      totalClients: 0,
      headers: [
        { title: 'Name', key: 'name', sortable: true },
        { title: 'Business', key: 'businessName', sortable: true },
        { title: 'Email', key: 'email', sortable: true },
        { title: 'Phone', key: 'phoneNumber', sortable: false },
        { title: 'Location', key: 'location', sortable: false }
      ]
    };
  },
  mounted() {
    this.loadInsights();
    this.loadLocations();
  },
  methods: {
    async loadInsights() {
      this.loading = true;
      try {
        const response = await axios.get('/insights/dashboard');
        const data = response.data;
        
        this.totalClients = data.totalClients;
        this.locationData = data.locationData;
        this.clients = data.clients;
        
        this.stats = [
          { label: 'Total Clients', value: data.totalClients },
          { label: 'With Phone', value: data.clientsWithPhone },
          { label: 'With Email', value: data.clientsWithEmail },
          { label: 'With Social Media', value: data.clientsWithSocial }
        ];
      } catch (error) {
        console.error('Error loading insights:', error);
        this.$store.dispatch('showSnackbar', {
          text: 'Error loading insights',
          color: 'error'
        });
      } finally {
        this.loading = false;
      }
    },
    async loadLocations() {
      try {
        const response = await axios.get('/insights/locations');
        this.locations = response.data;
      } catch (error) {
        console.error('Error loading locations:', error);
        this.$store.dispatch('showSnackbar', {
          text: 'Error loading locations',
          color: 'error'
        });
      }
    }
  }
};
</script>

<style scoped>
.insights-container {
  background: #f9fafb;
  min-height: 100vh;
}
</style>