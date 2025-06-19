// https://nuxt.com/docs/api/configuration/nuxt-config
import { quasar, transformAssetUrls } from '@quasar/vite-plugin';

export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },

  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || '' // Debe configurarse en variables de entorno
    }
  },
  
  // Configuración del proxy para imágenes y estrategia anti-caché
  nitro: {
    routeRules: {
      // Regla global para todas las rutas dinámicas - evitar caché
      '/**': {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
          'Surrogate-Control': 'no-store'
        }
      },
      // Configuración específica para el proxy de imágenes
      '/api/proxy-image': { 
        cors: true,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Cross-Origin-Resource-Policy': 'cross-origin',
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache'
        }
      },
      // Configuración para rutas de imágenes directas (alternativa)
      '/api/images/**': {
        proxy: {
          to: process.env.NUXT_PUBLIC_API_BASE + '/media/images/**',
          headers: {
            'ngrok-skip-browser-warning': 'true',
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate'
          }
        },
        cors: true
      },
      // Configuración específica para rutas de API
      '/api/**': {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      },
      // Proxy para API de Wagtail v2 (navbar, footer, eventos, etc)
      '/api/v2/**': {
        proxy: {
          to: `${process.env.NUXT_PUBLIC_API_BASE || ''}/api/v2/**`,
          headers: {
            'ngrok-skip-browser-warning': 'true',
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept-Language'
          }
        },
        cors: true
      },
      // Configuración para proxy-wagtail (páginas y otros recursos de Wagtail)
      '/api/proxy-wagtail': {
        proxy: {
          to: `${process.env.NUXT_PUBLIC_API_BASE || ''}/api/proxy-wagtail`,
          // No especificamos 'to' directamente, se maneja en el server middleware
        },
        cors: true,
        headers: {
          'ngrok-skip-browser-warning': 'true',
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
      }
    },
    // Configuración experimental para mejor manejo de binarios
    experimental: {
      wasm: true
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
