<template>
  <div class="api-carousel-component">
    <div v-if="loading" class="flex flex-center q-pa-xl full-height">
      <q-spinner color="primary" size="3em" />
    </div>
    
    <div v-else-if="error" class="text-center q-pa-xl full-height">
      <div class="text-negative text-h6">{{ error }}</div>
    </div>
    
    <div v-else class="full-width-container">
      <!-- Hero Banner con imagen de fondo y video en esquina -->
      <div v-if="showCarousel && carouselData && carouselData.images && carouselData.images.length > 0" class="hero-banner-container full-width">
        <q-carousel
          v-model="slide"
          animated
          arrows
          navigation
          infinite
          swipeable
          control-color="white"
          navigation-icon="circle"
          class="hero-carousel"
          :autoplay="autoplay"
          @mouseenter="autoplay = false"
          @mouseleave="autoplay = props.autoplayDuration"
          height="100vh"
          transition-prev="fade"
          transition-next="fade"
          navigation-position="bottom"
          flat
        >
          <q-carousel-slide 
            v-for="(item, index) in carouselData.images" 
            :key="index" 
            :name="index" 
            class="hero-slide"
          >
            <!-- Imagen de fondo a pantalla completa -->
            <div class="hero-background">
              <q-img 
                :src="getImageUrl(item.image)" 
                spinner-color="primary"
                class="full-height full-width"
                fit="cover"
              />
            </div>
            
            <!-- Overlay con gradiente para legibilidad del texto -->
            <div class="hero-overlay"></div>
                        <!-- Contenido superpuesto con layout moderno -->
            <div class="hero-content">
              <div class="hero-flex-container">
                <!-- Texto principal del Hero Banner -->
                <div class="hero-text">
                  <h2 v-if="item.caption" class="hero-caption text-white text-weight-bold">{{ item.caption }}</h2>
                </div>
                
                <!-- Video miniatura en esquina opuesta -->
                <div v-if="showVideo && videoData && videoData.video_url && videoData.mostrar_video !== false" class="hero-video">
                  <div class="video-container">
                    <iframe
                      :src="processVideoUrl(videoData.video_url)"
                      frameborder="0"
                      allowfullscreen
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      class="video-iframe"
                    ></iframe>
                  </div>
                </div>
              </div>
            </div>
          </q-carousel-slide>
        </q-carousel>
      </div>
      
      <!-- Contenido de texto -->
      <div v-if="showParagraphs && paragraphsData && paragraphsData.length > 0" class="text-content q-mt-xl">
        <div v-for="(paragraph, index) in paragraphsData" :key="index" class="q-mb-lg">
          <div v-html="paragraph.value" class="text-content-item"></div>
        </div>
      </div>
      
      <!-- Se eliminó la sección duplicada del video que aparecía debajo del carousel -->
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useWagtailApi } from '~/composables/useWagtailApi';

const props = defineProps({
  // Datos del carrusel pasados directamente (ahora es opcional)
  apiUrl: {
    type: String,
    required: false,
    default: ''
  },
  // Datos del carrusel pasados directamente (alternativa al apiUrl)
  carouselData: {
    type: Object,
    required: false,
    default: null
  },
  // Datos del video pasados directamente
  videoData: {
    type: Object,
    required: false,
    default: null
  },
  // Título personalizado para el componente (opcional)
  customTitle: {
    type: String,
    default: ''
  },
  // Altura personalizada para el carrusel (opcional)
  carouselHeightMobile: {
    type: String,
    default: '300px'
  },
  carouselHeightTablet: {
    type: String,
    default: '400px'
  },
  carouselHeightDesktop: {
    type: String,
    default: '500px'
  },
  // Tiempo de autoplay para el carrusel (opcional)
  autoplayDuration: {
    type: Number,
    default: 5000
  },
  // Mostrar/ocultar secciones específicas (opcional)
  showCarousel: {
    type: Boolean,
    default: true
  },
  showParagraphs: {
    type: Boolean,
    default: true
  },
  showVideo: {
    type: Boolean,
    default: true
  },
  // Función personalizada para obtener la URL de la imagen (opcional)
  customImageUrlFunction: {
    type: Function,
    default: null
  }
});

