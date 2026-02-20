<template>
  <div class="templates-container">
    <v-container fluid class="pa-6">
      <!-- Header Section -->
      <v-row class="mb-6">
        <v-col cols="12">
          <div class="d-flex align-center justify-space-between flex-wrap">
            <div>
              <h1 class="text-h4 font-weight-bold mb-2" style="color: #1a1a1a; letter-spacing: -0.5px;">
                Email & SMS Templates
              </h1>
              <p class="text-body-1 mb-0" style="color: #6b7280;">
                Create and manage reusable templates for your email and SMS campaigns
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
              Create Template
            </v-btn>
          </div>
        </v-col>
      </v-row>

      <v-row>
        <!-- Filter Sidebar -->
        <v-col cols="12" md="3">
          <v-card
            elevation="0"
            style="border-radius: 12px; border: 1px solid #e5e7eb;"
          >
            <v-card-title 
              class="d-flex align-center pa-4"
              style="background: linear-gradient(135deg, #f9fafb 0%, #ffffff 100%); border-bottom: 1px solid #e5e7eb;"
            >
              <v-icon class="mr-2" color="primary" size="20">mdi-filter</v-icon>
              <span class="text-subtitle-1 font-weight-semibold" style="color: #1a1a1a;">Filters</span>
            </v-card-title>
            <v-card-text class="pa-4">
              <v-select
                v-model="filterType"
                :items="templateTypes"
                item-title="title"
                item-value="value"
                label="Template Type"
                clearable
                density="default"
                variant="outlined"
                hide-details
                style="background: #ffffff;"
                @update:model-value="loadTemplates"
              ></v-select>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Templates Grid -->
        <v-col cols="12" md="9">
          <v-row v-if="templates.length > 0">
            <v-col cols="12" md="6" v-for="template in templates" :key="template.id">
              <v-card
                elevation="0"
                style="border-radius: 12px; border: 1px solid #e5e7eb; transition: all 0.3s ease;"
                class="h-100 template-card"
                @mouseenter="hoveredTemplate = template.id"
                @mouseleave="hoveredTemplate = null"
                :class="{ 'elevation-4': hoveredTemplate === template.id }"
              >
                <v-card-title 
                  class="d-flex align-center pa-4"
                  style="background: linear-gradient(135deg, #f9fafb 0%, #ffffff 100%); border-bottom: 1px solid #e5e7eb;"
                >
                  <v-icon 
                    :color="getTypeColor(template.type)" 
                    class="mr-3"
                    size="24"
                  >
                    {{ getTypeIcon(template.type) }}
                  </v-icon>
                  <span class="text-h6 font-weight-semibold" style="color: #1a1a1a; flex: 1;">
                    {{ template.name }}
                  </span>
                  <v-chip
                    :color="getTypeColor(template.type)"
                    size="small"
                    variant="flat"
                    style="font-weight: 500; text-transform: uppercase; font-size: 10px; letter-spacing: 0.5px;"
                  >
                    {{ template.type }}
                  </v-chip>
                </v-card-title>
                <v-card-text class="pa-4">
                  <div class="text-body-2 mb-3" style="color: #374151; font-weight: 500;">
                    {{ template.subject || 'No subject' }}
                  </div>
                  <div class="text-body-2" style="color: #6b7280; line-height: 1.6;">
                    {{ template.content.substring(0, 120) }}{{ template.content.length > 120 ? '...' : '' }}
                  </div>
                </v-card-text>
                <v-card-actions class="pa-4" style="background: #f9fafb; border-top: 1px solid #e5e7eb;">
                  <v-btn
                    color="primary"
                    variant="text"
                    size="small"
                    prepend-icon="mdi-send"
                    @click="useTemplate(template)"
                    style="font-weight: 500; text-transform: none;"
                  >
                    Use
                  </v-btn>
                  <v-btn
                    color="primary"
                    variant="text"
                    size="small"
                    prepend-icon="mdi-pencil"
                    @click="openDialog(template)"
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
                    @click="deleteTemplate(template)"
                  ></v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>

          <v-card
            v-else
            elevation="0"
            style="border-radius: 12px; border: 1px solid #e5e7eb;"
          >
            <v-card-text class="pa-12 text-center">
              <v-icon size="64" color="grey-lighten-1" class="mb-4">mdi-file-document-outline</v-icon>
              <div class="text-h6 mb-2" style="color: #6b7280;">No templates found</div>
              <div class="text-body-2 mb-4" style="color: #9ca3af;">
                Create your first template to get started
              </div>
              <v-btn
                color="primary"
                prepend-icon="mdi-plus"
                @click="openDialog()"
                variant="elevated"
              >
                Create Template
              </v-btn>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- Confirmation Dialog -->
    <ConfirmationDialog
      v-model="confirmDialog"
      :title="confirmTitle"
      :message="confirmMessage"
      :type="confirmType"
      @confirm="handleConfirm"
    />

    <!-- Create/Edit Template Dialog -->
    <v-dialog v-model="dialog" max-width="700" persistent>
      <v-card style="border-radius: 12px; overflow: hidden;">
        <v-card-title 
          class="bg-primary text-white pa-4"
          style="font-weight: 600; letter-spacing: 0.3px;"
        >
          <v-icon class="mr-2" size="24">mdi-file-document-edit</v-icon>
          {{ editingTemplate ? 'Edit Template' : 'Create New Template' }}
        </v-card-title>
        <v-card-text class="pa-6">
          <v-form ref="form" v-model="valid">
            <v-text-field
              v-model="form.name"
              label="Template Name"
              required
              density="default"
              variant="outlined"
              hide-details
              style="background: #ffffff;"
            ></v-text-field>
            <v-select
              v-model="form.type"
              :items="templateTypes"
              item-title="title"
              item-value="value"
              label="Template Type"
              required
              density="default"
              variant="outlined"
              hide-details
              class="mt-4"
              style="background: #ffffff;"
            ></v-select>
            <v-text-field
              v-if="form.type === 'email'"
              v-model="form.subject"
              label="Email Subject"
              required
              density="default"
              variant="outlined"
              hide-details
              class="mt-4"
              style="background: #ffffff;"
            ></v-text-field>
            <v-textarea
              v-model="form.content"
              label="Content"
              rows="8"
              required
              density="default"
              variant="outlined"
              hide-details
              class="mt-4"
              style="background: #ffffff;"
              hint="Use {{clientName}}, {{businessName}}, {{email}} for variables"
              persistent-hint
            ></v-textarea>
          </v-form>
        </v-card-text>
        <v-card-actions class="pa-4" style="background: #f9fafb; border-top: 1px solid #e5e7eb;">
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
            @click="saveTemplate"
            :loading="saving"
            variant="elevated"
            style="font-weight: 600; text-transform: none; letter-spacing: 0.3px;"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import axios from 'axios';
