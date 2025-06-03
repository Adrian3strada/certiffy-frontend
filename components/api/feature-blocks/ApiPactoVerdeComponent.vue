<template>
  <section style="width: 100vw; position: relative; left: 50%; right: 50%; margin-left: -50vw; margin-right: -50vw; padding: 0; overflow-x: hidden; background-color: var(--q-grey-1);">
    <!-- Banner Principal con la estructura que viene de la API -->
    <div class="relative-position" style="min-height: 350px; overflow: hidden;">
      <!-- Imagen de fondo -->
      <q-img
        :src="imagenUrl"
        spinner-color="primary"
        class="absolute-full"
        fit="cover"
      >
        <!-- Overlay con la información -->
        <div class="absolute-full bg-primary" style="opacity: 0.75;"></div>
        
        <div class="absolute-center text-center full-width q-pa-md">
          <h2 class="text-h3 text-white text-weight-bold q-mb-md">{{ titulo }}</h2>
          <p class="text-subtitle1 text-white q-mb-lg">{{ descripcion }}</p>
          
          <!-- Botones de acción si existen -->
          <div v-if="botones && botones.length" class="q-mt-lg">
            <q-btn 
              v-for="(boton, index) in botones" 
              :key="index"
              :label="boton.text"
              :to="boton.url"
              :color="boton.style || 'primary'"
              outline
              class="q-mx-sm q-transition"
              no-caps
              :class="{'scale-hover': $q.screen.gt.xs}"
            />
          </div>
        </div>
      </q-img>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { API_BASE_URL } from '~/composables/useWagtailApi';

const props = defineProps({
  // Bloque principal de datos
  block: {
    type: Object,
    required: true
  },
  // URL base de la API
  apiBaseUrl: {
    type: String,
    default: API_BASE_URL
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


