<template>
  <q-parallax
    :height="350"
    :speed="0.5"
  >
    <template v-slot:media>
      <q-img
        :src="imagenUrl"
        spinner-color="primary"
        spinner-size="3em"
        class="full-width full-height"
        fit="cover"
      >
        <template v-slot:loading>
          <div class="flex flex-center absolute-full bg-dark">
            <q-spinner color="primary" size="3em" />
          </div>
        </template>
        <template v-slot:error>
          <div class="flex flex-center absolute-full bg-dark">
            <div class="column items-center">
              <q-icon name="error" size="2rem" color="negative" />
              <div class="text-negative q-mt-sm">Error al cargar la imagen</div>
            </div>
          </div>
        </template>
      </q-img>
    </template>
    
    <template v-slot:content>
      <!-- Overlay con gradiente de color primario -->
      <div class="absolute-full bg-primary" style="opacity: 0.75;"></div>
      
      <!-- Contenido centrado -->
      <div class="absolute-center text-center q-pa-md full-width">
        <h2 class="text-h3 text-white text-weight-bold q-mb-md text-shadow-1">{{ titulo }}</h2>
        <p class="text-subtitle1 text-white q-mb-lg">{{ descripcion }}</p>
        
        <!-- Botones de acción si existen -->
        <div v-if="botones && botones.length" class="q-mt-lg">
          <q-btn 
            v-for="(boton, index) in botones" 
            :key="index"
            :label="boton.text"
            :to="boton.url"
            :color="boton.style || 'white'"
            :text-color="boton.style ? 'white' : 'primary'"
            outline
            class="q-mx-sm"
            no-caps
            unelevated
            rounded
            padding="sm md"
          />
        </div>
      </div>
    </template>
  </q-parallax>
</template>

<style scoped>
/* Corregir visualización de la imagen en q-parallax */
:deep(.q-img) {
  display: contents !important;
}

/* Asegurar que la imagen de fondo cubra todo el espacio */
:deep(.q-parallax__media) {
  overflow: hidden;
}
</style>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRuntimeConfig } from '#app'; // Import useRuntimeConfig

const props = defineProps({
  // Bloque principal de datos
  block: {
    type: Object,
    required: true
  },
  // URL base de la API
  apiBaseUrl: {
    type: String,
    default: () => useRuntimeConfig().public.apiBase // Use factory function for default
  }
});

// Extraer datos del bloque
const titulo = computed(() => {
  if (props.block && props.block.value && props.block.value.titulo) {
    return props.block.value.titulo;
  }
  return 'Pacto Verde Europeo';
});

const descripcion = computed(() => {
  if (props.block && props.block.value && props.block.value.descripcion) {
    return props.block.value.descripcion;
  }
  return 'Asegura el cumplimiento de las normativas del Pacto Verde Europeo con nuestra plataforma';
});

const botones = computed(() => {
  if (props.block && props.block.value && props.block.value.botones) {
    return props.block.value.botones;
  }
  return [];
});

const imagen = computed(() => {
  if (props.block && props.block.value && props.block.value.imagen) {
    return props.block.value.imagen;
  }
  return null;
});

// URL completa de la imagen
const imagenUrl = computed(() => {
  if (!imagen.value || !imagen.value.url) return '';
  
  // Comprobar si la URL es absoluta o relativa
  if (imagen.value.url.startsWith('http')) {
    return imagen.value.url;
  } else {
    // Usar el proxy de imágenes para evitar problemas de CORS
    return `/api/proxy-image?url=${encodeURIComponent(props.apiBaseUrl + imagen.value.url)}`;
  }
});

</script>
