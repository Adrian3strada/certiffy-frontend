<template>
  <section 
    :id="'image-component-' + (id || Math.random().toString(36).substring(2, 9))" 
    class="q-my-md certiffy-image-container"
    :class="fullWidth ? 'certiffy-image-fullwidth' : 'certiffy-image-standard'"
  >
    <q-img
      v-if="imageUrl"
      :src="imageUrl"
      :alt="imageAlt"
      :ratio="imageRatio"
      fit="contain"
      class="certiffy-image"
      spinner-color="primary"
      @error="handleImageError"
    >
      <template v-slot:error>
        <div class="certiffy-image-error">
          <q-icon name="image" size="3rem" color="grey-7" />
          <div class="q-mt-sm certiffy-text-sm">{{ imageAlt || 'Imagen no disponible' }}</div>
        </div>
      </template>
    </q-img>
    <div v-if="showCaption && imageAlt" class="certiffy-image-caption">
      {{ imageAlt }}
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  id: {
    type: String,
    default: ''
  },
  block: {
    type: Object,
    required: true
  },
  apiBaseUrl: {
    type: String,
    default: ''
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
  // console.error('Error al cargar la imagen:', props.block?.value?.url);
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


