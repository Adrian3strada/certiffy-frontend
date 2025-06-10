<template>
  <section :id="'gallery-' + (id || Math.random().toString(36).substring(2, 9))" class="q-my-xl q-mx-auto" style="max-width: 1200px;">
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
      class="rounded-borders"
      style="height: 350px;"
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
          class="rounded-borders q-transition"
          fit="contain"
          spinner-color="primary"
          spinner-size="42px"
        >
          <template v-if="item.caption" v-slot:caption>
            <div class="bg-black-6 q-pa-sm">{{ item.caption }}</div>
          </template>
        </q-img>
      </q-carousel-slide>
    </q-carousel>
    
    <!-- Grid de imágenes para pantallas medianas y grandes -->
    <div class="row q-col-gutter-md" v-else>
      <div 
        v-for="(item, index) in galleryImages" 
        :key="index"
        class="col-12 col-md-4 col-lg-4"
      >
        <q-img
          :src="formatImageUrl(item.image?.url)"
          :alt="item.image?.title || ''"
          class="rounded-borders cursor-pointer q-transition"
          :class="{'q-hoverable': true}"
          style="transition: transform 0.3s ease, box-shadow 0.3s ease;"
          fit="cover"
          spinner-color="primary"
          spinner-size="42px"
          :ratio="4/3"
          @click="openLightbox(index)"
          @mouseover="e => { e.target.style.transform = 'translateY(-5px)'; e.target.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.15)'; }"
          @mouseout="e => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = 'none'; }"
        >
          <template v-if="item.caption" v-slot:caption>
            <div class="bg-black-6 q-pa-sm">{{ item.caption }}</div>
          </template>
        </q-img>
      </div>
    </div>
    
    <!-- Lightbox para ver imágenes en tamaño completo -->
    <q-dialog v-model="lightboxOpen" full-width full-height>
      <q-card class="bg-dark text-white">
        <q-card-section class="bg-black-8 row items-center">
          <div class="text-h6">{{ currentImage?.image?.title || 'Imagen' }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        
        <q-separator />
        
        <q-card-section class="flex flex-center" style="height: calc(100vh - 100px); padding: 0;">
          <q-carousel
            v-model="lightboxSlide"
            animated
            arrows
            navigation
            infinite
            swipeable
            control-color="white"
            class="full-width full-height bg-transparent"
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
                style="max-height: 85vh;"
                fit="contain"
                spinner-color="white"
                spinner-size="42px"
              />
              <div v-if="item.caption" class="absolute-bottom bg-black-6 text-white q-pa-md text-center">
                {{ item.caption }}
              </div>
            </q-carousel-slide>
          </q-carousel>
        </q-card-section>
      </q-card>
    </q-dialog>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRuntimeConfig } from '#app'; // Import useRuntimeConfig

// Propiedades del componente
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
    default: () => useRuntimeConfig().public.apiBase // Use factory function for default
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