// Emitir eventos
const emit = defineEmits(['data-loaded', 'data-error']);

// Obtener el composable de la API de Wagtail
const { getDataFromUrl, loading: apiLoading, error: apiError } = useWagtailApi();

// Variables reactivas
const slide = ref(0);
const autoplay = ref(props.autoplayDuration);
const windowWidth = ref(window.innerWidth);
const loading = computed(() => apiLoading.value);
const error = computed(() => apiError.value);
const pageData = ref(null);
const carouselData = ref(null);
const paragraphsData = ref([]);
const videoData = ref(null);

// Ajustar la altura del carrusel según el tamaño de la pantalla
const carouselHeight = computed(() => {
  if (windowWidth.value < 600) {
    return props.carouselHeightMobile;
  } else if (windowWidth.value < 1024) {
    return props.carouselHeightTablet;
  } else {
    return props.carouselHeightDesktop;
  }
});

// Título a mostrar (personalizado o de la API)
const displayTitle = computed(() => {
  return props.customTitle || pageData.value?.title || 'Carrusel API';
});

// Actualizar el ancho de la ventana cuando cambia el tamaño
const handleResize = () => {
  windowWidth.value = window.innerWidth;
};

// Agregar y eliminar el event listener para el cambio de tamaño
onMounted(() => {
  window.addEventListener('resize', handleResize);
  fetchData();
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});

// Función para obtener la URL de la imagen
const getImageUrl = (image) => {
  // Si hay una función personalizada para obtener la URL, usarla
  if (props.customImageUrlFunction) {
    return props.customImageUrlFunction(image);
  }
  
  // Si es un objeto con url (formato de Wagtail)
  if (image && image.url) {
    // Usar proxy para evitar problemas de CORS
    return `/api/proxy-image?url=${encodeURIComponent(image.url)}`;
  }
  
  // Verificar si es una cadena directa
  if (typeof image === 'string') {
    if (image.startsWith('http')) {
      return `/api/proxy-image?url=${encodeURIComponent(image)}`;
    }
    return image;
  }
  
  // Fallback a placeholder
  return `https://via.placeholder.com/800x450?text=Image+Not+Found`;
};

// Función para procesar la URL del video y añadir parámetros de autoplay
const processVideoUrl = (url) => {
  if (!url) return '';
  
  // Detectar si es YouTube o Vimeo y añadir los parámetros adecuados
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    // Para YouTube
    if (url.includes('?')) {
      // Ya tiene parámetros, añadir autoplay y mute
      return `${url}&autoplay=1&mute=1&playlist=${getYouTubeVideoId(url)}&loop=1`;
    } else {
      // No tiene parámetros, añadir con '?'
      return `${url}?autoplay=1&mute=1&playlist=${getYouTubeVideoId(url)}&loop=1`;
    }
  } else if (url.includes('vimeo.com')) {
    // Para Vimeo
    if (url.includes('?')) {
      return `${url}&autoplay=1&muted=1&loop=1&background=1`;
    } else {
      return `${url}?autoplay=1&muted=1&loop=1&background=1`;
    }
  }
  
  // Si no es ninguno de los anteriores, devolver la URL original
  return url;
};

// Función auxiliar para extraer el ID de video de YouTube
const getYouTubeVideoId = (url) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : '';
};

