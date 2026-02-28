<template>
  <div class="ads-container">
    <v-container fluid class="pa-6">
      <!-- Top-level tabs: Campaigns | Bulk Edit | Platform Specs | UTM & Export -->
      <v-tabs v-model="adsViewTab" class="mb-4" color="primary" style="border-bottom: 1px solid #e5e7eb;">
        <v-tab value="campaigns" style="font-weight: 600; text-transform: none;">Campaigns</v-tab>
        <v-tab value="bulk" style="font-weight: 600; text-transform: none;">Bulk Edit</v-tab>
        <v-tab value="specs" style="font-weight: 600; text-transform: none;">Platform Specs</v-tab>
        <v-tab value="utm" style="font-weight: 600; text-transform: none;">UTM & Export</v-tab>
      </v-tabs>
      <v-window v-model="adsViewTab">
        <v-window-item value="campaigns">
      <!-- Header Section -->
      <v-row class="mb-6">
        <v-col cols="12">
          <div class="d-flex align-center justify-space-between flex-wrap">
            <div class="clean-page-header" style="margin-bottom: 0;">
              <h1 class="clean-page-header__title">Campaigns</h1>
              <p class="clean-page-header__subtitle">Create, manage, and publish ads across multiple social media platforms.</p>
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

      <v-row v-if="(ads || []).length > 0">
        <v-col cols="12" md="4" v-for="ad in (ads || [])" :key="ad.id || ad._id">
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
                <span
                  v-if="ad.platform"
                  class="ads-platform-badge"
                  :style="{ background: getPlatformColor(ad.platform) + '22', borderColor: getPlatformColor(ad.platform), color: getPlatformColor(ad.platform) }"
                >
                  <span class="ads-platform-badge__icon">{{ getPlatformIcon(ad.platform) }}</span>
                  {{ getPlatformShortName(ad.platform) }}
                </span>
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
        </v-window-item>

        <!-- Bulk Edit -->
        <v-window-item value="bulk">
          <v-card elevation="0" class="pa-6" style="border: 1px solid #e5e7eb; border-radius: 12px;">
            <h2 class="text-h6 font-weight-bold mb-2" style="color: #1a1a1a;">Bulk Edit</h2>
            <p class="text-body-2 text-medium-emphasis mb-4">Apply one change to multiple ads.</p>
            <v-row class="mb-4">
              <v-col cols="12" md="4">
                <v-select
                  v-model="bulkField"
                  :items="bulkFieldItems"
                  item-title="label"
                  item-value="value"
                  label="Field to update"
                  density="default"
                  variant="outlined"
                  hide-details
                ></v-select>
              </v-col>
              <v-col cols="12" md="4">
                <v-select
                  v-if="bulkField === 'platform'"
                  v-model="bulkValue"
                  :items="ALL_PLATFORMS"
                  label="New value"
                  density="default"
                  variant="outlined"
                  hide-details
                ></v-select>
                <v-select
                  v-else-if="bulkField === 'cta'"
                  v-model="bulkValue"
                  :items="allCtas"
                  label="New value"
                  density="default"
                  variant="outlined"
                  hide-details
                ></v-select>
                <v-select
                  v-else-if="bulkField === 'status'"
                  v-model="bulkValue"
                  :items="['draft', 'pending', 'approved', 'published', 'archived']"
                  label="New status"
                  density="default"
                  variant="outlined"
                  hide-details
                ></v-select>
                <v-select
                  v-else-if="bulkField === 'channel'"
                  v-model="bulkValue"
                  :items="channelOptions"
                  item-title="title"
                  item-value="value"
                  label="New channel"
                  density="default"
                  variant="outlined"
                  hide-details
                ></v-select>
                <v-text-field
                  v-else
                  v-model="bulkValue"
                  :label="'New value for ' + (bulkFieldItems.find(f => f.value === bulkField)?.label || bulkField)"
                  density="default"
                  variant="outlined"
                  hide-details
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="4" class="d-flex align-center">
                <v-btn color="primary" @click="applyBulk" :disabled="bulkSelectedIds.length === 0 || !bulkValue" variant="elevated">
                  Apply to {{ bulkSelectedIds.length }}
                </v-btn>
                <v-chip v-if="bulkFlash" color="success" class="ml-3">Applied!</v-chip>
              </v-col>
            </v-row>
            <div class="d-flex align-center gap-2 mb-3">
              <v-select
                v-model="bulkFilterPlatform"
                :items="[{ title: 'All platforms', value: 'All' }, ...(ALL_PLATFORMS || []).map(p => ({ title: p, value: p }))]"
                item-title="title"
                item-value="value"
                density="compact"
                variant="outlined"
                hide-details
                style="max-width: 200px;"
              ></v-select>
              <v-btn size="small" variant="outlined" @click="bulkToggleAll">{{ bulkSelectedIds.length === bulkFilteredAds.length ? 'Deselect all' : 'Select all' }}</v-btn>
              <span class="text-caption text-medium-emphasis">{{ bulkSelectedIds.length }} selected</span>
            </div>
            <div class="ads-bulk-header ads-bulk-row" style="background: #f3f4f6;">
              <div></div>
              <div>Campaign / Ad Set</div>
              <div>Headline</div>
              <div>Platform</div>
              <div>Format</div>
              <div>Status</div>
            </div>
            <div v-for="ad in bulkFilteredAds" :key="ad.id || ad._id" class="ads-bulk-row" :class="{ selected: bulkSelectedIds.includes(ad.id || ad._id) }" @click="bulkToggleAd(ad)">
              <div @click.stop>
                <v-checkbox hide-details :model-value="bulkSelectedIds.includes(ad.id || ad._id)" color="primary" density="compact" @click.stop="bulkToggleAd(ad)" />
              </div>
              <div class="text-truncate">{{ ad.campaign || ad.title }} / {{ ad.adset || '—' }}</div>
              <div class="text-truncate">{{ ad.headline || ad.title }}</div>
              <div>
                <span v-if="ad.platform" class="ads-platform-badge ads-platform-badge--sm" :style="{ background: getPlatformColor(ad.platform) + '22', borderColor: getPlatformColor(ad.platform), color: getPlatformColor(ad.platform) }">{{ getPlatformShortName(ad.platform) }}</span>
                <span v-else>—</span>
              </div>
              <div class="text-caption text-medium-emphasis">{{ ad.format || '—' }}</div>
              <v-chip size="x-small" :color="getStatusColor(ad.status)">{{ ad.status }}</v-chip>
            </div>
            <p v-if="bulkFilteredAds.length === 0" class="text-body-2 text-medium-emphasis pa-4">No ads to show. Create ads in the Campaigns tab.</p>
          </v-card>
        </v-window-item>

        <!-- Platform Specs -->
        <v-window-item value="specs">
          <v-card elevation="0" class="pa-6" style="border: 1px solid #e5e7eb; border-radius: 12px;">
            <h2 class="text-h6 font-weight-bold mb-4" style="color: #1a1a1a;">Platform Specs</h2>
            <v-tabs v-model="specsPlatform" class="mb-4">
              <v-tab v-for="p in (ALL_PLATFORMS || [])" :key="p" :value="p" style="text-transform: none;">{{ getPlatformShortName(p) }}</v-tab>
            </v-tabs>
            <v-window v-model="specsPlatform">
              <v-window-item v-for="p in (ALL_PLATFORMS || [])" :key="p" :value="p">
                <div v-if="PLATFORMS[p]" class="ads-specs-grid">
                  <div class="ads-specs-card">
                    <div class="ads-specs-label">Character limits</div>
                    <div v-for="(val, key) in PLATFORMS[p].limits" :key="key" class="d-flex justify-space-between mb-2">
                      <span class="text-caption">{{ key }}</span>
                      <strong :style="{ color: getPlatformColor(p) }">{{ val }}</strong>
                    </div>
                  </div>
                  <div class="ads-specs-card">
                    <div class="ads-specs-label">Formats</div>
                    <div class="flex-wrap">
                      <span v-for="f in PLATFORMS[p].formats" :key="f" class="ads-specs-tag">{{ f }}</span>
                    </div>
                  </div>
                  <div class="ads-specs-card">
                    <div class="ads-specs-label">Placements</div>
                    <div class="flex-wrap">
                      <span v-for="pl in PLATFORMS[p].placements" :key="pl" class="ads-specs-tag">{{ pl }}</span>
                    </div>
                  </div>
                  <div class="ads-specs-card">
                    <div class="ads-specs-label">CTAs</div>
                    <div class="flex-wrap">
                      <span v-for="c in PLATFORMS[p].ctas" :key="c" class="ads-specs-tag">{{ c }}</span>
                    </div>
                  </div>
                  <div class="ads-specs-card">
                    <div class="ads-specs-label">Objectives</div>
                    <div class="flex-wrap">
                      <span v-for="a in PLATFORMS[p].adTypes" :key="a" class="ads-specs-tag">{{ a }}</span>
                    </div>
                  </div>
                </div>
                <p v-if="PLATFORMS[p].note" class="text-body-2 text-medium-emphasis mt-4">{{ PLATFORMS[p].note }}</p>
              </v-window-item>
            </v-window>
          </v-card>
        </v-window-item>

        <!-- UTM & Export -->
        <v-window-item value="utm">
          <v-card elevation="0" class="pa-6" style="border: 1px solid #e5e7eb; border-radius: 12px;">
            <h2 class="text-h6 font-weight-bold mb-2" style="color: #1a1a1a;">UTM & Export</h2>
            <p class="text-body-2 text-medium-emphasis mb-4">Tracking params and CSV export for all ads.</p>
            <v-row>
              <v-col cols="12" md="3">
                <v-select
                  v-model="utmAdId"
                  :items="ads || []"
                  :item-title="(a) => (a.title || 'Ad') + (a.platform ? ' (' + getPlatformShortName(a.platform) + ')' : '')"
                  item-value="id"
                  label="Select ad"
                  density="default"
                  variant="outlined"
                  hide-details
                  clearable
                ></v-select>
              </v-col>
            </v-row>
            <template v-if="selectedUtmAd">
              <div class="ads-utm-panel mt-4">
                <div class="ads-specs-label mb-2">UTM params</div>
                <div v-for="row in utmParamRows" :key="row.key" class="ads-utm-param">
                  <span class="ads-utm-key">{{ row.key }}</span>
                  <span class="ads-utm-val">{{ row.val }}</span>
                </div>
              </div>
              <div class="ads-utm-panel mt-4">
                <div class="ads-specs-label mb-2">Ad name</div>
                <div class="d-flex align-center gap-2">
                  <span class="flex-grow-1" style="font-family: monospace;">{{ currentAdName }}</span>
                  <v-btn size="small" variant="outlined" @click="copyUtm(currentAdName, 'name')">{{ utmCopied === 'name' ? 'Copied!' : 'Copy' }}</v-btn>
                </div>
              </div>
              <div class="ads-utm-panel mt-4">
                <div class="ads-specs-label mb-2">Full URL with UTM</div>
                <div class="d-flex align-center gap-2 flex-wrap">
                  <span class="flex-grow-1 text-break" style="font-size: 12px;">{{ selectedUtmAd.destinationUrl || selectedUtmAd.url || '' }}{{ currentUtm ? '?' + currentUtm : '' }}</span>
                  <v-btn size="small" variant="outlined" @click="copyUtm((selectedUtmAd.destinationUrl || selectedUtmAd.url || '') + (currentUtm ? '?' + currentUtm : ''), 'url')">{{ utmCopied === 'url' ? 'Copied!' : 'Copy' }}</v-btn>
                </div>
              </div>
            </template>
            <div class="mt-6">
              <div class="text-subtitle-2 font-weight-bold mb-2">Export all ads to CSV</div>
              <p class="text-body-2 text-medium-emphasis mb-2">Includes ad name, campaign, ad set, platform, headline, CTA, base URL, and full tracking URL.</p>
              <v-btn color="primary" variant="elevated" @click="exportCsv">Export CSV</v-btn>
            </div>
          </v-card>
        </v-window-item>
      </v-window>

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
                  hide-details="auto"
                  class="app-select"
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
                  hide-details="auto"
                  class="app-select mt-4"
                  style="background: #ffffff;"
                ></v-select>
                <v-textarea
                  v-model="generateForm.prompt"
                  label="Describe the ad you want to generate"
                  rows="4"
                  required
                  density="default"
                  variant="outlined"
                  hide-details="auto"
                  class="app-select mt-4"
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
                  hide-details="auto"
                  class="app-select"
                  style="background: #ffffff;"
                ></v-text-field>
                <v-row class="mt-4">
                  <v-col cols="12" sm="6">
                    <v-text-field
                      v-model="form.campaign"
                      label="Campaign"
                      density="default"
                      variant="outlined"
                      hide-details="auto"
                      class="app-select"
                      style="background: #ffffff;"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      v-model="form.adset"
                      label="Ad Set"
                      density="default"
                      variant="outlined"
                      hide-details="auto"
                      class="app-select"
                      style="background: #ffffff;"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-select
                  v-model="form.platform"
                  :items="ALL_PLATFORMS"
                  label="Platform (for specs & UTM)"
                  density="default"
                  variant="outlined"
                  hide-details="auto"
                  clearable
                  class="app-select mt-4"
                  style="background: #ffffff;"
                ></v-select>
                <template v-if="form.platform && PLATFORMS[form.platform]">
                  <v-row class="mt-4">
                    <v-col cols="12" sm="6">
                      <v-select
                        v-model="form.format"
                        :items="PLATFORMS[form.platform].formats"
                        label="Format"
                        density="default"
                        variant="outlined"
                        hide-details="auto"
                        class="app-select"
                        style="background: #ffffff;"
                      ></v-select>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-select
                        v-model="form.placement"
                        :items="PLATFORMS[form.platform].placements"
                        label="Placement"
                        density="default"
                        variant="outlined"
                        hide-details="auto"
                        class="app-select"
                        style="background: #ffffff;"
                      ></v-select>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" sm="6">
                      <v-select
                        v-model="form.adType"
                        :items="PLATFORMS[form.platform].adTypes"
                        label="Objective"
                        density="default"
                        variant="outlined"
                        hide-details="auto"
                        class="app-select"
                        style="background: #ffffff;"
                      ></v-select>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-select
                        v-model="form.cta"
                        :items="PLATFORMS[form.platform].ctas"
                        label="CTA Button"
                        density="default"
                        variant="outlined"
                        hide-details="auto"
                        class="app-select"
                        style="background: #ffffff;"
                      ></v-select>
                    </v-col>
                  </v-row>
                  <v-text-field
                    v-if="getPlatformLimits(form.platform).headline > 0"
                    v-model="form.headline"
                    :label="'Headline (max ' + getPlatformLimits(form.platform).headline + ')'"
                    density="default"
                    variant="outlined"
                    hide-details="auto"
                    class="app-select mt-4"
                    style="background: #ffffff;"
                  ></v-text-field>
                  <div v-if="form.platform && getPlatformLimits(form.platform).headline > 0" class="ads-char-bar mt-1">
                    <div class="ads-char-bar-track">
                      <div
                        class="ads-char-bar-fill"
                        :class="charBarClass((form.headline || '').length, getPlatformLimits(form.platform).headline)"
                        :style="{ width: Math.min(((form.headline || '').length / getPlatformLimits(form.platform).headline) * 100, 100) + '%' }"
                      ></div>
                    </div>
                    <span class="ads-char-bar-count" :class="{ over: (form.headline || '').length > getPlatformLimits(form.platform).headline }">{{ (form.headline || '').length }} / {{ getPlatformLimits(form.platform).headline }}</span>
                  </div>
                </template>
                <v-text-field
                  v-model="form.destinationUrl"
                  label="Destination URL"
                  density="default"
                  variant="outlined"
                  hide-details="auto"
                  class="app-select mt-4"
                  style="background: #ffffff;"
                  placeholder="https://..."
                ></v-text-field>
                <v-textarea
                  v-model="form.description"
                  :label="form.platform && getPlatformLimits(form.platform).description < 999 ? 'Description (max ' + getPlatformLimits(form.platform).description + ')' : 'Description'"
                  rows="3"
                  density="default"
                  variant="outlined"
                  hide-details="auto"
                  class="app-select mt-4"
                  style="background: #ffffff;"
                ></v-textarea>
                <div v-if="form.platform && getPlatformLimits(form.platform).description < 999" class="ads-char-bar mt-1">
                  <div class="ads-char-bar-track">
                    <div
                      class="ads-char-bar-fill"
                      :class="charBarClass((form.description || '').length, getPlatformLimits(form.platform).description)"
                      :style="{ width: Math.min(((form.description || '').length / getPlatformLimits(form.platform).description) * 100, 100) + '%' }"
                    ></div>
                  </div>
                  <span class="ads-char-bar-count" :class="{ over: (form.description || '').length > getPlatformLimits(form.platform).description }">{{ (form.description || '').length }} / {{ getPlatformLimits(form.platform).description }}</span>
                </div>
                <!-- Ad Spec Advisor -->
                <div v-if="form.platform" class="mt-6 pa-4 rounded-lg" style="background: #f0fdf4; border: 1px solid #bbf7d0;">
                  <div class="d-flex align-center mb-3">
                    <v-icon color="primary" size="22" class="mr-2">mdi-auto-fix</v-icon>
                    <span class="font-weight-bold">Ad Spec Advisor</span>
                  </div>
                  <p class="text-body-2 text-medium-emphasis mb-3">Recommendations for best results on {{ form.platform }}.</p>
                  <div v-if="advisorSpecs" class="text-body-2 mb-3">
                    <span v-if="advisorSpecs.headline?.tip" class="d-block mb-1"><strong>Headline:</strong> {{ advisorSpecs.headline.tip }}</span>
                    <span v-if="advisorSpecs.description?.tip" class="d-block mb-1"><strong>Description:</strong> {{ advisorSpecs.description.tip }}</span>
                    <span v-if="advisorSpecs.creative?.tip" class="d-block mb-1"><strong>Creative:</strong> {{ advisorSpecs.creative.tip }}</span>
                  </div>
                  <div v-if="advisorAdvice && (advisorAdvice.compliance?.length || advisorAdvice.optimizations?.length)">
                    <div v-for="c in advisorAdvice.compliance" :key="'c-'+c.field" class="d-flex align-center mb-1">
                      <v-icon v-if="c.status === 'ok'" color="success" size="18" class="mr-2">mdi-check-circle</v-icon>
                      <v-icon v-else color="error" size="18" class="mr-2">mdi-alert-circle</v-icon>
                      <span class="text-caption">{{ c.status === 'ok' ? c.field + ' ' + c.current + '/' + c.max : c.message }}</span>
                    </div>
                    <div v-for="(o, i) in advisorAdvice.optimizations" :key="'o-'+i" class="d-flex align-center mb-1">
                      <v-icon color="primary" size="18" class="mr-2">mdi-lightbulb-outline</v-icon>
                      <span class="text-caption">{{ o.tip }}</span>
                    </div>
                  </div>
                  <v-btn size="small" variant="tonal" color="primary" class="mt-2" @click="runAdvisorAdvise" :loading="advisorLoading">Check my copy</v-btn>
                </div>
                <v-select
                  v-model="form.type"
                  :items="adTypes"
                  item-title="title"
                  item-value="value"
                  label="Ad Type"
                  required
                  density="default"
                  variant="outlined"
                  hide-details="auto"
                  class="app-select mt-4"
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
                  hide-details="auto"
                  class="app-select mt-4"
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
                  hide-details="auto"
                  class="app-select mt-4"
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
                    hide-details="auto"
                    class="app-select mt-4"
                    style="background: #ffffff;"
                  ></v-select>
                  <v-text-field
                    v-model="form.location"
                    label="Location (e.g. San Francisco, CA)"
                    density="default"
                    variant="outlined"
                    hide-details="auto"
                    class="app-select mt-4"
                    style="background: #ffffff;"
                  ></v-text-field>
                  <v-row class="mt-4">
                    <v-col cols="12" sm="6">
                      <v-text-field
                        v-model="form.size"
                        label="Size (e.g. 14x48 ft)"
                        density="default"
                        variant="outlined"
                        hide-details="auto"
                        class="app-select"
                        style="background: #ffffff;"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        v-model="form.period"
                        label="Period (e.g. 3 months)"
                        density="default"
                        variant="outlined"
                        hide-details="auto"
                        class="app-select"
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
                        hide-details="auto"
                        class="app-select"
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
                        hide-details="auto"
                        class="app-select"
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
                        hide-details="auto"
                        class="app-select"
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
                      hide-details="auto"
                      class="app-select"
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
                      hide-details="auto"
                      class="app-select"
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
                      hide-details="auto"
                      class="app-select"
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
                  hide-details="auto"
                  class="app-select mt-4"
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
                  hide-details="auto"
                  class="app-select"
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
            color="primary"
            @click="tab === 'generate' ? generateAd() : saveAd()"
            :loading="tab === 'generate' ? generating : saving"
            :disabled="tab === 'generate' && !generateForm.prompt?.trim()"
            variant="elevated"
            style="font-weight: 600; text-transform: none; letter-spacing: 0.3px;"
          >
            {{ tab === 'generate' ? 'Generate & Save' : 'Save' }}
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
import {
  PLATFORMS,
  ALL_PLATFORMS,
  generateUTM,
  generateAdName,
  getPlatformColor,
  getPlatformIcon,
  getPlatformShortName,
  getPlatformLimits
} from '../config/adPlatforms';
import '../assets/styles/ads-adflow.css';

