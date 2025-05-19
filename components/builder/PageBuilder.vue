<template>
  <div class="page-builder">
    <div class="builder-toolbar q-pa-md">
      <div class="row items-center q-gutter-md">
        <q-btn color="primary" icon="mdi-content-save" label="Guardar" @click="savePage" :loading="api.loading" />
        <q-btn color="secondary" icon="mdi-eye" :label="state.isPreviewMode ? 'Editar' : 'Vista Previa'" @click="togglePreviewMode" />
        <q-btn 
          :color="state.currentPage && state.currentPage.status === 'published' ? 'positive' : 'grey'" 
          :icon="state.currentPage && state.currentPage.status === 'published' ? 'mdi-check-circle' : 'mdi-checkbox-blank-circle-outline'" 
          :label="state.currentPage && state.currentPage.status === 'published' ? 'Publicado' : 'Publicar'" 
          @click="togglePublishStatus"
        />
        <q-space />
        <q-btn color="negative" flat icon="mdi-close" label="Salir" @click="exitBuilder" />
      </div>
    </div>

    <div class="builder-content">
      <div class="row">
        <!-- Panel lateral de componentes (solo visible en modo edición) -->
        <div v-if="!state.isPreviewMode" class="col-md-3 col-xs-12 components-panel q-pa-md">
          <h5 class="q-mt-none q-mb-md">Componentes</h5>
          
          <q-list bordered separator>
            <q-item 
              v-for="component in components" 
              :key="component.id"
              clickable
              v-ripple
              @click="addComponentToLayout(component.id)"
            >
              <q-item-section avatar>
                <q-icon :name="component.icon" />
              </q-item-section>
              <q-item-section>
                {{ component.name }}
              </q-item-section>
            </q-item>
          </q-list>
        </div>

        <!-- Área de construcción de página -->
        <div :class="state.isPreviewMode ? 'col-12' : 'col-md-9 col-xs-12'">
          <!-- Modo de edición con grid layout -->
          <div v-if="!state.isPreviewMode" class="grid-container q-pa-md">
            <grid-layout
              ref="gridLayoutRef"
              :layout="state.layout"
              :col-num="12"
              :row-height="50"
              :is-draggable="true"
              :is-resizable="true"
              :vertical-compact="true"
              :use-css-transforms="true"
              @layout-updated="handleLayoutChange"
            >
              <grid-item
                v-for="item in state.layout"
                :key="item.i"
                :x="item.x"
                :y="item.y"
                :w="item.w"
                :h="getAdjustedHeight(item)"
                :i="item.i"
                :class="{ 'grid-item-selected': item.i === state.selectedItemId }"
                @click.native="selectGridItem(item.i)"
              >
                <!-- Renderizar el componente según su tipo -->
                <component-renderer 
                  :type="item.type" 
                  :content="item.content" 
                  :is-preview="false" 
                />
                
                <!-- Controles del componente -->
                <div class="component-controls">
                  <q-btn round flat size="sm" icon="mdi-pencil" @click.stop="editComponent(item.i)" />
                  <q-btn round flat size="sm" icon="mdi-delete" @click.stop="removeComponent(item.i)" />
                </div>
              </grid-item>
            </grid-layout>
          </div>
          
          <!-- Modo de vista previa con estructura similar a la página de inicio -->
          <div v-else class="preview-container">
            <!-- Encabezado de la página -->
            <div v-if="hasComponentOfType(state.layout, 'header')" class="page-section header-section">
              <component-renderer 
                v-for="item in getComponentsOfType(state.layout, 'header')"
                :key="item.i"
                :type="item.type" 
                :content="item.content" 
                :is-preview="true" 
              />
            </div>
            
            <!-- Contenido principal -->
            <div class="page-section main-content">
              <div class="container">
                <div class="row q-col-gutter-md">
                  <template v-for="item in getSortedContentComponents(state.layout)" :key="item.i">
                    <div :class="`col-12 col-md-${item.w}`">
                      <component-renderer 
                        :type="item.type" 
                        :content="item.content" 
                        :is-preview="true" 
                      />
                    </div>
                  </template>
                </div>
              </div>
            </div>
            
            <!-- Pie de página -->
            <div v-if="hasComponentOfType(state.layout, 'footer')" class="page-section footer-section">
              <component-renderer 
                v-for="item in getComponentsOfType(state.layout, 'footer')"
                :key="item.i"
                :type="item.type" 
                :content="item.content" 
                :is-preview="true" 
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Panel de edición de componente -->
    <q-dialog
      v-model="showComponentEditor"
      position="right"
      maximized
    >
      <q-card style="width: 350px; max-width: 90vw; height: 100vh;">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Editar Componente</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="scroll" style="height: calc(100vh - 50px);">
          <component-editor
            v-if="selectedComponent"
            :component-type="selectedComponent.type"
            :component-content="selectedComponent.content"
            @update:content="updateComponentContent"
          />
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useQuasar } from 'quasar';
import { GridLayout, GridItem } from 'vue3-grid-layout';
import { usePageBuilder } from '~/composables/usePageBuilder';
import { useApi } from '~/composables/useApi';
import ComponentRenderer from '~/components/builder/ComponentRenderer.vue';
import ComponentEditor from '~/components/builder/ComponentEditor.vue';
// Importar el registro de componentes
import { getAvailableComponents, getComponentByType } from './ComponentRegistry';

