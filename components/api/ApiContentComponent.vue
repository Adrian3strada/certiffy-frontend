<template>
  <div class="api-content-component q-pa-md">
    <!-- Cargando -->
    <div v-if="loading" class="text-center q-pa-lg">
      <q-spinner color="primary" size="3em" />
      <div class="q-mt-md text-h6">Cargando contenido...</div>
    </div>
    
    <!-- Error -->
    <div v-else-if="error" class="text-center q-pa-lg">
      <q-icon name="error" size="3em" color="negative" />
      <div class="q-mt-md text-h6 text-negative">Error al cargar el contenido</div>
      <div class="q-mt-sm text-body1">{{ error }}</div>
      <div class="q-mt-md">
        <q-btn color="primary" label="Reintentar" @click="fetchData" />
      </div>
    </div>
    
    <!-- Contenido cargado correctamente -->
    <div v-else>
      <!-- Título de la página -->
      <div v-if="pageTitle" class="text-center q-mb-xl">
        <h1 class="text-h4 text-weight-bold q-my-none">{{ pageTitle }}</h1>
      </div>
      
      <!-- Contenido dinámico basado en los bloques -->
      <template v-if="blocks && blocks.length > 0">
        <div v-for="(block, index) in blocks" :key="block.id || index" class="block-wrapper q-mb-lg">
          <!-- Carrusel -->
          <template v-if="block.type === 'carousel' && showCarousel">
            <q-card flat bordered class="carousel-card q-mb-lg shadow-2" v-if="block.value && block.value.images && block.value.images.length > 0">
              <q-carousel
                v-model="activeSlides[index]"
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
                :height="getCarouselHeight"
                :autoplay="autoplayDuration"
                @mouseenter="pauseAutoplay(index)"
                @mouseleave="resumeAutoplay(index)"
              >
                <q-carousel-slide 
                  v-for="(item, slideIndex) in block.value.images" 
                  :key="slideIndex" 
                  :name="slideIndex" 
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
          </template>
          
          <!-- Párrafos de texto -->
          <template v-else-if="block.type === 'paragraph' && showParagraphs">
            <div class="paragraph-block q-my-md">
              <div v-html="block.value" class="text-content-item"></div>
            </div>
          </template>
          
          <!-- Video -->
          <template v-else-if="block.type === 'video' && showVideo">
            <ApiVideoComponent 
              :videoData="block.value" 
              :aspectRatio="videoAspectRatio"
              :spinnerColor="spinnerColor"
              :showControls="showVideoControls"
              @video-loaded="handleVideoLoaded"
              @video-error="handleVideoError"
            />
          </template>
        </div>
      </template>
      
      <!-- Mensaje cuando no hay bloques -->
      <div v-else class="text-center q-pa-xl">
        <q-icon name="info" size="3rem" color="grey-7" />
        <p class="text-subtitle1 q-mt-md">No hay contenido disponible</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import ApiVideoComponent from './ApiVideoComponent.vue';
import { useWagtailApi } from '~/composables/useWagtailApi';

const props = defineProps({
  // URL de la API (opcional si se proporcionan datos directamente)
  apiUrl: {
    type: String,
    default: ''
  },
  // Datos directos (alternativa a apiUrl)
  pageData: {
    type: Object,
    default: null
  },
  // Datos de respaldo para cuando la API no esté disponible
  fallbackData: {
    type: Object,
    default: null
  },
  // Configuración del carrusel
  showCarousel: {
    type: Boolean,
    default: true
  },
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
  autoplayDuration: {
    type: Number,
    default: 5000
  },
  // Configuración de párrafos
  showParagraphs: {
    type: Boolean,
    default: true
  },
  // Configuración de video
  showVideo: {
    type: Boolean,
    default: true
  },
  videoAspectRatio: {
    type: Number,
    default: 16/9
  },
  showVideoControls: {
    type: Boolean,
    default: true
  },
  spinnerColor: {
    type: String,
    default: 'primary'
  },
  // Función personalizada para obtener URL de imágenes
  customImageUrlFunction: {
    type: Function,
    default: null
  }
});

// Emitir eventos
const emit = defineEmits(['data-loaded', 'data-error', 'video-loaded', 'video-error']);

// Si se usa apiUrl, obtener el composable de la API de Wagtail
const { getDataFromUrl, loading: apiLoading, error: apiError } = useWagtailApi();

// Variables reactivas
const loading = ref(props.apiUrl ? true : false);
const error = ref(null);
const pageTitle = ref('');
const blocks = ref([]);
const windowWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 1024);
const activeSlides = ref({});
const autoplayStates = ref({});

// Altura del carrusel según el tamaño de la pantalla
const getCarouselHeight = computed(() => {
  if (windowWidth.value < 600) {
    return props.carouselHeightMobile;
  } else if (windowWidth.value < 1024) {
    return props.carouselHeightTablet;
  } else {
    return props.carouselHeightDesktop;
  }
});

