<template>
  <div class="wagtail-richtext-component">
    <div class="rich-text-content" v-html="content"></div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  content: {
    type: Object,
    default: () => ({
      content: '<p>Este es un texto de ejemplo para mostrar cómo se vería un bloque de texto enriquecido.</p>',
      id: 'richtext-sample'
    })
  },
  isPreview: {
    type: Boolean,
    default: false
  }
});

// Contenido HTML del texto enriquecido
const content = computed(() => {
  // Si el contenido es un string, asumimos que es HTML directamente
  if (typeof props.content.content === 'string') {
    return props.content.content;
  }
  
  // Si el contenido es un objeto con una propiedad value, usamos eso
  if (props.content.content && props.content.content.value) {
    return props.content.content.value;
  }
  
  // Fallback para compatibilidad con la API
  if (typeof props.content.value === 'string') {
    return props.content.value;
  }
  
  return '<p>No hay contenido disponible</p>';
});
</script>

<style scoped>
.wagtail-richtext-component {
  margin: 1rem 0;
  font-family: var(--q-secondary-font-family, sans-serif);
}

.rich-text-content {
  line-height: 1.6;
}

.rich-text-content :deep(h1),
.rich-text-content :deep(h2),
.rich-text-content :deep(h3),
.rich-text-content :deep(h4),
.rich-text-content :deep(h5),
.rich-text-content :deep(h6) {
  margin-top: 1.5rem;
  margin-bottom: 1rem;
  font-family: var(--q-primary-font-family);
  color: var(--q-primary-color, #1976d2);
}

.rich-text-content :deep(p) {
  margin-bottom: 1rem;
}

.rich-text-content :deep(ul),
.rich-text-content :deep(ol) {
  margin-bottom: 1rem;
  padding-left: 2rem;
}

.rich-text-content :deep(li) {
  margin-bottom: 0.5rem;
}

.rich-text-content :deep(a) {
  color: var(--q-primary-color, #1976d2);
  text-decoration: none;
}

.rich-text-content :deep(a:hover) {
  text-decoration: underline;
}

.rich-text-content :deep(blockquote) {
  border-left: 4px solid var(--q-primary-color, #1976d2);
  padding-left: 1rem;
  margin-left: 0;
  margin-right: 0;
  font-style: italic;
  color: #666;
}

.rich-text-content :deep(hr) {
  border: none;
  border-top: 1px solid #e0e0e0;
  margin: 2rem 0;
}

.rich-text-content :deep(img) {
  max-width: 100%;
  height: auto;
  margin: 1rem 0;
}
</style>
