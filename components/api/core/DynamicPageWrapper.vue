<template>
  <q-page class="dynamic-page no-padding">
    <div v-if="loading" class="text-center q-pa-xl">
      <q-spinner color="primary" size="3em" />
      <p class="q-mt-md">Cargando contenido...</p>
    </div>
    
    <div v-else-if="error" class="text-center q-pa-xl">
      <q-icon name="error_outline" color="negative" size="3em" />
      <p class="text-negative q-mt-md">{{ error }}</p>
      <q-btn 
        outline 
        color="primary" 
        label="Reintentar" 
        class="q-mt-md" 
        @click="fetchPageData" 
        icon="refresh"
      />
    </div>
    
    <div v-else>
      <!-- Renderizar contenido según el tipo de página -->
      
      <!-- Para páginas especiales como plataforma/trazabilidad que usan bloques básicos -->
      <template v-if="isContentPage">
        <ApiContentRenderer 
          :page-data="pageData" 
          :api-base-url="apiBaseUrl"
          :debug-mode="false"
        />
      </template>
      
      <!-- Para páginas principales que usan bloques complejos -->
      <template v-else-if="pageBlocks && pageBlocks.length > 0">
        <div v-for="(block, index) in pageBlocks" :key="block.id || index" :class="{'q-my-md': block.type !== 'carousel'}">
          <DynamicBlockRenderer 
            :block="block" 
            :api-base-url="apiBaseUrl"
            :debug-mode="false"
          />
        </div>
      </template>
      
      <!-- Fallback cuando no hay contenido identificable -->
      <div v-else class="text-center q-pa-xl">
        <q-icon name="info" color="info" size="3em" />
        <p class="q-mt-md">No se encontró contenido para esta página.</p>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, watch, defineProps, reactive, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useFetch } from '#app';
import DynamicBlockRenderer from './DynamicBlockRenderer.vue';
import ApiContentRenderer from './ApiContentRenderer.vue';
// Importar el composable para centralizar el manejo de la API
import { useWagtailApi } from '~/composables/useWagtailApi';

// URL base de la API (obtenida de configuración del proyecto o como fallback)
const apiBaseUrl = process.env.NUXT_PUBLIC_API_BASE_URL || 'https://e412-2806-103e-1d-3687-f08f-4014-a8d6-4606.ngrok-free.app';

// Usar un proxy local para evitar problemas CORS y hacer que las URLs sean relativas
const useLocalProxy = true;

// Inicializar router y route
const route = useRoute();
const router = useRouter();

const props = defineProps({
  pageId: {
    type: [Number, String],
    default: null // ID de la página
  },
  pageTitle: {
    type: String,
    default: ''
  }
});

// Estado de la página
const loading = ref(false);
const error = ref(null);
const pageTitle = ref('');
const pageBlocks = ref([]);
const pageData = ref(null);
const pageType = ref('');
const useDynamicRenderer = ref(true);
const pageContent = ref(null);

// Mapa de slugs a IDs para buscar por slug cuando no tenemos la ruta completa
const slugToIdMap = ref({});

// Mapa dinámico de rutas a IDs de páginas (se carga desde la API)
const knownRoutes = reactive({});

// Valor predeterminado para la página principal (se actualiza desde la API)
const homePageId = ref(null);

