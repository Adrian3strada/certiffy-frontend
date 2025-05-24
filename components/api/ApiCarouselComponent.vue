<template>
  <section class="api-carousel-component q-py-xl q-px-md">
    <div class="q-mx-auto" style="max-width: 1200px">
      <div v-if="loading" class="flex flex-center q-pa-xl">
        <q-spinner color="primary" size="3em" />
      </div>
      
      <div v-else-if="error" class="text-center q-pa-xl">
        <div class="text-negative text-h6">{{ error }}</div>
      </div>
      
      <div v-else>
        <!-- Título de la página -->
        <div class="text-center q-mb-xl">
          <div class="component-title text-h4 text-weight-bold">{{ displayTitle }}</div>
        </div>
        
        <!-- Carrusel de imágenes -->
        <div v-if="showCarousel && carouselData && carouselData.images && carouselData.images.length > 0">
          <q-card flat bordered class="carousel-card q-mb-lg shadow-2">
            <q-carousel
              v-model="slide"
              animated
              arrows
              navigation
              infinite
              swipeable
              control-color="primary"
              control-type="unelevated"
              control-text-color="white"
              navigation-icon="circle"
              padding
              class="bg-white rounded-borders"
              :autoplay="autoplay"
              @mouseenter="autoplay = false"
              @mouseleave="autoplay = props.autoplayDuration"
              :height="carouselHeight"
            >
              <q-carousel-slide 
                v-for="(item, index) in carouselData.images" 
                :key="index" 
                :name="index" 
                class="column no-wrap carousel-slide"
              >
                <div class="q-pa-md full-height">
                  <div class="row items-center justify-center q-col-gutter-md full-height">
                    <div class="col-12">
                      <q-card class="media-card overflow-hidden">
                        <q-img 
                          :src="getImageUrl(item.image)" 
                          :ratio="16/9"
                          spinner-color="primary"
                          spinner-size="40px"
                          class="item-image"
                        >
                          <div v-if="item.caption" class="absolute-bottom text-subtitle1 text-center bg-dark-transparent q-pa-sm">
                            {{ item.caption }}
                          </div>
                        </q-img>
                      </q-card>
                    </div>
                  </div>
                </div>
              </q-carousel-slide>
            </q-carousel>
          </q-card>
        </div>
        
        <!-- Contenido de texto -->
        <div v-if="showParagraphs && paragraphsData && paragraphsData.length > 0" class="text-content q-mt-xl">
          <div v-for="(paragraph, index) in paragraphsData" :key="index" class="q-mb-lg">
            <div v-html="paragraph.value" class="text-content-item"></div>
          </div>
        </div>
        
        <!-- Video embebido -->
        <div v-if="showVideo && videoData && videoData.video_url" class="video-section q-mt-xl">
          <q-card flat bordered class="q-pa-md q-mb-lg shadow-1">
            <div class="video-container q-pa-none">
              <iframe
                :src="videoData.video_url"
                frameborder="0"
                allowfullscreen
                class="video-iframe"
              ></iframe>
            </div>
          </q-card>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useWagtailApi } from '~/composables/useWagtailApi';

const props = defineProps({
  // URL de la API para obtener los datos
  apiUrl: {
    type: String,
    required: true
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
const getImageUrl = (imageId) => {
  // Si hay una función personalizada para obtener la URL, usarla
  if (props.customImageUrlFunction) {
    return props.customImageUrlFunction(imageId);
  }
  
  // Por defecto, usar una imagen de placeholder
  return `https://via.placeholder.com/800x450?text=Image+${imageId}`;
};

// Función para obtener los datos de la API
const fetchData = async () => {
  try {
    // Usar el método getDataFromUrl del composable useWagtailApi
    const data = await getDataFromUrl(props.apiUrl);
    
    if (data) {
      pageData.value = {
        id: data.id,
        title: data.title,
        meta: data.meta
      };
      
      // Procesar los bloques de contenido
      if (data.body && Array.isArray(data.body)) {
        // Encontrar el carrusel
        const carouselBlock = data.body.find(block => block.type === 'carousel');
        if (carouselBlock) {
          carouselData.value = carouselBlock.value;
        }
        
        // Encontrar los párrafos
        paragraphsData.value = data.body.filter(block => block.type === 'paragraph');
        
        // Encontrar el video
        const videoBlock = data.body.find(block => block.type === 'video');
        if (videoBlock) {
          videoData.value = videoBlock.value;
        }
      }
      
      // Emitir evento de datos cargados
      emit('data-loaded', { pageData: pageData.value, carouselData: carouselData.value, paragraphsData: paragraphsData.value, videoData: videoData.value });
    }
  } catch (err) {
    console.error('Error fetching API data:', err);
    // Emitir evento de error
    emit('data-error', err);
  }
};
</script>

<style scoped>
.api-carousel-component .carousel-card {
  transition: all 0.3s ease;
}

.api-carousel-component .media-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.api-carousel-component .media-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.api-carousel-component .video-container {
  position: relative;
  padding-bottom: 56.25%;
  height: 0;
  overflow: hidden;
}

.api-carousel-component .video-iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.bg-dark-transparent {
  background-color: rgba(0, 0, 0, 0.7);
}

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
