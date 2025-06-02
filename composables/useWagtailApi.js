import { ref } from 'vue';

// URL base de la API de Wagtail - centralizada para toda la aplicación
// Usar la URL de ngrok que sabemos que funciona
export const API_BASE_URL = 'https://e412-2806-103e-1d-3687-f08f-4014-a8d6-4606.ngrok-free.app';

// Flag para indicar si debemos usar el proxy (siempre true en desarrollo para evitar CORS)
export const USE_PROXY = true;

// Función auxiliar para determinar si estamos en producción (Vercel) o desarrollo local
export const isProduction = () => {
  if (typeof window !== 'undefined') {
    return window.location.hostname !== 'localhost' && !window.location.hostname.includes('127.0.0.1');
  }
  return false;
};

export function useWagtailApi() {
  const loading = ref(false);
  const error = ref(null);
  
  /**
   * Obtener datos de una URL completa
   * @param {string} url - URL completa para obtener datos
   * @returns {Promise<Object>} - Datos obtenidos de la URL
   */
  const getDataFromUrl = async (url) => {
    loading.value = true;
    error.value = null;
    
    try {
      let finalUrl;
      
      // Si la URL ya es para el proxy, usarla directamente
      if (url.startsWith('/api/proxy-')) {
        finalUrl = url;
      }
      // Si es una URL relativa a la API de Wagtail, usar el proxy
      else if (url.startsWith('/api/v2/')) {
        finalUrl = `/api/proxy-wagtail?url=${encodeURIComponent(`${API_BASE_URL}${url}`)}`;          
      }
      // Si es una URL completa externa, usarla directamente
      else if (url.startsWith('http://') || url.startsWith('https://')) {
        finalUrl = url;
      }
      // Cualquier otra URL relativa, asumimos que es para la API
      else {
        const apiPath = url.startsWith('/') ? url : `/${url}`;
        finalUrl = `/api/proxy-wagtail?url=${encodeURIComponent(`${API_BASE_URL}${apiPath}`)}`;          
      }
      
      console.log('Obteniendo datos de:', finalUrl);
      
      // Realizar la petición
      const response = await fetch(finalUrl);
      
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Datos obtenidos correctamente:', data);
      
      loading.value = false;
      return data;
    } catch (err) {
      console.error('Error al obtener datos:', err);
      error.value = err.message;
      loading.value = false;
      
      // Devolver un objeto de error para manejarlo en el componente
      return { error: true, message: err.message };
    }
  };

  /**
   * Obtener una página por su ID
   * @param {number} id - ID de la página
   * @returns {Promise<Object>} - Datos de la página
   */
  const getPageById = async (id) => {
    loading.value = true;
    error.value = null;
    
    try {
      // Construir la URL para la API
      const pageUrl = `/api/v2/pages/${id}/`;
      // La función getDataFromUrl se encargará de usar el proxy si es necesario
      const data = await getDataFromUrl(pageUrl);
      
      if (data.error) {
        throw new Error(data.message);
      }
      
      loading.value = false;
      return data;
    } catch (err) {
      console.error(`Error al obtener la página con ID ${id}:`, err);
      error.value = err.message;
      loading.value = false;
      return null;
    }
  };

  /**
   * Buscar páginas por tipo
   * @param {string} type - Tipo de página a buscar
   * @returns {Promise<Array>} - Array de páginas encontradas
   */
  const getPagesByType = async (type) => {
    loading.value = true;
    error.value = null;
    
    try {
      // Construir la URL para la búsqueda por tipo
      const searchUrl = `/api/v2/pages/?type=${encodeURIComponent(type)}`;
      const data = await getDataFromUrl(searchUrl);
      
      if (data.error) {
        throw new Error(data.message);
      }
      
      loading.value = false;
      return data.items || [];
    } catch (err) {
      console.error(`Error al buscar páginas de tipo ${type}:`, err);
      error.value = err.message;
      loading.value = false;
      return [];
    }
  };

  /**
   * Buscar página por slug
   * @param {string} slug - Slug de la página a buscar
   * @returns {Promise<Object>} - Datos de la página encontrada
   */
  const findPageBySlug = async (slug) => {
    loading.value = true;
    error.value = null;
    
    try {
      // Construir la URL para la búsqueda por slug
      const searchUrl = `/api/v2/pages/?slug=${encodeURIComponent(slug)}`;
      const data = await getDataFromUrl(searchUrl);
      
      if (data.error) {
        throw new Error(data.message);
      }
      
      // Verificar si se encontraron resultados
      if (data.items && data.items.length > 0) {
        // Obtener la primera página encontrada
        const pageId = data.items[0].id;
        return await getPageById(pageId);
      }
      
      throw new Error(`No se encontró una página con el slug: ${slug}`);
    } catch (err) {
      console.error(`Error al buscar página con slug ${slug}:`, err);
      error.value = err.message;
      loading.value = false;
      return null;
    }
  };

  /**
   * Obtener todas las páginas disponibles
   * @returns {Promise<Array>} - Array de todas las páginas
   */
  const getAllPages = async () => {
    loading.value = true;
    error.value = null;
    
    try {
      // Obtener todas las páginas
      const pagesUrl = `/api/v2/pages/`;
      const data = await getDataFromUrl(pagesUrl);
      
      if (data.error) {
        throw new Error(data.message);
      }
      
      loading.value = false;
      return data.items || [];
    } catch (err) {
      console.error('Error al obtener todas las páginas:', err);
      error.value = err.message;
      loading.value = false;
      return [];
    }
  };

  return {
    getDataFromUrl,
    getPageById,
    getPagesByType,
    findPageBySlug,
    getAllPages,
    loading,
    error
  };
}
