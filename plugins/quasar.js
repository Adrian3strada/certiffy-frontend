import { Quasar, Notify, Dialog, Loading, LoadingBar, LocalStorage } from 'quasar'
import * as components from 'quasar'

// Import icon sets
import '@quasar/extras/material-icons/material-icons.css'
import '@quasar/extras/mdi-v5/mdi-v5.css'

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
          primary: '#0d3122',
          secondary: '#80bb39',
          accent: '#9C27B0',
          dark: '#1D1D1D',
          'dark-page': '#121212',
          positive: '#21BA45',
          negative: '#C10015',
          info: '#31CCEC',
          warning: '#F2C037'
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
      },
      extras: {
        fontIcons: ['mdi-v5']
      }
    })
  }
})
