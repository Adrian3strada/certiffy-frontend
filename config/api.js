// Configuración centralizada para las rutas de la API de Wagtail
// Configuración centralizada para las rutas RELATIVAS de la API de Wagtail

export const API_ROUTES = {
  // Página principal
  HOME_PAGE: '/api/v2/pages/3/',
  
  // Página de noticias
  NEWS_PAGE: '/api/v2/pages/14/',
  
  // Página de acerca de
  ABOUT_PAGE: '/api/v2/pages/15/',
  
  // Ruta base para obtener páginas
  PAGES_BASE: '/api/v2/pages/',
  
  // Función para obtener una página por ID
  getPageById: (id) => `/api/v2/pages/${id}/`,
  
  // Función para obtener bloques por ID
  getBlockById: (id) => `/api/v2/blocks/${id}/`
};
