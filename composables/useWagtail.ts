// composables/useWagtail.ts
export const useWagtail = () => {
  const config = useRuntimeConfig()
  const apiBase = config.public.apiBase || ''
  
  // Función para generar URL del proxy
  const getProxyUrl = (endpoint: string) => {
    return `/api/proxy-wagtail?url=${encodeURIComponent(endpoint)}`
  }
  
  // Mapa de rutas conocidas (integración con tu sistema existente)
  const knownRoutes = reactive({});
  const slugToIdMap = ref({});
  const pageDetailsMap = ref({});

  // Función para resetear todos los mapas de rutas y páginas
  const resetPages = () => {
    console.log('Reseteando mapas de rutas y páginas...');
    // Limpiar los mapas de rutas
    Object.keys(knownRoutes).forEach(key => {
      delete knownRoutes[key];
    });
    
    // Resetear los mapas de slug a ID y detalles
    slugToIdMap.value = {};
    pageDetailsMap.value = {};
    
    console.log('Mapas de rutas y páginas reseteados');
  };

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

  // Obtener todas las páginas y navbar
  const fetchAllPages = async (forceReload = false) => {
    console.log(`Fetching all pages... (forceReload: ${forceReload})`);
    try {
      // Detectar el idioma actual
      const currentLang = detectCurrentLanguage();
      
      // Construir la URL con el parámetro de idioma
      const apiEndpoint = `/api/v2/pages/?locale=${currentLang}`;
      console.log(`Usando endpoint con idioma: ${apiEndpoint}`);
      
      // Usar el proxy local para evitar problemas de CORS
      const proxyUrl = getProxyUrl(apiEndpoint);
      console.log(`URL final del proxy: ${proxyUrl}`);
      
      // Si se fuerza la recarga, anular la caché
      const { data, error, status } = await useFetch<any>(proxyUrl, {
        key: forceReload ? `allPages-${Date.now()}` : 'allPages',
        retry: 2,
        retryDelay: 500,
        timeout: 20000,
        watch: false, // No reactive refresh
        // Si se fuerza la recarga, invalidar la caché
        cache: forceReload ? false : undefined,
        // Opciones específicas de fetch para manejo de errores
        onRequest({ request, options }) {
          console.log('Iniciando solicitud a la API de Wagtail...');
        },
        onRequestError({ request, options, error }) {
          console.error(`Error en solicitud a la API: ${error.message}`)
        },
        onResponse({ request, response, options }) {
          console.log(`Respuesta recibida del API: ${response.status}`)
        },
        onResponseError({ request, response, options }) {
          console.error(`Error en respuesta de la API: ${response.status} ${response.statusText}`)
        }
      });

      if (error.value) {
        console.error('Error fetching pages:', error.value);
        throw new Error(`Error al obtener páginas: ${error.value?.message || JSON.stringify(error.value)}`);
      }

      if (!data.value) {
        console.error('No data returned from API');
        throw new Error('No se recibieron datos de la API');
      }

      // Convertir el Proxy a un objeto JSON plano para evitar problemas de reactividad
      const rawData = JSON.parse(JSON.stringify(data.value));
      console.log('Datos recibidos normalizados:', typeof rawData);
      
      // Verificar que los datos contienen la estructura esperada
      if (rawData && rawData.items && Array.isArray(rawData.items)) {
        console.log(`Received ${rawData.items.length} pages`);
        // Procesamos los datos y actualizamos los mapas reactivos
        processApiData(rawData);
      } else {
        console.error('No se encontraron items en la respuesta o formato incorrecto:', rawData);
      }

      // Siempre devolver los datos normalizados
      return rawData;
    } catch (error: any) {
      console.error('Error crítico en fetchAllPages:', error);
      // En caso de error, devolver un objeto vacío pero con la estructura correcta
      return {
        items: [],
        meta: { total_count: 0 },
        error: true,
        message: error?.message || 'Error desconocido al obtener páginas'
      };
    }
  }

  // Obtener detalles de una página por ID
  const fetchPageDetails = async (pageId: number) => {
    try {
      console.log(`Fetching page details for ID: ${pageId}`);
      
      // Usar el proxy local para obtener página por ID
      const proxyUrl = getProxyUrl(`/api/v2/pages/${pageId}/`);
      console.log(`Using proxy URL: ${proxyUrl}`);

      const { data, error } = await useFetch(proxyUrl, {
        key: `page-${pageId}`,
        // No necesitamos headers adicionales al usar el proxy
      });

      if (error.value) {
        console.error(`Error fetching page ${pageId}:`, error.value);
        throw new Error(`Error al obtener página ${pageId}: ${error.value}`);
      }

      if (!data.value) {
        console.error(`No data returned for page ${pageId}`);
        throw new Error(`No se recibieron datos para la página ${pageId}`);
      }

      console.log(`Successfully fetched page ${pageId}`);
      return data.value;
    } catch (error: any) {
      console.error(`Error fetching page ${pageId}:`, error);
      throw new Error(`Error al obtener página ${pageId}: ${error}`);
    }
  }

  // Obtener página por slug
  // Procesar datos de la API y actualizar los mapas reactivos
  const processApiData = (apiData: any) => {
    if (!apiData) return;
    
    console.log('Procesando datos completos de la API');
    
    // Procesar navbar y enlaces de navegación
    if (apiData.navbar && Array.isArray(apiData.navbar)) {
      console.log(`Procesando ${apiData.navbar.length} elementos de navegación`);
    }
    
    // Procesar elementos de página y crear mapas para rutas
    if (apiData.items && Array.isArray(apiData.items)) {
      apiData.items.forEach((item: any) => {
        if (!item) return;
        
        try {
          // Guardar la relación entre ID y URL
          if (item.id) {
            const urlPath = item.meta?.html_url || item.meta?.slug || '';
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
              }
            }
          }
          
          // Guardar detalles para llamadas futuras
          if (item.id && item.meta?.detail_url) {
            pageDetailsMap.value[item.id] = item;
          }
        } catch (e) {
          console.error('Error procesando item:', e);
        }
      });
      
      console.log(`Mapa de rutas actualizado con ${Object.keys(knownRoutes).length} entradas`);
      console.log(`Mapa de slugs actualizado con ${Object.keys(slugToIdMap.value).length} entradas`);
    }
  };
  
  const fetchPageBySlug = async (slug: string, locale: string = 'es') => {
    try {
      console.log(`Buscando página por slug: ${slug}, locale: ${locale}`)
      
      const normalizedSlug = slug.trim().toLowerCase();
      
      // Primero, intentamos usar el mapa de slugs si está disponible
      if (Object.keys(slugToIdMap.value).length > 0) {
        const variants = [
          normalizedSlug,
          normalizedSlug.replace(/-/g, '_'),
          normalizedSlug.replace(/_/g, '-')
        ];
        
        for (const variant of variants) {
          if (slugToIdMap.value[variant]) {
            console.log(`Encontrado ID en mapa de slugs: ${variant} -> ${slugToIdMap.value[variant]}`)
            return await fetchPageDetails(slugToIdMap.value[variant])
          }
        }
      }
      
      // Si no encontramos por slug, buscar en todas las páginas
      console.log('Slug no encontrado en mapa local. Cargando todas las páginas...')
      const pagesData = await fetchAllPages()
      
      // Actualizar mapas con los datos obtenidos
      if (pagesData.items && Array.isArray(pagesData.items)) {
        pagesData.items.forEach((item: any) => {
          if (item.meta) {
            // Guardar detalles de la URL (usando proxy)
            if (item.meta.detail_url) {
              pageDetailsMap.value[item.id] = getProxyUrl(item.meta.detail_url.replace(/^\//, ''))
            }
            
            // Mapear slug a ID con variantes
            if (item.meta.slug) {
              const itemSlug = item.meta.slug.trim().toLowerCase();
              slugToIdMap.value[itemSlug] = item.id
              slugToIdMap.value[itemSlug.replace(/-/g, '_')] = item.id
              slugToIdMap.value[itemSlug.replace(/_/g, '-')] = item.id
            }
          }
        });
      
        // Buscar el slug en las páginas actualizadas
        const matchingPage = pagesData.items.find((item: any) => {
          const itemSlug = item.meta?.slug?.trim().toLowerCase() || '';
          const matchesSlug = [
            itemSlug === normalizedSlug,
            itemSlug.replace(/-/g, '_') === normalizedSlug,
            itemSlug.replace(/_/g, '-') === normalizedSlug
          ].some(Boolean);
          
          return matchesSlug && (!locale || item.meta.locale === locale || !item.meta.locale);
        });
        
        if (matchingPage) {
          console.log(`Página encontrada para slug ${normalizedSlug}: ID ${matchingPage.id}`);
          
          // Guardar en el mapa para futuras consultas
          slugToIdMap.value[normalizedSlug] = matchingPage.id;
          
          // Guardar también la URL de detalle si está disponible (usando proxy)
          if (matchingPage.meta?.detail_url) {
            pageDetailsMap.value[matchingPage.id] = getProxyUrl(matchingPage.meta.detail_url.replace(/^\//, ''));
          }
          
          return await fetchPageDetails(matchingPage.id);
        }
      }
      
      throw new Error(`No se encontró página con slug: ${slug} y locale: ${locale}`);
    } catch (error: any) {
      console.error(`Error fetching page by slug ${slug}:`, error);
      throw new Error(`Error al buscar página por slug ${slug}: ${error}`);
    }
  }

  /**
   * Encuentra el ID de página correspondiente a una ruta específica
   * @param route Ruta a buscar (debe estar normalizada)
   * @returns ID de la página si se encuentra, o null
   */
  const findPageIdForRoute = (route: string): number | null => {
    console.log(`Buscando ID para ruta: ${route} en mapa de rutas`);
    
    if (!route) return null;
    
    // Normalizar la ruta para comparaciones consistentes
    let normalizedRoute = route;
    
    // Si la ruta no comienza con /, agregarlo
    if (!normalizedRoute.startsWith('/')) {
      normalizedRoute = `/${normalizedRoute}`;
    }
    
    // Si termina con / y no es la raíz, eliminar la barra final
    if (normalizedRoute !== '/' && normalizedRoute.endsWith('/')) {
      normalizedRoute = normalizedRoute.slice(0, -1);
    }
    
    console.log('Mapa de rutas actual:', knownRoutes);
    
    // Buscar la ruta exacta
    if (knownRoutes[normalizedRoute]) {
      console.log(`Encontrada ruta exacta ${normalizedRoute} -> ID ${knownRoutes[normalizedRoute]}`);
      return knownRoutes[normalizedRoute];
    }
    
    // Si no se encuentra, intentar con la ruta con / al final
    if (!normalizedRoute.endsWith('/')) {
      const routeWithSlash = `${normalizedRoute}/`;
      if (knownRoutes[routeWithSlash]) {
        console.log(`Encontrada ruta con slash ${routeWithSlash} -> ID ${knownRoutes[routeWithSlash]}`);
        return knownRoutes[routeWithSlash];
      }
    }
    
    // Si tampoco se encuentra, intentar con slug
    const segments = normalizedRoute.split('/').filter(Boolean);
    const lastSegment = segments[segments.length - 1];
    
    if (lastSegment && slugToIdMap.value[lastSegment]) {
      console.log(`Encontrado por slug ${lastSegment} -> ID ${slugToIdMap.value[lastSegment]}`);
      return slugToIdMap.value[lastSegment];
    }
    
    console.warn(`No se encontró ID para la ruta: ${route}`);
    return null;
  };
  
  // Detectar la página principal (Home) dinámicamente
  const findHomePageId = (pages: any[]): number | null => {
    if (!pages || !Array.isArray(pages)) return null;
    
    // Buscar por tipo de página HomePage
    const homePage = pages.find(page => 
      (page.meta?.type === 'home.HomePage' || page.meta?.type === 'HomePage')
      || (page.meta?.slug === 'home' || page.meta?.slug === 'inicio')
      || page.meta?.html_url === '/'  // Página con URL raíz
    );
    
    if (homePage) {
      console.log(`Página principal detectada: ID ${homePage.id}, Tipo: ${homePage.meta.type}`);
      return homePage.id;
    }
    
    // Si no encontramos por tipo, buscar la primera página
    if (pages.length > 0) {
      console.log(`Usando primera página como Home: ID ${pages[0].id}`);
      return pages[0].id;
    }
    
    return null;
  };
  
  // Generar rutas dinámicas
  const generateRoutes = async () => {
    try {
      console.log('Generando rutas dinámicas...')
      const pagesData = await fetchAllPages()
      const routes: any[] = []

      if (!pagesData) {
        console.error('No se recibieron datos para generar rutas')
        return []
      }

      // Verificar la estructura de datos recibida
      if (!pagesData.items) {
        console.error('No se encontraron páginas para generar rutas')
        console.log('Estructura recibida:', JSON.stringify(pagesData, null, 2).substring(0, 500));
        return []
      }

      console.log(`Procesando ${pagesData.items.length} páginas para generar rutas`)
      
      // Actualizamos el estado global con la navegación si está presente
      if (pagesData.navbar) {
        console.log('Datos de navegación encontrados:', pagesData.navbar.length, 'elementos');
      }
      
      // Logo y favicon
      if (pagesData.logo) {
        console.log('Logo de la aplicación encontrado:', pagesData.logo);
      }
      
      // Identificar dinámicamente la página principal
      const homePageId = findHomePageId(pagesData.items);
      if (homePageId) {
        console.log(`Identificada página principal con ID: ${homePageId}`);
      } else {
        console.warn('No se ha podido identificar la página principal');
      }
      
      pagesData.items.forEach((item: any) => {
        if (item.meta && item.meta.html_url) {
          // Normalizar la ruta eliminando el dominio
          let path = item.meta.html_url.replace(/^https?:\/\/[^/]+/i, '')
          
          // Si la ruta ya existe en el router, no la agregamos
          // Esto evita duplicados y rutas inválidas
          const route = {
            name: `page-${item.id}`,
            path: path,
            component: '~/pages/[...slug].vue',
            meta: {
              pageId: item.id,
              pageType: item.meta.type,
              locale: item.meta.locale || 'es',
              title: item.title,
              isHome: homePageId === item.id
            }
          }
          
          console.log(`Ruta generada: ${path} -> ID: ${item.id}, Tipo: ${item.meta.type}${homePageId === item.id ? ' (HOME)' : ''}`)
          routes.push(route)
          
          // Guardar en el mapa de rutas
          knownRoutes[path] = item.id
          
          // Si es la página principal, también mapear la ruta raíz
          if (homePageId === item.id) {
            knownRoutes["/"] = item.id;
            knownRoutes[""] = item.id;
            
            // Agregar también una ruta específica para la raíz
            routes.push({
              ...route,
              path: "/",
              name: `page-${item.id}-root`
            });
            
            console.log(`Ruta raíz mapeada al ID: ${item.id}`);
          }
          
          // Variantes de la ruta
          const pathVariants = [
            path.replace(/-/g, '_'),
            path.replace(/_/g, '-'),
            path.endsWith('/') ? path.slice(0, -1) : `${path}/`
          ]
          
          pathVariants.forEach(variant => {
            knownRoutes[variant] = item.id
          })
          
          // Guardar detail_url (usando proxy)
          if (item.meta.detail_url) {
            pageDetailsMap.value[item.id] = getProxyUrl(item.meta.detail_url.replace(/^\//, ''))
          }
        }
      })

      console.log(`Se generaron ${routes.length} rutas dinámicas`)
      return routes
    } catch (error) {
      console.error('Error generating routes:', error)
      return []
    }
  }
  
  // Normalizar ruta para buscar en mapas
  const normalizeRoutePath = (path: string) => {
    // Eliminar protocolo y dominio si existe
    let normalizedPath = path.replace(/^https?:\/\/[^/]+/i, '')
    
    // Asegurar que comienza con /
    if (!normalizedPath.startsWith('/')) {
      normalizedPath = '/' + normalizedPath
    }
    
    return normalizedPath
  }
  
  // Obtener ID de página por ruta
  const getPageIdByRoute = (routePath: string) => {
    console.log(`Buscando ID para ruta: ${routePath}`)
    
    // Normalizar la ruta para buscarla
    const normalizedPath = normalizeRoutePath(routePath)
    
    // Si la ruta está en el mapa de rutas conocidas, devolver el ID
    if (knownRoutes[normalizedPath]) {
      console.log(`ID encontrado en mapa: ${knownRoutes[normalizedPath]}`)
      return knownRoutes[normalizedPath]
    }
    
    // Intentar algunas variantes de la ruta
    const routeVariants = [
      normalizedPath,
      normalizedPath.replace(/-/g, '_'),
      normalizedPath.replace(/_/g, '-'),
      normalizedPath.endsWith('/') ? normalizedPath.slice(0, -1) : `${normalizedPath}/`,
      // Variantes sin la barra al final
      normalizedPath.endsWith('/') ? normalizedPath.slice(0, -1) : normalizedPath,
      // Variante con locale específico (/es/algo o /en/algo)
      normalizedPath.match(/^\/[a-z]{2}\//) ? normalizedPath : `/es${normalizedPath}`,
      normalizedPath.match(/^\/[a-z]{2}\//) ? normalizedPath.replace(/^\/[a-z]{2}\//, '/es/') : normalizedPath
    ]
    
    for (const variant of routeVariants) {
      if (knownRoutes[variant]) {
        console.log(`ID encontrado en variante ${variant}: ${knownRoutes[variant]}`)
        return knownRoutes[variant]
      }
    }
    
    // Si todavía no encontramos, buscar por coincidencia parcial
    // Esto es útil para slugs que pueden tener variaciones pequeñas
    const knownPaths = Object.keys(knownRoutes)
    
    // Extraer el último segmento de la ruta (slug)
    const slugMatch = normalizedPath.match(/\/([^/]+)\/?$/)
    if (slugMatch && slugMatch[1]) {
      const slug = slugMatch[1]
      console.log(`Buscando por slug: ${slug}`)
      
      // Buscar rutas que contengan este slug
      const matchingRoutes = knownPaths.filter(path => 
        path.includes(`/${slug}`) || 
        path.includes(`/${slug.replace(/-/g, '_')}`) ||
        path.includes(`/${slug.replace(/_/g, '-')}`)
      )
      
      if (matchingRoutes.length > 0) {
        console.log(`Ruta encontrada por slug parcial: ${matchingRoutes[0]}`)
        return knownRoutes[matchingRoutes[0]]
      }
    }
    
    // No se encontró ID para esta ruta
    console.log(`No se encontró ID para la ruta: ${routePath}`)
    return null
  }

  // Obtener el mapa de rutas para depuración
  const getRouteMap = () => {
    return {...knownRoutes};
  };

  return {
    fetchAllPages,
    fetchPageDetails,
    fetchPageBySlug,
    generateRoutes,
    getPageIdByRoute, // método alternativo
    findPageIdForRoute, // método principal para middleware y rutas
    normalizeRoutePath,
    knownRoutes,
    slugToIdMap,
    pageDetailsMap,
    getProxyUrl,
    apiBase,
    getRouteMap
  }
}