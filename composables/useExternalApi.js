import { ref, reactive } from 'vue';
import { externalApiService } from '~/api/externalApi';

export function useExternalApi() {
  const loading = ref(false);
  const error = ref(null);
  
  // Estado para almacenar datos de la API externa
  const state = reactive({
    currentPage: null,
    allPages: []
  });

  // Función genérica para manejar las llamadas a la API
  const callApi = async (apiFunction, ...args) => {
    loading.value = true;
    error.value = null;
    
    try {
      const result = await apiFunction(...args);
      loading.value = false;
      return result.data;
    } catch (err) {
      loading.value = false;
      error.value = err.message || 'Error en la llamada a la API externa';
      throw err;
    }
  };

  // Obtener una página por ID
  const getPageById = async (id) => {
    try {
      const page = await callApi(externalApiService.getPageById, id);
      state.currentPage = page;
      return page;
    } catch (error) {
      console.error('Error al obtener página por ID:', error);
      throw error;
    }
  };

  // Obtener todas las páginas
  const getAllPages = async () => {
    try {
      const pages = await callApi(externalApiService.getAllPages);
      state.allPages = pages;
      return pages;
    } catch (error) {
      console.error('Error al obtener todas las páginas:', error);
      throw error;
    }
  };

  return {
    loading,
    error,
    state,
    getPageById,
    getAllPages
  };
}
