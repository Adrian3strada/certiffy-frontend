<template>
  <section :id="'socios-' + (id || Math.random().toString(36).substring(2, 9))" class="q-py-xl bg-grey-1" style="width: 100vw; position: relative; left: 50%; right: 50%; margin-left: -50vw; margin-right: -50vw; overflow-x: hidden;">
    <div class="q-mx-auto q-px-md" style="max-width: 1200px">
      <div class="text-center q-mb-xl">
        <div class="text-primary text-h4 text-weight-bold q-mb-lg">{{ titulo }}</div>
      </div>
      
      <div class="row q-col-gutter-md q-col-gutter-lg-lg justify-center items-center">
        <div 
          v-for="(socio, index) in logos" 
          :key="index"
          class="col-12 col-sm-6 col-md-4 col-lg-3 q-mb-sm"
        >
          <q-card 
            flat 
            bordered 
            class="q-pa-md text-center shadow-1 q-hoverable rounded-borders socio-card"
            :class="{ 'socio-card-active': activeCard === index }"
            @mouseover="activeCard = index"
            @mouseleave="activeCard = null"
          >
            <q-card-section class="q-pa-none flex justify-center items-center" style="height: 100px;">
              <a 
                :href="socio.url" 
                target="_blank" 
                rel="noopener noreferrer"
                class="full-width no-decoration"
                style="display: block; text-align: center;"
              >
                <div v-if="socio.imagen && socio.imagen.url" class="logo-container">
                  <q-img 
                    :src="getLogoUrl(socio.imagen)"
                    :alt="socio.imagen.title || 'Logo de socio'"
                    class="partner-logo"
                    :class="{ 'partner-logo-active': activeCard === index }"
                    fit="contain"
                    @error="onImageError($event, index)"
                  />
                </div>
                <div v-else-if="!socioImgError[index]" class="flex column flex-center bg-grey-2 rounded-borders full-width" style="height: 100px; transition: all 0.3s ease;" :style="activeCard === index ? 'background-color: rgba(0, 0, 0, 0.08);' : ''">
                  <q-icon name="business" size="2rem" color="grey-7" />
                  <div class="text-subtitle2 text-weight-bold q-mt-sm">{{ socio.imagen?.title || 'Partner' }}</div>
                </div>
              </a>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  id: {
    type: String,
    default: ''
  },
  block: {
    type: Object,
    default: null
  },
  apiBaseUrl: {
    type: String,
    default: 'https://proyectocms-iota.vercel.app'
  }
});

// Estado local
const activeCard = ref(null);
const socioImgError = ref({});

// Extraer datos del bloque
const titulo = computed(() => {
  return props.block?.value?.titulo || 'Seguimos sumando visiones';
});

const logos = computed(() => {
  return props.block?.value?.logos || [];
});

// Manejar errores de carga de imágenes
const onImageError = (event, index) => {
  console.error(`Error al cargar imagen ${index}:`, event);
  // Marcar esta imagen como fallida
  socioImgError.value[index] = true;
};

// Función para obtener la URL completa del logo con enfoque compatible con CORS
const getLogoUrl = (image) => {
  if (!image || !image.url) return '';
  
  // Usar la URL base de la API proporcionada en las props
  const wagtailBaseUrl = props.apiBaseUrl;
  
  // Si es una URL absoluta, usar el proxy
  if (image.url.startsWith('http')) {
    return `/api/proxy-image?url=${encodeURIComponent(image.url)}`;
  }
  
  // Si es una ruta relativa a media de Wagtail
  if (image.url.startsWith('/media')) {
    return `/api/proxy-image?url=${encodeURIComponent(wagtailBaseUrl + image.url)}`;
  }
  
  // Cualquier otro caso, usar el proxy con la URL base
  return `/api/proxy-image?url=${encodeURIComponent(wagtailBaseUrl + image.url)}`;
};
</script>

<style scoped>
.logo-container {
  width: 100%;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Estilos base de la tarjeta */
.socio-card {
  height: 180px;
  align-items: center;
  justify-content: center;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  transform: translateY(0);
}

/* Efecto suave al pasar el ratón sobre la tarjeta */
.socio-card-active {
  transform: translateY(-8px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1) !important;
}

/* Estilo base para imágenes (blanco y negro) */
.partner-logo {
  max-width: 100%;
  max-height: 100px;
  display: inline-block;
  transition: all 0.4s ease;
  filter: grayscale(100%);
}

/* Imagen a color al pasar el ratón */
.partner-logo-active {
  filter: grayscale(0%);
  transform: scale(1.03);
}

/* Animación suave en los contenedores alternos */
.q-img {
  object-fit: contain;
  max-height: 100%;
  max-width: 100%;
}
</style>
