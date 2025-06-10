<template>
  <section class="q-py-xl news-section">
    <div class="q-mx-auto q-px-md" style="max-width: 1200px">
      <!-- Encabezado con título y controles -->
      <div class="row items-center justify-between q-mb-xl">
        <div class="text-h5 text-weight-bold q-pl-sm">{{ blockTitle }}</div>
        
        <!-- Controles de navegación en la parte superior derecha -->
        <div class="control-buttons">
          <q-btn
            round
            flat
            color="primary"
            icon="arrow_back_ios"
            size="sm"
            class="q-mr-sm"
            @click="scrollLeft"
          />
          <q-btn
            round
            flat
            color="primary"
            icon="arrow_forward_ios"
            size="sm"
            @click="scrollRight"
          />
        </div>
      </div>

      <!-- Contenedor de tarjetas con scroll horizontal -->
      <div class="carousel-container q-py-md">
        
        <!-- Contenedor de tarjetas con scroll horizontal -->
        <div class="news-row-container" ref="scrollContainer">
          <div 
            v-for="(card, index) in cards" 
            :key="index"
            class="news-card-wrapper q-px-md"
          >
            <div 
              class="full-height q-transition q-hoverable rounded-borders overflow-hidden news-card" 
              :class="getCardClasses(card.estilo)"
            >
              <!-- Imagen -->
              <div class="news-image">
                <img
                  v-if="card.imagen && card.imagen.url"
                  :src="`/api/proxy-image?url=${encodeURIComponent(card.imagen.url)}`"
                  alt="Imagen de noticia"
                  class="full-width"
                />
                <div v-else class="empty-image flex flex-center">
                  <q-icon name="image" size="3rem" color="grey-6" />
                </div>
              </div>

              <!-- Contenido de la tarjeta -->
              <div class="news-content q-pa-md">
                <!-- Fecha y categoría -->
                <div v-if="card.fecha || card.categoria" class="row q-mb-sm justify-between items-center">
                  <div v-if="card.categoria" class="categoria-badge text-caption text-weight-bold">{{ card.categoria }}</div>
                  <div v-if="card.fecha" class="text-caption text-grey-8">{{ formatDate(card.fecha) }}</div>
                </div>

                <!-- Título -->
                <div class="text-weight-bold text-uppercase q-mb-sm text-subtitle1">
                  {{ card.titulo }}
                </div>

                <!-- Descripción -->
                <div 
                  v-if="card.descripcion" 
                  class="text-grey-8 q-my-sm text-body2 descripcion-wrapper"
                  v-html="card.descripcion"
                >
                </div>
                
                <!-- Botón Ver más -->
                <q-btn
                  v-if="card.url || card.enlace"
                  :href="getCardUrl(card)"
                  :to="!isExternalLink(getCardUrl(card)) ? getCardUrl(card) : undefined"
                  :target="isExternalLink(getCardUrl(card)) ? '_blank' : undefined"
                  color="primary"
                  flat
                  class="q-mt-sm view-more-btn"
                  icon-right="arrow_forward"
                  padding="none"
                  dense
                  no-caps
                >
                  Ver más
                </q-btn>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRuntimeConfig } from '#app';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

const props = defineProps({
  block: { type: Object, required: true },
  apiBaseUrl: { type: String, default: () => useRuntimeConfig().public.apiBase }
});

// Referencias para el carousel y la detección de pantalla
const scrollContainer = ref(null); // Referencia para el contenedor con scroll
const windowWidth = ref(process.client ? window.innerWidth : 1200); // Valor por defecto para SSR

// Funciones para controlar el scroll horizontal
function scrollLeft() {
  if (!scrollContainer.value) return;
  
  const scrollAmount = 300; // Cantidad de px a desplazarse
  scrollContainer.value.scrollLeft -= scrollAmount;
}

function scrollRight() {
  if (!scrollContainer.value) return;
  
  const scrollAmount = 300; // Cantidad de px a desplazarse
  scrollContainer.value.scrollLeft += scrollAmount;
}

// Ya no necesitamos variables de paginación ya que usamos scroll horizontal

// Actualizar el ancho de la ventana al redimensionar
function updateWindowWidth() {
  if (process.client) {
    windowWidth.value = window.innerWidth;
  }
}

// Configurar y limpiar event listeners
onMounted(() => {
  if (process.client) {
    window.addEventListener('resize', updateWindowWidth);
    updateWindowWidth(); // Inicializar el valor
  }
});

onUnmounted(() => {
  if (process.client) {
    window.removeEventListener('resize', updateWindowWidth);
  }
});

// Extraer las noticias del bloque
const cards = computed(() => {
  const block = props.block?.value;
  
  // Si estamos trabajando con noticias (nuevo formato)
  if (block?.tipo === 'grupo_de_noticias' && Array.isArray(block?.noticias)) {
    return block.noticias.map(noticia => ({
      imagen: noticia.imagen,
      titulo: noticia.titulo,
      descripcion: noticia.descripcion,
      url: noticia.url || noticia.enlace,
      estilo: noticia.estilo || 'primary',
      fecha: noticia.fecha,
      categoria: noticia.categoria
    }));
  }
  
  // Si estamos trabajando con tarjetas (formato original)
  if (block?.tarjetas && Array.isArray(block.tarjetas)) {
    return block.tarjetas;
  }
  
  // Fallback para asegurar que siempre devuelve un array
  return [];
});

// Ya no necesitamos estas funciones con el scroll horizontal

// Funciones de utilidad simplificadas
function isExternalLink(url) {
  return url?.startsWith('http') || url?.startsWith('//');
}

