import { Quasar } from 'quasar'
import iconSet from 'quasar/icon-set/material-icons'

export default defineNuxtPlugin((nuxtApp) => {
  if (process.client) {
    // Configuración global de iconSet para Quasar
    nuxtApp.vueApp.use(Quasar, {
      iconSet: iconSet
    })
  }
})
