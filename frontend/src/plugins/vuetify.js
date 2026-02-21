import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

export default createVuetify({
  components,
  directives,
  defaults: {
    /* Teleport to body so dropdown menus show on top; z-index matches overlay-fix.css */
    VSelect: {
      menuProps: { attach: false, zIndex: 99992, contentClass: 'dra-select-menu' }
    },
    VMenu: {
      attach: false,
      zIndex: 99992
    },
    VAutocomplete: {
      menuProps: { attach: false, zIndex: 99992, contentClass: 'dra-select-menu' }
    },
    VCombobox: {
      menuProps: { attach: false, zIndex: 99992, contentClass: 'dra-select-menu' }
    },
    VDialog: {
      zIndex: 99991
    }
  },
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        primary: '#2196F3',
        'primary-darken-1': '#1976D2',
        secondary: '#69737B',
        accent: '#E3F2FD',
        error: '#79232E',
        info: '#2196F3',
        success: '#4CAF50',
        warning: '#FF9800'
      }
    }
  }
});

