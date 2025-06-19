// Configuración centralizada para las rutas de la API de Wagtail

// Función para obtener la URL base de la API desde el runtime config
// Obtenemos el prefijo de idioma (para API multiidioma)
const DEFAULT_LOCALE = 'es';

function getLocaleParam(): string {
  return `locale=${DEFAULT_LOCALE}`;
}

function getApiBaseUrl(): string {
  if (process.client) {
    // En el cliente, usar useRuntimeConfig
    const config = useRuntimeConfig();
    return config.public.apiBase;
  } else {
    // En el servidor, usar process.env como fallback
    return process.env.NUXT_PUBLIC_API_BASE || '';
  }
}

export const API_ROUTES = {
  // Base API path
  get API_BASE(): string {
    return `${getApiBaseUrl()}/api/v2`;
  },
  
  // Ruta base para obtener páginas
  get PAGES_BASE(): string {
    return `${getApiBaseUrl()}/api/v2/pages/?${getLocaleParam()}`;
  },
  
  // Ruta base para obtener páginas
  get PAGES(): string {
    return `${getApiBaseUrl()}/api/v2/pages/?${getLocaleParam()}`;
  },
  
  // Ruta base para obtener documentos
  get DOCUMENTS(): string {
    return `${getApiBaseUrl()}/api/v2/documents/?${getLocaleParam()}`;
  },
  
  // Ruta base para obtener imágenes
  get IMAGES(): string {
    return `${getApiBaseUrl()}/api/v2/images/?${getLocaleParam()}`;
  },
  
  // Ruta base para obtener bloques
  get BLOCKS(): string {
    return `${getApiBaseUrl()}/api/v2/blocks/?${getLocaleParam()}`;
  },
  
  // Endpoints dinámicos para componentes
  get FOOTER(): string {
    return `${getApiBaseUrl()}/api/v2/footer/?${getLocaleParam()}`;
  },
  get NAVBAR(): string {
    return `${getApiBaseUrl()}/api/v2/navbar/?${getLocaleParam()}`;
  },
  get LOCALES(): string {
    return `${getApiBaseUrl()}/api/v2/locales/?${getLocaleParam()}`;
  },
  get NOTICIAS(): string {
    return `${getApiBaseUrl()}/api/v2/noticias/?${getLocaleParam()}`;
  },
  get CATEGORIAS_TAGS(): string {
    return `${getApiBaseUrl()}/api/v2/categorias-tags/?${getLocaleParam()}`;
  },
  
  // Función para obtener una página por ID
  getPageById: (id: number): string => `${getApiBaseUrl()}/api/v2/pages/${id}/?${getLocaleParam()}`,
  
  // Función para obtener bloques por ID
  getBlockById: (id: number): string => `${getApiBaseUrl()}/api/v2/blocks/${id}/?${getLocaleParam()}`,
  
  // Función para obtener página por slug
  getPageBySlug: (slug: string): string => `${getApiBaseUrl()}/api/v2/pages/?slug=${slug}&${getLocaleParam()}`,
  
  // Función para buscar páginas
  searchPages: (query: string): string => `${getApiBaseUrl()}/api/v2/pages/?search=${query}&${getLocaleParam()}`,
};
