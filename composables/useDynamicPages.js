// Composable para manejar páginas dinámicas desde Wagtail
import { ref, computed } from 'vue';
import { useWagtailApi, API_BASE_URL } from './useWagtailApi';

export function useDynamicPages() {
  // Obtener funciones del API de Wagtail
  const { getDataFromUrl, getPageById: apiGetPageById } = useWagtailApi();
  
  // Estado para manejar rutas y páginas
  const pageCache = ref(new Map());
  const siteMap = ref([]); // Lista de todas las páginas del sitio
  const loading = ref(false);
  const error = ref(null);
  
  // Mapa de rutas conocidas como referencia rápida para IDs comunes
  // NOTA: Esto es solo una optimización, todas las páginas se detectan automáticamente
  const KNOWN_ROUTES = {
    '/': { id: 3, slug: 'certiffy' },          // Página principal
    '/certiffy': { id: 3, slug: 'certiffy' },  // Alias para la página principal
    '/noticias': { id: 14, slug: 'noticias' }, // Página de noticias
    '/acerca-de': { id: 11, slug: 'acerca-de' }  // Página acerca de (ID actualizado según el JSON proporcionado)
  };
  
  // Función para cargar todas las páginas del sitio
  const loadSiteMap = async () => {
    if (siteMap.value.length > 0) {
      // Ya tenemos el mapa del sitio cargado
      return siteMap.value;
    }
    
    try {
      // Obtener todas las páginas desde la API
      const pagesUrl = `/api/v2/pages/`;
      const result = await getDataFromUrl(pagesUrl);
      
      if (result && result.items && Array.isArray(result.items)) {
        // Procesar cada página
        const processedPages = result.items.map(page => ({
          id: page.id,
          title: page.title,
          slug: page.meta.slug,
          url: page.meta.html_url,
          type: page.meta.type,
          parent: page.meta.parent?.id || null
        }));
        
        // Guardar el mapa del sitio
        siteMap.value = processedPages;
        console.log('Mapa del sitio cargado:', processedPages);
        return processedPages;
      }
      
      throw new Error('No se pudo obtener el mapa del sitio');
    } catch (err) {
      console.error('Error al cargar el mapa del sitio:', err);
      // Si falla, devolvemos un array vacío
      return [];
    }
  };
  
  // Obtener página por ID
  const getPageById = async (id) => {
    loading.value = true;
    error.value = null;
    
    try {
      console.log(`Obteniendo página con ID: ${id}`);
      
      // Verificar si ya tenemos la página en caché por ID
      const cachedPageEntry = Array.from(pageCache.value.entries()).find(
        ([_, page]) => page.id === parseInt(id)
      );
      
      if (cachedPageEntry) {
        console.log(`Página con ID ${id} encontrada en caché`);
        loading.value = false;
        return cachedPageEntry[1];
      }
      
      // Construir la URL para obtener la página por su ID
      const pageUrl = `/api/v2/pages/${id}/`;
      console.log(`Solicitando página a: ${pageUrl}`);
      
      // Usar el proxy para evitar problemas de CORS
      const proxyUrl = `/api/proxy-wagtail?url=${encodeURIComponent(API_BASE_URL + pageUrl)}`;
      console.log(`URL del proxy: ${proxyUrl}`);
      
      // Obtener la página desde la API usando el proxy
      const data = await getDataFromUrl(proxyUrl);
      
      if (!data) {
        throw new Error(`No se encontraron datos para la página con ID ${id}`);
      }
      
      console.log(`Datos recibidos para página ID ${id}:`, data.title);
      
      // Guardar en caché usando el slug
      if (data.meta && data.meta.slug) {
        pageCache.value.set(data.meta.slug, data);
      }
      
      loading.value = false;
      return data;
    } catch (err) {
      console.error(`Error al obtener página con ID ${id}:`, err);
      error.value = err.message;
      loading.value = false;
      return null;
    }
  };
  
  // Buscar página por slug
  const findPageBySlug = async (slug) => {
    loading.value = true;
    error.value = null;
    
    try {
      // Normalizar el slug
      const normalizedSlug = slug.startsWith('/') ? slug.substring(1) : slug;
      
      // Verificar si ya tenemos la página en caché
      if (pageCache.value.has(normalizedSlug)) {
        loading.value = false;
        return pageCache.value.get(normalizedSlug);
      }
      
      // Intentar cargar el mapa del sitio si no lo tenemos
      if (siteMap.value.length === 0) {
        await loadSiteMap();
      }
      
      // Buscar en el mapa del sitio
      const page = siteMap.value.find(p => p.slug === normalizedSlug);
      if (page) {
        // Encontramos la página en el mapa del sitio
        const pageData = await getPageById(page.id);
        if (pageData) {
          loading.value = false;
          return pageData;
        }
      }
      
      // Verificar si el slug está en las rutas conocidas
      if (KNOWN_ROUTES[`/${normalizedSlug}`] || KNOWN_ROUTES[slug]) {
        const route = KNOWN_ROUTES[`/${normalizedSlug}`] || KNOWN_ROUTES[slug];
        const pageData = await getPageById(route.id);
        if (pageData) {
          loading.value = false;
          return pageData;
        }
      }
      
      // Buscar directamente en la API por slug
      const searchUrl = `/api/v2/pages/?slug=${encodeURIComponent(normalizedSlug)}`;
      const searchResult = await getDataFromUrl(searchUrl);
      
      if (searchResult && searchResult.items && searchResult.items.length > 0) {
        const pageId = searchResult.items[0].id;
        const pageData = await getPageById(pageId);
        
        if (pageData) {
          loading.value = false;
          return pageData;
        }
      }
      
      // Si no se encuentra de ninguna forma, lanzar error
      throw new Error(`No se encontró una página con el slug: ${normalizedSlug}`);
    } catch (err) {
      console.error(`Error al buscar página con slug ${slug}:`, err);
      error.value = err.message;
      loading.value = false;
      return null;
    }
  };
  
  // Obtener el ID de la página a partir de una ruta
  const getPageIdFromRoute = async (route) => {
    // Normalizar la ruta
    const normalizedRoute = route.endsWith('/') ? route.slice(0, -1) : route;
    
    // Si la ruta está en nuestro mapa conocido
    if (KNOWN_ROUTES[normalizedRoute]) {
      return KNOWN_ROUTES[normalizedRoute].id;
    }
    
    // Si no, intentamos buscar por slug
    const slug = normalizedRoute === '/' ? '' : normalizedRoute.substring(1);
    const pageData = await findPageBySlug(slug);
    
    if (pageData) {
      return pageData.id;
    }
    
    // Si no encontramos, devolvemos la página principal
    console.warn(`No se encontró página para la ruta ${route}, redirigiendo a la página principal`);
    return 3; // ID de la página principal por defecto
  };
  
  // Obtener mapa del sitio (páginas y sus relaciones)
  const getSiteMap = async () => {
    if (siteMap.value.length === 0) {
      await loadSiteMap();
    }
    return siteMap.value;
  };
  
  return {
    findPageBySlug,
    getPageById,
    getPageIdFromRoute,
    getSiteMap,
    loadSiteMap,
    loading,
    error,
    siteMap,
    KNOWN_ROUTES
  };
}
