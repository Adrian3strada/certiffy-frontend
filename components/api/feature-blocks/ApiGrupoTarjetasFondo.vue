<template>
  <div class="grupo-tarjetas-fondo-container">
    
    <!-- Estado de carga -->
    <div v-if="loading" class="full-width flex justify-center items-center" style="min-height: 100px">
      <q-spinner color="primary" size="1.5em" />
      <span class="q-ml-sm text-caption">Cargando tarjetas...</span>
    </div>
    
    <!-- Estado de error -->
    <div v-else-if="error" class="error-container q-pa-xs">
      <div class="text-negative text-caption">
        <q-icon name="error" size="1rem" />
        <span class="q-ml-sm">{{ error }}</span>
      </div>
    </div>
    
    <!-- Contenido principal: carrusel horizontal de tarjetas -->
    <div v-else class="carrusel-horizontal">
      <!-- Botón navegación izquierda -->
      <button 
        v-if="canScrollLeft"
        class="nav-button nav-left" 
        @click="scrollLeft"
      >
        <q-icon name="chevron_left" size="1.5rem" />
      </button>
      
      <!-- Container de tarjetas con scroll -->
      <div class="tarjetas-container" ref="tarjetasContainer">
        <div class="tarjetas-scroll">
          <div 
            v-for="(tarjeta, index) in tarjetas" 
            :key="index" 
            class="tarjeta-item"
          >
            <div class="tarjeta-card">
              <div 
                class="imagen-fondo" 
                :style="{ backgroundImage: tarjeta.imageUrl ? `url('${tarjeta.imageUrl}')` : 'none' }"
                @error="handleImageError(index)"
              >
                <div class="contenido-tarjeta">
                  <div v-if="tarjeta.marca" class="marca-tarjeta">{{ tarjeta.marca }}</div>
                  <h3 v-if="tarjeta.titulo" class="titulo-tarjeta">{{ tarjeta.titulo }}</h3>
                  <div class="descripcion-tarjeta" v-html="tarjeta.descripcion"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Botón navegación derecha -->
      <button 
        v-if="canScrollRight"
        class="nav-button nav-right" 
        @click="scrollRight"
      >
        <q-icon name="chevron_right" size="1.5rem" />
      </button>
      
      <!-- Indicadores de scroll -->
      <div v-if="showIndicators" class="scroll-indicators">
        <div 
          v-for="(_, index) in Math.ceil(tarjetas.length / visibleCards)" 
          :key="index" 
          class="indicator"
          :class="{ 'active': index === currentPage }"
          @click="goToPage(index)"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, computed } from 'vue';

const props = defineProps({
  block: {
    type: Object,
    required: true
  },
  apiBaseUrl: {
    type: String,
    default: process.env.NUXT_PUBLIC_API_BASE || ''
  }
});

// Variables reactivas
const tarjetas = ref([]);
const loading = ref(false);
const error = ref(null);

const tarjetasContainer = ref(null);
const scrollPosition = ref(0);
const containerWidth = ref(0);
const cardWidth = ref(320);
const visibleCards = ref(3);
const currentPage = ref(0);

// Computed properties
const canScrollLeft = computed(() => scrollPosition.value > 0);
const canScrollRight = computed(() => {
  const maxScroll = (tarjetas.value.length * cardWidth.value) - containerWidth.value;
  return scrollPosition.value < maxScroll - 10;
});
const showIndicators = computed(() => tarjetas.value.length > visibleCards.value);

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

// Manejar error al cargar la imagen
const handleImageError = (index) => {
  if (tarjetas.value[index]) {
    tarjetas.value[index].imageUrl = '/images/placeholder-card.jpg';
  }
};

// Funciones de navegación
const scrollLeft = () => {
  const newPosition = Math.max(0, scrollPosition.value - (cardWidth.value * visibleCards.value));
  scrollToPosition(newPosition);
};

const scrollRight = () => {
  const maxScroll = (tarjetas.value.length * cardWidth.value) - containerWidth.value;
  const newPosition = Math.min(maxScroll, scrollPosition.value + (cardWidth.value * visibleCards.value));
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
  const position = pageIndex * (cardWidth.value * visibleCards.value);
  scrollToPosition(position);
};

const updateCurrentPage = () => {
  currentPage.value = Math.floor(scrollPosition.value / (cardWidth.value * visibleCards.value));
};

