<template>
  <section class="bg-black q-py-xl">
    <div class="q-mx-auto q-px-md" style="max-width: 1400px">
      <!-- Estado de carga -->
      <div v-if="loading" class="flex flex-center q-pa-lg">
        <q-spinner color="primary" size="1.5em" />
        <span class="q-ml-sm text-caption text-primary">Cargando tarjetas...</span>
      </div>
      
      <!-- Estado de error -->
      <div v-else-if="error" class="bg-red-1 q-pa-xs rounded-borders">
        <div class="text-negative text-caption">
          <q-icon name="error" size="1rem" />
          <span class="q-ml-sm">{{ error }}</span>
        </div>
      </div>
      
      <!-- Contenido principal: carrusel horizontal de tarjetas -->
      <div v-else>
        <!-- Encabezado con título y controles -->
        <div class="row justify-between items-start q-mb-xl">
          <div class="col-12 col-md-8">
            <h2 class="text-h3 text-primary text-weight-bold q-my-none">{{ tituloApartado }}</h2>
          </div>
          
          <!-- Controles de navegación en la parte superior derecha -->
          <div class="col-auto" v-if="tarjetas.length > visibleCards">
            <q-btn
              round
              flat
              color="grey-4"
              icon="chevron_left"
              dense
              class="q-mr-sm shadow-1"
              :disable="!canScrollLeft"
              @click="scrollLeft"
            />
            <q-btn
              round
              flat
              color="grey-4"
              icon="chevron_right"
              dense
              class="shadow-1"
              :disable="!canScrollRight"
              @click="scrollRight"
            />
          </div>
        </div>
      
        <!-- Contenedor de tarjetas con scroll horizontal -->
        <div class="q-py-sm" style="position: relative; width: 100%; overflow: hidden;">
          <div 
            class="row no-wrap q-py-md q-gutter-x-lg" 
            style="overflow-x: auto; scroll-behavior: smooth; scrollbar-width: none; -ms-overflow-style: none; scroll-snap-type: x mandatory;"
            ref="tarjetasContainer"
          >
            <NuxtLink 
              v-for="(tarjeta, index) in tarjetas" 
              :key="index" 
              class="col-auto q-hoverable"
              style="width: 280px; height: 400px; text-decoration: none; color: inherit; transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); border-radius: 20px; overflow: hidden; scroll-snap-align: start;"
              :style="{'transform': $q.hover ? 'translateY(-12px) scale(1.02)' : 'none'}"
              :to="getCardUrl(tarjeta)"
            >
              <q-card class="full-height" flat>
                <!-- Imagen de fondo -->
                <q-img
                  :src="tarjeta.imageUrl"
                  error-src="https://placehold.co/600x400/333333/666666?text=No+Image"
                  spinner-color="white"
                  spinner-size="42px"
                  class="full-height"
                  fit="cover"
                >
                  <!-- Gradient overlay para mejor legibilidad -->
                  <template v-slot:after>
                    <div class="absolute-full" style="background: linear-gradient(135deg, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.7) 50%, rgba(0, 0, 0, 0.9) 100%); box-shadow: inset 0 0 30px rgba(0, 0, 0, 0.8);"></div>
                  </template>

                  <!-- Contenido de texto superpuesto -->
                  <div class="absolute-bottom q-pa-md text-white" style="background: linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.4) 70%, transparent 100%);">
                    <!-- Categoría como badge/etiqueta -->
                    <q-badge 
                      color="primary" 
                      text-color="white" 
                      class="q-mb-sm text-uppercase text-weight-bold" 
                      style="font-size: 0.65rem; letter-spacing: 0.5px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);"
                    >
                      {{ tarjeta.categoria || 'General' }}
                    </q-badge>
                    
                    <!-- Fecha formateada -->
                    <div class="text-caption text-white-8 q-mb-sm" v-if="tarjeta.fecha">
                      {{ formatDate(tarjeta.fecha) }}
                    </div>
                    
                    <!-- Título principal -->
                    <div class="text-h5 text-white text-weight-bold q-mb-sm" style="text-shadow: 0 2px 8px rgba(0, 0, 0, 0.7); line-height: 1.2;">
                      {{ tarjeta.titulo || (tarjeta.descripcion ? stripHtml(tarjeta.descripcion) : 'Artículo') }}
                    </div>
                    
                    <!-- Descripción -->
                    <div 
                      class="text-body2 text-white-9" 
                      v-if="tarjeta.descripcion" 
                      style="overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;"
                    >
                      {{ stripHtml(tarjeta.descripcion) }}
                    </div>
                  </div>
                </q-img>
              </q-card>
            </NuxtLink>
          </div>
        </div>
        
        <!-- Indicadores de página (dots) -->
        <div v-if="showIndicators" class="flex justify-center items-center q-gutter-x-sm q-mt-lg">
          <q-btn 
            v-for="(_, index) in Math.ceil(tarjetas.length / visibleCards)" 
            :key="index" 
            round 
            dense 
            flat
            :color="index === currentPage ? 'primary' : 'grey-7'"
            size="sm"
            :style="{
              transform: index === currentPage ? 'scale(1.2)' : 'scale(1)',
              opacity: index === currentPage ? 1 : 0.6,
              transition: 'all 0.3s ease'
            }"
            @click="goToPage(index)"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, computed } from 'vue';
