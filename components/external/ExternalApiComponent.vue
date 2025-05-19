<template>
  <div class="external-api-component">
    <div v-if="loading" class="loading-container">
      <q-spinner color="primary" size="3em" />
      <div class="q-mt-sm">Cargando datos de la API externa...</div>
    </div>
    
    <div v-else-if="error" class="error-container">
      <q-icon name="mdi-alert" color="negative" size="2em" />
      <div class="q-mt-sm">{{ error }}</div>
    </div>
    
    <div v-else-if="externalPage" class="content-container">
      <!-- Título de la página -->
      <h2 class="text-h4 q-mb-md">{{ externalPage.title }}</h2>
      
      <!-- Texto de introducción -->
      <div class="intro-text q-mb-lg" v-if="externalPage.intro_text" v-html="externalPage.intro_text"></div>
      
      <!-- Video de YouTube -->
      <div v-if="youtubeEmbedUrl" class="video-container q-mb-lg">
        <iframe 
          width="100%" 
          height="400" 
          :src="youtubeEmbedUrl" 
          frameborder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowfullscreen
        ></iframe>
      </div>
      
      <!-- Carrusel de imágenes -->
      <div v-if="externalPage.carousel_images && externalPage.carousel_images.length > 0" class="carousel-container q-mb-lg">
        <q-carousel
          v-model="slide"
          animated
          arrows
          navigation
          infinite
          height="400px"
          class="bg-grey-1 shadow-2 rounded-borders"
        >
          <q-carousel-slide 
            v-for="(image, index) in externalPage.carousel_images" 
            :key="image.id"
            :name="index"
            class="column no-wrap flex-center"
          >
            <div class="q-mt-md text-center">
              <div class="text-h6">Imagen {{ index + 1 }}</div>
              <div class="text-subtitle1">ID: {{ image.id }}</div>
              <div class="text-subtitle2">Valor: {{ image.value }}</div>
            </div>
          </q-carousel-slide>
        </q-carousel>
      </div>
    </div>
    
    <div v-else class="empty-container">
      <q-icon name="mdi-information-outline" color="grey" size="2em" />
      <div class="q-mt-sm">No hay datos disponibles</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useExternalApi } from '~/composables/useExternalApi';

const props = defineProps({
  pageId: {
    type: [Number, String],
    default: 15
  },
  showTitle: {
    type: Boolean,
    default: true
  },
  showIntro: {
    type: Boolean,
    default: true
  },
  showVideo: {
    type: Boolean,
    default: true
  },
  showCarousel: {
    type: Boolean,
    default: true
  }
});

const { loading, error, getPageById } = useExternalApi();
const externalPage = ref(null);
const slide = ref(0);

// Obtener URL de incrustación de YouTube
const youtubeEmbedUrl = computed(() => {
  if (!externalPage.value || !externalPage.value.video_url || !props.showVideo) return null;
  
  const url = externalPage.value.video_url;
  let videoId = null;
  
  // Extraer ID del video de YouTube
  if (url.includes('youtube.com/watch')) {
    const urlParams = new URLSearchParams(new URL(url).search);
    videoId = urlParams.get('v');
  } else if (url.includes('youtu.be/')) {
    videoId = url.split('youtu.be/')[1].split('?')[0];
  }
  
  return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
});

// Cargar datos de la API externa
const loadExternalPage = async () => {
  try {
    const data = await getPageById(props.pageId);
    externalPage.value = data;
    console.log('Datos cargados de la API externa:', data);
  } catch (err) {
    console.error('Error al cargar datos de la API externa:', err);
  }
};

// Cargar datos al montar el componente
onMounted(() => {
  loadExternalPage();
});
</script>

<style scoped>
.external-api-component {
  width: 100%;
  padding: 1rem;
  background-color: #f8f8f8;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.loading-container,
.error-container,
.empty-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
}

.error-container {
  color: #c10015;
}

.empty-container {
  color: #9e9e9e;
}

.content-container {
  width: 100%;
}

.intro-text {
  line-height: 1.6;
}

.video-container {
  position: relative;
  width: 100%;
  overflow: hidden;
  border-radius: 4px;
}

.carousel-container {
  width: 100%;
  border-radius: 4px;
  overflow: hidden;
}
</style>
