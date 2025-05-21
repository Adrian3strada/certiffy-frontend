<template>
  <q-layout view="hHh LpR fFf" class="wagtail-spa">
    <!-- Cabecera -->
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg">
          </q-avatar>
          Marketing CMS
        </q-toolbar-title>
        
        <q-space />
        
        <!-- Notificaciones de estado -->
        <q-chip v-if="isMockData" color="warning" text-color="white" icon="warning">
          Datos de respaldo
        </q-chip>
        <q-chip v-if="error" color="negative" text-color="white" icon="error">
          Error de conexión
        </q-chip>
      </q-toolbar>
    </q-header>

    <!-- Contenido principal -->
    <q-page-container>
      <q-page padding>
        <!-- Estado de carga -->
        <div v-if="loading" class="loading-container">
          <q-card flat bordered class="loading-card">
            <q-card-section class="column items-center q-py-lg">
              <q-spinner color="primary" size="3em" />
              <div class="q-mt-md text-subtitle1">Cargando contenido...</div>
            </q-card-section>
          </q-card>
        </div>

        <!-- Contenido principal -->
        <div v-else-if="pageData" class="page-content">
          <!-- Cabecera de página -->
          <q-card flat bordered class="page-header q-mb-md">
            <q-card-section>
              <div class="text-h4 text-primary q-mb-sm">{{ pageData.title }}</div>
              <q-separator spaced />
            </q-card-section>
          </q-card>
          
          <!-- Renderizar los componentes de la página -->
          <div v-if="pageData.body && pageData.body.length > 0" class="page-body q-gutter-y-md">
            <div v-for="(block, index) in pageData.body" :key="index" class="content-block">
              <!-- Componente de encabezado -->
              <WagtailHeadingComponent 
                v-if="block.type === 'heading'" 
                :content="block" 
              />
              
              <!-- Componente de texto enriquecido -->
              <WagtailRichTextComponent 
                v-else-if="block.type === 'rich_text'" 
                :content="block" 
              />
              
              <!-- Componente de imagen -->
              <WagtailImageComponent 
                v-else-if="block.type === 'image'" 
                :content="block" 
              />
              
              <!-- Componente de video -->
              <WagtailVideoComponent 
                v-else-if="block.type === 'video'" 
                :content="block" 
              />
              
              <!-- Componente de carrusel -->
              <WagtailCarouselComponent 
                v-else-if="block.type === 'carousel'" 
                :content="block" 
              />
              
              <!-- Bloque no reconocido -->
              <q-card v-else flat bordered class="unknown-block">
                <q-card-section class="column items-center q-py-lg">
                  <q-icon name="help" size="2rem" color="grey-7" />
                  <div class="q-mt-sm text-subtitle1">Bloque no reconocido: {{ block.type }}</div>
                  <pre v-if="isDevelopment" class="q-mt-sm code-block">{{ JSON.stringify(block, null, 2) }}</pre>
                </q-card-section>
              </q-card>
            </div>
          </div>
          
          <!-- Contenido de respaldo para la estructura antigua -->
          <div v-else class="page-body q-gutter-y-md">
            <!-- Texto de introducción -->
            <q-card v-if="pageData.intro_text" flat bordered class="q-mb-md">
              <q-card-section>
                <WagtailRichTextComponent :content="{ value: pageData.intro_text }" />
              </q-card-section>
            </q-card>

            <!-- Video (siempre mostrar) -->
            <q-card flat bordered class="q-mb-md">
              <q-card-section>
                <div class="text-h6 q-mb-sm">Video</div>
                <WagtailVideoComponent :content="{ value: { url: pageData.video_url || '' } }" />
              </q-card-section>
            </q-card>

            <!-- Carrusel de imágenes (siempre mostrar) -->
            <q-card flat bordered class="q-mb-md">
              <q-card-section>
                <div class="text-h6 q-mb-sm">Galería de imágenes</div>
                <WagtailCarouselComponent :content="{ images: pageData.carousel_images || [] }" />
              </q-card-section>
            </q-card>
          </div>
          
          <!-- Mensaje cuando no hay contenido -->
          <q-card v-else flat bordered class="no-content">
            <q-card-section class="column items-center q-py-lg">
              <q-icon name="description" size="3rem" color="grey-7" />
              <div class="q-mt-sm text-subtitle1">No hay contenido disponible para esta página.</div>
            </q-card-section>
          </q-card>
        </div>
        
        <!-- Mensaje cuando no hay página -->
        <q-card v-else flat bordered class="no-page">
          <q-card-section class="column items-center q-py-lg">
            <q-icon name="error_outline" size="3rem" color="grey-7" />
            <div class="q-mt-sm text-subtitle1">No se pudo cargar la página.</div>
            <q-btn 
              color="primary" 
              label="Reintentar" 
              icon="refresh" 
              class="q-mt-md" 
              @click="loadPageData" 
            />
          </q-card-section>
        </q-card>
      </q-page>
    </q-page-container>

    <!-- Pie de página -->
    <q-footer elevated class="bg-grey-9 text-white">
      <q-toolbar>
        <q-toolbar-title class="text-subtitle2">
          Marketing CMS © {{ new Date().getFullYear() }} - Desarrollado con Nuxt y Quasar
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useWagtailApi } from '~/composables/useWagtailApi';
import WagtailHeadingComponent from '~/components/sections/wagtail/WagtailHeadingComponent.vue';
import WagtailRichTextComponent from '~/components/sections/wagtail/WagtailRichTextComponent.vue';
import WagtailImageComponent from '~/components/sections/wagtail/WagtailImageComponent.vue';
import WagtailVideoComponent from '~/components/sections/wagtail/WagtailVideoComponent.vue';
import WagtailCarouselComponent from '~/components/sections/wagtail/WagtailCarouselComponent.vue';

