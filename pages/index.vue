<template>
  <q-page class="certiffy-homepage q-pa-none">
      <!-- Carrusel de Novedades -->
      <NewsCarouselComponent 
        :title="mockData.newsCarousel.title" 
        :items="mockData.newsCarousel.items" 
      />

      <!-- Noticias y Eventos -->
      <NoticiasEventosComponent 
        :title="mockData.noticiasEventos.title"
        :noticias="mockData.noticiasEventos.noticias"
        :verMasUrl="mockData.noticiasEventos.verMasUrl"
      />

      <!-- Testimonios -->
      <TestimonialsComponent 
        :testimonials="mockData.testimonials.testimonials" 
      />

      <!-- Módulos Video -->
      <WagtailModulosVideoComponent 
        :content="mockData.modulosVideo" 
      />

      <!-- Pacto Verde -->
      <PactoVerdeComponent 
        :title="mockData.pactoVerde.title"
        :subtitle="mockData.pactoVerde.subtitle"
        :backgroundImage="mockData.pactoVerde.backgroundImage"
        :categories="mockData.pactoVerde.categories"
        :headerCategories="mockData.pactoVerde.headerCategories"
        :showHeaderCategories="mockData.pactoVerde.showHeaderCategories"
      />

      <!-- Enlaces de Socios -->
      <PartnerLinksComponent 
        :title="mockData.partnerLinks.title"
        :links="mockData.partnerLinks.links"
      />
  </q-page>

    <!-- Notificaciones de estado -->
    <q-dialog v-model="showError" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="error" color="negative" text-color="white" />
          <span class="q-ml-sm">{{ error }}</span>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cerrar" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useWagtailApi } from '~/composables/useWagtailApi';
import { mockData } from '~/data/mockData';

// Importar componentes
import NewsCarouselComponent from '~/components/certiffy/NewsCarouselComponent.vue';
import NoticiasEventosComponent from '~/components/certiffy/NoticiasEventosComponent.vue';
import TestimonialsComponent from '~/components/certiffy/TestimonialsComponent.vue';
import PactoVerdeComponent from '~/components/certiffy/PactoVerdeComponent.vue';
import PartnerLinksComponent from '~/components/certiffy/PartnerLinksComponent.vue';
import WagtailModulosVideoComponent from '~/components/certiffy/WagtailModulosVideoComponent.vue';

// Obtener errores desde el composable de Wagtail API
const { error } = useWagtailApi();

// Estado para mostrar errores
const showError = computed(() => !!error.value);
</script>

<style>
/* Variables globales */
:root {
  --primary-color: #1a237e;
  --secondary-color: #26a69a;
  --accent-color: #ffcc00;
  --dark-color: #121212;
  --light-color: #f5f5f5;
  --success-color: #21ba45;
  --warning-color: #f2c037;
  --error-color: #c10015;
  --text-color: #333333;
}

/* Estilos globales */
body {
  font-family: 'Roboto', sans-serif;
  color: var(--text-color);
  background-color: var(--light-color);
  margin: 0;
  padding: 0;
}

/* Estilos de la página de inicio */
.certiffy-homepage {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.content-container {
  flex: 1;
}

/* Spacing entre secciones */
.content-container > * {
  margin-bottom: 3rem;
}

/* Estilos para diálogos y notificaciones */
.q-dialog__inner > .q-card {
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

/* Responsive */
@media (max-width: 768px) {
  .content-container > * {
    margin-bottom: 2rem;
  }
}

/* Estilos adicionales para mejorar la UI */
.q-card {
  border-radius: 8px;
  transition: box-shadow 0.3s ease, transform 0.3s ease;
}

.q-card:hover {
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}
</style>