// Determinar si debemos usar ApiContentRenderer o DynamicBlockRenderer
const isContentPage = computed(() => {
  // Obtener la ruta actual
  const currentPath = route.path.toLowerCase();
  
  // Rutas de páginas principales que siempre usan DynamicBlockRenderer
  const mainPagePatterns = [
    '/',
    '/acerca-de',
    '/acerca-de-nosotros',
    '/contacto'
  ];
  
  // Si es una página principal, siempre usar DynamicBlockRenderer
  const isMainPage = mainPagePatterns.some(pattern => 
    currentPath === pattern || currentPath === pattern + '/'
  );
  
  if (isMainPage) {
    return false;
  }
  
  // Para cualquier otra ruta, verificar si los datos corresponden a un formato de ArticlePage
  // que debería usar ApiContentRenderer
  
  // 1. Verificar si tenemos datos y un array de bloques body
  if (!pageData.value || !Array.isArray(pageData.value.body) || pageData.value.body.length === 0) {
    return false;
  }
  
  // 2. Verificar si el tipo de página es ArticlePage o PaginaInformativaPage
  const pageType = pageData.value?.meta?.type;
  if (pageType && (pageType.includes('ArticlePage') || pageType.includes('PaginaInformativaPage'))) {
    return true;
  }
  
  // 3. Verificar si tiene estructura de bloques simples (párrafos, imágenes, etc.)
  // Si al menos el 70% de los bloques son de tipos básicos, consideramos que es una página de contenido
  const basicBlockTypes = [
    'paragraph', 'image', 'button', 'rich_text', 'Document', 'gallery', 'ImagenTexto', 'hero'
  ];
  
  const totalBlocks = pageData.value.body.length;
  const basicBlocksCount = pageData.value.body.filter(block => 
    basicBlockTypes.includes(block.type)
  ).length;
  
  // Si más del 70% son bloques básicos, usar ApiContentRenderer
  return (basicBlocksCount / totalBlocks) >= 0.7;
});

// Función para normalizar las rutas (unificar guiones bajos y medios)
const normalizeRoutePath = (path) => {
  return path.toLowerCase();
};