// Función para obtener los datos de la API o usar los datos proporcionados directamente
const fetchData = async () => {
  try {
    // Si tenemos datos proporcionados directamente como props, usarlos
    if (props.carouselData) {
      console.log('Usando datos de carrusel proporcionados directamente:', props.carouselData);
      carouselData.value = props.carouselData;
      loading.value = false;
      
      // Si tenemos datos de video proporcionados directamente
      if (props.videoData && props.videoData.video_url) {
        videoData.value = {
          video_url: props.videoData.video_url,
          mostrar_video: props.videoData.mostrar_video
        };
      }
      
      // Emitir evento de datos cargados
      emit('data-loaded', { 
        carouselData: carouselData.value,
        videoData: videoData.value 
      });
      
      return; // Terminar aquí si usamos datos directos
    }
    
    // Si no hay datos directos pero hay URL, obtener datos de la API
    if (props.apiUrl) {
      const data = await getDataFromUrl(props.apiUrl);
      
      // Verificar si se recibieron datos
      if (!data) {
        throw new Error('No se recibieron datos del API');
      }
      
      // Almacenar datos generales de la página
      pageData.value = data;
      
      // Procesar datos de carousel, párrafos y video
      // Buscar en bloques si es una respuesta de página
      if (data.body) {
        const blocks = data.body;
        
        // Buscar bloque de carousel
        const carouselBlock = blocks.find(block => block.type === 'carousel');
        if (carouselBlock && carouselBlock.value) {
          carouselData.value = carouselBlock.value;
          
          // Si el bloque de carousel tiene video_url, usarlo directamente
          if (carouselBlock.value.video_url) {
            videoData.value = {
              video_url: carouselBlock.value.video_url,
              mostrar_video: carouselBlock.value.mostrar_video
            };
          }
        }
      }
      
      // Buscar bloques de párrafos
      const paragraphBlocks = blocks.filter(block => block.type === 'paragraph');
      if (paragraphBlocks && paragraphBlocks.length > 0) {
        paragraphsData.value = paragraphBlocks;
      }
      
      // Buscar bloque de video independiente si no estaba en el carousel
      if (!videoData.value) {
        const videoBlock = blocks.find(block => block.type === 'video');
        if (videoBlock && videoBlock.value) {
          videoData.value = videoBlock.value;
        }
      }
    } else if (data.type === 'carousel' && data.value) {
      // Si los datos son directamente un bloque de carousel
      carouselData.value = data.value;
      
      // Si el bloque tiene video_url, usarlo directamente
      if (data.value.video_url) {
        videoData.value = {
          video_url: data.value.video_url,
          mostrar_video: data.value.mostrar_video
        };
      }
    }
    
    console.log('Datos de carousel cargados:', carouselData.value);
    console.log('Datos de video cargados:', videoData.value);
    
    // Emitir evento de datos cargados
    emit('data-loaded', { 
      pageData: pageData.value, 
      carouselData: carouselData.value,
      videoData: videoData.value 
    });
  } catch (err) {
    console.error('Error al cargar datos del API:', err);
    error.value = `Error al cargar datos: ${err.message}`;
    emit('data-error', err);
  }
};
</script>

<style scoped>
/* Estilos base del componente */
.api-carousel-component {
  width: 100%;
  position: relative;
  overflow: visible;
  height: auto;
  padding: 0;
  margin: 0;
}

/* Contenedor para ancho completo */
.full-width-container {
  width: 100vw;
  position: relative;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
  padding: 0;
}

/* Hero Banner Container */
.hero-banner-container {
  position: relative;
  width: 100vw;
  margin: 0;
  padding: 0;
  overflow: hidden;
  box-shadow: 0 8px 30px rgba(0,0,0,0.2);
}

/* Estilos para el hero carousel */
.hero-carousel {
  overflow: hidden;
  width: 100%;
  height: 100vh;
  min-height: 600px;
  max-height: 100vh;
  position: relative;
}

/* Estilo del slide del hero */
.hero-slide {
  position: relative;
  height: 100%;
  width: 100%;
  overflow: hidden;
}

/* Fondo del hero con imagen */
.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
}

/* Overlay con gradiente para mejorar legibilidad */
.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.65) 40%, rgba(0,0,0,0.4) 100%);
  z-index: 2;
}

/* Contenido del hero (texto y video) */
.hero-content {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 3;
  padding: 0;
}

/* Contenedor flexible para alinear texto y video */
.hero-flex-container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
}

/* Área del texto principal */
.hero-text {
  position: absolute;
  bottom: 10%;
  left: 5%;
  max-width: 650px;
  margin: 0;
  
  @media (max-width: 992px) {
    bottom: 25%;
    left: 50%;
    transform: translateX(-50%);
    text-align: center;
    max-width: 85%;
  }
  
  @media (max-width: 576px) {
    bottom: 30%;
    max-width: 90%;
  }
}

