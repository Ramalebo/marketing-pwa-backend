<template>
  <div class="login-container">
    <v-container class="fill-height" fluid>
      <v-row align="center" justify="center" class="ma-0">
        <v-col cols="12" sm="10" md="6" lg="4" xl="4">
          <!-- Title Section -->
          <div class="text-center mb-6">
            <h1 class="platform-title text-h4 font-weight-bold mb-2">
              Multi-Channel Marketing Platform
            </h1>
            <p class="text-body-2 text-grey-darken-1">
              Sign in to your account or create a new one
            </p>
          </div>
          <v-card 
            elevation="0" 
            style="border-radius: 16px; border: 1px solid #e5e7eb; overflow: hidden;"
            class="login-card"
          >
            <v-card-title 
              class="bg-primary text-white pa-4 d-flex align-center justify-space-between"
              style="font-weight: 600; letter-spacing: 0.3px; min-height: 64px;"
            >
              <div class="d-flex align-center">
                <v-icon class="mr-3" size="24">mdi-account-circle</v-icon>
                <span class="text-h6">{{ showRegister ? 'Register' : 'Login' }}</span>
              </div>
              <v-btn 
                variant="text" 
                @click="showRegister = !showRegister"
                style="color: white; font-weight: 500; text-transform: none; min-width: auto;"
                size="small"
              >
                {{ showRegister ? 'Login' : 'Register' }}
              </v-btn>
            </v-card-title>
            <v-card-text class="pa-6 pt-6">
              <v-form v-if="!showRegister" @submit.prevent="login" ref="loginForm">
                <v-text-field
                  v-model="loginForm.email"
                  label="Email Address"
                  name="email"
                  prepend-inner-icon="mdi-email"
                  type="email"
                  required
                  density="default"
                  variant="outlined"
                  hide-details
                  style="background: #ffffff;"
                  class="mb-4"
                ></v-text-field>
                <v-text-field
                  v-model="loginForm.password"
                  label="Password"
                  name="password"
                  prepend-inner-icon="mdi-lock"
                  type="password"
                  required
                  density="default"
                  variant="outlined"
                  hide-details
                  style="background: #ffffff;"
                  class="mb-6"
                ></v-text-field>
                <v-btn 
                  type="submit" 
                  color="primary" 
                  block 
                  :loading="loading"
                  size="large"
                  variant="elevated"
                  style="font-weight: 600; letter-spacing: 0.5px; text-transform: none; height: 48px;"
                >
                  Sign In
                </v-btn>
              </v-form>
              <v-form v-else @submit.prevent="register" ref="registerForm">
                <v-text-field
                  v-model="registerForm.name"
                  label="Full Name"
                  name="name"
                  prepend-inner-icon="mdi-account"
                  required
                  density="default"
                  variant="outlined"
                  hide-details
                  style="background: #ffffff;"
                  class="mb-4"
                ></v-text-field>
                <v-text-field
                  v-model="registerForm.email"
                  label="Email Address"
                  name="email"
                  prepend-inner-icon="mdi-email"
                  type="email"
                  required
                  density="default"
                  variant="outlined"
                  hide-details
                  style="background: #ffffff;"
                  class="mb-4"
                ></v-text-field>
                <v-text-field
                  v-model="registerForm.password"
                  label="Password"
                  name="password"
                  prepend-inner-icon="mdi-lock"
                  type="password"
                  required
                  density="default"
                  variant="outlined"
                  hide-details
                  style="background: #ffffff;"
                  class="mb-4"
                ></v-text-field>
                <v-checkbox
                  v-model="registerForm.isMainUser"
                  label="Main User (Admin)"
                  hide-details
                  class="mb-6"
                  style="color: #374151;"
                ></v-checkbox>
                <v-btn 
                  type="submit" 
                  color="primary" 
                  block 
                  :loading="loading"
                  size="large"
                  variant="elevated"
                  style="font-weight: 600; letter-spacing: 0.5px; text-transform: none; height: 48px;"
                >
                  Create Account
                </v-btn>
              </v-form>
            </v-card-text>
            <v-card-actions v-if="error" class="pa-4 pt-0">
              <v-alert 
                type="error" 
                variant="tonal"
                density="compact"
                style="width: 100%; border-radius: 8px;"
              >
                {{ error }}
              </v-alert>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      showRegister: false,
      loading: false,
      error: null,
      loginForm: {
        email: '',
        password: ''
      },
      registerForm: {
        name: '',
        email: '',
        password: '',
        isMainUser: false
      }
    };
  },
  watch: {
    showRegister() {
      this.error = null;
    }
  },
  methods: {
    async login() {
      this.loading = true;
      this.error = null;
      try {
        await this.$store.dispatch('login', this.loginForm);
        this.$router.push('/dashboard');
      } catch (error) {
        this.error = error.message || 'Login failed';
      } finally {
        this.loading = false;
      }
    },
    async register() {
      this.loading = true;
      this.error = null;
      try {
        await this.$store.dispatch('register', this.registerForm);
        this.$router.push('/dashboard');
      } catch (error) {
        this.error = error.message || 'Registration failed';
      } finally {
        this.loading = false;
      }
    },
    handleLogoError(event) {
      // Hide broken image if logo file doesn't exist yet
      event.target.style.display = 'none';
    }
  }
};
</script>

<style scoped>
.login-container {
  background: linear-gradient(135deg, #f9fafb 0%, #ffffff 100%);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.login-card {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08) !important;
}

.platform-title {
  color: #1a1a1a;
  letter-spacing: -0.3px;
  margin: 0;
  padding: 0;
  line-height: 1.4;
}

@media (max-width: 600px) {
  .platform-title {
    font-size: 1.5rem !important;
  }
}
</style>
