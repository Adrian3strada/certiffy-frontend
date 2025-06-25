<template>
  <div>
    <!-- Loading state -->
    <div v-if="isLoading" class="loader-wrapper">
      <div class="loader">Cargando página...</div>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="error-wrapper">
      <h1 class="text-h4 q-mt-md">Esta página no está disponible en este idioma</h1>
      <p class="text-body1 q-mt-sm">{{ error }}</p>
      <router-link :to="`/es${route.fullPath.replace(/^\/en/, '')}`">
        Ver en español
      </router-link>
    </div>

    <!-- Dynamic page content -->
    <template v-else>
      <DynamicPageContent v-if="pageData" :pageData="pageData" />
      <div v-else class="error">No se encontró la página solicitada.</div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'

// Definir interfaces para los tipos de datos
interface PageMeta {
  slug?: string;
  locale?: string;
  search_description?: string;
  detail_url?: string;
  [key: string]: any;
}

interface PageData {
  id?: number;
  title?: string;
  meta?: PageMeta;
  body?: any[];
  [key: string]: any;
}

const route = useRoute()
const { fetchPageBySlug, fetchPageDetails, findHomePageId, findPageIdForRoute, fetchAllPages } = useWagtail()
const { normalizeUrl } = useWagtailApi()
const knownRoutes = ref([])

const isLoading = ref(true)
const error = ref('')
const pageData = ref<PageData | null>(null)

const routeParams = computed(() => {
  const normalizedPath = normalizeUrl(route.path)
  const pathParts = normalizedPath.split('/')
  pathParts.shift()
  let locale = 'es'
  let path = normalizedPath
  if (pathParts.length > 0 && pathParts[0].match(/^[a-z]{2}$/)) {
    locale = pathParts[0]
  }
  let slug = ''
  if (route.params.slug) {
    if (Array.isArray(route.params.slug)) {
      slug = route.params.slug.join('/')
    } else {
      slug = route.params.slug
    }
  }
  return { slug, locale, path }
})

async function loadPageData() {
  isLoading.value = true
  error.value = ''
  pageData.value = null
  try {
    const locale = routeParams.value.locale;
    const path = routeParams.value.path;
    const slug = routeParams.value.slug;
    
    // Caso especial: detectar si es la página principal con prefijo de idioma (ej: /es/)
    const isHomePage = !slug || slug === '' || path === `/${locale}/` || path === `/${locale}`;
    if (isHomePage) {
      const homePageId = await findHomePageId(locale);
      if (homePageId) {
        pageData.value = await fetchPageDetails(homePageId, locale);
      } else {
        // Intentar buscar la página por slug "home" como alternativa
        pageData.value = await fetchPageBySlug('home', locale);
      }
      if (!pageData.value) throw new Error('No se encontró la página para este idioma.');
      isLoading.value = false;
      return;
    }
    
    // 1. Usar pageId del middleware si existe
    if (route.meta && typeof route.meta === 'object' && 'pageId' in route.meta && route.meta.pageId) {
      const pageId = Number(route.meta.pageId);
      pageData.value = await fetchPageDetails(pageId, locale);
      if (!pageData.value) throw new Error(`No se encontró la página con ID ${route.meta.pageId} para idioma ${locale}`);
      isLoading.value = false
      return
    }
    
    // 2. Buscar el ID usando el path normalizado con varias estrategias
    let pageId = null;
    // Probar estrategias en orden
    const pathVariants = [
      path,
      path.endsWith('/') ? path.slice(0, -1) : path,
      !path.endsWith('/') ? path + '/' : path
    ];
    
    // Intentar encontrar ID con las variantes de ruta
    for (const pathVariant of pathVariants) {
      pageId = findPageIdForRoute(pathVariant);
      if (pageId) break;
    }
    
    if (pageId) {
      pageData.value = await fetchPageDetails(pageId, locale);
      if (!pageData.value) throw new Error('No se encontró la página para este idioma.');
      isLoading.value = false;
      return;
    }
    
    // 3. Buscar por slug con diferentes estrategias
    if (slug) {
      // Intentar con diferentes variantes del slug para manejar varias profundidades de ruta
      const slugVariants = [
        slug, // platform/traceability
        slug.replace(/\/+$/, ''), // platform/traceability sin barra final
        slug.split('/').pop() || '' // traceability
      ];
      for (const variant of slugVariants) {
        if (!variant) continue;
        pageData.value = await fetchPageBySlug(variant, locale);
        if (pageData.value) break;
      }
      if (!pageData.value) throw new Error('No se encontró la página para este idioma.');
      isLoading.value = false;
      return;
    }
    
    throw new Error(`No se pudo determinar qué página cargar para idioma ${locale}`)
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Error desconocido';
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  // Cargar todas las páginas para el idioma actual
  const locale = routeParams.value.locale;
  await fetchAllPages(locale)
  await loadPageData()
})

// Watcher mejorado para cambios de ruta e idioma
watch(
  () => [route.fullPath, routeParams.value.locale],
  async ([newPath, newLocale], [oldPath, oldLocale]) => {
    console.log(`[Debug] Detectado cambio en ruta: ${newPath}, idioma: ${newLocale}`);
    console.log(`[Debug] Ruta anterior: ${oldPath}, idioma anterior: ${oldLocale}`);
    
    // Solo recargar si realmente cambió el idioma o la ruta
    if (newLocale !== oldLocale || newPath !== oldPath) {
      // Cargar todas las páginas para el idioma actual cuando cambie la ruta o el idioma
      await fetchAllPages(newLocale);
      // Forzar refresco completo para páginas anidadas
      console.log(`[Debug] Realizando carga de datos para la nueva ruta`);
      await loadPageData();
    }
  },
  { deep: true, immediate: false }
)

// Watcher adicional para cambios en las rutas conocidas
watch(
  () => Object.keys(knownRoutes).length,
  async (newCount, oldCount) => {
    if (newCount > 0 && newCount !== oldCount) {
      console.log(`[Debug] Rutas actualizadas: ${newCount} rutas disponibles`);
      // Recargar datos si las rutas se actualizaron
      const locale = routeParams.value.locale;
      await loadPageData();
    }
  }
)

watch(
  pageData,
  (val) => {
    // console.log('[DynamicPageData]', val)
  }
)

const DynamicPageContent = defineAsyncComponent(() => 
  import('~/components/api/core/DynamicPageContent.vue')
)

// Configurar metadatos de la página
useSeoMeta({
  title: computed(() => {
    if (!pageData.value) return 'Cargando...';
    return pageData.value.title || 'Cargando...'
  }),
  description: computed(() => {
    if (!pageData.value || !pageData.value.meta) return '';
    return pageData.value.meta.search_description || ''
  })
})
</script>

<style scoped>
.loader-wrapper, .error-wrapper {
  padding: 24px 0 8px 0;
  text-align: center;
}
</style>
