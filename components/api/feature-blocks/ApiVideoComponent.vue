<template>
  <section class="q-py-md api-video-component">
    <div class="q-mx-auto" style="max-width: 1200px">
      
      <!-- Diseño principal con carrusel, textos y video -->
      <q-card flat bordered class="hero-card q-mb-lg shadow-3">
        <!-- Carrusel como fondo -->
        <div class="carousel-background">
          <!-- Usar URLs directas en lugar de la función -->
          <q-carousel
            v-model="activeSlide"
            animated
            infinite
            swipeable
            control-color="white"
            control-type="unelevated"
            control-text-color="primary"
            class="bg-grey-3 full-height carousel-control-fix"
            height="650px"
            padding
            :autoplay="autoplayDuration"
            @mouseenter="pauseAutoplay"
            @mouseleave="resumeAutoplay"
          >
            <q-carousel-slide 
              v-for="(item, index) in carouselImages" 
              :key="index" 
              :name="index" 
              class="carousel-slide"
            >
              <!-- Usar el proxy de imágenes para evitar problemas de CORS -->
              <q-img 
                :src="`/api/proxy-image?url=${encodeURIComponent(item.image.url)}`" 
                spinner-color="primary"
                spinner-size="40px"
                class="absolute-full"
                fit="cover"
              >
                <!-- Mostrar el caption de la imagen si existe (ahora en la parte superior) -->
                <div v-if="item.caption" class="caption-overlay absolute-top text-center">
                  <div class="q-mx-auto" style="max-width: 1000px;">
                    <h3 class="text-h3 text-white text-weight-bold q-mb-none">{{ item.caption }}</h3>
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
          
          <!-- Overlay suave para mejorar la legibilidad -->
          <div class="bg-overlay"></div>
        </div>
        
        <!-- Contenido principal -->
        <div class="content-container">
          <!-- Sólo mostramos el título principal en la parte superior, los captions aparecen en cada slide -->
          <div class="title-container q-pa-xl">
            <h2 v-if="showMainTitle" class="text-h3 text-weight-bold q-mb-lg text-white main-title">{{ mainTitle }}</h2>
          </div>
          
          <!-- Video en la esquina inferior derecha -->
          <div class="video-corner-container">
            <q-card flat class="video-card bg-transparent">
              <q-card-section>
                <!-- Video con miniatura y botón de reproducción -->
                <div class="video-container">
                  <!-- Miniatura del video -->
                  <div v-if="!videoActive" class="video-thumbnail-container">
                    <q-img
                      :src="videoUrl ? getYouTubeThumbnail(videoUrl) : 'https://cdn.quasar.dev/img/parallax2.jpg'"
                      class="video-thumbnail rounded-borders"
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
                          class="play-button q-hoverable"
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
                    class="video-iframe"
                    width="320"
                    height="180"
                  ></iframe>
                  
                  <!-- Placeholder cuando no hay video -->
                  <div v-if="!videoUrl && !videoActive" class="video-placeholder flex flex-center">
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
import { API_BASE_URL } from '~/composables/useWagtailApi';

const props = defineProps({
  // Bloques de contenido de la API de Wagtail
  blocks: {
    type: Array,
    required: true
  },
  // API Base URL para imágenes
  apiBaseUrl: {
    type: String,
    default: API_BASE_URL
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

<style scoped>
/* Estilos para el componente principal */
.api-video-component .hero-card {
  position: relative;
  overflow: hidden;
  border-radius: 12px;
  background-color: transparent;
  border: none;
  height: 650px;
}

/* Estilos para el carrusel de fondo */
.api-video-component .carousel-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

/* Asegurar que los controles del carrusel sean accesibles */
.api-video-component .carousel-control-fix {
  z-index: 3 !important;
  position: relative;
}

.api-video-component .carousel-control-fix :deep(.q-carousel__navigation) {
  z-index: 10 !important;
  position: absolute;
  bottom: 30px;
  left: 0;
  right: 0;
  pointer-events: all;
  padding-bottom: 15px;
}

.api-video-component .carousel-control-fix :deep(.q-carousel__navigation-inner) {
  height: 20px; /* Dar más espacio a los indicadores */
}

.api-video-component .carousel-control-fix :deep(.q-carousel__arrow) {
  z-index: 10 !important;
  color: white;
  background: rgba(0,0,0,0.5);
  pointer-events: all;
  margin: 0 15px;
}

/* Overlay para mejorar legibilidad del texto */
.api-video-component .bg-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to right, rgba(0,0,0,0.8) 30%, rgba(0,0,0,0.5) 70%, rgba(0,0,0,0.3) 100%);
  z-index: 2;
  pointer-events: none; /* Para que se puedan hacer clic en los controles */
}

/* Estilos para el caption de cada imagen (ahora en la parte superior) */
.api-video-component .caption-overlay {
  background: linear-gradient(to bottom, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.7) 50%, rgba(0,0,0,0.4) 80%, transparent 100%);
  padding: 2rem 1rem 4rem;
  width: 100%;
  text-align: center;
  z-index: 4;
}

