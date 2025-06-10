<template>
  <div class="q-pa-md q-mx-auto" style="max-width: 1200px;">
    <div class="text-center q-mb-lg" v-if="block.value && block.value.imagen_hover">
      <q-img
        class="rounded-borders overflow-hidden q-transition"
        :src="getImageUrl(block.value.imagen_hover.image)"
        spinner-color="primary"
        width="100%"
        height="400px"
        fit="cover"
      >
        <div class="absolute-full flex flex-center" :class="[colorClass, 'q-transition']" style="opacity: 0.85;" :style="{'&:hover': {opacity: 0.95}}">
          <div class="q-pa-lg" style="max-width: 80%;">
            <div class="text-white text-center text-weight-bold" style="font-size: 1.5rem; line-height: 1.4; text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);">
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
import { useRuntimeConfig } from '#app'; // Import useRuntimeConfig

const props = defineProps({
  block: {
    type: Object,
    required: true
  },
  apiBaseUrl: {
    type: String,
    default: () => useRuntimeConfig().public.apiBase // Use factory function for default
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


