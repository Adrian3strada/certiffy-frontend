<template>
  <q-layout view="lHh Lpr lFf">
    <admin-header @toggle-drawer="drawerOpen = !drawerOpen" />
    
    <admin-sidebar v-model="drawerOpen" />
    
    <q-page-container>
      <q-page padding>
        <div class="row items-center q-mb-lg">
          <div class="col">
            <h1 class="text-h4 q-my-none">Páginas</h1>
          </div>
          <div class="col-auto">
            <q-btn color="primary" icon="mdi-plus" label="Nueva Página" @click="showTemplateDialog = true" />
          </div>
        </div>
        
        <!-- Tabla de páginas -->
        <q-card>
          <q-card-section>
            <q-table
              :rows="state.pages"
              :columns="columns"
              row-key="id"
              :loading="api.loading"
              :filter="filter"
              :pagination.sync="pagination"
            >
              <template v-slot:top-right>
                <q-input
                  v-model="filter"
                  placeholder="Buscar"
                  dense
                  outlined
                  class="q-ml-md"
                >
                  <template v-slot:append>
                    <q-icon name="mdi-magnify" />
                  </template>
                </q-input>
              </template>
              
              <template v-slot:body-cell-status="props">
                <q-td :props="props">
                  <q-badge :color="props.row.status === 'published' ? 'positive' : 'warning'">
                    {{ props.row.status === 'published' ? 'Publicado' : 'Borrador' }}
                  </q-badge>
                </q-td>
              </template>
              
              <template v-slot:body-cell-actions="props">
                <q-td :props="props" class="q-gutter-sm">
                  <q-btn flat round size="sm" icon="mdi-eye" :to="`/preview/${props.row.slug}`" />
                  <q-btn flat round size="sm" icon="mdi-pencil" :to="`/admin/builder/${props.row.id}`" />
                  <q-btn 
                    flat 
                    round 
                    size="sm" 
                    :icon="props.row.isHomePage ? 'mdi-home-variant-outline' : 'mdi-home-outline'" 
                    :color="props.row.isHomePage ? 'positive' : 'grey'" 
                    @click="setAsHomePage(props.row)" 
                    :disable="props.row.status !== 'published'"
                    v-tooltip="props.row.status !== 'published' ? 'Solo páginas publicadas pueden ser página de inicio' : (props.row.isHomePage ? 'Página de inicio actual' : 'Establecer como página de inicio')"
                  />
                  <q-btn flat round size="sm" icon="mdi-delete" @click="confirmDelete(props.row)" />
                </q-td>
              </template>
            </q-table>
          </q-card-section>
        </q-card>
        
        <!-- Diálogo para seleccionar plantilla -->
        <q-dialog v-model="showTemplateDialog">
          <q-card style="width: 700px; max-width: 90vw;">
            <q-card-section>
              <div class="text-h6">Seleccionar Plantilla</div>
            </q-card-section>
            
            <q-card-section class="q-pt-none">
              <div class="row q-col-gutter-md">
                <div 
                  v-for="template in state.templates" 
                  :key="template.id" 
                  class="col-12 col-md-6"
                >
                  <q-card 
                    class="template-card cursor-pointer"
                    :class="{ 'selected': selectedTemplate === template.id }"
                    @click="selectedTemplate = template.id"
                  >
                    <q-img
                      :src="template.thumbnail || 'https://via.placeholder.com/300x200?text=Sin+Imagen'"
                      height="150px"
                    />
                    <q-card-section>
                      <div class="text-h6">{{ template.name }}</div>
                      <div class="text-subtitle2">{{ template.description }}</div>
                    </q-card-section>
                  </q-card>
                </div>
              </div>
            </q-card-section>
            
            <q-card-actions align="right">
              <q-btn flat label="Cancelar" color="negative" v-close-popup />
              <q-btn 
                label="Crear Página" 
                color="primary" 
                :disable="!selectedTemplate" 
                @click="createNewPage"
              />
            </q-card-actions>
          </q-card>
        </q-dialog>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useApi } from '~/composables/useApi';
import AdminHeader from '~/components/admin/AdminHeader.vue';
import AdminSidebar from '~/components/admin/AdminSidebar.vue';

const router = useRouter();
const $q = useQuasar();
const api = useApi();
const { state } = api;

const drawerOpen = ref(true);
const filter = ref('');
const showTemplateDialog = ref(false);
const selectedTemplate = ref(null);

