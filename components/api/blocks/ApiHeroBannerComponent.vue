<template>
  <section :id="'hero-banner-' + (id || Math.random().toString(36).substring(2, 9))" class="hero-container">
    <!-- Hero banner dinámico con imagen y superposición de texto -->
    <div 
      class="relative overflow-hidden bg-center bg-cover"
      :style="{
        backgroundImage: imagenUrl ? `url(${imagenUrl})` : '',
        height: compact ? '300px' : '400px'
      }"
    >
      <div 
        class="absolute-full z-2"
        :class="lightOverlay ? 'bg-black-2' : 'bg-black-4'"
      ></div>
      <div class="absolute-full z-3 flex q-px-sm">
        <div style="max-width: 600px; text-align: left;">
          <h1 
            class="text-h3 text-white text-weight-900 q-mb-md text-shadow"
            v-if="block?.value?.imagen?.title"
          >
            {{ block.value.imagen.title }}
          </h1>
          <div class="q-mb-lg" v-if="block?.value?.texto">
            <p class="text-body1 text-white text-shadow">
              {{ block.value.texto }}
            </p>
          </div>
          <div class="q-mt-lg" v-if="showAction">
            <q-btn 
              color="primary" 
              class="q-px-md q-py-sm q-transition" 
              size="lg" 
              no-caps
              :to="actionLink"
              :label="actionLabel || 'Saber más'"
              :flat="actionFlat"
              :outline="actionOutline"
              :ripple="{early: true}"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue';
import { useRuntimeConfig } from '#app';

// Props para el componente
const props = defineProps({
  id: {
    type: String,
    default: ''
  },
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
      const runtimeConfig = useRuntimeConfig();
      return `/api/proxy-image?url=${encodeURIComponent(runtimeConfig.public.apiBase + imagen.url)}`;
    } else if (imagen.url.startsWith('http')) {
      return `/api/proxy-image?url=${encodeURIComponent(imagen.url)}`;
    } else {
      const runtimeConfig = useRuntimeConfig(); 
      return `/api/proxy-image?url=${encodeURIComponent(runtimeConfig.public.apiBase + '/' + imagen.url)}`;
    }
  }
  
  return null;
});
</script>

<style>
/* Estilos mínimos necesarios que no se pueden lograr con Quasar */
.hero-container {
  width: 100vw;
  position: relative;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
  margin-top: -24px;
  padding: 0;
  overflow-x: hidden;
}

.text-shadow {
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
}

/* Estilos responsivos */
@media (max-width: 767px) {
  .text-h3 {
    font-size: 1.8rem !important;
  }
}
</style>