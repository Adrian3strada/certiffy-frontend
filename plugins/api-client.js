// Plugin para configurar el cliente HTTP y manejar las peticiones a la API
import { API_BASE_URL } from '../composables/useWagtailApi';

export default defineNuxtPlugin((nuxtApp) => {
  // Configurar interceptores globales para todas las peticiones fetch
  nuxtApp.hook('app:created', () => {
    // Esta función se ejecuta cuando la aplicación es creada
    console.log('Plugin API Client inicializado');
  });

  // Proporcionar funciones utilitarias para las peticiones a la API
  return {
    provide: {
      // Función para determinar si estamos en producción o desarrollo
      isProduction: () => {
        if (typeof window !== 'undefined') {
          return window.location.hostname !== 'localhost' && 
                 !window.location.hostname.includes('127.0.0.1');
        }
        return process.env.NODE_ENV === 'production';
      },
      
      // Función para obtener la URL correcta según el entorno
      getApiUrl: (endpoint) => {
        // En producción, usamos el proxy server-side
        // En desarrollo, podemos usar el proxy local
        const isProductionEnv = typeof window !== 'undefined' ? 
          (window.location.hostname !== 'localhost' && !window.location.hostname.includes('127.0.0.1')) : 
          (process.env.NODE_ENV === 'production');
          
        if (isProductionEnv) {
          return `/api/proxy-wagtail?url=${encodeURIComponent(endpoint)}`;
        } else {
          return `/api/proxy-wagtail?url=${encodeURIComponent(endpoint)}`;
        }
      }
    }
  };
});
