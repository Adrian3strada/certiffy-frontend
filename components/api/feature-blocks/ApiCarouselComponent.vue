<template>
  <section :id="'carousel-' + (block?.id || uniqueId)" class="carousel-component full-width" :style="{ height: carouselHeight, width: '100%' }">
    <div v-if="loading" class="flex flex-center q-pa-xl" :style="{ height: carouselHeight, width: '100%' }">
      <q-spinner color="primary" size="3em" />
    </div>
    
    <div v-else-if="error" class="text-center q-pa-xl" :style="{ height: carouselHeight, width: '100%' }">
      <div class="text-negative text-h6">{{ error }}</div>
    </div>
    
    <div v-else class="q-ma-none q-pa-none">
      <!-- Hero Banner con imagen de fondo y video en esquina -->
      <div v-if="showCarousel && carouselData && carouselData.images && carouselData.images.length > 0" 
           class="relative-position full-width shadow-10 overflow-hidden">
        <q-carousel
          v-model="slide"
          animated
          arrows
          navigation
          infinite
          swipeable
          control-color="white"
          navigation-icon="circle"
          :autoplay="autoplay"
          @mouseenter="autoplay = false"
          @mouseleave="autoplay = 10000"
          :height="carouselHeight"
          transition-prev="slide-right"
          transition-next="slide-left"
          navigation-position="bottom"
          class="custom-carousel full-width"
          flat
        >
          <q-carousel-slide 
            v-for="(item, index) in carouselData.images" 
            :key="index" 
            :name="index" 
            class="relative-position full-height full-width q-ma-none q-pa-none"
          >
            <!-- Imagen de fondo a pantalla completa -->
            <div class="absolute-full">
              <q-img 
                :src="getImageUrl(item.image)" 
                spinner-color="primary"
                class="full-height full-width"
                fit="cover"
                position="center"
              />
            </div>
            
            <!-- Overlay con gradiente responsivo -->
            <div 
              class="absolute-full" 
              :style="overlayGradientStyle"
            ></div>
            
            <!-- Contenido superpuesto con layout responsivo -->
            <div class="absolute-full q-pa-none">
              <div class="relative-position full-width full-height column justify-between q-ma-none">
                
                <!-- Texto principal del Hero Banner -->
                <div 
                  class="text-white text-weight-bold q-ma-none"
                  :class="heroTextPositionClasses"
                  :style="heroTextStyles"
                >
                  <h2 
                    v-if="item.caption" 
                    class="text-white text-weight-bold q-ma-none q-pa-md"
                    :class="heroTitleClasses"
                    :style="heroTitleStyles"
                  >
                    {{ item.caption }}
                  </h2>
                </div>
                
                <!-- Video miniatura en esquina opuesta (clickable para modal) -->
                <div 
                  v-if="shouldShowVideo" 
                  :class="videoContainerClasses"
                  :style="videoContainerStyles"
                >
                  <div class="relative-position" :style="videoWrapperStyles">
                    <iframe
                      :src="processVideoUrl(getVideoUrl(), true)"
                      frameborder="0"
                      allowfullscreen
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      class="absolute-full"
                      style="width: 100%; height: 100%; border: 0;"
                    ></iframe>
                    
                    <!-- Overlay con botón "Watch" -->
                    <div 
                      class="absolute-full flex flex-center cursor-pointer" 
                      @click="openMainVideoModal"
                    >
                      <q-btn 
                        rounded 
                        color="white" 
                        text-color="grey-8" 
                        :class="watchButtonClasses"
                        :style="watchButtonStyles"
                      >
                        <div class="row items-center no-wrap">
                          <q-icon name="play_arrow" :size="iconSize" class="q-mr-sm" />
                          <span class="text-weight-bold" :class="watchTextClasses">Watch</span>
                        </div>
                      </q-btn>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </q-carousel-slide>
        </q-carousel>

        <!-- Modal para el video principal -->
        <q-dialog 
          v-model="mainVideoModalOpen" 
          persistent 
          @hide="currentMainVideoUrl = ''" 
          transition-show="scale"
          transition-hide="scale"
          :maximized="$q.screen.lt.md"
          :full-width="$q.screen.gt.sm"
          :full-height="$q.screen.gt.sm"
        >
          <q-card class="bg-dark full-width" :class="modalClasses" :style="modalStyles">
            <q-card-section class="q-pa-none relative-position full-width">
              <q-btn 
                round 
                flat 
                icon="close" 
                color="white" 
                class="absolute-top-right q-ma-md" 
                :size="$q.screen.lt.sm ? 'md' : 'lg'"
                v-close-popup 
                style="z-index: 10;"
              />
              <q-responsive :ratio="16/9" class="shadow-10 full-width">
                <iframe
                  :src="currentMainVideoUrl"
                  frameborder="0"
                  allowfullscreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  class="full-width full-height"
                  style="border: 0;"
                ></iframe>
              </q-responsive>
            </q-card-section>
          </q-card>
        </q-dialog>
      </div>
      
      <!-- Contenido de texto -->
      <div 
        v-if="showParagraphs && paragraphsData && paragraphsData.length > 0" 
        :class="contentContainerClasses"
        :style="contentContainerStyles"
      >
        <div v-for="(paragraph, index) in paragraphsData" :key="index" class="q-mb-lg text-body1">
          <div v-html="processedParagraphs[index]" class="q-my-md"></div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
  import { ref, computed, onMounted, onUnmounted } from 'vue';

  // ID único para este componente
  const uniqueId = 'carousel-' + Math.random().toString(36).substring(2, 9);
  import { useQuasar } from 'quasar';
  import { useWagtailApi } from '~/composables/useWagtailApi';

  const props = defineProps({
    block: {
      type: Object,
      required: true
    },
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
      default: '70vh'
    },
    carouselHeightTablet: {
      type: String,
      default: '80vh'
    },
    carouselHeightDesktop: {
      type: String,
      default: '100vh'
    },
    // Tiempo de autoplay para el carrusel (opcional)
    autoplayDuration: {
      type: Number,
      default: 10000 // 10 segundos por defecto
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
  const { getDataFromUrl, isLoading: apiLoading, error: apiError } = useWagtailApi();

  // Variables reactivas
  const $q = useQuasar();
  const mainVideoModalOpen = ref(false);
  const currentMainVideoUrl = ref('');
  const slide = ref(0);
  const autoplay = ref(props.autoplayDuration);
  const windowWidth = ref(window.innerWidth);
  const loading = computed(() => apiLoading.value);
  const error = computed(() => apiError.value);
  const pageData = ref(null);
  const carouselData = ref(null);
  const paragraphsData = ref([]);
  const videoData = ref(null);

  // Computadas para responsividad
  const carouselHeight = computed(() => {
    if ($q.screen.lt.sm) { // Móviles pequeños
      return props.carouselHeightMobile;
    } else if ($q.screen.lt.md) { // Tablets
      return props.carouselHeightTablet;
    } else { // Pantallas grandes
      return props.carouselHeightDesktop;
    }
  });

  const carouselStyles = computed(() => ({
    overflow: 'hidden',
    width: '100%',
    height: carouselHeight.value,
    minHeight: $q.screen.lt.sm ? '50vh' : $q.screen.lt.md ? '60vh' : '100vh',
    maxHeight: $q.screen.gt.md ? '100vh' : 'none'
  }));

  // Estilos para el overlay gradient
  const overlayGradientStyle = computed(() => {
    if ($q.screen.lt.sm) {
      return {
        background: 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 60%, rgba(0,0,0,0.9) 100%)'
      };
    } else if ($q.screen.lt.md) {
      return {
        background: 'linear-gradient(135deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.5) 100%)'
      };
    } else {
      return {
        background: 'linear-gradient(90deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.65) 40%, rgba(0,0,0,0.4) 100%)'
      };
    }
  });

  // Clases para posicionamiento del texto hero
  const heroTextPositionClasses = computed(() => {
    if ($q.screen.gt.md) {
      return ['absolute-bottom-left', 'q-mb-xl', 'q-ml-xl'];
    } else {
      return ['absolute-bottom', 'text-center', 'q-mb-lg', 'q-mx-md', 'q-px-md'];
    }
  });

  const heroTextStyles = computed(() => ({
    maxWidth: $q.screen.lt.sm ? '90%' : $q.screen.lt.md ? '85%' : '650px',
    bottom: $q.screen.lt.sm ? '25%' : $q.screen.lt.md ? '20%' : '10%',
    left: $q.screen.lt.sm && $q.screen.gt.md ? '50%' : ($q.screen.lt.md ? '50%' : 'auto'),
    transform: $q.screen.lt.lg ? 'translateX(-50%)' : 'none',
    zIndex: 3
  }));

  const heroTitleClasses = computed(() => {
    if ($q.screen.lt.sm) {
      return ['text-h6'];
    } else if ($q.screen.lt.md) {
      return ['text-h5'];
    } else if ($q.screen.lt.lg) {
      return ['text-h4'];
    } else if ($q.screen.lt.xl) {
      return ['text-h3'];
    } else {
      return ['text-h2'];
    }
  });

  const heroTitleStyles = computed(() => ({
    textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
    letterSpacing: '-1px',
    lineHeight: $q.screen.lt.sm ? '1.3' : $q.screen.lt.md ? '1.25' : '1.2'
  }));

  const shouldShowVideo = computed(() => {
    return props.showVideo && 
      props.carouselData && 
      ((props.carouselData.value && props.carouselData.value.mostrar_video && props.carouselData.value.teaser_video_url) || 
      (props.carouselData.mostrar_video && props.carouselData.teaser_video_url));
  });

  const videoContainerClasses = computed(() => {
    const baseClasses = ['shadow-15', 'overflow-hidden', 'rounded-borders'];
    
    if ($q.screen.gt.md) {
      return [...baseClasses, 'absolute-bottom-right', 'q-mb-xl', 'q-mr-xl'];
    } else {
      return [...baseClasses, 'absolute-bottom', 'q-mb-lg', 'self-center'];
    }
  });

  const videoContainerStyles = computed(() => ({
    zIndex: 4,
    width: $q.screen.lt.sm ? '80%' : $q.screen.lt.md ? '70%' : $q.screen.lt.lg ? '60%' : '32%',
    maxWidth: $q.screen.lt.md ? '350px' : '420px',
    minWidth: $q.screen.lt.sm ? '200px' : '250px',
    right: $q.screen.lt.lg ? '50%' : '5%',
    transform: $q.screen.lt.lg ? 'translateX(50%)' : 'none',
    bottom: $q.screen.lt.sm ? '10%' : $q.screen.lt.md ? '15%' : '10%'
  }));

  const videoWrapperStyles = computed(() => ({
    paddingBottom: '56.25%',
    height: '0',
    overflow: 'hidden'
  }));

  const watchButtonClasses = computed(() => {
    const baseClasses = ['shadow-5'];
    
    if ($q.screen.lt.sm) {
      return [...baseClasses, 'q-px-sm'];
    } else {
      return [...baseClasses, 'q-px-md'];
    }
  });

  const watchButtonStyles = computed(() => ({
    borderRadius: '18px',
    transition: 'all 0.3s ease'
  }));

  const watchTextClasses = computed(() => {
    return $q.screen.lt.sm ? ['text-caption'] : ['text-body2'];
  });

  const iconSize = computed(() => {
    return $q.screen.lt.sm ? 'sm' : 'md';
  });

  const modalClasses = computed(() => {
    const baseClasses = [];
    
    if ($q.screen.lt.md) {
      return [...baseClasses, 'full-width'];
    } else {
      return baseClasses;
    }
  });

  const modalStyles = computed(() => {
    if ($q.screen.gt.sm) {
      return {
        width: '95vw',
        maxWidth: '1400px'
      };
    }
    return {};
  });

  const contentContainerClasses = computed(() => {
    return ['q-mx-auto'];
  });

  const contentContainerStyles = computed(() => ({
    marginTop: $q.screen.lt.sm ? '2rem' : '3rem',
    maxWidth: '800px',
    padding: $q.screen.lt.sm ? '0 1rem' : '0 1.5rem'
  }));

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
        .replace(/<h1([^>]*)>/g, '<h1 class="text-h3 text-weight-bold q-my-md text-primary"$1>')
        .replace(/<h2([^>]*)>/g, '<h2 class="text-h4 text-weight-bold q-my-md text-primary"$1>')
        .replace(/<h3([^>]*)>/g, '<h3 class="text-h5 text-weight-bold q-my-md text-primary"$1>')
        .replace(/<h4([^>]*)>/g, '<h4 class="text-h6 text-weight-bold q-my-md text-primary"$1>')
        // Paragraphs
        .replace(/<p([^>]*)>/g, '<p class="text-body1 q-my-md"$1>')
        // Lists
        .replace(/<ul([^>]*)>/g, '<ul class="q-ml-md q-my-md"$1>')
        .replace(/<ol([^>]*)>/g, '<ol class="q-ml-md q-my-md"$1>')
        .replace(/<li([^>]*)>/g, '<li class="q-my-sm"$1>')
        // Links
        .replace(/<a([^>]*)>/g, '<a class="text-secondary text-weight-medium q-transition"$1>')
        // Images
        .replace(/<img([^>]*)>/g, '<img class="rounded-borders q-my-md shadow-2"$1>');
      
      return processed;
    });
  });

  // Función para obtener la URL del video
  const getVideoUrl = () => {
    return props.carouselData?.value?.teaser_video_url || props.carouselData?.teaser_video_url;
  };

  // Actualizar el ancho de la ventana cuando cambia el tamaño
  const handleResize = () => {
    windowWidth.value = window.innerWidth;
  };

  // Abrir modal del video principal
  const openMainVideoModal = () => {
    const mainVideoUrl = props.carouselData?.value?.main_video_url || props.carouselData?.main_video_url;
    if (mainVideoUrl) {
      // Para el video principal, no lo silenciamos y mostramos controles
      currentMainVideoUrl.value = processVideoUrl(mainVideoUrl, false);
      mainVideoModalOpen.value = true;
    } else {
      console.warn('No main_video_url found in carouselData');
    }
  };

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
  const processVideoUrl = (url, muteVideo = true) => {
    if (!url) return '';

    const youtubeVideoId = getYouTubeVideoId(url);

    if (youtubeVideoId) { // Es YouTube
      let params;
      if (muteVideo) { // Teaser video
        params = `autoplay=1&mute=1&loop=1&playlist=${youtubeVideoId}&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1`;
      } else { // Main video en modal
        params = `autoplay=1&controls=1&showinfo=1&rel=0`;
      }
      return `https://www.youtube.com/embed/${youtubeVideoId}?${params}`;
    } else if (url.includes('vimeo.com')) { // Es Vimeo
      const vimeoVideoIdMatch = url.match(/vimeo.com\/(?:video\/)?(\d+)/);
      if (vimeoVideoIdMatch && vimeoVideoIdMatch[1]) {
        const vimeoVideoId = vimeoVideoIdMatch[1];
        let params;
        if (muteVideo) { // Teaser video
          params = `autoplay=1&muted=1&loop=1&background=1`; // background=1 oculta controles y es para autoplay
        } else { // Main video en modal
          params = `autoplay=1&title=0&byline=0&portrait=0`; // Muestra controles, permite sonido
        }
        return `https://player.vimeo.com/video/${vimeoVideoId}?${params}`;
      }
    }
    
    // Si no es YouTube ni Vimeo, o no se pudo procesar, devolver la URL original (o manejar error)
    console.warn('Could not process video URL:', url);
    return url; // O retornar un string vacío o una URL de error
  };

  // Función auxiliar para extraer el ID de video de YouTube
  const getYouTubeVideoId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : '';
  };

  // Función para obtener los datos de la API o usar los datos proporcionados directamente
  const fetchData = async () => {
    console.log('[ApiCarouselComponent] carouselData:', props.carouselData);
    try {
      // Si tenemos datos proporcionados directamente como props, usarlos
      if (props.carouselData) {
        console.log('Usando datos de carrusel proporcionados directamente:', props.carouselData);
        carouselData.value = props.carouselData;
        
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

<style>
/* Navegación del carousel */
.custom-carousel .q-carousel__navigation {
  padding: 60px 0;
  background: rgba(0, 0, 0, 0.2);
  width: 100%;
}

.custom-carousel .q-carousel__navigation-icon {
  font-size: 10px;
}

/* Hacer que el componente cubra toda la pantalla incluyendo la barra lateral */
.carousel-component {
  width: 100vw !important;
  margin-left: calc(-50vw + 50%);
  margin-right: calc(-50vw + 48%); /* Ajuste para cubrir la barra lateral */
  position: relative;
  left: 0;
  right: 0;
}
</style>