// Función para obtener el ID de la página a partir de la ruta actual
const getPageId = async () => {
  // Variable interna para controlar si ya intentamos recargar
  let hasReloaded = false;
  // Si tenemos un ID de página en props, usarlo directamente
  if (props.pageId) {
    console.log('getPageId: Usando ID proporcionado directamente:', props.pageId);
    return props.pageId;
  }
  
  const currentPath = route.path;
  console.log('getPageId: Obteniendo ID para la ruta:', currentPath);
  
  // Si no hay rutas cargadas, cargar el mapa del sitio
  if (Object.keys(knownRoutes).length === 0) {
    console.log('getPageId: No hay rutas cargadas, cargando mapa del sitio...');
    await loadSiteMap();
  }
  
  // Asegurarse de que el mapa del sitio esté cargado
  if (Object.keys(knownRoutes).length === 0) {
    // Si aún no hay rutas después de cargar, recargar forzadamente
    console.log('getPageId: Sin rutas aún después de cargar, forzando recarga...');
    await loadSiteMap(true);
  }
  
  // 1. Comprobar directamente en el mapa de rutas
  if (knownRoutes[currentPath]) {
    console.log(`getPageId: Ruta encontrada directamente: ${currentPath} -> ID: ${knownRoutes[currentPath]}`);
    return knownRoutes[currentPath];
  }
  
  console.log('getPageId: Ruta no encontrada directamente, probando variantes...');
  
  // 2. Probar con variantes de la ruta actual
  const pathVariants = [
    currentPath,                     // Original
    currentPath.replace(/-/g, '_'),  // Con guiones bajos
    currentPath.replace(/_/g, '-'),  // Con guiones medios
    currentPath.toLowerCase(),        // Minúsculas
    // Variantes con/sin slash final
    currentPath.endsWith('/') ? currentPath.slice(0, -1) : currentPath + '/',
    // Combinaciones de reemplazos
    currentPath.replace(/-/g, '_').toLowerCase(),
    currentPath.replace(/_/g, '-').toLowerCase()
  ];
  
  for (const variant of pathVariants) {
    if (knownRoutes[variant]) {
      console.log(`getPageId: Variante de ruta encontrada: ${variant} -> ID: ${knownRoutes[variant]}`);
      // Registrar esta variante para futuras consultas
      knownRoutes[currentPath] = knownRoutes[variant];
      return knownRoutes[variant];
    }
  }
  
  // 3. Extraer y buscar el slug (la última parte de la ruta)
  const slug = currentPath.split('/').pop() || '';
  if (slug && slugToIdMap.value[slug]) {
    console.log(`getPageId: Slug encontrado: ${slug} -> ID: ${slugToIdMap.value[slug]}`);
    // Registrar esta ruta para futuras consultas
    knownRoutes[currentPath] = slugToIdMap.value[slug];
    return slugToIdMap.value[slug];
  }
  
  // 4. Buscar por variantes del slug
  if (slug) {
    const slugVariants = [
      slug,                    // Original
      slug.replace(/-/g, '_'), // Con guiones bajos
      slug.replace(/_/g, '-'), // Con guiones medios
      slug.toLowerCase(),       // Minúsculas
      // Combinaciones
      slug.replace(/-/g, '_').toLowerCase(),
      slug.replace(/_/g, '-').toLowerCase()
    ];
    
    for (const variant of slugVariants) {
      if (slugToIdMap.value[variant]) {
        console.log(`getPageId: Variante de slug encontrada: ${variant} -> ID: ${slugToIdMap.value[variant]}`);
        // Registrar esta ruta para futuras consultas
        knownRoutes[currentPath] = slugToIdMap.value[variant];
        return slugToIdMap.value[variant];
      }
    }
  }
  
  // 5. Analizar la estructura de la ruta para secciones y subsecciones
  const pathParts = currentPath.split('/').filter(part => part);
  console.log('getPageId: Analizando partes de la ruta:', pathParts);
  
  if (pathParts.length >= 1) {
    // Extraer sección principal
    const mainSection = pathParts[0]; // Primera parte (noticias, eventos, etc.)
    let subSection = pathParts.length >= 2 ? pathParts[1] : null; // Segunda parte si existe
    let mainSectionId = null; // Inicializar variable para almacenar ID de sección principal
    
    console.log(`getPageId: Buscando coincidencias para sección '${mainSection}' y subsección '${subSection}'`);
    
    // Buscar rutas que coincidan con esta estructura
    for (const [route, id] of Object.entries(knownRoutes)) {
      const routeParts = route.split('/').filter(part => part);
      
      // Coincidencia de primer nivel (solo sección)
      if (routeParts.length >= 1 && 
          (routeParts[0] === mainSection || 
           routeParts[0].replace(/-/g, '_') === mainSection || 
           routeParts[0].replace(/_/g, '-') === mainSection)) {
        
        // Si hay subsección, verificar coincidencia de segundo nivel
        if (subSection && routeParts.length >= 2) {
          // Comprobar si la subsección coincide o es similar
          const routeSubSection = routeParts[1];
          if (routeSubSection === subSection || 
              routeSubSection.replace(/-/g, '_') === subSection || 
              routeSubSection.replace(/_/g, '-') === subSection || 
              routeSubSection.includes(subSection) || 
              subSection.includes(routeSubSection)) {
            
            console.log(`getPageId: Coincidencia de sección/subsección encontrada: ${route} -> ID: ${id}`);
            // Registrar para futuras consultas
            knownRoutes[currentPath] = id;
            return id;
          }
        } 
        // Si no hay subsección o no coincide, guardar la sección principal como respaldo
        else if (!subSection) {
          console.log(`getPageId: Coincidencia de sección principal: ${route} -> ID: ${id}`);
          // Usaremos esto si no encontramos nada mejor
          mainSectionId = id;
        }
      }
    }
    
    // Si encontramos al menos la sección principal, usarla
    if (mainSectionId) {
      console.log(`getPageId: Usando ID de sección principal: ${mainSectionId}`);
      // Registrar para futuras consultas
      knownRoutes[currentPath] = mainSectionId;
      return mainSectionId;
    }
  }
  
  // 6. Último recurso: intentar recargar el mapa y buscar de nuevo
  if (!hasReloaded) {
    console.log('getPageId: Ruta no encontrada, intentando recargar el mapa...');
    hasReloaded = true;
    await loadSiteMap(true); // Forzar recarga
    
    // Intentar encontrar la ruta de nuevo
    if (knownRoutes[currentPath]) {
      console.log(`getPageId: Ruta encontrada después de recargar: ${currentPath} -> ID: ${knownRoutes[currentPath]}`);
      return knownRoutes[currentPath];
    }
    
    // Intentar de nuevo después de la recarga
  }
  
  // Último recurso: retornar null para que el componente maneje el caso de ruta no encontrada
  console.log('No se encontró ninguna coincidencia para la ruta actual');
  return null; // No usamos IDs fijos como fallback
};

