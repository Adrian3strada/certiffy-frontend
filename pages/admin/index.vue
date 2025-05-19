<template>
  <q-layout view="lHh Lpr lFf">
    <admin-header @toggle-drawer="drawerOpen = !drawerOpen" />
    
    <admin-sidebar v-model="drawerOpen" />
    
    <q-page-container>
      <q-page padding>
        <h1 class="text-h4 q-mb-lg">Dashboard</h1>
        
        <div class="row q-col-gutter-md">
          <!-- Tarjeta de estadísticas: Páginas -->
          <div class="col-12 col-md-4">
            <q-card>
              <q-card-section>
                <div class="text-h6">Páginas</div>
                <div class="text-h3 q-mt-sm">{{ state.pages.length }}</div>
              </q-card-section>
              <q-card-actions align="right">
                <q-btn flat color="primary" label="Ver páginas" to="/admin/pages" />
              </q-card-actions>
            </q-card>
          </div>
          
          <!-- Tarjeta de estadísticas: Plantillas -->
          <div class="col-12 col-md-4">
            <q-card>
              <q-card-section>
                <div class="text-h6">Plantillas</div>
                <div class="text-h3 q-mt-sm">{{ state.templates.length }}</div>
              </q-card-section>
              <q-card-actions align="right">
                <q-btn flat color="primary" label="Ver plantillas" to="/admin/templates" />
              </q-card-actions>
            </q-card>
          </div>
          
          <!-- Tarjeta de estadísticas: Componentes -->
          <div class="col-12 col-md-4">
            <q-card>
              <q-card-section>
                <div class="text-h6">Componentes</div>
                <div class="text-h3 q-mt-sm">{{ state.components.length }}</div>
              </q-card-section>
              <q-card-actions align="right">
                <q-btn flat color="secondary" label="Ver componentes" />
              </q-card-actions>
            </q-card>
          </div>
        </div>
        
        <!-- Actividad reciente -->
        <h2 class="text-h5 q-mt-xl q-mb-md">Actividad Reciente</h2>
        <q-card>
          <q-list bordered separator>
            <q-item v-for="(page, index) in recentPages" :key="index">
              <q-item-section avatar>
                <q-icon name="mdi-file-document-edit" color="primary" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ page.title }}</q-item-label>
                <q-item-label caption>
                  Última actualización: {{ formatDate(page.updatedAt) }}
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-badge :color="page.status === 'published' ? 'positive' : 'warning'">
                  {{ page.status === 'published' ? 'Publicado' : 'Borrador' }}
                </q-badge>
              </q-item-section>
              <q-item-section side>
                <q-btn flat round icon="mdi-eye" :to="`/preview/${page.slug}`" />
                <q-btn flat round icon="mdi-pencil" :to="`/admin/builder/${page.id}`" />
              </q-item-section>
            </q-item>
          </q-list>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useApi } from '~/composables/useApi';
import AdminHeader from '~/components/admin/AdminHeader.vue';
import AdminSidebar from '~/components/admin/AdminSidebar.vue';

const drawerOpen = ref(true);
const api = useApi();
const { state } = api;

// Cargar datos al montar el componente
onMounted(async () => {
  try {
    await api.getPages();
    await api.getTemplates();
    await api.getComponents();
    await api.getCurrentUser();
  } catch (error) {
    console.error('Error al cargar datos:', error);
  }
});

// Obtener las páginas más recientes
const recentPages = computed(() => {
  return [...state.pages]
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 5);
});

// Formatear fecha
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};
</script>

<style scoped>
/* Estilos adicionales si son necesarios */
</style>
