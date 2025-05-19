import { ref, reactive, computed } from 'vue';
import { useApi } from './useApi';

export function usePageBuilder() {
  const api = useApi();
  
  // Estado del constructor
  const state = reactive({
    currentPage: null,
    currentTemplate: null,
    isDirty: false,
    isPreviewMode: false,
    layout: [],
    selectedItemId: null
  });

  // Referencia a la instancia de GridLayout
  const gridLayoutRef = ref(null);

  // Cargar una página existente
  const loadPage = async (pageId) => {
    try {
      const page = await api.getPageById(pageId);
      state.currentPage = page;
      state.layout = page.content.layout || [];
      state.isDirty = false;
      
      if (page.templateId) {
        state.currentTemplate = await api.getTemplateById(page.templateId);
      }
      
      return page;
    } catch (error) {
      console.error('Error al cargar la página:', error);
      throw error;
    }
  };

  // Crear una nueva página basada en una plantilla
  const createNewPage = async (templateId) => {
    try {
      const template = await api.getTemplateById(templateId);
      state.currentTemplate = template;
      
      // Crear una estructura básica para la nueva página
      state.currentPage = {
        title: 'Nueva Página',
        slug: 'nueva-pagina-' + Date.now(),
        templateId: templateId,
        status: 'draft',
        content: {
          layout: []
        }
      };
      
      // Inicializar el layout con secciones básicas de la plantilla
      state.layout = template.sections.map((section, index) => {
        return {
          i: `${section.type}-${index + 1}`,
          x: 0,
          y: index * 2, // Posicionar cada sección debajo de la anterior
          w: 12, // Ancho completo por defecto
          h: 2,  // Altura estándar
          type: section.type,
          content: {} // Se llenará con los valores por defecto del componente
        };
      });
      
      state.isDirty = true;
      return state.currentPage;
    } catch (error) {
      console.error('Error al crear nueva página:', error);
      throw error;
    }
  };

  // Guardar la página actual
  const savePage = async () => {
    try {
      if (!state.currentPage) {
        throw new Error('No hay página para guardar');
      }
      
      // Actualizar el contenido con el layout actual
      const pageData = {
        ...state.currentPage,
        content: {
          ...state.currentPage.content,
          layout: state.layout
        }
      };
      
      let result;
      if (state.currentPage.id) {
        // Actualizar página existente
        result = await api.updatePage(state.currentPage.id, pageData);
      } else {
        // Crear nueva página
        result = await api.createPage(pageData);
      }
      
      state.currentPage = result;
      state.isDirty = false;
      return result;
    } catch (error) {
      console.error('Error al guardar la página:', error);
      throw error;
    }
  };

  // Añadir un nuevo componente al layout
  const addComponent = async (componentId, position = { x: 0, y: 0 }) => {
    try {
      // Importar el registro de componentes
      const { getDefaultConfigForType } = await import('~/components/builder/ComponentRegistry');
      
      // Obtener la configuración predeterminada para este tipo de componente
      const defaultConfig = getDefaultConfigForType(componentId);
      
      if (!defaultConfig) {
        throw new Error('Componente no encontrado');
      }
      
      // Generar un ID único para el nuevo componente
      const uniqueId = `${componentId}-${Date.now()}`;
      
      // Crear el nuevo elemento con las propiedades por defecto del componente
      const newItem = {
        i: uniqueId,
        x: position.x,
        y: position.y,
        w: 12, // Ancho predeterminado (12 columnas)
        h: 2,  // Altura predeterminada
        type: componentId,
        content: { ...defaultConfig }
      };
      
      // Añadir al layout
      state.layout.push(newItem);
      state.selectedItemId = uniqueId;
      state.isDirty = true;
      
      return newItem;
    } catch (error) {
      console.error('Error al añadir componente:', error);
      throw error;
    }
  };

  // Eliminar un componente del layout
  const removeComponent = (itemId) => {
    const index = state.layout.findIndex(item => item.i === itemId);
    if (index !== -1) {
      state.layout.splice(index, 1);
      if (state.selectedItemId === itemId) {
        state.selectedItemId = null;
      }
      state.isDirty = true;
    }
  };

  // Actualizar el contenido de un componente
  const updateComponentContent = (itemId, newContent) => {
    const item = state.layout.find(item => item.i === itemId);
    if (item) {
      item.content = { ...item.content, ...newContent };
      state.isDirty = true;
    }
  };

  // Seleccionar un componente para editar
  const selectComponent = (itemId) => {
    state.selectedItemId = itemId;
  };

  // Obtener el componente seleccionado actualmente
  const selectedComponent = computed(() => {
    if (!state.selectedItemId) return null;
    return state.layout.find(item => item.i === state.selectedItemId);
  });

  // Manejar cambios en el layout (cuando el usuario mueve o redimensiona componentes)
  const onLayoutChange = (newLayout) => {
    // Actualizar solo las propiedades de posición y tamaño
    newLayout.forEach(newItem => {
      const existingItem = state.layout.find(item => item.i === newItem.i);
      if (existingItem) {
        existingItem.x = newItem.x;
        existingItem.y = newItem.y;
        existingItem.w = newItem.w;
        existingItem.h = newItem.h;
      }
    });
    
    state.isDirty = true;
  };

  // Cambiar entre modo edición y modo vista previa
  const togglePreviewMode = () => {
    state.isPreviewMode = !state.isPreviewMode;
    if (state.isPreviewMode) {
      state.selectedItemId = null;
    }
  };

  return {
    state,
    gridLayoutRef,
    loadPage,
    createNewPage,
    savePage,
    addComponent,
    removeComponent,
    updateComponentContent,
    selectComponent,
    selectedComponent,
    onLayoutChange,
    togglePreviewMode
  };
}
