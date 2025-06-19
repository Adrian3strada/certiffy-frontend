// Servicio para interactuar con la API externa
// API_BASE_URL will be passed into methods by the calling code using runtimeConfig.

interface PageData {
  data: any;
  isError?: boolean;
  errorMessage?: string;
}

export const externalApiService = {
  // Obtener una página por ID
  async getPageById(apiBase: string, id: number): Promise<PageData> {
    try {
      // Intentar obtener datos de la API externa
      const response = await fetch(`${apiBase}/pages/${id}/`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        mode: 'cors',
      });
      
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      
      // Obtener el texto de la respuesta primero para depuración
      const responseText = await response.text();
      
      // Intentar analizar el JSON
      try {
        const data = JSON.parse(responseText);
        return { data };
      } catch (jsonError) {
        // Si hay un error al analizar el JSON, devolver un error
        return { 
          data: {}, 
          isError: true, 
          errorMessage: `Error al analizar JSON: ${(jsonError as Error).message}` 
        };
      }
    } catch (error) {
      // En caso de cualquier otro error, también devolver un error
      return { 
        data: {}, 
        isError: true, 
        errorMessage: `Error al obtener página: ${(error as Error).message}` 
      };
    }
  },
  
  // Obtener todas las páginas (si la API lo soporta)
  async getAllPages(apiBase: string): Promise<{ data: any[], isError?: boolean, errorMessage?: string }> {
    try {
      // Intentar obtener datos de la API externa
      const response = await fetch(`${apiBase}/pages/`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        mode: 'cors'
      });
      
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      
      // Obtener el texto de la respuesta primero para depuración
      const responseText = await response.text();
      
      // Intentar analizar el JSON
      try {
        const data = JSON.parse(responseText);
        return { data: data.items || data || [] };
      } catch (jsonError) {
        // Si hay un error al analizar el JSON, devolver un error
        return { 
          data: [], 
          isError: true, 
          errorMessage: `Error al analizar JSON: ${(jsonError as Error).message}` 
        };
      }
    } catch (error) {
      // En caso de cualquier otro error, también devolver un error
      return { 
        data: [], 
        isError: true, 
        errorMessage: `Error al obtener páginas: ${(error as Error).message}` 
      };
    }
  }
};
