<template>
  <div class="notes-container">
    <v-container fluid class="pa-6">
      <!-- Header Section -->
      <v-row class="page-header">
        <v-col cols="12">
          <div class="d-flex align-center justify-space-between flex-wrap ga-4">
            <div>
              <h1>Notes & Information</h1>
              <p>Manage notes and information that feed the AI agent for better decision making</p>
            </div>
            <v-btn
              color="primary"
              prepend-icon="mdi-plus"
              @click="openDialog()"
              variant="elevated"
              size="default"
              style="font-weight: 600; height: 42px; padding: 0 20px;"
            >
              Add Note
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
              style="background: #F9FAFB; border-bottom: 1px solid #E5E7EB;"
            >
              <v-icon class="mr-2" color="primary" size="20">mdi-filter-variant</v-icon>
              <span class="text-subtitle-1 font-weight-semibold" style="color: #111827; font-size: 15px;">Filters</span>
            </v-card-title>
            <v-card-text class="pa-4">
              <v-select
                v-model="filters.clientId"
                :items="clientOptions"
                item-title="title"
                item-value="value"
                label="Client"
                clearable
                density="default"
                variant="outlined"
                hide-details="auto"
                class="app-select"
                style="background: #ffffff;"
                @update:model-value="loadNotes"
              ></v-select>
              <v-select
                v-model="filters.category"
                :items="categories"
                item-title="title"
                item-value="value"
                label="Category"
                clearable
                density="default"
                variant="outlined"
                hide-details="auto"
                class="app-select mt-4"
                style="background: #ffffff;"
                @update:model-value="loadNotes"
              ></v-select>
              <v-checkbox
                v-model="filters.aiRelevant"
                label="AI Relevant Only"
                hide-details
                class="mt-4"
                @update:model-value="loadNotes"
              ></v-checkbox>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Notes List -->
        <v-col cols="12" md="9">
          <v-card
            elevation="0"
            style="border-radius: 12px; border: 1px solid #e5e7eb;"
          >
            <v-card-title 
              class="d-flex align-center pa-4"
              style="background: #F9FAFB; border-bottom: 1px solid #E5E7EB;"
            >
              <v-icon class="mr-3" color="primary" size="24">mdi-note-text</v-icon>
              <span class="text-h6 font-weight-semibold" style="color: #111827; font-size: 16px;">Notes</span>
              <v-spacer></v-spacer>
              <v-text-field
                v-model="searchQuery"
                prepend-inner-icon="mdi-magnify"
                label="Search notes..."
                variant="outlined"
                density="compact"
                hide-details
                clearable
                style="max-width: 300px;"
                @update:model-value="filterNotes"
              ></v-text-field>
            </v-card-title>
            <v-card-text class="pa-0">
              <v-list v-if="filteredNotes.length > 0" class="pa-0">
                <v-list-item
                  v-for="note in filteredNotes"
                  :key="note.id || note._id"
                  @click="openDialog(note)"
                  class="px-4 py-3"
                  style="border-bottom: 1px solid #e5e7eb; cursor: pointer; transition: background 0.2s;"
                  @mouseenter="$event.currentTarget.style.background = '#f9fafb'"
                  @mouseleave="$event.currentTarget.style.background = 'transparent'"
                >
                  <template v-slot:prepend>
                    <v-avatar
                      :color="getPriorityColor(note.priority)"
                      size="40"
                      class="mr-4"
                    >
                      <v-icon :color="note.priority === 'high' ? 'white' : 'white'">
                        {{ getCategoryIcon(note.category) }}
                      </v-icon>
                    </v-avatar>
                  </template>
                  <v-list-item-title 
                    class="mb-1"
                    style="color: #1a1a1a; font-weight: 600; font-size: 15px;"
                  >
                    {{ note.title }}
                  </v-list-item-title>
                  <v-list-item-subtitle 
                    style="color: #6b7280; line-height: 1.5;"
                  >
                    {{ note.content.substring(0, 120) }}{{ note.content.length > 120 ? '...' : '' }}
                    <span v-if="note.clientId" style="color: #9ca3af;"> - {{ note.clientId.name }}</span>
                  </v-list-item-subtitle>
                  <template v-slot:append>
                    <div class="d-flex align-center ga-3">
                      <v-chip
                        size="small"
                        :color="getPriorityColor(note.priority)"
                        variant="flat"
                        style="font-weight: 500; text-transform: capitalize;"
                      >
                        {{ note.priority }}
                      </v-chip>
                      <v-chip
                        v-if="note.aiRelevant"
                        size="small"
                        color="success"
                        variant="flat"
                        style="font-weight: 500;"
                      >
                        AI Relevant
                      </v-chip>
                      <v-btn
                        icon="mdi-delete"
                        size="small"
                        variant="text"
                        color="error"
                        @click.stop="deleteNote(note)"
                        style="min-width: 36px;"
                      ></v-btn>
                    </div>
                  </template>
                </v-list-item>
              </v-list>
              <div v-else class="empty-state">
                <div class="empty-state-icon">
                  <v-icon size="40" color="#9CA3AF">mdi-note-text-outline</v-icon>
                </div>
                <div class="empty-state-title">No notes found</div>
                <div class="empty-state-subtitle">
                  Create your first note to get started with better AI-powered decision making
                </div>
                <v-btn
                  color="primary"
                  prepend-icon="mdi-plus"
                  @click="openDialog()"
                  variant="elevated"
                  size="default"
                  style="font-weight: 600; height: 42px; padding: 0 24px;"
                >
                  Add Note
                </v-btn>
              </div>
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

    <!-- Add/Edit Note Dialog -->
    <v-dialog v-model="dialog" max-width="700" persistent scrollable>
      <v-card style="border-radius: 16px; overflow: hidden; max-height: 90vh; display: flex; flex-direction: column;">
        <v-card-title 
          class="bg-primary text-white pa-5 d-flex align-center"
          style="font-weight: 600; font-size: 18px; flex-shrink: 0;"
        >
          <v-icon class="mr-3" size="24">mdi-note-edit</v-icon>
          {{ editingNote ? 'Edit Note' : 'Add New Note' }}
          <v-spacer></v-spacer>
          <v-btn
            icon="mdi-close"
            variant="text"
            @click="dialog = false"
            style="color: white;"
          ></v-btn>
        </v-card-title>
        <v-card-text class="pa-6" style="overflow-y: auto; flex: 1;">
          <v-form ref="form" v-model="valid" class="form-dialog-fields">
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
              v-model="form.content"
              label="Content"
              rows="5"
              required
              density="default"
              variant="outlined"
              hide-details
              class="mt-4"
              style="background: #ffffff;"
            ></v-textarea>
            <v-select
              v-model="form.clientId"
              :items="clientOptions"
              item-title="title"
              item-value="value"
              label="Related Client"
              clearable
              density="default"
              variant="outlined"
              hide-details="auto"
              class="app-select mt-4"
              style="background: #ffffff;"
            ></v-select>
            <v-select
              v-model="form.category"
              :items="categories"
              item-title="title"
              item-value="value"
              label="Category"
              density="default"
              variant="outlined"
              hide-details="auto"
              class="app-select mt-4"
              style="background: #ffffff;"
            ></v-select>
            <v-select
              v-model="form.priority"
              :items="priorities"
              item-title="title"
              item-value="value"
              label="Priority"
              density="default"
              variant="outlined"
              hide-details="auto"
              class="app-select mt-4"
              style="background: #ffffff;"
            ></v-select>
            <v-checkbox
              v-model="form.aiRelevant"
              label="Relevant for AI Agent"
              hide-details
              class="mt-4"
              style="color: #374151;"
            ></v-checkbox>
          </v-form>
        </v-card-text>
        <v-card-actions class="pa-4" style="background: #F9FAFB; border-top: 1px solid #E5E7EB; flex-shrink: 0;">
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
            @click="saveNote"
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
  name: 'Notes',
  components: {
    ConfirmationDialog
  },
  data() {
    return {
      loading: false,
      saving: false,
      dialog: false,
      valid: false,
      notes: [],
      filteredNotes: [],
      searchQuery: '',
      clients: [],
      editingNote: null,
      filters: {
        clientId: null,
        category: null,
        aiRelevant: false
      },
      categories: [
        { title: 'General', value: 'general' },
        { title: 'Preference', value: 'preference' },
        { title: 'Interaction', value: 'interaction' },
        { title: 'Campaign', value: 'campaign' },
        { title: 'Other', value: 'other' }
      ],
      priorities: [
        { title: 'Low', value: 'low' },
        { title: 'Medium', value: 'medium' },
        { title: 'High', value: 'high' }
      ],
      form: {
        title: '',
        content: '',
        clientId: null,
        category: 'general',
        priority: 'medium',
        aiRelevant: true
      },
      confirmDialog: false,
      confirmTitle: '',
      confirmMessage: '',
      confirmType: 'warning',
      confirmCallback: null
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
    this.loadNotes();
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
    async loadNotes() {
      this.loading = true;
      try {
        const params = {};
        if (this.filters.clientId) params.clientId = this.filters.clientId;
        if (this.filters.category) params.category = this.filters.category;
        
        const response = await axios.get('/notes', { params });
        let notes = response.data;
        
        if (this.filters.aiRelevant) {
          notes = notes.filter(n => n.aiRelevant);
        }
        
        this.notes = notes;
        this.filterNotes();
      } catch (error) {
        console.error('Error loading notes:', error);
        this.$store.dispatch('showSnackbar', {
          text: 'Error loading notes',
          color: 'error'
        });
      } finally {
        this.loading = false;
      }
    },
    filterNotes() {
      let filtered = [...this.notes];
      
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(note =>
          note.title?.toLowerCase().includes(query) ||
          note.content?.toLowerCase().includes(query) ||
          note.clientId?.name?.toLowerCase().includes(query) ||
          note.category?.toLowerCase().includes(query)
        );
      }
      
      this.filteredNotes = filtered;
    },
    openDialog(note = null) {
      this.editingNote = note;
      if (note) {
        this.form = {
          title: note.title || '',
          content: note.content || '',
          clientId: note.clientId?.id || note.clientId?._id || null,
          category: note.category || 'general',
          priority: note.priority || 'medium',
          aiRelevant: note.aiRelevant !== undefined ? note.aiRelevant : true
        };
      } else {
        this.resetForm();
      }
      this.dialog = true;
    },
    resetForm() {
      this.form = {
        title: '',
        content: '',
        clientId: null,
        category: 'general',
        priority: 'medium',
        aiRelevant: true
      };
    },
    async saveNote() {
      this.saving = true;
      try {
        if (this.editingNote) {
          await axios.put(`/notes/${this.editingNote.id || this.editingNote._id}`, this.form);
        } else {
          await axios.post('/notes', this.form);
        }
        this.dialog = false;
        this.loadNotes();
        this.$store.dispatch('showSnackbar', {
          text: this.editingNote ? 'Note updated successfully!' : 'Note created successfully!',
          color: 'success'
        });
      } catch (error) {
        console.error('Error saving note:', error);
        this.$store.dispatch('showSnackbar', {
          text: 'Error saving note: ' + (error.response?.data?.message || error.message),
          color: 'error'
        });
      } finally {
        this.saving = false;
      }
    },
    async deleteNote(note) {
      this.confirmTitle = 'Delete Note';
      this.confirmMessage = `Are you sure you want to delete "${note.title}"? This action cannot be undone.`;
      this.confirmType = 'error';
      this.confirmCallback = async () => {
        try {
          await axios.delete(`/notes/${note.id || note._id}`);
          this.loadNotes();
          this.$store.dispatch('showSnackbar', {
            text: 'Note deleted successfully!',
            color: 'success'
          });
        } catch (error) {
          console.error('Error deleting note:', error);
          this.$store.dispatch('showSnackbar', {
            text: 'Error deleting note: ' + (error.response?.data?.message || error.message),
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
    getCategoryIcon(category) {
      const icons = {
        general: 'mdi-note-text',
        preference: 'mdi-heart',
        interaction: 'mdi-message',
        campaign: 'mdi-bullhorn',
        other: 'mdi-dots-horizontal'
      };
      return icons[category] || 'mdi-note-text';
    },
    getPriorityColor(priority) {
      const colors = {
        low: 'grey',
        medium: 'blue',
        high: 'red'
      };
      return colors[priority] || 'grey';
    }
  }
};
</script>

<style scoped>
.notes-container {
  background: #f9fafb;
  min-height: 100vh;
}
</style>