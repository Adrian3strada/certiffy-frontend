<template>
  <div class="external-api-page q-pa-md">
    <h1 class="text-h3 q-mb-lg">Prueba de API Externa</h1>
    
    <!-- Controles -->
    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-12 col-md-6">
        <q-input
          v-model="pageId"
          label="ID de la página"
          type="number"
          outlined
          :disable="loading"
        />
      </div>
      <div class="col-12 col-md-6">
        <q-btn
          color="primary"
          label="Cargar datos"
          :loading="loading"
          @click="loadData"
          class="q-mt-sm"
        />
      </div>
    </div>
    
    <!-- Loader -->
    <div v-if="loading" class="text-center q-pa-lg">
      <q-spinner color="primary" size="3em" />
      <div class="q-mt-sm">Cargando datos de la API externa...</div>
    </div>
    
    <!-- Error -->
    <q-banner v-if="error && !loading" class="bg-negative text-white q-mb-md">
      {{ error }}
    </q-banner>
    
    <!-- Datos -->
    <template v-if="pageData && !loading">
      <q-card class="q-mb-lg">
        <q-card-section>
          <div class="text-h4">{{ pageData.title }}</div>
          <q-separator class="q-my-md" />
          
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <q-list bordered separator>
                <q-item>
                  <q-item-section>
                    <q-item-label caption>ID</q-item-label>
                    <q-item-label>{{ pageData.id }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <q-item-label caption>Tipo</q-item-label>
                    <q-item-label>{{ pageData.meta.type }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <q-item-label caption>Slug</q-item-label>
                    <q-item-label>{{ pageData.meta.slug }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <q-item-label caption>Fecha de publicación</q-item-label>
                    <q-item-label>{{ formatDate(pageData.meta.first_published_at) }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
            
            <div class="col-12 col-md-6">
              <q-card flat bordered>
                <q-card-section>
                  <div class="text-h6">Texto de introducción</div>
                  <div v-html="pageData.intro_text" class="q-mt-sm"></div>
                </q-card-section>
              </q-card>
              
              <q-card flat bordered class="q-mt-md">
                <q-card-section>
                  <div class="text-h6">URL del video</div>
                  <div class="q-mt-sm">
                    <a :href="pageData.video_url" target="_blank">{{ pageData.video_url }}</a>
                  </div>
                  
                  <!-- Previsualización del video de YouTube -->
                  <div v-if="youtubeEmbedUrl" class="q-mt-md">
                    <iframe 
                      width="100%" 
                      height="315" 
                      :src="youtubeEmbedUrl" 
                      frameborder="0" 
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                      allowfullscreen
                    ></iframe>
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </div>
        </q-card-section>
      </q-card>
      
      <!-- Imágenes del carrusel -->
      <q-card v-if="pageData.carousel_images && pageData.carousel_images.length > 0">
        <q-card-section>
          <div class="text-h5">Imágenes del carrusel</div>
          <q-separator class="q-my-md" />
          
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
        </q-card-section>
      </q-card>
      
      <!-- JSON completo -->
      <q-card class="q-mt-md">
        <q-card-section>
          <div class="text-h5">Datos JSON completos</div>
          <q-separator class="q-my-md" />
          
          <pre class="bg-grey-2 q-pa-md rounded-borders">{{ JSON.stringify(pageData, null, 2) }}</pre>
        </q-card-section>
      </q-card>
    </template>
    
    <!-- Sin datos -->
    <q-card v-if="!pageData && !loading && !error" class="text-center q-pa-lg">
      <q-icon name="mdi-information-outline" size="3rem" color="grey" />
      <div class="text-h6 q-mt-md">No hay datos cargados</div>
      <p>Ingresa un ID de página y haz clic en "Cargar datos" para ver la información de la API externa.</p>
    </q-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useQuasar } from 'quasar';

const $q = useQuasar();
const API_URL = 'https://99ce-2806-266-480-8244-9437-a02c-cbc8-6484.ngrok-free.app/api/v2';

const pageId = ref(15);
const pageData = ref(null);
const loading = ref(false);
const error = ref(null);
const slide = ref(0);

// Cargar datos de la API externa
const loadData = async () => {
  if (!pageId.value) {
    error.value = 'Por favor, ingresa un ID de página válido';
    return;
  }
  
  loading.value = true;
  error.value = null;
  
  try {
    console.log(`Intentando cargar datos de: ${API_URL}/pages/${pageId.value}/`);
    
    // Usar opciones adicionales para evitar problemas de CORS
    const response = await fetch(`${API_URL}/pages/${pageId.value}/`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      mode: 'cors'
    });
    
    console.log('Respuesta recibida:', response);
    
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    
    // Obtener el texto de la respuesta primero para depuración
    const responseText = await response.text();
    console.log('Texto de respuesta:', responseText);
    
    // Intentar analizar el JSON
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (jsonError) {
      console.error('Error al analizar JSON:', jsonError);
      throw new Error(`Error al analizar JSON: ${jsonError.message}. Respuesta recibida: ${responseText.substring(0, 100)}...`);
    }
    
    pageData.value = data;
    console.log('Datos procesados correctamente:', data);
    
    $q.notify({
      color: 'positive',
      message: 'Datos cargados correctamente',
      icon: 'mdi-check'
    });
  } catch (err) {
    console.error('Error completo:', err);
    error.value = `Error al cargar datos: ${err.message}`;
    pageData.value = null;
    
    $q.notify({
      color: 'negative',
      message: `Error al cargar datos: ${err.message}`,
      icon: 'mdi-alert'
    });
  } finally {
    loading.value = false;
  }
};

// Formatear fecha
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Obtener URL de incrustación de YouTube
const youtubeEmbedUrl = computed(() => {
  if (!pageData.value || !pageData.value.video_url) return null;
  
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

// Cargar datos automáticamente al montar el componente
onMounted(() => {
  loadData();
});
</script>

<style scoped>
.external-api-page {
  max-width: 1200px;
  margin: 0 auto;
}

pre {
  overflow-x: auto;
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>