.api-video-component .caption-overlay h3 {
  text-shadow: 2px 2px 4px rgba(0,0,0,0.9);
  line-height: 1.4;
  max-width: 90%;
  margin: 0 auto;
  font-size: 2.5rem;
  letter-spacing: 0.5px;
}

/* Contenedor del contenido principal */
.api-video-component .content-container {
  position: relative;
  z-index: 3;
  height: 100%;
}

/* Contenedor de texto */
.api-video-component .text-container {
  width: 100%;
  max-width: 65%;
}

/* Posicionamiento del video en la esquina */
.api-video-component .video-corner-container {
  position: absolute;
  bottom: 30px;
  right: 30px;
  width: 320px;
  z-index: 10;
}

/* Estilos para los textos */
.api-video-component .text-content {
  color: white;
  text-shadow: 1px 1px 3px rgba(0,0,0,0.5);
}

/* Estilos para el contenedor de video */
.api-video-component .video-container {
  width: 320px;
  height: 180px;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
}

.api-video-component .video-thumbnail-container {
  width: 100%;
  height: 100%;
}

.api-video-component .video-thumbnail {
  border: 2px solid white;
  box-shadow: 0 5px 15px rgba(0,0,0,0.3);
  transition: transform 0.3s ease;
}

.api-video-component .video-thumbnail:hover {
  transform: scale(1.02);
}

.api-video-component .video-iframe {
  border: none;
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.3);
}

.api-video-component .play-button {
  transform: scale(1.5);
  transition: transform 0.3s ease;
  box-shadow: 0 0 20px rgba(0,0,0,0.5);
}

.api-video-component .play-button:hover {
  transform: scale(1.8);
}

.api-video-component .video-card {
  backdrop-filter: blur(5px);
  border-radius: 12px;
  background-color: rgba(0,0,0,0.6);
}

/* Estilos responsivos */
@media (max-width: 1023px) {
  .api-video-component .hero-card {
    height: auto;
    min-height: 600px;
  }
  
  .api-video-component .text-container {
    max-width: 100%;
    padding-bottom: 250px;
  }
  
  .api-video-component .video-corner-container {
    bottom: 60px;
    right: 50%;
    transform: translateX(50%);
  }
  
  .api-video-component .carousel-background {
    position: absolute;
    height: 100%;
  }
  
  .api-video-component .bg-overlay {
    background: linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.8) 100%);
  }
}

@media (max-width: 599px) {
  .api-video-component .hero-card {
    min-height: 700px;
  }
  
  .api-video-component .text-container {
    padding-bottom: 220px;
  }
  
  .api-video-component .video-corner-container {
    width: 280px;
    bottom: 30px;
  }
  
  .api-video-component .video-container {
    width: 280px;
    height: 158px;
  }
  
  .api-video-component .video-iframe,
  .api-video-component .video-thumbnail {
    width: 280px;
    height: 158px;
  }
  
  .api-video-component .play-button {
    transform: scale(1.2);
  }
  
  .api-video-component .play-button:hover {
    transform: scale(1.4);
  }
  
  .api-video-component .q-pa-xl {
    padding: 16px;
  }
  
  .api-video-component .text-h3 {
    font-size: 1.5rem;
  }
  
  .api-video-component .text-h5 {
    font-size: 1.1rem;
  }
}
</style>
