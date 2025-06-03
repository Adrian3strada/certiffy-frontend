<template>
  <div class="q-my-xl q-mx-auto" :style="{ maxWidth: fullWidth ? '100%' : '800px', width: '100%' }">
    <q-img
      v-if="imageUrl"
      :src="imageUrl"
      :alt="imageAlt"
      :ratio="imageRatio"
      fit="contain"
      class="rounded-borders"
      spinner-color="primary"
      @error="handleImageError"
    >
      <template v-slot:error>
        <div class="bg-grey-2 flex flex-center column full-width" style="height: 300px; border-radius: 8px;">
          <q-icon name="image" size="3rem" color="grey-7" />
          <div class="q-mt-sm text-subtitle1 text-grey-7">{{ imageAlt || 'Imagen no disponible' }}</div>
        </div>
      </template>
    </q-img>
    <div v-if="showCaption && imageAlt" class="text-center q-mt-sm text-caption text-italic text-grey-8">
      {{ imageAlt }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  block: {
    type: Object,
    required: true
  },
  apiBaseUrl: {
    type: String,
    default: 'https://e412-2806-103e-1d-3687-f08f-4014-a8d6-4606.ngrok-free.app'
  },
  fullWidth: {
    type: Boolean,
    default: false
  },
  showCaption: {
    type: Boolean,
    default: false
  },
  imageRatio: {
    type: [Number, String],
    default: 16/9
  }
});

// Control de errores de carga de imagen
const imageError = ref(false);

// Maneja errores al cargar la imagen
const handleImageError = () => {
  imageError.value = true;
  console.error('Error al cargar la imagen:', props.block?.value?.url);
};

// Obtener la URL de la imagen
const imageUrl = computed(() => {
  if (!props.block || !props.block.value || !props.block.value.url) {
    return '';
  }
  
  const url = props.block.value.url;
  
  // Si es una URL absoluta, usar el proxy
  if (url.startsWith('http')) {
    return `/api/proxy-image?url=${encodeURIComponent(url)}`;
  }
  
  // Si es una ruta relativa a media de Wagtail
  if (url.startsWith('/media')) {
    return `/api/proxy-image?url=${encodeURIComponent(props.apiBaseUrl + url)}`;
  }
  
  // Cualquier otro caso, usar el proxy con la URL base
  return `/api/proxy-image?url=${encodeURIComponent(props.apiBaseUrl + url)}`;
});

// Texto alternativo de la imagen (para accesibilidad)
const imageAlt = computed(() => {
  return props.block?.value?.title || '';
});
</script>


