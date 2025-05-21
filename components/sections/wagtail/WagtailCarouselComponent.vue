<template>
  <div class="wagtail-carousel-component">
    <q-card flat bordered class="carousel-card">
      <q-card-section class="q-pa-none">
        <q-carousel
          v-model="slide"
          animated
          arrows
          navigation
          infinite
          swipeable
          control-color="primary"
          control-text-color="white"
          navigation-icon="circle"
          padding
          height="400px"
          class="carousel bg-grey-1"
          :autoplay="autoplay"
          @mouseenter="autoplay = false"
          @mouseleave="autoplay = 3000"
        >
          <!-- Placeholder cuando no hay imágenes -->
          <q-carousel-slide v-if="!carouselImages || carouselImages.length === 0" name="placeholder" class="column no-wrap">
            <div class="carousel-item">
              <div class="carousel-placeholder">
                <div class="placeholder-content">
                  <q-icon name="photo_library" size="3rem" color="grey-7" />
                  <div class="q-mt-sm text-subtitle1">Galería de imágenes</div>
                  <div class="q-mt-xs text-caption text-grey-7">
                    No hay imágenes disponibles en este momento.
                  </div>
                </div>
              </div>
            </div>
          </q-carousel-slide>
          
          <!-- Slides para cada imagen disponible -->
          <q-carousel-slide 
            v-for="(image, index) in carouselImages" 
            :key="image.id || index"
            :name="index"
            class="column no-wrap"
          >
            <div class="carousel-item">
              <!-- Si tenemos una URL de imagen real -->
              <template v-if="image.url">
                <div class="image-wrapper">
                  <img 
                    :src="image.url" 
                    :alt="image.alt || `Imagen ${index + 1}`" 
                    class="carousel-image"
                  />
                  <div v-if="image.alt || image.caption" class="image-caption">
                    {{ image.caption || image.alt }}
                  </div>
                </div>
              </template>
              
              <!-- Si solo tenemos un ID o valor de imagen -->
              <div v-else class="carousel-placeholder">
                <div class="placeholder-content">
                  <q-icon name="image" size="3rem" color="grey-7" />
                  <div class="q-mt-sm text-subtitle1">Imagen {{ index + 1 }}</div>
                  <div class="q-mt-xs text-caption text-grey-7">
                    ID: {{ image.id || 'N/A' }}
                    <br>
                    Valor: {{ image.value || 'N/A' }}
                  </div>
                </div>
              </div>
            </div>
          </q-carousel-slide>
          
          <!-- Controles adicionales -->
          <template v-slot:control-nav>
            <div class="carousel-controls q-gutter-xs">
              <q-btn
                round
                dense
                flat
                color="white"
                text-color="primary"
                :icon="autoplay ? 'pause_circle' : 'play_circle'"
                @click="autoplay = autoplay ? false : 3000"
              />
              <q-btn
                round
                dense
                flat
                color="white"
                text-color="primary"
                icon="fullscreen"
                @click="openLightbox = true"
              />
            </div>
          </template>
        </q-carousel>
      </q-card-section>
      
      <!-- Miniaturas (opcional) -->
      <q-card-section v-if="carouselImages.length > 1" class="thumbnails-section q-pt-md">
        <div class="thumbnails-row">
          <div 
            v-for="(image, index) in carouselImages.slice(0, 5)" 
            :key="index"
            class="thumbnail"
            :class="{ 'active': slide === index }"
            @click="slide = index"
          >
            <img 
              v-if="image.url"
              :src="image.url" 
              :alt="`Miniatura ${index + 1}`" 
            />
            <div v-else class="thumbnail-placeholder">
              <q-icon name="image" size="1.2rem" color="grey-7" />
            </div>
          </div>
          <div v-if="carouselImages.length > 5" class="more-indicator">
            +{{ carouselImages.length - 5 }}
          </div>
        </div>
      </q-card-section>
    </q-card>
    
    <!-- Lightbox para vista ampliada -->
    <q-dialog v-model="openLightbox" maximized transition-show="fade" transition-hide="fade">
      <q-card class="lightbox-card">
        <q-bar class="bg-primary text-white">
          <div>Vista ampliada</div>
          <q-space />
          <q-btn dense flat icon="close" v-close-popup />
        </q-bar>
        
        <q-card-section class="column items-center justify-center lightbox-content">
          <q-carousel
            v-model="lightboxSlide"
            animated
            arrows
            navigation
            infinite
            swipeable
            control-color="primary"
            control-text-color="white"
            navigation-icon="circle"
            padding
            height="80vh"
            class="lightbox-carousel"
          >
            <q-carousel-slide 
              v-for="(image, index) in carouselImages" 
              :key="image.id || index"
              :name="index"
              class="column no-wrap flex-center"
            >
              <div class="lightbox-item">
                <img 
                  v-if="image.url"
                  :src="image.url" 
                  :alt="image.alt || `Imagen ${index + 1}`" 
                  class="lightbox-image"
                />
                <div v-if="image.alt || image.caption" class="lightbox-caption">
                  {{ image.caption || image.alt }}
                </div>
              </div>
            </q-carousel-slide>
          </q-carousel>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
  content: {
    type: Object,
    required: true
  }
});

const slide = ref(0);
const lightboxSlide = ref(0);
const autoplay = ref(3000); // Autoplay de 3 segundos
const openLightbox = ref(false);
    
