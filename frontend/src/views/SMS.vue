<template>
  <div class="sms-marketing-container">
    <v-container fluid class="pa-6">
      <!-- Header Section -->
      <v-row class="mb-6">
        <v-col cols="12">
          <div class="d-flex align-center justify-space-between flex-wrap">
            <div>
              <h1 class="text-h4 font-weight-bold mb-2" style="color: #1a1a1a; letter-spacing: -0.5px;">
                SMS Marketing
              </h1>
              <p class="text-body-1 mb-0" style="color: #6b7280;">
                Manage customer contacts and send SMS campaigns on behalf of your clients
              </p>
            </div>
          </div>
        </v-col>
      </v-row>

      <!-- Customer Contacts Management -->
      <v-row class="mb-6">
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
              <span class="text-h6 font-weight-semibold" style="color: #1a1a1a;">Customer Contacts Management</span>
            </v-card-title>
            <v-card-text class="pa-6">
              <v-row align="center" class="mb-4">
                <v-col cols="12" md="4">
                  <v-select
                    v-model="selectedClientForContacts"
                    :items="clients"
                    item-title="name"
                    item-value="id"
                    label="Select Client"
                    prepend-inner-icon="mdi-account"
                    clearable
                    density="default"
                    variant="outlined"
                    hide-details
                    style="background: #ffffff;"
                    @update:model-value="loadCustomerContacts"
                  ></v-select>
                </v-col>
                <v-col cols="12" md="8" class="d-flex align-center justify-end">
                  <v-btn
                    color="primary"
                    prepend-icon="mdi-plus"
                    @click="openAddContactDialog"
                    :disabled="!selectedClientForContacts"
                    variant="elevated"
                    size="default"
                    style="font-weight: 600; letter-spacing: 0.3px;"
                  >
                    Add Customer Contact
                  </v-btn>
                </v-col>
              </v-row>

              <!-- Customer Contacts List -->
              <div v-if="selectedClientForContacts && customerContacts.length > 0" class="mt-4">
                <v-text-field
                  v-model="contactSearchQuery"
                  prepend-inner-icon="mdi-magnify"
                  label="Search contacts..."
                  variant="outlined"
                  density="compact"
                  hide-details
                  clearable
                  class="mb-4"
                  style="max-width: 400px;"
                  @update:model-value="filterContacts"
                ></v-text-field>
                <v-data-table
                  :headers="contactHeaders"
                  :items="filteredCustomerContacts"
                  class="elevation-0"
                  style="border: 1px solid #e5e7eb; border-radius: 8px;"
                  :items-per-page="10"
                  :items-per-page-options="[10, 25, 50]"
                >
                  <template v-slot:item.phoneNumber="{ item }">
                    <v-chip 
                      size="small" 
                      color="primary" 
                      variant="outlined"
                      style="font-weight: 500;"
                    >
                      {{ item.phoneNumber }}
                    </v-chip>
                  </template>
                  <template v-slot:item.createdAt="{ item }">
                    <span style="color: #6b7280; font-size: 14px;">
                      {{ new Date(item.createdAt).toLocaleDateString() }}
                    </span>
                  </template>
                  <template v-slot:item.actions="{ item }">
                    <div class="d-flex align-center ga-2">
                      <v-btn
                        icon="mdi-pencil"
                        size="small"
                        variant="text"
                        color="primary"
                        @click="editContact(item)"
                        style="min-width: 36px;"
                      ></v-btn>
                      <v-btn
                        icon="mdi-delete"
                        size="small"
                        variant="text"
                        color="error"
                        @click="deleteContact(item.id)"
                        style="min-width: 36px;"
                      ></v-btn>
                    </div>
                  </template>
                </v-data-table>
              </div>

              <v-alert
                v-else-if="selectedClientForContacts && customerContacts.length === 0"
                type="info"
                variant="tonal"
                class="mt-4"
                style="border-radius: 8px;"
              >
                <div class="d-flex align-center">
                  <v-icon class="mr-3">mdi-information</v-icon>
                  <span>No customer contacts found for this client. Add contacts to start sending SMS.</span>
                </div>
              </v-alert>

              <v-alert
                v-else
                type="info"
                variant="tonal"
                class="mt-4"
                style="border-radius: 8px;"
              >
                <div class="d-flex align-center">
                  <v-icon class="mr-3">mdi-information</v-icon>
                  <span>Select a client to manage their customer contacts.</span>
                </div>
              </v-alert>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Send SMS Campaign -->
      <v-row>
        <v-col cols="12" md="6">
          <v-card
            elevation="0"
            style="border-radius: 12px; border: 1px solid #e5e7eb;"
            class="h-100"
          >
            <v-card-title 
              class="d-flex align-center pa-4"
              style="background: linear-gradient(135deg, #f9fafb 0%, #ffffff 100%); border-bottom: 1px solid #e5e7eb;"
            >
              <v-icon class="mr-3" color="primary" size="24">mdi-message-text</v-icon>
              <span class="text-h6 font-weight-semibold" style="color: #1a1a1a;">Send SMS Campaign</span>
            </v-card-title>
            <v-card-text class="pa-6">
              <v-form @submit.prevent="sendSMS">
                <v-select
                  v-model="selectedClient"
                  :items="clients"
                  item-title="name"
                  item-value="id"
                  label="Select Client"
                  prepend-inner-icon="mdi-account"
                  required
                  density="default"
                  variant="outlined"
                  hide-details
                  style="background: #ffffff;"
                  @update:model-value="loadCustomerContactsForSending"
                ></v-select>

                <v-alert
                  v-if="selectedClient && availableContacts.length > 0"
                  type="success"
                  variant="tonal"
                  class="mt-4"
                  style="border-radius: 8px;"
                >
                  <div class="d-flex align-center">
                    <v-icon class="mr-3">mdi-check-circle</v-icon>
                    <span>Found <strong>{{ availableContacts.length }}</strong> customer contact(s) with phone numbers for this client.</span>
                  </div>
                </v-alert>

                <v-alert
                  v-else-if="selectedClient && availableContacts.length === 0"
                  type="warning"
                  variant="tonal"
                  class="mt-4"
                  style="border-radius: 8px;"
                >
                  <div class="d-flex align-center">
                    <v-icon class="mr-3">mdi-alert</v-icon>
                    <span>No customer contacts with phone numbers found for this client. Add contacts first.</span>
                  </div>
                </v-alert>

                <v-select
                  v-if="availableContacts.length > 0"
                  v-model="selectedContacts"
                  :items="availableContacts"
                  item-title="displayName"
                  item-value="id"
                  label="Select Customer Contacts (Leave empty to send to all)"
                  multiple
                  chips
                  prepend-inner-icon="mdi-account-multiple"
                  density="default"
                  variant="outlined"
                  hide-details
                  class="mt-4"
                  style="background: #ffffff;"
                >
                  <template v-slot:item="{ props, item }">
                    <v-list-item v-bind="props">
                      <template v-slot:prepend>
                        <v-icon color="primary">mdi-phone</v-icon>
                      </template>
                      <v-list-item-subtitle style="color: #6b7280;">{{ item.raw.phoneNumber }}</v-list-item-subtitle>
                    </v-list-item>
                  </template>
                </v-select>

                <v-select
                  v-model="selectedTemplate"
                  :items="templates"
                  item-title="name"
                  item-value="id"
                  label="Load Template (Optional)"
                  clearable
                  prepend-inner-icon="mdi-file-document"
                  density="default"
                  variant="outlined"
                  hide-details
                  class="mt-4"
                  style="background: #ffffff;"
                  @update:model-value="loadTemplate"
                >
                  <template v-slot:item="{ props, item }">
                    <v-list-item v-bind="props">
                      <template v-slot:prepend>
                        <v-icon color="primary">mdi-message-text</v-icon>
                      </template>
                      <v-list-item-subtitle style="color: #6b7280;">{{ item.raw.type }}</v-list-item-subtitle>
                    </v-list-item>
                  </template>
                </v-select>

                <v-textarea
                  v-model="message"
                  label="Message"
                  rows="5"
                  required
                  :counter="160"
                  density="default"
                  variant="outlined"
                  hide-details
                  class="mt-4"
                  style="background: #ffffff;"
                ></v-textarea>

                <v-btn
                  type="submit"
                  color="primary"
                  block
                  size="large"
                  prepend-icon="mdi-send"
                  :loading="sending"
                  :disabled="!message.trim() || !selectedClient || availableContacts.length === 0"
                  class="mt-6"
                  variant="elevated"
                  style="font-weight: 600; letter-spacing: 0.5px; text-transform: none; height: 48px;"
                >
                  Send SMS to Customer Contacts
                </v-btn>
              </v-form>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Quick Send (Legacy - for client's own phone) -->
        <v-col cols="12" md="6">
          <v-card
            elevation="0"
            style="border-radius: 12px; border: 1px solid #e5e7eb;"
            class="h-100"
          >
            <v-card-title 
              class="d-flex align-center pa-4"
              style="background: linear-gradient(135deg, #f9fafb 0%, #ffffff 100%); border-bottom: 1px solid #e5e7eb;"
            >
              <v-icon class="mr-3" color="primary" size="24">mdi-phone-fast</v-icon>
              <span class="text-h6 font-weight-semibold" style="color: #1a1a1a;">Quick Send to Client</span>
            </v-card-title>
            <v-card-text class="pa-6">
              <v-alert 
                type="info" 
                variant="tonal"
                class="mb-4"
                style="border-radius: 8px;"
              >
                <div class="d-flex align-center">
                  <v-icon class="mr-3">mdi-information</v-icon>
                  <span>Send SMS directly to a client's phone number (not their customers).</span>
                </div>
              </v-alert>
              <v-list class="pa-0" style="background: transparent;">
                <v-list-item
                  v-for="client in clientsWithPhone"
                  :key="client.id"
                  class="mb-2 pa-3"
                  style="border: 1px solid #e5e7eb; border-radius: 8px; background: #ffffff;"
                >
                  <v-list-item-title 
                    class="mb-1"
                    style="color: #1a1a1a; font-weight: 600; font-size: 15px;"
                  >
                    {{ client.name }}
                  </v-list-item-title>
                  <v-list-item-subtitle style="color: #6b7280; font-size: 14px;">
                    {{ client.phoneNumber }}
                  </v-list-item-subtitle>
                  <template v-slot:append>
                    <v-btn
                      size="default"
                      color="primary"
                      variant="elevated"
                      @click="quickSend(client)"
                      :loading="sending"
                      style="font-weight: 500; text-transform: none;"
                    >
                      Send
                    </v-btn>
                  </template>
                </v-list-item>
                <v-list-item v-if="clientsWithPhone.length === 0" class="pa-4">
                  <v-list-item-title style="color: #6b7280; text-align: center;">
                    No clients with phone numbers available
                  </v-list-item-title>
                </v-list-item>
              </v-list>
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

    <!-- Quick Send Message Dialog -->
    <v-dialog v-model="quickSendDialog" max-width="500" persistent>
      <v-card style="border-radius: 12px; overflow: hidden;">
        <v-card-title 
          class="bg-primary text-white pa-4"
          style="font-weight: 600; letter-spacing: 0.3px;"
        >
          <v-icon class="mr-2" size="24">mdi-message-text</v-icon>
          Send SMS to Client
        </v-card-title>
        <v-card-text class="pa-6">
          <div v-if="quickSendClient" class="mb-4">
            <div class="text-h6 mb-1" style="color: #1a1a1a; font-weight: 600;">
              {{ quickSendClient.name }}
            </div>
            <div class="text-body-2" style="color: #6b7280;">
              {{ quickSendClient.phoneNumber }}
            </div>
          </div>
          <v-textarea
            v-model="quickSendMessage"
            label="Message"
            rows="5"
            required
            :counter="160"
            density="default"
            variant="outlined"
            hide-details
            style="background: #ffffff;"
          ></v-textarea>
        </v-card-text>
        <v-card-actions class="pa-4" style="background: #f9fafb; border-top: 1px solid #e5e7eb;">
          <v-spacer></v-spacer>
          <v-btn 
            @click="quickSendDialog = false"
            variant="text"
            style="font-weight: 500; text-transform: none;"
          >
            Cancel
          </v-btn>
          <v-btn 
            color="primary" 
            @click="sendQuickSMS" 
            :loading="sending"
            variant="elevated"
            :disabled="!quickSendMessage.trim()"
            style="font-weight: 600; text-transform: none; letter-spacing: 0.3px;"
          >
            Send SMS
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Add/Edit Contact Dialog -->
    <v-dialog v-model="contactDialog" max-width="600" persistent>
      <v-card style="border-radius: 12px; overflow: hidden;">
        <v-card-title 
          class="bg-primary text-white pa-4"
          style="font-weight: 600; letter-spacing: 0.3px;"
        >
          <v-icon class="mr-2" size="24">mdi-account-plus</v-icon>
          {{ editingContact ? 'Edit Customer Contact' : 'Add Customer Contact' }}
        </v-card-title>
        <v-card-text class="pa-6">
          <v-form ref="contactForm">
            <v-text-field
              v-model="contactForm.name"
              label="Name (Optional)"
              prepend-inner-icon="mdi-account"
              density="default"
              variant="outlined"
              hide-details
              style="background: #ffffff;"
            ></v-text-field>
            <v-text-field
              v-model="contactForm.phoneNumber"
              label="Phone Number"
              prepend-inner-icon="mdi-phone"
              required
              density="default"
              variant="outlined"
              class="mt-4"
              style="background: #ffffff;"
              :rules="[v => !!v || 'Phone number is required']"
            ></v-text-field>
            <v-text-field
              v-model="contactForm.email"
              label="Email Address (Optional)"
              type="email"
              prepend-inner-icon="mdi-email"
              density="default"
              variant="outlined"
              hide-details
              class="mt-4"
              style="background: #ffffff;"
              :rules="[v => !v || /.+@.+\..+/.test(v) || 'Email must be valid']"
            ></v-text-field>
            <v-textarea
              v-model="contactForm.notes"
              label="Notes (Optional)"
              rows="3"
              prepend-inner-icon="mdi-note-text"
              density="default"
              variant="outlined"
              hide-details
              class="mt-4"
              style="background: #ffffff;"
            ></v-textarea>
          </v-form>
        </v-card-text>
        <v-card-actions class="pa-4" style="background: #f9fafb; border-top: 1px solid #e5e7eb;">
          <v-spacer></v-spacer>
          <v-btn 
            @click="contactDialog = false"
            variant="text"
            style="font-weight: 500; text-transform: none;"
          >
            Cancel
          </v-btn>
          <v-btn 
            color="primary" 
            @click="saveContact" 
            :loading="savingContact"
            variant="elevated"
            style="font-weight: 600; text-transform: none; letter-spacing: 0.3px;"
          >
            {{ editingContact ? 'Update' : 'Add' }}
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
  name: 'SMS',
  components: {
    ConfirmationDialog
  },
  data() {
    return {
      clients: [],
      selectedClient: null,
      selectedClientForContacts: null,
      customerContacts: [],
      filteredCustomerContacts: [],
      contactSearchQuery: '',
      availableContacts: [],
      selectedContacts: [],
      message: '',
      sending: false,
      templates: [],
      selectedTemplate: null,
      contactDialog: false,
      editingContact: null,
      savingContact: false,
      confirmDialog: false,
      confirmTitle: '',
      confirmMessage: '',
      confirmType: 'warning',
      confirmCallback: null,
      quickSendDialog: false,
      quickSendClient: null,
      quickSendMessage: '',
      contactForm: {
        name: '',
        email: '',
        phoneNumber: '',
        notes: ''
      },
      contactHeaders: [
        { title: 'Name', key: 'name', sortable: true },
        { title: 'Phone', key: 'phoneNumber', sortable: true },
        { title: 'Email', key: 'email', sortable: false },
        { title: 'Created', key: 'createdAt', sortable: true },
        { title: 'Actions', key: 'actions', sortable: false, align: 'end', width: '120px' }
      ]
    };
  },
  computed: {
    clientsWithPhone() {
      return this.clients.filter(c => c.phoneNumber);
    }
  },
  mounted() {
    this.loadClients();
    this.loadTemplates();
  },
  methods: {
    async loadClients() {
      try {
        const response = await axios.get('/clients');
        this.clients = response.data;
      } catch (error) {
        console.error('Error loading clients:', error);
        this.$store.dispatch('showSnackbar', {
          text: 'Error loading clients',
          color: 'error'
        });
      }
    },
    async loadCustomerContacts() {
      if (!this.selectedClientForContacts) {
        this.customerContacts = [];
        return;
      }
      try {
        const response = await axios.get('/customer-contacts', {
          params: { clientId: this.selectedClientForContacts }
        });
        this.customerContacts = response.data;
        this.filterContacts();
      } catch (error) {
        console.error('Error loading customer contacts:', error);
        this.$store.dispatch('showSnackbar', {
          text: 'Error loading customer contacts',
          color: 'error'
        });
      }
    },
    async loadCustomerContactsForSending() {
      if (!this.selectedClient) {
        this.availableContacts = [];
        return;
      }
      try {
        const response = await axios.get('/customer-contacts', {
          params: { clientId: this.selectedClient }
        });
        this.availableContacts = response.data
          .filter(c => c.phoneNumber)
          .map(c => ({
            ...c,
            displayName: c.name || c.phoneNumber
          }));
        this.selectedContacts = [];
      } catch (error) {
        console.error('Error loading customer contacts:', error);
        this.availableContacts = [];
      }
    },
    async loadTemplates() {
      try {
        const response = await axios.get('/templates', { params: { type: 'sms' } });
        this.templates = response.data;
      } catch (error) {
        console.error('Error loading templates:', error);
      }
    },
    async loadTemplate(templateId) {
      if (!templateId) return;
      try {
        const response = await axios.get(`/templates/${templateId}`);
        const template = response.data;
        this.message = template.content || '';
        this.selectedTemplate = templateId;
        this.$store.dispatch('showSnackbar', {
          text: 'Template loaded!',
          color: 'success'
        });
      } catch (error) {
        console.error('Error loading template:', error);
      }
    },
    openAddContactDialog() {
      this.editingContact = null;
      this.contactForm = {
        name: '',
        email: '',
        phoneNumber: '',
        notes: ''
      };
      this.contactDialog = true;
    },
    editContact(contact) {
      this.editingContact = contact;
      this.contactForm = {
        name: contact.name || '',
        email: contact.email || '',
        phoneNumber: contact.phoneNumber || '',
        notes: contact.notes || ''
      };
      this.contactDialog = true;
    },
    async saveContact() {
      const { valid } = await this.$refs.contactForm.validate();
      if (!valid) return;

      this.savingContact = true;
      try {
        if (this.editingContact) {
          await axios.put(`/customer-contacts/${this.editingContact.id}`, {
            ...this.contactForm,
            clientId: this.selectedClientForContacts
          });
          this.$store.dispatch('showSnackbar', {
            text: 'Contact updated successfully!',
            color: 'success'
          });
        } else {
          await axios.post('/customer-contacts', {
            ...this.contactForm,
            clientId: this.selectedClientForContacts
          });
          this.$store.dispatch('showSnackbar', {
            text: 'Contact added successfully!',
            color: 'success'
          });
        }
        this.contactDialog = false;
        await this.loadCustomerContacts();
      } catch (error) {
        this.$store.dispatch('showSnackbar', {
          text: 'Error saving contact: ' + (error.response?.data?.message || error.message),
          color: 'error'
        });
      } finally {
        this.savingContact = false;
      }
    },
    async deleteContact(contactId) {
      const contact = this.customerContacts.find(c => c.id === contactId);
      this.confirmTitle = 'Delete Contact';
      this.confirmMessage = `Are you sure you want to delete ${contact?.name || contact?.phoneNumber || 'this contact'}? This action cannot be undone.`;
      this.confirmType = 'error';
      this.confirmCallback = async () => {
        try {
          await axios.delete(`/customer-contacts/${contactId}`);
          this.$store.dispatch('showSnackbar', {
            text: 'Contact deleted successfully!',
            color: 'success'
          });
          await this.loadCustomerContacts();
          await this.loadCustomerContactsForSending();
        } catch (error) {
          this.$store.dispatch('showSnackbar', {
            text: 'Error deleting contact: ' + (error.response?.data?.message || error.message),
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
    filterContacts() {
      let filtered = [...this.customerContacts];
      
      if (this.contactSearchQuery) {
        const query = this.contactSearchQuery.toLowerCase();
        filtered = filtered.filter(contact =>
          contact.name?.toLowerCase().includes(query) ||
          contact.email?.toLowerCase().includes(query) ||
          contact.phoneNumber?.toLowerCase().includes(query)
        );
      }
      
      this.filteredCustomerContacts = filtered;
    },
    async sendSMS() {
      if (!this.selectedClient || !this.message.trim() || this.availableContacts.length === 0) return;

      this.sending = true;
      try {
        const contactIds = this.selectedContacts.length > 0 ? this.selectedContacts : null;
        
        const response = await axios.post('/sms/send-bulk', {
          clientId: this.selectedClient,
          contactIds: contactIds,
          message: this.message
        });

        const sentCount = response.data.sent || 0;
        const totalCount = response.data.total || 0;

        this.$store.dispatch('showSnackbar', {
          text: `SMS sent to ${sentCount} out of ${totalCount} customer contact(s)!`,
          color: 'success'
        });

        this.message = '';
        this.selectedContacts = [];
      } catch (error) {
        this.$store.dispatch('showSnackbar', {
          text: 'Error sending SMS: ' + (error.response?.data?.message || error.message),
          color: 'error'
        });
      } finally {
        this.sending = false;
      }
    },
    quickSend(client) {
      this.quickSendClient = client;
      this.quickSendMessage = '';
      this.quickSendDialog = true;
    },
    async sendQuickSMS() {
      if (!this.quickSendMessage.trim() || !this.quickSendClient) return;

      this.sending = true;
      try {
        await axios.post('/sms/send', {
          clientId: this.quickSendClient.id,
          message: this.quickSendMessage
        });
        this.$store.dispatch('showSnackbar', {
          text: 'SMS sent successfully!',
          color: 'success'
        });
        this.quickSendDialog = false;
        this.quickSendMessage = '';
        this.quickSendClient = null;
      } catch (error) {
        this.$store.dispatch('showSnackbar', {
          text: 'Error sending SMS: ' + (error.response?.data?.message || error.message),
          color: 'error'
        });
      } finally {
        this.sending = false;
      }
    }
  }
};
</script>

<style scoped>
.sms-marketing-container {
  background: #f9fafb;
  min-height: 100vh;
}
</style>
