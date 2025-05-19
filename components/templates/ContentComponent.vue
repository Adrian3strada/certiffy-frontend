<template>
  <div class="content-component" :class="{ 'preview-mode': isPreview }">
    <div class="container">
      <h2 v-if="content.title" class="q-mt-md q-mb-lg">{{ content.title }}</h2>
      
      <div class="row" :class="imagePositionClass">
        <div class="col-12 col-md-6 content-text">
          <div v-html="content.text || '<p>Contenido de ejemplo</p>'"></div>
        </div>
        
        <div v-if="content.image" class="col-12 col-md-6 content-image">
          <img :src="content.image" alt="Imagen de contenido" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  content: {
    type: Object,
    default: () => ({
      title: 'Título del Contenido',
      text: '<p>Contenido de ejemplo</p>',
      image: null,
      imagePosition: 'right'
    })
  },
  isPreview: {
    type: Boolean,
    default: false
  }
});

// Determinar la clase CSS según la posición de la imagen
const imagePositionClass = computed(() => {
  switch (props.content.imagePosition) {
    case 'left':
      return 'flex-row-reverse';
    case 'right':
      return '';
    case 'top':
      return 'flex-column-reverse';
    case 'bottom':
      return 'flex-column';
    default:
      return '';
  }
});
</script>

<style scoped>
.content-component {
  padding: 2rem 0;
}

.preview-mode {
  cursor: default;
}

.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 15px;
}

.content-text {
  padding: 1rem;
}

.content-image {
  padding: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.content-image img {
  max-width: 100%;
  height: auto;
  border-radius: 4px;
}

/* Clases para posiciones de imagen */
.flex-row-reverse {
  flex-direction: row-reverse;
}

.flex-column {
  flex-direction: column;
}

.flex-column-reverse {
  flex-direction: column-reverse;
}

@media (max-width: 767px) {
  .row {
    flex-direction: column !important;
  }
}
</style>
