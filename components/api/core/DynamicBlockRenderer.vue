<template>
  <div class="w-100">
    <!-- CASOS ESPECIALES: Algunos componentes tienen lógica especial de renderizado -->
    <!-- Caso especial: Carrusel -->
    <ApiCarouselComponent 
      v-if="block && block.type && block.type.toLowerCase() === 'carousel' && block.value"
      :block="block"
      :carouselData="block.value"
      :videoData="block.value"
      :showCarousel="true"
      :showVideo="true"
      :customImageUrlFunction="(image) => `/api/proxy-image?url=${encodeURIComponent(image && image.url ? image.url : '')}`"
      :key="`carousel-${block.id || Math.random()}`"
    />
    
    <!-- Caso especial: Video -->
    <ApiVideoComponent 
      v-if="block && block.type && block.type.toLowerCase() === 'video'"
      :block="block"
      :blocks="[block]"
      :api-base-url="apiBaseUrl"
      :title="blockTitle"
      :key="`video-${block.id || Math.random()}`"
    />
    
    <!-- CASO GENERAL: Para todos los demás componentes registrados -->
    <component 
      v-if="block && block.type && componentExists(block.type)"
      :is="getComponentForBlockType(block.type)" 
      :block="block"
      :api-base-url="apiBaseUrl"
      :key="`component-${block.type}-${block.id || Math.random()}`"
    />
    
    <!-- Fallback cuando no se encuentra un componente registrado -->
    <q-card 
      v-else-if="block && block.type" 
      flat 
      bordered 
      class="q-my-sm bg-amber-1"
    >
      <q-card-section class="q-py-sm">
        <div class="row items-center justify-center text-grey-8">
          <q-icon name="warning" color="amber" class="q-mr-sm" />
          <span>Tipo de bloque no registrado: {{ block.type }}</span>
        </div>
      </q-card-section>
      
      <q-card-section v-if="debugMode" class="q-py-xs">
        <q-expansion-item
          dense
          label="Detalles del bloque"
          header-class="text-amber-9"
          switch-toggle-side
        >
          <q-card>
            <q-card-section class="q-pa-sm">
              <pre class="text-grey-8 bg-grey-1 q-pa-md rounded-borders text-caption" style="overflow: auto; max-height: 200px;">{{ JSON.stringify(block, null, 2) }}</pre>
            </q-card-section>
          </q-card>
        </q-expansion-item>
      </q-card-section>
    </q-card>
    
    <!-- Fallback para bloque sin tipo -->
    <q-card 
      v-else-if="block" 
      flat 
      bordered 
      class="q-my-sm bg-negative-1"
    >
      <q-card-section class="q-py-sm">
        <div class="row items-center justify-center text-negative">
          <q-icon name="error" color="negative" class="q-mr-sm" />
          <span>Bloque sin tipo definido</span>
        </div>
      </q-card-section>
      
      <q-card-section v-if="debugMode" class="q-py-xs">
        <q-expansion-item
          dense
          label="Detalles del bloque"
          header-class="text-negative"
          switch-toggle-side
        >
          <q-card>
            <q-card-section class="q-pa-sm">
              <pre class="text-grey-8 bg-grey-1 q-pa-md rounded-borders text-caption" style="overflow: auto; max-height: 200px;">{{ JSON.stringify(block, null, 2) }}</pre>
            </q-card-section>
          </q-card>
        </q-expansion-item>
      </q-card-section>
    </q-card>
    
    <!-- Caso para cuando no hay bloque -->
    <q-card v-else flat bordered class="q-my-sm bg-grey-2">
      <q-card-section class="q-py-sm text-center text-grey-7">
        <q-icon name="info" color="grey-7" class="q-mr-sm" />
        <span>No hay contenido para mostrar</span>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { computed, onMounted, watch } from 'vue';
import { useComponentRegistry } from '~/composables/useComponentRegistry';

// Importar el registro de componentes API
import { registerAllComponents, getComponentByType, hasComponentForType as hasApiComponentForType } from '~/components/api/registry';

