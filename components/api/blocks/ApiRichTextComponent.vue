<template>
  <section :id="'rich-text-' + (id || Math.random().toString(36).substring(2, 9))" class="q-my-md q-px-sm rich-text-container">
    <div 
      v-if="content" 
      class="certiffy-text rich-text-content text-left"
      v-html="processedContent"
    ></div>
    <div v-else class="text-left q-pa-md text-grey-7 certiffy-text-sm">
      No hay contenido disponible
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  id: {
    type: String,
    default: ''
  },
  block: {
    type: Object,
    required: true
  }
});

// Obtener el contenido HTML del bloque
const content = computed(() => {
  if (!props.block || !props.block.value) {
    return '';
  }
  
  // Si el valor es una cadena, asumimos que es HTML
  if (typeof props.block.value === 'string') {
    return props.block.value;
  }
  
  // Si el valor es un objeto, buscamos una propiedad que pueda contener HTML
  if (typeof props.block.value === 'object') {
    // Caso especial para parrafo_con_alineacion
    if (props.block.type === 'parrafo_con_alineacion' && props.block.value.texto) {
      return props.block.value.texto;
    }
    
    // Buscar en propiedades comunes donde podría estar el contenido
    const possibleContentProps = ['content', 'text', 'texto', 'html', 'value'];
    
    for (const prop of possibleContentProps) {
      if (props.block.value[prop]) {
        return props.block.value[prop];
      }
    }
  }
  
  return '';
});

// Determinar la clase de alineación de texto
const textAlignmentClass = computed(() => {
  // Verificar si es un bloque de párrafo con alineación
  if (props.block.type === 'parrafo_con_alineacion' && 
      props.block.value && 
      props.block.value.alineacion) {
    
    // Mapear la alineación a clases de Quasar
    const alignment = props.block.value.alineacion.toLowerCase();
    switch (alignment) {
      case 'left':
        return 'text-left';
      case 'center':
        return 'text-center';
      case 'right':
        return 'text-right';
      case 'justify':
        return 'text-justify';
      default:
        return ''; // Sin clase adicional si no coincide
    }
  }
  
  return ''; // Sin clase adicional por defecto
});

// Procesar el contenido para aplicar las clases estandarizadas de rich-text.css
const processedContent = computed(() => {
  if (!content.value) return '';
  
  // Simplemente devolvemos el contenido sin modificaciones
  // ya que los estilos se aplicarán a través de CSS en rich-text.css
  return content.value;
});
</script>
