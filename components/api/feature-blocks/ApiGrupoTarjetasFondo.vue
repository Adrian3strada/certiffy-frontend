<template>
  <section class="tarjetas-section q-py-xl" style="background-color: #f7f7f7;">
    <div class="container-wrapper q-mx-auto q-px-md">
      <!-- Estado de carga -->
      <div v-if="loading" class="full-width flex justify-center items-center" style="min-height: 100px">
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
        <div class="header-row q-mb-xl">
          <div class="section-title-container">
            <h2 class="section-title primary-title">{{ tituloApartado }}</h2>
          </div>
          
          <!-- Controles de navegación en la parte superior derecha -->
          <div class="control-buttons" v-if="tarjetas.length > visibleCards">
            <q-btn
              round
              flat
              color="grey-4"
              icon="chevron_left"
              dense
              class="nav-btn q-mr-sm"
              :disable="!canScrollLeft"
              @click="scrollLeft"
            />
            <q-btn
              round
              flat
              color="grey-4"
              icon="chevron_right"
              dense
              class="nav-btn"
              :disable="!canScrollRight"
              @click="scrollRight"
            />
          </div>
        </div>
      
        <!-- Contenedor de tarjetas con scroll horizontal -->
        <div class="cards-carousel">
          <div class="cards-container" ref="tarjetasContainer">
            <NuxtLink 
              v-for="(tarjeta, index) in tarjetas" 
              :key="index" 
              class="card-item"
              :to="getCardUrl(tarjeta)"
            >
              <div class="card-content">
                <!-- Imagen de fondo -->
                <q-img
                  :src="tarjeta.imageUrl"
                  error-src="https://placehold.co/600x400/333333/666666?text=No+Image"
                  spinner-color="white"
                  spinner-size="42px"
                  class="card-background"
                  fit="cover"
                  height="100%"
                >
                  <!-- Gradient overlay para mejor legibilidad -->
                  <template v-slot:after>
                    <div class="card-overlay"></div>
                  </template>
                </q-img>
                
                <!-- Contenido de texto superpuesto -->
                <div class="card-text-content">
                  <!-- Categoría como badge/etiqueta -->
                  <div class="card-badge">
                    {{ tarjeta.categoria || 'General' }}
                  </div>
                  
                  <!-- Fecha formateada -->
                  <div class="card-date" v-if="tarjeta.fecha">
                    {{ formatDate(tarjeta.fecha) }}
                  </div>
                  
                  <!-- Título principal -->
                  <h3 class="card-title">
                    {{ tarjeta.titulo || (tarjeta.descripcion ? stripHtml(tarjeta.descripcion) : 'Artículo') }}
                  </h3>
                  
                  <!-- Descripción -->
                  <div class="card-subtitle" v-if="tarjeta.descripcion">
                    {{ stripHtml(tarjeta.descripcion) }}
                  </div>
                </div>
              </div>
            </NuxtLink>
          </div>
        </div>
        
        <!-- Indicadores de página (dots) -->
        <div v-if="showIndicators" class="dots-container">
          <div 
            v-for="(_, index) in Math.ceil(tarjetas.length / visibleCards)" 
            :key="index" 
            class="dot"
            :class="{ 'dot-active': index === currentPage }"
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
        const fullImageUrl = imageUrl.startsWith('/') ? `${baseUrl}${imageUrl}` : `${baseUrl}/${imageUrl}`;
        imageUrl = `/api/proxy-image?url=${encodeURIComponent(fullImageUrl)}`;
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

<style scoped>
.tarjetas-section {
  width: 100%;
  padding: 4rem 0;
  background: #000000;
  min-height: 100vh;
}

.container-wrapper {
  max-width: 1400px;
  margin: 0 auto;
}

.header-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 3rem;
}

.section-title-container {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 600;
  margin: 0;
  line-height: 1.2;
}

.primary-title {
  color: var(--q-primary);
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
}

.discover-link {
  display: flex;
  align-items: center;
  color: #888888;
  cursor: pointer;
  transition: color 0.3s ease;
}

.discover-link:hover {
  color: #ffffff;
}

.discover-text {
  font-size: 0.95rem;
  font-weight: 400;
}

.control-buttons {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.nav-btn {
  background: var(--q-primary);
  backdrop-filter: blur(10px);
  border-radius: 50%;
  width: 44px;
  height: 44px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
}

.nav-btn:hover {
  background: var(--q-primary);
  transform: scale(1.05);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.4);
}

.nav-btn.q-btn--disabled {
  background: rgba(255, 255, 255, 0.1);
  opacity: 0.5;
  box-shadow: none;
}

.cards-carousel {
  position: relative;
  width: 100%;
  overflow: hidden;
}

.cards-container {
  display: flex;
  overflow-x: auto;
  scroll-behavior: smooth;
  gap: 1.5rem;
  padding: 1rem 0;
  -ms-overflow-style: none;
  scrollbar-width: none;
  scroll-snap-type: x mandatory;
}

.cards-container::-webkit-scrollbar {
  display: none;
}

.card-item {
  flex: 0 0 auto;
  width: 280px;
  height: 400px;
  text-decoration: none;
  color: inherit;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 20px;
  overflow: hidden;
  scroll-snap-align: start;
  position: relative;
}

.card-item:hover {
  transform: translateY(-12px) scale(1.02);
}

.card-content {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 20px;
  overflow: hidden;
}

.card-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 20px;
}

.card-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    135deg,
    rgba(0, 0, 0, 0.5) 0%,
    rgba(0, 0, 0, 0.7) 50%,
    rgba(0, 0, 0, 0.9) 100%
  );
  z-index: 1;
  box-shadow: inset 0 0 30px rgba(0, 0, 0, 0.8);
}

.card-text-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 2rem;
  z-index: 2;
  color: white;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.4) 70%, transparent 100%);
}

.card-badge {
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  color: white;
  background-color: var(--q-primary);
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.card-date {
  font-size: 0.7rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 0.75rem;
}

.card-title {
  font-size: 1.6rem;
  font-weight: 700;
  line-height: 1.2;
  margin: 0 0 0.75rem 0;
  color: white;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.7);
  letter-spacing: 0.5px;
}

.card-subtitle {
  font-size: 0.85rem;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.4;
  margin: 0;
  max-height: 3.8rem;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
}

.dots-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-top: 2rem;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
}

.dot-active {
  background: var(--q-primary);
  border-color: var(--q-primary);
  transform: scale(1.2);
  box-shadow: 0 0 8px var(--q-primary);
}

.dot:hover {
  background: rgba(255, 255, 255, 0.6);
  transform: scale(1.1);
}

/* Responsive adjustments */
@media (max-width: 1200px) {
  .section-title {
    font-size: 2rem;
  }
  
  .card-item {
    width: 300px;
    height: 380px;
  }
}

@media (max-width: 768px) {
  .header-row {
    flex-direction: column;
    gap: 1rem;
  }
  
  .section-title {
    font-size: 1.75rem;
  }
  
  .control-buttons {
    align-self: flex-end;
  }
  
  .card-item {
    width: 280px;
    height: 360px;
  }
  
  .card-text-content {
    padding: 1.5rem;
  }
  
  .card-title {
    font-size: 1.25rem;
  }
}

@media (max-width: 480px) {
  .tarjetas-section {
    padding: 2rem 0;
  }
  
  .cards-container {
    gap: 1rem;
  }
  
  .card-item {
    width: 260px;
    height: 340px;
  }
}
</style>