<template>
  <div class="users-container">
    <v-container fluid class="pa-6">
      <!-- Header Section -->
      <v-row class="mb-6">
        <v-col cols="12">
          <div class="d-flex align-center justify-space-between flex-wrap">
            <div>
              <h1 class="text-h4 font-weight-bold mb-2" style="color: #1a1a1a; letter-spacing: -0.5px;">
                User Management
              </h1>
              <p class="text-body-1 mb-0" style="color: #6b7280;">
                Manage users and their access to the platform
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
              Add User
            </v-btn>
          </div>
        </v-col>
      </v-row>

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
              <span class="text-h6 font-weight-semibold" style="color: #1a1a1a;">Users</span>
              <v-spacer></v-spacer>
              <v-text-field
                v-model="searchQuery"
                prepend-inner-icon="mdi-magnify"
                label="Search users..."
                variant="outlined"
                density="compact"
                hide-details
                clearable
                style="max-width: 300px;"
                @update:model-value="filterUsers"
              ></v-text-field>
            </v-card-title>
            <v-card-text class="pa-0">
              <v-data-table
                :headers="headers"
                :items="filteredUsers"
                :loading="loading"
                class="elevation-0"
                :items-per-page="10"
                :items-per-page-options="[10, 25, 50]"
              >
                <template v-slot:item.isActive="{ item }">
                  <v-chip
                    :color="item.isActive ? 'success' : 'error'"
                    size="small"
                    variant="flat"
                    style="font-weight: 500; text-transform: capitalize;"
                  >
                    {{ item.isActive ? 'Active' : 'Inactive' }}
                  </v-chip>
                </template>
                <template v-slot:item.role="{ item }">
                  <v-chip
                    :color="item.role === 'admin' ? 'primary' : 'grey'"
                    size="small"
                    variant="flat"
                    style="font-weight: 500; text-transform: capitalize;"
                  >
                    {{ item.role }}
                  </v-chip>
                </template>
                <template v-slot:item.actions="{ item }">
                  <div class="d-flex align-center ga-2">
                    <v-btn
                      icon="mdi-pencil"
                      size="small"
                      variant="text"
                      color="primary"
                      @click="openDialog(item)"
                      style="min-width: 36px;"
                    ></v-btn>
                    <v-btn
                      icon="mdi-delete"
                      size="small"
                      variant="text"
                      color="error"
                      @click="deleteUser(item)"
                      style="min-width: 36px;"
                    ></v-btn>
                  </div>
                </template>
                <template v-slot:no-data>
                  <div class="pa-12 text-center">
                    <v-icon size="64" color="grey-lighten-1" class="mb-4">mdi-account-outline</v-icon>
                    <div class="text-h6 mb-2" style="color: #6b7280;">No users found</div>
                    <div class="text-body-2 mb-4" style="color: #9ca3af;">
                      Add your first user to get started
                    </div>
                    <v-btn
                      color="primary"
                      prepend-icon="mdi-plus"
                      @click="openDialog()"
                      variant="elevated"
                    >
                      Add User
                    </v-btn>
                  </div>
                </template>
              </v-data-table>
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

    <!-- Add/Edit User Dialog -->
    <v-dialog v-model="dialog" max-width="600" persistent scrollable>
      <v-card style="border-radius: 12px; overflow: hidden; max-height: 90vh; display: flex; flex-direction: column;">
        <v-card-title 
          class="bg-primary text-white pa-4 d-flex align-center"
          style="font-weight: 600; letter-spacing: 0.3px; flex-shrink: 0;"
        >
          <v-icon class="mr-2" size="24">mdi-account-plus</v-icon>
          {{ editingUser ? 'Edit User' : 'Add New User' }}
          <v-spacer></v-spacer>
          <v-btn
            icon="mdi-close"
            variant="text"
            @click="dialog = false"
            style="color: white;"
          ></v-btn>
        </v-card-title>
        <v-card-text class="pa-6" style="overflow-y: auto; flex: 1;">
          <v-form ref="form" v-model="valid">
            <v-text-field
              v-model="form.name"
              label="Name"
              required
              density="default"
              variant="outlined"
              hide-details="auto"
            ></v-text-field>
            <v-text-field
              v-model="form.email"
              label="Email"
              type="email"
              required
              density="default"
              variant="outlined"
              hide-details="auto"
              :disabled="!!editingUser"
            ></v-text-field>
            <v-text-field
              v-if="!editingUser"
              v-model="form.password"
              label="Password"
              type="password"
              required
              density="default"
              variant="outlined"
              hide-details="auto"
            ></v-text-field>
            <v-select
              v-model="form.role"
              :items="roles"
              item-title="title"
              item-value="value"
              label="Role"
              density="default"
              variant="outlined"
              hide-details="auto"
            ></v-select>
            <v-checkbox
              v-model="form.isActive"
              label="Active"
              hide-details
              style="color: #374151;"
            ></v-checkbox>
          </v-form>
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
            @click="saveUser"
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
  name: 'Users',
  components: {
    ConfirmationDialog
  },
  data() {
    return {
      loading: false,
      saving: false,
      dialog: false,
      valid: false,
      users: [],
      filteredUsers: [],
      searchQuery: '',
      editingUser: null,
      confirmDialog: false,
      confirmTitle: '',
      confirmMessage: '',
      confirmType: 'warning',
      confirmCallback: null,
      headers: [
        { title: 'Name', key: 'name', sortable: true },
        { title: 'Email', key: 'email', sortable: true },
        { title: 'Role', key: 'role', sortable: true },
        { title: 'Status', key: 'isActive', sortable: true },
        { title: 'Actions', key: 'actions', sortable: false, align: 'end', width: '120px' }
      ],
      roles: [
        { title: 'User', value: 'user' },
        { title: 'Admin', value: 'admin' }
      ],
      form: {
        name: '',
        email: '',
        password: '',
        role: 'user',
        isActive: true
      }
    };
  },
  mounted() {
    this.loadUsers();
  },
  methods: {
    async loadUsers() {
      this.loading = true;
      try {
        const response = await axios.get('/users');
        this.users = response.data;
        this.filterUsers();
      } catch (error) {
        console.error('Error loading users:', error);
        this.$store.dispatch('showSnackbar', {
          text: 'Error loading users',
          color: 'error'
        });
      } finally {
        this.loading = false;
      }
    },
    openDialog(user = null) {
      this.editingUser = user;
      if (user) {
        this.form = {
          name: user.name || '',
          email: user.email || '',
          password: '',
          role: user.role || 'user',
          isActive: user.isActive !== undefined ? user.isActive : true
        };
      } else {
        this.resetForm();
      }
      this.dialog = true;
    },
    resetForm() {
      this.form = {
        name: '',
        email: '',
        password: '',
        role: 'user',
        isActive: true
      };
    },
    async saveUser() {
      // Validate required fields
      if (!this.form.name || !this.form.email) {
        this.$store.dispatch('showSnackbar', {
          text: 'Please fill in all required fields (Name, Email)',
          color: 'error'
        });
        return;
      }
      if (!this.editingUser && !this.form.password) {
        this.$store.dispatch('showSnackbar', {
          text: 'Password is required for new users',
          color: 'error'
        });
        return;
      }

      this.saving = true;
      try {
        if (this.editingUser) {
          const updateData = { ...this.form };
          delete updateData.password;
          delete updateData.email;
          await axios.put(`/users/${this.editingUser.id}`, updateData);
        } else {
          await axios.post('/users', this.form);
        }
        this.dialog = false;
        this.loadUsers();
        this.$store.dispatch('showSnackbar', {
          text: this.editingUser ? 'User updated successfully!' : 'User created successfully!',
          color: 'success'
        });
      } catch (error) {
        console.error('Error saving user:', error);
        this.$store.dispatch('showSnackbar', {
          text: 'Error: ' + (error.response?.data?.message || error.message),
          color: 'error'
        });
      } finally {
        this.saving = false;
      }
    },
    async deleteUser(user) {
      this.confirmTitle = 'Delete User';
      this.confirmMessage = `Are you sure you want to delete ${user.name}? This action cannot be undone.`;
      this.confirmType = 'error';
      this.confirmCallback = async () => {
        try {
          await axios.delete(`/users/${user.id}`);
          this.loadUsers();
          this.$store.dispatch('showSnackbar', {
            text: 'User deleted successfully!',
            color: 'success'
          });
        } catch (error) {
          console.error('Error deleting user:', error);
          this.$store.dispatch('showSnackbar', {
            text: 'Error: ' + (error.response?.data?.message || error.message),
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
    filterUsers() {
      let filtered = [...this.users];
      
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(user =>
          user.name?.toLowerCase().includes(query) ||
          user.email?.toLowerCase().includes(query) ||
          user.role?.toLowerCase().includes(query)
        );
      }
      
      this.filteredUsers = filtered;
    }
  }
};
</script>

<style scoped>
.users-container {
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
</style>