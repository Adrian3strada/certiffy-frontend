<template>
  <div>
    <div v-if="pending">
      <q-spinner-dots color="primary" size="3em" />
      <p>Cargando página principal...</p>
    </div>
    <div v-else-if="error">
      <q-banner class="bg-negative text-white">
        Error al cargar la página: {{ error.message }}
      </q-banner>
    </div>
    <div v-else>
      <component
        v-if="pageData && pageData.body"
        :is="dynamicBlockRendererComponent"
        :blocks="pageData.body"
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
const dynamicBlockRendererComponent = shallowRef(defineAsyncComponent(() => 
    import('~/components/api/core/DynamicBlockRenderer.vue')
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
const { data: pageData, pending, error } = await useAsyncData(
  'homePage',
  async () => {
    // Primero obtenemos todas las páginas para identificar la Home
    const allPages = await fetchAllPages();
    if (allPages?.items) {
      // Buscar la página principal por URL
      const homePage = allPages.items.find(page => 
        page.meta?.html_url?.endsWith(homePath.value) || 
        (page.meta?.type === 'home.HomePage' && page.meta?.locale === locale.value)
      );
      
      if (homePage) {
        console.log(`Cargando página principal: ID ${homePage.id}, Path: ${homePath.value}`);
        return await fetchPageDetails(homePage.id);
      }
    }
    throw new Error(`No se encontró la página principal para path ${homePath.value}`);
  },
  { server: true }
);
</script>
