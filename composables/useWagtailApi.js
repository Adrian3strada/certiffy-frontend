import { ref } from 'vue';

// URL base de la API de Wagtail
const API_BASE_URL = 'https://8af2-2806-266-480-8244-9437-a02c-cbc8-6484.ngrok-free.app/api/v2';

// Datos de respaldo para cuando la API no está disponible
const MOCK_DATA = {
  id: 15,
  meta: {
    type: "home.HomePage",
    detail_url: "https://8af2-2806-266-480-8244-9437-a02c-cbc8-6484.ngrok-free.app/api/v2/pages/15/",
    html_url: "http://127.0.0.1/",
    slug: "homepage",
    show_in_menus: false,
    seo_title: "",
    search_description: "",
    first_published_at: "2025-05-16T19:59:35.798033Z",
    alias_of: null,
    parent: null
  },
  title: "HOMEPAGE",
  intro_text: "<p data-block-key=\"1vuf4\">CERTIFFY</p><hr/><p data-block-key=\"cd7hf\"></p><p data-block-key=\"ejvg2\"></p><p data-block-key=\"bpzcz\"></p><p data-block-key=\"cor2f\"></p>",
  video_url: "https://www.youtube.com/watch?v=X6dM7OjHNsE",
  carousel_images: [
    {
      type: "image",
      value: 1,
      id: "cea1b6f6-d630-428a-95b1-b380b9bcff0c"
    },
    {
      type: "image",
      value: 2,
      id: "d4d701bf-2bdc-43e9-9d44-d5f4b0e5fe4f"
    },
    {
      type: "image",
      value: 3,
      id: "483251f4-d522-4905-8575-edf765784cc8"
    }
  ]
};

export function useWagtailApi() {
  const loading = ref(false);
  const error = ref(null);
  const isMockData = ref(false);

  /**
   * Obtener una página por su ID
   * @param {number} id - ID de la página
   * @returns {Promise<Object>} - Datos de la página
   */
  const getPageById = async (id) => {
    loading.value = true;
    error.value = null;
    isMockData.value = false;
    
    try {
      console.log(`Obteniendo página con ID ${id} de ${API_BASE_URL}/pages/${id}/`);
      
      const { data, error: fetchError } = await useFetch(`${API_BASE_URL}/pages/${id}/`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      if (fetchError.value) {
        console.error('Error al obtener datos:', fetchError.value);
        throw new Error(fetchError.value.message || 'Error al obtener datos');
      }
      
      if (!data.value) {
        console.warn('No se recibieron datos, usando datos de respaldo');
        isMockData.value = true;
        return MOCK_DATA;
      }
      
      console.log('Datos obtenidos correctamente:', data.value);
      return data.value;
    } catch (err) {
      console.error('Error al obtener página:', err);
      error.value = err.message || 'Error desconocido';
      isMockData.value = true;
      return MOCK_DATA;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Obtener todas las páginas
   * @returns {Promise<Array>} - Lista de páginas
   */
  const getAllPages = async () => {
    loading.value = true;
    error.value = null;
    isMockData.value = false;
    
    try {
      console.log(`Obteniendo todas las páginas de ${API_BASE_URL}/pages/`);
      
      const { data, error: fetchError } = await useFetch(`${API_BASE_URL}/pages/`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      if (fetchError.value) {
        console.error('Error al obtener lista de páginas:', fetchError.value);
        throw new Error(fetchError.value.message || 'Error al obtener lista de páginas');
      }
      
      if (!data.value) {
        console.warn('No se recibieron datos, usando datos de respaldo');
        isMockData.value = true;
        return [MOCK_DATA];
      }
      
      // Wagtail puede devolver los resultados en un formato diferente, como items o results
      const pages = data.value.items || data.value.results || data.value;
      console.log('Páginas obtenidas correctamente:', pages);
      return Array.isArray(pages) ? pages : [pages];
    } catch (err) {
      console.error('Error al obtener lista de páginas:', err);
      error.value = err.message || 'Error desconocido';
      isMockData.value = true;
      return [MOCK_DATA];
    } finally {
      loading.value = false;
    }
  };

  /**
   * Obtener un bloque específico por su ID
   * @param {string} blockId - ID del bloque
   * @returns {Promise<Object>} - Datos del bloque
   */
  const getBlockById = async (blockId) => {
    loading.value = true;
    error.value = null;
    isMockData.value = false;
    
    try {
      console.log(`Obteniendo bloque con ID ${blockId}`);
      
      // Aquí necesitaríamos conocer el endpoint exacto para bloques
      // Por ahora, usamos datos de respaldo
      console.warn('API de bloques no implementada, usando datos de respaldo');
      isMockData.value = true;
      
      // Simulamos un bloque basado en el tipo
      const blockType = blockId.split('-')[0] || 'richtext';
      return getMockBlockData(blockType, blockId);
    } catch (err) {
      console.error('Error al obtener bloque:', err);
      error.value = err.message || 'Error desconocido';
      isMockData.value = true;
      return getMockBlockData('richtext', blockId);
    } finally {
      loading.value = false;
    }
  };

  /**
   * Obtener datos de respaldo para un tipo de bloque
   * @param {string} blockType - Tipo de bloque
   * @param {string} blockId - ID del bloque
   * @returns {Object} - Datos de respaldo
   */
  const getMockBlockData = (blockType, blockId) => {
    const mockBlocks = {
      'heading': {
        type: 'heading',
        id: blockId,
        value: {
          text: 'Título de ejemplo',
          level: 2,
          id: blockId
        }
      },
      'richtext': {
        type: 'richtext',
        id: blockId,
        value: '<p>Este es un texto de ejemplo para mostrar cómo se vería un bloque de texto enriquecido de Wagtail.</p><p>Puede contener <strong>negrita</strong>, <em>cursiva</em> y otros formatos.</p>'
      },
      'image': {
        type: 'image',
        id: blockId,
        value: {
          url: 'https://via.placeholder.com/800x400',
          alt: 'Imagen de ejemplo',
          width: 800,
          height: 400,
          caption: 'Esta es una imagen de ejemplo'
        }
      },
      'video': {
        type: 'video',
        id: blockId,
        value: {
          url: 'https://www.youtube.com/watch?v=X6dM7OjHNsE',
          caption: 'Video de ejemplo'
        }
      },
      'carousel': {
        type: 'carousel',
        id: blockId,
        value: MOCK_DATA.carousel_images
      }
    };
    
    return mockBlocks[blockType] || mockBlocks['richtext'];
  };

  return {
    loading,
    error,
    isMockData,
    getPageById,
    getAllPages,
    getBlockById
  };
}