// Funciones auxiliares para organizar componentes
const hasComponentOfType = (layout, type) => {
  if (!layout || !Array.isArray(layout) || layout.length === 0) {
    return false;
  }
  return layout.some(item => item.type === type);
};

const getComponentsOfType = (layout, type) => {
  if (!layout || !Array.isArray(layout) || layout.length === 0) {
    return [];
  }
  return layout.filter(item => item.type === type);
};

const getSortedContentComponents = (layout) => {
  if (!layout || !Array.isArray(layout) || layout.length === 0) {
    return [];
  }
  // Filtrar componentes que no son header ni footer
  const contentComponents = layout.filter(
    item => item.type !== 'header' && item.type !== 'footer'
  );
  // Ordenar por posición Y (de arriba a abajo)
  return contentComponents.sort((a, b) => a.y - b.y);
};

// Ajustar la altura de los componentes según su tipo
const getAdjustedHeight = (item) => {
  // Alturas predefinidas para ciertos tipos de componentes
  const heightMap = {
    'header': 2,
    'footer': 2,
    'content': 4,
    'hero': 6,
    'features': 8,
    'testimonials': 6,
    'cta': 4,
    'form': 8,
    'product-hero': 6,
    'product-gallery': 8,
    'product-specs': 6,
    'related-products': 6
  };
  
  // Si el tipo de componente tiene una altura predefinida, usarla
  if (heightMap[item.type]) {
    return heightMap[item.type];
  }
  
  // Si no, usar la altura original o un valor por defecto
  return item.h || 2;
};

const router = useRouter();
const route = useRoute();
const $q = useQuasar();

const { state, gridLayoutRef, loadPage, createNewPage, savePage: savePageAction, addComponent, removeComponent: removeComponentAction, updateComponentContent: updateComponentContentAction, selectComponent, selectedComponent, onLayoutChange, togglePreviewMode } = usePageBuilder();
const api = useApi();

// Estado local
const showComponentEditor = ref(false);
const components = ref([]);

// Cargar componentes disponibles
const loadComponents = () => {
  try {
    // Usar el registro de componentes en lugar de la API
    components.value = getAvailableComponents();
    console.log('Componentes cargados:', components.value);
  } catch (error) {
    $q.notify({
      color: 'negative',
      message: 'Error al cargar componentes: ' + error.message,
      icon: 'mdi-alert'
    });
  }
};

// Inicializar el constructor
const initBuilder = async () => {
  try {
    // Cargar componentes (no es asíncrono ahora)
    loadComponents();
    
    // Obtener el ID de la página de la URL
    const pageId = route.params.id;
    
    if (pageId) {
      // Cargar la página existente
      await loadPage(pageId);
    } else {
      // Crear una nueva página
      await createNewPage();
    }
  } catch (error) {
    $q.notify({
      color: 'negative',
      message: 'Error al inicializar el constructor: ' + error.message,
      icon: 'mdi-alert'
    });
  }
};

// Guardar la página
const savePage = async () => {
  try {
    await savePageAction();
    $q.notify({
      color: 'positive',
      message: 'Página guardada correctamente',
      icon: 'mdi-check'
    });
  } catch (error) {
    $q.notify({
      color: 'negative',
      message: 'Error al guardar la página: ' + error.message,
      icon: 'mdi-alert'
    });
  }
};

