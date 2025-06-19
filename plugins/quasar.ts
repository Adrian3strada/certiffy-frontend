import { Quasar, Notify, Dialog, Loading, LoadingBar, LocalStorage } from 'quasar';
import * as components from 'quasar';
import { defineNuxtPlugin } from '#app';

// Import icon sets
import '@quasar/extras/material-icons/material-icons.css';
import '@quasar/extras/mdi-v5/mdi-v5.css';

interface QuasarIconSet {
  name: string;
  arrow: {
    dropdown: string;
    left: string;
    right: string;
    up: string;
    down: string;
  };
  carousel: {
    left: string;
    right: string;
    up: string;
    down: string;
    navigation: string;
  };
  tabs: {
    left: string;
    right: string;
  };
}

export default defineNuxtPlugin((nuxtApp) => {
  // Solo ejecutar en el cliente para evitar errores de SSR
  if (process.client) {
    nuxtApp.vueApp.use(Quasar, {
      components,
      plugins: {
        Notify,
        Dialog,
        Loading,
        LoadingBar,
        LocalStorage
      },
      config: {
        notify: {
          position: 'top-right',
          timeout: 2500
        },
        brand: {
          // Colores principales del diseño
          primary: '#0a1a42',   // Azul marino
          secondary: '#8FB4A2', // Verde
          accent: '#FFB901',    // Amarillo
          warning: '#DFBB43',   // Dorado
          
          // Colores de sistema
          dark: '#1D1D1D',
          'dark-page': '#121212',
          positive: '#21BA45',
          negative: '#C10015',
          info: '#31CCEC'
        },
        loadingBar: {
          color: 'blue',
          size: '3px',
          position: 'top'
        }
      },
      iconSet: {
        name: 'material-icons',
        // Definir explícitamente los conjuntos de iconos para diferentes componentes
        arrow: {
          dropdown: 'expand_more',
          left: 'chevron_left',
          right: 'chevron_right',
          up: 'keyboard_arrow_up',
          down: 'keyboard_arrow_down'
        },
        carousel: {
          left: 'chevron_left',
          right: 'chevron_right',
          up: 'keyboard_arrow_up',
          down: 'keyboard_arrow_down',
          navigation: 'lens'
        },
        tabs: {
          left: 'chevron_left',
          right: 'chevron_right'
        }
      } as QuasarIconSet,
      extras: {
        fontIcons: ['mdi-v5']
      }
    });
  }
});
