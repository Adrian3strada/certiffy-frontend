// Servicio para interactuar con la API externa
const API_BASE_URL = 'https://99ce-2806-266-480-8244-9437-a02c-cbc8-6484.ngrok-free.app/api/v2';

// Crear una versión de respaldo con los datos de ejemplo que proporcionaste
const MOCK_DATA = {
  "id": 15,
  "meta": {
    "type": "home.HomePage",
    "detail_url": "https://99ce-2806-266-480-8244-9437-a02c-cbc8-6484.ngrok-free.app/api/v2/pages/15/",
    "html_url": "http://127.0.0.1/",
    "slug": "homepage",
    "show_in_menus": false,
    "seo_title": "",
    "search_description": "",
    "first_published_at": "2025-05-16T19:59:35.798033Z",
    "alias_of": null,
    "parent": null
  },
  "title": "HOMEPAGE",
  "intro_text": "<p data-block-key=\"1vuf4\">CERTIFFY</p><hr/><p data-block-key=\"cd7hf\"></p><p data-block-key=\"ejvg2\"></p><p data-block-key=\"bpzcz\"></p><p data-block-key=\"cor2f\"></p>",
  "video_url": "https://www.youtube.com/watch?v=X6dM7OjHNsE",
  "carousel_images": [
    {
      "type": "image",
      "value": 1,
      "id": "cea1b6f6-d630-428a-95b1-b380b9bcff0c"
    },
    {
      "type": "image",
      "value": 2,
      "id": "d4d701bf-2bdc-43e9-9d44-d5f4b0e5fe4f"
    },
    {
      "type": "image",
      "value": 3,
      "id": "483251f4-d522-4905-8575-edf765784cc8"
    }
  ]
};

export const externalApiService = {
  // Obtener una página por ID
  async getPageById(id) {
    try {
      console.log(`Intentando obtener página con ID ${id} de ${API_BASE_URL}/pages/${id}/`);
      
      try {
        // Intentar obtener datos de la API externa
        const response = await fetch(`${API_BASE_URL}/pages/${id}/`, {
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
  async getAllPages() {
    try {
      console.log(`Intentando obtener todas las páginas de ${API_BASE_URL}/pages/`);
      
      try {
        // Intentar obtener datos de la API externa
        const response = await fetch(`${API_BASE_URL}/pages/`, {
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