// Sincronizar el slide del lightbox con el carrusel principal
watch(slide, (newValue) => {
  lightboxSlide.value = newValue;
});

watch(lightboxSlide, (newValue) => {
  slide.value = newValue;
});

// Procesar las imágenes del carrusel desde el contenido
const carouselImages = computed(() => {
  if (!props.content) {
    return [];
  }
  
  // Si content.images existe y es un array
  if (props.content.images && Array.isArray(props.content.images)) {
    return props.content.images.map(img => ({
      id: img.id || Math.random().toString(36).substring(2, 10),
      url: img.url || null,
      alt: img.alt || '',
      caption: img.caption || '',
      value: img.value || null
    }));
  }
  
  // Si content.value existe y es un array (formato de la API)
  if (props.content.value && Array.isArray(props.content.value)) {
    return props.content.value.map((item, index) => {
      if (item && typeof item === 'object' && item.url) {
        return {
          id: item.id || index,
          url: item.url,
          alt: item.alt || '',
          caption: item.caption || '',
          value: item.value || null
        };
      }
      
      return {
        id: typeof item === 'object' ? item.id : index,
        url: null,
        alt: '',
        caption: '',
        value: typeof item === 'object' ? item.value : item
      };
    });
  }
  
  // Si content es un array directamente
  if (Array.isArray(props.content)) {
    return props.content.map((item, index) => ({
      id: item.id || index,
      url: item.url || null,
      alt: item.alt || '',
      caption: item.caption || '',
      value: item.value || null
    }));
  }
  
  // Si no hay imágenes, devolver un array vacío
  return [];
});

// Generar imágenes de ejemplo si no hay ninguna (para desarrollo)
const ensureImages = () => {
  if (carouselImages.value.length === 0) {
    // Crear algunas imágenes de ejemplo para desarrollo
    return [
      {
        id: 1,
        url: 'https://picsum.photos/id/1018/800/400',
        alt: 'Imagen de montaña',
        caption: 'Hermoso paisaje de montaña'
      },
      {
        id: 2,
        url: 'https://picsum.photos/id/1015/800/400',
        alt: 'Río y bosque',
        caption: 'Río fluyendo a través del bosque'
      },
      {
        id: 3,
        url: 'https://picsum.photos/id/1019/800/400',
        alt: 'Atardecer en la playa',
        caption: 'Espectacular atardecer en la costa'
      }
    ];
  }
  return carouselImages.value;
};

// Usar imágenes de ejemplo solo en desarrollo
const displayImages = computed(() => {
  return process.env.NODE_ENV === 'development' && carouselImages.value.length === 0 
    ? ensureImages() 
    : carouselImages.value;
});

// Definir si estamos en modo desarrollo
const isDevelopment = process.env.NODE_ENV === 'development';
</script>

<style>
.wagtail-carousel-component {
  margin: 0;
}

.carousel-card {
  overflow: hidden;
  transition: box-shadow 0.3s ease;
  border-radius: 8px !important;
}

.carousel-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
}

.carousel {
  border-radius: 0;
  overflow: hidden;
}

.carousel-item {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}

.image-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.carousel-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: cover;
  width: 100%;
  border-radius: 0;
}

.image-caption {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 8px 16px;
  font-size: 0.9rem;
  text-align: center;
}

.carousel-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
  border-radius: 4px;
  min-height: 250px;
}

.placeholder-content {
  text-align: center;
  color: #666;
  padding: 2rem;
}

/* Miniaturas */
.thumbnails-section {
  padding: 0.5rem 1rem;
}

.thumbnails-row {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 8px;
  scrollbar-width: thin;
}

.thumbnails-row::-webkit-scrollbar {
  height: 6px;
}

.thumbnails-row::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}

.thumbnail {
  width: 60px;
  height: 40px;
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.2s ease;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f0f0f0;
}

.thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.thumbnail.active {
  border-color: var(--q-primary-color, #1976d2);
  transform: scale(1.05);
}

.thumbnail-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #e0e0e0;
}

.more-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background-color: #f0f0f0;
  border-radius: 4px;
  color: #666;
  font-size: 0.8rem;
  font-weight: 500;
}

/* Lightbox */
.lightbox-card {
  background-color: rgba(0, 0, 0, 0.9);
}

.lightbox-content {
  padding: 0;
  height: calc(100vh - 50px);
}

.lightbox-carousel {
  width: 100%;
  max-width: 1200px;
  background-color: transparent;
}

.lightbox-item {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.lightbox-image {
  max-width: 100%;
  max-height: 80vh;
  object-fit: contain;
  border-radius: 4px;
}

.lightbox-caption {
  margin-top: 1rem;
  color: white;
  text-align: center;
  max-width: 800px;
  font-style: italic;
}

/* Controles */
.carousel-controls {
  position: absolute;
  bottom: 16px;
  right: 16px;
  z-index: 5000;
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 16px;
  padding: 4px;
}

/* Responsive */
@media (max-width: 599px) {
  .carousel {
    height: 250px !important;
  }
  
  .thumbnail {
    width: 50px;
    height: 35px;
  }
  
  .image-caption {
    font-size: 0.8rem;
    padding: 6px 12px;
  }
  
  .lightbox-image {
    max-height: 60vh;
  }
}
</style>
