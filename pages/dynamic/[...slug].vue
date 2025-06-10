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
const route = useRoute()
const { fetchAllPages, fetchPageBySlug, fetchPageDetails, findPageIdForRoute, knownRoutes } = useWagtail()
const { normalizeUrl } = useWagtailApi()

const isLoading = ref(true)
const error = ref('')
const pageData = ref(null)

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
    // 1. Usar pageId del middleware si existe
    if (route.meta.pageId) {
      pageData.value = await fetchPageDetails(route.meta.pageId)
      if (!pageData.value) throw new Error('No se encontró la página por ID')
      isLoading.value = false
      return
    }
    // 2. Buscar el ID usando el path normalizado
    const pageId = findPageIdForRoute(routeParams.value.path)
    if (pageId) {
      pageData.value = await fetchPageDetails(pageId)
      isLoading.value = false
      return
    }
    // 3. Buscar por slug
    if (routeParams.value.slug) {
      pageData.value = await fetchPageBySlug(routeParams.value.slug, routeParams.value.locale)
      isLoading.value = false
      return
    }
    throw new Error('No se pudo determinar qué página cargar')
  } catch (err) {
    error.value = err?.message || 'Error desconocido'
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  await fetchAllPages()
  await loadPageData()
})

watch(
  () => [route.fullPath, Object.keys(knownRoutes).length],
  async () => {
    await fetchAllPages()
    await loadPageData()
  }
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
  title: () => pageData.value?.title || 'Cargando...',
  description: () => pageData.value?.meta?.search_description || ''
})
</script>
