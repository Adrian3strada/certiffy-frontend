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
import { ref, onMounted, defineProps } from 'vue';
import { API_BASE_URL } from '~/composables/useWagtailApi';
import { useDynamicPages } from '~/composables/useDynamicPages';
import DynamicBlockRenderer from './DynamicBlockRenderer.vue';

const props = defineProps({
  pageId: {
    type: [Number, String],
    default: 3 // ID de la página principal por defecto
  },
  slug: {
    type: String,
    default: '' // Slug vacío por defecto (página principal)
  }
});

// Obtener funcionalidades del composable de páginas dinámicas
const { getPageById, findPageBySlug, loading, error } = useDynamicPages();

// Estado de la página
const pageTitle = ref('');
const pageBlocks = ref([]);
const pageData = ref(null);

// Obtener datos de la página
const fetchPageData = async () => {
  try {
    let data = null;
    
    // Si tenemos un pageId, usarlo directamente
    if (props.pageId) {
      data = await getPageById(props.pageId);
    } 
    // Si tenemos un slug, buscar la página por slug
    else if (props.slug) {
      data = await findPageBySlug(props.slug);
    } 
    // Por defecto, cargar la página principal
    else {
      data = await getPageById(3);
    }
    
    if (!data) {
      throw new Error('No se pudieron obtener datos de la página');
    }
    
    // Guardar los datos de la página
    pageData.value = data;
    pageTitle.value = data.title || '';
    pageBlocks.value = data.body || [];
    
  } catch (err) {
    console.error('Error al cargar la página:', err);
    error.value = `Error al cargar la página: ${err.message}`;
    
    // Datos de respaldo en caso de error
    pageTitle.value = 'Certiffy';
    pageBlocks.value = [
      {
        id: 'error-1',
        type: 'richtext',
        value: '<p>Ocurrió un error al cargar el contenido. Por favor, intenta nuevamente más tarde.</p>'
      }
    ];
  }
};

// Cargar los datos cuando el componente se monta
onMounted(fetchPageData);
</script>

<style scoped>
.dynamic-page {
  max-width: 1200px;
  margin: 0 auto;
}
</style>
