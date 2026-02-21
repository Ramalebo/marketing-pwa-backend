<template>
  <div class="ads-container">
    <v-container fluid class="pa-6">
      <!-- Header Section -->
      <v-row class="mb-6">
        <v-col cols="12">
          <div class="d-flex align-center justify-space-between flex-wrap">
            <div>
              <h1 class="text-h4 font-weight-bold mb-2" style="color: #1a1a1a; letter-spacing: -0.5px;">
                AI Ad Generation
              </h1>
              <p class="text-body-1 mb-0" style="color: #6b7280;">
                Create, manage, and publish ads across multiple social media platforms
              </p>
            </div>
            <v-btn
              color="primary"
              prepend-icon="mdi-plus"
              @click="openDialog()"
              variant="elevated"
              size="default"
              style="font-weight: 600; letter-spacing: 0.3px;"
            >
              Create Ad
            </v-btn>
          </div>
        </v-col>
      </v-row>

      <v-row v-if="ads.length > 0">
        <v-col cols="12" md="4" v-for="ad in ads" :key="ad.id || ad._id">
          <v-card
            elevation="0"
            style="border-radius: 12px; border: 1px solid #e5e7eb; height: 100%; transition: all 0.3s;"
            @mouseenter="$event.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'"
            @mouseleave="$event.currentTarget.style.boxShadow = 'none'"
          >
            <v-card-title 
              class="pa-4"
              style="background: linear-gradient(135deg, #f9fafb 0%, #ffffff 100%); border-bottom: 1px solid #e5e7eb;"
            >
              <div class="d-flex align-center justify-space-between w-100">
                <span class="text-h6 font-weight-semibold" style="color: #1a1a1a;">{{ ad.title }}</span>
                <v-chip
                  v-if="ad.aiGenerated"
                  color="success"
                  size="small"
                  variant="flat"
                  style="font-weight: 500;"
                >
                  AI
                </v-chip>
              </div>
            </v-card-title>
            <v-card-subtitle v-if="ad.clientId" class="pa-4 pb-2" style="color: #6b7280;">
              <v-icon size="16" class="mr-1">mdi-account</v-icon>
              {{ ad.clientId.name }}
            </v-card-subtitle>
            <v-card-text class="pa-4">
              <p style="color: #4b5563; line-height: 1.6; margin-bottom: 12px;">
                {{ ad.description || ad.content?.text || 'No description' }}
              </p>
              <div class="d-flex align-center ga-2 flex-wrap">
                <v-chip
                  :color="getStatusColor(ad.status)"
                  size="small"
                  variant="flat"
                  style="font-weight: 500; text-transform: capitalize;"
                >
                  {{ ad.status }}
                </v-chip>
                <v-chip
                  v-if="ad.type"
                  color="grey"
                  size="small"
                  variant="outlined"
                  style="font-weight: 500; text-transform: capitalize;"
                >
                  {{ ad.type }}
                </v-chip>
              </div>
            </v-card-text>
            <v-card-actions class="pa-4 ads-card-actions" style="background: #f9fafb; border-top: 1px solid #e5e7eb;">
              <v-btn
                color="primary"
                variant="elevated"
                size="default"
                prepend-icon="mdi-share-variant"
                @click="openPublishDialog(ad)"
                style="font-weight: 600; text-transform: none;"
              >
                Publish
              </v-btn>
              <v-btn
                variant="text"
                size="default"
                prepend-icon="mdi-pencil"
                @click="openDialog(ad)"
                style="font-weight: 500; text-transform: none;"
              >
                Edit
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn
                icon="mdi-delete"
                size="small"
                variant="text"
                color="error"
                @click="deleteAd(ad)"
                style="min-width: 36px;"
              ></v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
      <v-row v-else>
        <v-col cols="12">
          <v-card
            elevation="0"
            style="border-radius: 12px; border: 1px solid #e5e7eb;"
          >
            <div class="pa-12 text-center">
              <v-icon size="64" color="grey-lighten-1" class="mb-4">mdi-bullhorn-outline</v-icon>
              <div class="text-h6 mb-2" style="color: #6b7280;">No ads found</div>
              <div class="text-body-2 mb-4" style="color: #9ca3af;">
                Create your first ad to get started
              </div>
              <v-btn
                color="primary"
                prepend-icon="mdi-plus"
                @click="openDialog()"
                variant="elevated"
              >
                Create Ad
              </v-btn>
            </div>
          </v-card>
        </v-col>
      </v-row>

    <!-- Confirmation Dialog -->
    <ConfirmationDialog
      v-model="confirmDialog"
      :title="confirmTitle"
      :message="confirmMessage"
      :type="confirmType"
      @confirm="handleConfirm"
    />

    <v-dialog v-model="dialog" max-width="900" persistent scrollable>
      <v-card style="border-radius: 12px; overflow: hidden; max-height: 90vh; display: flex; flex-direction: column;">
        <v-card-title 
          class="bg-primary text-white pa-4 d-flex align-center"
          style="font-weight: 600; letter-spacing: 0.3px; flex-shrink: 0;"
        >
          <v-icon class="mr-2" size="24">mdi-bullhorn</v-icon>
          {{ editingAd ? 'Edit Ad' : 'Create New Ad' }}
          <v-spacer></v-spacer>
          <v-btn
            icon="mdi-close"
            variant="text"
            @click="dialog = false"
            style="color: white;"
          ></v-btn>
        </v-card-title>
        <v-card-text class="pa-0" style="overflow-y: auto; flex: 1;">
          <v-tabs v-model="tab" bg-color="grey-lighten-5">
            <v-tab value="generate" style="font-weight: 500;">AI Generate</v-tab>
            <v-tab value="manual" style="font-weight: 500;">Manual Create</v-tab>
            <v-tab value="upload" style="font-weight: 500;">Upload Content</v-tab>
          </v-tabs>
          <v-window v-model="tab">
            <v-window-item value="generate">
              <v-form class="pa-6">
                <v-select
                  v-model="generateForm.clientId"
                  :items="clientOptions"
                  item-title="title"
                  item-value="value"
                  label="Client (Optional)"
                  clearable
                  density="default"
                  variant="outlined"
                  hide-details
                  style="background: #ffffff;"
                ></v-select>
                <v-select
                  v-model="generateForm.type"
                  :items="adTypes"
                  item-title="title"
                  item-value="value"
                  label="Ad Type"
                  density="default"
                  variant="outlined"
                  hide-details
                  class="mt-4"
                  style="background: #ffffff;"
                ></v-select>
                <v-textarea
                  v-model="generateForm.prompt"
                  label="Describe the ad you want to generate"
                  rows="4"
                  required
                  density="default"
                  variant="outlined"
                  hide-details
                  class="mt-4"
                  style="background: #ffffff;"
                ></v-textarea>
                <v-btn
                  color="primary"
                  @click="generateAd"
                  :loading="generating"
                  block
                  variant="elevated"
                  size="large"
                  class="mt-6"
                  style="font-weight: 600; letter-spacing: 0.5px; text-transform: none; height: 48px;"
                >
                  Generate with AI
                </v-btn>
              </v-form>
            </v-window-item>
            <v-window-item value="manual">
              <v-form ref="form" v-model="valid" class="pa-6">
                <v-text-field
                  v-model="form.title"
                  label="Title"
                  required
                  density="default"
                  variant="outlined"
                  hide-details
                  style="background: #ffffff;"
                ></v-text-field>
                <v-textarea
                  v-model="form.description"
                  label="Description"
                  rows="3"
                  density="default"
                  variant="outlined"
                  hide-details
                  class="mt-4"
                  style="background: #ffffff;"
                ></v-textarea>
                <v-select
                  v-model="form.type"
                  :items="adTypes"
                  item-title="title"
                  item-value="value"
                  label="Ad Type"
                  required
                  density="default"
                  variant="outlined"
                  hide-details
                  class="mt-4"
                  style="background: #ffffff;"
                ></v-select>
                <v-select
                  v-model="form.clientId"
                  :items="clientOptions"
                  item-title="title"
                  item-value="value"
                  label="Client (Optional)"
                  clearable
                  density="default"
                  variant="outlined"
                  hide-details
                  class="mt-4"
                  style="background: #ffffff;"
                ></v-select>
                <v-select
                  v-model="form.channel"
                  :items="channelOptions"
                  item-title="title"
                  item-value="value"
                  label="Channel"
                  density="default"
                  variant="outlined"
                  hide-details
                  class="mt-4"
                  style="background: #ffffff;"
                ></v-select>
                <template v-if="form.channel === 'display'">
                  <v-select
                    v-model="form.displayType"
                    :items="displayTypeOptions"
                    item-title="title"
                    item-value="value"
                    label="Display type"
                    density="default"
                    variant="outlined"
                    hide-details
                    class="mt-4"
                    style="background: #ffffff;"
                  ></v-select>
                  <v-text-field
                    v-model="form.location"
                    label="Location (e.g. San Francisco, CA)"
                    density="default"
                    variant="outlined"
                    hide-details
                    class="mt-4"
                    style="background: #ffffff;"
                  ></v-text-field>
                  <v-row class="mt-4">
                    <v-col cols="12" sm="6">
                      <v-text-field
                        v-model="form.size"
                        label="Size (e.g. 14x48 ft)"
                        density="default"
                        variant="outlined"
                        hide-details
                        style="background: #ffffff;"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        v-model="form.period"
                        label="Period (e.g. 3 months)"
                        density="default"
                        variant="outlined"
                        hide-details
                        style="background: #ffffff;"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row class="mt-2">
                    <v-col cols="12" sm="4">
                      <v-text-field
                        v-model.number="form.impressionsPerDay"
                        label="Impressions/day"
                        type="number"
                        min="0"
                        density="default"
                        variant="outlined"
                        hide-details
                        style="background: #ffffff;"
                        placeholder="e.g. 125000"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="4">
                      <v-text-field
                        v-model="form.startDate"
                        label="Start date"
                        type="date"
                        density="default"
                        variant="outlined"
                        hide-details
                        style="background: #ffffff;"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="4">
                      <v-text-field
                        v-model="form.endDate"
                        label="End date"
                        type="date"
                        density="default"
                        variant="outlined"
                        hide-details
                        style="background: #ffffff;"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </template>
                <v-row class="mt-4">
                  <v-col cols="12" sm="4">
                    <v-text-field
                      v-model.number="form.reach"
                      label="Reach"
                      type="number"
                      min="0"
                      density="default"
                      variant="outlined"
                      hide-details
                      style="background: #ffffff;"
                      placeholder="e.g. 125000"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="4">
                    <v-text-field
                      v-model.number="form.engagement"
                      label="Engagement %"
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      density="default"
                      variant="outlined"
                      hide-details
                      style="background: #ffffff;"
                      placeholder="e.g. 4.2"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="4">
                    <v-text-field
                      v-model.number="form.spend"
                      label="Spend (R)"
                      type="number"
                      min="0"
                      step="0.01"
                      density="default"
                      variant="outlined"
                      hide-details
                      style="background: #ffffff;"
                      placeholder="e.g. 18500"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-textarea
                  v-model="form.content.text"
                  label="Ad Text"
                  rows="4"
                  density="default"
                  variant="outlined"
                  hide-details
                  class="mt-4"
                  style="background: #ffffff;"
                ></v-textarea>
              </v-form>
            </v-window-item>
            <v-window-item value="upload">
              <v-form class="pa-6">
                <v-file-input
                  v-model="uploadFiles"
                  label="Upload Images/Videos"
                  multiple
                  accept="image/*,video/*"
                  @change="handleFileUpload"
                  density="default"
                  variant="outlined"
                  hide-details
                  style="background: #ffffff;"
                ></v-file-input>
                <v-row v-if="uploadedFiles.length > 0" class="mt-4">
                  <v-col cols="6" v-for="(file, index) in uploadedFiles" :key="index">
                    <v-card
                      elevation="0"
                      style="border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;"
                    >
                      <v-img
                        v-if="file.mimetype.startsWith('image/')"
                        :src="file.url"
                        height="150"
                        cover
                      ></v-img>
                      <v-card-text v-else class="text-center pa-4">
                        <v-icon size="48" color="primary">mdi-video</v-icon>
                        <div class="mt-2 text-body-2" style="color: #6b7280;">{{ file.originalName }}</div>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>
              </v-form>
            </v-window-item>
          </v-window>
        </v-card-text>
        <v-card-actions class="pa-4" style="background: #f9fafb; border-top: 1px solid #e5e7eb; flex-shrink: 0;">
          <v-spacer></v-spacer>
          <v-btn
            @click="dialog = false"
            variant="text"
            style="font-weight: 500; text-transform: none;"
          >
            Cancel
          </v-btn>
          <v-btn
            v-if="tab === 'manual' || tab === 'upload'"
            color="primary"
            @click="saveAd"
            :loading="saving"
            variant="elevated"
            style="font-weight: 600; text-transform: none; letter-spacing: 0.3px;"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Publish to Social Media Dialog -->
    <v-dialog v-model="publishDialog" max-width="700" persistent scrollable>
      <v-card style="border-radius: 12px; overflow: hidden; max-height: 90vh; display: flex; flex-direction: column;">
        <v-card-title 
          class="bg-primary text-white pa-4 d-flex align-center"
          style="font-weight: 600; letter-spacing: 0.3px; flex-shrink: 0;"
        >
          <v-icon class="mr-2" size="24">mdi-share-variant</v-icon>
          Publish to Social Media
          <v-spacer></v-spacer>
          <v-btn
            icon="mdi-close"
            variant="text"
            @click="closePublishDialog"
            style="color: white;"
          ></v-btn>
        </v-card-title>
        <v-card-text class="pa-6" style="overflow-y: auto; flex: 1;">
          <div v-if="publishingAd" class="mb-4">
            <div class="text-h6 mb-2">{{ publishingAd.title }}</div>
            <div class="text-body-2 text-grey">{{ publishingAd.description || publishingAd.content?.text || 'No description' }}</div>
            <div v-if="publishingAd.content?.images?.[0]" class="mt-3">
              <v-img 
                :src="getImageUrl(publishingAd.content.images[0])"
                height="150"
                cover
                style="border-radius: 8px;"
              ></v-img>
            </div>
          </div>

          <v-divider class="my-4"></v-divider>

          <div class="text-subtitle-1 font-weight-bold mb-3">Select Platforms</div>
          
          <v-checkbox
            v-model="selectedPlatforms"
            value="facebook"
            label="Facebook"
            color="blue"
            class="mb-2"
          >
            <template v-slot:label>
              <div class="d-flex align-center">
                <v-icon color="blue" class="mr-2">mdi-facebook</v-icon>
                <span>Facebook</span>
              </div>
            </template>
          </v-checkbox>

          <v-checkbox
            v-model="selectedPlatforms"
            value="instagram"
            label="Instagram"
            color="pink"
            class="mb-2"
          >
            <template v-slot:label>
              <div class="d-flex align-center">
                <v-icon color="pink" class="mr-2">mdi-instagram</v-icon>
                <span>Instagram</span>
              </div>
            </template>
          </v-checkbox>

          <v-checkbox
            v-model="selectedPlatforms"
            value="whatsapp"
            label="WhatsApp"
            color="green"
            class="mb-2"
          >
            <template v-slot:label>
              <div class="d-flex align-center">
                <v-icon color="green" class="mr-2">mdi-whatsapp</v-icon>
                <span>WhatsApp</span>
              </div>
            </template>
          </v-checkbox>

          <v-text-field
            v-if="selectedPlatforms.includes('whatsapp')"
            v-model="whatsappPhone"
            label="WhatsApp Phone Number"
            placeholder="+1234567890"
            prepend-inner-icon="mdi-phone"
            class="mt-4"
            hint="Include country code (e.g., +1234567890)"
            persistent-hint
          ></v-text-field>

          <!-- Hashtag Generator -->
          <v-divider class="my-4"></v-divider>
          <div class="d-flex justify-space-between align-center mb-2">
            <div class="text-subtitle-1 font-weight-bold">Hashtags</div>
            <v-btn
              size="small"
              variant="outlined"
              prepend-icon="mdi-auto-fix"
              @click="generateHashtags"
              :loading="generatingHashtags"
            >
              Generate
            </v-btn>
          </div>
          <v-text-field
            v-model="hashtagCount"
            label="Number of Hashtags"
            type="number"
            min="5"
            max="30"
            density="compact"
            class="mb-2"
            style="max-width: 150px;"
          ></v-text-field>
          <div v-if="hashtags.length > 0" class="mb-3">
            <v-chip
              v-for="(hashtag, index) in hashtags"
              :key="index"
              class="ma-1"
              closable
              @click:close="hashtags.splice(index, 1)"
              @click="addHashtagToContent(hashtag)"
            >
              {{ hashtag }}
            </v-chip>
          </div>
          <v-alert v-else type="info" variant="tonal" density="compact">
            Click "Generate" to create AI-powered hashtags for your post
          </v-alert>

          <!-- Post Preview -->
          <v-divider class="my-4"></v-divider>
          <div class="d-flex justify-space-between align-center mb-2">
            <div class="text-subtitle-1 font-weight-bold">Preview</div>
            <v-btn-toggle v-model="previewPlatform" mandatory>
              <v-btn size="small" value="facebook">
                <v-icon size="16" class="mr-1">mdi-facebook</v-icon>
                Facebook
              </v-btn>
              <v-btn size="small" value="instagram">
                <v-icon size="16" class="mr-1">mdi-instagram</v-icon>
                Instagram
              </v-btn>
            </v-btn-toggle>
          </div>
          <v-card variant="outlined" class="preview-card" style="background: #f9fafb;">
            <v-card-text class="pa-4">
              <div class="d-flex align-center mb-3">
                <v-avatar size="40" color="grey-lighten-2" class="mr-3">
                  <v-icon>mdi-account</v-icon>
                </v-avatar>
                <div>
                  <div class="font-weight-bold">Your Page</div>
                  <div class="text-caption text-grey">Just now</div>
                </div>
              </div>
              <div v-if="publishingAd.content?.images?.[0]" class="mb-3">
                <v-img 
                  :src="getImageUrl(publishingAd.content.images[0])"
                  height="300"
                  cover
                  style="border-radius: 8px;"
                ></v-img>
              </div>
              <div class="text-body-1 mb-2" style="white-space: pre-wrap;">
                {{ getPreviewText() }}
              </div>
              <div v-if="hashtags.length > 0" class="text-caption text-grey mt-2">
                {{ hashtags.join(' ') }}
              </div>
              <div class="text-caption text-grey mt-2">
                Character count: {{ getPreviewText().length + (hashtags.length > 0 ? hashtags.join(' ').length : 0) }}
                <span v-if="previewPlatform === 'instagram' && (getPreviewText().length + (hashtags.length > 0 ? hashtags.join(' ').length : 0)) > 2200" class="text-error">
                  (Exceeds Instagram limit of 2200)
                </span>
              </div>
            </v-card-text>
          </v-card>

          <v-alert
            v-if="publishError"
            type="error"
            class="mt-4"
            closable
            @click:close="publishError = null"
          >
            {{ publishError }}
          </v-alert>

          <v-alert
            v-if="publishSuccess"
            type="success"
            class="mt-4"
          >
            <div v-for="(result, index) in publishResults" :key="index" class="mb-1">
              <strong>{{ result.platform }}</strong>: 
              <span v-if="result.success">{{ result.message }}</span>
              <span v-else class="text-error">{{ result.error }}</span>
            </div>
          </v-alert>
        </v-card-text>
        <v-card-actions class="pa-4" style="background: #f9fafb; border-top: 1px solid #e5e7eb; flex-shrink: 0;">
          <v-spacer></v-spacer>
          <v-btn
            @click="closePublishDialog"
            variant="text"
            style="font-weight: 500; text-transform: none;"
          >
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            @click="publishToSocialMedia"
            :loading="publishing"
            :disabled="selectedPlatforms.length === 0"
            variant="elevated"
            style="font-weight: 600; text-transform: none; letter-spacing: 0.3px;"
          >
            Publish Now
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    </v-container>
  </div>
