import { ref, reactive, readonly, computed, type ComputedRef, type Ref } from 'vue'
import { API_ROUTES } from '~/config/api'
import type { UseFetchOptions } from '#app'
import { useNoCacheStrategy } from './useNoCacheStrategy'
import { useMediaUrl } from './useMediaUrl'

// Interfaces adicionales para la estructura del navbar
interface NavItem {
  title: string
  url: string
  children?: NavItem[]
}

// Tipo para los datos del navbar
interface NavbarData {
  navbar: NavItem[]
  logo: string
  favicon?: string
  current_language?: string
  [key: string]: any // Para campos adicionales
}

// Tipo para la respuesta del composable
interface NavbarComposableResponse {
  navbarData: {
    navbar?: NavItem[],
    logo?: string,
    favicon?: string,
    current_language?: string
  },
  logoUrl: ComputedRef<string>, // URL específica del logo para facilitar acceso
  navItems: ComputedRef<NavItem[]>, // Items de navegación para facilitar acceso
  isLoading: Readonly<Ref<boolean>>,
  error: Readonly<Ref<Error | null>>,
  refresh: (specificLocale?: string | null) => Promise<void>
}

export function useNavbar() {
  // Obtener estrategias anti-caché
  const { addNoCacheParams, generateUniqueKey, noCacheFetchOptions } = useNoCacheStrategy()
  
  const isLoading = ref(false)
  const error = ref<Error | null>(null)
  const data = reactive<{navbar: NavbarData | null}>({
    navbar: null
  })

  // Opciones para fetch con estrategia anti-caché
  const options: UseFetchOptions<NavbarData> = {
    key: generateUniqueKey('navbar-data'),
    server: true,
    lazy: false,
    // Quitar watch para evitar errores de tipo
    default: () => null,
    cache: 'no-store',
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache'
    }
  }

  // Cache para almacenar datos del navbar por idioma
const navbarCache = reactive<{[key: string]: any}>({});

async function fetchNavbar(specificLocale: string | null = null): Promise<void> {
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
          // console.error('Error accediendo a localStorage:', e);
        }
      }
      
      // console.log(`Iniciando solicitud para navbar con idioma: ${currentLocale}`);
      
      // IMPORTANTE: Desactivamos temporalmente la caché por idioma para depurar
      // const cacheKey = `navbar-${currentLocale}`;
      // if (navbarCache[cacheKey]) {
      //   // console.log(`Usando datos en caché para navbar en idioma ${currentLocale}`);
      //   data.navbar = navbarCache[cacheKey];
      //   return;
      // }
      
      // Obtener la URL para el navbar (usando proxy local para evitar CORS)
      // Usar ruta local proxificada en lugar de la URL directa para evitar problemas CORS
      let apiEndpoint = `/api/v2/navbar/?locale=${currentLocale}`;
      
      // Añadir parámetros anti-caché a la URL
      const noCacheUrl = addNoCacheParams(apiEndpoint);
      
      // console.log(`URL para obtener navbar: ${noCacheUrl} (con parámetros anti-caché)`);
      
      // Usar el endpoint con parámetros anti-caché
      const { data: navbarData, error: fetchError } = await useFetch<NavbarData>(noCacheUrl, options)

      if (fetchError.value) {
        throw new Error(fetchError.value.message)
      }

      if (navbarData.value) {
        // Mostrar en consola la estructura exacta para debugging
        // console.log(`Datos recibidos del navbar para idioma ${currentLocale}:`, JSON.stringify(navbarData.value, null, 2))
        
        // Actualizar los datos reactivos directamente sin usar caché
        data.navbar = navbarData.value
        // console.log('Datos asignados a data.navbar:', data.navbar);
      } else {
        // console.error(`No se recibieron datos para el navbar en idioma ${currentLocale}`);
      }
    } catch (err: any) {
      error.value = err instanceof Error ? err : new Error(String(err))
      // console.error('Error fetching navbar data:', err)
    } finally {
      isLoading.value = false
    }
  }

  // Iniciar la carga inmediatamente
  fetchNavbar()

  // Obtener utilidad para URLs de medios
  const { getProxiedMediaUrl } = useMediaUrl();

  // Computed para facilitar acceso a propiedades específicas
  const logoUrl = computed<string>(() => {
    // Si hay logo, convertirlo a URL absoluta y proxiada
    return getProxiedMediaUrl(data.navbar?.logo);
  });
  const navItems = computed<NavItem[]>(() => data.navbar?.navbar || []);

  // Transformar los datos para que coincidan con la interfaz NavbarComposableResponse
  const navbarComposableResponse: NavbarComposableResponse = {
    navbarData: {
      navbar: data.navbar?.navbar,
      logo: data.navbar?.logo,
      favicon: data.navbar?.favicon,
      current_language: data.navbar?.current_language
    },
    logoUrl,
    navItems,
    isLoading: readonly(isLoading),
    error: readonly(error),
    refresh: fetchNavbar
  }
  
  return navbarComposableResponse
}
