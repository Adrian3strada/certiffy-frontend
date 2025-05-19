<template>
  <div class="preview-page">
    <div v-if="loading" class="loading-container">
      <q-spinner size="3em" color="primary" />
      <p class="q-mt-md">Cargando página...</p>
    </div>
    
    <div v-else-if="error" class="error-container">
      <q-icon name="mdi-alert-circle" color="negative" size="3em" />
      <h2 class="q-mt-md">Error al cargar la página</h2>
      <p>{{ error }}</p>
      <q-btn color="primary" label="Volver al panel" to="/admin" class="q-mt-md" />
    </div>
    
    <template v-else>
      <!-- Renderizar los componentes de la página según el layout -->
      <div v-for="item in page.content.layout" :key="item.i">
        <component-renderer 
          :type="item.type" 
          :content="item.content" 
          :is-preview="true" 
        />
      </div>
      
      <!-- Barra flotante para volver al panel de administración -->
      <div class="admin-bar">
        <div class="container">
          <div class="row items-center justify-between">
            <div class="col">
              <span>Vista previa: {{ page.title }}</span>
            </div>
            <div class="col-auto">
              <q-btn flat color="white" icon="mdi-pencil" label="Editar" :to="`/admin/builder/${page.id}`" />
              <q-btn flat color="white" icon="mdi-view-dashboard" label="Panel" to="/admin" />
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useApi } from '~/composables/useApi';
import ComponentRenderer from '~/components/builder/ComponentRenderer.vue';

const route = useRoute();
const api = useApi();

const page = ref(null);
const loading = ref(true);
const error = ref(null);

// Cargar la página según el slug
onMounted(async () => {
  const slug = route.params.slug;
  
  try {
    loading.value = true;
    error.value = null;
    
    const pageData = await api.getPageBySlug(slug);
    page.value = pageData;
  } catch (err) {
    error.value = err.message || 'Error al cargar la página';
    console.error('Error al cargar la página:', err);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.preview-page {
  min-height: 100vh;
  padding-top: 40px; /* Espacio para la barra de administración */
}

.loading-container,
.error-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 2rem;
}

.admin-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 40px;
  background-color: #1976D2;
  color: white;
  z-index: 1000;
  display: flex;
  align-items: center;
}

.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 15px;
}
</style>
