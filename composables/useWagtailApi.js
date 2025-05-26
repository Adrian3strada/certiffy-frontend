import { ref } from 'vue';
// Usamos fetch nativo pero mantenemos una estructura compatible con useFetch

// URL base de la API de Wagtail - centralizada para toda la aplicación
export const API_BASE_URL = 'https://e2dd-2806-103e-1d-30e0-e195-e285-27cd-a015.ngrok-free.app';

export function useWagtailApi() {
  const loading = ref(false);
  const error = ref(null);
  
  /**
   * Obtener datos de una URL completa
   * @param {string} url - URL completa para obtener datos
   * @returns {Promise<Object>} - Datos obtenidos de la URL
   */
  const getDataFromUrl = async (url) => {
    loading.value = true;
    error.value = null;
    
    try {
      // Asegurarse de que la URL tenga el formato correcto
      const apiUrl = url.endsWith('/') ? url : `${url}/`;
      
      // Realizar la petición usando fetch nativo
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      // Verificar si la respuesta es exitosa
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status} ${response.statusText}`);
      }
      
      // Convertir la respuesta a JSON
      const data = await response.json();
      console.log('Datos obtenidos correctamente:', data);
      
      loading.value = false;
      return data;
    } catch (err) {
      console.error(`Error al obtener datos: ${err.message}`);
      error.value = `Error al obtener datos: ${err.message}`;
      loading.value = false;
      throw err;
    }
  };

  /**
   * Obtener una página por su ID
   * @param {number} id - ID de la página
   * @returns {Promise<Object>} - Datos de la página
   */
  const getPageById = async (id) => {
    loading.value = true;
    error.value = null;
    
    try {
      // Construir la URL de la API
      const apiUrl = `${API_BASE_URL}/pages/${id}/`;
      
      // Realizar la petición usando fetch nativo
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        credentials: 'omit',
        mode: 'cors',
        cache: 'no-cache'
      });
      
      // Verificar si la respuesta es exitosa
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status} ${response.statusText}`);
      }
      
      // Convertir la respuesta a JSON
      const data = await response.json();
      
      loading.value = false;
      return data;
    } catch (err) {
      console.error(`Error al obtener página con ID ${id}: ${err.message}`);
      error.value = `[GET] "${API_BASE_URL}/pages/${id}/": ${err.message}`;
      loading.value = false;
      throw err; // Propagar el error para que el componente pueda manejarlo
    }
  };

  /**
   * Obtener todas las páginas
   * @returns {Promise<Array>} - Lista de páginas
   */
  const getAllPages = async () => {
    loading.value = true;
    error.value = null;
    
    try {
      // Usar el composable useFetch de Nuxt como recomendó el encargado del proyecto
      const { data, error: fetchError } = await useFetch(`${API_BASE_URL}/pages/`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        // Opciones adicionales para mejorar la compatibilidad
        credentials: 'omit',
        mode: 'cors'
      });
      
      if (fetchError.value) {
        throw new Error(fetchError.value.message || 'Error al obtener lista de páginas');
      }
      
      if (!data.value) {
        throw new Error('No se recibieron datos');
      }
      
      // Wagtail puede devolver los resultados en un formato diferente, como items o results
      const pages = data.value.items || data.value.results || data.value;
      
      loading.value = false;
      return Array.isArray(pages) ? pages : [pages];
    } catch (err) {
      console.error(`Error al obtener páginas: ${err.message}`);
      error.value = `[GET] "${API_BASE_URL}/pages/": ${err.message}`;
      loading.value = false;
      throw err; // Propagar el error para que el componente pueda manejarlo
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
    
    try {
      console.log(`Intentando obtener bloque con ID ${blockId}`);
      
      // Construir la URL para obtener el bloque
      const url = `${API_BASE_URL}/api/v2/blocks/${blockId}/`;
      
      // Usar el composable useFetch de Nuxt como recomendó el encargado del proyecto
      const { data, error: fetchError } = await useFetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        // Opciones adicionales para mejorar la compatibilidad
        credentials: 'omit',
        mode: 'cors',
        // Configurar timeout y caché
        options: {
          timeout: 10000,
          cache: 'no-cache',
          fresh: true
        }
      });
      
      if (fetchError.value) {
        console.error('Error al obtener el bloque:', fetchError.value);
        throw new Error(fetchError.value.message || 'Error al obtener el bloque');
      }
      
      if (!data.value) {
        console.error('No se recibieron datos del bloque');
        throw new Error('No se recibieron datos del bloque');
      }
      
      console.log('Bloque obtenido correctamente:', data.value);
      return data.value;
    } catch (err) {
      console.error(`Error al obtener bloque con ID ${blockId}: ${err.message}`);
      error.value = `Error al obtener bloque: ${err.message}`;
      throw err; // Propagar el error para que el componente pueda manejarlo
    } finally {
      loading.value = false;
    }
  };

  /**
   * Obtener datos para la página Acerca De
   * @returns {Promise<Object>} - Datos para la página Acerca De
   */
  const fetchAcercaDePage = async () => {
    loading.value = true;
    error.value = null;
    
    try {
      console.log('Intentando obtener datos de la página Acerca De');
      
      // Primer intento: buscar por tipo de página
      console.log(`Buscando por tipo: ${API_BASE_URL}/pages/?type=about.AboutPage`);
      
      // Usar el composable useFetch de Nuxt como recomendó el encargado del proyecto
      const { data: typeData, error: typeError } = await useFetch(`${API_BASE_URL}/pages/?type=about.AboutPage`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        // Opciones adicionales para mejorar la compatibilidad
        credentials: 'omit',
        mode: 'cors',
        // Configurar timeout y caché
        options: {
          timeout: 10000,
          cache: 'no-cache',
          fresh: true
        }
      });
      
      // Verificar si se encontró la página por tipo
      if (!typeError.value && typeData.value) {
        // Obtener la primera página del tipo about.AboutPage
        const items = typeData.value.items || typeData.value.results || [];
        const aboutPage = items.length > 0 ? items[0] : null;
        
        if (aboutPage) {
          console.log('Página encontrada por tipo:', aboutPage);
          return procesarDatosAcercaDe(aboutPage);
        }
      }
      
      // Si no se encontró por tipo, intentar por ID
      console.log('No se encontró la página por tipo. Intentando por ID...');
      
      // Segundo intento: buscar por ID
      const pageId = 16; // ID de la página Acerca De en Wagtail
      const pageData = await getPageById(pageId);
      
      if (!pageData) {
        throw new Error('No se encontró la página ni por tipo ni por ID');
      }
      
      console.log('Página encontrada por ID:', pageData);
      return procesarDatosAcercaDe(pageData);
    } catch (err) {
      console.error(`Error al obtener datos de Acerca De: ${err.message}`);
      error.value = `Error al obtener página Acerca De: ${err.message}`;
      loading.value = false;
      throw err; // Propagar el error para que el componente pueda manejarlo
    }
  };
  
  /**
   * Función auxiliar para procesar los datos de la página Acerca De
   * @param {Object} pageData - Datos crudos de la página de Wagtail
   * @returns {Object} - Datos procesados para los componentes
   */
  const procesarDatosAcercaDe = (pageData) => {
    // Estructura base para los datos
    const acercaDe = {
      mision: {},
      misionAlt: {},
      vision: {},
      visionAlt: {},
      valores: {}
    };
    
    // Si existe la sección body, procesarla para extraer los bloques
    if (pageData.body && Array.isArray(pageData.body)) {
      // Filtrar bloques de tipo info_section o similares
      const infoBlocks = pageData.body.filter(block => 
        block.type === 'info_section' || 
        block.type === 'section' ||
        block.type === 'text_image'
      );
      
      // Mapear los bloques a las secciones correspondientes
      if (infoBlocks.length >= 1 && infoBlocks[0]) {
        acercaDe.mision = {
          titulo: infoBlocks[0].value?.title || 'MISIÓN',
          descripcion: infoBlocks[0].value?.description || '',
          imagenFondo: infoBlocks[0].value?.image?.url || '/images/landscapes/hills-light.jpg',
          posicionTexto: infoBlocks[0].value?.text_position || 'derecha',
          alineacionTexto: infoBlocks[0].value?.text_alignment || 'izquierda'
        };
      }
      
      if (infoBlocks.length >= 2 && infoBlocks[1]) {
        acercaDe.misionAlt = {
          titulo: infoBlocks[1].value?.title || 'NUESTRA MISIÓN',
          descripcion: infoBlocks[1].value?.description || '',
          imagenFondo: infoBlocks[1].value?.image?.url || '/images/landscapes/hills-dark.jpg',
          posicionTexto: infoBlocks[1].value?.text_position || 'izquierda',
          alineacionTexto: infoBlocks[1].value?.text_alignment || 'derecha'
        };
      }
      
      if (infoBlocks.length >= 3 && infoBlocks[2]) {
        acercaDe.vision = {
          titulo: infoBlocks[2].value?.title || 'VISIÓN',
          descripcion: infoBlocks[2].value?.description || '',
          imagenFondo: infoBlocks[2].value?.image?.url || '/images/landscapes/hills-light.jpg',
          posicionTexto: infoBlocks[2].value?.text_position || 'izquierda',
          alineacionTexto: infoBlocks[2].value?.text_alignment || 'izquierda'
        };
      }
      
      if (infoBlocks.length >= 4 && infoBlocks[3]) {
        acercaDe.visionAlt = {
          titulo: infoBlocks[3].value?.title || 'NUESTRA VISIÓN',
          descripcion: infoBlocks[3].value?.description || '',
          imagenFondo: infoBlocks[3].value?.image?.url || '/images/landscapes/hills-dark.jpg',
          posicionTexto: infoBlocks[3].value?.text_position || 'derecha',
          alineacionTexto: infoBlocks[3].value?.text_alignment || 'derecha'
        };
      }
      
      if (infoBlocks.length >= 5 && infoBlocks[4]) {
        acercaDe.valores = {
          titulo: infoBlocks[4].value?.title || 'VALORES',
          descripcion: infoBlocks[4].value?.description || '',
          imagenFondo: infoBlocks[4].value?.image?.url || '/images/landscapes/hills-light.jpg',
          posicionTexto: infoBlocks[4].value?.text_position || 'centro-enmarcado',
          alineacionTexto: infoBlocks[4].value?.text_alignment || 'centro'
        };
      }
    }
    
    return { acercaDe };
  };

  return {
    loading,
    error,
    getPageById,
    getAllPages,
    getBlockById,
    fetchAcercaDePage,
    getDataFromUrl
  };
}
