<template>
  <div>
    <!-- Loading state -->
    <div v-if="isLoading" class="flex justify-center items-center min-h-screen">
      <div class="loader">Cargando página...</div>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="flex flex-col items-center justify-center min-h-screen">
      <h1 class="text-h4 q-mt-md">Error al cargar la página</h1>
      <p class="text-body1 q-mt-sm">{{ error }}</p>
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
const { fetchAllPages, fetchPageBySlug, fetchPageDetails, findPageIdForRoute, knownRoutes } = useWagtail()
const { normalizeUrl } = useWagtailApi()

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
    console.log(`Cargando datos de página para idioma: ${locale}, slug: ${slug}, path: ${path}`);
    
    // Caso especial: detectar si es la página principal con prefijo de idioma (ej: /es/)
    // Esto ocurre cuando el path es /<idioma>/ o cuando el slug está vacío
    const isHomePage = !slug || slug === '' || path === `/${locale}/` || path === `/${locale}`;
    if (isHomePage) {
      console.log(`Detectada página principal con prefijo de idioma: ${locale}. Usando ID fijo.`);
      const homePageId = 3; // ID fijo de la página de inicio
      pageData.value = await fetchPageDetails(homePageId, locale, true);
      console.log(`Datos cargados para la página principal con ID ${homePageId} en idioma ${locale}:`, pageData.value);
      isLoading.value = false;
      return;
    }
    
    // 1. Usar pageId del middleware si existe
    if (route.meta && typeof route.meta === 'object' && 'pageId' in route.meta && route.meta.pageId) {
      const pageId = Number(route.meta.pageId);
      console.log(`Usando pageId del middleware: ${pageId}`);
      pageData.value = await fetchPageDetails(pageId, locale);
      if (!pageData.value) throw new Error(`No se encontró la página con ID ${route.meta.pageId} para idioma ${locale}`);
      isLoading.value = false
      return
    }
    
    // 2. Buscar el ID usando el path normalizado
    const pageId = findPageIdForRoute(path);
    if (pageId) {
      console.log(`Encontrado pageId ${pageId} para ruta ${path}`);
      pageData.value = await fetchPageDetails(pageId, locale);
      isLoading.value = false
      return
    }
    
    // 3. Buscar por slug
    if (slug) {
      console.log(`Buscando página por slug: ${slug} en idioma ${locale}`);
      pageData.value = await fetchPageBySlug(slug, locale);
      isLoading.value = false
      return
    }
    
    throw new Error(`No se pudo determinar qué página cargar para idioma ${locale}`)
  } catch (err) {
    console.error('Error al cargar página:', err);
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

watch(
  () => [route.fullPath, Object.keys(knownRoutes).length, routeParams.value.locale],
  async () => {
    const locale = routeParams.value.locale;
    console.log(`Detectado cambio en ruta o idioma: ${locale}, cargando páginas...`)
    // Cargar todas las páginas para el idioma actual cuando cambie la ruta o el idioma
    await fetchAllPages(locale)
    await loadPageData()
  },
  { deep: true }
)

watch(
  pageData,
  (val) => console.log('[DynamicPageData]', val)
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
