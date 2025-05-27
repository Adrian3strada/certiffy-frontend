<template>
  <div class="api-mision-component q-pa-md">
    <div class="text-center q-mb-lg" v-if="block.value && block.value.imagen_hover">
      <q-img
        class="hover-image"
        :src="getImageUrl(block.value.imagen_hover.image)"
        spinner-color="primary"
        width="100%"
        height="400px"
        fit="cover"
      >
        <div class="imagen-hover-overlay" :class="colorClass">
          <div class="text-container q-pa-lg">
            <div class="texto-overlay text-white text-center">
              {{ block.value.imagen_hover.texto_overlay }}
            </div>
          </div>
        </div>
      </q-img>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { API_BASE_URL } from '~/composables/useWagtailApi';

const props = defineProps({
  block: {
    type: Object,
    required: true
  },
  apiBaseUrl: {
    type: String,
    default: API_BASE_URL
  }
});

// Función para obtener la URL completa de la imagen
const getImageUrl = (image) => {
  if (!image || !image.url) return '';
  
  // Si la URL ya es absoluta, la usamos directamente
  if (image.url.startsWith('http')) {
    return image.url;
  }
  
  // Si no, utilizamos el proxy de imágenes para evitar problemas de CORS
  return `/api/proxy-image?url=${encodeURIComponent(`${props.apiBaseUrl}${image.url}`)}`;
};

// Calcular la clase de color basada en el valor del bloque
const colorClass = computed(() => {
  if (!props.block.value || !props.block.value.imagen_hover) return 'bg-primary';
  
  const color = props.block.value.imagen_hover.color_overlay || 'primary';
  
  // Mapa de colores de la API a clases de Quasar
  const colorMap = {
    'primary': 'bg-primary',
    'secondary': 'bg-secondary',
    'negative': 'bg-negative',
    'dark': 'bg-dark'
  };
  
  return colorMap[color] || 'bg-primary';
});
</script>

<style scoped>
.api-mision-component {
  max-width: 1200px;
  margin: 0 auto;
}

.hover-image {
  border-radius: 8px;
  overflow: hidden;
  position: relative;
}

.imagen-hover-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.85;
  transition: opacity 0.3s ease;
}

.imagen-hover-overlay:hover {
  opacity: 0.95;
}

.text-container {
  max-width: 80%;
}

.texto-overlay {
  font-size: 1.5rem;
  font-weight: bold;
  line-height: 1.4;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}

@media (max-width: 768px) {
  .texto-overlay {
    font-size: 1.2rem;
  }
}
</style>
