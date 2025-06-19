<template>
  <div class="q-pa-md q-mx-auto" style="max-width: 1200px;">
    <q-card 
      v-if="block.value && block.value.imagen_hover" 
      flat 
      class="text-center q-mb-lg bg-transparent shadow-none"
      bordered
    >
      <q-img
        class="rounded-borders overflow-hidden transition-opacity"
        :src="getImageUrl(block.value.imagen_hover.image)"
        spinner-color="primary"
        spinner-size="3em"
        width="100%"
        height="400px"
        fit="cover"
      >
        <template v-slot:loading>
          <div class="flex flex-center absolute-full">
            <q-spinner size="3em" color="primary" />
          </div>
        </template>
        <template v-slot:error>
          <div class="flex flex-center absolute-full bg-grey-3">
            <div class="text-negative">
              <q-icon name="error" size="2rem" />
              <div>Error al cargar la imagen</div>
            </div>
          </div>
        </template>

        <div 
          class="absolute-full flex flex-center transition-opacity" 
          :class="[colorClass]"
          style="opacity: 0.85;"
        >
          <div class="q-pa-lg" style="max-width: 80%;">
            <q-card-section class="q-pa-none">
              <div class="text-white text-center text-weight-bold text-h4 text-shadow-1">
                {{ block.value.imagen_hover.texto_overlay }}
              </div>
            </q-card-section>
          </div>
        </div>
      </q-img>
    </q-card>
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