import { useRuntimeConfig } from '#app';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

const props = defineProps({
  block: {
    type: Object,
    required: true
  },
  apiBaseUrl: {
    type: String,
    default: () => useRuntimeConfig().public.apiBase
  }
});

// Variables reactivas
const tarjetas = ref([]);
const loading = ref(false);
const error = ref(null);
const tituloApartado = ref('Events that liberate');

const tarjetasContainer = ref(null);
const scrollPosition = ref(0);
const containerWidth = ref(0);
const cardWidth = ref(300);
const visibleCards = ref(5);
const currentPage = ref(0);

// Computed properties
const canScrollLeft = computed(() => scrollPosition.value > 0);
const canScrollRight = computed(() => {
  const maxScroll = (tarjetas.value.length * cardWidth.value) - containerWidth.value;
  return scrollPosition.value < maxScroll - 10;
});
const showIndicators = computed(() => tarjetas.value.length > visibleCards.value);

// Generar subtítulo basado en el contenido
const getCardSubtitle = (tarjeta) => {
  const subtitulos = [
    'Grow your business exponentially',
    'Become a great leader',
    'Create life according to your terms',
    'Experience explosive growth',
    'Master mind and body',
    'Build your money mastery'
  ];
  return subtitulos[Math.floor(Math.random() * subtitulos.length)];
};

// Extraer el título si existe en el contenido HTML
const extractTitle = (htmlContent) => {
  try {
    if (!htmlContent) return '';
    
    const boldMatch = htmlContent.match(/<b>([^<]+)<\/b>/);
    const titleRegex = /<h[1-3][^>]*>([^<]+)<\/h[1-3]>/;
    const match = htmlContent.match(titleRegex);
    
    if (boldMatch && boldMatch.length > 1) {
      return boldMatch[1].trim();
    }
    else if (match && match.length > 1) {
      return match[1].trim();
    }
    return null;
  } catch (err) {
    console.warn('Error al extraer título:', err);
    return null;
  }
};

// Eliminar etiquetas HTML de un texto
const stripHtml = (html) => {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '');
};

// Formatear fecha en español
const formatDate = (dateString) => {
  try {
    if (!dateString) return '';
    const date = parseISO(dateString);
    return format(date, "d 'de' MMMM, yyyy", { locale: es });
  } catch (error) {
    console.error('Error al formatear fecha:', error);
    return dateString;
  }
};

// Convertir URLs del backend a frontend
const getCardUrl = (tarjeta) => {
  try {
    if (!tarjeta || !tarjeta.url) return '#';
    
    const config = useRuntimeConfig();
    const frontendBaseUrl = config.public.frontendUrl || 'http://localhost:3000';
    
    let url = tarjeta.url;
    
    if (url.includes('127.0.0.1:8000') || url.includes('localhost:8000')) {
      const urlObj = new URL(url);
      url = `${frontendBaseUrl}${urlObj.pathname}`;
    }
    
    return url;
  } catch (error) {
    console.error('Error al procesar URL:', error);
    return '#';
  }
};

// Funciones de navegación
const scrollLeft = () => {
  const newPosition = Math.max(0, scrollPosition.value - cardWidth.value);
  scrollToPosition(newPosition);
};