function getCardUrl(card) {
  let url = card.url || card.enlace || '#';
  
  // Transformar URLs de 127.0.0.1:8000 a localhost:3000
  if (url && url.includes('127.0.0.1:8000')) {
    url = url.replace('127.0.0.1:8000', 'localhost:3000');
  }
  
  return url;
}

function getTitleColor(style) {
  return {
    'primary': 'dark',
    'secondary': 'white',
    'dark': 'white',
    'warning': 'dark',
    'negative': 'white',
    'info': 'white',
    'accent': 'white'
  }[style] || 'dark';
}

function getButtonColor(style) {
  return style || 'primary';
}

// Función para formatear fechas
function formatDate(dateString) {
  try {
    if (!dateString) return '';
    const date = parseISO(dateString);
    return format(date, 'd MMM yyyy', { locale: es });
  } catch (e) {
    console.error('Error formateando fecha:', e);
    return dateString;
  }
}

// Función para sanitizar HTML
function sanitizeHtml(html) {
  if (!html) return '';
  return html;
}

// Función para obtener clases de Quasar según el estilo
function getCardClasses(style) {
  const baseClasses = ['shadow-3'];
  
  // Agregar clases según el estilo
  switch(style) {
    case 'primary':
      return [...baseClasses, 'bg-white', 'border-top', 'border-primary', 'border-3'];
    case 'secondary':
      return [...baseClasses, 'bg-white', 'border-top', 'border-secondary', 'border-3'];
    case 'warning':
      return [...baseClasses, 'bg-white', 'border-top', 'border-warning', 'border-3'];
    case 'negative':
      return [...baseClasses, 'bg-white', 'border-top', 'border-negative', 'border-3'];
    case 'info':
      return [...baseClasses, 'bg-white', 'border-top', 'border-info', 'border-3'];
    case 'accent':
      return [...baseClasses, 'bg-white', 'border-top', 'border-accent', 'border-3'];
    case 'dark':
      return [...baseClasses, 'bg-grey-9', 'text-white', 'border-top', 'border-grey-10', 'border-3'];
    default:
      return baseClasses;
  }
}

// Título del bloque
const blockTitle = computed(() => {
  if (props.block?.value?.tipo === 'grupo_de_noticias') {
    return props.block.value.titulo_apartado || "Noticias Relevantes";
  }
  return "Noticias";
});
</script>

<style scoped>
/* Estilos para la sección de noticias */
.news-section {
  padding-top: 3rem;
  padding-bottom: 3rem;
  background-color: #ffffff;
}

/* Contenedor principal del carousel */
.carousel-container {
  position: relative;
  width: 100%;
}

/* Contenedor horizontal con scroll */
.news-row-container {
  display: flex;
  overflow-x: auto;
  overflow-y: hidden;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  padding: 10px 0 30px;
  margin: 0 -15px;
  flex: 1;
  scrollbar-width: thin;
  scrollbar-color: #ccc transparent;
  /* Ocultar scrollbar en navegadores pero mantener funcionalidad */
  -ms-overflow-style: none; /* IE y Edge */
}

/* Contenedor para los botones de control en la cabecera */
.control-buttons {
  display: flex;
  align-items: center;
}

.control-buttons .q-btn {
  opacity: 0.8;
  transition: all 0.2s ease;
}

.control-buttons .q-btn:hover {
  opacity: 1;
  transform: scale(1.1);
}

.news-row-container::-webkit-scrollbar {
  height: 6px;
}

.news-row-container::-webkit-scrollbar-track {
  background: transparent;
}

.news-row-container::-webkit-scrollbar-thumb {
  background-color: #ccc;
  border-radius: 10px;
}

/* Wrapper de tarjeta individual */
.news-card-wrapper {
  flex: 0 0 auto;
  width: 300px;
  margin-right: 20px;
  padding: 5px;
  transition: all 0.3s ease;
}

/* Estilos de tarjetas */
.news-card {
  transition: all 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  overflow: hidden;
  background-color: #fff;
  border: 1px solid #e0e0e0;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.05);
  min-height: 380px;
}

.news-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 20px rgba(0, 0, 0, 0.15);
}

/* Imagen de la noticia */
.news-image {
  position: relative;
  overflow: hidden;
  height: 160px;
}

.news-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s;
}

.news-image:hover img {
  transform: scale(1.05);
}

.empty-image {
  height: 180px;
  background-color: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Contenido de la noticia */
.news-content {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  padding: 1rem;
}

/* Estilo para badges de categoría */
.categoria-badge {
  background-color: var(--q-primary);
  color: white;
  padding: 2px 8px;
  border-radius: 4px;
  white-space: nowrap;
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 0.7rem;
  text-transform: uppercase;
}

/* Botón Ver más */
.view-more-btn {
  font-size: 0.9rem;
  margin-top: auto;
  align-self: flex-start;
  transition: all 0.2s ease;
}

.view-more-btn:hover .q-icon {
  transform: translateX(3px);
  transition: transform 0.3s;
}

/* Asegurar alturas consistentes para descripciones */
.descripcion-wrapper {
  min-height: 4.5em; /* Para 3 líneas */
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.5;
}

/* Controles de navegación */
.navigation-controls {
  display: flex;
  align-items: center;
}

.navigation-controls .q-btn {
  transform: scale(1);
  transition: all 0.2s ease;
}

.navigation-controls .q-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15) !important;
}

/* Otros estilos */
.q-btn.view-more-btn {
  margin-top: 10px;
}
</style>
