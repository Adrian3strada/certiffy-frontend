<template>
  <q-page class="q-pa-md">
    <div v-if="loading" class="text-center q-pa-xl">
      <q-spinner color="primary" size="3em" />
      <p class="q-mt-md">Cargando contenido...</p>
    </div>
    
    <div v-else-if="error" class="text-center q-pa-xl">
      <q-icon name="error_outline" color="negative" size="3em" />
      <p class="text-negative q-mt-md">{{ error }}</p>
      <q-btn 
        outline 
        color="primary" 
        label="Reintentar" 
        class="q-mt-md" 
        @click="fetchData" 
        icon="refresh"
      />
    </div>
    
    <div v-else>
      <!-- Mostrar un componente por cada carrusel en la página -->
      <div v-for="(carouselGroup, index) in carouselGroups" :key="'carousel-' + index" class="q-mb-lg">
        <ApiVideoComponent 
          :blocks="carouselGroup.blocks"
          :title="carouselGroup.title || pageTitle"
          :api-base-url="API_BASE_URL"
          :autoplayDuration="5000"
        />
      </div>

      <!-- Mostrar bloques que no son carruseles, si es necesario -->
      <div v-if="nonCarouselBlocks.length > 0" class="q-pa-md">
        <div v-for="(block, index) in nonCarouselBlocks" :key="'other-' + index" class="q-mb-md">
          <pre v-if="false">{{ block }}</pre>
          <!-- Aquí podríamos renderizar otros tipos de bloques si fuera necesario -->
        </div>
      </div>
      
      <!-- Sección de Noticias -->
      <div class="q-mt-xl q-mb-xl">
        <h2 class="text-h4 text-center q-mb-lg">{{ noticiaTitle }}</h2>
        
        <div v-if="loadingNoticias" class="text-center q-pa-xl">
          <q-spinner color="primary" size="3em" />
          <p class="q-mt-md">Cargando noticias...</p>
        </div>
        
        <div v-else-if="errorNoticias" class="text-center text-negative q-pa-xl">
          <q-icon name="error" size="3em" />
          <p class="q-mt-md">{{ errorNoticias }}</p>
          <q-btn 
            outline 
            color="primary" 
            label="Reintentar" 
            class="q-mt-md" 
            @click="fetchNoticias" 
            icon="refresh"
          />
        </div>
        
        <div v-else>
          <!-- Componente de tarjetas para cada bloque de tipo cards -->
          <div v-for="(block, index) in cardBlocks" :key="'card-' + index" class="q-mb-xl">
            <ApiCardComponent 
              :block="block"
              :api-base-url="API_BASE_URL"
            />
          </div>
          
          <!-- Componente de testimonios -->
          <div v-for="(block, index) in testimonialBlocks" :key="'testimonial-' + index" class="q-my-xl">
            <ApiTestimonialsComponent
              :block="block"
              :api-base-url="API_BASE_URL"
              :title="testimonialTitle"
              :autoplayDuration="5000"
            />
          </div>
          
          <!-- Componente de Módulos Certiffy -->
          <div v-for="(block, index) in moduloCertiffyBlocks" :key="'modulo-' + index" class="q-my-xl">
            <ApiModulosVideoComponent
              :block="block"
              :api-base-url="API_BASE_URL"
            />
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useWagtailApi, API_BASE_URL, isProduction } from '~/composables/useWagtailApi';
import { API_ROUTES } from '~/config/api';
import ApiVideoComponent from '~/components/api/ApiVideoComponent.vue';
import ApiCardComponent from '~/components/api/ApiCardComponent.vue';
import ApiTestimonialsComponent from '~/components/api/ApiTestimonialsComponent.vue';
import ApiModulosVideoComponent from '~/components/api/ApiModulosVideoComponent.vue';

// Estado de la página
const loading = ref(true);
const error = ref(null);
const pageTitle = ref('');
const blocks = ref([]);
const carouselGroups = ref([]);
const nonCarouselBlocks = ref([]);

// Estado para noticias
const loadingNoticias = ref(true);
const errorNoticias = ref(null);
const noticiaTitle = ref('');
const noticiasBlocks = ref([]);
const cardBlocks = ref([]);

// Estado para testimonios
const testimonialTitle = ref('Testimonios');
const testimonialBlocks = ref([]);

// Estado para módulos Certiffy
const moduloCertiffyTitle = ref('Módulos de CERTIFFY');
const moduloCertiffyBlocks = ref([]);


