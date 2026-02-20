import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

export default createVuetify({
  components,
  directives,
  defaults: {
    /* attach: false = teleport to body so dropdowns are never clipped by cards/sidebar */
    VSelect: {
      menuProps: { attach: false, zIndex: 2147483646 }
    },
    VMenu: {
      attach: false,
      zIndex: 2147483646
    },
    VAutocomplete: {
      menuProps: { attach: false, zIndex: 2147483646 }
    },
    VCombobox: {
      menuProps: { attach: false, zIndex: 2147483646 }
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