// Función para obtener la URL de la imagen
const getImageUrl = (imageId) => {
  // Si hay una función personalizada, usarla
  if (props.customImageUrlFunction) {
    return props.customImageUrlFunction(imageId);
  }
  
  // Por defecto, usar una imagen de placeholder
  return `https://via.placeholder.com/800x450?text=Image+${imageId}`;
};

// Funciones para controlar el autoplay del carrusel
const pauseAutoplay = (index) => {
  autoplayStates.value[index] = 0;
};

const resumeAutoplay = (index) => {
  autoplayStates.value[index] = props.autoplayDuration;
};

// Actualizar el ancho de la ventana cuando cambia el tamaño
const handleResize = () => {
  if (typeof window !== 'undefined') {
    windowWidth.value = window.innerWidth;
  }
};

// Procesar los datos recibidos
const processData = (data) => {
  if (!data) {
    error.value = 'No se recibieron datos';
    return;
  }
  
  // Establecer el título de la página
  pageTitle.value = data.title || '';
  
  // Procesar los bloques
  if (data.body && Array.isArray(data.body)) {
    blocks.value = data.body;
    
    // Inicializar estados para cada carrusel
    data.body.forEach((block, index) => {
      if (block.type === 'carousel') {
        activeSlides.value[index] = 0;
        autoplayStates.value[index] = props.autoplayDuration;
      }
    });
    
    // Emitir evento de datos cargados
    emit('data-loaded', { pageTitle: pageTitle.value, blocks: blocks.value });
  } else {
    blocks.value = [];
    error.value = 'No se encontraron bloques de contenido';
  }
};

// Obtener datos de la API o usar datos proporcionados directamente
const fetchData = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    // Si se proporcionan datos directamente a través de props
    if (props.pageData) {
      console.log('Usando datos proporcionados directamente:', props.pageData);
      processData(props.pageData);
    } 
    // Si se proporciona una URL de API
    else if (props.apiUrl) {
      console.log('Intentando obtener datos de la API desde:', props.apiUrl);
      
      // Usar el método getDataFromUrl del composable useWagtailApi
      // que internamente usa useFetch de Nuxt como recomendó el encargado del proyecto
      const data = await getDataFromUrl(props.apiUrl);
      console.log('Datos recibidos de la API:', data);
      
      if (!data) {
        throw new Error('No se recibieron datos de la API');
      }
      
      processData(data);
    } else {
      throw new Error('No se proporcionaron datos ni URL de API');
    }
  } catch (err) {
    console.error('Error al obtener/procesar datos:', err);
    error.value = `Error al cargar los datos: ${err.message}`;
    emit('data-error', err);
  } finally {
    loading.value = false;
  }
};

// Manejadores de eventos de video
const handleVideoLoaded = (videoData) => {
  emit('video-loaded', videoData);
};

const handleVideoError = (err) => {
  emit('video-error', err);
};

// Observar cambios en pageData
watch(() => props.pageData, (newData) => {
  if (newData) {
    processData(newData);
  }
}, { deep: true, immediate: true });

// Agregar y eliminar el event listener para el cambio de tamaño
onMounted(() => {
  if (typeof window !== 'undefined') {
    window.addEventListener('resize', handleResize);
    
    // Si se proporciona una URL de API, obtener los datos
    if (props.apiUrl) {
      fetchData();
    }
    // Si se proporcionan datos directamente, procesarlos
    else if (props.pageData) {
      processData(props.pageData);
    }
  }
});

// Limpiar event listeners
const onUnmounted = () => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', handleResize);
  }
};
</script>

<style scoped>
.api-content-component {
  width: 100%;
}

.carousel-card {
  transition: all 0.3s ease;
  border-radius: 8px !important;
}

.carousel-card:hover {
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1) !important;
}

.media-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border-radius: 4px;
  overflow: hidden;
}

.media-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.bg-dark-transparent {
  background-color: rgba(0, 0, 0, 0.7);
}

/* Estilos para el contenido HTML de los párrafos */
.text-content-item :deep(h3) {
  font-size: 1.5rem;
  line-height: 1.5;
  margin-bottom: 1rem;
}

.text-content-item :deep(p) {
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.text-content-item :deep(b), 
.text-content-item :deep(strong) {
  font-weight: 600;
}

.text-content-item :deep(i), 
.text-content-item :deep(em) {
  font-style: italic;
}

.paragraph-block {
  transition: transform 0.3s ease;
  padding: 1rem;
  border-radius: 8px;
}

.paragraph-block:hover {
  background-color: rgba(0, 0, 0, 0.02);
  transform: translateY(-2px);
}

/* Responsive */
@media (max-width: 599px) {
  .text-content-item :deep(h3) {
    font-size: 1.2rem !important;
  }
  
  .text-content-item :deep(p) {
    font-size: 0.9rem !important;
  }
  
  .carousel-slide {
    padding: 8px !important;
  }
}

@media (min-width: 600px) and (max-width: 1023px) {
  .text-content-item :deep(h3) {
    font-size: 1.3rem !important;
  }
}
</style>
