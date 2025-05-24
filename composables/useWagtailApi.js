import { ref } from 'vue';
import { useFetch } from '#app';

// URL base de la API de Wagtail
const API_BASE_URL = 'https://693d-2806-103e-1d-30e0-88bf-2d33-4e9f-2e8e.ngrok-free.app';

export function useWagtailApi() {
  const loading = ref(false);
  const error = ref(null);
  const isMockData = ref(false);
  
  /**
   * Obtener datos de una URL completa usando useFetch
   * @param {string} url - URL completa para obtener datos
   * @returns {Promise<Object>} - Datos obtenidos de la URL
   */
  const getDataFromUrl = async (url) => {
    loading.value = true;
    error.value = null;
    isMockData.value = false;
    
    try {
      console.log(`Intentando obtener datos de ${url} con useFetch`);
      
      // Usar useFetch con configuración específica para ngrok
      const { data, error: fetchError } = await useFetch(url, {
        method: 'GET',
        // Usar el modo 'no-cors' para evitar problemas con CORS
        mode: 'cors',
        // No enviar credenciales
        credentials: 'omit',
        // Headers específicos para solicitar JSON
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        },
        // Opciones adicionales
        options: {
          // Aumentar el timeout
          timeout: 30000,
          // Evitar caché
          cache: 'no-cache',
          // Forzar recarga
          fresh: true
        }
      });
      
      // Verificar si hay errores en la petición
      if (fetchError.value) {
        console.error('Error al obtener datos de la API:', fetchError.value);
        throw new Error(fetchError.value.message || 'Error al obtener datos');
      }
      
      // Verificar si se recibieron datos
      if (!data.value) {
        console.error('No se recibieron datos de la API');
        throw new Error('No se recibieron datos de la API');
      }
      
      // Verificar si los datos son una cadena (posiblemente HTML)
      if (typeof data.value === 'string') {
        // Intentar parsear como JSON
        try {
          const jsonData = JSON.parse(data.value);
          console.log('Datos obtenidos correctamente de la API (parseados de string):', jsonData);
          return jsonData;
        } catch (parseError) {
          // Verificar si es HTML
          if (data.value.includes('<!DOCTYPE html>')) {
            console.error('La API ha devuelto HTML en lugar de JSON');
            throw new Error('La API ha devuelto HTML en lugar de JSON');
          }
          console.error('Error al parsear la respuesta como JSON:', parseError);
          throw new Error('Error al parsear la respuesta como JSON');
        }
      }
      
      console.log('Datos obtenidos correctamente de la API:', data.value);
      return data.value;
    } catch (err) {
      console.error(`Error al obtener datos de la API: ${err.message}`);
      error.value = `Error al obtener datos: ${err.message}`;
      throw err; // Propagar el error para que el componente pueda manejarlo
    } finally {
      loading.value = false;
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
    isMockData.value = false;
    
    try {
      console.log(`Intentando obtener página con ID ${id} de ${API_BASE_URL}/pages/${id}/`);
      
      // Intentar obtener datos de la API con un timeout para evitar esperas largas
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 segundos de timeout
      
      try {
        const { data, error: fetchError } = await useFetch(`${API_BASE_URL}/pages/${id}/`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (fetchError.value) {
          console.warn('Error al obtener datos de la API, usando datos de respaldo:', fetchError.value);
          throw new Error(fetchError.value.message || 'Error al obtener datos');
        }
        
        if (!data.value) {
          console.warn('No se recibieron datos de la API, usando datos de respaldo');
          throw new Error('No se recibieron datos');
        }
        
        console.log('Datos obtenidos correctamente de la API:', data.value);
        return data.value;
      } catch (fetchErr) {
        clearTimeout(timeoutId);
        throw fetchErr;
      }
    } catch (err) {
      console.warn(`Usando datos de respaldo debido a: ${err.message}`);
      error.value = `[GET] "${API_BASE_URL}/pages/${id}/": ${err.message}`;
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
      console.log(`Intentando obtener todas las páginas de ${API_BASE_URL}/pages/`);
      
      // Intentar obtener datos de la API con un timeout para evitar esperas largas
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 segundos de timeout
      
      try {
        const { data, error: fetchError } = await useFetch(`${API_BASE_URL}/pages/`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (fetchError.value) {
          console.warn('Error al obtener lista de páginas, usando datos de respaldo:', fetchError.value);
          throw new Error(fetchError.value.message || 'Error al obtener lista de páginas');
        }
        
        if (!data.value) {
          console.warn('No se recibieron datos de la API, usando datos de respaldo');
          throw new Error('No se recibieron datos');
        }
        
        // Wagtail puede devolver los resultados en un formato diferente, como items o results
        const pages = data.value.items || data.value.results || data.value;
        console.log('Páginas obtenidas correctamente de la API:', pages);
        return Array.isArray(pages) ? pages : [pages];
      } catch (fetchErr) {
        clearTimeout(timeoutId);
        throw fetchErr;
      }
    } catch (err) {
      console.warn(`Usando datos de respaldo debido a: ${err.message}`);
      error.value = `[GET] "${API_BASE_URL}/pages/": ${err.message}`;
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
      console.log(`Intentando obtener bloque con ID ${blockId}`);
      
      // Extraer el tipo de bloque del ID
      const blockType = blockId.split('-')[0] || 'richtext';
  // Por ahora, simplemente usamos datos de respaldo
      console.warn('API de bloques no implementada o no disponible, usando datos de respaldo');
      isMockData.value = true;
      
      await new Promise(resolve => setTimeout(resolve, 300));
      
      return getMockBlockData(blockType, blockId);
    } catch (err) {
      console.warn(`Usando datos de respaldo debido a: ${err.message}`);
      error.value = `Error al obtener bloque: ${err.message}`;
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

  /**
   * Obtener datos para la página Acerca De
   * @returns {Promise<Object>} - Datos para la página Acerca De
   */
  const fetchAcercaDePage = async () => {
    loading.value = true;
    error.value = null;
    isMockData.value = false;
    
    try {
      console.log('Intentando obtener datos de la página Acerca De');
      
      // Primer intento: buscar por tipo de página
      try {
        console.log(`Buscando por tipo: ${API_BASE_URL}/pages/?type=about.AboutPage`);
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        const { data, error: fetchError } = await useFetch(`${API_BASE_URL}/pages/?type=about.AboutPage`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (fetchError.value) {
          throw new Error(fetchError.value.message || 'Error al buscar por tipo');
        }
        
        if (!data.value) {
          throw new Error('No se recibieron datos');
        }
        
        // Obtener la primera página del tipo about.AboutPage
        const items = data.value.items || data.value.results || [];
        const aboutPage = items.length > 0 ? items[0] : null;
        
        if (!aboutPage) {
          throw new Error('Página no encontrada por tipo');
        }
        
        console.log('Página encontrada por tipo:', aboutPage);
        
        // Procesar los datos obtenidos
        return procesarDatosAcercaDe(aboutPage);
      } catch (errorTipo) {
        console.warn(`No se encontró la página por tipo: ${errorTipo.message}. Intentando por ID...`);
        
        // Segundo intento: buscar por ID
        const pageId = 16; // ID de la página Acerca De en Wagtail
        const pageData = await getPageById(pageId);
        
        if (!pageData) {
          throw new Error('No se encontró la página ni por tipo ni por ID');
        }
        
        console.log('Página encontrada por ID:', pageData);
        
        // Procesar los datos obtenidos
        return procesarDatosAcercaDe(pageData);
      }
    } catch (err) {
      console.warn(`Error al obtener datos de Acerca De: ${err.message}. Usando datos de respaldo.`);
      error.value = `Error al obtener página Acerca De: ${err.message}`;
      isMockData.value = true;
      
      // Usando datos de respaldo en formato acercaDe
      return {
        acercaDe: {
          mision: {
            titulo: "MISIÓN",
            descripcion: "Proporcionar herramientas tecnológicas innovadoras que simplifiquen y optimicen los procesos de certificación en la cadena de suministro agroalimentaria, garantizando transparencia, trazabilidad y sostenibilidad en cada etapa del proceso.",
            imagenFondo: "/images/landscapes/hills-light.jpg",
            posicionTexto: "derecha",
            alineacionTexto: "izquierda"
          },
          vision: {
            titulo: "VISIÓN",
            descripcion: "Ser reconocidos globalmente como la plataforma líder en soluciones de certificación para el sector agroalimentario, facilitando el cumplimiento normativo internacional y promoviendo prácticas sostenibles que beneficien a productores, consumidores y al planeta.",
            imagenFondo: "/images/landscapes/hills-light.jpg",
            posicionTexto: "izquierda",
            alineacionTexto: "izquierda"
          },
          valores: {
            titulo: "VALORES",
            descripcion: "Integridad, Innovación, Sostenibilidad, Transparencia y Compromiso con la excelencia. Estos principios guían nuestras acciones y decisiones, mientras trabajamos para transformar positivamente la industria agroalimentaria.",
            imagenFondo: "/images/landscapes/hills-light.jpg",
            posicionTexto: "centro-enmarcado",
            alineacionTexto: "centro"
          },
          misionAlt: {
            titulo: "NUESTRA MISIÓN",
            descripcion: "Proporcionar herramientas tecnológicas innovadoras que simplifiquen y optimicen los procesos de certificación en la cadena de suministro agroalimentaria, garantizando transparencia, trazabilidad y sostenibilidad en cada etapa del proceso.",
            imagenFondo: "/images/landscapes/hills-dark.jpg",
            posicionTexto: "izquierda",
            alineacionTexto: "derecha"
          },
          visionAlt: {
            titulo: "NUESTRA VISIÓN",
            descripcion: "Ser reconocidos globalmente como la plataforma líder en soluciones de certificación para el sector agroalimentario, facilitando el cumplimiento normativo internacional y promoviendo prácticas sostenibles que beneficien a productores, consumidores y al planeta.",
            imagenFondo: "/images/landscapes/hills-dark.jpg",
            posicionTexto: "derecha",
            alineacionTexto: "derecha"
          }
        }
      };
    } finally {
      loading.value = false;
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
    isMockData,
    getPageById,
    getAllPages,
    getBlockById,
    fetchAcercaDePage,
    getDataFromUrl
  };
}
