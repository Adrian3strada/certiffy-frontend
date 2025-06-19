import { ref, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useMediaUrl } from './useMediaUrl';
import { addNoCacheParams } from '~/utils/cache';
import { useFetch } from '#app';

// Definición de tipos para los eventos y filtros
export interface EventTag {
  slug: string;
  name: string;
}

export interface EventCategory {
  slug: string;
  nombre: string;
}

export interface Event {
  id: number;
  title: string;
  url: string;
  categoria: string;
  tags: string[];
  date: string;
}

export interface EventPagination {
  current_page: number;
  total_pages: number;
  has_next: boolean;
  has_previous: boolean;
  total_items: number;
}

export interface EventsResponse {
  eventos: Event[];
  categorias: EventCategory[];
  tags: EventTag[];
  current_categoria: string | null;
  current_tag: string | null;
  pagination: EventPagination;
}

export function useEvents() {
  const route = useRoute();
  const { convertToProxiedUrl } = useMediaUrl();
  
  // Estado reactivo
  const eventsData = ref<EventsResponse | null>(null);
  const isLoading = ref(false);
  const error = ref<any>(null);
  
  // Filtros y paginación
  const currentPage = ref(1);
  const selectedCategory = ref<string | null>(null);
  const selectedTag = ref<string | null>(null);
  
  // Computed properties para acceder fácilmente a los datos
  const events = computed(() => eventsData.value?.eventos || []);
  const categories = computed(() => eventsData.value?.categorias || []);
  const tags = computed(() => eventsData.value?.tags || []);
  const pagination = computed(() => eventsData.value?.pagination || {
    current_page: 1,
    total_pages: 1,
    has_next: false,
    has_previous: false,
    total_items: 0
  });
  
  // Función para formatear la fecha del evento
  const formatEventDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('es', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } catch (e) {
      console.error('Error al formatear fecha:', e);
      return dateString;
    }
  };
  
  // Función para obtener los eventos con filtros y paginación
  const fetchEvents = async (page = 1, category: string | null = null, tag: string | null = null, itemsPerPage = 6) => {
    isLoading.value = true;
    error.value = null;
    
    try {
      // Construir la URL con los parámetros de filtro
      let apiEndpoint = `/api/v2/eventos/?locale=${route.params.locale || 'es'}&page=${page}`;
      
      if (category) {
        apiEndpoint += `&categoria=${category}`;
      }
      
      if (tag) {
        apiEndpoint += `&tag=${tag}`;
      }
      
      if (itemsPerPage) {
        apiEndpoint += `&items_per_page=${itemsPerPage}`;
      }
      
      // Añadir parámetros anti-caché a la URL
      const noCacheUrl = addNoCacheParams(apiEndpoint);
      
      console.log('Fetching events from:', noCacheUrl);
      
      // Usar useFetch de Nuxt para obtener los datos
      const { data, error: fetchError } = await useFetch<EventsResponse>(noCacheUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Cache-Control': 'no-cache'
        },
        cache: 'no-store'
      });
      
      if (fetchError.value) {
        throw fetchError.value;
      }
      
      if (data.value) {
        eventsData.value = data.value;
        currentPage.value = data.value.pagination.current_page;
        selectedCategory.value = data.value.current_categoria;
        selectedTag.value = data.value.current_tag;
        console.log('Events data loaded:', data.value);
      }
    } catch (err) {
      console.error('Error fetching events:', err);
      error.value = err;
    } finally {
      isLoading.value = false;
    }
  };
  
  // Función para cambiar de página
  const goToPage = (page: number) => {
    if (page !== currentPage.value) {
      currentPage.value = page;
      fetchEvents(page, selectedCategory.value, selectedTag.value);
    }
  };
  
  // Función para filtrar por categoría
  const filterByCategory = (category: string | null) => {
    selectedCategory.value = category;
    selectedTag.value = null; // Reset tag filter when changing category
    currentPage.value = 1; // Reset to first page
    fetchEvents(1, category, null);
  };
  
  // Función para filtrar por etiqueta
  const filterByTag = (tag: string | null) => {
    selectedTag.value = tag;
    currentPage.value = 1; // Reset to first page
    fetchEvents(1, selectedCategory.value, tag);
  };
  
  // Función para resetear todos los filtros
  const resetFilters = () => {
    selectedCategory.value = null;
    selectedTag.value = null;
    currentPage.value = 1;
    fetchEvents(1, null, null);
  };
  
  // Cargar eventos iniciales
  const initEvents = (itemsPerPage = 6) => {
    fetchEvents(1, null, null, itemsPerPage);
  };
  
  return {
    eventsData,
    events,
    categories,
    tags,
    pagination,
    currentPage,
    selectedCategory,
    selectedTag,
    isLoading,
    error,
    fetchEvents,
    goToPage,
    filterByCategory,
    filterByTag,
    resetFilters,
    formatEventDate,
    initEvents
  };
}