const scrollRight = () => {
  const maxScroll = (tarjetas.value.length * cardWidth.value) - containerWidth.value;
  const newPosition = Math.min(maxScroll, scrollPosition.value + cardWidth.value);
  scrollToPosition(newPosition);
};

const scrollToPosition = (position) => {
  scrollPosition.value = position;
  if (tarjetasContainer.value) {
    tarjetasContainer.value.scrollTo({
      left: position,
      behavior: 'smooth'
    });
  }
  updateCurrentPage();
};

const goToPage = (pageIndex) => {
  const position = pageIndex * cardWidth.value;
  scrollToPosition(position);
};

const updateCurrentPage = () => {
  currentPage.value = Math.round(scrollPosition.value / cardWidth.value);
};

// Calcular dimensiones
const calculateDimensions = () => {
  if (tarjetasContainer.value) {
    containerWidth.value = tarjetasContainer.value.offsetWidth;
    
    if (containerWidth.value >= 1400) {
      visibleCards.value = 5;
      cardWidth.value = 280;
    } else if (containerWidth.value >= 1200) {
      visibleCards.value = 4;
      cardWidth.value = 300;
    } else if (containerWidth.value >= 900) {
      visibleCards.value = 3;
      cardWidth.value = 300;
    } else if (containerWidth.value >= 600) {
      visibleCards.value = 2;
      cardWidth.value = 280;
    } else {
      visibleCards.value = 1;
      cardWidth.value = Math.min(300, containerWidth.value - 40);
    }
  }
};

// Manejar scroll manual
const handleScroll = () => {
  if (tarjetasContainer.value) {
    scrollPosition.value = tarjetasContainer.value.scrollLeft;
    updateCurrentPage();
  }
};

// Manejar resize de ventana
const handleResize = () => {
  calculateDimensions();
};

// Procesar los datos del bloque
onMounted(async () => {
  try {
    loading.value = true;
    
    const blockValue = props.block?.value;
    
    if (!blockValue) {
      throw new Error('No se encontraron datos en este bloque');
    }
    
    tituloApartado.value = blockValue.titulo_apartado || 'Events that liberate';
    
    tarjetas.value = blockValue.tarjetas?.map((tarjeta, index) => {
      const extractedTitle = extractTitle(tarjeta.contenido);
      
      let imageUrl = '';
      
      if (tarjeta.imagen?.url) {
        imageUrl = tarjeta.imagen.url;
      } else if (typeof tarjeta.imagen === 'string') {
        imageUrl = tarjeta.imagen;
      }
      
      if (imageUrl && !imageUrl.startsWith('http')) {
        const config = useRuntimeConfig();
        const baseUrl = config.public.apiBase || 'http://localhost:3000';
        
        let url = imageUrl;
        
        if (url.includes('127.0.0.1:8000') || url.includes('localhost:8000')) {
          const urlObj = new URL(url);
          url = `${baseUrl}${urlObj.pathname}`;
        }
        
        imageUrl = `/api/proxy-image?url=${encodeURIComponent(url)}`;
      }
      
      return {
        titulo: tarjeta.titulo || extractedTitle || (tarjeta.descripcion ? stripHtml(tarjeta.descripcion) : ''),
        contenido: tarjeta.contenido || '',
        categoria: tarjeta.categoria || 'General',
        fecha: formatDate(tarjeta.fecha) || '',
        url: tarjeta.url || '#',
        imageUrl: imageUrl,
        subtitulo: tarjeta.subtitulo || getCardSubtitle(tarjeta)
      };
    }) || [];
    
    nextTick(() => {
      calculateDimensions();
    });
  } catch (err) {
    console.error('Error al cargar las tarjetas:', err);
    error.value = 'Error al cargar los datos: ' + (err.message || 'Desconocido');
  } finally {
    loading.value = false;
  }
  
  nextTick(() => {
    if (process.client) {
      window.addEventListener('resize', handleResize);
      tarjetasContainer.value?.addEventListener('scroll', handleScroll);
    }
  });
});

onUnmounted(() => {
  if (process.client) {
    window.removeEventListener('resize', handleResize);
    tarjetasContainer.value?.removeEventListener('scroll', handleScroll);
  }
});
</script>

<style>
/* Ya no necesitamos importar CSS externo, ahora usamos componentes y utilidades de Quasar */
</style>