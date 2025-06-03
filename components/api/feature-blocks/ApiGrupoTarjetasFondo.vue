<template>
  <div class="q-pa-md q-mx-auto" style="max-width: 1200px; width: 100%;">
    
    <!-- Estado de carga -->
    <div v-if="loading" class="full-width flex justify-center items-center" style="min-height: 100px">
      <q-spinner color="primary" size="1.5em" />
      <span class="q-ml-sm text-caption">Cargando tarjetas...</span>
    </div>
    
    <!-- Estado de error -->
    <div v-else-if="error" class="bg-red-1 q-pa-xs rounded-borders">
      <div class="text-negative text-caption">
        <q-icon name="error" size="1rem" />
        <span class="q-ml-sm">{{ error }}</span>
      </div>
    </div>
    
    <!-- Contenido principal: carrusel horizontal de tarjetas -->
    <div v-else class="q-mt-md q-mb-md relative-position">
      <!-- Botón navegación izquierda -->
      <q-btn 
        v-if="canScrollLeft"
        round
        flat
        color="dark"
        class="absolute-left bg-white shadow-5 q-transition-scale"
        style="top: 50%; transform: translateY(-50%); left: -25px; z-index: 10;"
        icon="chevron_left"
        size="md"
        @click="scrollLeft"
        :style="$q.screen.lt.md ? {left: '-20px'} : {}"
      />
      
      <!-- Container de tarjetas con scroll -->
      <div 
        class="overflow-auto scroll-smooth no-scrollbar relative-position" 
        ref="tarjetasContainer"
        style="-ms-overflow-style: none; scrollbar-width: none;"
      >
        <div class="row no-wrap q-py-md" style="gap: 1.5rem;">
          <div 
            v-for="(tarjeta, index) in tarjetas" 
            :key="index" 
            :class="[
              'col-auto', 
              $q.screen.xs ? 'q-pr-sm' : '',
              $q.screen.lt.md ? 'q-px-xs' : ''
            ]"
            :style="{
              width: $q.screen.lt.sm ? 'calc(100vw - 3rem)' : 
                    $q.screen.lt.md ? '240px' : 
                    $q.screen.lt.lg ? '260px' : '280px',
              'max-width': $q.screen.xs ? '280px' : 'none'
            }"
          >
            <q-card 
              class="q-transition-ease shadow-8 cursor-pointer" 
              :style="{
                height: $q.screen.lt.sm ? '320px' : 
                       $q.screen.lt.md ? '340px' : 
                       $q.screen.lt.lg ? '360px' : '380px',
                borderRadius: '16px',
                'transform-origin': 'center bottom',
                '&:hover': { transform: 'translateY(-8px)', boxShadow: '0 16px 48px rgba(0, 0, 0, 0.25)' }
              }"
            >
              <div 
                class="full-height relative-position" 
                :style="{ 
                  backgroundImage: tarjeta.imageUrl ? `url('${tarjeta.imageUrl}')` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  backgroundColor: '#f0f0f0'
                }"
                @error="handleImageError(index)"
              >
                <!-- Gradient overlay -->
                <div 
                  class="absolute-full" 
                  style="background: linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.7) 85%, rgba(0,0,0,0.9) 100%); z-index: 1;"
                ></div>
                
                <div class="absolute-bottom q-px-md q-pb-lg" style="z-index: 2; width: 100%;">
                  <div 
                    v-if="tarjeta.marca" 
                    class="text-white text-uppercase text-weight-bold q-mb-xs" 
                    style="font-size: 0.8rem; letter-spacing: 1px; opacity: 0.9; text-shadow: 1px 1px 2px rgba(0,0,0,0.5);"
                  >
                    {{ tarjeta.marca }}
                  </div>
                  
                  <h3 
                    v-if="tarjeta.titulo" 
                    class="text-white text-uppercase text-weight-black q-my-none" 
                    :class="$q.screen.lt.md ? 'text-h5' : 'text-h4'"
                    style="line-height: 1.1; letter-spacing: -0.5px; text-shadow: 2px 2px 8px rgba(0,0,0,0.7); margin-bottom: 0.75rem;"
                  >
                    {{ tarjeta.titulo }}
                  </h3>
                  
                  <div 
                    class="text-white" 
                    style="font-size: 0.9rem; line-height: 1.4; opacity: 0.9; text-shadow: 1px 1px 4px rgba(0,0,0,0.5);"
                    :style="$q.screen.lt.md ? {'font-size': '0.85rem'} : {}"
                    v-html="tarjeta.descripcion"
                  ></div>
                </div>
              </div>
            </q-card>
          </div>
        </div>
      </div>
      
      <!-- Botón navegación derecha -->
      <q-btn 
        v-if="canScrollRight"
        round
        flat
        color="dark"
        class="absolute-right bg-white shadow-5 q-transition-scale"
        style="top: 50%; transform: translateY(-50%); right: -25px; z-index: 10;"
        icon="chevron_right"
        size="md"
        @click="scrollRight"
        :style="$q.screen.lt.md ? {right: '-20px'} : {}"
        :class="$q.screen.xs ? 'hidden' : ''"
      />
      
      <!-- Indicadores de scroll -->
      <div v-if="showIndicators" class="row justify-center q-gutter-xs q-mt-lg">
        <q-btn 
          v-for="(_, index) in Math.ceil(tarjetas.length / visibleCards)" 
          :key="index" 
          round
          dense
          flat
          :color="index === currentPage ? 'dark' : 'grey-6'"
          size="10px"
          :style="index === currentPage ? {transform: 'scale(1.2)'} : {}"
          @click="goToPage(index)"
        />
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
