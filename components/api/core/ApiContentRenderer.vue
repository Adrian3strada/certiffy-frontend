<template>
  <div class="api-content-renderer no-padding">
    <div v-if="loading" class="loading-container">
      <q-spinner color="primary" size="3rem" />
      <div class="q-mt-md">Cargando contenido...</div>
    </div>
    
    <div v-else-if="error" class="error-container">
      <q-icon name="error" color="negative" size="3rem" />
      <div class="text-negative q-mt-md">{{ error }}</div>
    </div>
    
    <div v-else class="content-container">
      <!-- Se eliminó el título para que no aparezca antes del hero banner -->
      
      <div v-for="(block, index) in blocks" :key="block.id || index" class="content-block">
        <!-- Renderizado dinámico basado en el tipo de bloque -->
        <component 
          v-if="getComponent(block.type)" 
          :is="getComponent(block.type)" 
          :block="block" 
          :api-base-url="apiBaseUrl"
        />
        
        <!-- Fallback para tipos desconocidos -->
        <div v-else class="unknown-block-type">
          <div class="text-grey-7 text-center q-pa-md">
            Tipo de bloque no soportado: {{ block.type }}
          </div>
          <pre v-if="debugMode" class="debug-info">{{ JSON.stringify(block, null, 2) }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useWagtailApi } from '~/composables/useWagtailApi';

// Importar el registro centralizado de componentes
import { getComponentByType } from '../registry.js';

// Importamos los componentes utilizados directamente en la plantilla
import ApiImageComponent from '../blocks/ApiImageComponent.vue';
import ApiRichTextComponent from '../blocks/ApiRichTextComponent.vue';
import ApiButtonComponent from '../blocks/ApiButtonComponent.vue';
import ApiHeroBannerComponent from '../blocks/ApiHeroBannerComponent.vue';
import ApiDocumentComponent from '../blocks/ApiDocumentComponent.vue';
import ApiGalleryComponent from '../blocks/ApiGalleryComponent.vue';

const props = defineProps({
  pageData: {
    type: Object,
    default: null
  },
  apiBaseUrl: {
    type: String,
    default: 'https://3d63-2806-103e-c-2117-fc9b-fb33-cf9f-9ebd.ngrok-free.app'
  },
  debugMode: {
    type: Boolean,
    default: false
  }
});

const route = useRoute();
const { getDataFromUrl, loading, error } = useWagtailApi();

// Estado local
const pageContent = ref(props.pageData || null);

// Título de la página
const pageTitle = computed(() => {
  return pageContent.value?.title || '';
});

// Bloques de contenido
const blocks = computed(() => {
  if (!pageContent.value || !pageContent.value.body) {
    return [];
  }
  
  return Array.isArray(pageContent.value.body) 
    ? pageContent.value.body 
    : [pageContent.value.body];
});

// Función para obtener el componente adecuado para cada tipo de bloque
const getComponent = (type) => {
  if (!type) return null;
  
  // Normalizar el tipo (convertir a minúsculas y manejar variantes)
  const normalizedType = type.toLowerCase();
  
  // Usar la función del registro centralizado
  const component = getComponentByType(normalizedType);
  
  if (component) {
    console.log(`Componente encontrado para tipo: ${normalizedType}`);
    return component;
  } else {
    console.warn(`No se encontró componente para tipo: ${normalizedType}`);
    return null;
  }
};

// Cargar datos si no se proporcionaron como prop
onMounted(async () => {
  if (!props.pageData) {
    try {
      // Intentar obtener datos de la API utilizando la ruta actual
      const path = route.path;
      const apiUrl = `/api/proxy-wagtail?path=${encodeURIComponent(path)}`;
      
      const data = await getDataFromUrl(apiUrl);
      if (data) {
        pageContent.value = data;
      }
    } catch (err) {
      console.error('Error al cargar datos de la página:', err);
    }
  }
});
</script>

<style scoped>
.api-content-renderer {
  width: 100%;
  min-height: 300px;
}

.api-content-renderer.no-padding {
  padding: 0;
  margin: 0;
  max-width: 100vw;
  overflow-x: hidden;
}

.page-title {
  color: #005c5c;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 2rem;
  text-transform: uppercase;
}

.loading-container,
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  text-align: center;
  color: #666;
}

.content-block {
  margin-bottom: 2rem;
}

.unknown-block-type {
  background-color: #f5f5f5;
  border-radius: 8px;
  margin: 1rem 0;
  padding: 1rem;
}

.debug-info {
  background-color: #eee;
  border-radius: 4px;
  padding: 1rem;
  overflow: auto;
  font-size: 0.8rem;
  max-height: 200px;
}

@media (max-width: 600px) {
  .page-title {
    font-size: 2rem;
  }
  
  .api-content-renderer {
    padding: 1rem;
  }
}
</style>