// Componentes para casos especiales que necesitan tratamiento específico
import ApiCarouselComponent from '../feature-blocks/ApiCarouselComponent.vue';
import ApiVideoComponent from '../feature-blocks/ApiVideoComponent.vue';

// Obtener el registro de componentes local
const { 
  registerComponent, 
  registerComponents, 
  getComponentForType, 
  hasComponentForType,
  setFallbackComponent
} = useComponentRegistry();

// Debug helpers
function componentExists(type) {
  // Normalizar el tipo a minúsculas para buscar en el registro
  const normalizedType = type.toLowerCase();
  const exists = hasComponentForType(normalizedType);
  console.log('[DynamicBlockRenderer] Tipo:', type, 'Normalizado:', normalizedType, '¿Registrado?', exists);
  return exists;
}

function getComponentForBlockType(type) {
  // Normalizar el tipo a minúsculas para buscar en el registro
  const normalizedType = type.toLowerCase();
  const comp = getComponentForType(normalizedType);
  console.log('[DynamicBlockRenderer] Componente para', type, 'Normalizado:', normalizedType, ':', comp);
  return comp;
}

// Props para el componente
const props = defineProps({
  block: {
    type: Object,
    required: true
  },
  apiBaseUrl: {
    type: String,
    default: ''
  },
});

// Extraer el título del bloque si existe
const blockTitle = computed(() => {
  if (!props.block || !props.block.value) return '';
  
  // Buscar título en múltiples ubicaciones posibles
  const possibleTitleFields = ['title', 'titulo', 'heading', 'header', 'name', 'nombre'];
  
  for (const field of possibleTitleFields) {
    if (props.block.value[field]) {
      return props.block.value[field];
    }
  }
  
  return ''; // Valor por defecto si no hay título
});

// Inicialización al montar el componente
onMounted(() => {
  // Establecer un fallback para componentes no encontrados
  setFallbackComponent('div');
  
  // Registrar componentes API
  registerAllComponents(registerComponent);
  
  // Si tenemos un bloque con tipo, intentar detectar el componente
  if (props.block && props.block.type) {
    detectNewComponent(props.block.type);
  }
});

// Observar cambios en el bloque para detectar nuevos tipos
watch(() => props.block?.type, (newType) => {
  if (newType) {
    detectNewComponent(newType);
  }
});

/**
 * Intenta detectar y registrar un nuevo componente basado en convenciones de nombres
 * @param {String} blockType - Tipo de bloque a detectar
 */
const detectNewComponent = (blockType) => {
  if (!blockType || componentExists(blockType)) return;
  
  // Convertir el tipo a varias convenciones de nombres posibles
  try {
    // 1. snake_case o kebab-case a PascalCase
    const pascalCaseType = blockType.toLowerCase()
      .replace(/[-_]([a-z])/g, (_, letter) => letter.toUpperCase());
    
    // 2. Construir posibles nombres de componentes  
    const possibleNames = [
      `Api${pascalCaseType.charAt(0).toUpperCase()}${pascalCaseType.slice(1)}Component`,
      `${pascalCaseType.charAt(0).toUpperCase()}${pascalCaseType.slice(1)}Component`,
      `Api${pascalCaseType.charAt(0).toUpperCase()}${pascalCaseType.slice(1)}`
    ];
    
    // Nota: La importación dinámica requiere configuración de Vite/Webpack
    // En una implementación real, se podría usar:
    // import(`../blocks/Api${pascalCaseType.charAt(0).toUpperCase()}${pascalCaseType.slice(1)}Component.vue`)
    //   .then(module => {
    //     registerComponent(blockType, module.default);
    //   })
    //   .catch(error => {
    //     console.warn(`No se pudo cargar dinámicamente: ${blockType}`, error);
    //   });
  } catch (error) {
    console.warn(`Error al intentar detectar componente para: ${blockType}`, error);
  }
};
</script>

<!-- Eliminado todo el CSS personalizado y uso exclusivo de clases de Quasar -->
