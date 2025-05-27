<template>
  <!-- Para ApiVideoComponent que espera 'blocks' en lugar de 'block' -->
  <ApiVideoComponent 
    v-if="block && block.type && (block.type === 'carousel' || block.type === 'video')"
    :blocks="[block]"
    :api-base-url="apiBaseUrl"
    :title="blockTitle"
  />
  
  <!-- Para otros componentes que esperan 'block' singular -->
  <component 
    v-else-if="block && block.type && componentExists(block.type)"
    :is="getComponentForBlockType(block.type)" 
    :block="block"
    :api-base-url="apiBaseUrl"
  />
  
  <!-- Modo depuración para ver la estructura del bloque -->
  <pre v-else-if="debugMode && block">{{ JSON.stringify(block, null, 2) }}</pre>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useComponentRegistry } from '~/composables/useComponentRegistry';

// Importar los componentes conocidos
import ApiVideoComponent from './ApiVideoComponent.vue';
import ApiCardComponent from './ApiCardComponent.vue';
import ApiTestimonialsComponent from './ApiTestimonialsComponent.vue';
import ApiModulosVideoComponent from './ApiModulosVideoComponent.vue';
import ApiPactoVerdeComponent from './ApiPactoVerdeComponent.vue';
import ApiCardsEDComponent from './ApiCardsEDComponent.vue';
import ApiMisionComponent from './ApiMisionComponent.vue';

// Obtener el registro de componentes
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
  debugMode: {
    type: Boolean,
    default: false
  }
});

// Extraer el título del bloque si existe
const blockTitle = computed(() => {
  if (props.block && props.block.value) {
    // Intentar extraer el título del valor del bloque
    if (props.block.value.title) {
      return props.block.value.title;
    }
    // Algunos bloques tienen título en singular
    if (props.block.value.titulo) {
      return props.block.value.titulo;
    }
  }
  return '';  // Valor por defecto si no hay título
});

// Registrar los componentes conocidos
onMounted(() => {
  // Establecer un fallback para componentes no encontrados
  setFallbackComponent('div');
  
  // Registrar todos los componentes conocidos
  registerComponents({
    'carousel': ApiVideoComponent,
    'video': ApiVideoComponent,
    'cards': ApiCardComponent,
    'testimonios': ApiTestimonialsComponent,
    'modulo_certiffy': ApiModulosVideoComponent,
    'pacto_verde': ApiPactoVerdeComponent,
    'cardsED': ApiCardsEDComponent,
    'mision': ApiMisionComponent,
    // Puedes agregar más componentes aquí sin modificar el código
  });
});

// Verificar si existe un componente para el tipo de bloque
const componentExists = (blockType) => {
  return blockType && hasComponentForType(blockType);
};

// Obtener el componente correcto para el tipo de bloque
const getComponentForBlockType = (blockType) => {
  if (!blockType) return 'div';
  return getComponentForType(blockType);
};

// Auto-detectar nuevos componentes
const detectNewComponent = (blockType) => {
  if (!blockType || componentExists(blockType)) return;
  
  // Intenta importar dinámicamente el componente basado en una convención de nombres
  try {
    // Convertir snake_case o kebab-case a PascalCase
    const pascalCaseType = blockType.toLowerCase()
      .replace(/[-_]([a-z])/g, (_, letter) => letter.toUpperCase());
      
    const componentName = `Api${pascalCaseType.charAt(0).toUpperCase()}${pascalCaseType.slice(1)}Component`;
    console.log(`Detectando nuevo componente: ${componentName} para tipo: ${blockType}`);
    
    // En un entorno real podrías usar import dinámico:
    // const component = await import(`./${componentName}.vue`);
    // registerComponent(blockType, component.default);
  } catch (error) {
    console.warn(`No se pudo cargar dinámicamente el componente para: ${blockType}`, error);
  }
};
</script>
