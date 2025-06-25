// composables/useWagtail.ts
export const useWagtail = () => {
  const config = useRuntimeConfig()
  const apiBase = config.public.apiBase || ''

  // Definimos el tipo para las respuestas de la API
  interface WagtailPagesResponse {
    meta?: {
      total_count: number;
    };
    items: Array<{
      id: number;
      meta?: {
        type?: string;
        detail_url?: string;
        html_url?: string;
        slug?: string;
        first_published_at?: string;
        locale?: string;
      };
      title: string;
    }>;
    // Propiedades extendidas que pueden estar presentes en las respuestas
    navbar?: any;
    logo?: any;
    footer?: any;
    error?: boolean;
    message?: string; // Mensaje de error opcional
  }

  // Declaramos todas las variables reactivas al principio
  // Mapa de rutas conocidas (integración con tu sistema existente)
  const knownRoutes = reactive<Record<string, any>>({});
  const slugToIdMap = ref<Record<string, any>>({});
  const pageDetailsMap = ref<Record<string, any>>({});
  // Cache para almacenar páginas por idioma
  const pagesCache = reactive<Record<string, any>>({});
  // Cache para almacenar detalles de páginas por ID e idioma
  const pageDetailsCache = reactive<{ [key: string]: any }>({});

  // Función para generar URL completa de la API
  const getApiUrl = (endpoint: string, locale?: string) => {
    // Verificar si la URL está relacionada con imágenes o medios
    if (endpoint.includes('/media/') || endpoint.includes('/images/')) {
      // No modificar URLs de imágenes o medios, retornar tal cual
      return endpoint;
    }

    // Extraer solo la parte de la ruta (sin dominio)
    let path = endpoint;

    // IMPORTANTE: Eliminar cualquier parámetro de consulta
    // Wagtail API es muy estricta y rechaza parámetros no reconocidos
    if (path.includes('?')) {
      path = path.split('?')[0];
    }

    // Si la URL incluye el dominio completo, extraer solo la ruta
    if (endpoint.includes('/api/v2/')) {
      const parts = endpoint.split('/api/v2/');
      path = '/api/v2/' + parts[1].split('?')[0]; // Eliminar parámetros si existen
    } else if (!endpoint.startsWith('/api/')) {
      // Asegurarse que comience con /api/ para el proxy
      path = endpoint.startsWith('/') ? `/api${endpoint.split('?')[0]}` : `/api/${endpoint.split('?')[0]}`;
    }

    // Normalizar el path para evitar dobles barras
    path = path.replace(/\/\//g, '/');

    console.log(`URL API proxy normalizada: ${path}`);

    return path;
  }

  // Detectar el idioma actual basado en localStorage o URL
  const detectCurrentLanguage = () => {
    // 1. Intentar obtener desde localStorage
    try {
      if (typeof localStorage !== 'undefined') {
        const savedLang = localStorage.getItem('currentLanguage');
        if (savedLang) {
          console.log(`Idioma detectado desde localStorage: ${savedLang}`);
          return savedLang;
        }
      }
    } catch (e) {
      console.error('Error accediendo a localStorage:', e);
    }

    // 2. Intentar extraer de la URL actual
    try {
      const path = window.location.pathname;
      const pathSegments = path.split('/').filter(Boolean);
      if (pathSegments.length > 0) {
        const firstSegment = pathSegments[0].toLowerCase();
        // Verificar si parece un código de idioma (2-3 letras)
        if (firstSegment.length >= 2 && firstSegment.length <= 3) {
          console.log(`Idioma detectado desde URL: ${firstSegment}`);
          return firstSegment;
        }
      }
    } catch (e) {
      console.error('Error accediendo a la ruta actual:', e);
    }

    // 3. Valor por defecto
    return 'es';
  };

  // Función para resetear todos los mapas de rutas y páginas
  const resetPages = () => {
    Object.keys(knownRoutes).forEach(key => {
      delete knownRoutes[key];
    });

    // Resetear los mapas de slug a ID y detalles
    slugToIdMap.value = {};
    pageDetailsMap.value = {};

    // Limpiar también la caché de páginas
    Object.keys(pagesCache).forEach(key => {
      delete pagesCache[key];
    });

    // Limpiar caché de detalles de página
    Object.keys(pageDetailsCache).forEach(key => {
      delete pageDetailsCache[key];
    });

    console.log('Mapas de rutas, páginas y caché completamente reseteados');
  };

  // Función para limpiar todas las cachés (alias de resetPages para compatibilidad)
  const clearCaches = () => {
    resetPages();
  };

  // Procesar datos de la API para actualizar los mapas reactivos
  const processApiData = (data: WagtailPagesResponse) => {
    if (!data) return;

    console.log('Procesando datos completos de la API');

    // Procesar navbar y enlaces de navegación
    if (data.navbar && Array.isArray(data.navbar)) {
      console.log(`Procesando ${data.navbar.length} elementos de navegación`);
    }

    // Mapeo de slugs de página de inicio por idioma
    // Mapeo de idiomas a IDs de páginas de inicio
    const homePageIds: { [key: string]: number } = {};

    // Procesar elementos de página y crear mapas para rutas
    if (data.items && Array.isArray(data.items)) {
      data.items.forEach((item: any) => {
        if (!item) return;

        try {
          // Guardar la relación entre ID y URL
          if (item.id) {
            const urlPath = item.meta?.html_url || item.meta?.slug || '';
            const locale = item.meta?.locale || 'es';

            if (urlPath) {
              // Normalizar path para comparaciones consistentes
              const normalizedPath = urlPath.replace('http://127.0.0.1:8000', '');
              const cleanPath = normalizedPath.startsWith('/') ? normalizedPath : `/${normalizedPath}`;

              knownRoutes[cleanPath] = item.id;
              console.log(`Mapeado: Ruta ${cleanPath} -> ID ${item.id}`);

              // También procesamos slugs
              if (item.meta?.slug) {
                const slug = item.meta.slug.toLowerCase();
                slugToIdMap.value[slug] = item.id;
                // También guardamos variantes con - y _
                slugToIdMap.value[slug.replace(/-/g, '_')] = item.id;
                slugToIdMap.value[slug.replace(/_/g, '-')] = item.id;

                // Detectar si es una página de inicio basado en la estructura de URL
                const htmlUrl = item.meta?.html_url || '';
                const isHomePage = htmlUrl.endsWith('/') || htmlUrl.endsWith(`/${locale}`) || htmlUrl.endsWith(`/${locale}/`);

                if (isHomePage) {
                  console.log(`Detectada posible página de inicio para idioma ${locale}: ${slug} (ID: ${item.id})`);
                  homePageIds[locale] = item.id;

                  // Mapear variantes de la ruta raíz para este idioma
                  slugToIdMap.value[`${locale}/`] = item.id;
                  slugToIdMap.value[locale] = item.id;

                  // Para el idioma por defecto (español)
                  if (locale === 'es') {
                    slugToIdMap.value[''] = item.id;
                    slugToIdMap.value['/'] = item.id;
                  }

                  // Mapear slug actual y variantes para cualquier idioma
                  slugToIdMap.value[slug] = item.id;
                  slugToIdMap.value[`${locale}/${slug}`] = item.id;
                  slugToIdMap.value[`${locale}/${slug}/`] = item.id;

                  console.log(`Mapeados slugs para página de inicio ${locale}:`,
                    [`${locale}/`, locale, slug, `${locale}/${slug}`, `${locale}/${slug}/`]);
                }
              }
            }
          }

          // Guardar detalles para llamadas futuras
          if (item.id && item.meta?.detail_url) {
            pageDetailsMap.value[item.id] = getApiUrl(item.meta.detail_url.replace(/^\//, ''))
          }
        } catch (e) {
          console.error('Error procesando item:', e);
        }
      });

      console.log(`Mapa de rutas actualizado con ${Object.keys(knownRoutes).length} entradas`);
      console.log(`Mapa de slugs actualizado con ${Object.keys(slugToIdMap.value).length} entradas`);
    }
  }

  /**
   * Obtener todas las páginas del sitio para un idioma específico
   * @param locale Idioma de las páginas a obtener
   * @param fromHomePageSearch Indica si la llamada proviene de findHomePageId para evitar recursividad
   * @returns Promise con la respuesta de la API o null si hay error
   */
  const fetchAllPages = async (locale: string = 'es', fromHomePageSearch: boolean = false): Promise<WagtailPagesResponse | null> => {
    console.log(`Obteniendo todas las páginas para locale: ${locale} (desde búsqueda de home: ${fromHomePageSearch})`);

    try {
      // Verificar caché
      const cacheKey = `pages-${locale}`;

      if (pagesCache[cacheKey]) {
        console.log(`Usando datos en caché para todas las páginas (${locale})`);
        return pagesCache[cacheKey] as WagtailPagesResponse;
      }

      // Solo intentamos encontrar la página de inicio si no venimos de findHomePageId
      // para evitar recursividad infinita
      let homeId: number | null = null;

      if (!fromHomePageSearch) {
        homeId = await findHomePageId(locale);
      } else {
        // Usar un ID fijo para la página principal si estamos en una búsqueda de home
        // El ID 3 es comúnmente usado para página de inicio en Wagtail
        homeId = 3;
        console.log(`Usando ID fijo (${homeId}) para evitar recursividad infinita`);
      }

      if (!homeId) {
        // Si no podemos determinar el ID, intentar directamente con el endpoint básico
        console.log('Intentando obtener páginas directamente desde el endpoint base...');
        return await fetchPagesDirectly(locale);
      }

      // URL limpia sin parámetros
      const apiEndpoint = `/api/v2/pages/${homeId}/`;
      console.log(`Obteniendo página base con ID ${homeId}`);

      const apiUrl = getApiUrl(apiEndpoint);

      // Usar useFetch como lo recomienda el encargado del proyecto
      const { data, error } = await useFetch(apiUrl, {
        key: `page-${homeId}-${locale}-${Date.now()}`,
        retry: 2,
        retryDelay: 1000,
        timeout: 15000,
        headers: {
          'Accept-Language': locale
        },
        onRequest({ request, options }) {
          console.log(`Haciendo solicitud a: ${apiUrl} (locale: ${locale})`);
        },
        onRequestError({ request, options, error }) {
          console.error(`Error en solicitud al obtener página raíz: ${error.message}`);
        }
      });

      if (error.value) {
        console.error('Error al obtener página raíz:', error.value);
        return null;
      }

      if (!data.value) {
        console.error('No se recibieron datos para la página raíz');
        return null;
      }

      const homePage = JSON.parse(JSON.stringify(data.value));

      // Construir un objeto de respuesta similar a lo que devolvería /api/v2/pages/
      const response: WagtailPagesResponse = {
        items: [homePage],
        meta: {
          total_count: 1
        }
      };

      // Intentar obtener páginas hijas de la página principal si existe un campo children
      try {
        if (homePage.meta?.children?.listing_url) {
          const childrenUrl = getApiUrl(homePage.meta.children.listing_url);
          const { data: childrenData, error: childrenError } = await useFetch(childrenUrl, {
            key: `children-${homeId}-${locale}-${Date.now()}`,
            headers: {
              'Accept-Language': locale
            }
          });

          if (!childrenError.value && childrenData.value) {
            const children = JSON.parse(JSON.stringify(childrenData.value));
            if (children.items && Array.isArray(children.items)) {
              response.items = [...response.items, ...children.items];
              if (response.meta) {
                response.meta.total_count = response.items.length;
              }
            }
          }
        }
      } catch (e) {
        console.error('Error al obtener páginas hijas:', e);
      }

      console.log(`Éxito! Procesadas ${response.items.length} páginas`);

      // Guardar en la caché
      pagesCache[cacheKey] = response;

      // Actualizar el mapa de slugs a IDs
      response.items.forEach(page => {
        if (page.id && page.meta && page.meta.slug) {
          slugToIdMap.value[page.meta.slug] = page.id;
        }
      });

      return response;
    } catch (error: any) {
      console.error('Error crítico en fetchAllPages:', error);

      // Devolver objeto con estructura correcta en caso de error para asegurar
      // que la aplicación siempre muestre datos de respaldo cuando la API no esté disponible
      return {
        meta: { total_count: 0 },
        items: [],
        error: true,
        message: error?.message || 'Error desconocido al obtener páginas'
      } as WagtailPagesResponse;
    }
  }
  // Obtener detalles de una página por su ID
  const fetchPageDetails = async (pageId: number, locale: string = 'es') => {
    try {
      if (!pageId) {
        console.error('fetchPageDetails: Se requiere un ID de página válido');
        return null;
      }

      console.log(`Fetching page details for ID ${pageId} with locale: ${locale}`);

      // Clave única para la caché basada en ID e idioma
      const cacheKey = `page-${pageId}-${locale}`;

      // Si tenemos datos en caché para este ID e idioma, usar la caché
      if (pageDetailsCache[cacheKey]) {
        console.log(`Usando datos en caché para página ${pageId} (${locale})`);
        return pageDetailsCache[cacheKey];
      }

      // Añadir parámetro anti-cache para evitar respuestas cacheadas
      const timestamp = Date.now();
      const antiCacheParam = `_nocache=${timestamp}_${Math.random()}`;

      // Usar el endpoint proxy para obtener página por ID sin param locale en URL
      const baseUrl = getApiUrl(`/api/v2/pages/${pageId}/`);
      const separator = baseUrl.includes('?') ? '&' : '?';
      const apiUrl = `${baseUrl}${separator}${antiCacheParam}`;

      console.log(`Using proxy URL for ID ${pageId} (with anti-cache): ${apiUrl}`);

      const { data, error } = await useFetch(apiUrl, {
        key: `page-details-${pageId}-${locale}-${timestamp}`,
        retry: 2,
        retryDelay: 1000,
        timeout: 15000,
        watch: false,
        cache: 'no-store',
        headers: {
          'Accept-Language': locale
        }
      });

      // Verificar si hubo un error en la solicitud
      if (error.value) {
        console.error(`Error al obtener página ${pageId}:`, error.value);
        return null;
      }

      // Verificar que la respuesta contenga datos
      if (!data.value) {
        console.error(`No se recibieron datos para la página ${pageId}`);
        return null;
      }

      // Convertir de Proxy a objeto plano
      const response = JSON.parse(JSON.stringify(data.value));
      console.log(`Éxito! Recibida página ${pageId}`);

      // Guardar en la caché por ID e idioma
      pageDetailsCache[cacheKey] = response;

      return response;
    } catch (error: any) {
      console.error(`Error crítico en fetchPageDetails (ID: ${pageId}):`, error);
      return null;
    }
  }

  // Obtener una página por su slug
  const fetchPageBySlug = async (slug: string, locale: string = 'es') => {
    try {
      if (!slug) {
        console.error('fetchPageBySlug: Se requiere un slug válido');
        return null;
      }

      // Normalizar slug para que no comience con / y eliminar el prefijo de idioma si existe
      let normalizedSlug = slug.startsWith('/') ? slug.substring(1) : slug;

      // Eliminar el prefijo del idioma en el slug si existe
      // Por ejemplo: es/plataforma/trazabilidad/ -> plataforma/trazabilidad/
      const slugParts = normalizedSlug.split('/');
      if (slugParts[0] === locale) {
        slugParts.shift(); // Eliminar el primer elemento (código de idioma)
        normalizedSlug = slugParts.join('/');
      }

      // Eliminar barra final si existe
      if (normalizedSlug.endsWith('/')) {
        normalizedSlug = normalizedSlug.slice(0, -1);
      }

      console.log(`Buscando página con slug normalizado: ${normalizedSlug} (locale: ${locale})`);

      // Crear clave para caché
      const cacheKey = `slug-${normalizedSlug}-${locale}`;

      // Verificar si el slug ya está en la caché
      if (pageDetailsCache[cacheKey]) {
        console.log(`Usando datos en caché para slug ${normalizedSlug} (${locale})`);
        return pageDetailsCache[cacheKey];
      }

      // Nueva estrategia: primero obtener todas las páginas de la API
      console.log('Obteniendo todas las páginas para buscar por slug...');

      try {
        // Añadir parámetro anti-cache
        const timestamp = Date.now();
        const antiCacheParam = `_nocache=${timestamp}`;
        const apiEndpoint = `/api/v2/pages/?locale=${locale}`;

        console.log(`Endpoint para obtener todas las páginas: ${apiEndpoint}`);
        const apiUrl = getApiUrl(`${apiEndpoint}&${antiCacheParam}`);

        const { data, error } = await useFetch(apiUrl, {
          key: `all-pages-${locale}-${timestamp}`,
          retry: 2,
          retryDelay: 1000,
          timeout: 15000,
          watch: false,
          cache: 'no-store',
          headers: {
            'Accept-Language': locale
          }
        });

        if (error.value) {
          console.error('Error al obtener todas las páginas:', error.value);
          return null;
        }

        // Verificar si data.value es un objeto válido con propiedad items
        const pagesResponse = data.value as Record<string, any> | null;

        if (!pagesResponse || !pagesResponse.items || !Array.isArray(pagesResponse.items)) {
          console.error('Respuesta de API inválida para todas las páginas');
          return null;
        }

        console.log(`Se encontraron ${pagesResponse.items.length} páginas en total`);

        // Buscar la página por slug
        const foundPage = pagesResponse.items.find(page => {
          const pageSlug = page.meta?.slug || '';
          return pageSlug === normalizedSlug ||
            pageSlug === normalizedSlug.replace(/-/g, '_') ||
            pageSlug === normalizedSlug.replace(/_/g, '-');
        });

        if (foundPage && foundPage.id) {
          console.log(`Éxito! Se encontró página con ID ${foundPage.id} para slug ${normalizedSlug}`);
          console.log('Datos de la página encontrada:', foundPage);

          // Guardar el ID encontrado en el mapa de slugs para futuras búsquedas
          slugToIdMap.value[normalizedSlug] = foundPage.id;

          // Obtener detalles completos con el ID encontrado
          const pageDetails = await fetchPageDetails(foundPage.id, locale);
          if (pageDetails) {
            console.log('Detalles completos de la página cargados correctamente');
            // Guardar en la caché por slug e idioma
            pageDetailsCache[cacheKey] = pageDetails;
            return pageDetails;
          }
        } else {
          console.log(`No se encontró página con slug ${normalizedSlug} en las ${pagesResponse.items.length} páginas disponibles`);

          // Intentar buscar de otra manera (pueden ser slugs anidados)
          for (const page of pagesResponse.items) {
            const pageUrl = page.meta?.html_url || '';
            if (pageUrl.includes(`/${locale}/${normalizedSlug}`) ||
              pageUrl.includes(`/${locale}/${normalizedSlug.replace(/-/g, '_')}`) ||
              pageUrl.includes(`/${locale}/${normalizedSlug.replace(/_/g, '-')}`)) {

              console.log(`Se encontró página con URL que contiene el slug: ${pageUrl}`);
              const pageId = page.id;

              // Guardar el ID encontrado en el mapa de slugs
              slugToIdMap.value[normalizedSlug] = pageId;

              // Obtener detalles completos
              const pageDetails = await fetchPageDetails(pageId, locale);
              if (pageDetails) {
                // Guardar en la caché por slug e idioma
                pageDetailsCache[cacheKey] = pageDetails;
                return pageDetails;
              }
            }
          }
        }
      } catch (e) {
        console.error(`Error al obtener todas las páginas:`, e);
      }

      // Paso 2: Si no se encontró directamente, obtener todas las páginas y buscar localmente
      console.log(`Intento 2: Obtener todas las páginas y buscar localmente...`);

      // Forzar recarga solo si no se han cargado páginas antes
      const forceReload = !pagesCache[`allPages-${locale}`];
      const allPagesResponse = await fetchAllPages(locale, forceReload);

      if (allPagesResponse && allPagesResponse.items) {
        // Buscar en los elementos de la respuesta
        const foundPage = allPagesResponse.items.find(page => {
          // Comparar con el slug normalizado
          const pageSlug = page.meta?.slug || '';
          return pageSlug === normalizedSlug ||
            pageSlug === normalizedSlug.replace(/-/g, '_') ||
            pageSlug === normalizedSlug.replace(/_/g, '-');
        });

        if (foundPage && foundPage.id) {
          console.log(`Éxito! Se encontró página con ID ${foundPage.id} para slug ${normalizedSlug}`);

          // Guardar el ID encontrado en el mapa de slugs
          slugToIdMap.value[normalizedSlug] = foundPage.id;

          // Obtener detalles completos
          const pageDetails = await fetchPageDetails(foundPage.id, locale);
          if (pageDetails) {
            // Guardar en la caché por slug e idioma
            pageDetailsCache[cacheKey] = pageDetails;
            return pageDetails;
          }
        }
      }

      // Paso 3: Como último recurso, buscar en el mapa de slugs a IDs que ya fue construido
      console.log(`Intento 3: Buscar en mapa de slugs-a-IDs ya conocido...`);
      const pageId =
        slugToIdMap.value[normalizedSlug] ||
        slugToIdMap.value[normalizedSlug.replace(/-/g, '_')] ||
        slugToIdMap.value[normalizedSlug.replace(/_/g, '-')] ||
        slugToIdMap.value[`${locale}/${normalizedSlug}`];

      if (pageId) {
        console.log(`Encontrado ID ${pageId} en el mapa de slugs para ${normalizedSlug}`);

        // Obtener detalles de la página con el ID encontrado
        const pageDetails = await fetchPageDetails(pageId, locale);
        if (pageDetails) {
          // Guardar en la caché por slug e idioma
          pageDetailsCache[cacheKey] = pageDetails;
          return pageDetails;
        }
      }

      // Si llegamos aquí, no se encontró la página
      console.error(`No se encontró página para slug ${normalizedSlug} (${locale}) después de agotar todas las opciones`);
      return null;
    } catch (error: any) {
      console.error(`Error crítico en fetchPageBySlug (slug: ${slug}):`, error);
      return null;
    }
  }
  // Encontrar el ID de la página por la ruta
  const findPageIdForRoute = (route: string, locale: string = 'es'): number | null => {
    try {
      // Sanear la ruta y quitar prefijos de idioma si existen
      let normalizedRoute = route || '';
      normalizedRoute = normalizedRoute.startsWith('/') ? normalizedRoute : `/${normalizedRoute}`;

      // Quitar prefijos de idioma (es, en, etc.)
      const langPrefixRegex = new RegExp(`^\/(${locale}|es|en)\/?`);
      const routeWithoutLangPrefix = normalizedRoute.replace(langPrefixRegex, '/');

      // Crear todas las variantes posibles de la ruta para una búsqueda exhaustiva
      const routeVariants = [
        normalizedRoute,
        routeWithoutLangPrefix,
        // Con y sin slash final para ambos casos
        normalizedRoute.endsWith('/') ? normalizedRoute : `${normalizedRoute}/`,
        normalizedRoute.endsWith('/') ? normalizedRoute.slice(0, -1) : normalizedRoute,
        routeWithoutLangPrefix.endsWith('/') ? routeWithoutLangPrefix : `${routeWithoutLangPrefix}/`,
        routeWithoutLangPrefix.endsWith('/') ? routeWithoutLangPrefix.slice(0, -1) : routeWithoutLangPrefix,
        // Si hay un prefijo de idioma, probar también con el idioma actual
        `/${locale}${routeWithoutLangPrefix}`,
        `/${locale}${routeWithoutLangPrefix.endsWith('/') ? routeWithoutLangPrefix : `${routeWithoutLangPrefix}/`}`
      ];

      // Probar con todas las variantes de ruta en el mapa de rutas conocidas
      for (const variant of routeVariants) {
        if (knownRoutes[variant]) {
          return knownRoutes[variant];
        }
      }

      // Intentar extraer slugs de la ruta (tanto el último como todas las partes de la ruta)
      for (const routeVar of routeVariants) {
        const parts = routeVar.split('/').filter(Boolean);
        if (parts.length > 0) {
          // Probar con el último slug (página directa)
          const lastPart = parts[parts.length - 1];
          if (slugToIdMap.value[lastPart]) {
            console.log(`Slug encontrado para la última parte de la ruta: ${lastPart} -> ID ${slugToIdMap.value[lastPart]}`);
            return slugToIdMap.value[lastPart];
          }

          // Probar con variantes ortográficas (guiones/guiones bajos)
          if (slugToIdMap.value[lastPart.replace(/-/g, '_')]) {
            return slugToIdMap.value[lastPart.replace(/-/g, '_')];
          }

          if (slugToIdMap.value[lastPart.replace(/_/g, '-')]) {
            return slugToIdMap.value[lastPart.replace(/_/g, '-')];
          }

          // Intentar con rutas anidadas concatenando partes del path
          // Ejemplo: para /es/servicios/consultoria, intentar con "servicios/consultoria"
          if (parts.length > 1) {
            // Probar con combinaciones de ruta anidada
            for (let i = 0; i < parts.length - 1; i++) {
              const nestedSlug = parts.slice(i).join('/');
              if (slugToIdMap.value[nestedSlug]) {
                console.log(`Slug anidado encontrado: ${nestedSlug} -> ID ${slugToIdMap.value[nestedSlug]}`);
                return slugToIdMap.value[nestedSlug];
              }
            }
          }
        }
      }

      // No encontrado
      console.warn(`No se encontró ID para la ruta: ${normalizedRoute}`);
      return null;
    } catch (e) {
      console.error('Error en findPageIdForRoute:', e);
      return null;
    }
  }

  /**
   * Intenta obtener páginas directamente desde el endpoint base sin usar página principal
   * Esta es una aproximación alternativa cuando no podemos encontrar el ID de la página principal
   * @param locale Idioma de las páginas a obtener
   * @returns Promise con la respuesta o un objeto vacío con la estructura correcta
   */
  const fetchPagesDirectly = async (locale: string): Promise<WagtailPagesResponse> => {
    try {
      console.log('Implementando método alternativo para obtener páginas...');

      // Intentar obtener una lista de páginas usando un endpoint específico que no use parámetros
      // Algunos endpoints en Wagtail que podrían funcionar: /api/v2/pages/?type=home.HomePage
      // O ensayar con IDs fijos comunes: 2, 3, etc.

      const fixedIds = [3, 2, 1, 4, 5]; // IDs comunes para páginas principales en Wagtail
      let collectedPages: any[] = [];

      // Intentar obtener cada página con ID fijo
      for (const id of fixedIds) {
        try {
          console.log(`Intentando obtener página con ID fijo: ${id}`);
          const apiUrl = getApiUrl(`/api/v2/pages/${id}/`);

          const { data, error } = await useFetch(apiUrl, {
            key: `page-direct-${id}-${locale}-${Date.now()}`,
            headers: {
              'Accept-Language': locale
            },
            timeout: 5000 // timeout reducido para no esperar demasiado si falla
          });

          if (!error.value && data.value) {
            const page = JSON.parse(JSON.stringify(data.value));
            collectedPages.push(page);
            console.log(`Éxito! Obtenida página con ID ${id}`);

            // Intentar obtener las páginas hijas si existen
            if (page.meta?.children?.listing_url) {
              const childrenUrl = getApiUrl(page.meta.children.listing_url);
              const { data: childrenData, error: childrenError } = await useFetch(childrenUrl, {
                key: `children-direct-${id}-${locale}-${Date.now()}`,
                headers: {
                  'Accept-Language': locale
                }
              });

              if (!childrenError.value && childrenData.value) {
                const children = JSON.parse(JSON.stringify(childrenData.value));
                if (children.items && Array.isArray(children.items)) {
                  collectedPages = [...collectedPages, ...children.items];
                  console.log(`Agregadas ${children.items.length} páginas hijas desde ID ${id}`);
                }
              }
            }
          }
        } catch (e) {
          console.warn(`Error al obtener página con ID ${id}:`, e);
          // Continuar con el siguiente ID
        }
      }

      // Construir respuesta con las páginas encontradas
      const response: WagtailPagesResponse = {
        items: collectedPages,
        meta: {
          total_count: collectedPages.length
        }
      };

      // Guardar en caché
      if (collectedPages.length > 0) {
        const cacheKey = `pages-${locale}`;
        pagesCache[cacheKey] = response;
        console.log(`Guardadas ${collectedPages.length} páginas en caché`);

        // Actualizar mapa de slugs a IDs
        collectedPages.forEach(page => {
          if (page.id && page.meta && page.meta.slug) {
            slugToIdMap.value[page.meta.slug] = page.id;
          }
        });
      }

      return response;
    } catch (e) {
      console.error('Error en fetchPagesDirectly:', e);
      // Devolver un objeto con la estructura correcta pero vacío
      return {
        items: [],
        meta: { total_count: 0 },
        error: true,
        message: 'Error al obtener páginas directamente'
      } as WagtailPagesResponse;
    }
  };

  // Encontrar el ID de la página de inicio para un idioma
  const findHomePageId = async (locale: string = 'es'): Promise<number | null> => {
    try {
      // Rutas comunes para páginas de inicio por idioma
      const potentialHomePaths = [
        '',
        '/',
        `/${locale}`,
        `/${locale}/`
      ];

      // Buscar en rutas conocidas primero
      for (const path of potentialHomePaths) {
        const id = knownRoutes[path];
        if (id) {
          console.log(`Encontrado ID ${id} para página de inicio (${path})`);
          return id;
        }
      }

      // Intentar en el mapa de slugs
      if (slugToIdMap.value[''] || slugToIdMap.value['/'] || slugToIdMap.value[locale]) {
        const id = slugToIdMap.value[''] || slugToIdMap.value['/'] || slugToIdMap.value[locale];
        console.log(`Encontrado ID ${id} para página de inicio (slug: ${locale})`);
        return id;
      }

      // IMPORTANTE: Para evitar recursividad infinita, no hacemos una nueva llamada a fetchAllPages
      // En su lugar, usamos un enfoque alternativo con IDs fijos comunes

      // IDs más comunes para páginas principales en Wagtail:
      const commonHomePageIds = [3, 2, 1, 4, 5];

      for (const id of commonHomePageIds) {
        try {
          console.log(`Intentando verificar si ID ${id} es página principal...`);
          const apiUrl = getApiUrl(`/api/v2/pages/${id}/`);

          const { data, error } = await useFetch(apiUrl, {
            key: `home-check-${id}-${locale}-${Date.now()}`,
            headers: {
              'Accept-Language': locale
            },
            timeout: 5000 // timeout reducido para no esperar demasiado
          });

          if (!error.value && data.value) {
            const page = JSON.parse(JSON.stringify(data.value));
            const type = page.meta?.type || '';
            const slug = page.meta?.slug || '';

            // Verificar si es página home
            if (type.includes('home') || slug === 'home' || slug === '' || slug === locale) {
              console.log(`Encontrada página de inicio con ID ${id} (tipo: ${type}, slug: ${slug})`);
              return id;
            }
          }
        } catch (e) {
          console.warn(`Error al verificar página ${id}:`, e);
        }
      }

      // Como último recurso, usar el ID 3 que es comúnmente la página principal
      console.log('No se encontró página principal, usando ID fijo 3 como fallback');
      return 3;
    } catch (e) {
      console.error('Error en findHomePageId:', e);
      return null;
    }
  }

  // Generar rutas y mapeo de slugs a IDs
  const generateRoutes = async (specificLocale: string | null = null) => {
    try {
      const locale = specificLocale || detectCurrentLanguage();
      console.log(`Generando rutas para idioma: ${locale}`);

      // Cargar las páginas
      const pagesResponse = await fetchAllPages(locale);

      // Si hay error o no hay items, devolver mapa vacío
      if (!pagesResponse || !pagesResponse.items || pagesResponse.error) {
        console.error('Error obteniendo páginas para generar rutas');
        return {
          routes: {},
          slugToIdMap: {}
        };
      }

      // El procesamiento ya se hace en fetchAllPages, que llama a processApiData
      // Simplemente devolvemos los mapas ya procesados
      console.log(`Rutas generadas correctamente: ${Object.keys(knownRoutes).length} rutas`);

      return {
        routes: knownRoutes,
        slugToIdMap: slugToIdMap.value
      };
    } catch (e) {
      console.error('Error en generateRoutes:', e);
      return {
        routes: {},
        slugToIdMap: {}
      };
    }
  };

  return {
    // Variables reactivas
    knownRoutes,
    slugToIdMap,
    pageDetailsMap,

    // Funciones principales
    fetchAllPages,
    fetchPageBySlug,
    fetchPageDetails,
    findPageIdForRoute,
    findHomePageId,
    generateRoutes,
    resetPages,
    clearCaches,

    // Funciones auxiliares
    getApiUrl,
    detectCurrentLanguage
  }
}
