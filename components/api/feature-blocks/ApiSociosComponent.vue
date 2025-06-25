<template>
  <section 
    :id="'socios-' + (id || Math.random().toString(36).substring(2, 9))" 
    class="q-py-md q-px-sm"
  >
    <div class="q-mx-auto q-mb-md" style="max-width: 1000px;">
      <div class="text-center q-mb-md">
        <h2 class="text-h3 text-weight-bold">{{ titulo }}</h2>
      </div>
      
      <!-- Carrusel automático cuando hay más de 6 logos -->
      <q-carousel
        v-if="logos.length > 6"
        animated
        infinite
        autoplay
        :autoplay-timeout="4000"
        arrows
        transition-prev="slide-right"
        transition-next="slide-left"
        swipeable
        class="bg-transparent shadow-0 q-mb-md"
        height="180px"
        @mouseenter="autoplay = false"
        @mouseleave="autoplay = true"
      >
        <q-carousel-slide v-for="(group, slideIndex) in logoGroups" :key="slideIndex" :name="slideIndex" class="q-pa-none">
          <div class="row justify-center items-center full-height full-width q-col-gutter-lg">
            <div 
              v-for="(socio, logoIndex) in group" 
              :key="logoIndex"
              class="col-4 col-sm-4 col-md-2 flex flex-center"
            >
              <a 
                :href="socio.url" 
                target="_blank" 
                rel="noopener noreferrer"
                class="logo-container"
              >
                <q-img 
                  v-if="socio.imagen && socio.imagen.url"
                  :src="getLogoUrl(socio.imagen)"
                  :alt="socio.imagen.title || 'Logo de socio'"
                  class="socio-logo"
                  :class="{'grayscale': activeCard !== socio.id}"
                  fit="contain"
                  @error="onImageError($event, socio.id)"
                  @mouseover="activeCard = socio.id"
                  @mouseleave="activeCard = null"
                />
                <div 
                  v-else-if="!socioImgError[socio.id]" 
                  class="flex column flex-center bg-grey-2 rounded-borders full-width"
                  style="height: 120px;"
                >
                  <q-icon name="business" size="2rem" color="grey-7" />
                  <div class="text-subtitle2 text-weight-bold q-mt-sm">{{ socio.imagen?.title || 'Partner' }}</div>
                </div>
              </a>
            </div>
          </div>
        </q-carousel-slide>
      </q-carousel>
      
      <!-- Vista normal cuando hay 6 o menos logos -->
      <div v-else class="row q-col-gutter-lg justify-center items-center">
        <div 
          v-for="(socio, index) in logos" 
          :key="index"
          class="col-6 col-sm-4 col-md-2 flex flex-center q-mb-md"
        >
          <a 
            :href="socio.url" 
            target="_blank" 
            rel="noopener noreferrer"
            class="logo-container"
          >
            <q-img 
              v-if="socio.imagen && socio.imagen.url"
              :src="getLogoUrl(socio.imagen)"
              :alt="socio.imagen.title || 'Logo de socio'"
              class="socio-logo"
              :class="{'grayscale': activeCard !== index}"
              fit="contain"
              @error="onImageError($event, index)"
              @mouseover="activeCard = index"
              @mouseleave="activeCard = null"
            />
            <div 
              v-else-if="!socioImgError[index]" 
              class="flex column flex-center bg-grey-2 rounded-borders full-width"
              style="height: 120px;"
            >
              <q-icon name="business" size="2rem" color="grey-7" />
              <div class="text-subtitle2 text-weight-bold q-mt-sm">{{ socio.imagen?.title || 'Partner' }}</div>
            </div>
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

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
    default: ''
  }
});

// Estado local
const activeCard = ref(null);
const socioImgError = ref({});
const autoplay = ref(true);

// Extraer datos del bloque
const titulo = computed(() => {
  return props.block?.value?.titulo || 'Seguimos sumando visiones';
});

const logos = computed(() => {
  // Asignar un ID único a cada logo para el tracking
  return (props.block?.value?.logos || []).map((logo, index) => ({
    ...logo,
    id: index
  }));
});

// Agrupar logos para el carrusel (6 logos por slide)
const logoGroups = computed(() => {
  const groups = [];
  const itemsPerSlide = 6;
  
  for (let i = 0; i < logos.value.length; i += itemsPerSlide) {
    groups.push(logos.value.slice(i, i + itemsPerSlide));
  }
  
  return groups;
});

// Manejar errores de carga de imágenes
const onImageError = (event, index) => {
  // console.error(`Error al cargar imagen ${index}:`, event);
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
/* Estilos para los logos de socios */
.logo-container {
  display: block;
  text-align: center;
  width: 100%;
  height: 100%;
  padding: 10px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.socio-logo {
  max-height: 120px;
  width: 100%;
  object-fit: contain;
  transition: filter 0.4s ease;
}

.grayscale {
  filter: grayscale(100%);
}

/* Asegurar que el carrusel tenga un fondo transparente */
:deep(.q-carousel) {
  background: transparent;
  box-shadow: none;
}

/* Estilizar los controles del carrusel */
:deep(.q-carousel__arrow) {
  color: var(--q-primary);
  background: rgba(255, 255, 255, 0.7);
}

/* Asegurar que las imágenes estén centradas */
:deep(.q-img__content) {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
