<template>
  <div style="width: 100vw; position: relative; left: 50%; right: 50%; margin-left: -50vw; margin-right: -50vw; margin-top: -24px; padding: 0; overflow-x: hidden;">
    <!-- Hero banner dinámico con imagen y superposición de texto -->
    <div 
      class="relative-position overflow-hidden" 
      :style="{ 
        backgroundImage: imagenUrl ? `url(${imagenUrl})` : '',
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        height: compact ? '300px' : '400px',
        width: '100%',
      }"
    >
      <div 
        class="absolute-full" 
        :style="{ 
          backgroundColor: lightOverlay ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.4)', 
          zIndex: 2 
        }"
      ></div>
      <div class="absolute-full flex flex-center" style="z-index: 3; padding: 0 2rem;">
        <div class="flex justify-center full-width">
          <div class="text-center" style="max-width: 600px;">
              <h1 
                class="text-white text-weight-bold q-ma-none q-mb-md text-h3" 
                style="text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);" 
                v-if="block?.value?.imagen?.title"
              >
                {{ block.value.imagen.title }}
              </h1>
              <div class="q-mb-lg" v-if="block?.value?.texto">
                <p class="text-white text-body1 q-ma-none" style="line-height: 1.5; text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);">
                  {{ block.value.texto }}
                </p>
              </div>
              <div class="q-mt-md" v-if="showAction">
                <q-btn 
                  color="primary" 
                  class="q-py-sm q-px-md q-transition" 
                  :class="{'q-hoverable': true}"
                  size="lg" 
                  no-caps
                  :to="actionLink"
                  :label="actionLabel || 'Saber más'"
                  :flat="actionFlat"
                  :outline="actionOutline"
                />
              </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { API_BASE_URL } from '~/composables/useWagtailApi';

// Props para el componente
const props = defineProps({
  block: {
    type: Object,
    required: true
  },
  compact: {
    type: Boolean,
    default: false
  },
  lightOverlay: {
    type: Boolean,
    default: false
  },
  showAction: {
    type: Boolean,
    default: false
  },
  actionLink: {
    type: String,
    default: '/'
  },
  actionLabel: {
    type: String,
    default: ''
  },
  actionFlat: {
    type: Boolean,
    default: false
  },
  actionOutline: {
    type: Boolean,
    default: false
  }
});

// URL de la imagen para el hero banner
const imagenUrl = computed(() => {
  const imagen = props.block?.value?.imagen;
  if (!imagen) return null;
  
  if (imagen.url) {
    // Siempre usar el proxy para evitar problemas de CORS
    // Si es una URL relativa (/media/...), añadir la URL base
    if (imagen.url.startsWith('/')) {
      return `/api/proxy-image?url=${encodeURIComponent(API_BASE_URL + imagen.url)}`;
    } else if (imagen.url.startsWith('http')) {
      return `/api/proxy-image?url=${encodeURIComponent(imagen.url)}`;
    } else {
      return `/api/proxy-image?url=${encodeURIComponent(API_BASE_URL + '/' + imagen.url)}`;
    }
  }
  
  return null;
});
</script>