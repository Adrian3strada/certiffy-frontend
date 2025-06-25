      <template>
        <section class="q-py-md q-my-md">
          <div class="q-mx-auto q-px-sm" style="max-width: 1000px">
            <!-- Encabezado con título y controles -->
            <div class="row items-center justify-between q-mb-md">
              <div class="text-h4 text-weight-bold q-pl-sm">{{ blockTitle }}</div>
              
              <!-- Controles de navegación en la parte superior derecha -->
              <div>
                <q-btn
                  round
                  flat
                  color="primary"
                  icon="chevron_left"
                  size="sm"
                  class="q-mr-sm opacity-80 hover-opacity-100"
                  @click="scrollLeft"
                />
                <q-btn
                  round
                  flat
                  color="primary"
                  icon="chevron_right"
                  size="sm"
                  class="opacity-80 hover-opacity-100"
                  @click="scrollRight"
                />
              </div>
            </div>

            <!-- Contenedor de tarjetas con scroll horizontal -->
            <div class="q-py-md">
              
              <!-- Contenedor de tarjetas con scroll horizontal -->
              <div class="row no-wrap overflow-auto scroll-smooth" style="scrollbar-width: thin; scrollbar-color: #ccc transparent;" ref="scrollContainer">
                <div 
                  v-for="(card, index) in cards" 
                  :key="index"
                  class="q-px-sm"
                  style="flex: 0 0 auto; width: 320px;"
                >
                  <q-card 
                    class="q-mb-md overflow-hidden transition-transform"
                    :class="getCardClasses(card.estilo || 'primary')"
                    style="min-height: 400px; transition: all 0.3s ease; border: 1px solid #e0e0e0; box-shadow: 0 1px 5px rgba(0,0,0,0.1);"
                    v-ripple
                    hover
                    flat
                    bordered
                  >
                    <!-- Imagen mejorada con mejor manejo de errores y marco visible -->
                    <div class="image-container" style="height: 180px; overflow: hidden; border-bottom: 4px solid #f5f5f5; border: 1px solid #e0e0e0; box-shadow: inset 0 0 0 1px #e0e0e0;">
                      <q-img
                        v-if="getImageUrl(card)"
                        :src="getImageUrl(card)"
                        height="180px"
                        style="object-fit: cover;"
                        fit="cover"
                        loading="lazy"
                        crossorigin="anonymous"
                        @error="(evt) => handleImageError(evt, card, index)"
                        @load="(evt) => handleImageLoad(evt, card, index)"
                      >
                        <!-- Slot de loading -->
                        <template v-slot:loading>
                          <div class="absolute-full flex flex-center bg-grey-3">
                            <q-spinner color="primary" size="2em" />
                          </div>
                        </template>
                        
                        <!-- Slot de error -->
                        <template v-slot:error>
                          <div class="absolute-full flex flex-center bg-grey-3">
                            <div class="text-center">
                              <q-icon name="broken_image" size="2rem" color="grey-6" />
                              <div class="text-caption text-grey-6 q-mt-sm">Imagen no disponible</div>
                            </div>
                          </div>
                        </template>
                      </q-img>
                      
                      <!-- Fallback cuando no hay imagen -->
                      <div v-else class="flex flex-center bg-grey-3 full-width full-height">
                        <div class="text-center">
                          <q-icon name="image" size="3rem" color="grey-6" />
                          <div class="text-caption text-grey-6 q-mt-sm">Sin imagen</div>
                        </div>
                      </div>
                    </div>

                    <!-- Contenido de la tarjeta -->
                    <q-card-section class="q-pa-md column justify-between flex-grow" style="height: 200px; position: relative;">
                      <!-- Fecha y categoría -->
                      <div v-if="card.fecha || card.categoria" class="row justify-between items-center q-mb-sm">
                        <q-badge
                          v-if="card.categoria"
                          color="black"
                          text-color="black"
                          outline
                          class="text-caption text-uppercase"
                          style="max-width: 120px; overflow: hidden; text-overflow: ellipsis;"
                        >
                          {{ card.categoria }}
                        </q-badge>
                        <span v-if="card.fecha" class="text-caption text-grey-7">{{ formatDate(card.fecha) }}</span>
                      </div>

                      <!-- Título -->
                      <div class="text-subtitle1 text-weight-bold q-mb-sm">
                        {{ card.tipo === 'evento' ? card.titulo || '' : card.titulo }}
                      </div>

                      <!-- Descripción -->
                      <div 
                        v-if="card.descripcion" 
                        class="text-body2 text-grey-8 q-mb-xl"
                        v-html="card.descripcion"
                        style="min-height: 2em; max-height: 4.5em; display: block; overflow: hidden;"
                      >
                      </div>
                      
                      <!-- Botón Ver más -->
                      <!-- Enlace externo -->
                      <q-btn
                        v-if="(card.url || card.enlace) && isExternalLink(getCardUrl(card))"
                        :href="getCardUrl(card)"
                        target="_blank"
                        :color="getButtonColor(card.estilo || 'secondary')"
                        unelevated
                        class="absolute text-weight-medium"
                        style="bottom: 16px; right: 16px;"
                        padding="5px 16px"
                        size="md"
                        no-caps
                      >
                        Ver más
                      </q-btn>
                      
                      <!-- Enlace interno con NuxtLink -->
                      <NuxtLink 
                        v-if="(card.url || card.enlace) && !isExternalLink(getCardUrl(card))"
                        :to="getCardUrl(card)"
                        class="absolute"
                        style="bottom: 16px; right: 16px;"
                      >
                        <q-btn
                          :color="getButtonColor(card.estilo || 'secondary')"
                          unelevated
                          class="text-weight-medium"
                          padding="5px 16px"
                          size="md"
                          no-caps
                        >
                          Ver más
                        </q-btn>
                      </NuxtLink>
                    </q-card-section>
                  </q-card>
                </div>
              </div>
              <div v-if="showMore" class="row justify-center q-mt-lg">
            <q-btn
              v-if="isExternalLink(showMore.url)"
              :href="showMore.url"
              target="_blank"
              color="primary"
              unelevated
              round
              icon="add"
              :label="showMore.label"
              class="ver-mas-pill"
            />
            <NuxtLink v-else :to="showMore.url" class="text-none">
              <q-btn
                color="primary"
                unelevated
                round
                icon="add"
                :label="showMore.label"
                class="ver-mas-pill"
              />
            </NuxtLink>
          </div>
        </div> <!-- ← cierre que faltaba para .q-py-md -->

      </div> <!-- cierra .q-mx-auto -->
    </section>
      </template>

    <script setup>
    import { ref, computed, onMounted, onUnmounted, reactive } from 'vue';
    import { useRuntimeConfig } from '#app';
    import { format, parseISO } from 'date-fns';
    import { es } from 'date-fns/locale';

    const props = defineProps({
      block: { type: Object, required: true },
      apiBaseUrl: { type: String, default: () => useRuntimeConfig().public.apiBase },
      fallbackImage: { type: String, default: '/assets/images/image-placeholder.svg' }
    });
    const showMore = computed(() => {
  // si en el bloque vino la propiedad show_more la devolvemos;
  // de lo contrario retornamos null, así v-if la oculta
  return props.block?.value?.show_more || null
})
    // Referencias para el carousel y la detección de pantalla
    const scrollContainer = ref(null);
    const windowWidth = ref(process.client ? window.innerWidth : 1200);

    // Estado reactivo para el manejo de imágenes
    const imageStates = reactive({});

    // Funciones para controlar el scroll horizontal
    function scrollLeft() {
      if (!scrollContainer.value) return;
      const scrollAmount = 300;
      scrollContainer.value.scrollLeft -= scrollAmount;
    }

    function scrollRight() {
      if (!scrollContainer.value) return;
      const scrollAmount = 300;
      scrollContainer.value.scrollLeft += scrollAmount;
    }

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
        updateWindowWidth();
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
      
      // Debug: log para ver la estructura de datos
      // console.log('Block data:', block);
      
      // Si estamos trabajando con noticias (nuevo formato)
      if (block?.tipo === 'grupo_de_noticias' && Array.isArray(block?.noticias)) {
        const mappedCards = block.noticias.map((noticia, index) => {
          // Para eventos, asegurarse de que el título se muestre correctamente
          let titulo = noticia.titulo || '';
          
          // Para debug
          /* console.log(`Procesando noticia ${index}:`, { 
            tipo: noticia.tipo, 
            titulo: noticia.titulo,
            categoria: noticia.categoria,
            descripcion: noticia.descripcion
          }); */
          
          // Si es un evento y no tiene título, usar el título del evento
          if (noticia.tipo === 'evento' && !titulo) {
            titulo = noticia.tipo === 'evento' ? 'Evento ' + (index + 1) : '';
          }
          
          return {
            imagen: noticia.imagen,
            titulo: titulo,
            descripcion: noticia.descripcion,
            url: noticia.url || noticia.enlace,
            estilo: noticia.estilo || 'primary',
            fecha: noticia.fecha,
            categoria: noticia.categoria,
            tipo: noticia.tipo || 'noticia',
            _index: index // Para debugging
          };
        });
        
        // console.log('Mapped cards:', mappedCards);
        return mappedCards;
      }
      
      // Si estamos trabajando con tarjetas (formato original)
      if (block?.tarjetas && Array.isArray(block.tarjetas)) {
        // console.log('Using tarjetas format:', block.tarjetas);
        return block.tarjetas.map((tarjeta, index) => ({
          ...tarjeta,
          _index: index
        }));
      }
      
      // console.warn('No cards found in block');
      return [];
    });

    // Función mejorada para obtener URL de imagen con mejor manejo de ngrok
    function getImageUrl(card) {
      // Asegurarnos de que hay una imagen para procesar
      if (!card.imagen) {
        // console.log('Card sin imagen:', card.titulo || 'Sin título');
        return null;
      }
      
      // Extraer la URL de la imagen según estructura
      let imageUrl = null;
      
      if (typeof card.imagen === 'string') {
        imageUrl = card.imagen;
      } else if (card.imagen.url) {
        imageUrl = card.imagen.url;
      } else if (card.imagen.src) {
        imageUrl = card.imagen.src;
      }

      // Verificar que se encontró una URL
      if (!imageUrl) {
        // console.log('No se encontró URL para la imagen:', card);
        return null;
      }
      
      // console.log('URL original de la imagen:', imageUrl);

      // Si ya es una URL absoluta
      if (imageUrl.startsWith('http')) {
        return `/api/proxy-image?url=${encodeURIComponent(imageUrl)}`;
      }
      
      // Si es una ruta relativa
      const path = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
      const absoluteUrl = `${props.apiBaseUrl}${path}`;
      
      return `/api/proxy-image?url=${encodeURIComponent(absoluteUrl)}`;
    }

    // Manejo simplificado de errores de imágenes
    function handleImageError(evt, card, index) {
      const title = card.titulo || 'Sin título';
      // console.error(`Error de imagen para tarjeta "${title}". URL fallida:`, evt.target.src);
      
      // Identificar la imagen por índice y título
      const imageKey = `${index}_${title.replace(/\s+/g, '_')}`;
      
      if (!imageStates[imageKey]) {
        imageStates[imageKey] = { attempts: 0, failed: false };
      }
      
      imageStates[imageKey].attempts += 1;
      const { attempts } = imageStates[imageKey];
      
      // Sistema de reintentos con alternativas de URL
      let newUrl = null;
      
      if (attempts === 1 && card.imagen) {
        // Primer intento: Cargar directo desde la API sin proxy
        let imageUrl = null;
        
        // Obtener URL base de la imagen
        if (typeof card.imagen === 'string') {
          imageUrl = card.imagen;
        } else if (card.imagen.url) {
          imageUrl = card.imagen.url;
        } else if (card.imagen.src) {
          imageUrl = card.imagen.src;
        }
        
        if (imageUrl) {
          // Si es una ruta relativa, construir URL completa
          if (!imageUrl.startsWith('http')) {
            const path = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
            newUrl = `${props.apiBaseUrl}${path}`;
            // console.log(`Reintento 1: Cargando directamente desde API: ${newUrl}`);
          } else {
            // Si es absoluta, intentar directamente
            newUrl = imageUrl;
            // console.log(`Reintento 1: Cargando URL absoluta directa: ${newUrl}`);
          }
        }
      } else if (attempts === 2) {
        // Segundo intento: Usar una URL alternativa si está disponible
        if (props.fallbackUrl) {
          newUrl = props.fallbackUrl;
          // console.log(`Reintento 2: Usando URL de respaldo: ${newUrl}`);
        }
      } else {
        // Tercer intento o posterior: marcar como fallida definitivamente
        // console.log(`Todos los reintentos fallidos para la imagen de la tarjeta "${title}". Usando imagen de respaldo.`);
        imageStates[imageKey].failed = true;
        
        // Usar imagen de respaldo SVG local
        newUrl = '/img/placeholder-image.svg';
      }
      
      // Si tenemos una nueva URL para intentar, actualizar la src
      if (newUrl) {
        evt.target.src = newUrl;
      } else {
        // Si no tenemos alternativa, marcar como fallida
        imageStates[imageKey].failed = true;
      }
      
      // Marcar como fallida después de todos los intentos
      if (imageStates[imageKey].attempts >= 3) {
        imageStates[imageKey].failed = true;
        // console.log('Image definitively failed after all attempts for card:', card.titulo || 'Sin título');
        
        // Mostrar imagen de respaldo si está disponible
        if (props.fallbackImage) {
          // console.log('Using fallback image');
          evt.target.src = props.fallbackImage;
        }
      }
    }

    function handleImageLoad(evt, card, index) {
      // console.log('Image loaded successfully for card:', card.titulo);
      const imageKey = `${index}_${card.titulo}`;
      if (imageStates[imageKey]) {
        imageStates[imageKey].failed = false;
      }
    }

    // Funciones de utilidad
    function isExternalLink(url) {
      if (!url || url === '#') return false;
      
      // Si la URL no comienza con http o //, no es externa
      if (!url.startsWith('http') && !url.startsWith('//')) return false;
      
      // Si estamos en el cliente, verificar si el dominio es diferente
      if (process.client) {
        try {
          const urlObj = new URL(url.startsWith('//') ? `https:${url}` : url);
          return urlObj.hostname !== window.location.hostname;
        } catch (e) {
          // console.error('Error al verificar si la URL es externa:', e);
        }
      }
      
      // Por defecto, considerar como externo si comienza con http o //
      return true;
    }

    function getCardUrl(card) {
      // Obtener la URL del card
      let url = card.url || card.enlace || '#';
      const originalUrl = url; // Guardar la URL original para logs
      
      // Si no hay URL o es #, devolver tal cual
      if (!url || url === '#') return url;
      
      // Mostrar la URL original para depuración
      // console.log('URL original:', url);
      
      // Si la URL comienza con http:// o https://, procesar
      if (url.startsWith('http://') || url.startsWith('https://')) {
        try {
          // Crear un objeto URL para manipular fácilmente sus partes
          const urlObj = new URL(url);
          
          // Verificar si es del mismo dominio (127.0.0.1:8000)
          if (process.client) {
            const currentHost = window.location.hostname;
            const currentPort = window.location.port;
            
            // console.log('Dominio actual:', currentHost, 'Puerto actual:', currentPort);
            // console.log('Dominio URL:', urlObj.hostname, 'Puerto URL:', urlObj.port);
            
            // Si es del mismo dominio, extraer solo la ruta
            if (urlObj.hostname === currentHost) {
              url = urlObj.pathname;
              // console.log('URL convertida a ruta relativa:', url);
            }
          }
        } catch (e) {
          // console.error('Error al procesar URL externa:', e);
          return url; // Devolver la URL original en caso de error
        }
      }
      
      // Si la URL comienza con /es/ o similar, eliminar el prefijo de idioma
      if (url.match(/^\/[a-z]{2}\//)) {
        url = url.substring(3); // Eliminar los primeros 3 caracteres (ej: /es/)
        // console.log('URL sin prefijo de idioma:', url);
      }
      
      // Forzar que la URL sea relativa (sin dominio)
      if (url.startsWith('http://127.0.0.1:8000')) {
        url = url.replace('http://127.0.0.1:8000', '');
        // console.log('URL forzada a relativa (127.0.0.1):', url);
      }
      
      // Mostrar la URL final para depuración
      // console.log(`URL procesada: ${originalUrl} -> ${url}`);
      
      return url;
    }

    function getButtonColor(style) {
      return style || 'primary';
    }

    // Función para obtener el color del título según el estilo
    function getTitleColor(style) {
      return style || 'primary';
    }

    // Función para formatear fechas
    function formatDate(dateString) {
      try {
        if (!dateString) return '';
        const date = parseISO(dateString);
        return format(date, 'd MMM yyyy', { locale: es });
      } catch (e) {
        // console.error('Error formateando fecha:', e);
        return dateString;
      }
    }

    // Función para obtener clases de Quasar según el estilo
    function getCardClasses(style) {
      const baseClasses = ['shadow-3'];
      
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
    /* Contenedor de imagen con marco visible */
    .image-container {
      position: relative;
      overflow: hidden;
      border: 1px solid rgb(7, 7, 7);
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }

    /* Custom CSS for q-img to ensure proper content display */
    .q-img {
      object-fit: cover;
      border-bottom: 2px solid #e0e0e0;
      /* Eliminada la transición ya que no hay efecto hover */
    }

    /* Establish hover-opacity-100 class for hover effects */
    .opacity-80 {
      opacity: 0.8;
    }

    .hover-opacity-100:hover {
      opacity: 1;
      transform: scale(1.1);
    }

    /* Enable smooth scrolling */
    .scroll-smooth {
      scroll-behavior: smooth;
    }

    .view-more-btn:hover .q-icon {
      transform: translateX(3px);
      transition: transform 0.3s;
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

    /* Asegurar que las imágenes ocupen todo el espacio disponible */
    .full-width {
      width: 100%;
    }

    .full-height {
      height: 100%;
    }
    /* ─── botón “Ver más …” versión cuadrada y simple ───────────── */
.ver-mas-pill {
  border-radius: 6px !important;   /* esquinas suaves, no redondas */
  padding: 8px 28px !important;    /* proporción ancho/alto cómoda */
  background: #001845 !important;  /* mismo navy del header        */
  color: #ffffff !important;
  font-weight: 600;
  letter-spacing: .02em;
  text-transform: uppercase;
  box-shadow: 0 2px 6px rgba(0,0,0,.12);
  transition: background-color .2s ease;
}

/* icono alineado sin animaciones extras */
.ver-mas-pill .q-icon {
  margin-right: 6px;
  font-size: 18px;
}

/* efecto hover muy sutil */
.ver-mas-pill:hover,
.ver-mas-pill:focus {
  background: #003072 !important;  /* un tono ligeramente más claro */
}

    </style>