import { Quasar, Notify, Dialog, Loading, LoadingBar, LocalStorage } from 'quasar'
import * as components from 'quasar'

// Import MDI v5 icon set
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
      iconSet: 'material-icons',
      extras: {
        fontIcons: ['mdi-v5']
      }
    })
  }
})
