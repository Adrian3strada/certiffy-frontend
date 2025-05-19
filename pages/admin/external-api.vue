<template>
  <q-layout view="lHh Lpr lFf">
    <admin-header @toggle-drawer="drawerOpen = !drawerOpen" />
    
    <admin-sidebar v-model="drawerOpen" />
    
    <q-page-container>
      <q-page padding>
        <div class="row items-center q-mb-lg">
          <div class="col">
            <h1 class="text-h4 q-my-none">API Externa</h1>
            <p class="text-subtitle1 q-mt-sm">Integración con API externa para pruebas</p>
          </div>
        </div>
        
        <!-- Sección de carga de datos -->
        <q-card class="q-mb-md">
          <q-card-section>
            <div class="row items-center q-col-gutter-md">
              <div class="col-12 col-md-6">
                <q-input
                  v-model="pageId"
                  label="ID de la página"
                  type="number"
                  outlined
                  dense
                  :disable="loading"
                />
              </div>
              <div class="col-12 col-md-6">
                <q-btn
                  color="primary"
                  label="Cargar datos"
                  :loading="loading"
                  @click="loadExternalPage"
                  class="q-mt-sm"
                />
              </div>
            </div>
          </q-card-section>
        </q-card>
        
        <!-- Visualización de datos -->
        <template v-if="externalPage">
          <q-card class="q-mb-md">
            <q-card-section>
              <div class="text-h5">{{ externalPage.title }}</div>
              <q-separator class="q-my-md" />
              
              <!-- Metadatos -->
              <div class="row q-col-gutter-md">
                <div class="col-12 col-md-6">
                  <q-list bordered separator>
                    <q-item>
                      <q-item-section>
                        <q-item-label caption>ID</q-item-label>
                        <q-item-label>{{ externalPage.id }}</q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-item>
                      <q-item-section>
                        <q-item-label caption>Tipo</q-item-label>
                        <q-item-label>{{ externalPage.meta.type }}</q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-item>
                      <q-item-section>
                        <q-item-label caption>Slug</q-item-label>
                        <q-item-label>{{ externalPage.meta.slug }}</q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-item>
                      <q-item-section>
                        <q-item-label caption>Fecha de publicación</q-item-label>
                        <q-item-label>{{ formatDate(externalPage.meta.first_published_at) }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </div>
                
                <div class="col-12 col-md-6">
                  <q-card flat bordered>
                    <q-card-section>
                      <div class="text-h6">Texto de introducción</div>
                      <div v-html="externalPage.intro_text" class="q-mt-sm"></div>
                    </q-card-section>
                  </q-card>
                  
                  <q-card flat bordered class="q-mt-md">
                    <q-card-section>
                      <div class="text-h6">URL del video</div>
                      <div class="q-mt-sm">
                        <a :href="externalPage.video_url" target="_blank">{{ externalPage.video_url }}</a>
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
          <q-card>
            <q-card-section>
              <div class="text-h5">Imágenes del carrusel</div>
              <q-separator class="q-my-md" />
              
              <div class="row q-col-gutter-md">
                <div 
                  v-for="(image, index) in externalPage.carousel_images" 
                  :key="image.id"
                  class="col-12 col-md-4"
                >
                  <q-card flat bordered>
                    <q-card-section>
                      <div class="text-h6">Imagen {{ index + 1 }}</div>
                      <q-list dense>
                        <q-item>
                          <q-item-section>
                            <q-item-label caption>ID</q-item-label>
                            <q-item-label>{{ image.id }}</q-item-label>
                          </q-item-section>
                        </q-item>
                        <q-item>
                          <q-item-section>
                            <q-item-label caption>Tipo</q-item-label>
                            <q-item-label>{{ image.type }}</q-item-label>
                          </q-item-section>
                        </q-item>
                        <q-item>
                          <q-item-section>
                            <q-item-label caption>Valor</q-item-label>
                            <q-item-label>{{ image.value }}</q-item-label>
                          </q-item-section>
                        </q-item>
                      </q-list>
                    </q-card-section>
                  </q-card>
                </div>
              </div>
            </q-card-section>
          </q-card>
          
          <!-- JSON completo -->
          <q-card class="q-mt-md">
            <q-card-section>
              <div class="text-h5">Datos JSON completos</div>
              <q-separator class="q-my-md" />
              
              <pre class="bg-grey-2 q-pa-md rounded-borders">{{ JSON.stringify(externalPage, null, 2) }}</pre>
            </q-card-section>
          </q-card>
        </template>
        
        <!-- Mensaje de error -->
        <q-card v-if="error" class="bg-negative text-white">
          <q-card-section>
            <div class="text-h6">Error</div>
            <p>{{ error }}</p>
          </q-card-section>
        </q-card>
        
        <!-- Mensaje cuando no hay datos -->
        <q-card v-if="!externalPage && !loading && !error" class="bg-grey-3">
          <q-card-section class="text-center">
            <q-icon name="mdi-information-outline" size="2rem" />
            <div class="text-h6 q-mt-sm">No hay datos cargados</div>
            <p>Ingresa un ID de página y haz clic en "Cargar datos" para ver la información de la API externa.</p>
          </q-card-section>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useQuasar } from 'quasar';
import { useExternalApi } from '~/composables/useExternalApi';
import AdminHeader from '~/components/admin/AdminHeader.vue';
import AdminSidebar from '~/components/admin/AdminSidebar.vue';

const $q = useQuasar();
const { loading, error, getPageById } = useExternalApi();

const drawerOpen = ref(true);
const pageId = ref(15); // ID por defecto
const externalPage = ref(null);

// Cargar datos de la API externa
const loadExternalPage = async () => {
  try {
    externalPage.value = null;
    const data = await getPageById(pageId.value);
    externalPage.value = data;
    
    $q.notify({
      color: 'positive',
      message: 'Datos cargados correctamente',
      icon: 'mdi-check'
    });
  } catch (err) {
    $q.notify({
      color: 'negative',
      message: 'Error al cargar datos: ' + err.message,
      icon: 'mdi-alert'
    });
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
  if (!externalPage.value || !externalPage.value.video_url) return null;
  
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

// Cargar datos automáticamente al montar el componente
loadExternalPage();
</script>

<style scoped>
pre {
  overflow-x: auto;
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>
