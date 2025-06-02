<template>
  <div class="api-rich-text-component">
    <div v-if="content" class="rich-text-content" v-html="content"></div>
    <div v-else class="text-center q-pa-md text-grey-7">
      No hay contenido disponible
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
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
    // Buscar en propiedades comunes donde podría estar el contenido
    const possibleContentProps = ['content', 'text', 'html', 'value'];
    
    for (const prop of possibleContentProps) {
      if (props.block.value[prop]) {
        return props.block.value[prop];
      }
    }
  }
  
  return '';
});
</script>

<style scoped>
.api-rich-text-component {
  margin: 2rem auto;
  max-width: 800px;
  width: 100%;
  padding: 0 1rem;
  overflow-wrap: break-word;
  word-wrap: break-word;
  word-break: break-word;
  hyphens: auto;
}

.rich-text-content {
  color: #333;
  line-height: 1.7;
  max-width: 100%;
  overflow-wrap: break-word;
  word-wrap: break-word;
  word-break: break-word;
}

.rich-text-content h1, 
.rich-text-content h2, 
.rich-text-content h3, 
.rich-text-content h4, 
.rich-text-content h5, 
.rich-text-content h6 {
  color: #005c5c;
  margin-top: 1.5rem;
  margin-bottom: 1rem;
  font-weight: 600;
  max-width: 100%;
  overflow-wrap: break-word;
  word-wrap: break-word;
  word-break: break-word;
}

.rich-text-content p {
  margin-bottom: 1rem;
  overflow-wrap: break-word;
  word-wrap: break-word;
  word-break: break-word;
  max-width: 100%;
}

.rich-text-content ul, 
.rich-text-content ol {
  margin-left: 1.5rem;
  margin-bottom: 1.5rem;
}

.rich-text-content a {
  color: #0066cc;
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: border-color 0.3s ease;
}

.rich-text-content a:hover {
  border-bottom-color: #0066cc;
}

.rich-text-content img {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin: 1rem 0;
  display: block;
}

.rich-text-content blockquote {
  border-left: 4px solid #005c5c;
  padding-left: 1rem;
  margin-left: 0;
  color: #555;
  font-style: italic;
}
/* Media queries adicionales para asegurar texto contenido en pantallas pequeñas */
@media (max-width: 640px) {
  .api-rich-text-component {
    padding: 0 0.75rem;
  }

  .rich-text-content h1 {
    font-size: 1.75rem;
  }

  .rich-text-content h2 {
    font-size: 1.5rem;
  }

  .rich-text-content h3 {
    font-size: 1.25rem;
  }

  .rich-text-content h4 {
    font-size: 1.1rem;
  }
}
</style>