export default {
  name: 'Ads',
  components: {
    ConfirmationDialog
  },
  data() {
    return {
      adsViewTab: 'campaigns',
      bulkFilterPlatform: 'All',
      bulkSelectedIds: [],
      bulkField: 'campaign',
      bulkValue: '',
      bulkFlash: false,
      specsPlatform: 'Meta Ads',
      utmAdId: null,
      utmCopied: '',
      advisorSpecs: null,
      advisorAdvice: null,
      advisorLoading: false,
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
        campaign: '',
        adset: '',
        platform: '',
        format: '',
        placement: '',
        adType: '',
        cta: '',
        headline: '',
        destinationUrl: '',
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
      const list = this.clients || [];
      return [
        { title: 'None', value: null },
        ...list.map(c => ({ title: c.name, value: c.id || c._id }))
      ];
    },
    bulkFieldItems() {
      return [
        { label: 'Campaign', value: 'campaign' },
        { label: 'Ad Set', value: 'adset' },
        { label: 'Platform', value: 'platform' },
        { label: 'Format', value: 'format' },
        { label: 'Placement', value: 'placement' },
        { label: 'Objective', value: 'adType' },
        { label: 'CTA', value: 'cta' },
        { label: 'Headline', value: 'headline' },
        { label: 'Destination URL', value: 'destinationUrl' },
        { label: 'Status', value: 'status' },
        { label: 'Channel', value: 'channel' }
      ];
    },
    bulkFilteredAds() {
      const list = this.ads || [];
      if (this.bulkFilterPlatform === 'All') return list;
      return list.filter(a => a.platform === this.bulkFilterPlatform);
    },
    selectedUtmAd() {
      if (!this.utmAdId) return this.ads[0] || null;
      const list = this.ads || [];
      return list.find(a => (a.id || a._id) === this.utmAdId) || list[0] || null;
    },
    currentUtm() {
      const ad = this.selectedUtmAd;
      if (!ad) return '';
      return generateUTM(ad.campaign || ad.title, ad.adset || '', ad.headline || ad.title, ad.platform || '');
    },
    currentAdName() {
      const ad = this.selectedUtmAd;
      if (!ad) return '';
      const list = this.ads || [];
      const idx = list.findIndex(a => (a.id || a._id) === (ad.id || ad._id));
      return generateAdName(ad.campaign || ad.title, ad.adset || '', idx, ad.platform || '');
    },
    utmParamRows() {
      const ad = this.selectedUtmAd;
      if (!ad) return [];
      const src = (ad.platform && PLATFORMS[ad.platform]) ? PLATFORMS[ad.platform].utmSource : (ad.platform || '').toLowerCase().replace(/\s+/g, '_');
      return [
        { key: 'utm_source', val: src },
        { key: 'utm_medium', val: 'paid_social' },
        { key: 'utm_campaign', val: (ad.campaign || ad.title || '').toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '') },
        { key: 'utm_content', val: (ad.adset || '').toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '') },
        { key: 'utm_term', val: (ad.headline || ad.title || '').slice(0, 30).toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '') }
      ];
    },
    allCtas() {
      const set = new Set();
      ALL_PLATFORMS.forEach(p => { (PLATFORMS[p].ctas || []).forEach(c => set.add(c)); });
      return Array.from(set).sort();
    }
  },
  mounted() {
    this.loadClients();
    this.loadAds();
  },
  watch: {
    ads(val) {
      if (val && val.length && !this.utmAdId) this.utmAdId = val[0].id || val[0]._id;
    },
    'form.platform'(val) {
      this.advisorAdvice = null;
      if (val) this.loadAdvisorSpecs();
      else this.advisorSpecs = null;
    }
  },
  methods: {
    async loadClients() {
      try {
        const response = await axios.get('/clients');
        this.clients = Array.isArray(response.data) ? response.data : [];
      } catch (error) {
        console.error('Error loading clients:', error);
      }
    },
    async loadAds() {
      this.loading = true;
      try {
        const response = await axios.get('/ads');
        this.ads = Array.isArray(response.data) ? response.data : [];
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
          clientId: (ad.clientId && (typeof ad.clientId === 'object' ? (ad.clientId.id || ad.clientId._id) : ad.clientId)) || null,
          channel: ad.channel || 'social',
          campaign: ad.campaign || '',
          adset: ad.adset || '',
          platform: ad.platform || '',
          format: ad.format || '',
          placement: ad.placement || '',
          adType: ad.adType || '',
          cta: ad.cta || '',
          headline: ad.headline || '',
          destinationUrl: ad.destinationUrl || ad.destination_url || '',
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
        campaign: '',
        adset: '',
        platform: '',
        format: '',
        placement: '',
        adType: '',
        cta: '',
        headline: '',
        destinationUrl: '',
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
    bulkToggleAd(ad) {
      const id = ad.id || ad._id;
      if (this.bulkSelectedIds.includes(id)) {
        this.bulkSelectedIds = this.bulkSelectedIds.filter(x => x !== id);
      } else {
        this.bulkSelectedIds = [...this.bulkSelectedIds, id];
      }
    },
    bulkToggleAll() {
      if (this.bulkSelectedIds.length === this.bulkFilteredAds.length) {
        this.bulkSelectedIds = [];
      } else {
        this.bulkSelectedIds = this.bulkFilteredAds.map(a => a.id || a._id);
      }
    },
    async applyBulk() {
      if (!this.bulkValue || this.bulkSelectedIds.length === 0) return;
      try {
        await axios.patch('/ads/bulk', {
          ids: this.bulkSelectedIds,
          field: this.bulkField,
          value: this.bulkValue
        });
        this.loadAds();
        this.bulkFlash = true;
        setTimeout(() => { this.bulkFlash = false; }, 2500);
        this.$store.dispatch('showSnackbar', { text: 'Bulk update applied.', color: 'success' });
      } catch (e) {
        this.$store.dispatch('showSnackbar', { text: e.response?.data?.message || e.message || 'Bulk update failed', color: 'error' });
      }
    },
    copyUtm(text, key) {
      if (!text) return;
      navigator.clipboard.writeText(text).then(() => {
        this.utmCopied = key;
        setTimeout(() => { this.utmCopied = ''; }, 2000);
        this.$store.dispatch('showSnackbar', { text: 'Copied to clipboard', color: 'success' });
      });
    },
    exportCsv() {
      const headers = 'Ad Name,Campaign,Ad Set,Platform,Format,Headline,CTA,Base URL,Full Tracking URL';
      const list = this.ads || [];
      const rows = list.map((a, i) => {
        const name = generateAdName(a.campaign || a.title, a.adset || '', i, a.platform || '');
        const utm = generateUTM(a.campaign || a.title, a.adset || '', a.headline || a.title, a.platform || '');
        const base = a.destinationUrl || a.url || '';
        const full = base ? (base.includes('?') ? base + '&' + utm : base + '?' + utm) : utm;
        return `"${(name || '').replace(/"/g, '""')}","${(a.campaign || a.title || '').replace(/"/g, '""')}","${(a.adset || '').replace(/"/g, '""')}","${(a.platform || '').replace(/"/g, '""')}","${(a.format || '').replace(/"/g, '""')}","${(a.headline || a.title || '').replace(/"/g, '""')}","${(a.cta || '').replace(/"/g, '""')}","${(base || '').replace(/"/g, '""')}","${full.replace(/"/g, '""')}"`;
      });
      const csv = [headers, ...rows].join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'adflow_export_' + new Date().toISOString().slice(0, 10) + '.csv';
      a.click();
      URL.revokeObjectURL(url);
      this.$store.dispatch('showSnackbar', { text: 'CSV downloaded', color: 'success' });
    },
    async loadAdvisorSpecs() {
      if (!this.form.platform) return;
      try {
        const { data } = await axios.get('/optimization/recommendations', {
          params: { platform: this.form.platform }
        });
        this.advisorSpecs = data.found ? data : null;
      } catch (e) {
        this.advisorSpecs = null;
      }
    },
    async runAdvisorAdvise() {
      if (!this.form.platform) return;
      this.advisorLoading = true;
      this.advisorAdvice = null;
      try {
        const { data } = await axios.post('/optimization/advise', {
          platform: this.form.platform,
          headline: this.form.headline || undefined,
          description: this.form.description || undefined
        });
        this.advisorAdvice = data;
      } catch (e) {
        this.$store.dispatch('showSnackbar', { text: e.response?.data?.message || 'Could not get advice', color: 'error' });
      } finally {
        this.advisorLoading = false;
      }
    },
    charBarClass(current, max) {
      if ((current || 0) > max) return 'ads-char-bar-fill--over';
      if ((current || 0) > max * 0.8) return 'ads-char-bar-fill--warn';
      return 'ads-char-bar-fill--ok';
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
