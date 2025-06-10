// Servicio para interactuar con la API externa
// API_BASE_URL will be passed into methods by the calling code using runtimeConfig.

export const externalApiService = {
  // Obtener una página por ID
  async getPageById(apiBase, id) {
    try {
      console.log(`Intentando obtener página con ID ${id} de ${apiBase}/pages/${id}/`);
      
      try {
        // Intentar obtener datos de la API externa
        const response = await fetch(`${apiBase}/pages/${id}/`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          mode: 'cors',
          // Aumentar el tiempo de espera
          timeout: 10000
        });
        
        console.log('Respuesta de la API:', response);
        
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }
        
        // Obtener el texto de la respuesta primero para depuración
        const responseText = await response.text();
        console.log('Texto de respuesta:', responseText.substring(0, 200) + '...');
        
        // Intentar analizar el JSON
        let data;
        try {
          data = JSON.parse(responseText);
          console.log('Datos analizados correctamente:', data);
          return { data, isMockData: false };
        } catch (jsonError) {
          console.error('Error al analizar JSON:', jsonError);
          console.warn('Usando datos de respaldo debido a un error de análisis JSON');
          // Si hay un error al analizar el JSON, usar los datos de respaldo
          return { data: MOCK_DATA, isMockData: true };
        }
      } catch (fetchError) {
        console.error('Error al realizar la solicitud fetch:', fetchError);
        console.warn('Usando datos de respaldo debido a un error de conexión');
        // Si hay un error de conexión, usar los datos de respaldo
        return { data: MOCK_DATA, isMockData: true };
      }
    } catch (error) {
      console.error('Error general al obtener datos de la API externa:', error);
      // En caso de cualquier otro error, también usar los datos de respaldo
      return { data: MOCK_DATA, isMockData: true };
    }
  },
  
  // Obtener todas las páginas (si la API lo soporta)
  async getAllPages(apiBase) {
    try {
      console.log(`Intentando obtener todas las páginas de ${apiBase}/pages/`);
      
      try {
        // Intentar obtener datos de la API externa
        const response = await fetch(`${apiBase}/pages/`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          mode: 'cors',
          timeout: 10000
        });
        
        console.log('Respuesta de la API (getAllPages):', response);
        
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }
        
        // Obtener el texto de la respuesta primero para depuración
        const responseText = await response.text();
        console.log('Texto de respuesta (getAllPages):', responseText.substring(0, 200) + '...');
        
        // Intentar analizar el JSON
        let data;
        try {
          data = JSON.parse(responseText);
          console.log('Datos analizados correctamente (getAllPages):', data);
          return { data };
        } catch (jsonError) {
          console.error('Error al analizar JSON (getAllPages):', jsonError);
          console.warn('Usando datos de respaldo debido a un error de análisis JSON');
          // Si hay un error al analizar el JSON, usar los datos de respaldo
          return { data: [MOCK_DATA] };
        }
      } catch (fetchError) {
        console.error('Error al realizar la solicitud fetch (getAllPages):', fetchError);
        console.warn('Usando datos de respaldo debido a un error de conexión');
        // Si hay un error de conexión, usar los datos de respaldo
        return { data: [MOCK_DATA] };
      }
    } catch (error) {
      console.error('Error general al obtener todas las páginas de la API externa:', error);
      // En caso de cualquier otro error, también usar los datos de respaldo
      return { data: [MOCK_DATA] };
    }
  }
};
