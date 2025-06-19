<template>
  <section class="q-py-md">
    <div class="q-mx-auto" style="max-width: 1200px">
      
      <!-- Diseño principal con carrusel, textos y video -->
      <q-card flat bordered class="q-mb-lg" style="height: 650px; position: relative; overflow: hidden; border-radius: 8px;">
        <!-- Carrusel como fondo -->
        <div class="absolute-full" style="z-index: 1">
          <!-- Carrusel de imágenes -->
          <q-carousel
            v-model="activeSlide"
            animated
            infinite
            swipeable
            control-color="white"
            control-type="unelevated"
            control-text-color="primary"
            class="bg-grey-3 full-height"
            :autoplay="autoplayDuration"
            @mouseenter="pauseAutoplay"
            @mouseleave="resumeAutoplay"
          >
            <q-carousel-slide 
              v-for="(item, index) in carouselImages" 
              :key="index" 
              :name="index" 
              class="column no-wrap flex-center"
            >
              <!-- Usar el proxy de imágenes -->
              <q-img 
                :src="`/api/proxy-image?url=${encodeURIComponent(item.image.url)}`" 
                spinner-color="primary"
                spinner-size="40px"
                class="absolute-full"
                fit="cover"
              >
                <!-- Caption en la parte superior -->
                <div v-if="item.caption" class="absolute-top text-center w-100 q-pt-xl">
                  <div class="q-mx-auto" style="max-width: 1000px;">
                    <h3 class="text-h3 text-white text-weight-bold q-mb-none"
                        :class="{'text-h4': $q.screen.lt.md, 'text-h5': $q.screen.lt.sm}">
                      {{ item.caption }}
                    </h3>
                  </div>
                </div>
                
                <template v-slot:error>
                  <div class="absolute-full flex flex-center bg-grey-3 text-dark">
                    <div class="text-center">
                      <q-icon name="image" size="3rem" color="grey-7" />
                      <div class="text-caption q-mt-sm">Error al cargar imagen</div>
                      <div class="text-caption">URL: {{ item.image.url }}</div>
                    </div>
                  </div>
                </template>
              </q-img>
            </q-carousel-slide>
          </q-carousel>
          
          <!-- Overlay para legibilidad -->
          <div class="absolute-full bg-black" style="opacity: 0.4;"></div>
        </div>
        
        <!-- Contenido principal -->
        <div class="relative-position full-height" style="z-index: 3">
          <!-- Título principal -->
          <div class="q-pa-xl">
            <h2 v-if="showMainTitle" 
                class="text-h3 text-weight-bold q-mb-lg text-white"
                :class="{'text-h4': $q.screen.lt.md, 'text-h5': $q.screen.lt.sm}">
              {{ mainTitle }}
            </h2>
          </div>
          
          <!-- Video en la esquina -->
          <div class="absolute-bottom-right q-mb-md q-mr-md"
               :class="{'absolute-bottom q-mb-xl': $q.screen.lt.md}"
               style="width: 380px; max-width: 90vw;">
            <q-card flat class="bg-transparent">
              <q-card-section>
                <!-- Video con miniatura y botón -->
                <div style="position: relative; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
                  <!-- Miniatura -->
                  <div v-if="!videoActive" class="full-width" style="height: 215px;">
                    <q-img
                      :src="videoUrl ? getYouTubeThumbnail(videoUrl) : defaultThumbnail"
                      class="cursor-pointer full-height"
                      @click="activateVideo"
                    >
                      <template v-slot:error>
                        <div class="absolute-full flex flex-center bg-grey-3 text-dark">
                          <div class="text-center">
                            <q-icon name="videocam_off" size="2rem" color="grey-7" />
                            <div class="text-caption q-mt-sm">Error al cargar miniatura</div>
                          </div>
                        </div>
                      </template>
                      
                      <div class="absolute-center">
                        <q-btn
                          round
                          unelevated
                          color="primary"
                          icon="play_arrow"
                          size="lg"
                          @click="activateVideo"
                          class="q-hoverable"
                        />
                      </div>
                    </q-img>
                  </div>
                  
                  <!-- Iframe del video -->
                  <iframe
                    v-if="videoActive && videoUrl"
                    :src="videoUrl"
                    frameborder="0"
                    allowfullscreen
                    class="full-width"
                    style="height: 215px;"
                  ></iframe>
                  
                  <!-- Placeholder sin video -->
                  <div v-if="!videoUrl && !videoActive" class="full-width flex flex-center bg-grey-3" style="height: 215px;">
                    <div class="text-center">
                      <q-icon name="videocam_off" size="2rem" color="grey-5" />
                      <div class="text-caption q-mt-sm">Video no disponible</div>
                    </div>
                  </div>
                </div>
                
                <h5 class="q-mt-md q-mb-sm text-weight-bold text-white">{{ videoTitle }}</h5>
                <p class="q-ma-none text-white text-body2">{{ videoDescription }}</p>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </q-card>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRuntimeConfig } from '#app'; // Import useRuntimeConfig

