import { ref, reactive, readonly } from 'vue'
import { API_ROUTES } from '~/config/api'
import type { UseFetchOptions } from '#app'
import { useNoCacheStrategy } from './useNoCacheStrategy'

// Tipo para los datos de locales/idiomas
interface LocaleItem {
  code: string
  display_name: string
}

// El endpoint devuelve un array directo, no un objeto con locales
type LocalesData = LocaleItem[]

export function useLocales() {
  // Obtener estrategias anti-caché
  const { addNoCacheParams, generateUniqueKey } = useNoCacheStrategy()
  
  const isLoading = ref(false)
  const error = ref<Error | null>(null)
  const data = reactive<{locales: LocalesData, currentLocale: string}>({
    locales: [], // Inicializar como array vacío en lugar de null para evitar errores
    currentLocale: 'es' // Valor por defecto
  })

  // Opciones para fetch con estrategia anti-caché
  const options = {
    key: generateUniqueKey('locales-data'),
    cache: 'no-store' as const,
    server: true,
    lazy: false,
    watch: false,
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache'
    }
  }

  async function fetchLocales() {
    isLoading.value = true
    error.value = null
    try {
      // console.log('Iniciando solicitud de locales directamente desde la API...')
      
      // Usar directamente la API de Wagtail sin parámetros de consulta
      // para evitar errores 400 o CORS
      const apiEndpoint = '/api/v2/locales/';
      
      // console.log(`[useLocales] Usando endpoint limpio: ${apiEndpoint}`);
      
      // Usar useFetch sin parámetros adicionales para evitar errores
      const { data: localesData, error: fetchError } = await useFetch<LocalesData>(apiEndpoint, {
        headers: {
          'Accept': 'application/json',
          'Accept-Language': data.currentLocale
        },
        key: generateUniqueKey('locales-data'),
        cache: 'no-store', // Corregido: usar valor válido para RequestCache
        server: false,
        retry: 1
      })

      if (fetchError.value) {
        throw new Error(fetchError.value.message)
      }

      if (localesData.value && Array.isArray(localesData.value)) {
        // console.log('Datos recibidos de locales:', JSON.stringify(localesData.value, null, 2))
        data.locales = localesData.value as LocaleItem[]
        
        // Intentar obtener el idioma actual desde localStorage si está disponible
        if (process.client) {
          try {
            const storedLocale = localStorage.getItem('currentLocale')
            if (storedLocale) {
              data.currentLocale = storedLocale
            }
          } catch (e) {
            // console.error('Error al acceder a localStorage:', e)
          }
        }
      } else {
        // console.warn('No se recibieron datos de locales o el formato no es correcto')
        data.locales = [] // Asignar un array vacío como valor predeterminado
      }
    } catch (err: any) {
      error.value = err instanceof Error ? err : new Error(String(err))
      // console.error('Error fetching locales data:', err)
    } finally {
      isLoading.value = false
    }
  }

  // Iniciar la carga inmediatamente
  fetchLocales()

  // Función helper para cambiar el idioma
  function changeLocale(localeCode: string): void {
    // Aquí implementaremos la lógica para cambiar de idioma
    // De momento solo mostramos un mensaje en consola
    // console.log(`Changing locale to: ${localeCode}`)
    // Esta función deberá implementarse según la estrategia de i18n del proyecto
    // Por ejemplo, podrías usar navigateTo con el locale en la URL
    
    // Actualizar el valor en los datos reactivos
    data.currentLocale = localeCode
    
    // Guardar en localStorage para persistencia
    if (process.client) {
      try {
        localStorage.setItem('currentLocale', localeCode)
      } catch (e) {
        // console.error('Error al guardar en localStorage:', e)
      }
    }
  }

  return {
    localesData: readonly(data),
    isLoading: readonly(isLoading),
    error: readonly(error),
    refresh: fetchLocales,
    changeLocale
  }
}
