// Composable para manejo simplificado de la API de Wagtail
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { useNoCacheStrategy } from './useNoCacheStrategy'

export function useWagtailApi() {
  // Obtener estrategias anti-caché
  const { addNoCacheParams, noCacheFetchOptions } = useNoCacheStrategy()
  const isLoading = ref(false)
  const error = ref(null)
  const route = useRoute()
  
  /**
   * Detecta el idioma actual basado en la URL o localStorage
   * @returns {string} - Código del idioma (es, en, fr, etc.)
   */
  const detectCurrentLanguage = () => {
    // 1. Intentar obtener del localStorage (configuración guardada por el usuario)
    const savedLanguage = localStorage?.getItem?.('currentLanguage')
    if (savedLanguage) {
      return savedLanguage
    }
    
    // 2. Intentar extraer de la ruta actual (primera parte del path /es/, /en/, etc.)
    if (route?.path) {
      const pathSegments = route.path.split('/').filter(Boolean)
      if (pathSegments.length > 0) {
        const firstSegment = pathSegments[0].toLowerCase()
        // Verificar si parece un código de idioma (2-3 letras)
        if (firstSegment.length >= 2 && firstSegment.length <= 3) {
          return firstSegment
        }
      }
    }
    
    // 3. Valor por defecto
    return 'es'
  }

  /**
   * Obtener datos de la API de Wagtail usando el proxy
   * @param {string} endpoint - Endpoint relativo de la API de Wagtail
   * @returns {Promise<any>} - Datos de la API deserializados
   */
  const getDataFromUrl = async (endpoint: string) => {
    isLoading.value = true
    error.value = null

    try {
      // Obtener el idioma actual
      const currentLang = detectCurrentLanguage()
      
      // Si el endpoint no empieza con /, agregarlo
      const urlEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
      
      // Añadir parámetro de idioma si no está ya incluido
      const finalEndpoint = urlEndpoint.includes('locale=') 
        ? urlEndpoint 
        : urlEndpoint.includes('?') 
          ? `${urlEndpoint}&locale=${currentLang}` 
          : `${urlEndpoint}?locale=${currentLang}`
      
      // console.log(`[useWagtailApi] Obteniendo datos desde: ${finalEndpoint} (idioma: ${currentLang})`)
      
      // Crear una URL base con el endpoint
      const baseProxyUrl = `/api/proxy-wagtail?url=${finalEndpoint}`
      
      // Añadir parámetros anti-caché a la URL
      const noCacheUrl = addNoCacheParams(baseProxyUrl)
      
      // console.log(`[useWagtailApi] URL con parámetros anti-caché: ${noCacheUrl}`)
      
      // Usamos el proxy para evitar problemas de CORS con opciones anti-caché
      const { data, error: fetchError } = await useFetch(noCacheUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
        },
        retry: 2,
        timeout: 10000,
        // Clave única para evitar caché interno de Nuxt
        key: `wagtail_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        // Desactivar caché de Nuxt - usar 'no-store' en lugar de false
        cache: 'no-store'
      })

      if (fetchError.value) {
        // console.error('[useWagtailApi] Error en el fetch:', fetchError.value)
        throw new Error(`Error en la petición: ${fetchError.value.message || 'Desconocido'}`)
      }

      if (!data.value) {
        // console.error('[useWagtailApi] No se obtuvieron datos')
        throw new Error('No se recibieron datos de la API')
      }

      // Aseguramos que el resultado sea un objeto JSON plano (no un Proxy)
      const result = JSON.parse(JSON.stringify(data.value))
      // console.log(`[useWagtailApi] Datos recibidos:`, typeof result)
      
      return result
    } catch (err: any) {
      // console.error(`[useWagtailApi] Error:`, err)
      error.value = err.message || 'Error desconocido'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Normaliza una URL eliminando hosts y asegurando formato consistente
   */
  const normalizeUrl = (url: string): string => {
    if (!url) return '/'
    
    // Eliminar protocolo, host y puerto si existen
    let normalized = url.replace(/^(https?:\/\/)?[^\/]+(\/|$)/, '/')
    
    // Asegurar que empiece con /
    if (!normalized.startsWith('/')) {
      normalized = `/${normalized}`
    }
    
    // Eliminar dobles slashes
    normalized = normalized.replace(/\/+/g, '/')
    
    return normalized
  }

  /**
   * Obtener una página por su ID
   * @param {number|string} id - ID de la página a obtener
   * @returns {Promise<any>} - Datos de la página
   */
  const getPageById = async (id: number | string): Promise<any> => {
    try {
      // Construir la URL para obtener la página por su ID
      const pageUrl = `/api/v2/pages/${id}/`;
      
      // Obtener la página usando la función getDataFromUrl
      return await getDataFromUrl(pageUrl);
    } catch (err) {
      // console.error(`[useWagtailApi] Error al obtener página con ID ${id}:`, err);
      throw err;
    }
  };

  return {
    getDataFromUrl,
    normalizeUrl,
    getPageById,
    isLoading,
    error
  }
}
