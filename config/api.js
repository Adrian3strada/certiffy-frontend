// Configuración centralizada para las rutas de la API de Wagtail
import { API_BASE_URL } from '~/composables/useWagtailApi';

// IDs de páginas en Wagtail que pueden cambiar
export const API_ROUTES = {
  // Página principal
  HOME_PAGE: `${API_BASE_URL}/api/v2/pages/3/`,
  
  // Página de noticias
  NEWS_PAGE: `${API_BASE_URL}/api/v2/pages/14/`,
  
  // Página de acerca de
  ABOUT_PAGE: `${API_BASE_URL}/api/v2/pages/15/`,
  
  // Ruta base para obtener páginas
  PAGES_BASE: `${API_BASE_URL}/api/v2/pages/`,
  
  // Función para obtener una página por ID
  getPageById: (id) => `${API_BASE_URL}/api/v2/pages/${id}/`,
  
  // Función para obtener bloques por ID
  getBlockById: (id) => `${API_BASE_URL}/api/v2/blocks/${id}/`
};