// Función para cargar el mapa completo de rutas desde la API
const loadSiteMap = async (forceReload = false) => {
  // Si ya tenemos rutas y no se fuerza recarga, no hacemos nada
  if (!forceReload && Object.keys(knownRoutes).length > 0) {
    console.log('Usando mapa de rutas existente:', Object.keys(knownRoutes));
    return;
  }
  
  console.log('Cargando mapa del sitio desde la API...');
  
  try {
    // Limpiar mapas si se fuerza recarga completa
    if (forceReload) {
      console.log('Limpiando mapa de rutas existente para recarga completa');
      // Usamos Object.keys y delete para mantener la reactividad
      Object.keys(knownRoutes).forEach(key => delete knownRoutes[key]);
      slugToIdMap.value = {};
    }
    
    // Contador de páginas procesadas para depuración
    let paginasProcesadas = 0;
    
    // Función interna para cargar páginas con paginación
    const loadPages = async (nextUrl = null) => {
      // Construir la URL para la petición
      // Limit=20 es el máximo permitido por la API de Wagtail
      let apiUrl;
      
      if (nextUrl) {
        // Si tenemos una URL para la siguiente página, usarla directamente
        if (useLocalProxy) {
          apiUrl = `/api/proxy-wagtail?url=${encodeURIComponent(nextUrl)}`;
        } else {
          apiUrl = nextUrl;
        }
      } else {
        // URL inicial para la primera página
        if (useLocalProxy) {
          // Usar el proxy local para evitar CORS
          apiUrl = `/api/proxy-wagtail?url=${encodeURIComponent(`${apiBaseUrl}/api/v2/pages/?limit=20`)}`;    
        } else {
          // Usar la API directamente
          apiUrl = `${apiBaseUrl}/api/v2/pages/?limit=20`;
        }
      }
    
      console.log('loadSiteMap: Solicitando datos del sitemap (página #'+(++paginasProcesadas)+') desde:', apiUrl);
      
      // Usar useFetch de Nuxt para obtener los datos con opciones de cache y headers correctos
      const { data: responseData, error: fetchError } = await useFetch(apiUrl, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        key: `sitemap-${Date.now()}-${paginasProcesadas}`, // Evitar caché no deseada
        cache: false,
        watch: false
      });
      
      if (fetchError.value) {
        console.error('Error al obtener sitemap:', fetchError.value);
        throw new Error(`Error en la petición: ${fetchError.value.message || 'Error desconocido'}`);
      }
      
      if (!responseData.value) {
        console.error('No se recibieron datos en la respuesta');
        throw new Error('No se recibieron datos de la API');
      }
      
      // Mostrar datos para depuración
      console.log('loadSiteMap: Respuesta recibida, página #' + paginasProcesadas + ', campos:', Object.keys(responseData.value));
      
      const data = responseData.value;
      
      // Verificar estructura de datos
      if (!data.items) {
        console.error('Respuesta API sin estructura items esperada. Campos recibidos:', Object.keys(data));
        return false; // Detener la carga si no hay items
      }
      
      // Procesar cada página del listado
      if (data.items && Array.isArray(data.items)) {
        console.log(`Procesando lote de ${data.items.length} páginas...`);
        data.items.forEach(page => {
        try {
          // Extraer la ruta directamente del html_url de la API
          let route = '';
          try {
            // Intentar extraer usando URL API
            const url = new URL(page.meta.html_url);
            route = url.pathname;
            
            // Eliminar slash final si existe y no es la raíz
            if (route !== '/' && route.endsWith('/')) {
              route = route.slice(0, -1);
            }
          } catch (urlErr) {
            // Alternativa si falla el parseo de URL
            route = page.meta.html_url.replace(/https?:\/\/[^/]+/g, '');
            if (route !== '/' && route.endsWith('/')) {
              route = route.slice(0, -1);
            }
          }
          
          // Detectar página principal
          if (page.meta.type === 'home.HomePage' || route === '/' || page.id === 3) {
            homePageId.value = page.id;
            console.log(`Página principal detectada: ID=${page.id}, Ruta=${route}`);
          }
          
          // Log detallado de cada página
          console.log(`Procesando: ID=${page.id}, Titulo='${page.title}', Tipo=${page.meta.type}, Ruta='${route}', Slug='${page.meta.slug}'`);
          
          // Registrar la ruta original exactamente como viene de la API
          knownRoutes[route] = page.id;
          
          // Generar variantes de la ruta
          const routeVariants = [
            route.replace(/-/g, '_'),       // Con guiones bajos
            route.replace(/_/g, '-'),       // Con guiones medios
            route.toLowerCase(),             // Minúsculas
            // Quitar slashes finales
            route.replace(/\/$/, ''),        // Sin slash final
            route.replace(/-/g, '_').replace(/\/$/, ''),  // Combinaciones
            route.replace(/_/g, '-').replace(/\/$/, '')   // Combinaciones
          ];
          
          // Registrar todas las variantes
          routeVariants.forEach(variant => {
            if (variant !== route) { // Evitar duplicados
              knownRoutes[variant] = page.id;
              console.log(`  Variante: '${variant}' -> ID: ${page.id}`);
            }
          });
          
          // Mapear el slug directamente desde la API
          if (page.meta.slug) {
            const slug = page.meta.slug;
            slugToIdMap.value[slug] = page.id;
            
            // Variantes del slug
            slugToIdMap.value[slug.replace(/-/g, '_')] = page.id;
            slugToIdMap.value[slug.replace(/_/g, '-')] = page.id;
            slugToIdMap.value[slug.toLowerCase()] = page.id;
            
            console.log(`  Slug mapeado: '${slug}' -> ID: ${page.id}`);
          }
          
          // Crear mapa especial para secciones (noticias, eventos, etc.)
          if (route.includes('/noticias/') || route.includes('/eventos/') || 
              route.includes('/plataforma/') || route.includes('/pacto_verde/') || 
              route.includes('/pacto-verde/')) {
            // Extraer la sección principal y el contenido
            const parts = route.split('/');
            if (parts.length >= 3) {
              const section = parts[1]; // noticias, eventos, etc.
              const content = parts[2]; // unioneuropea, evento1, etc.
              
              // Mapear directamente la combinación de sección/contenido
              const shortRoute = `/${section}/${content}`;
              knownRoutes[shortRoute] = page.id;
              console.log(`  Ruta corta: '${shortRoute}' -> ID: ${page.id}`);
              
              // Variantes con guiones
              knownRoutes[shortRoute.replace(/-/g, '_')] = page.id;
              knownRoutes[shortRoute.replace(/_/g, '-')] = page.id;
            }
          }
        } catch (err) {
          console.error(`Error al procesar página ${page.id}:`, err);
        }
      });
    }
    
    // Si existe un menú de navegación en la respuesta, usarlo para mapear rutas
    if (data.navbar && Array.isArray(data.navbar)) {
      console.log('Procesando menú de navegación...');
      
      // Función para procesar elementos del menú recursivamente
      const processNavItem = (item) => {
        if (item.url) {
          // Normalizar la URL
          let route = item.url;
          if (route !== '/' && route.endsWith('/')) {
            route = route.slice(0, -1);
          }
          
          // Buscar el ID correspondiente en los items
          const pageItem = data.items.find(p => 
            p.meta && p.meta.html_url && p.meta.html_url.endsWith(item.url)
          );
          
          if (pageItem) {
            console.log(`  Menú: '${route}' -> ID: ${pageItem.id}`);
            knownRoutes[route] = pageItem.id;
            knownRoutes[route.replace(/-/g, '_')] = pageItem.id;
            knownRoutes[route.replace(/_/g, '-')] = pageItem.id;
          }
        }
        
        // Procesar hijos
        if (item.children && Array.isArray(item.children)) {
          item.children.forEach(processNavItem);
        }
      };
      
      // Procesar todos los elementos del menú
      data.navbar.forEach(processNavItem);
    }
    
      // Si hay más páginas disponibles, cargar la siguiente página
      if (data.next) {
        console.log('loadSiteMap: Cargando siguiente página del sitemap:', data.next);
        return await loadPages(data.next); // Llamada recursiva con la siguiente URL
      }
      
      // Hemos terminado con todas las páginas
      console.log(`loadSiteMap: Terminado procesamiento de todas las páginas (${paginasProcesadas} en total)`);
      return true;
    };
    
    // Iniciar la carga con la primera página
    await loadPages();
    
    // Registrar estadísticas finales
    console.log('Mapa de rutas actualizado con', Object.keys(knownRoutes).length, 'rutas');
    console.log('Mapa de slugs actualizado con', Object.keys(slugToIdMap.value).length, 'slugs');
    
    // Advertencia si no se cargó ninguna ruta
    if (Object.keys(knownRoutes).length === 0) {
      console.warn('Advertencia: No se pudieron cargar rutas desde la API');
    }
    
  } catch (error) {
    console.error('Error al cargar el mapa del sitio:', error);
  }
};

