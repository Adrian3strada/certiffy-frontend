import { apiService } from '~/api/services';
import { ref, reactive } from 'vue';

export function useApi() {
  const loading = ref(false);
  const error = ref(null);
  
  // Estado para almacenar datos comunes
  const state = reactive({
    pages: [],
    templates: [],
    components: [],
    currentUser: null
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
      error.value = err.message || 'Error en la llamada a la API';
      throw err;
    }
  };

  // Funciones específicas para cada endpoint
  const getTemplates = async () => {
    const templates = await callApi(apiService.getTemplates);
    state.templates = templates;
    return templates;
  };

  const getTemplateById = (id) => callApi(apiService.getTemplateById, id);

  const getPages = async () => {
    const pages = await callApi(apiService.getPages);
    state.pages = pages;
    return pages;
  };

  const getPageById = (id) => callApi(apiService.getPageById, id);
  
  const getPageBySlug = (slug) => callApi(apiService.getPageBySlug, slug);

  const createPage = (pageData) => callApi(apiService.createPage, pageData);

  const updatePage = (id, pageData) => callApi(apiService.updatePage, id, pageData);

  const deletePage = (id) => callApi(apiService.deletePage, id);

  const getComponents = async () => {
    const components = await callApi(apiService.getComponents);
    state.components = components;
    return components;
  };

  const getComponentById = (id) => callApi(apiService.getComponentById, id);

  const login = (email, password) => callApi(apiService.login, email, password);

  const getCurrentUser = async () => {
    const user = await callApi(apiService.getCurrentUser);
    state.currentUser = user;
    return user;
  };

  // Obtener la página marcada como página de inicio
  const getHomePageContent = async () => {
    try {
      // Usar la nueva función getHomePage que obtiene directamente la página de inicio
      const result = await callApi(apiService.getHomePage);
      return result;
    } catch (error) {
      console.error('Error al obtener la página de inicio:', error);
      throw error;
    }
  };

  return {
    loading,
    error,
    state,
    getTemplates,
    getTemplateById,
    getPages,
    getPageById,
    getPageBySlug,
    getHomePageContent,
    createPage,
    updatePage,
    deletePage,
    getComponents,
    getComponentById,
    login,
    getCurrentUser
  };
}
