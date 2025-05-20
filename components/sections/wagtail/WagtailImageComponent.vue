<template>
  <div class="wagtail-image-component">
    <figure class="image-container">
      <img 
        v-if="imageUrl" 
        :src="imageUrl" 
        :alt="imageAlt" 
        class="wagtail-image"
        :style="imageStyle"
      />
      <div v-else class="image-placeholder">
        <q-icon name="mdi-image" size="3rem" color="grey-7" />
        <div class="q-mt-sm">Imagen no disponible</div>
      </div>
      <figcaption v-if="imageCaption" class="image-caption">
        {{ imageCaption }}
      </figcaption>
    </figure>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  content: {
    type: Object,
    default: () => ({
      url: 'https://via.placeholder.com/800x400',
      alt: 'Imagen de ejemplo',
      caption: 'Esta es una imagen de ejemplo',
      id: 'image-sample',
      width: null,
      height: null
    })
  },
  isPreview: {
    type: Boolean,
    default: false
  }
});

// URL de la imagen
const imageUrl = computed(() => {
  // Manejar diferentes estructuras de datos posibles
  if (props.content.url) {
    return props.content.url;
  }
  
  if (props.content.image && props.content.image.url) {
    return props.content.image.url;
  }
  
  if (props.content.value && props.content.value.url) {
    return props.content.value.url;
  }
  
  return null;
});

// Texto alternativo de la imagen
const imageAlt = computed(() => {
  if (props.content.alt) {
    return props.content.alt;
  }
  
  if (props.content.image && props.content.image.alt) {
    return props.content.image.alt;
  }
  
  if (props.content.value && props.content.value.alt) {
    return props.content.value.alt;
  }
  
  return 'Imagen';
});

// Leyenda de la imagen
const imageCaption = computed(() => {
  if (props.content.caption) {
    return props.content.caption;
  }
  
  if (props.content.image && props.content.image.caption) {
    return props.content.image.caption;
  }
  
  if (props.content.value && props.content.value.caption) {
    return props.content.value.caption;
  }
  
  return null;
});

// Estilo de la imagen basado en dimensiones
const imageStyle = computed(() => {
  const style = {};
  
  // Obtener dimensiones de diferentes fuentes posibles
  const width = props.content.width || 
                (props.content.image && props.content.image.width) || 
                (props.content.value && props.content.value.width);
  
  const height = props.content.height || 
                 (props.content.image && props.content.image.height) || 
                 (props.content.value && props.content.value.height);
  
  // Aplicar dimensiones si están disponibles
  if (width) {
    style.maxWidth = `${width}px`;
  }
  
  if (height) {
    style.maxHeight = `${height}px`;
  }
  
  return style;
});
</script>

<style scoped>
.wagtail-image-component {
  margin: 1.5rem 0;
}

.image-container {
  margin: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.wagtail-image {
  max-width: 100%;
  height: auto;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.image-caption {
  margin-top: 0.75rem;
  text-align: center;
  font-style: italic;
  color: #666;
  font-size: 0.9rem;
  max-width: 90%;
}

.image-placeholder {
  width: 100%;
  height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f0f0f0;
  border-radius: 4px;
  color: #666;
}
</style>
