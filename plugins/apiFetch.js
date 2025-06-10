// Plugin para proporcionar un helper inteligente para hacer fetching de datos
import { defineNuxtPlugin, useFetch } from '#app';

export default defineNuxtPlugin(() => {
  return {
    provide: {
      apiFetch: async (url, options = {}) => {
        // Determinar si estamos en navegación del cliente (component ya montado) o en setup/SSR
        if (process.client && document.readyState === 'complete') {
          // En navegación del cliente, usamos fetch nativo para evitar la advertencia
          try {
            // Usar fetch nativo cuando estamos en el cliente
            const response = await fetch(url, options).then(res => res.json());
            return { data: { value: response }, error: { value: null } };
          } catch (err) {
            console.error('Error en fetch:', err);
            return { data: { value: null }, error: { value: err } };
          }
        } else {
          // En SSR o primera carga, usamos useFetch
          // Aseguramos que tenga una key única para evitar problemas de cache
          const uniqueKey = options.key || `${url}-${Date.now()}`;
          return useFetch(url, { ...options, key: uniqueKey });
        }
      }
    }
  };
});
