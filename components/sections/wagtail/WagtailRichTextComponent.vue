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

<style>
.wagtail-richtext-component {
  margin: 0;
  font-family: var(--q-secondary-font-family, 'Roboto', sans-serif);
}

.rich-text-content {
  line-height: 1.8;
  color: #333;
  font-size: 1rem;
}

/* Encabezados */
.rich-text-content :deep(h1),
.rich-text-content :deep(h2),
.rich-text-content :deep(h3),
.rich-text-content :deep(h4),
.rich-text-content :deep(h5),
.rich-text-content :deep(h6) {
  margin-top: 1.5rem;
  margin-bottom: 1rem;
  font-family: var(--q-primary-font-family, 'Roboto', sans-serif);
  color: var(--q-primary-color, #1976d2);
  font-weight: 500;
  line-height: 1.3;
}

.rich-text-content :deep(h1) { font-size: 2rem; }
.rich-text-content :deep(h2) { font-size: 1.75rem; }
.rich-text-content :deep(h3) { font-size: 1.5rem; }
.rich-text-content :deep(h4) { font-size: 1.25rem; }
.rich-text-content :deep(h5) { font-size: 1.1rem; }
.rich-text-content :deep(h6) { font-size: 1rem; }

/* Párrafos y listas */
.rich-text-content :deep(p) {
  margin-bottom: 1.2rem;
  margin-top: 0;
}

.rich-text-content :deep(ul),
.rich-text-content :deep(ol) {
  margin-bottom: 1.2rem;
  padding-left: 2rem;
}

.rich-text-content :deep(li) {
  margin-bottom: 0.5rem;
  padding-left: 0.5rem;
}

/* Enlaces */
.rich-text-content :deep(a) {
  color: var(--q-primary-color, #1976d2);
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: border-color 0.2s ease, color 0.2s ease;
}

.rich-text-content :deep(a:hover) {
  border-bottom-color: currentColor;
}

/* Elementos especiales */
.rich-text-content :deep(blockquote) {
  border-left: 4px solid var(--q-primary-color, #1976d2);
  padding: 0.5rem 0 0.5rem 1.5rem;
  margin: 1.5rem 0 1.5rem 0;
  font-style: italic;
  color: #555;
  background-color: rgba(0, 0, 0, 0.03);
  border-radius: 0 4px 4px 0;
}

.rich-text-content :deep(hr) {
  border: none;
  border-top: 1px solid #e0e0e0;
  margin: 2rem 0;
}

/* Imágenes */
.rich-text-content :deep(img) {
  max-width: 100%;
  height: auto;
  margin: 1.5rem 0;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* Tablas */
.rich-text-content :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 1.5rem 0;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.rich-text-content :deep(th),
.rich-text-content :deep(td) {
  padding: 0.75rem;
  text-align: left;
  border: 1px solid #e0e0e0;
}

.rich-text-content :deep(th) {
  background-color: var(--q-primary-color, #1976d2);
  color: white;
  font-weight: 500;
}

.rich-text-content :deep(tr:nth-child(even)) {
  background-color: rgba(0, 0, 0, 0.03);
}

/* Código */
.rich-text-content :deep(code) {
  background-color: rgba(0, 0, 0, 0.05);
  padding: 0.2rem 0.4rem;
  border-radius: 3px;
  font-family: monospace;
  font-size: 0.9em;
}

.rich-text-content :deep(pre) {
  background-color: #f5f5f5;
  padding: 1rem;
  border-radius: 4px;
  overflow-x: auto;
  margin: 1.5rem 0;
}

.rich-text-content :deep(pre code) {
  background-color: transparent;
  padding: 0;
  border-radius: 0;
  font-size: 0.9em;
}

/* Responsive */
@media (max-width: 599px) {
  .rich-text-content :deep(h1) { font-size: 1.75rem; }
  .rich-text-content :deep(h2) { font-size: 1.5rem; }
  .rich-text-content :deep(h3) { font-size: 1.25rem; }
  .rich-text-content :deep(h4) { font-size: 1.1rem; }
  .rich-text-content :deep(h5), .rich-text-content :deep(h6) { font-size: 1rem; }
  
  .rich-text-content {
    font-size: 0.95rem;
  }
}
</style>
