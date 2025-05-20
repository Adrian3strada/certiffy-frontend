<template>
  <div class="wagtail-heading-component">
    <component 
      :is="`h${level}`" 
      class="wagtail-heading"
      :class="headingClasses"
    >
      {{ text }}
    </component>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useWagtailApi } from '~/composables/useWagtailApi';

const props = defineProps({
  content: {
    type: Object,
    default: () => ({
      level: 2,
      text: 'Título de ejemplo',
      id: 'heading-sample'
    })
  },
  isPreview: {
    type: Boolean,
    default: false
  }
});

// Nivel del encabezado (h1, h2, h3, etc.)
const level = computed(() => {
  const lvl = parseInt(props.content.level);
  return lvl >= 1 && lvl <= 6 ? lvl : 2;
});

// Texto del encabezado
const text = computed(() => props.content.text || 'Título de ejemplo');

// Clases adicionales para el encabezado
const headingClasses = computed(() => ({
  'text-h1': level.value === 1,
  'text-h2': level.value === 2,
  'text-h3': level.value === 3,
  'text-h4': level.value === 4,
  'text-h5': level.value === 5,
  'text-h6': level.value === 6,
}));
</script>

<style scoped>
.wagtail-heading-component {
  margin: 1rem 0;
}

.wagtail-heading {
  font-family: var(--q-primary-font-family);
  color: var(--q-primary-color, #1976d2);
  margin-top: 0;
}
</style>
