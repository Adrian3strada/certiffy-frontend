import { Quasar, Notify, Dialog } from 'quasar'
import * as components from 'quasar'

export default defineNuxtPlugin((nuxtApp) => {
  // Solo ejecutar en el cliente para evitar errores de SSR
  if (process.client) {
    nuxtApp.vueApp.use(Quasar, {
      components,
      plugins: {
        Notify,
        Dialog
      },
      config: {
        notify: {
          position: 'top-right',
          timeout: 2500
        },
        brand: {
          primary: '#1976D2',
          secondary: '#26A69A',
          accent: '#9C27B0',
          dark: '#1D1D1D',
          positive: '#21BA45',
          negative: '#C10015',
          info: '#31CCEC',
          warning: '#F2C037'
        }
      }
    })
  }
})
