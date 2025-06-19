// Plugin para configurar el cliente HTTP y manejar las peticiones a la API
import { defineNuxtPlugin } from '#app';

export default defineNuxtPlugin((nuxtApp) => {
  // No necesitamos interceptores ya que usamos useFetch para las peticiones
  
  // Proporcionar funciones utilitarias para las peticiones a la API
  return {
    provide: {
      // Función para determinar si estamos en producción o desarrollo
      isProduction: (): boolean => {
        if (typeof window !== 'undefined') {
          return window.location.hostname !== 'localhost' && 
                 !window.location.hostname.includes('127.0.0.1');
        }
        return process.env.NODE_ENV === 'production';
      },
      
      // Función para obtener la URL correcta para el proxy de Wagtail
      getApiUrl: (endpoint: string): string => {
        return `/api/proxy-wagtail?url=${encodeURIComponent(endpoint)}`;
      }
    }
  };
});
