<template>
  <div>
    <div v-if="loading" class="flex flex-center q-pa-xl full-height">
      <q-spinner color="primary" size="3em" />
    </div>
    
    <div v-else-if="error" class="text-center q-pa-xl full-height">
      <div class="text-negative text-h6">{{ error }}</div>
    </div>
    
    <div v-else style="width: 100vw; position: relative; left: 50%; right: 50%; margin-left: -50vw; margin-right: -50vw; padding: 0;">
      <!-- Hero Banner con imagen de fondo y video en esquina -->
      <div v-if="showCarousel && carouselData && carouselData.images && carouselData.images.length > 0" class="relative-position full-width shadow-10" style="overflow: hidden;">
        <q-carousel
          v-model="slide"
          animated
          arrows
          navigation
          infinite
          swipeable
          control-color="white"
          navigation-icon="circle"
          style="overflow: hidden; width: 100%; height: 100vh; min-height: 600px; max-height: 100vh;"
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
            class="relative-position full-height full-width"
          >
            <!-- Imagen de fondo a pantalla completa -->
            <div class="absolute-full" style="z-index: 1;">
              <q-img 
                :src="getImageUrl(item.image)" 
                spinner-color="primary"
                class="full-height full-width"
                fit="cover"
              />
            </div>
            
            <!-- Overlay con gradiente para legibilidad del texto -->
            <div class="absolute-full" style="z-index: 2; background: linear-gradient(90deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.65) 40%, rgba(0,0,0,0.4) 100%);"></div>
            
            <!-- Contenido superpuesto con layout moderno -->
            <div class="absolute-full" style="z-index: 3; padding: 0;">
              <div class="relative-position full-width full-height column justify-between">
                <!-- Texto principal del Hero Banner -->
                <div 
                  class="absolute-bottom-left q-mb-xl q-ml-xl" 
                  style="max-width: 650px;"
                  :class="{
                    'absolute-bottom text-center q-mb-xl self-center': $q.screen.lt.md,
                    'q-mx-auto': $q.screen.lt.md
                  }"
                  :style="{
                    'max-width': $q.screen.lt.md ? '85%' : '650px',
                    'bottom': $q.screen.lt.sm ? '30%' : $q.screen.lt.md ? '25%' : '10%',
                  }"
                >
                  <h2 
                    v-if="item.caption" 
                    class="text-white text-weight-bold q-ma-none" 
                    style="text-shadow: 2px 2px 4px rgba(0,0,0,0.5); letter-spacing: -1px;"
                    :class="{
                      'text-h2': $q.screen.gt.lg,
                      'text-h3': $q.screen.gt.md && !$q.screen.gt.lg,
                      'text-h4': $q.screen.gt.sm && !$q.screen.gt.md,
                      'text-h5': $q.screen.gt.xs && !$q.screen.gt.sm,
                      'text-h6': !$q.screen.gt.xs
                    }"
                  >
                    {{ item.caption }}
                  </h2>
                </div>
                
                <!-- Video miniatura en esquina opuesta -->
                <div 
                  v-if="showVideo && videoData && videoData.video_url && videoData.mostrar_video !== false" 
                  class="absolute-bottom-right q-mb-xl q-mr-xl shadow-15 overflow-hidden rounded-borders" 
                  style="z-index: 4;"
                  :class="{
                    'absolute-bottom text-center q-mb-xl self-center': $q.screen.lt.md
                  }"
                  :style="{
                    'width': $q.screen.lt.md ? '65%' : '32%',
                    'max-width': $q.screen.lt.md ? '450px' : '420px',
                    'min-width': '250px',
                    'right': $q.screen.lt.md ? '50%' : '5%',
                    'transform': $q.screen.lt.md ? 'translateX(50%)' : 'none',
                    'bottom': $q.screen.lt.sm ? '15%' : '10%',
                    'width': $q.screen.lt.sm ? '85%' : $q.screen.lt.md ? '65%' : '32%'
                  }"
                >
                  <div class="relative-position" style="padding-bottom: 56.25%; height: 0; overflow: hidden;">
                    <iframe
                      :src="processVideoUrl(videoData.video_url)"
                      frameborder="0"
                      allowfullscreen
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      class="absolute-full"
                      style="width: 100%; height: 100%; border: 0;"
                    ></iframe>
                  </div>
                </div>
              </div>
            </div>
          </q-carousel-slide>
        </q-carousel>
      </div>
      
      <!-- Contenido de texto -->
      <div v-if="showParagraphs && paragraphsData && paragraphsData.length > 0" class="q-mt-xl q-mx-auto" style="max-width: 800px; padding: 0 1.5rem;">
        <div v-for="(paragraph, index) in paragraphsData" :key="index" class="q-mb-lg text-body1">
          <div v-html="processedParagraphs[index]" class="q-my-md"></div>
        </div>
      </div>
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

// Procesar los párrafos para aplicar estilos de Quasar
const processedParagraphs = computed(() => {
  if (!paragraphsData.value || !Array.isArray(paragraphsData.value)) return [];
  
  return paragraphsData.value.map(paragraph => {
    if (!paragraph.value) return '';
    
    // Reemplazar las etiquetas HTML con clases de Quasar
    let processed = paragraph.value
      // Headings
      .replace(/<h1([^>]*)>/g, '<h1 class="text-h3 text-weight-bold q-my-md text-certiffy-azul"$1>')
      .replace(/<h2([^>]*)>/g, '<h2 class="text-h4 text-weight-bold q-my-md text-certiffy-azul"$1>')
      .replace(/<h3([^>]*)>/g, '<h3 class="text-h5 text-weight-bold q-my-md text-certiffy-azul"$1>')
      .replace(/<h4([^>]*)>/g, '<h4 class="text-h6 text-weight-bold q-my-md text-certiffy-azul"$1>')
      // Paragraphs
      .replace(/<p([^>]*)>/g, '<p class="text-body1 q-my-md"$1>')
      // Lists
      .replace(/<ul([^>]*)>/g, '<ul class="q-ml-md q-my-md"$1>')
      .replace(/<ol([^>]*)>/g, '<ol class="q-ml-md q-my-md"$1>')
      .replace(/<li([^>]*)>/g, '<li class="q-my-sm"$1>')
      // Links
      .replace(/<a([^>]*)>/g, '<a class="text-certiffy-verde text-weight-medium q-transition"$1>')
      // Images
      .replace(/<img([^>]*)>/g, '<img class="rounded-borders q-my-md shadow-2"$1>');
    
    return processed;
  });
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


