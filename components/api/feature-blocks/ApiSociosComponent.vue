<template>
  <section class="socios-component q-py-xl bg-grey-1 full-width-container">
    <div class="q-mx-auto q-px-md" style="max-width: 1200px">
      <div class="text-center q-mb-xl">
        <div class="component-title text-h4 text-weight-bold">{{ titulo }}</div>
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
            class="partner-card q-pa-md text-center shadow-1 q-hoverable"
            :class="{ 'partner-card-active': activeCard === index }"
            @mouseover="activeCard = index"
            @mouseleave="activeCard = null"
          >
            <q-card-section class="q-pa-none flex justify-center items-center" style="height: 100px;">
              <a 
                :href="socio.url" 
                target="_blank" 
                rel="noopener noreferrer"
                class="socio-link full-width flex flex-center"
              >
                <div v-if="socio.imagen && socio.imagen.url" class="logo-container">
                  <img 
                    :src="getLogoUrl(socio.imagen)"
                    class="socio-logo"
                    :alt="socio.imagen.title || 'Logo de socio'"
                    @error="onImageError($event, index)"
                  >
                </div>
                <div v-else-if="!socioImgError[index]" class="fallback-image">
                  <q-icon name="business" size="2rem" color="grey-7" />
                  <div class="text-subtitle2 text-bold q-mt-sm">{{ socio.imagen?.title || 'Partner' }}</div>
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
  
  // Construir URL base del API de Wagtail
  const wagtailBaseUrl = 'https://e412-2806-103e-1d-3687-f08f-4014-a8d6-4606.ngrok-free.app';
  
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
/* Contenedor para ancho completo */
.full-width-container {
  width: 100vw;
  position: relative;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
  padding: 0;
  overflow-x: hidden;
}

.socios-component {
  background-color: #f5f5f5;
}

.component-title {
  color: var(--q-primary);
  margin-bottom: 1.5rem;
}

.partner-card {
  transition: all 0.3s ease;
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
}

.partner-card-active {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1) !important;
}

.socio-link {
  display: block;
  width: 100%;
  text-decoration: none;
}

.socio-logo {
  max-width: 100%;
  max-height: 100px;
  object-fit: contain;
  transition: transform 0.2s ease;
}

.partner-card:hover .socio-logo {
  transform: scale(1.05);
}

.fallback-image {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100px;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 5px;
  transition: all 0.3s ease;
}

.partner-card:hover .fallback-image {
  background-color: rgba(0, 0, 0, 0.08);
}

/* Estilos responsivos */
@media (max-width: 599px) {
  .partner-card {
    height: 150px;
  }
  
  .socio-logo {
    max-height: 80px;
  }
  
  .component-title {
    font-size: 1.8rem !important;
  }
}
</style>
