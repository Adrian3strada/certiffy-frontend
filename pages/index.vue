<template>
  <div>
    <div v-if="pending" class="flex flex-center column q-pa-lg">
      <q-spinner-dots color="primary" size="3em" />
      <p class="q-mt-md">Cargando página principal...</p>
    </div>
    <div v-else-if="error">
      <q-banner class="bg-negative text-white">
        Error al cargar la página: {{ error.message }}
      </q-banner>
    </div>
    <div v-else>
      <component
        v-if="pageData"
        :is="dynamicPageContentComponent"
        :pageData="pageData"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, shallowRef, defineAsyncComponent } from 'vue';
import { useWagtail } from '~/composables/useWagtail';
import { useRouter, useRoute } from 'vue-router';
import { onBeforeMount, onMounted, computed } from 'vue';

// Cargar el componente de renderizado dinámicamente
const dynamicPageContentComponent = shallowRef(defineAsyncComponent(() => 
    import('~/components/api/core/DynamicPageContent.vue')
));

const router = useRouter();
const route = useRoute();
const { fetchPageDetails, fetchAllPages } = useWagtail();

// Determinar el locale actual
const locale = computed(() => {
  // Podría obtenerse del store, de la URL, etc.
  return route.path.startsWith('/en') ? 'en' : 'es';
});

// Utilizar el path raíz con el locale correspondiente
const homePath = computed(() => `/${locale.value}/`);

// Obtener datos de la página principal de forma dinámica
const pageData = ref(null);
const pending = ref(true);
const error = ref(null);

onMounted(async () => {
  try {
    pending.value = true;
    error.value = null;
    
    // Detectar idioma actual
    const currentLocale = locale.value;
    console.log(`Index - Idioma actual: ${currentLocale}`);
    
    // Sabemos que la página de inicio tiene ID 3
    const homePageId = 3; // ID fijo de la página de inicio
    console.log(`Index - Cargando directamente la página de inicio con ID: ${homePageId}`);
    
    // Cargar detalles completos directamente por ID
    pageData.value = await fetchPageDetails(homePageId, currentLocale, true);
    console.log('Index - Datos de página cargados por ID:', pageData.value);
    
    // Agregar log detallado para verificar la estructura de los datos
    console.log('Index - Estructura completa de pageData:', JSON.stringify(pageData.value));
    
    // Verificar si tenemos bloques para renderizar
    if (pageData.value?.body && Array.isArray(pageData.value.body)) {
      console.log(`Index - Número de bloques en body: ${pageData.value.body.length}`);
      pageData.value.body.forEach((block, index) => {
        console.log(`Index - Bloque ${index}:`, block?.type || 'sin tipo', block?.id || 'sin id');
      });
    } else {
      console.log('Index - No hay bloques para renderizar o body no es un array');
      console.log('Index - Valor y tipo de body:', pageData.value?.body, typeof pageData.value?.body);
    }
    
    pending.value = false;
  } catch (err) {
    console.error(`[index] Error al cargar la página principal:`, err);
    error.value = err;
    pending.value = false;
  }
});
</script>
