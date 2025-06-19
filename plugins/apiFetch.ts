// Plugin para proporcionar un helper inteligente para hacer fetching de datos
import { defineNuxtPlugin, useFetch } from '#app';
import type { UseFetchReturn, UseFetchOptions } from '#app';

export default defineNuxtPlugin(() => {
  return {
    provide: {
      apiFetch: async <T = any>(url: string, options: UseFetchOptions<T> = {}): Promise<{
        data: { value: T | null };
        error: { value: Error | null };
      }> => {
        // Determinar si estamos en navegación del cliente (component ya montado) o en setup/SSR
        if (process.client && document.readyState === 'complete') {
          // En navegación del cliente, usamos fetch nativo para evitar la advertencia
          try {
            // Usar fetch nativo cuando estamos en el cliente
            const response = await fetch(url, options as RequestInit).then(res => res.json());
            return { data: { value: response }, error: { value: null } };
          } catch (err) {
            // Elimino el // console.error para limpieza de código
            return { data: { value: null }, error: { value: err as Error } };
          }
        } else {
          // En SSR o primera carga, usamos useFetch
          // Aseguramos que tenga una key única para evitar problemas de cache
          const uniqueKey = (options.key as string) || `${url}-${Date.now()}`;
          return useFetch<T>(url, { ...options, key: uniqueKey }) as unknown as Promise<{
            data: { value: T | null };
            error: { value: Error | null };
          }>;
        }
      }
    }
  };
});