// Calcular dimensiones
const calculateDimensions = () => {
  if (tarjetasContainer.value) {
    containerWidth.value = tarjetasContainer.value.offsetWidth;
    
    // Calcular tarjetas visibles según el ancho del container
    if (containerWidth.value >= 1200) {
      visibleCards.value = 4;
      cardWidth.value = 300;
    } else if (containerWidth.value >= 900) {
      visibleCards.value = 3;
      cardWidth.value = 280;
    } else if (containerWidth.value >= 600) {
      visibleCards.value = 2;
      cardWidth.value = 260;
    } else {
      visibleCards.value = 1;
      cardWidth.value = Math.min(280, containerWidth.value - 40);
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
  loading.value = true;
  try {

    
    const blockData = props.block.value || props.block;
    
    if (blockData.tarjetas && Array.isArray(blockData.tarjetas)) {
      // Procesar cada tarjeta del grupo
      tarjetas.value = blockData.tarjetas.map(tarjeta => {
        // Procesar imagen
        let imageUrl = '';
        if (tarjeta.imagen) {
          if (typeof tarjeta.imagen === 'string') {
            imageUrl = tarjeta.imagen;
          } else if (tarjeta.imagen.url) {
            imageUrl = tarjeta.imagen.url;
          } else if (tarjeta.imagen.src) {
            imageUrl = tarjeta.imagen.src;
          }
          
          if (imageUrl && imageUrl.startsWith('/')) {
            imageUrl = `/api/proxy-image?url=${encodeURIComponent(props.apiBaseUrl + imageUrl)}`;
          }
        }
        
        // Si no hay imagen, usar una por defecto
        if (!imageUrl) {
          imageUrl = 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=1856&auto=format&fit=crop';
        }
        
        // Extraer título si existe en la descripción
        const descripcion = tarjeta.descripcion || '';
        const titulo = extractTitle(descripcion) || '';
        const marca = tarjeta.marca || '';
        
        return {
          imageUrl,
          descripcion,
          titulo,
          marca
        };
      });
    } else {
      // Si no hay tarjetas, no mostrar nada
      tarjetas.value = [];
      error.value = 'No se encontraron tarjetas para mostrar';
    }
    

    
    // Esperar al siguiente tick para calcular dimensiones
    await nextTick();
    calculateDimensions();
    
  } catch (err) {

    error.value = 'Error al procesar el bloque: ' + err.message;
    tarjetas.value = [];
  } finally {
    loading.value = false;
  }
  
  // Agregar listeners
  window.addEventListener('resize', handleResize);
  if (tarjetasContainer.value) {
    tarjetasContainer.value.addEventListener('scroll', handleScroll);
  }
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  if (tarjetasContainer.value) {
    tarjetasContainer.value.removeEventListener('scroll', handleScroll);
  }
});
</script>

<style scoped>
.grupo-tarjetas-fondo-container {
  margin: 2rem auto;
  position: relative;
  max-width: 1200px;
  width: 100%;
  padding: 0 1rem;
}

.carrusel-horizontal {
  position: relative;
  width: 100%;
}

.tarjetas-container {
  overflow-x: auto;
  overflow-y: hidden;
  scroll-behavior: smooth;
  scrollbar-width: none;
  -ms-overflow-style: none;
  position: relative;
}

.tarjetas-container::-webkit-scrollbar {
  display: none;
}

.tarjetas-scroll {
  display: flex;
  gap: 1.5rem;
  padding: 1rem 0;
  width: max-content;
}

.tarjeta-item {
  flex: 0 0 auto;
  width: 280px;
}

.tarjeta-card {
  border-radius: 16px;
  overflow: hidden;
  height: 380px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  cursor: pointer;
}

.tarjeta-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.25);
}

.imagen-fondo {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
  display: flex;
  align-items: flex-end;
  background-color: #f0f0f0;
}

.imagen-fondo::before {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0.1) 50%,
    rgba(0, 0, 0, 0.7) 85%,
    rgba(0, 0, 0, 0.9) 100%
  );
  z-index: 1;
}

.contenido-tarjeta {
  position: relative;
  z-index: 2;
  padding: 2rem 1.5rem;
  color: white;
  width: 100%;
}

.marca-tarjeta {
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 0.5rem;
  opacity: 0.9;
  color: #ffffff;
}

.titulo-tarjeta {
  font-size: 1.8rem;
  font-weight: 900;
  text-transform: uppercase;
  margin: 0 0 0.75rem 0;
  line-height: 1.1;
  letter-spacing: -0.5px;
  color: #ffffff;
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.7);
  font-family: 'Arial Black', 'Helvetica', sans-serif;
}

.descripcion-tarjeta {
  font-size: 0.9rem;
  line-height: 1.4;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.9);
  text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.5);
}

.descripcion-tarjeta p {
  margin: 0 0 0.5rem 0;
}

.descripcion-tarjeta p:last-child {
  margin-bottom: 0;
}

/* Botones de navegación */
.nav-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  color: #333;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  z-index: 10;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.nav-button:hover {
  background: white;
  transform: translateY(-50%) scale(1.1);
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.25);
}

.nav-left {
  left: -25px;
}

.nav-right {
  right: -25px;
}

/* Indicadores de scroll */
.scroll-indicators {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 2rem;
}

.indicator {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.3);
  cursor: pointer;
  transition: all 0.3s ease;
}

.indicator:hover {
  background: rgba(0, 0, 0, 0.5);
}

.indicator.active {
  background: #333;
  transform: scale(1.2);
}



/* Estilo para error */
.error-container {
  font-size: 0.75rem;
  background: rgba(255, 0, 0, 0.03);
  border-radius: 4px;
  padding: 0.25rem;
}

/* Responsive */
@media (max-width: 1200px) {
  .tarjeta-item {
    width: 260px;
  }
  
  .tarjeta-card {
    height: 360px;
  }
}

@media (max-width: 900px) {
  .tarjeta-item {
    width: 240px;
  }
  
  .tarjeta-card {
    height: 340px;
  }
  
  .titulo-tarjeta {
    font-size: 1.6rem;
  }
}

@media (max-width: 768px) {
  .grupo-tarjetas-fondo-container {
    padding: 0 0.5rem;
  }
  
  .tarjetas-scroll {
    gap: 1rem;
  }
  
  .tarjeta-item {
    width: 220px;
  }
  
  .tarjeta-card {
    height: 320px;
  }
  
  .nav-button {
    width: 40px;
    height: 40px;
  }
  
  .nav-left {
    left: -20px;
  }
  
  .nav-right {
    right: -20px;
  }
  
  .titulo-tarjeta {
    font-size: 1.4rem;
  }
  
  .descripcion-tarjeta {
    font-size: 0.85rem;
  }
}

@media (max-width: 600px) {
  .tarjeta-item {
    width: calc(100vw - 3rem);
    max-width: 280px;
  }
  
  .tarjetas-scroll {
    padding: 1rem 0.5rem;
  }
  
  .nav-button {
    display: none;
  }
}
</style>