import ConfirmationDialog from '../components/ConfirmationDialog.vue';

export default {
  name: 'Templates',
  components: {
    ConfirmationDialog
  },
  data() {
    return {
      loading: false,
      saving: false,
      dialog: false,
      valid: false,
      templates: [],
      filterType: null,
      editingTemplate: null,
      hoveredTemplate: null,
      confirmDialog: false,
      confirmTitle: '',
      confirmMessage: '',
      confirmType: 'warning',
      confirmCallback: null,
      templateTypes: [
        { title: 'Email', value: 'email' },
        { title: 'SMS', value: 'sms' }
      ],
      form: {
        name: '',
        type: 'email',
        subject: '',
        content: ''
      }
    };
  },
  mounted() {
    this.loadTemplates();
  },
  methods: {
    async loadTemplates() {
      this.loading = true;
      try {
        const params = {};
        if (this.filterType) params.type = this.filterType;
        const response = await axios.get('/templates', { params });
        this.templates = response.data;
      } catch (error) {
        console.error('Error loading templates:', error);
        this.$store.dispatch('showSnackbar', {
          text: 'Error loading templates',
          color: 'error'
        });
      } finally {
        this.loading = false;
      }
    },
    openDialog(template = null) {
      this.editingTemplate = template;
      if (template) {
        this.form = {
          name: template.name || '',
          type: template.type || 'email',
          subject: template.subject || '',
          content: template.content || ''
        };
      } else {
        this.resetForm();
      }
      this.dialog = true;
    },
    resetForm() {
      this.form = {
        name: '',
        type: 'email',
        subject: '',
        content: ''
      };
    },
    async saveTemplate() {
      this.saving = true;
      try {
        if (this.editingTemplate) {
          await axios.put(`/templates/${this.editingTemplate.id}`, this.form);
        } else {
          await axios.post('/templates', this.form);
        }
        this.dialog = false;
        this.loadTemplates();
        this.$store.dispatch('showSnackbar', {
          text: this.editingTemplate ? 'Template updated successfully!' : 'Template created successfully!',
          color: 'success'
        });
      } catch (error) {
        console.error('Error saving template:', error);
        this.$store.dispatch('showSnackbar', {
          text: 'Error saving template: ' + (error.response?.data?.message || error.message),
          color: 'error'
        });
      } finally {
        this.saving = false;
      }
    },
    async deleteTemplate(template) {
      this.confirmTitle = 'Delete Template';
      this.confirmMessage = `Are you sure you want to delete the template "${template.name}"? This action cannot be undone.`;
      this.confirmType = 'error';
      this.confirmCallback = async () => {
        try {
          await axios.delete(`/templates/${template.id}`);
          this.loadTemplates();
          this.$store.dispatch('showSnackbar', {
            text: 'Template deleted successfully!',
            color: 'success'
          });
        } catch (error) {
          console.error('Error deleting template:', error);
          this.$store.dispatch('showSnackbar', {
            text: 'Error deleting template: ' + (error.response?.data?.message || error.message),
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
    useTemplate(template) {
      if (template.type === 'email') {
        this.$router.push({ name: 'Email', query: { template: template.id } });
      } else if (template.type === 'sms') {
        this.$router.push({ name: 'SMS', query: { template: template.id } });
      }
      this.$store.dispatch('showSnackbar', {
        text: 'Template loaded!',
        color: 'success'
      });
    },
    getTypeIcon(type) {
      return type === 'email' ? 'mdi-email' : 'mdi-message-text';
    },
    getTypeColor(type) {
      return type === 'email' ? 'blue' : 'green';
    }
  }
};
</script>

<style scoped>
.templates-container {
  background: #f9fafb;
  min-height: 100vh;
}

.template-card {
  transition: all 0.3s ease;
}

.template-card:hover {
  transform: translateY(-2px);
}
</style>