/* Estilo del texto/caption */
.hero-caption {
  font-size: 3.5rem;
  line-height: 1.2;
  font-weight: 800;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
  letter-spacing: -1px;
  margin: 0;
  
  @media (max-width: 1200px) {
    font-size: 3rem;
  }
  
  @media (max-width: 992px) {
    font-size: 2.5rem;
  }
  
  @media (max-width: 768px) {
    font-size: 2rem;
    line-height: 1.3;
  }
  
  @media (max-width: 576px) {
    font-size: 1.75rem;
    line-height: 1.4;
  }
  
  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
}

/* Área del video en miniatura */
.hero-video {
  position: absolute;
  bottom: 10%;
  right: 5%;
  width: 32%;
  max-width: 420px;
  min-width: 250px;
  z-index: 4;
  box-shadow: 0 15px 30px rgba(0,0,0,0.35);
  border-radius: 10px;
  overflow: hidden;
  
  @media (max-width: 992px) {
    bottom: 10%;
    right: 50%;
    transform: translateX(50%);
    width: 65%;
    max-width: 450px;
  }
  
  @media (max-width: 576px) {
    bottom: 15%;
    width: 85%;
  }
}

/* Tarjeta del video */
.video-card {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
  border: 2px solid rgba(255,255,255,0.1);
  margin: 0 auto;
}

/* Contenedor del video */
.video-container {
  position: relative;
  padding-bottom: 56.25%; /* Aspect ratio 16:9 */
  height: 0;
  overflow: hidden;
}

.video-iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

/* Estilos responsivos */
@media (max-width: 1023px) {
  .hero-content {
    padding: 2rem;
  }
  
  .hero-text {
    width: 70%;
  }
  
  .hero-caption {
    font-size: 2.8rem;
  }
  
  .hero-video {
    width: 40%;
  }
}

@media (max-width: 767px) {
  .hero-content {
    padding: 1.5rem;
  }
  
  .hero-text {
    width: 90%;
  }
  
  .hero-caption {
    font-size: 2rem;
  }
  
  .hero-video {
    width: 50%;
    max-width: 300px;
    min-width: 200px;
    bottom: 1.5rem;
    right: 1.5rem;
  }
}

@media (max-width: 599px) {
  .hero-text {
    width: 100%;
  }
  
  .hero-caption {
    font-size: 1.8rem;
  }
  
  .hero-video {
    width: 70%;
    bottom: 1rem;
    right: 1rem;
  }
}

/* Estilos para el contenido de texto */
.text-content {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 4px 16px rgba(0,0,0,0.05);
}

.text-content-item {
  font-size: 1.1rem;
  line-height: 1.8;
  color: #333;
}

/* Responsive */
@media (max-width: 1023px) {
  .text-container {
    max-width: 80%;
    padding-left: 2rem;
  }
  
  .slide-title {
    font-size: 2.5rem;
  }
  
  .slide-subtitle {
    font-size: 1.5rem;
  }
}

@media (max-width: 599px) {
  .text-container {
    max-width: 100%;
    padding-left: 1rem;
  }
  
  .slide-title {
    font-size: 1.8rem;
  }
  
  .slide-subtitle {
    font-size: 1.2rem;
  }
  
  .slide-caption {
    font-size: 1rem;
    margin-top: 1rem;
  }
}

/* Estilos adicionales para bloques HTML anidados */

/* Estilos para el contenido HTML de los párrafos */
.api-carousel-component .text-content-item :deep(h3) {
  font-size: 1.5rem;
  line-height: 1.5;
  margin-bottom: 1rem;
}

.api-carousel-component .text-content-item :deep(p) {
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 1rem;
}

/* Estilos responsivos para dispositivos móviles */
@media (max-width: 599px) {
  .api-carousel-component .component-title {
    font-size: 1.5rem !important;
    margin-bottom: 1rem !important;
  }
  
  .api-carousel-component .carousel-slide {
    padding: 8px !important;
  }
  
  .api-carousel-component .text-content-item :deep(h3) {
    font-size: 1.2rem !important;
  }
  
  .api-carousel-component .text-content-item :deep(p) {
    font-size: 0.9rem !important;
  }
}

/* Ajustes para tablets */
@media (min-width: 600px) and (max-width: 1023px) {
  .api-carousel-component .component-title {
    font-size: 1.8rem !important;
  }
  
  .api-carousel-component .text-content-item :deep(h3) {
    font-size: 1.3rem !important;
  }
}
</style>
