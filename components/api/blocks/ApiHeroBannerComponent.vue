<template>
  <div class="api-hero-banner-container">
    <!-- Hero banner dinámico con imagen y superposición de texto -->
    <div 
      class="hero-banner" 
      :style="{ backgroundImage: imagenUrl ? `url(${imagenUrl})` : '' }"
      :class="{ 'compact': compact }"
    >
      <div class="hero-overlay" :class="{ 'overlay-light': lightOverlay }"></div>
      <div class="hero-content">
        <div class="hero-inner">
          <div class="hero-text-container hero-text-centered">
              <h1 class="hero-title" v-if="block?.value?.imagen?.title">
                {{ block.value.imagen.title }}
              </h1>
              <div class="hero-text" v-if="block?.value?.texto">
                <p>{{ block.value.texto }}</p>
              </div>
              <div class="hero-actions" v-if="showAction">
                <q-btn 
                  color="primary" 
                  class="q-py-sm q-px-md" 
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

<style scoped>
.api-hero-banner-container {
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

.hero-banner {
  position: relative;
  width: 100%;
  height: 400px;
  overflow: hidden;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  border-radius: 0;
  margin: 0;
}

.hero-banner.compact {
  height: 300px;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 2;
}

.hero-overlay.overlay-light {
  background-color: rgba(0, 0, 0, 0.2);
}

.hero-content {
  position: relative;
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: white;
  padding: 0 2rem;
}

.hero-inner {
  width: 100%;
  display: flex;
  justify-content: center;
}

.hero-text-container {
  max-width: 600px;
}

.hero-text-centered {
  text-align: center;
}

.hero-title {
  font-size: 2.5rem;
  font-weight: bold;
  margin: 0 0 1rem 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  color: #ffffff;
}

.hero-text {
  margin-bottom: 1.5rem;
}

.hero-text p {
  font-size: 1.2rem;
  line-height: 1.5;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
  margin: 0;
  color: #ffffff;
}

.hero-actions {
  margin-top: 1.5rem;
}

/* Responsive styles */
@media (max-width: 767px) {
  .hero-banner {
    height: 350px;
  }
  
  .hero-title {
    font-size: 2rem;
  }
  
  .hero-text p {
    font-size: 1.1rem;
  }
}

@media (max-width: 480px) {
  .hero-banner {
    height: 300px;
  }
  
  .hero-title {
    font-size: 1.8rem;
  }
  
  .hero-text p {
    font-size: 1rem;
  }
}
</style>