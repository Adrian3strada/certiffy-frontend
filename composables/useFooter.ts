import { ref, reactive, readonly, computed } from 'vue'
import { API_ROUTES } from '~/config/api'
import type { UseFetchOptions } from '#app'
import { useNoCacheStrategy } from './useNoCacheStrategy'
import { useMediaUrl } from './useMediaUrl'

// Tipo para los datos del footer
interface FooterData {
  logo?: string // Cambiado a string para coincidir con la respuesta de la API
  favicon?: string
  items?: Array<{
    id: number
    title: string
    url: string
  }>
  social_networks?: {
    facebook?: string
    twitter?: string
    instagram?: string
    linkedin?: string
    youtube?: string
  }
  columns?: Array<{
    title: string
    links: Array<{
      text: string
      url: string
    }>
  }>
  copyright?: string
  current_language?: string
  [key: string]: any // Para campos adicionales
}

export function useFooter() {
  // Obtener estrategias anti-caché
  const { addNoCacheParams, generateUniqueKey } = useNoCacheStrategy()
  
  const isLoading = ref(false)
  const error = ref<Error | null>(null)
  const data = reactive<{footer: FooterData | null}>({
    footer: null
  })

  // Opciones para fetch con estrategia anti-caché
  const options: UseFetchOptions<FooterData> = {
    key: generateUniqueKey('footer-data'),
    server: true,
    lazy: false,
    default: () => null,
    cache: 'no-store',
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache'
    }
  }

  async function fetchFooter(specificLocale: string | null = null): Promise<void> {
    isLoading.value = true
    error.value = null
    try {
      // Detectar el idioma actual desde localStorage, parámetro o valor por defecto
      let currentLocale = 'es';
      if (specificLocale) {
        currentLocale = specificLocale;
      } else if (process.client) {
        try {
          const savedLocale = localStorage.getItem('currentLocale');
          if (savedLocale) {
            currentLocale = savedLocale;
          }
        } catch (e) {
          console.error('Error accediendo a localStorage:', e);
        }
      }
      
      console.log(`Iniciando solicitud para footer con idioma: ${currentLocale}`);
      
      // IMPORTANTE: Desactivamos temporalmente la caché por idioma para depurar
      // const cacheKey = `footer-${currentLocale}`;
      // if (footerCache[cacheKey]) {
      //   console.log(`Usando datos en caché para footer en idioma ${currentLocale}`);
      //   data.footer = footerCache[cacheKey];
      //   return;
      // }
      
      // Usar ruta local proxificada en lugar de la URL directa para evitar problemas CORS
      let apiEndpoint = `/api/v2/footer/?locale=${currentLocale}`;
      
      // Añadir parámetros anti-caché a la URL
      const noCacheUrl = addNoCacheParams(apiEndpoint);
      
      console.log(`URL para obtener footer: ${noCacheUrl} (con parámetros anti-caché)`);
      
      // Usar el endpoint con parámetros anti-caché
      const { data: footerData, error: fetchError } = await useFetch<FooterData>(noCacheUrl, options)

      if (fetchError.value) {
        throw new Error(fetchError.value.message)
      }

      if (footerData.value) {
        // Mostrar en consola la estructura exacta para debugging
        console.log(`Datos recibidos del footer para idioma ${currentLocale}:`, JSON.stringify(footerData.value, null, 2))
        
        // Actualizar los datos reactivos directamente sin usar caché
        data.footer = footerData.value
        console.log('Datos asignados a data.footer:', data.footer);
      } else {
        console.error(`No se recibieron datos para el footer en idioma ${currentLocale}`);
      }
    } catch (err: any) {
      error.value = err instanceof Error ? err : new Error(String(err))
      console.error('Error fetching footer data:', err)
    } finally {
      isLoading.value = false
    }
  }

  // Iniciar la carga inmediatamente
  fetchFooter()

  // Obtener utilidad para URLs de medios
  const { getProxiedMediaUrl } = useMediaUrl();
  
  // Computed para facilitar acceso a propiedades específicas
  const logoUrl = computed(() => getProxiedMediaUrl(data.footer?.logo));
  const faviconUrl = computed(() => getProxiedMediaUrl(data.footer?.favicon));
  const footerItems = computed(() => data.footer?.items || []);

  return {
    footerData: readonly(data),
    logoUrl,
    faviconUrl,
    footerItems,
    isLoading: readonly(isLoading),
    error: readonly(error),
    refresh: fetchFooter
  }
}
