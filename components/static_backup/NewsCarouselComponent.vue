<template>
  <section class="news-carousel-component q-py-xl q-px-md">
    <div class="q-mx-auto" style="max-width: 1200px">
      <div class="text-center q-mb-xl">
        <div class="component-title text-h4 text-weight-bold">{{ title }}</div>
      </div>
      
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
          @mouseleave="autoplay = 5000"
          :height="carouselHeight"
        >
          <q-carousel-slide v-for="(item, index) in items" :key="index" :name="index" class="column no-wrap carousel-slide">
            <div class="q-pa-md full-height">
              <div class="row items-center justify-evenly q-col-gutter-md full-height">
                <!-- Imagen o thumbnail de video -->
                <div class="col-12 col-lg-6 q-mb-md-lg">
                  <q-card class="media-card overflow-hidden">
                    <q-img 
                      :src="item.image" 
                      :ratio="16/9"
                      spinner-color="primary"
                      spinner-size="40px"
                      class="item-image"
                    >
                      <div v-if="item.videoUrl" class="absolute-center">
                        <q-btn
                          round
                          unelevated
                          color="primary"
                          icon="play_arrow"
                          size="lg"
                          @click.stop="openVideo(item.videoUrl)" 
                          class="play-button"
                        />
                      </div>
                    </q-img>
                    <q-card-section v-if="item.videoLabel" class="video-label q-pt-xs text-center text-caption">
                      {{ item.videoLabel }}
                    </q-card-section>
                  </q-card>
                </div>
                
                <!-- Contenido de texto -->
                <div class="col-12 col-lg-6">
                  <q-card flat bordered class="content-card q-pa-md h-100">
                    <q-card-section>
                      <div class="item-title text-h5 text-weight-bold q-mb-md">{{ item.title }}</div>
                      <div class="item-description text-body1 q-mb-lg">{{ item.description }}</div>
                    </q-card-section>
                    
                    <q-card-actions vertical align="center" v-if="item.buttonLabel">
                      <q-btn 
                        color="primary" 
                        :label="item.buttonLabel" 
                        :to="item.buttonUrl"
                        unelevated
                        rounded
                        class="action-button q-px-xl q-py-sm"
                      />
                    </q-card-actions>
                  </q-card>
                </div>
              </div>
            </div>
          </q-carousel-slide>
        </q-carousel>
      </q-card>
    </div>
    
    <!-- Video Dialog -->
    <q-dialog v-model="videoDialog" persistent maximized transition-show="slide-up" transition-hide="slide-down">
      <q-card class="video-dialog bg-dark">
        <q-card-section class="row items-center q-pb-none bg-primary text-white">
          <div class="dialog-title text-h6">{{ currentVideoTitle }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup class="close-button" />
        </q-card-section>
        
        <q-card-section class="dialog-content q-pt-none flex flex-center" style="height: 90vh">
          <q-responsive style="width: 90%; max-width: 1000px;" :ratio="16/9">
            <q-iframe
              class="video-iframe full-height full-width"
              :src="videoEmbedUrl"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            />
          </q-responsive>
        </q-card-section>
      </q-card>
    </q-dialog>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  items: {
    type: Array,
    required: true
  }
});

const slide = ref(0);
const autoplay = ref(5000);
const videoDialog = ref(false);
const currentVideoTitle = ref('');
const windowWidth = ref(window.innerWidth);

// Ajustar la altura del carrusel según el tamaño de la pantalla
const carouselHeight = computed(() => {
  if (windowWidth.value < 600) {
    return '550px';
  } else if (windowWidth.value < 1024) {
    return '500px';
  } else {
    return '400px';
  }
});

// Actualizar el ancho de la ventana cuando cambia el tamaño
const handleResize = () => {
  windowWidth.value = window.innerWidth;
};

// Agregar y eliminar el event listener para el cambio de tamaño
onMounted(() => {
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});

// URL de vídeo embebida para el diálogo
const videoEmbedUrl = computed(() => {
  if (!props.items[slide.value]?.videoUrl) return '';
  
  const url = props.items[slide.value].videoUrl;
  
  // Convertir URL de YouTube a URL embebida
  if (url.includes('youtube.com/watch?v=')) {
    const videoId = url.split('v=')[1].split('&')[0];
    return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
  } else if (url.includes('youtu.be')) {
    const videoId = url.split('youtu.be/')[1];
    return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
  } else if (url.includes('vimeo.com')) {
    const videoId = url.split('vimeo.com/')[1];
    return `https://player.vimeo.com/video/${videoId}?autoplay=1`;
  }
  
  return url;
});

// Función para abrir el video en un dialog
const openVideo = (url) => {
  if (!url) return;
  currentVideoTitle.value = props.items[slide.value].title || 'Video';
  videoDialog.value = true;
};
</script>

<style scoped>
.news-carousel-component .carousel-card {
  transition: all 0.3s ease;
}

.news-carousel-component .play-button {
  transform: scale(1.2);
  transition: all 0.3s ease;
}

.news-carousel-component .play-button:hover {
  transform: scale(1.4);
}

.news-carousel-component .media-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.news-carousel-component .media-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.news-carousel-component .action-button {
  transition: transform 0.2s ease;
}

.news-carousel-component .action-button:hover {
  transform: translateY(-3px);
}

/* Estilos responsivos para dispositivos móviles */
@media (max-width: 599px) {
  .news-carousel-component .component-title {
    font-size: 1.5rem !important;
    margin-bottom: 1rem !important;
  }
  
  .news-carousel-component .carousel-slide {
    padding: 8px !important;
  }
  
  .news-carousel-component .item-title {
    font-size: 1.2rem !important;
    margin-bottom: 0.5rem !important;
  }
  
  .news-carousel-component .item-description {
    font-size: 0.9rem !important;
    margin-bottom: 1rem !important;
    line-height: 1.4 !important;
  }
  
  .news-carousel-component .action-button {
    font-size: 0.8rem !important;
    padding: 6px 16px !important;
  }
  
  .news-carousel-component .video-label {
    font-size: 0.7rem !important;
  }
  
  .news-carousel-component .dialog-title {
    font-size: 1rem !important;
  }
  
  .news-carousel-component .q-mb-md-lg {
    margin-bottom: 16px !important;
  }
}

/* Ajustes para tablets */
@media (min-width: 600px) and (max-width: 1023px) {
  .news-carousel-component .component-title {
    font-size: 1.8rem !important;
  }
  
  .news-carousel-component .item-title {
    font-size: 1.4rem !important;
  }
  
  .news-carousel-component .item-description {
    font-size: 1rem !important;
    line-height: 1.5 !important;
  }
  
  .news-carousel-component .q-mb-md-lg {
    margin-bottom: 24px !important;
  }
}
</style>
