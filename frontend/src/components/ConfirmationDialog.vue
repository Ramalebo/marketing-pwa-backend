<template>
  <v-dialog v-model="dialog" max-width="500" persistent>
    <v-card style="border-radius: 12px; overflow: hidden;">
      <v-card-title 
        class="d-flex align-center pa-4"
        :class="titleClass"
        :style="titleStyle"
      >
        <v-icon class="mr-3" :color="iconColor" size="24">{{ icon }}</v-icon>
        <span style="font-weight: 600; letter-spacing: 0.3px;">{{ title }}</span>
      </v-card-title>
      <v-card-text class="pa-6">
        <p class="text-body-1 mb-0" style="color: #374151; line-height: 1.6;">
          {{ message }}
        </p>
      </v-card-text>
      <v-card-actions class="pa-4" style="background: #f9fafb; border-top: 1px solid #e5e7eb;">
        <v-spacer></v-spacer>
        <v-btn 
          @click="cancel"
          variant="text"
          style="font-weight: 500; text-transform: none;"
        >
          {{ cancelText }}
        </v-btn>
        <v-btn 
          :color="confirmColor" 
          @click="confirm"
          :loading="loading"
          variant="elevated"
          style="font-weight: 600; text-transform: none; letter-spacing: 0.3px;"
        >
          {{ confirmText }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'ConfirmationDialog',
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: 'Confirm Action'
    },
    message: {
      type: String,
      required: true
    },
    confirmText: {
      type: String,
      default: 'Confirm'
    },
    cancelText: {
      type: String,
      default: 'Cancel'
    },
    confirmColor: {
      type: String,
      default: 'primary'
    },
    type: {
      type: String,
      default: 'warning', // warning, error, info, success
      validator: (value) => ['warning', 'error', 'info', 'success'].includes(value)
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue', 'confirm', 'cancel'],
  computed: {
    dialog: {
      get() {
        return this.modelValue;
      },
      set(value) {
        this.$emit('update:modelValue', value);
      }
    },
    icon() {
      const icons = {
        warning: 'mdi-alert',
        error: 'mdi-alert-circle',
        info: 'mdi-information',
        success: 'mdi-check-circle'
      };
      return icons[this.type] || icons.warning;
    },
    iconColor() {
      const colors = {
        warning: 'warning',
        error: 'error',
        info: 'info',
        success: 'success'
      };
      return colors[this.type] || 'warning';
    },
    titleClass() {
      if (this.type === 'error') {
        return 'bg-error text-white';
      } else if (this.type === 'success') {
        return 'bg-success text-white';
      } else if (this.type === 'info') {
        return 'bg-info text-white';
      }
      return 'bg-warning text-white';
    },
    titleStyle() {
      if (this.type === 'warning' || this.type === 'error' || this.type === 'info' || this.type === 'success') {
        return {};
      }
      return {
        background: 'linear-gradient(135deg, #f9fafb 0%, #ffffff 100%)',
        borderBottom: '1px solid #e5e7eb',
        color: '#1a1a1a'
      };
    }
  },
  methods: {
    confirm() {
      this.$emit('confirm');
    },
    cancel() {
      this.$emit('cancel');
      this.dialog = false;
    }
  }
};
</script>
