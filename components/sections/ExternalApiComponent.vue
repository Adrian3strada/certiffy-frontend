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
    
    <div v-else-if="pageData" class="content-container">
      <!-- Indicador de datos de respaldo -->
      <div v-if="usingMockData" class="mock-data-indicator q-mb-md">
        <q-banner class="bg-amber-2 text-black">
          <template v-slot:avatar>
            <q-icon name="mdi-information-outline" color="amber-9" />
          </template>
          Usando datos de ejemplo. La API externa no está disponible o devolvió un formato incorrecto.
        </q-banner>
      </div>
      <!-- Título de la página -->
      <h2 class="text-h4 q-mb-md">{{ pageData.title }}</h2>
      
      <!-- Texto de introducción -->
      <div class="intro-text q-mb-lg" v-if="pageData.intro_text" v-html="pageData.intro_text"></div>
      
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
      <div v-if="pageData.carousel_images && pageData.carousel_images.length > 0" class="carousel-container q-mb-lg">
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
            v-for="(image, index) in pageData.carousel_images" 
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
import { ref, computed, onMounted, watch } from 'vue';
import { externalApiService } from '~/api/externalApi';

const props = defineProps({
  content: {
    type: Object,
    default: () => ({
      pageId: 15,
      showTitle: true,
      showIntro: true,
      showVideo: true,
      showCarousel: true
    })
  },
  isPreview: {
    type: Boolean,
    default: false
  }
});

const loading = ref(true);
const error = ref(null);
const pageData = ref(null);
const slide = ref(0);
const usingMockData = ref(false);

// Obtener URL de incrustación de YouTube
const youtubeEmbedUrl = computed(() => {
  if (!pageData.value || !pageData.value.video_url || !props.content.showVideo) return null;
  
  const url = pageData.value.video_url;
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
  loading.value = true;
  error.value = null;
  usingMockData.value = false;
  
  try {
    const { data, isMockData } = await externalApiService.getPageById(props.content.pageId);
    pageData.value = data;
    usingMockData.value = isMockData === true;
    console.log('Datos cargados de la API externa:', data, isMockData ? '(usando datos de respaldo)' : '');
  } catch (err) {
    console.error('Error al cargar datos de la API externa:', err);
    error.value = `Error al cargar datos: ${err.message}`;
  } finally {
    loading.value = false;
  }
};

// Observar cambios en el ID de la página
watch(() => props.content.pageId, () => {
  loadExternalPage();
});

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
