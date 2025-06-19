// Configuración centralizada para las rutas de la API de Wagtail

// Función para obtener la URL base de la API desde el runtime config
function getApiBaseUrl(): string {
  if (process.client) {
    // En el cliente, usar useRuntimeConfig
    const config = useRuntimeConfig();
    return config.public.apiBase;
  } else {
    // En el servidor, usar process.env como fallback
    return process.env.NUXT_PUBLIC_API_BASE || 'https://8238-2806-103e-1d-60a8-8835-550a-ee2a-b870.ngrok-free.app';
  }
}

export const API_ROUTES = {
  // Base API path
  get API_BASE(): string {
    return `${getApiBaseUrl()}/api/v2`;
  },
  
  // Ruta base para obtener páginas
  get PAGES_BASE(): string {
    return `${getApiBaseUrl()}/api/v2/pages/`;
  },
  
  // Endpoints dinámicos para componentes
  get FOOTER(): string {
    return `${getApiBaseUrl()}/api/v2/footer/`;
  },
  get NAVBAR(): string {
    return `${getApiBaseUrl()}/api/v2/navbar/`;
  },
  get LOCALES(): string {
    return `${getApiBaseUrl()}/api/v2/locales/`;
  },
  get NOTICIAS(): string {
    return `${getApiBaseUrl()}/api/v2/noticias/`;
  },
  get CATEGORIAS_TAGS(): string {
    return `${getApiBaseUrl()}/api/v2/categorias-tags/`;
  },
  
  // Función para obtener una página por ID
  getPageById: (id: number): string => `${getApiBaseUrl()}/api/v2/pages/${id}/`,
  
  // Función para obtener bloques por ID
  getBlockById: (id: number): string => `${getApiBaseUrl()}/api/v2/blocks/${id}/`,
  
  // Función para obtener página por slug
  getPageBySlug: (slug: string): string => `${getApiBaseUrl()}/api/v2/pages/?slug=${slug}`,
  
  // Función para buscar páginas
  searchPages: (query: string): string => `${getApiBaseUrl()}/api/v2/pages/?search=${query}`,
};
