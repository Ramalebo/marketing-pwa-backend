<template>
  <div class="chatbot-container">
    <v-container fluid class="pa-6">
      <!-- Header Section -->
      <v-row class="mb-6">
        <v-col cols="12">
          <div>
            <h1 class="text-h4 font-weight-bold mb-2" style="color: #1a1a1a; letter-spacing: -0.5px;">
              AI Chatbot
            </h1>
            <p class="text-body-1 mb-0" style="color: #6b7280;">
              Interact with the AI assistant to get help and insights
            </p>
          </div>
        </v-col>
      </v-row>

      <v-row>
        <!-- Client Selection Sidebar -->
        <v-col cols="12" md="4">
          <v-card
            elevation="0"
            style="border-radius: 12px; border: 1px solid #e5e7eb;"
          >
            <v-card-title 
              class="d-flex align-center pa-4"
              style="background: linear-gradient(135deg, #f9fafb 0%, #ffffff 100%); border-bottom: 1px solid #e5e7eb;"
            >
              <v-icon class="mr-2" color="primary" size="20">mdi-account</v-icon>
              <span class="text-subtitle-1 font-weight-semibold" style="color: #1a1a1a;">Select Client</span>
            </v-card-title>
            <v-card-text class="pa-4">
              <v-select
                v-model="selectedClient"
                :items="clientOptions"
                item-title="title"
                item-value="value"
                label="Client (Optional)"
                clearable
                density="default"
                variant="outlined"
                hide-details
                style="background: #ffffff;"
                @update:model-value="loadChatHistory"
              ></v-select>
              <v-divider class="my-4"></v-divider>
              <div v-if="selectedClient" class="pa-3" style="background: #f9fafb; border-radius: 8px;">
                <h3 class="mb-3" style="color: #1a1a1a; font-weight: 600; font-size: 16px;">Client Info</h3>
                <div class="mb-2">
                  <span style="color: #6b7280; font-weight: 500;">Name:</span>
                  <span class="ml-2" style="color: #1a1a1a;">{{ selectedClient.name }}</span>
                </div>
                <div v-if="selectedClient.businessName" class="mb-2">
                  <span style="color: #6b7280; font-weight: 500;">Business:</span>
                  <span class="ml-2" style="color: #1a1a1a;">{{ selectedClient.businessName }}</span>
                </div>
                <div v-if="selectedClient.email">
                  <span style="color: #6b7280; font-weight: 500;">Email:</span>
                  <span class="ml-2" style="color: #1a1a1a;">{{ selectedClient.email }}</span>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Chat Area -->
        <v-col cols="12" md="8">
          <v-card
            elevation="0"
            style="border-radius: 12px; border: 1px solid #e5e7eb; height: 600px; display: flex; flex-direction: column;"
          >
            <v-card-title 
              class="d-flex align-center pa-4"
              style="background: linear-gradient(135deg, #f9fafb 0%, #ffffff 100%); border-bottom: 1px solid #e5e7eb;"
            >
              <v-icon class="mr-3" color="primary" size="24">mdi-robot</v-icon>
              <span class="text-h6 font-weight-semibold" style="color: #1a1a1a;">Chat</span>
            </v-card-title>
            <v-card-text 
              style="flex: 1; overflow-y: auto; padding: 20px; background: #fafafa;"
              ref="chatContainer"
            >
              <div v-for="(message, index) in messages" :key="index" class="mb-4">
                <div :class="message.type === 'user' ? 'd-flex justify-end' : 'd-flex justify-start'">
                  <v-card
                    :class="message.type === 'user' ? 'primary' : 'white'"
                    :style="message.type === 'user' 
                      ? 'max-width: 70%; border-radius: 18px 18px 4px 18px;' 
                      : 'max-width: 70%; border-radius: 18px 18px 18px 4px; border: 1px solid #e5e7eb;'"
                    class="pa-3"
                    elevation="0"
                  >
                    <div class="d-flex align-center mb-2">
                      <v-icon 
                        :color="message.type === 'user' ? 'white' : 'primary'"
                        size="18"
                        class="mr-2"
                      >
                        {{ message.type === 'user' ? 'mdi-account' : 'mdi-robot' }}
                      </v-icon>
                      <strong 
                        :style="message.type === 'user' ? 'color: white;' : 'color: #1a1a1a;'"
                        style="font-size: 14px;"
                      >
                        {{ message.type === 'user' ? 'You' : 'AI Bot' }}
                      </strong>
                      <v-spacer></v-spacer>
                      <span 
                        :class="message.type === 'user' ? 'text-white' : 'text-grey'"
                        style="font-size: 11px; opacity: 0.8;"
                      >
                        {{ formatTime(message.timestamp) }}
                      </span>
                    </div>
                    <div 
                      :style="message.type === 'user' ? 'color: white;' : 'color: #4b5563;'"
                      style="line-height: 1.6; white-space: pre-wrap;"
                    >
                      {{ message.text }}
                    </div>
                  </v-card>
                </div>
              </div>
              <div v-if="loading" class="text-center py-4">
                <v-progress-circular indeterminate color="primary" size="32"></v-progress-circular>
              </div>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions class="pa-4" style="background: #ffffff; flex-shrink: 0;">
              <v-text-field
                v-model="newMessage"
                label="Type your message..."
                @keyup.enter="sendMessage"
                hide-details
                density="default"
                variant="outlined"
                prepend-inner-icon="mdi-message-text"
                style="background: #ffffff; flex: 1;"
              ></v-text-field>
              <v-btn
                color="primary"
                @click="sendMessage"
                :loading="loading"
                :disabled="!newMessage.trim() || loading"
                variant="elevated"
                prepend-icon="mdi-send"
                style="font-weight: 600; text-transform: none; letter-spacing: 0.3px; margin-left: 12px;"
              >
                Send
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Chatbot',
  data() {
    return {
      clients: [],
      selectedClient: null,
      messages: [],
      newMessage: '',
      loading: false
    };
  },
  computed: {
    clientOptions() {
      return [
        { title: 'None', value: null },
        ...this.clients.map(c => ({
          title: c.name,
          value: c.id || c._id,
          ...c
        }))
      ];
    }
  },
  mounted() {
    this.loadClients();
    this.addWelcomeMessage();
  },
  watch: {
    messages() {
      this.$nextTick(() => {
        const container = this.$refs.chatContainer;
        if (container) {
          container.scrollTop = container.scrollHeight;
        }
      });
    }
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
    addWelcomeMessage() {
      this.messages = [{
        type: 'bot',
        text: 'Hello! I\'m your AI assistant. How can I help you today?',
        timestamp: new Date()
      }];
    },
    loadChatHistory() {
      // Could implement chat history loading here
      this.messages = [];
      this.addWelcomeMessage();
    },
    async sendMessage() {
      if (!this.newMessage.trim() || this.loading) return;

      const userMessage = {
        type: 'user',
        text: this.newMessage,
        timestamp: new Date()
      };
      this.messages.push(userMessage);
      const messageText = this.newMessage;
      this.newMessage = '';
      this.loading = true;

      try {
        const response = await axios.post('/chatbot/chat', {
          message: messageText,
          clientId: this.selectedClient?.id || this.selectedClient?._id || null
        });

        this.messages.push({
          type: 'bot',
          text: response.data.message,
          timestamp: new Date(response.data.timestamp)
        });
      } catch (error) {
        console.error('Chatbot error:', error);
        const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
        
        this.messages.push({
          type: 'bot',
          text: `Sorry, I encountered an error: ${errorMessage}. ${error.response?.status === 500 ? 'The AI service may not be configured. Please check your OpenAI API key in the backend settings.' : 'Please try again.'}`,
          timestamp: new Date()
        });
        
        this.$store.dispatch('showSnackbar', {
          text: error.response?.data?.message || 'Error sending message. Check if OpenAI API key is configured.',
          color: 'error'
        });
      } finally {
        this.loading = false;
      }
    },
    formatTime(timestamp) {
      return new Date(timestamp).toLocaleTimeString();
    }
  }
};
</script>

<style scoped>
.chatbot-container {
  background: #f9fafb;
  min-height: 100vh;
}

/* Ensure chat container is responsive */
@media (max-width: 960px) {
  .chatbot-container .v-col {
    margin-bottom: 16px;
  }
}
</style>