</template>

<script>
import axios from 'axios';
import ConfirmationDialog from '../components/ConfirmationDialog.vue';

export default {
  name: 'Ads',
  components: {
    ConfirmationDialog
  },
  data() {
    return {
      loading: false,
      saving: false,
      generating: false,
      dialog: false,
      tab: 'generate',
      valid: false,
      ads: [],
      clients: [],
      editingAd: null,
      confirmDialog: false,
      confirmTitle: '',
      confirmMessage: '',
      confirmType: 'warning',
      confirmCallback: null,
      uploadFiles: [],
      uploadedFiles: [],
      adTypes: [
        { title: 'Image', value: 'image' },
        { title: 'Video', value: 'video' },
        { title: 'Carousel', value: 'carousel' },
        { title: 'Story', value: 'story' }
      ],
      generateForm: {
        prompt: '',
        clientId: null,
        type: 'image'
      },
      form: {
        title: '',
        description: '',
        type: 'image',
        clientId: null,
        channel: 'social',
        displayType: 'billboard',
        reach: null,
        engagement: null,
        spend: null,
        location: null,
        size: null,
        period: null,
        impressionsPerDay: null,
        startDate: null,
        endDate: null,
        content: {
          images: [],
          videos: [],
          text: ''
        }
      },
      channelOptions: [
        { title: 'Social Media', value: 'social' },
        { title: 'Email Marketing', value: 'email' },
        { title: 'Display Ads', value: 'display' },
        { title: 'Search Ads', value: 'search' }
      ],
      displayTypeOptions: [
        { title: 'Billboards', value: 'billboard' },
        { title: 'Digital Screens', value: 'digital' },
        { title: 'Delivery Box Ads', value: 'delivery' },
        { title: 'Taxi/Car Ads', value: 'taxi' }
      ],
      publishDialog: false,
      publishingAd: null,
      selectedPlatforms: [],
      whatsappPhone: '',
      publishing: false,
      publishError: null,
      publishSuccess: false,
      publishResults: [],
      showPreview: false,
      previewPlatform: 'facebook',
      hashtags: [],
      generatingHashtags: false,
      hashtagCount: 10
    };
  },
  computed: {
    clientOptions() {
      return [
        { title: 'None', value: null },
        ...this.clients.map(c => ({ title: c.name, value: c.id || c._id }))
      ];
    }
  },
  mounted() {
    this.loadClients();
    this.loadAds();
  },
  methods: {
    async loadClients() {
      try {
        const response = await axios.get('/clients');
        this.clients = response.data;
      } catch (error) {
        console.error('Error loading clients:', error);
      }
    },
    async loadAds() {
      this.loading = true;
      try {
        const response = await axios.get('/ads');
        this.ads = response.data;
      } catch (error) {
        console.error('Error loading ads:', error);
      } finally {
        this.loading = false;
      }
    },
    openDialog(ad = null) {
      this.editingAd = ad;
      if (ad) {
        this.form = {
          title: ad.title || '',
          description: ad.description || '',
          type: ad.type || 'image',
          clientId: ad.clientId?.id || ad.clientId?._id || null,
          channel: ad.channel || 'social',
          displayType: ad.displayType || 'billboard',
          reach: ad.reach != null ? Number(ad.reach) : null,
          engagement: ad.engagement != null ? Number(ad.engagement) : null,
          spend: ad.spend != null ? Number(ad.spend) : null,
          location: ad.location || null,
          size: ad.size || null,
          period: ad.period || null,
          impressionsPerDay: ad.impressionsPerDay != null ? Number(ad.impressionsPerDay) : null,
          startDate: ad.startDate || null,
          endDate: ad.endDate || null,
          content: ad.content || { images: [], videos: [], text: '' }
        };
        this.tab = 'manual';
      } else {
        this.resetForm();
        this.tab = 'generate';
      }
      this.dialog = true;
    },
    resetForm() {
      this.form = {
        title: '',
        description: '',
        type: 'image',
        clientId: null,
        channel: 'social',
        displayType: 'billboard',
        reach: null,
        engagement: null,
        spend: null,
        location: null,
        size: null,
        period: null,
        impressionsPerDay: null,
        startDate: null,
        endDate: null,
        content: {
          images: [],
          videos: [],
          text: ''
        }
      };
    this.generateForm = {
        prompt: '',
        clientId: null,
        type: 'image'
      };
      this.uploadedFiles = [];
    },
    async generateAd() {
      if (!this.generateForm.prompt || !this.generateForm.prompt.trim()) {
        this.$store.dispatch('showSnackbar', {
          text: 'Please enter a description for the ad',
          color: 'error'
        });
        return;
      }

      this.generating = true;
      try {
        const response = await axios.post('/ads/generate', this.generateForm);
        this.dialog = false;
        this.resetForm();
        this.loadAds();
        this.$store.dispatch('showSnackbar', {
          text: 'Ad generated successfully!',
          color: 'success'
        });
      } catch (error) {
        console.error('Error generating ad:', error);
        const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
        const userMessage = error.response?.status === 500 
          ? 'AI generation failed. Please check if OpenAI API key is configured in backend settings.'
          : `Error generating ad: ${errorMessage}`;
        
        this.$store.dispatch('showSnackbar', {
          text: userMessage,
          color: 'error'
        });
      } finally {
        this.generating = false;
      }
    },
    async handleFileUpload() {
      if (!this.uploadFiles || this.uploadFiles.length === 0) return;

      const formData = new FormData();
      this.uploadFiles.forEach(file => {
        formData.append('files', file);
      });

      try {
        const response = await axios.post('/upload/multiple', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        this.uploadedFiles = response.data.files;
        
        // Add to form content
        this.form.content.images = response.data.files
          .filter(f => f.mimetype.startsWith('image/'))
          .map(f => f.url);
        this.form.content.videos = response.data.files
          .filter(f => f.mimetype.startsWith('video/'))
          .map(f => f.url);
      } catch (error) {
        console.error('Error uploading files:', error);
      }
    },
    async saveAd() {
      this.saving = true;
      try {
        if (this.editingAd) {
          await axios.put(`/ads/${this.editingAd.id || this.editingAd._id}`, this.form);
        } else {
          await axios.post('/ads', this.form);
        }
        this.dialog = false;
        this.loadAds();
        this.$store.dispatch('showSnackbar', {
          text: this.editingAd ? 'Ad updated successfully!' : 'Ad created successfully!',
          color: 'success'
        });
      } catch (error) {
        console.error('Error saving ad:', error);
        this.$store.dispatch('showSnackbar', {
          text: 'Error saving ad: ' + (error.response?.data?.message || error.message),
          color: 'error'
        });
      } finally {
        this.saving = false;
      }
    },
    async deleteAd(ad) {
      this.confirmTitle = 'Delete Ad';
      this.confirmMessage = `Are you sure you want to delete "${ad.title}"? This action cannot be undone.`;
      this.confirmType = 'error';
      this.confirmCallback = async () => {
        try {
          await axios.delete(`/ads/${ad.id || ad._id}`);
          this.loadAds();
          this.$store.dispatch('showSnackbar', {
            text: 'Ad deleted successfully!',
            color: 'success'
          });
        } catch (error) {
          console.error('Error deleting ad:', error);
          this.$store.dispatch('showSnackbar', {
            text: 'Error deleting ad: ' + (error.response?.data?.message || error.message),
            color: 'error'
          });
        }
      };
      this.confirmDialog = true;
    },
    handleConfirm() {
      if (this.confirmCallback) {
        this.confirmCallback();
      }
      this.confirmDialog = false;
      this.confirmCallback = null;
    },
    getStatusColor(status) {
      const colors = {
        draft: 'grey',
        pending: 'orange',
        approved: 'blue',
        published: 'green',
        archived: 'red'
      };
      return colors[status] || 'grey';
    },
    getImageUrl(url) {
      if (!url) return '';
      if (url.startsWith('http')) return url;
      // If it starts with /uploads, use backend URL, otherwise use full URL
      if (url.startsWith('/uploads')) {
        return (process.env.VUE_APP_API_URL || 'https://marketing-pwa-backend.onrender.com') + url;
      }
      return url;
    },
    getPreviewText() {
      if (!this.publishingAd) return '';
      let text = this.publishingAd.description || this.publishingAd.content?.text || '';
      // Add hashtags if any
      if (this.hashtags.length > 0) {
        text += '\n\n' + this.hashtags.join(' ');
      }
      return text;
    },
    openPublishDialog(ad) {
      this.publishingAd = ad;
      this.selectedPlatforms = [];
      this.whatsappPhone = '';
        this.publishError = null;
        this.publishSuccess = false;
        this.publishResults = [];
        this.hashtags = [];
        this.previewPlatform = 'facebook';
        
        // Pre-fill WhatsApp phone if client has phone number
        if (ad.clientId && this.clients.length > 0) {
          const client = this.clients.find(c => (c.id || c._id) === (ad.clientId?.id || ad.clientId?._id));
          if (client && client.phoneNumber) {
            this.whatsappPhone = client.phoneNumber;
          }
        }
        
        this.publishDialog = true;
    },
    closePublishDialog() {
      this.publishDialog = false;
      this.publishingAd = null;
      this.selectedPlatforms = [];
      this.whatsappPhone = '';
      this.publishError = null;
      this.publishSuccess = false;
      this.publishResults = [];
      this.hashtags = [];
    },
    async generateHashtags() {
      if (!this.publishingAd) return;
      
      this.generatingHashtags = true;
      try {
        const content = this.publishingAd.description || this.publishingAd.content?.text || '';
        const platform = this.selectedPlatforms[0] || 'instagram';
        
        const response = await axios.post('/hashtags/generate', {
          content,
          platform,
          count: parseInt(this.hashtagCount) || 10
        });
        
        this.hashtags = response.data.hashtags;
        this.$store.dispatch('showSnackbar', {
          text: `Generated ${this.hashtags.length} hashtags!`,
          color: 'success'
        });
      } catch (error) {
        console.error('Error generating hashtags:', error);
        this.$store.dispatch('showSnackbar', {
          text: 'Error generating hashtags: ' + (error.response?.data?.message || error.message),
          color: 'error'
        });
      } finally {
        this.generatingHashtags = false;
      }
    },
    addHashtagToContent(hashtag) {
      if (this.publishingAd) {
        const currentText = this.publishingAd.description || this.publishingAd.content?.text || '';
        if (!currentText.includes(hashtag)) {
          this.publishingAd.description = currentText + ' ' + hashtag;
        }
      }
    },
    async publishToSocialMedia() {
      if (this.selectedPlatforms.length === 0) {
        this.publishError = 'Please select at least one platform';
        return;
      }

      if (this.selectedPlatforms.includes('whatsapp') && !this.whatsappPhone) {
        this.publishError = 'Phone number is required for WhatsApp';
        return;
      }

      this.publishing = true;
      this.publishError = null;
      this.publishSuccess = false;
      this.publishResults = [];

      try {
        const adId = this.publishingAd.id || this.publishingAd._id;
        const response = await axios.post('/social-media/publish', {
          adId,
          platforms: this.selectedPlatforms,
          phoneNumber: this.whatsappPhone
        });

        this.publishResults = response.data.results;
        this.publishSuccess = response.data.success;

        if (response.data.successful > 0) {
          // Update ad status to published
          await axios.put(`/ads/${adId}`, {
            ...this.publishingAd,
            status: 'published'
          });
          this.loadAds();
          
          this.$store.dispatch('showSnackbar', {
            text: `Successfully published to ${response.data.successful} platform(s)!`,
            color: 'success'
          });
        }

        if (response.data.successful < response.data.total) {
          this.publishError = `Some platforms failed. ${response.data.successful}/${response.data.total} successful.`;
          this.$store.dispatch('showSnackbar', {
            text: `Published to ${response.data.successful}/${response.data.total} platforms`,
            color: 'warning'
          });
        } else if (response.data.successful === 0) {
          this.$store.dispatch('showSnackbar', {
            text: 'Failed to publish to any platform',
            color: 'error'
          });
        }
      } catch (error) {
        console.error('Publish Error:', error);
        this.publishError = error.response?.data?.message || 'Error publishing to social media';
        this.$store.dispatch('showSnackbar', {
          text: this.publishError,
          color: 'error'
        });
      } finally {
        this.publishing = false;
      }
    }
  }
};
</script>

<style scoped>
.ads-container {
  background: #f9fafb;
  min-height: 100vh;
}

/* Ensure dialog content doesn't overlap */
:deep(.v-dialog .v-card) {
  display: flex !important;
  flex-direction: column !important;
}

:deep(.v-dialog .v-card-text) {
  overflow-y: auto !important;
  max-height: calc(90vh - 200px) !important;
}

:deep(.v-dialog .v-card-actions) {
  position: sticky;
  bottom: 0;
  z-index: 10;
}

/* Card actions: wrap on narrow cards so buttons don't overlap */
.ads-card-actions {
  flex-wrap: wrap;
  gap: 8px;
}

.ads-card-actions .v-btn {
  flex-shrink: 0;
}
</style>