// Añadir un nuevo componente al layout
const addComponentToLayout = async (componentId) => {
  try {
    // Encontrar la posición Y más baja en el layout actual
    let maxY = 0;
    if (state.layout.length > 0) {
      // Calcular la posición Y más baja sumando Y + altura para cada componente
      const positions = state.layout.map(item => {
        // Usar la altura ajustada para el cálculo
        const adjustedHeight = getAdjustedHeight(item);
        return item.y + adjustedHeight;
      });
      
      // Obtener el valor máximo
      maxY = Math.max(...positions);
      
      // Añadir un espacio adicional entre componentes
      maxY += 1;
    }
    
    console.log(`Añadiendo componente en posición Y: ${maxY}`);
    
    // Añadir el componente en la posición calculada
    const newItem = await addComponent(componentId, { x: 0, y: maxY });
    
    // Reordenar el layout para evitar solapamientos
    reorderLayout();
    
    // Abrir el editor para el nuevo componente
    selectGridItem(newItem.i);
  } catch (error) {
    $q.notify({
      color: 'negative',
      message: 'Error al añadir componente: ' + error.message,
      icon: 'mdi-alert'
    });
  }
};

// Seleccionar un componente en el grid
const selectGridItem = (itemId) => {
  if (state.isPreviewMode) return;
  
  selectComponent(itemId);
  showComponentEditor.value = true;
};

// Editar un componente
const editComponent = (itemId) => {
  selectComponent(itemId);
  showComponentEditor.value = true;
};

// Eliminar un componente
const removeComponent = (itemId) => {
  $q.dialog({
    title: 'Confirmar eliminación',
    message: '¿Estás seguro de que deseas eliminar este componente?',
    cancel: true,
    persistent: true
  }).onOk(() => {
    // Eliminar el componente
    removeComponentAction(itemId);
    
    // Cerrar el editor si el componente eliminado estaba siendo editado
    if (showComponentEditor.value && state.selectedItemId === itemId) {
      showComponentEditor.value = false;
    }
    
    // Reordenar el layout para evitar espacios vacíos
    reorderLayout();
  });
};

// Actualizar el contenido de un componente
const updateComponentContent = (newContent) => {
  if (!state.selectedItemId) return;
  updateComponentContentAction(state.selectedItemId, newContent);
};

// Reordenar el layout para evitar solapamientos
const reorderLayout = () => {
  if (!state.layout || state.layout.length === 0) return;
  
  // Ordenar los componentes por posición Y
  const sortedItems = [...state.layout].sort((a, b) => a.y - b.y);
  
  // Reposicionar los componentes para evitar solapamientos
  let currentY = 0;
  
  sortedItems.forEach((item, index) => {
    // Establecer la posición Y del componente actual
    item.y = currentY;
    
    // Actualizar el componente en el layout original
    const originalIndex = state.layout.findIndex(i => i.i === item.i);
    if (originalIndex !== -1) {
      state.layout[originalIndex].y = currentY;
    }
    
    // Calcular la posición Y para el siguiente componente
    const height = getAdjustedHeight(item);
    currentY += height + 1; // Añadir un espacio entre componentes
  });
  
  // Marcar como modificado
  state.isDirty = true;
};

// Cambiar el estado de publicación de la página
const togglePublishStatus = async () => {
  if (!state.currentPage) return;
  
  try {
    // Cambiar el estado de la página
    const newStatus = state.currentPage.status === 'published' ? 'draft' : 'published';
    
    // Si hay cambios sin guardar, preguntar si desea guardarlos primero
    if (state.isDirty) {
      $q.dialog({
        title: 'Cambios sin guardar',
        message: `Tienes cambios sin guardar. Debes guardar la página antes de ${newStatus === 'published' ? 'publicarla' : 'despublicarla'}.`,
        cancel: true,
        persistent: true,
        ok: {
          label: 'Guardar y continuar',
          color: 'primary'
        },
        cancel: {
          label: 'Cancelar',
          color: 'negative'
        }
      }).onOk(async () => {
        await savePage();
        await updatePageStatus(newStatus);
      });
    } else {
      await updatePageStatus(newStatus);
    }
  } catch (error) {
    console.error('Error al cambiar el estado de publicación:', error);
    $q.notify({
      color: 'negative',
      message: 'Error al cambiar el estado de publicación: ' + error.message,
      icon: 'mdi-alert'
    });
  }
};

