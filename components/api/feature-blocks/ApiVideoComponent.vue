<template>
  <section class="q-py-md">
    <div class="q-mx-auto" style="max-width: 1200px">
      
      <!-- Diseño principal con carrusel, textos y video -->
      <q-card flat bordered class="q-mb-lg shadow-3 overflow-hidden rounded-borders" style="height: 650px; position: relative; background-color: transparent; border: none;">
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
            height="650px"
            padding
            :autoplay="autoplayDuration"
            @mouseenter="pauseAutoplay"
            @mouseleave="resumeAutoplay"
            style="z-index: 3; position: relative"
          >
            <q-carousel-slide 
              v-for="(item, index) in carouselImages" 
              :key="index" 
              :name="index" 
              class="q-pa-none relative-position"
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
                <div v-if="item.caption" class="absolute-top text-center w-100" 
                     style="background: linear-gradient(to bottom, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.7) 50%, rgba(0,0,0,0.4) 80%, transparent 100%); padding: 2rem 1rem 4rem; z-index: 4;">
                  <div class="q-mx-auto" style="max-width: 1000px;">
                    <h3 class="text-h3 text-white text-weight-bold q-mb-none" 
                        style="text-shadow: 2px 2px 4px rgba(0,0,0,0.9); line-height: 1.4; max-width: 90%; margin: 0 auto; letter-spacing: 0.5px;"
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
          <div class="absolute-full" 
               style="background: linear-gradient(to right, rgba(0,0,0,0.8) 30%, rgba(0,0,0,0.5) 70%, rgba(0,0,0,0.3) 100%); z-index: 2; pointer-events: none;"></div>
        </div>
        
        <!-- Contenido principal -->
        <div class="relative-position full-height" style="z-index: 3">
          <!-- Título principal -->
          <div class="q-pa-xl">
            <h2 v-if="showMainTitle" class="text-h3 text-weight-bold q-mb-lg text-white"
                :class="{'text-h4': $q.screen.lt.md, 'text-h5': $q.screen.lt.sm}">
              {{ mainTitle }}
            </h2>
          </div>
          
          <!-- Video en la esquina -->
          <div class="absolute-bottom-right q-mb-md q-mr-md" 
               style="width: 320px; z-index: 10;"
               :class="{'absolute-bottom q-mb-xl': $q.screen.lt.md}">
            <q-card flat class="bg-transparent" style="backdrop-filter: blur(5px); border-radius: 12px; background-color: rgba(0,0,0,0.6);">
              <q-card-section>
                <!-- Video con miniatura y botón -->
                <div class="relative-position rounded-borders overflow-hidden" style="width: 320px; height: 180px;">
                  <!-- Miniatura -->
                  <div v-if="!videoActive" class="full-width full-height">
                    <q-img
                      :src="videoUrl ? getYouTubeThumbnail(videoUrl) : 'https://cdn.quasar.dev/img/parallax2.jpg'"
                      class="full-width full-height rounded-borders q-hoverable q-transition"
                      style="border: 2px solid white; box-shadow: 0 5px 15px rgba(0,0,0,0.3); transition: transform 0.3s ease;"
                      height="180px"
                      width="320px"
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
                          style="transform: scale(1.5); transition: transform 0.3s ease; box-shadow: 0 0 20px rgba(0,0,0,0.5);"
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
                    class="rounded-borders full-width full-height"
                    style="border: none; box-shadow: 0 5px 15px rgba(0,0,0,0.3);"
                    width="320"
                    height="180"
                  ></iframe>
                  
                  <!-- Placeholder sin video -->
                  <div v-if="!videoUrl && !videoActive" class="full-width full-height flex flex-center bg-grey-3">
                    <div class="text-center">
                      <q-icon name="videocam_off" size="2rem" color="grey-5" />
                      <div class="text-caption q-mt-sm">Video no disponible</div>
                    </div>
                  </div>
                </div>
                
                <h5 class="text-subtitle1 text-weight-bold text-white q-mb-sm q-mt-sm">{{ videoTitle }}</h5>
                <p class="text-white text-caption q-mb-none">{{ videoDescription }}</p>
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
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
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
