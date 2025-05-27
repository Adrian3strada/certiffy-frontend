<template>
  <q-page class="dynamic-page q-pa-md">
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
      <h1 v-if="pageTitle" class="text-h4 text-center q-my-lg">{{ pageTitle }}</h1>
      
      <!-- Renderizar dinámicamente cada bloque en el orden que viene de la API -->
      <div v-for="(block, index) in pageBlocks" :key="block.id || index" class="q-my-md">
        <DynamicBlockRenderer 
          :block="block" 
          :api-base-url="API_BASE_URL"
          :debug-mode="false"
        />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, useRoute, computed } from 'vue';
import { API_BASE_URL } from '~/composables/useWagtailApi';
import { useDynamicPages } from '~/composables/useDynamicPages';
import DynamicBlockRenderer from '~/components/api/DynamicBlockRenderer.vue';

// Obtener el route de Vue Router
const route = useRoute();

// Obtener funcionalidades del composable de páginas dinámicas
const { 
  findPageBySlug, 
  getPageById, 
  getPageIdFromRoute,
  loading, 
  error
} = useDynamicPages();

// Estado de la página
const pageTitle = ref('');
const pageBlocks = ref([]);
const pageData = ref(null);
const pageSlug = computed(() => {
  // Si no hay slug o está vacío, es la página principal
  if (!route.params.slug || route.params.slug.length === 0) {
    return '/';
  }
  
  // Construir el slug desde los parámetros de ruta
  return '/' + (Array.isArray(route.params.slug) ? route.params.slug.join('/') : route.params.slug);
});

// Obtener datos de la página actual
const fetchPageData = async () => {
  try {
    // Intentar obtener la página por su slug
    let data = null;
    
    if (pageSlug.value === '/') {
      // Si es la página principal, obtener por ID directamente
      data = await getPageById(3);
    } else {
      // Obtener el ID de la página basado en el slug y luego obtener los datos
      const pageId = await getPageIdFromRoute(pageSlug.value);
      
      if (pageId) {
        data = await getPageById(pageId);
      } else {
        // Si no encontramos un ID, intentar buscar directamente por slug
        data = await findPageBySlug(pageSlug.value.substring(1));
      }
    }
    
    if (!data) {
      throw new Error(`No se encontró una página con el slug: ${pageSlug.value}`);
    }
    
    // Guardar los datos completos de la página
    pageData.value = data;
    
    // Asignar título y bloques
    pageTitle.value = data.title || '';
    pageBlocks.value = data.body || [];
    
  } catch (err) {
    console.error('Error al cargar la página:', err);
    error.value = `Error al cargar la página: ${err.message}`;
    
    // Usar datos de respaldo para desarrollo
    pageTitle.value = 'Página no encontrada';
    pageBlocks.value = [
      {
        id: 'error-1',
        type: 'richtext',
        value: '<p>No se pudo encontrar la página solicitada. Por favor, verifica la URL o regresa a la página principal.</p>'
      }
    ];
  }
};

// Cargar datos cuando el componente se monta
onMounted(fetchPageData);
</script>

<style scoped>
.dynamic-page {
  max-width: 1200px;
  margin: 0 auto;
}
</style>