// Actualizar el estado de publicación de la página
const updatePageStatus = async (newStatus) => {
  try {
    // Actualizar el estado de la página
    state.currentPage.status = newStatus;
    
    // Guardar la página con el nuevo estado
    const result = await api.updatePage(state.currentPage.id, state.currentPage);
    state.currentPage = result;
    
    $q.notify({
      color: 'positive',
      message: newStatus === 'published' ? 'Página publicada correctamente' : 'Página despublicada correctamente',
      icon: 'mdi-check'
    });
  } catch (error) {
    console.error('Error al actualizar el estado de la página:', error);
    $q.notify({
      color: 'negative',
      message: 'Error al actualizar el estado de la página: ' + error.message,
      icon: 'mdi-alert'
    });
  }
};

// Salir del constructor
const exitBuilder = () => {
  if (state.isDirty) {
    $q.dialog({
      title: 'Cambios sin guardar',
      message: 'Tienes cambios sin guardar. ¿Deseas guardarlos antes de salir?',
      cancel: true,
      persistent: true,
      ok: {
        label: 'Guardar y salir',
        color: 'primary'
      },
      cancel: {
        label: 'Salir sin guardar',
        color: 'negative'
      }
    }).onOk(async () => {
      await savePage();
      router.push('/admin/pages');
    }).onCancel(() => {
      router.push('/admin/pages');
    });
  } else {
    router.push('/admin/pages');
  }
};

// Manejar cambios en el layout cuando el usuario mueve o redimensiona componentes
const handleLayoutChange = (newLayout) => {
  // Actualizar el layout directamente para permitir el movimiento de componentes
  onLayoutChange(newLayout);
  
  // Verificar si hay componentes superpuestos solo para informar
  const hasOverlap = checkForOverlaps(newLayout);
  
  if (hasOverlap) {
    console.log('Advertencia: Se detectaron componentes superpuestos');
  }
};

// Verificar si hay componentes superpuestos en el layout
const checkForOverlaps = (layout) => {
  if (!layout || layout.length < 2) return false;
  
  // Ordenar los componentes por posición Y
  const sortedItems = [...layout].sort((a, b) => a.y - b.y);
  
  // Verificar si hay superposiciones
  for (let i = 0; i < sortedItems.length - 1; i++) {
    const current = sortedItems[i];
    const next = sortedItems[i + 1];
    
    // Calcular el límite inferior del componente actual
    const currentBottom = current.y + getAdjustedHeight(current);
    
    // Si el límite inferior del componente actual es mayor que la posición Y del siguiente componente,
    // hay una superposición
    if (currentBottom > next.y) {
      return true;
    }
  }
  
  return false;
};

// Observar cambios en el componente seleccionado
watch(() => state.selectedItemId, (newVal) => {
  if (!newVal) {
    showComponentEditor.value = false;
  }
});

// Inicializar al montar el componente
onMounted(() => {
  initBuilder();
});
</script>

<style scoped>
.page-builder {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.builder-toolbar {
  border-bottom: 1px solid #e0e0e0;
}

.builder-content {
  flex: 1;
  overflow: auto;
}

.components-panel {
  border-right: 1px solid #e0e0e0;
  height: 100%;
  overflow-y: auto;
}

.grid-container {
  height: 100%;
  overflow-y: auto;
  background-color: #f5f5f5;
  padding-bottom: 100px; /* Espacio adicional al final para componentes largos */
}

.grid-item-selected {
  border: 2px solid #1976D2 !important;
  box-shadow: 0 0 10px rgba(25, 118, 210, 0.5) !important;
}

.component-controls {
  position: absolute;
  top: 5px;
  right: 5px;
  display: flex;
  gap: 5px;
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 4px;
  padding: 2px;
  z-index: 10;
}

/* Estilos para el modo de vista previa */
.preview-container {
  min-height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  overflow-y: auto;
  padding-bottom: 40px; /* Espacio adicional al final */
}

.page-section {
  width: 100%;
}

.header-section {
  /* Estilos para la sección de encabezado */
}

.main-content {
  flex: 1;
  padding: 40px 0;
}

.footer-section {
  /* Estilos para la sección de pie de página */
  background-color: #f5f5f5;
  padding: 20px 0;
}

.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 15px;
}

@media (max-width: 767px) {
  .main-content {
    padding: 20px 0;
  }
}
</style>