// Procesar bloques para agrupar carruseles con sus párrafos asociados
const processBlocks = (allBlocks) => {
  // Si allBlocks es undefined o no es un array, devolver arrays vacíos
  if (!allBlocks || !Array.isArray(allBlocks)) {
    console.warn('processBlocks recibió un valor no válido para allBlocks:', allBlocks);
    return {
      groups: [],
      others: []
    };
  }

  const groupsArray = [];
  const otherBlocks = [];
  let currentGroup = null;
  
  // Recorrer todos los bloques
  for (let i = 0; i < allBlocks.length; i++) {
    const block = allBlocks[i];
    
    // Verificar que el bloque tiene una propiedad type
    if (!block || !block.type) {
      console.warn('Se encontró un bloque sin propiedad type:', block);
      continue;
    }
    
    // Si es un carrusel, comenzar un nuevo grupo
    if (block.type === 'carousel') {
      // Si hay un grupo actual, guardarlo
      if (currentGroup) {
        groupsArray.push(currentGroup);
      }
      
      // Crear nuevo grupo
      currentGroup = {
        blocks: [block],
        title: ''
      };
      
      // Buscar bloques de párrafo y video que pertenezcan a este carrusel
      let j = i + 1;
      while (j < allBlocks.length && allBlocks[j] && allBlocks[j].type !== 'carousel') {
        if (allBlocks[j].type === 'paragraph' || allBlocks[j].type === 'video') {
          currentGroup.blocks.push(allBlocks[j]);
          i = j; // Avanzar el índice principal
        } else {
          otherBlocks.push(allBlocks[j]);
        }
        j++;
      }
    } else if (!currentGroup) {
      // Si no hay un grupo actual, agregar a otros bloques
      otherBlocks.push(block);
    }
  }
  
  // Agregar el último grupo si existe
  if (currentGroup) {
    groupsArray.push(currentGroup);
  }
  
  return {
    groups: groupsArray,
    others: otherBlocks
  };
};

// Obtener datos de la API usando useFetch como recomienda el encargado del proyecto
const fetchData = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    let data, fetchError;
    
    // En producción (Vercel), hacemos la petición directamente a la API
    // En desarrollo local, usamos el proxy para evitar problemas de CORS
    if (isProduction()) {
      console.log('Ejecutando en producción (Vercel), haciendo petición directa a la API');
      ({ data, error: fetchError } = await useFetch(API_ROUTES.HOME_PAGE, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        }
      }));
    } else {
      console.log('Ejecutando en desarrollo local, usando el proxy');
      ({ data, error: fetchError } = await useFetch('/api/proxy-wagtail', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }));
    }
    
    if (fetchError.value) {
      throw new Error(fetchError.value.message || 'Error al obtener datos');
    }
    
    if (!data.value) {
      throw new Error('No se recibieron datos de la API');
    }
    
    // Verificar que data.value.body existe y es un array
    if (data.value && data.value.body && Array.isArray(data.value.body)) {
      // Procesar y agrupar los bloques por carruseles y contenidos asociados
      const processed = processBlocks(data.value.body);
      
      // Asignar los grupos y bloques procesados
      carouselGroups.value = processed.groups;
      nonCarouselBlocks.value = processed.others;
      
      // Mantener la lista completa de bloques para compatibilidad
      blocks.value = data.value.body;
      
      // Extraer bloques de testimonios
      testimonialBlocks.value = data.value.body.filter(block => block.type === 'testimonios');
      
      // Extraer bloques de modulo_certiffy
      moduloCertiffyBlocks.value = data.value.body.filter(block => block.type === 'modulo_certiffy');
    } else {
      console.warn('No se encontraron bloques en la respuesta de la API o el formato es incorrecto');
      carouselGroups.value = [];
      nonCarouselBlocks.value = [];
      blocks.value = [];
      testimonialBlocks.value = [];
    }
    
    // Verificar si hay un título de página disponible
    if (data.value.title) {
      pageTitle.value = data.value.title;
    }
    blocks.value = data.value.body || [];
    
    loading.value = false;
  } catch (err) {
    console.error('Error al cargar los datos:', err);
    error.value = `Error al cargar los datos: ${err.message}`;
    loading.value = false;
    
    // Usar datos de respaldo para desarrollo
    pageTitle.value = 'Certiffy - Datos de respaldo';
    blocks.value = [
      {
        id: 'mock-1',
        type: 'richtext',
        value: '<p>Este es un texto de respaldo para desarrollo. La API no está disponible en este momento.</p>'
      }
    ];
  }
};


// Función para obtener las noticias
const fetchNoticias = async () => {
  loadingNoticias.value = true;
  errorNoticias.value = null;
  
  try {
    let data, fetchError;
    
    // En producción (Vercel), hacemos la petición directamente a la API
    // En desarrollo local, usamos el proxy para evitar problemas de CORS
    if (isProduction()) {
      console.log('Ejecutando en producción (Vercel), haciendo petición directa a la API de noticias');
      ({ data, error: fetchError } = await useFetch(API_ROUTES.NEWS_PAGE, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        }
      }));
    } else {
      console.log('Ejecutando en desarrollo local, usando el proxy para noticias');
      ({ data, error: fetchError } = await useFetch('/api/proxy-wagtail', {
        method: 'GET',
        query: {
          url: API_ROUTES.NEWS_PAGE
        },
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }));
    }
    
    if (fetchError.value) {
      throw new Error(fetchError.value.message || 'Error al obtener noticias');
    }
    
    if (!data.value) {
      throw new Error('No se recibieron datos de noticias de la API');
    }
    
    // Extraer el título de la página
    noticiaTitle.value = data.value.title || 'Noticias';
    
    // Extraer bloques de tarjetas
    noticiasBlocks.value = data.value.body || [];
    cardBlocks.value = noticiasBlocks.value.filter(block => block.type === 'cards');
    
    loadingNoticias.value = false;
  } catch (e) {
    errorNoticias.value = e.message || 'Ocurrió un error al cargar las noticias';
    loadingNoticias.value = false;
  }
};

// Cargar datos al montar el componente
onMounted(() => {
  fetchData();
  fetchNoticias();
});
</script>