// Obtener datos de la página usando useFetch de Nuxt
const fetchPageData = async () => {
  try {
    loading.value = true;
    error.value = null;
    
    // Obtener el ID de la página actual mediante la función getPageId
    const pageIdToFetch = await getPageId();
    
    // Si no se pudo determinar un ID, mostrar un mensaje claro
    if (!pageIdToFetch) {
      console.error('No se encontró ningún ID de página para la ruta actual:', route.path);
      error.value = `No se encontró ninguna página registrada para la ruta: ${route.path}`;
      loading.value = false;
      pageContent.value = [];
      pageData.value = null;
      return;
    }
    
    // URL para obtener la página usando el proxy
    const pageUrl = `/api/proxy-wagtail?url=${encodeURIComponent(`${apiBaseUrl}/api/v2/pages/${pageIdToFetch}/`)}`;    
    console.log('Solicitando página a través del proxy:', pageUrl);
    
    // Usar useFetch de Nuxt para obtener los datos
    const { data: responseData, error: fetchError } = await useFetch(pageUrl);
    
    if (fetchError.value) {
      throw new Error(`Error HTTP: ${fetchError.value.message}`);
    }
    
    if (!responseData.value) {
      throw new Error(`No se recibieron datos para la página con ID ${pageIdToFetch}`);
    }
    
    const data = responseData.value;
    
    // Almacenar datos
    pageData.value = data;
    pageTitle.value = data.title || props.pageTitle || '';
    
    // Determinar el tipo de página y actualizar estado
    if (data.meta && data.meta.type) {
      pageType.value = data.meta.type;
    }
    
    // Determinar si hay bloques o usar JSON genérico
    if (data.body) {
      if (Array.isArray(data.body)) {
        // Contenido en formato de bloques Wagtail
        pageBlocks.value = data.body;
        useDynamicRenderer.value = true;
      } else {
        // Contenido en formato JSON genérico
        pageContent.value = data;
        useDynamicRenderer.value = false;
      }
    } else {
      // Sin contenido en formato bloques, usar vista genérica
      pageContent.value = data;
      useDynamicRenderer.value = false;
    }
    
    console.log(`Página ${pageIdToFetch} cargada con éxito. Tipo: ${pageType.value}. Renderizador: ${useDynamicRenderer.value ? 'Dinámico' : 'API'}`);
    
    // Actualizar título de la página en el navegador
    document.title = data.title || props.pageTitle || 'CMS Marketing';
    
    // Actualizar metadatos si están disponibles
    if (data.meta && data.meta.seo_title) {
      document.title = data.meta.seo_title;
    }
    
    // Registrar esta página en el mapa de rutas si se cargó exitosamente
    const currentPath = route.path;
    if (!knownRoutes[currentPath]) {
      console.log(`Añadiendo ruta actual al mapa: ${currentPath} -> ID: ${pageIdToFetch}`);
      knownRoutes[currentPath] = pageIdToFetch;
      
      // Añadir variantes también
      const dashPath = currentPath.replace(/_/g, '-');
      const underscorePath = currentPath.replace(/-/g, '_');
      
      if (dashPath !== currentPath) knownRoutes[dashPath] = pageIdToFetch;
      if (underscorePath !== currentPath) knownRoutes[underscorePath] = pageIdToFetch;
    }
    
    return data;
    
  } catch (err) {
    console.error('Error al cargar la página:', err);
    error.value = `Error al cargar la página: ${err.message}`;
    
    // Registrar detalles del error para depuración
    console.log(`Ruta actual: ${route.path}, ID solicitado: ${pageIdToFetch || 'no determinado'}`);
    console.log(`Rutas conocidas: ${Object.keys(knownRoutes).length}, Slugs: ${Object.keys(slugToIdMap.value).length}`);
    
    // Mostrar contenido de error
    pageTitle.value = props.pageTitle || 'Error - CMS Marketing';
    useDynamicRenderer.value = true;
    pageBlocks.value = [{
      id: 'error-block',
      type: 'richtext',
      value: `<p>Lo sentimos, ocurrió un error al cargar la página: ${err.message}</p><p>Por favor, intente nuevamente más tarde.</p>`
    }];
    
    // Simplemente mostrar el mensaje de error sin redirección automática
    console.log('Error mostrado al usuario, esperando acción manual.');
    
    return null;
  } finally {
    loading.value = false;
  }
};

// Cargar datos al montar el componente
onMounted(async () => {
  try {
    // Cargar los datos de la página actual
    // El mapa del sitio se cargará dentro de fetchPageData si es necesario
    await fetchPageData();
  } catch (err) {
    console.error('Error al inicializar componente:', err);
  }
});

// Observar cambios en la ruta y recargar la página cuando cambie
watch(() => route.path, async (newPath, oldPath) => {
  if (newPath !== oldPath) {
    console.log(`Ruta cambiada de ${oldPath} a ${newPath}, recargando datos...`);
    try {
      await fetchPageData();
    } catch (err) {
      console.error('Error al actualizar la página:', err);
    }
  }
});
</script>

<style scoped>
/* Permitimos contenido a ancho completo */
.dynamic-page {
  width: 100% !important;
  max-width: none !important; /* Eliminamos la restricción de ancho */
  padding: 0 !important; /* Eliminamos el padding para permitir contenido a ancho completo */
  margin: 0 !important;
  overflow-x: hidden !important; /* Evita scroll horizontal */
  box-sizing: border-box !important;
}

/* Los bloques de contenido normales (no hero) siguen limitados para mejor lectura */
.dynamic-page :deep(.text-content),
.dynamic-page :deep(.video-section) {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}
</style>
