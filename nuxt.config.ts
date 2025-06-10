// https://nuxt.com/docs/api/configuration/nuxt-config
import { quasar, transformAssetUrls } from '@quasar/vite-plugin';

export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },

  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'https://314f-2806-103e-1d-78f8-a0c7-3e7-3336-6389.ngrok-free.app' // Fallback si no está en .env
    }
  },
  
  css: [
    '@quasar/extras/material-icons/material-icons.css',
    '@quasar/extras/mdi-v6/mdi-v6.css',
    'quasar/dist/quasar.css',
    'assets/css/global.css',
  ],
  
  build: {
    transpile: ['quasar']
  },
  
  vite: {
    vue: {
      template: { transformAssetUrls }
    },
    plugins: [
      quasar({
        sassVariables: 'assets/styles/quasar-variables.sass'
      })
    ],
    // Definir variables globales para evitar errores de SSR
    define: {
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      'process.client': process.client,
      'process.server': process.server,
      'process.browser': process.client
    },
    // Evitar que Vite intente transformar módulos de Quasar
    ssr: {
      noExternal: ['quasar', '@quasar/extras']
    }
  },
  
  // Desactivar SSR para toda la aplicación para evitar problemas con Quasar
  ssr: false,
  
  // Rutas de la aplicación
  routeRules: {
    '/admin/**': { ssr: false }, // Panel de administración sin SSR
    '/': { ssr: false }          // Página principal sin SSR
  }
})
