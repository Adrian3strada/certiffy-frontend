/**
 * Composable para implementar estrategias anti-caché en peticiones y renderizado
 * Proporciona utilidades para asegurar que el contenido siempre esté actualizado
 */
import { ref } from 'vue';

export const useNoCacheStrategy = () => {
  // Timestamp único para esta sesión
  const sessionTimestamp = ref(Date.now());
  
  // Contador incremental para asegurar valores únicos
  const requestCounter = ref(0);
  
  /**
   * Añade parámetros anti-caché a una URL
   * @param url URL a la que añadir parámetros anti-caché
   * @returns URL con parámetros anti-caché añadidos
   */
  const addNoCacheParams = (url: string): string => {
    // Incrementar contador para cada solicitud
    requestCounter.value++;
    
    // Crear un timestamp actual
    const timestamp = Date.now();
    
    // Determinar el separador correcto (? o &)
    const separator = url.includes('?') ? '&' : '?';
    
    // Añadir múltiples parámetros para mayor seguridad contra diferentes niveles de caché
    return `${url}${separator}_nocache=${timestamp}_${sessionTimestamp.value}_${requestCounter.value}`;
  };
  
  /**
   * Genera una clave única para componentes Vue
   * Útil para forzar re-renderizado cuando se necesita
   */
  const generateUniqueKey = (baseKey: string): string => {
    return `${baseKey}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  };
  
  /**
   * Opciones para useFetch que evitan el caché
   */
  const noCacheFetchOptions = {
    key: `fetch_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    cache: false as const,
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }
  };
  
  /**
   * Wrapper para useFetch que asegura que no se use caché
   */
  const fetchWithNoCache = async <T>(url: string, options: any = {}): Promise<T> => {
    // Añadir parámetros anti-caché a la URL
    const noCacheUrl = addNoCacheParams(url);
    
    // Combinar opciones proporcionadas con opciones anti-caché
    const fetchOptions = {
      ...noCacheFetchOptions,
      ...options,
      headers: {
        ...noCacheFetchOptions.headers,
        ...(options.headers || {})
      }
    };
    
    // Generar una clave única para esta solicitud
    fetchOptions.key = `fetch_${url.replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}`;
    
    // Realizar la solicitud con useFetch
    const { data, error } = await useFetch<T>(noCacheUrl, fetchOptions);
    
    if (error.value) {
      console.error('Error en fetchWithNoCache:', error.value);
      throw error.value;
    }
    
    return data.value as T;
  };
  
  /**
   * Fuerza una recarga completa de la página actual
   */
  const forcePageReload = () => {
    if (process.client) {
      window.location.reload();
    }
  };
  
  return {
    addNoCacheParams,
    generateUniqueKey,
    noCacheFetchOptions,
    fetchWithNoCache,
    forcePageReload
  };
};
