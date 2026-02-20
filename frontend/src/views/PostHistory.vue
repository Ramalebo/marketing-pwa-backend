<template>
  <div class="post-history-container">
    <v-container fluid class="pa-6">
      <!-- Header Section -->
      <v-row class="page-header mb-6">
        <v-col cols="12">
          <div>
            <h1 class="page-title">Post History</h1>
            <p class="page-subtitle mb-0">
              View and track all your social media posts across platforms
            </p>
          </div>
        </v-col>
      </v-row>

      <v-row>
        <!-- Filter Sidebar -->
        <v-col cols="12" md="3">
          <div class="card">
            <div class="card-header">
              <v-icon color="primary" size="20" class="mr-2">mdi-filter</v-icon>
              <span class="card-title">Filters</span>
            </div>
            <div class="card-body pa-4">
              <v-select
                v-model="filterPlatform"
                :items="platforms"
                item-title="title"
                item-value="value"
                label="Platform"
                clearable
                density="default"
                variant="outlined"
                hide-details
                @update:model-value="loadPostHistory"
              ></v-select>
            </div>
          </div>
        </v-col>

        <!-- Post History Table -->
        <v-col cols="12" md="9">
          <div class="card">
            <div class="card-header d-flex align-center">
              <v-icon color="primary" size="24" class="mr-3">mdi-history</v-icon>
              <span class="card-title">Published Posts</span>
              <v-spacer></v-spacer>
              <v-text-field
                v-model="searchQuery"
                prepend-inner-icon="mdi-magnify"
                label="Search posts..."
                variant="outlined"
                density="compact"
                hide-details
                clearable
                class="post-history-search"
                @update:model-value="filterPosts"
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
                <template v-slot:item.status="{ item }">
                  <v-chip
                    :color="item.status === 'published' ? 'success' : 'error'"
                    size="small"
                    variant="flat"
                    style="font-weight: 500;"
                  >
                    {{ item.status }}
                  </v-chip>
                </template>
                <template v-slot:item.createdAt="{ item }">
                  <span class="text-secondary" style="font-size: 14px;">
                    {{ formatDate(item.createdAt) }}
                  </span>
                </template>
                <template v-slot:item.adTitle="{ item }">
                  <span class="text-primary" style="font-weight: 500;">
                    {{ item.adTitle }}
                  </span>
                </template>
                <template v-slot:no-data>
                  <div class="empty-state">
                    <div class="empty-state-icon">
                      <v-icon size="40" color="primary">mdi-history</v-icon>
                    </div>
                    <h3>No posts found</h3>
                    <p>Posts will appear here after you publish ads to social media</p>
                  </div>
                </template>
              </v-data-table>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'PostHistory',
  data() {
    return {
      loading: false,
      posts: [],
      filteredPosts: [],
      searchQuery: '',
      filterPlatform: null,
      platforms: [
        { title: 'Facebook', value: 'facebook' },
        { title: 'Instagram', value: 'instagram' },
        { title: 'WhatsApp', value: 'whatsapp' }
      ],
      headers: [
        { title: 'Platform', key: 'platform', sortable: true },
        { title: 'Ad Title', key: 'adTitle', sortable: true },
        { title: 'Post ID', key: 'postId', sortable: false },
        { title: 'Status', key: 'status', sortable: true },
        { title: 'Published', key: 'createdAt', sortable: true }
      ]
    };
  },
  mounted() {
    this.loadPostHistory();
  },
  methods: {
    async loadPostHistory() {
      this.loading = true;
      try {
        const params = {};
        if (this.filterPlatform) params.platform = this.filterPlatform;
        const response = await axios.get('/post-history', { params });
        this.posts = response.data.map(post => ({
          ...post,
          adTitle: post.adTitle || 'Unknown Ad'
        }));
        this.filterPosts();
      } catch (error) {
        console.error('Error loading post history:', error);
        this.$store.dispatch('showSnackbar', {
          text: 'Error loading post history',
          color: 'error'
        });
      } finally {
        this.loading = false;
      }
    },
    filterPosts() {
      let filtered = [...this.posts];
      
      // Filter by search query
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(post =>
          post.adTitle?.toLowerCase().includes(query) ||
          post.platform?.toLowerCase().includes(query) ||
          post.postId?.toLowerCase().includes(query) ||
          post.status?.toLowerCase().includes(query)
        );
      }
      
      this.filteredPosts = filtered;
    },
    getPlatformIcon(platform) {
      const icons = {
        facebook: 'mdi-facebook',
        instagram: 'mdi-instagram',
        whatsapp: 'mdi-whatsapp'
      };
      return icons[platform] || 'mdi-share-variant';
    },
    getPlatformColor(platform) {
      const colors = {
        facebook: 'blue',
        instagram: 'pink',
        whatsapp: 'green'
      };
      return colors[platform] || 'grey';
    },
    formatDate(date) {
      if (!date) return 'N/A';
      return new Date(date).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  }
};
</script>

<style scoped>
.post-history-container {
  min-height: 100%;
}

.post-history-search {
  max-width: 300px;
}
</style>