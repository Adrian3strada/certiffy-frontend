<template>
  <div class="dynamic-block-renderer">

    
    <!-- CASOS ESPECIALES: Algunos componentes tienen lógica especial de renderizado -->
    <!-- Caso especial: Carrusel -->
    <ApiCarouselComponent 
      v-if="block && block.type && block.type.toLowerCase() === 'carousel' && block.value"
      :carouselData="block.value"
      :videoData="block.value"
      :showCarousel="true"
      :showVideo="true"
      :customImageUrlFunction="(image) => `/api/proxy-image?url=${encodeURIComponent(image && image.url ? image.url : '')}`"

    />
    
    <!-- Caso especial: Video -->
    <ApiVideoComponent 
      v-else-if="block && block.type && block.type.toLowerCase() === 'video'"
      :blocks="[block]"
      :api-base-url="apiBaseUrl"
      :title="blockTitle"
    />
    
    <!-- CASO GENERAL: Para todos los demás componentes registrados -->
    <component 
      v-else-if="block && block.type && componentExists(block.type)"
      :is="getComponentForBlockType(block.type)" 
      :block="block"
      :api-base-url="apiBaseUrl"
    />
    
    <!-- Fallback cuando no se encuentra un componente registrado -->
    <div v-else-if="block && block.type" class="unknown-block-type q-pa-md">
      <div class="text-caption text-grey-7 text-center">
        <q-icon name="warning" color="amber" />
        Tipo de bloque no registrado: {{ block.type }}
      </div>
      <pre v-if="debugMode" class="debug-info q-mt-sm">{{ JSON.stringify(block, null, 2) }}</pre>
    </div>
    
    <!-- Fallback para bloque sin tipo -->
    <div v-else-if="block" class="invalid-block q-pa-md">
      <div class="text-caption text-negative text-center">
        <q-icon name="error" color="negative" />
        Bloque sin tipo definido
      </div>
      <pre v-if="debugMode" class="debug-info q-mt-sm">{{ JSON.stringify(block, null, 2) }}</pre>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, watch } from 'vue';
import { useComponentRegistry } from '~/composables/useComponentRegistry';

// Importar el registro centralizado de componentes
import { registerAllComponents, getComponentByType, hasComponentForType as registryHasComponent } from '../registry.js';

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
  
  // Registrar todos los componentes del registro centralizado en el registro local
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
 * Verifica si existe un componente registrado para el tipo de bloque
 * @param {String} blockType - Tipo de bloque a verificar
 * @returns {Boolean} - True si existe un componente registrado
 */
const componentExists = (blockType) => {
  if (!blockType) return false;
  
  // Normalizar el tipo a minúsculas
  const normalizedType = blockType.toLowerCase();
  
  // Verificar en ambos registros (local y centralizado)
  return hasComponentForType(normalizedType) || registryHasComponent(normalizedType);
};

/**
 * Obtiene el componente apropiado para el tipo de bloque
 * @param {String} blockType - Tipo de bloque
 * @returns {Component|String} - Componente Vue o 'div' como fallback
 */
const getComponentForBlockType = (blockType) => {
  if (!blockType) return 'div';
  
  // Normalizar el tipo a minúsculas
  const normalizedType = blockType.toLowerCase();
  
  // Primero intentar obtener del registro local
  const localComponent = getComponentForType(normalizedType);
  if (localComponent && localComponent !== 'div') {
    return localComponent;
  }
  
  // Si no está en el registro local, intentar del registro centralizado
  const centralComponent = getComponentByType(normalizedType);
  if (centralComponent) {
    // Registrarlo en el registro local para futuros usos
    registerComponent(normalizedType, centralComponent);
    return centralComponent;
  }
  
  // Si no se encontró, intentar detectar dinámicamente
  detectNewComponent(normalizedType);
  
  // Retornar fallback
  return 'div';
};

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

<style scoped>
.dynamic-block-renderer {
  width: 100%;
}

.unknown-block-type {
  background-color: #fffbf0;
  border: 1px dashed #ffc107;
  border-radius: 8px;
  margin: 0.5rem 0;
}

.invalid-block {
  background-color: #fff0f0;
  border: 1px dashed #f44336;
  border-radius: 8px;
  margin: 0.5rem 0;
}

.debug-info {
  background-color: #f5f5f5;
  border-radius: 4px;
  padding: 0.5rem;
  font-family: monospace;
  font-size: 0.75rem;
  white-space: pre-wrap;
  overflow-x: auto;
  max-height: 200px;
}
</style>
