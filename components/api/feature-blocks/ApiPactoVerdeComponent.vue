<template>
  <section style="width: 101vw; position: relative; left: 50%; right: 50%; margin-left: -50vw; margin-right: -50vw; padding: 0; overflow-x: hidden;">
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

<style scoped>
/* Anular solo el fondo oscuro automático pero mantener otros efectos */
:deep(.q-img) {
  /* Mantenemos los efectos hover originales */
  transition: all 0.3s ease-in-out;
}

:deep(.q-img__content > div:not(.absolute-full)) {
  /* Removemos solo el fondo oscuro automático */
  background: transparent !important;
}

/* Conservamos el fondo primario que se aplica explícitamente */
:deep(.absolute-full.bg-primary) {
  /* Este es el overlay que queremos mantener */
  opacity: 0.75;
  transition: opacity 0.3s ease;
}

:deep(.q-img:hover .absolute-full.bg-primary) {
  /* Efecto hover para oscurecer un poco menos al pasar el ratón */
  opacity: 0.65;
}
</style>
