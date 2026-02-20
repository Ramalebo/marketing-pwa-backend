<template>
  <div class="page-view clients-page">
    <div class="page-header page-view__header mb-4">
      <div>
        <h1 class="page-title">Clients</h1>
        <p class="page-subtitle">Manage your clients and their contact information</p>
      </div>
      <v-btn color="primary" prepend-icon="mdi-plus" @click="openDialog()" variant="elevated" size="default" class="page-view__action">
        Add Client
      </v-btn>
    </div>

    <div class="page-view__content">
      <div class="card">
        <div class="card-header">
          <v-icon color="primary" size="24" class="mr-2">mdi-account-group</v-icon>
          <span class="card-title">Clients</span>
          <v-spacer></v-spacer>
          <v-text-field
            v-model="searchQuery"
            prepend-inner-icon="mdi-magnify"
            label="Search clients..."
            variant="outlined"
            density="compact"
            hide-details
            clearable
            class="clients-search"
            @update:model-value="filterClients"
          ></v-text-field>
        </div>
        <div class="card-body pa-0">
          <v-data-table
            :headers="headers"
            :items="filteredClients"
            :loading="loading"
            @click:row="editClient"
            class="elevation-0 dra-data-table"
            :items-per-page="10"
            :items-per-page-options="[10, 25, 50]"
          >
            <template v-slot:item.socialMedia="{ item }">
              <div class="d-flex align-center ga-2">
                <v-icon v-if="item.socialMedia?.facebook" color="blue" size="20">mdi-facebook</v-icon>
                <v-icon v-if="item.socialMedia?.instagram" color="pink" size="20">mdi-instagram</v-icon>
                <v-icon v-if="item.socialMedia?.twitter" color="light-blue" size="20">mdi-twitter</v-icon>
                <v-icon v-if="item.socialMedia?.linkedin" color="blue-darken-2" size="20">mdi-linkedin</v-icon>
                <span v-if="!item.socialMedia?.facebook && !item.socialMedia?.instagram && !item.socialMedia?.twitter && !item.socialMedia?.linkedin" class="text-muted">—</span>
              </div>
            </template>
            <template v-slot:item.location.city="{ item }">
              <span class="text-secondary">
                {{ item.location?.city || '—' }}
              </span>
            </template>
            <template v-slot:item.actions="{ item }">
              <div class="d-flex align-center ga-2">
                <v-btn
                  icon="mdi-pencil"
                  size="small"
                  variant="text"
                  color="primary"
                  @click.stop="editClient(item)"
                  style="min-width: 36px;"
                ></v-btn>
                <v-btn
                  icon="mdi-delete"
                  size="small"
                  variant="text"
                  color="error"
                  @click.stop="deleteClient(item)"
                  style="min-width: 36px;"
                ></v-btn>
              </div>
            </template>
            <template v-slot:no-data>
              <div class="empty-state">
                <div class="empty-state-icon">
                  <v-icon size="40" color="primary">mdi-account-group-outline</v-icon>
                </div>
                <h3>No clients found</h3>
                <p>Add your first client to get started</p>
                <v-btn
                  color="primary"
                  prepend-icon="mdi-plus"
                  @click="openDialog()"
                  variant="elevated"
                >
                  Add Client
                </v-btn>
              </div>
            </template>
          </v-data-table>
        </div>
      </div>
    </div>

    <!-- Confirmation Dialog -->
    <ConfirmationDialog
      v-model="confirmDialog"
      :title="confirmTitle"
      :message="confirmMessage"
      :type="confirmType"
      @confirm="handleConfirm"
    />

    <!-- Add/Edit Client Dialog -->
    <v-dialog v-model="dialog" max-width="800" persistent scrollable>
      <v-card class="client-form-dialog">
        <v-card-title 
          class="bg-primary text-white pa-4 d-flex align-center client-form-dialog__title"
        >
          <v-icon class="mr-2" size="24">mdi-account-plus</v-icon>
          {{ editingClient ? 'Edit Client' : 'Add New Client' }}
          <v-spacer></v-spacer>
          <v-btn
            icon="mdi-close"
            variant="text"
            @click="dialog = false"
            style="color: white;"
          ></v-btn>
        </v-card-title>
        <v-card-text class="pa-6 client-form-dialog__body">
          <v-form ref="form" v-model="valid">
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.name"
                  label="Name"
                  required
                  density="default"
                  variant="outlined"
                  hide-details
                  style="background: #ffffff;"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.businessName"
                  label="Business Name"
                  density="default"
                  variant="outlined"
                  hide-details
                  style="background: #ffffff;"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row class="mt-2">
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.phoneNumber"
                  label="Phone Number"
                  required
                  density="default"
                  variant="outlined"
                  hide-details
                  style="background: #ffffff;"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.email"
                  label="Email"
                  type="email"
                  required
                  density="default"
                  variant="outlined"
                  hide-details
                  style="background: #ffffff;"
                ></v-text-field>
              </v-col>
            </v-row>
            
            <v-divider class="my-6"></v-divider>
            <h3 class="mb-4" style="color: #1a1a1a; font-weight: 600; font-size: 16px;">Social Media</h3>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.socialMedia.facebook"
                  label="Facebook URL"
                  prepend-inner-icon="mdi-facebook"
                  density="default"
                  variant="outlined"
                  hide-details
                  style="background: #ffffff;"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.socialMedia.instagram"
                  label="Instagram URL"
                  prepend-inner-icon="mdi-instagram"
                  density="default"
                  variant="outlined"
                  hide-details
                  style="background: #ffffff;"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row class="mt-2">
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.socialMedia.twitter"
                  label="Twitter URL"
                  prepend-inner-icon="mdi-twitter"
                  density="default"
                  variant="outlined"
                  hide-details
                  style="background: #ffffff;"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.socialMedia.linkedin"
                  label="LinkedIn URL"
                  prepend-inner-icon="mdi-linkedin"
                  density="default"
                  variant="outlined"
                  hide-details
                  style="background: #ffffff;"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row class="mt-2">
              <v-col cols="12">
                <v-text-field
                  v-model="form.socialMedia.website"
                  label="Website URL"
                  prepend-inner-icon="mdi-web"
                  density="default"
                  variant="outlined"
                  hide-details
                  style="background: #ffffff;"
                ></v-text-field>
              </v-col>
            </v-row>
            
            <v-divider class="my-6"></v-divider>
            <h3 class="mb-4" style="color: #1a1a1a; font-weight: 600; font-size: 16px;">Location</h3>
            <v-text-field
              v-model="form.location.address"
              label="Address"
              density="default"
              variant="outlined"
              hide-details
              style="background: #ffffff;"
            ></v-text-field>
            <v-row class="mt-2">
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.location.city"
                  label="City"
                  density="default"
                  variant="outlined"
                  hide-details
                  style="background: #ffffff;"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.location.state"
                  label="State"
                  density="default"
                  variant="outlined"
                  hide-details
                  style="background: #ffffff;"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row class="mt-2">
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.location.country"
                  label="Country"
                  density="default"
                  variant="outlined"
                  hide-details
                  style="background: #ffffff;"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.location.zipCode"
                  label="Zip Code"
                  density="default"
                  variant="outlined"
                  hide-details
                  style="background: #ffffff;"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions class="pa-4 client-form-dialog__actions">
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
            @click="saveClient"
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
  name: 'Clients',
  components: {
    ConfirmationDialog
  },
  data() {
    return {
      loading: false,
      saving: false,
      dialog: false,
      valid: false,
      clients: [],
      filteredClients: [],
      searchQuery: '',
      editingClient: null,
      confirmDialog: false,
      confirmTitle: '',
      confirmMessage: '',
      confirmType: 'warning',
      confirmCallback: null,
      headers: [
        { title: 'Name', key: 'name', sortable: true },
        { title: 'Business', key: 'businessName', sortable: true },
        { title: 'Phone', key: 'phoneNumber', sortable: false },
        { title: 'Email', key: 'email', sortable: true },
        { title: 'Social Media', key: 'socialMedia', sortable: false },
        { title: 'Location', key: 'location.city', sortable: true },
        { title: 'Actions', key: 'actions', sortable: false, align: 'end', width: '120px' }
      ],
      form: {
        name: '',
        businessName: '',
        phoneNumber: '',
        email: '',
        socialMedia: {
          facebook: '',
          instagram: '',
          twitter: '',
          linkedin: '',
          website: ''
        },
        location: {
          address: '',
          city: '',
          state: '',
          country: '',
          zipCode: ''
        },
        tags: ''
      }
    };
  },
  mounted() {
    this.loadClients();
  },
  methods: {
    async loadClients() {
      this.loading = true;
      try {
        const response = await axios.get('/clients');
        this.clients = response.data;
        this.filterClients();
      } catch (error) {
        console.error('Error loading clients:', error);
        this.$store.dispatch('showSnackbar', {
          text: 'Error loading clients',
          color: 'error'
        });
      } finally {
        this.loading = false;
      }
    },
    openDialog(client = null) {
      this.editingClient = client;
      if (client) {
        this.form = {
          name: client.name || '',
          businessName: client.businessName || '',
          phoneNumber: client.phoneNumber || '',
          email: client.email || '',
          socialMedia: {
            facebook: client.socialMedia?.facebook || '',
            instagram: client.socialMedia?.instagram || '',
            twitter: client.socialMedia?.twitter || '',
            linkedin: client.socialMedia?.linkedin || '',
            website: client.socialMedia?.website || ''
          },
          location: {
            address: client.location?.address || '',
            city: client.location?.city || '',
            state: client.location?.state || '',
            country: client.location?.country || '',
            zipCode: client.location?.zipCode || ''
          }
        };
      } else {
        this.resetForm();
      }
      this.dialog = true;
    },
    resetForm() {
      this.form = {
        name: '',
        businessName: '',
        phoneNumber: '',
        email: '',
        socialMedia: {
          facebook: '',
          instagram: '',
          twitter: '',
          linkedin: '',
          website: ''
        },
        location: {
          address: '',
          city: '',
          state: '',
          country: '',
          zipCode: ''
        },
        tags: ''
      };
    },
    editClient(client) {
      this.openDialog(client);
    },
    async saveClient() {
      // Validate required fields
      if (!this.form.name || !this.form.phoneNumber || !this.form.email) {
        this.$store.dispatch('showSnackbar', {
          text: 'Please fill in all required fields (Name, Phone, Email)',
          color: 'error'
        });
        return;
      }

      this.saving = true;
      try {
        if (this.editingClient) {
          await axios.put(`/clients/${this.editingClient.id}`, this.form);
        } else {
          await axios.post('/clients', this.form);
        }
        this.dialog = false;
        this.loadClients();
        this.$store.dispatch('showSnackbar', {
          text: this.editingClient ? 'Client updated successfully!' : 'Client created successfully!',
          color: 'success'
        });
      } catch (error) {
        console.error('Error saving client:', error);
        this.$store.dispatch('showSnackbar', {
          text: 'Error saving client: ' + (error.response?.data?.message || error.message),
          color: 'error'
        });
      } finally {
        this.saving = false;
      }
    },
    async deleteClient(client) {
      this.confirmTitle = 'Delete Client';
      this.confirmMessage = `Are you sure you want to delete ${client.name}? This will also delete all associated customer contacts, notes, and ads. This action cannot be undone.`;
      this.confirmType = 'error';
      this.confirmCallback = async () => {
        try {
          await axios.delete(`/clients/${client.id}`);
          this.loadClients();
          this.$store.dispatch('showSnackbar', {
            text: 'Client deleted successfully!',
            color: 'success'
          });
        } catch (error) {
          console.error('Error deleting client:', error);
          this.$store.dispatch('showSnackbar', {
            text: 'Error deleting client: ' + (error.response?.data?.message || error.message),
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
    filterClients() {
      let filtered = [...this.clients];
      
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(client =>
          client.name?.toLowerCase().includes(query) ||
          client.businessName?.toLowerCase().includes(query) ||
          client.email?.toLowerCase().includes(query) ||
          client.phoneNumber?.toLowerCase().includes(query) ||
          client.location?.city?.toLowerCase().includes(query) ||
          client.location?.country?.toLowerCase().includes(query)
        );
      }
      
      this.filteredClients = filtered;
    }
  }
};
</script>

<style scoped>
.page-view__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
}

.page-view__action {
  flex-shrink: 0;
}

.clients-search {
  max-width: 300px;
}

/* DRA table styling for v-data-table */
.dra-data-table :deep(thead th) {
  background: #f9fafb !important;
  color: var(--text-secondary) !important;
  font-weight: 600 !important;
  font-size: 13px !important;
  padding: 14px 20px !important;
  border-bottom: 1px solid var(--border-color, #DBDDDC) !important;
}

.dra-data-table :deep(tbody td) {
  padding: 16px 20px !important;
  border-bottom: 1px solid #f3f4f6 !important;
}

.dra-data-table :deep(tbody tr:hover) {
  background: var(--primary-lightest, #EBF5DA) !important;
}

/* Add/Edit Client dialog: scrollable body + fixed Save/Cancel bar */
.client-form-dialog {
  border-radius: 12px !important;
  overflow: hidden !important;
  min-height: 60vh !important;
  max-height: 90vh !important;
  display: flex !important;
  flex-direction: column !important;
  border: 1px solid var(--border-color, #e5e7eb) !important;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1) !important;
}

.client-form-dialog__title {
  font-weight: 600 !important;
  letter-spacing: 0.3px !important;
  flex-shrink: 0 !important;
}

/* Override global .v-card-text { overflow: visible } so this dialog body scrolls */
.client-form-dialog__body {
  overflow-y: auto !important;
  flex: 1 1 0 !important;
  min-height: 320px !important; /* prevent clipping first/last fields */
  padding-bottom: 24px !important;
  -webkit-overflow-scrolling: touch;
  box-sizing: border-box !important;
}

.client-form-dialog__actions {
  flex-shrink: 0 !important;
  background: #f9fafb !important;
  border-top: 1px solid #e5e7eb !important;
}
</style>