// Configuración de la tabla
const columns = [
  { name: 'title', label: 'Título', field: 'title', sortable: true, align: 'left' },
  { name: 'slug', label: 'Slug', field: 'slug', sortable: true, align: 'left' },
  { name: 'status', label: 'Estado', field: 'status', sortable: true, align: 'left' },
  { 
    name: 'updatedAt', 
    label: 'Última Actualización', 
    field: 'updatedAt', 
    sortable: true, 
    align: 'left',
    format: val => formatDate(val)
  },
  { name: 'actions', label: 'Acciones', field: 'actions', align: 'center' }
];

const pagination = ref({
  sortBy: 'updatedAt',
  descending: true,
  page: 1,
  rowsPerPage: 10
});

// Cargar datos al montar el componente
onMounted(async () => {
  try {
    await api.getPages();
    await api.getTemplates();
  } catch (error) {
    console.error('Error al cargar datos:', error);
    $q.notify({
      color: 'negative',
      message: 'Error al cargar datos: ' + error.message,
      icon: 'mdi-alert'
    });
  }
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

// Crear nueva página
const createNewPage = () => {
  if (!selectedTemplate.value) return;
  
  router.push(`/admin/builder/new?template=${selectedTemplate.value}`);
  showTemplateDialog.value = false;
};

// Establecer una página como página de inicio
const setAsHomePage = async (page) => {
  console.log('Intentando establecer como página de inicio:', page);
  
  // Solo permitir establecer páginas publicadas como página de inicio
  if (page.status !== 'published') {
    $q.notify({
      color: 'negative',
      message: 'Solo las páginas publicadas pueden establecerse como página de inicio',
      icon: 'mdi-alert'
    });
    return;
  }
  
  // Si la página ya es la página de inicio, no hacer nada
  if (page.isHomePage) {
    $q.notify({
      color: 'info',
      message: `"${page.title}" ya es la página de inicio`,
      icon: 'mdi-information'
    });
    return;
  }
  
  try {
    // Confirmar antes de cambiar la página de inicio
    $q.dialog({
      title: 'Establecer como página de inicio',
      message: `¿Estás seguro de que deseas establecer "${page.title}" como página de inicio?`,
      cancel: true,
      persistent: true
    }).onOk(async () => {
      try {
        // Buscar la página que actualmente es la página de inicio
        const currentHomePage = state.pages.find(p => p.isHomePage === true);
        
        // Si hay una página de inicio actual, quitarle la marca
        if (currentHomePage) {
          console.log('Quitando marca de página de inicio a:', currentHomePage.title);
          const updatedCurrentHomePage = {
            ...currentHomePage,
            isHomePage: false
          };
          await api.updatePage(currentHomePage.id, updatedCurrentHomePage);
        }
        
        // Establecer la nueva página como página de inicio
        console.log('Estableciendo como página de inicio a:', page.title);
        const updatedPage = {
          ...page,
          isHomePage: true
        };
        await api.updatePage(page.id, updatedPage);
        
        // Recargar la lista de páginas para actualizar la UI
        await api.getPages();
        
        $q.notify({
          color: 'positive',
          message: `"${page.title}" ha sido establecida como página de inicio`,
          icon: 'mdi-check'
        });
      } catch (error) {
        console.error('Error al establecer página de inicio:', error);
        $q.notify({
          color: 'negative',
          message: 'Error al establecer página de inicio: ' + error.message,
          icon: 'mdi-alert'
        });
      }
    });
  } catch (error) {
    console.error('Error al mostrar diálogo:', error);
  }
};

// Confirmar eliminación de página
const confirmDelete = (page) => {
  // Si la página es la página de inicio, mostrar advertencia adicional
  const message = page.isHomePage 
    ? `¿Estás seguro de que deseas eliminar la página "${page.title}"? Esta es la página de inicio actual.`
    : `¿Estás seguro de que deseas eliminar la página "${page.title}"?`;
    
  $q.dialog({
    title: 'Confirmar eliminación',
    message: message,
    cancel: true,
    persistent: true
  }).onOk(async () => {
    try {
      await api.deletePage(page.id);
      await api.getPages(); // Recargar la lista de páginas
      
      $q.notify({
        color: 'positive',
        message: 'Página eliminada correctamente',
        icon: 'mdi-check'
      });
    } catch (error) {
      $q.notify({
        color: 'negative',
        message: 'Error al eliminar la página: ' + error.message,
        icon: 'mdi-alert'
      });
    }
  });
};
</script>

<style scoped>
.template-card {
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.template-card:hover {
  transform: translateY(-5px);
}

.template-card.selected {
  border-color: #1976D2;
}
</style>
