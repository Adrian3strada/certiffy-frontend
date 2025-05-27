<template>
  <section class="pacto-verde-component certiffy-seccion">
    <!-- Banner Principal con la estructura que viene de la API -->
    <div class="pacto-verde-banner relative-position" style="min-height: 350px;">
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
              class="q-mx-sm"
              no-caps
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

<style scoped>
.pacto-verde-component {
  width: 100%;
}

.pacto-verde-banner {
  border-radius: 8px;
  overflow: hidden;
  margin: 1rem auto;
  max-width: 1200px;
}

@media (max-width: 600px) {
  .pacto-verde-banner {
    margin: 0.5rem;
  }
}

.pacto-verde-component.certiffy-seccion {
  width: 100%;
  background-color: var(--q-grey-1);
}

.pacto-verde-component .certiffy-contenedor {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.pacto-verde-component .category-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.pacto-verde-component .category-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.pacto-verde-component .category-chip {
  transition: transform 0.2s ease;
}

.pacto-verde-component .category-chip:hover {
  transform: scale(1.05);
}

/* Estilos responsivos para dispositivos móviles */
@media (max-width: 599px) {
  .pacto-verde-component .feature-text {
    font-size: 0.9rem !important;
  }
  
  .pacto-verde-component .feature-item {
    min-height: 40px !important;
    padding: 8px 0 !important;
  }
  
  .pacto-verde-component .feature-icon {
    font-size: 1rem !important;
  }
  
  .pacto-verde-component .header-categories {
    margin-top: 2rem !important;
  }
  
  .pacto-verde-component .certiffy-contenedor {
    padding: 0 0.5rem;
  }
}

/* Ajustes para tablets */
@media (min-width: 600px) and (max-width: 1023px) {
  .pacto-verde-component .feature-text {
    font-size: 1rem !important;
  }
  
  .pacto-verde-component .feature-item {
    min-height: 48px !important;
  }
}
</style>