// Determinar si estamos en modo desarrollo
const isDevelopment = process.env.NODE_ENV === 'development';

// Usar el composable de Wagtail API
const { loading, error, isMockData, getPageById } = useWagtailApi();
const pageData = ref(null);

// Cargar datos de la página de inicio
const loadPageData = async () => {
  try {
    // ID de la página de inicio (ajustar según la API)
    const homePageId = 15;
    const data = await getPageById(homePageId);
    pageData.value = data;
    console.log('Datos de la página cargados:', data);
  } catch (err) {
    console.error('Error al cargar datos de la página:', err);
  }
};

// Cargar datos cuando se monta el componente
onMounted(() => {
  loadPageData();
});
</script>

<style>
/* Variables globales */
:root {
  --primary-color: #1976d2;
  --secondary-color: #26a69a;
  --accent-color: #9c27b0;
  --dark-color: #1d1d1d;
  --light-color: #f5f5f5;
  --success-color: #21ba45;
  --warning-color: #f2c037;
  --error-color: #c10015;
  --text-color: #333333;
  --text-light: #ffffff;
  --text-dark: #000000;
  --border-radius: 8px;
  --box-shadow: 0 1px 5px rgba(0, 0, 0, 0.2), 0 2px 2px rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.12);
  --transition-speed: 0.3s;
}

/* Estilos globales */
.wagtail-spa {
  --section-spacing: 24px;
  --card-border-radius: var(--border-radius);
  --container-max-width: 1200px;
  --container-padding: 16px;
  min-height: 100vh;
  background-color: #f5f5f5;
  color: var(--text-color);
  font-family: 'Roboto', sans-serif;
}

/* Contenedor principal */
.container {
  width: 100%;
  max-width: var(--container-max-width);
  margin: 0 auto;
  padding: 0 var(--container-padding);
}

/* Cabecera */
.q-header {
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.q-toolbar-title {
  font-weight: 500;
  letter-spacing: 0.5px;
}

/* Pie de página */
.q-footer {
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
}

/* Estados de carga y error */
.loading-container,
.error-container,
.page-loader {
  height: calc(100vh - 200px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: var(--section-spacing);
}

.loading-card,
.no-content,
.no-page,
.unknown-block {
  width: 100%;
  max-width: 600px;
  border-radius: var(--card-border-radius);
  transition: box-shadow var(--transition-speed) ease;
}

.loading-card:hover,
.no-content:hover,
.no-page:hover {
  box-shadow: var(--box-shadow);
}

/* Contenido de la página */
.page-content {
  max-width: 1000px;
  margin: 0 auto;
}

.page-header {
  border-radius: var(--card-border-radius);
  overflow: hidden;
  margin-bottom: 24px;
  transition: box-shadow var(--transition-speed) ease;
}

.page-header:hover {
  box-shadow: var(--box-shadow);
}

.page-body {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.content-block {
  transition: transform var(--transition-speed) ease;
}

/* Código para bloques desconocidos */
.code-block {
  background-color: #f0f0f0;
  padding: 12px;
  border-radius: 4px;
  font-family: monospace;
  font-size: 0.9rem;
  overflow-x: auto;
  max-width: 100%;
}

/* Responsive */
@media (max-width: 599px) {
  .page-content {
    padding: 0;
  }
  
  .page-header .text-h4 {
    font-size: 1.5rem;
  }
  
  .q-page {
    padding: 12px !important;
  }
}

@media (min-width: 600px) and (max-width: 1023px) {
  .page-content {
    padding: 0 12px;
  }
}

.error-container {
  max-width: 600px;
  margin: 0 auto;
}

/* Secciones de la página */
.page-header {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.page-main {
  padding: var(--section-spacing) 0;
}

/* Tarjetas de contenido */
.q-card {
  border-radius: var(--card-border-radius) !important;
  transition: box-shadow 0.3s ease;
}

.q-card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1) !important;
}

/* Estilos para secciones específicas */
.intro-section {
  font-size: 1.1rem;
  line-height: 1.6;
}

.video-section,
.carousel-section {
  border-radius: var(--card-border-radius);
  overflow: hidden;
}

/* Pie de página */
.q-footer p {
  margin: 8px 0;
  font-size: 0.9rem;
}

/* Estilos responsivos adicionales */
@media (max-width: 599px) {
  :root {
    --section-spacing: 16px;
    --container-padding: 12px;
  }
  
  .text-h4 {
    font-size: 1.5rem;
  }
  
  .text-h6 {
    font-size: 1.1rem;
  }
}

@media (min-width: 600px) and (max-width: 1023px) {
  :root {
    --section-spacing: 20px;
  }
}
</style>
