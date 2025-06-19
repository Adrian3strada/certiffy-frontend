<template>
  <div class="event-filter-container">
    <!-- Título de la sección -->
    <h2 class="text-h4 text-primary text-center q-mb-lg">{{ title }}</h2>
    
    <!-- Filtros -->
    <div class="row q-col-gutter-md q-mb-lg">
      <!-- Filtro por categoría -->
      <div v-if="showCategories" class="col-12 col-md-6">
        <q-select
          v-model="selectedCategoryModel"
          :options="categoryOptions"
          label="Filtrar por categoría"
          outlined
          emit-value
          map-options
          clearable
          color="primary"
          class="category-filter"
        >
          <template v-slot:prepend>
            <q-icon name="category" color="primary" />
          </template>
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                No hay categorías disponibles
              </q-item-section>
            </q-item>
          </template>
        </q-select>
      </div>
      
      <!-- Filtro por etiqueta -->
      <div v-if="showTags" class="col-12 col-md-6">
        <q-select
          v-model="selectedTagModel"
          :options="tagOptions"
          label="Filtrar por etiqueta"
          outlined
          emit-value
          map-options
          clearable
          color="primary"
          class="tag-filter"
        >
          <template v-slot:prepend>
            <q-icon name="local_offer" color="primary" />
          </template>
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                No hay etiquetas disponibles
              </q-item-section>
            </q-item>
          </template>
        </q-select>
      </div>
    </div>
    
    <!-- Botón para resetear filtros -->
    <div class="row justify-center q-mb-lg" v-if="selectedCategory || selectedTag">
      <q-btn
        label="Limpiar filtros"
        color="accent"
        outline
        icon="filter_alt_off"
        @click="resetFilters"
      />
    </div>
    
    <!-- Mensaje de carga -->
    <div v-if="isLoading" class="row justify-center q-my-xl">
      <q-spinner color="primary" size="3em" />
      <div class="text-h6 q-ml-md">Cargando eventos...</div>
    </div>
    
    <!-- Mensaje de error -->
    <div v-else-if="error" class="row justify-center q-my-xl">
      <q-banner class="bg-negative text-white">
        <template v-slot:avatar>
          <q-icon name="error" />
        </template>
        Error al cargar los eventos. Por favor, inténtalo de nuevo.
      </q-banner>
    </div>
    
    <!-- Sin resultados -->
    <div v-else-if="events.length === 0" class="row justify-center q-my-xl">
      <q-banner class="bg-info text-white">
        <template v-slot:avatar>
          <q-icon name="info" />
        </template>
        No se encontraron eventos con los filtros seleccionados.
      </q-banner>
    </div>
    
    <!-- Grid de eventos -->
    <div v-else class="row q-col-gutter-md">
      <div
        v-for="event in events"
        :key="event.id"
        class="col-12 col-sm-6 col-md-4"
      >
        <EventCard
          :event="event"
          :categories="categories"
          @filter-category="handleFilterCategory"
          @filter-tag="handleFilterTag"
        />
      </div>
    </div>
    
    <!-- Paginación -->
    <div class="row justify-center q-mt-lg" v-if="pagination.total_pages > 1">
      <q-pagination
        v-model="currentPageModel"
        :max="pagination.total_pages"
        :max-pages="6"
        boundary-links
        direction-links
        color="primary"
        active-color="accent"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useEvents } from '~/composables/useEvents';
import EventCard from './EventCard.vue';

// Props del componente
const props = defineProps({
  title: {
    type: String,
    default: 'Eventos'
  },
  showCategories: {
    type: Boolean,
    default: true
  },
  showTags: {
    type: Boolean,
    default: true
  },
  itemsPerPage: {
    type: Number,
    default: 6
  }
});

// Usar el composable de eventos
const {
  events,
  categories,
  tags,
  pagination,
  currentPage,
  selectedCategory,
  selectedTag,
  isLoading,
  error,
  filterByCategory,
  filterByTag,
  resetFilters,
  goToPage,
  initEvents
} = useEvents();

// Modelos reactivos para los selectores
const selectedCategoryModel = computed({
  get: () => selectedCategory.value,
  set: (value) => filterByCategory(value)
});

const selectedTagModel = computed({
  get: () => selectedTag.value,
  set: (value) => filterByTag(value)
});

// Modelo reactivo para la paginación
const currentPageModel = computed({
  get: () => currentPage.value,
  set: (value) => goToPage(value)
});

// Opciones para los selectores
const categoryOptions = computed(() => {
  return categories.value.map(cat => ({
    label: cat.nombre,
    value: cat.slug
  }));
});

const tagOptions = computed(() => {
  return tags.value.map(tag => ({
    label: tag.name,
    value: tag.slug
  }));
});

// Manejadores de eventos
const handleFilterCategory = (category: string) => {
  filterByCategory(category);
};

const handleFilterTag = (tag: string) => {
  filterByTag(tag);
};

// Inicializar eventos al montar el componente
onMounted(() => {
  initEvents(props.itemsPerPage);
});
</script>

<style scoped>
.event-filter-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

@media (max-width: 600px) {
  .event-filter-container {
    padding: 1rem 0.5rem;
  }
}
</style>