const props = defineProps({
  defaultThumbnail: {
    type: String,
    default: ''
  },
  // Bloques de contenido de la API de Wagtail
  blocks: {
    type: Array,
    required: true
  },
  // API Base URL para imágenes
  apiBaseUrl: {
    type: String,
    default: () => useRuntimeConfig().public.apiBase // Use factory function for default
  },
  // Título principal
  title: {
    type: String,
    default: 'Certiffy'
  },
  // Mostrar u ocultar el título principal (ya que ahora usamos los captions)
  showMainTitle: {
    type: Boolean,
    default: false
  },
  // Duración del autoplay para carruseles
  autoplayDuration: {
    type: Number,
    default: 5000
  }
});

// Estado para controlar el carrusel
const activeSlide = ref(0);
const autoplayTimeout = ref(null);

// Estado para controlar la reproducción del video
const videoActive = ref(false);

// Procesar los bloques para extraer carrusel, párrafos y video
const carouselBlock = computed(() => {
  return props.blocks.find(block => block.type === 'carousel') || null;
});

const carouselImages = computed(() => {
  if (carouselBlock.value && carouselBlock.value.value && carouselBlock.value.value.images) {
    return carouselBlock.value.value.images;
  }
  return [];
});

const paragraphBlocks = computed(() => {
  return props.blocks.filter(block => block.type === 'paragraph') || [];
});

const paragraphs = computed(() => {
  return paragraphBlocks.value.map(block => block.value);
});

const videoBlock = computed(() => {
  return props.blocks.find(block => block.type === 'video') || null;
});

const videoUrl = computed(() => {
  if (videoBlock.value && videoBlock.value.value && videoBlock.value.value.video_url) {
    return videoBlock.value.value.video_url;
  }
  return '';
});

// Título principal y descripciones
const mainTitle = computed(() => {
  return props.title;
});

const videoTitle = computed(() => {
  return 'Video promocional';
});

const videoDescription = computed(() => {
  return 'Video promocional de Certiffy';
});

// Función para obtener la URL completa de la imagen
const getCompleteImageUrl = (item) => {
  if (!item) return '/images/placeholder.jpg';
  
  // Estructura exacta del carrusel donde la URL está en item.image.url
  if (item.image && item.image.url) {
    return `${props.apiBaseUrl}${item.image.url}`;
  }
  
  // Si item tiene directamente una propiedad url
  if (item.url) {
    return `${props.apiBaseUrl}${item.url}`;
  }
  
  // Si item es directamente un número o string (ID)
  if (typeof item === 'number' || typeof item === 'string') {
    return `/images/placeholder.jpg`;
  }
  
  // Fallback a una imagen de placeholder
  return '/images/placeholder.jpg';
};

// Función para extraer la miniatura de un video de YouTube
const getYouTubeThumbnail = (videoUrl) => {
  if (!videoUrl) {
    return '/images/video-placeholder.jpg';
  }
  
  let videoId = null;
  
  // Extraer ID de video de YouTube
  if (videoUrl.includes('youtube.com/embed/')) {
    videoId = videoUrl.split('youtube.com/embed/')[1].split('?')[0];
  } else if (videoUrl.includes('youtube.com/watch?v=')) {
    videoId = videoUrl.split('v=')[1].split('&')[0];
  } else if (videoUrl.includes('youtu.be/')) {
    videoId = videoUrl.split('youtu.be/')[1].split('?')[0];
  }
  
  // Si se encontró un ID válido, devolver la miniatura
  if (videoId) {
    // Obtener la miniatura de YouTube mediante la API de YouTube en lugar de hardcodear la URL
    return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : props.defaultThumbnail;
  }
  
  // Si no es una URL de YouTube o no se puede extraer el ID
  return '/images/video-placeholder.jpg';
};

// Función para obtener URL de imagen
const getImageUrl = (imageId) => {
  if (props.customImageUrlFunction) {
    return props.customImageUrlFunction(imageId);
  }
  
  // URL de placeholder por defecto
  return '/images/placeholder.jpg';
};

// Funciones para controlar el autoplay del carrusel
const pauseAutoplay = () => {
  if (autoplayTimeout.value) {
    clearTimeout(autoplayTimeout.value);
    autoplayTimeout.value = null;
  }
};

const resumeAutoplay = () => {
  if (!autoplayTimeout.value && props.autoplayDuration > 0) {
    autoplayTimeout.value = setTimeout(() => {
      activeSlide.value = (activeSlide.value + 1) % (carouselImages.value.length || 1);
      resumeAutoplay();
    }, props.autoplayDuration);
  }
};

// Activar el video
const activateVideo = () => {
  videoActive.value = true;
};
</script>
