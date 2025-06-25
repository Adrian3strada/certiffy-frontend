// Composable para manejar páginas dinámicas desde Wagtail
import { ref, computed } from 'vue';
import { useWagtailApi } from './useWagtailApi';
import { useRuntimeConfig } from '#app';
import { useNoCacheStrategy } from './useNoCacheStrategy';

// Interfaces para TypeScript
interface PageData {
  id: number;
  title: string;
  meta?: {
    slug: string;
    html_url: string;
    type: string;
    parent?: {
      id: number;
    } | null;
    search_description?: string;
  };
  content?: any;
}

interface SiteMapPage {
  id: number;
  title: string;
  slug: string;
  url: string;
  type: string;
  parent: number | null;
}

interface RouteInfo {
  id: number;
  slug: string;
}

interface KnownRoutes {
  [key: string]: RouteInfo;
}

export function useDynamicPages() {
  // Obtener funciones del API de Wagtail
  const { getDataFromUrl } = useWagtailApi();

  // Obtener estrategias anti-caché
  const { addNoCacheParams, generateUniqueKey } = useNoCacheStrategy();

  // Estado para manejar rutas y páginas
  const pageCache = ref<Map<string, PageData>>(new Map());
  const siteMap = ref<SiteMapPage[]>([]);
  const loading = ref<boolean>(false);
  const error = ref<string | null>(null);

  // Mapa de rutas conocidas como referencia rápida para IDs comunes
  const KNOWN_ROUTES: KnownRoutes = {
    '/': { id: 3, slug: 'certiffy' },          // Página principal
    '/certiffy': { id: 3, slug: 'certiffy' },  // Alias para la página principal
    '/noticias': { id: 14, slug: 'noticias' }, // Página de noticias
    '/acerca-de': { id: 11, slug: 'acerca-de' }  // Página acerca de
  };

  // Función para cargar todas las páginas del sitio
  const loadSiteMap = async (): Promise<SiteMapPage[]> => {
    if (siteMap.value.length > 0) {
      // Ya tenemos el mapa del sitio cargado
      return siteMap.value;
    }

    try {
      // Obtener todas las páginas desde la API
      const pagesUrl = `/api/v2/pages/`;
      // Añadir parámetros anti-caché a la URL
      const noCacheUrl = addNoCacheParams(pagesUrl);
      // console.log(`[useDynamicPages] Cargando mapa del sitio con URL anti-caché: ${noCacheUrl}`);
      const result = await getDataFromUrl(noCacheUrl);

      if (result && result.items && Array.isArray(result.items)) {
        // Procesar cada página
        const processedPages = result.items.map((page: PageData): SiteMapPage => ({
          id: page.id,
          title: page.title,
          slug: page.meta?.slug || '',
          url: page.meta?.html_url || '',
          type: page.meta?.type || '',
          parent: page.meta?.parent?.id || null
        }));

        // Guardar el mapa del sitio
        siteMap.value = processedPages;
        return processedPages;
      }

      throw new Error('No se pudo obtener el mapa del sitio');
    } catch (err) {
      // console.error('Error al cargar el mapa del sitio:', err);
      // Si falla, devolvemos un array vacío
      return [];
    }
  };

  // Obtener página por ID (función local)
  const getPageByIdLocal = async (id: number | string): Promise<PageData | null> => {
    loading.value = true;
    error.value = null;

    try {
      // Verificar si ya tenemos la página en caché por ID
      const cachedPageEntry = Array.from(pageCache.value.entries()).find(
        ([_, page]) => page.id === parseInt(id.toString())
      );

      if (cachedPageEntry) {
        loading.value = false;
        return cachedPageEntry[1];
      }

      // Construir la URL para obtener la página por su ID
      const pageUrl = `/api/v2/pages/${id}/`;

      // Usar el proxy para evitar problemas de CORS
      const runtimeConfig = useRuntimeConfig();
      const baseProxyUrl = `/api/proxy-wagtail?url=${encodeURIComponent(runtimeConfig.public.apiBase + pageUrl)}`;

      // Añadir parámetros anti-caché a la URL
      const noCacheUrl = addNoCacheParams(baseProxyUrl);
      // console.log(`[useDynamicPages] Obteniendo página con ID ${id} usando URL anti-caché: ${noCacheUrl}`);

      // Obtener la página desde la API usando el proxy con parámetros anti-caché
      const data: PageData = await getDataFromUrl(noCacheUrl);

      if (!data) {
        throw new Error(`No se encontraron datos para la página con ID ${id}`);
      }

      // Guardar en caché usando el slug
      if (data.meta && data.meta.slug) {
        pageCache.value.set(data.meta.slug, data);
      }

      loading.value = false;
      return data;
    } catch (err: any) {
      error.value = err.message;
      loading.value = false;
      return null;
    }
  };

  // Buscar página por slug
  const findPageBySlug = async (slug: string): Promise<PageData | null> => {
    loading.value = true;
    error.value = null;

    try {
      // Normalizar el slug
      const normalizedSlug = slug.startsWith('/') ? slug.substring(1) : slug;

      // Verificar si ya tenemos la página en caché
      if (pageCache.value.has(normalizedSlug)) {
        loading.value = false;
        return pageCache.value.get(normalizedSlug) || null;
      }

      // Intentar cargar el mapa del sitio si no lo tenemos
      if (siteMap.value.length === 0) {
        await loadSiteMap();
      }

      // Buscar en el mapa del sitio
      const page = siteMap.value.find(p => p.slug === normalizedSlug);
      if (page) {
        // Encontramos la página en el mapa del sitio
        const pageData = await getPageByIdLocal(page.id);
        if (pageData) {
          loading.value = false;
          return pageData;
        }
      }

      // Verificar si el slug está en las rutas conocidas
      if (KNOWN_ROUTES[`/${normalizedSlug}`] || KNOWN_ROUTES[slug]) {
        const route = KNOWN_ROUTES[`/${normalizedSlug}`] || KNOWN_ROUTES[slug];
        const pageData = await getPageByIdLocal(route.id);
        if (pageData) {
          loading.value = false;
          return pageData;
        }
      }

      // Buscar directamente en la API por slug
      const baseSearchUrl = `/api/v2/pages/?slug=${encodeURIComponent(normalizedSlug)}`;

      // Añadir parámetros anti-caché a la URL
      const noCacheUrl = addNoCacheParams(baseSearchUrl);
      // console.log(`[useDynamicPages] Buscando página con slug ${normalizedSlug} usando URL anti-caché: ${noCacheUrl}`);

      const searchResult = await getDataFromUrl(noCacheUrl);

      if (searchResult && searchResult.items && searchResult.items.length > 0) {
        const pageId = searchResult.items[0].id;
        const pageData = await getPageByIdLocal(pageId);

        if (pageData) {
          loading.value = false;
          return pageData;
        }
      }

      // Si no se encuentra de ninguna forma, lanzar error
      throw new Error(`No se encontró una página con el slug: ${normalizedSlug}`);
    } catch (err: any) {
      error.value = err.message;
      loading.value = false;
      return null;
    }
  };

  // Obtener el ID de la página a partir de una ruta
  const getPageIdFromRoute = async (route: string): Promise<number> => {
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
    return 3; // ID de la página principal por defecto
  };

  // Obtener mapa del sitio (páginas y sus relaciones)
  const getSiteMap = async (): Promise<SiteMapPage[]> => {
    if (siteMap.value.length === 0) {
      await loadSiteMap();
    }
    return siteMap.value;
  };

  return {
    findPageBySlug,
    getPageByIdLocal,
    getPageIdFromRoute,
    getSiteMap,
    loadSiteMap,
    loading,
    error,
    siteMap,
    KNOWN_ROUTES
  };
}
