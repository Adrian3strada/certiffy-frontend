<template>
  <div class="api-gallery-component q-my-xl">
    <h4 class="text-center q-mb-md" v-if="galleryTitle">{{ galleryTitle }}</h4>
    
    <!-- Carrusel de imágenes para pantallas pequeñas -->
    <q-carousel
      v-model="slide"
      animated
      arrows
      navigation
      infinite
      swipeable
      control-color="primary"
      class="rounded-borders mobile-carousel"
      v-if="$q.screen.lt.md"
    >
      <q-carousel-slide 
        v-for="(item, index) in galleryImages" 
        :key="index" 
        :name="index"
        class="column no-wrap flex-center"
      >
        <q-img
          :src="formatImageUrl(item.image?.url)"
          :alt="item.image?.title || ''"
          class="gallery-image"
          fit="contain"
          spinner-color="primary"
          spinner-size="42px"
        >
          <template v-if="item.caption" v-slot:caption>
            <div class="image-caption">{{ item.caption }}</div>
          </template>
        </q-img>
      </q-carousel-slide>
    </q-carousel>
    
    <!-- Grid de imágenes para pantallas medianas y grandes -->
    <div class="row q-col-gutter-md desktop-gallery" v-else>
      <div 
        v-for="(item, index) in galleryImages" 
        :key="index"
        class="col-12 col-md-4 col-lg-4"
      >
        <q-img
          :src="formatImageUrl(item.image?.url)"
          :alt="item.image?.title || ''"
          class="gallery-image"
          fit="cover"
          spinner-color="primary"
          spinner-size="42px"
          :ratio="4/3"
          @click="openLightbox(index)"
        >
          <template v-if="item.caption" v-slot:caption>
            <div class="image-caption">{{ item.caption }}</div>
          </template>
        </q-img>
      </div>
    </div>
    
    <!-- Lightbox para ver imágenes en tamaño completo -->
    <q-dialog v-model="lightboxOpen" full-width full-height>
      <q-card class="lightbox-card">
        <q-card-section class="lightbox-header row items-center">
          <div class="text-h6 lightbox-title">{{ currentImage?.image?.title || 'Imagen' }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        
        <q-separator />
        
        <q-card-section class="lightbox-content">
          <q-carousel
            v-model="lightboxSlide"
            animated
            arrows
            navigation
            infinite
            swipeable
            control-color="white"
            class="lightbox-carousel"
          >
            <q-carousel-slide 
              v-for="(item, index) in galleryImages" 
              :key="index" 
              :name="index"
              class="column no-wrap flex-center"
            >
              <q-img
                :src="formatImageUrl(item.image?.url)"
                :alt="item.image?.title || ''"
                class="lightbox-image"
                fit="contain"
                spinner-color="white"
                spinner-size="42px"
              />
              <div v-if="item.caption" class="lightbox-caption">
                {{ item.caption }}
              </div>
            </q-carousel-slide>
          </q-carousel>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { API_BASE_URL } from '~/composables/useWagtailApi';

// Propiedades del componente
const props = defineProps({
  block: {
    type: Object,
    required: true
  },
  apiBaseUrl: {
    type: String,
    default: API_BASE_URL
  },
  title: {
    type: String,
    default: ''
  }
});

// Estado del carrusel
const slide = ref(0);
const lightboxOpen = ref(false);
const lightboxSlide = ref(0);

// Título de la galería
const galleryTitle = computed(() => {
  return props.title || props.block?.value?.title || '';
});

// Imágenes de la galería
const galleryImages = computed(() => {
  if (!props.block?.value?.images || !Array.isArray(props.block.value.images)) {
    return [];
  }
  
  return props.block.value.images;
});

// Imagen actual para el lightbox
const currentImage = computed(() => {
  if (!galleryImages.value.length) return null;
  return galleryImages.value[lightboxSlide.value];
});

// Formatear la URL de la imagen para usar el proxy
function formatImageUrl(url) {
  if (!url) return '';
  
  // Si es una ruta relativa, añadir la URL base
  if (url.startsWith('/')) {
    return `/api/proxy-image?url=${encodeURIComponent(props.apiBaseUrl + url)}`;
  } else if (url.startsWith('http')) {
    return `/api/proxy-image?url=${encodeURIComponent(url)}`;
  }
  
  return url;
}

// Abrir el lightbox
function openLightbox(index) {
  lightboxSlide.value = index;
  lightboxOpen.value = true;
}
</script>

<style scoped>
.api-gallery-component {
  max-width: 1200px;
  margin: 0 auto;
}

.gallery-image {
  border-radius: 8px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.desktop-gallery .gallery-image {
  cursor: pointer;
}

.desktop-gallery .gallery-image:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
}

.image-caption {
  background-color: rgba(0, 0, 0, 0.6);
  padding: 8px;
}

.lightbox-card {
  background-color: #1e1e1e;
  color: white;
}

.lightbox-header {
  background-color: rgba(0, 0, 0, 0.8);
}

.lightbox-content {
  height: calc(100vh - 100px);
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.lightbox-carousel {
  height: 100%;
  width: 100%;
  background: transparent;
}

.lightbox-image {
  max-height: 85vh;
}

.lightbox-caption {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 16px;
  text-align: center;
}

/* Estilos responsivos */
@media (max-width: 767px) {
  .mobile-carousel {
    height: 350px;
  }
}
</style>
