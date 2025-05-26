<template>
  <section class="modulos-video-component q-pa-md">
    <div class="q-mx-auto" style="max-width: 1200px">
      <!-- Título principal del módulo -->
      <h2 v-if="titulo" class="title-label text-h4 text-center q-mb-lg">{{ titulo }}</h2>
      
      <div class="row q-col-gutter-lg">
        <!-- Sección del video principal -->
        <div class="col-12 col-md-7">
          <div class="video-container">
            <q-card class="video-card shadow-3">
              <!-- Video de YouTube embebido -->
              <div class="q-pa-md">
                <div class="embed-responsive" style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden;">
                  <iframe 
                    v-if="videoUrl"
                    class="embed-responsive-item" 
                    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" 
                    :src="videoUrl" 
                    title="YouTube video player" 
                    frameborder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowfullscreen
                  ></iframe>
                  
                  <!-- Fallback cuando no hay video -->
                  <div v-else class="no-video flex flex-center full-height bg-grey-3">
                    <q-icon name="movie" size="4rem" color="grey-7" />
                    <p class="text-center q-mt-sm">Video no disponible</p>
                  </div>
                </div>
                
                <!-- Descripción del video -->
                <p v-if="videoCaption" class="text-caption q-mt-sm text-grey-8">{{ videoCaption }}</p>
              </div>
            </q-card>
          </div>
        </div>
        
        <!-- Sección de descripción y botones -->
        <div class="col-12 col-md-5">
          <q-card class="content-card shadow-2 q-pa-lg">
            <!-- Descripción del módulo -->
            <p v-if="descripcion" class="content-text q-mb-md-lg">{{ descripcion }}</p>
            
            <!-- Sección de botones/links -->
            <div v-if="botones && botones.length > 0">
              <h3 class="links-title text-subtitle1 text-weight-bold q-mb-sm">Enlaces de módulos:</h3>
              
              <div class="module-links q-gutter-sm">
                <q-btn
                  v-for="(boton, index) in botones"
                  :key="index"
                  :color="getButtonColor(boton.style)"
                  :label="boton.text"
                  class="module-link"
                  @click="openVideoModal(boton.url, boton.text)"
                  no-caps
                  rounded
                  unelevated
                />
              </div>
            </div>
          </q-card>
        </div>
      </div>
    </div>
    
    <!-- Modal para mostrar videos al hacer clic en los botones -->
    <q-dialog v-model="videoModal" maximized>
      <q-card class="video-modal-card">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">{{ selectedVideoTitle }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        
        <q-card-section class="q-pt-sm">
          <div class="embed-responsive" style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden;">
            <iframe 
              v-if="selectedVideoUrl"
              class="embed-responsive-item" 
              style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" 
              :src="selectedVideoUrl" 
              title="YouTube video player" 
              frameborder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowfullscreen
            ></iframe>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue';
import { API_BASE_URL } from '~/composables/useWagtailApi';

// Definición de props
const props = defineProps({
  block: {
    type: Object,
    required: true
  },
  apiBaseUrl: {
    type: String,
    default: API_BASE_URL
  }
});

// Extraer datos del bloque
const titulo = computed(() => props.block?.value?.titulo || '');
const descripcion = computed(() => props.block?.value?.descripcion || '');
const videoUrl = computed(() => props.block?.value?.video_url || '');
const videoCaption = computed(() => props.block?.value?.video_caption || '');
const botones = computed(() => props.block?.value?.botones || []);

// Estado para el modal de video
const videoModal = ref(false);
const selectedVideoUrl = ref('');
const selectedVideoTitle = ref('');

// Función para abrir el modal con el video seleccionado
const openVideoModal = (url, title) => {
  selectedVideoUrl.value = url;
  selectedVideoTitle.value = title;
  videoModal.value = true;
};

// Función para determinar el color del botón según el estilo
const getButtonColor = (style) => {
  switch(style) {
    case 'primary':
      return 'primary';
    case 'secondary':
      return 'secondary';
    case 'accent':
      return 'accent';
    default:
      return 'primary';
  }
};
</script>

<style scoped>
.modulos-video-component {
  margin-bottom: 3rem;
}

.title-label {
  color: var(--q-primary);
  font-weight: 700;
  margin-bottom: 2rem;
}

.content-text {
  font-size: 1.1rem;
  line-height: 1.6;
  color: var(--q-dark);
}

.links-title {
  margin-top: 1.5rem;
  color: var(--q-primary);
}

.module-link {
  transition: all 0.3s;
}

.module-link:hover {
  transform: translateY(-2px);
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.2);
}

.video-card {
  border-radius: 8px;
  overflow: hidden;
}

.content-card {
  border-radius: 8px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.no-video {
  width: 100%;
  height: 100%;
  min-height: 300px;
  flex-direction: column;
}

/* Ajustes responsivos */
@media (max-width: 599px) {
  .title-label {
    font-size: 1.5rem !important;
    margin-bottom: 1rem !important;
  }
  
  .content-text {
    font-size: 1rem !important;
  }
  
  .modulos-video-component .links-title {
    font-size: 1rem !important;
    margin-top: 0.5rem !important;
  }
  
  .modulos-video-component .module-link {
    font-size: 0.8rem !important;
    padding: 6px 12px !important;
  }
}

/* Ajustes para tablets */
@media (min-width: 600px) and (max-width: 1023px) {
  .modulos-video-component .title-label {
    font-size: 1.5rem !important;
    margin-bottom: 1.25rem !important;
  }
  
  .modulos-video-component .content-text {
    font-size: 0.95rem !important;
  }
  
  .modulos-video-component .q-mb-md-lg {
    margin-bottom: 24px;
  }
}
</style>