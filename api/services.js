// Servicios para interactuar con la API
import { pageTemplates as defaultTemplates, pages as defaultPages, components as defaultComponents, users as defaultUsers } from './mock/data';

// Simulación de retardo para simular una API real
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Inicializar datos desde localStorage o usar los valores por defecto
let pageTemplates = [];
let pages = [];
let components = [];
let users = [];

// Función para cargar datos desde localStorage
const loadDataFromStorage = () => {
  try {
    // Cargar plantillas
    const storedTemplates = localStorage.getItem('pageTemplates');
    pageTemplates = storedTemplates ? JSON.parse(storedTemplates) : defaultTemplates;
    
    // Cargar páginas
    const storedPages = localStorage.getItem('pages');
    pages = storedPages ? JSON.parse(storedPages) : defaultPages;
    
    // Cargar componentes
    const storedComponents = localStorage.getItem('components');
    components = storedComponents ? JSON.parse(storedComponents) : defaultComponents;
    
    // Cargar usuarios
    const storedUsers = localStorage.getItem('users');
    users = storedUsers ? JSON.parse(storedUsers) : defaultUsers;
    
    console.log('Datos cargados desde localStorage');
  } catch (error) {
    console.error('Error al cargar datos desde localStorage:', error);
    // Si hay un error, usar los datos por defecto
    pageTemplates = [...defaultTemplates];
    pages = [...defaultPages];
    components = [...defaultComponents];
    users = [...defaultUsers];
  }
};

// Función para guardar datos en localStorage
const saveDataToStorage = () => {
  try {
    localStorage.setItem('pageTemplates', JSON.stringify(pageTemplates));
    localStorage.setItem('pages', JSON.stringify(pages));
    localStorage.setItem('components', JSON.stringify(components));
    localStorage.setItem('users', JSON.stringify(users));
    console.log('Datos guardados en localStorage');
  } catch (error) {
    console.error('Error al guardar datos en localStorage:', error);
  }
};

// Cargar datos al iniciar
loadDataFromStorage();

export const apiService = {
  // Obtener todas las plantillas
  async getTemplates() {
    await delay(300);
    return { data: pageTemplates };
  },

  // Obtener una plantilla por ID
  async getTemplateById(id) {
    await delay(200);
    const template = pageTemplates.find(t => t.id === parseInt(id));
    if (!template) {
      throw new Error('Plantilla no encontrada');
    }
    return { data: template };
  },

  // Obtener todas las páginas
  async getPages() {
    await delay(300);
    return { data: pages };
  },

  // Obtener una página por ID
  async getPageById(id) {
    await delay(200);
    const page = pages.find(p => p.id === parseInt(id));
    if (!page) {
      throw new Error('Página no encontrada');
    }
    return { data: page };
  },

  // Obtener una página por slug
  async getPageBySlug(slug) {
    await delay(200);
    const page = pages.find(p => p.slug === slug);
    if (!page) {
      throw new Error('Página no encontrada');
    }
    return { data: page };
  },

  // Crear una nueva página
  async createPage(pageData) {
    await delay(500);
    const newPage = {
      id: pages.length > 0 ? Math.max(...pages.map(p => p.id)) + 1 : 1,
      ...pageData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Asegurarse de que el campo isHomePage esté definido
    if (newPage.isHomePage === undefined) {
      newPage.isHomePage = false;
    }
    
    pages.push(newPage);
    
    // Guardar en localStorage
    saveDataToStorage();
    
    return { data: newPage };
  },

  // Actualizar una página existente
  async updatePage(id, pageData) {
    await delay(500);
    const pageIndex = pages.findIndex(p => p.id === parseInt(id));
    if (pageIndex === -1) {
      throw new Error('Página no encontrada');
    }
    
    // Si estamos estableciendo esta página como página de inicio,
    // asegurarnos de que ninguna otra página esté marcada como tal
    if (pageData.isHomePage === true) {
      // Primero, quitar la marca de página de inicio de todas las páginas
      for (let i = 0; i < pages.length; i++) {
        if (pages[i].id !== parseInt(id) && pages[i].isHomePage === true) {
          pages[i].isHomePage = false;
          console.log(`Quitando marca de página de inicio de ${pages[i].title}`);
        }
      }
    }
    
    const updatedPage = {
      ...pages[pageIndex],
      ...pageData,
      updatedAt: new Date().toISOString()
    };
    
    // Asegurarse de que el campo isHomePage esté definido
    if (updatedPage.isHomePage === undefined) {
      updatedPage.isHomePage = pages[pageIndex].isHomePage || false;
    }
    
    console.log(`Actualizando página ${updatedPage.title}, isHomePage: ${updatedPage.isHomePage}`);
    
    pages[pageIndex] = updatedPage;
    
    // Guardar en localStorage
    saveDataToStorage();
    
    return { data: updatedPage };
  },

  // Eliminar una página
  async deletePage(id) {
    await delay(400);
    const pageIndex = pages.findIndex(p => p.id === parseInt(id));
    if (pageIndex === -1) {
      throw new Error('Página no encontrada');
    }
    
    // Verificar si es la página de inicio
    if (pages[pageIndex].isHomePage) {
      console.log('Eliminando la página de inicio');
    }
    
    pages.splice(pageIndex, 1);
    
    // Guardar en localStorage
    saveDataToStorage();
    
    return { success: true };
  },

  // Obtener todos los componentes disponibles
  async getComponents() {
    await delay(200);
    return { data: components };
  },

  // Obtener un componente por ID
  async getComponentById(id) {
    await delay(100);
    const component = components.find(c => c.id === id);
    if (!component) {
      throw new Error('Componente no encontrado');
    }
    return { data: component };
  },

  // Autenticación de usuario (simulada)
  async login(email, password) {
    await delay(800);
    const user = users.find(u => u.email === email);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }
    // En una aplicación real, aquí verificaríamos la contraseña
    return { 
      data: {
        user,
        token: 'fake-jwt-token-' + Math.random().toString(36).substring(2)
      }
    };
  },

  // Obtener usuario actual (simulado)
  async getCurrentUser() {
    await delay(200);
    // Simular que estamos usando el primer usuario como el actual
    return { data: users[0] };
  },
  
  // Obtener la página de inicio
  async getHomePage() {
    await delay(200);
    const homePage = pages.find(p => p.isHomePage === true);
    if (!homePage) {
      return { data: null };
    }
    return { data: homePage };
  }
};
