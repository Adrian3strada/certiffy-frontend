// Registro de componentes disponibles para el constructor de páginas
import HeaderComponent from '../sections/HeaderComponent.vue';
import FooterComponent from '../sections/FooterComponent.vue';
import ContentComponent from '../sections/ContentComponent.vue';
import CtaComponent from '../sections/CtaComponent.vue';
import ExternalApiComponent from '../sections/ExternalApiComponent.vue';
import WagtailBlockComponent from '../sections/WagtailBlockComponent.vue';

// Definición de componentes disponibles
export const componentTypes = {
  header: 'Encabezado',
  footer: 'Pie de página',
  content: 'Contenido',
  cta: 'Llamada a la acción',
  externalApi: 'API Externa',
  wagtailBlock: 'Bloque de Wagtail'
};

// Mapeo de tipos de componentes a sus componentes Vue
export const componentMap = {
  header: HeaderComponent,
  footer: FooterComponent,
  content: ContentComponent,
  cta: CtaComponent,
  externalApi: ExternalApiComponent,
  wagtailBlock: WagtailBlockComponent
};

// Configuración predeterminada para cada tipo de componente
export const defaultComponentConfig = {
  header: {
    title: 'Nuevo Encabezado',
    subtitle: 'Subtítulo del encabezado',
    bgColor: '#f5f5f5',
    textColor: '#333333'
  },
  footer: {
    copyright: '© 2025 Mi Empresa',
    links: [
      { text: 'Inicio', url: '/' },
      { text: 'Acerca de', url: '/about' },
      { text: 'Contacto', url: '/contact' }
    ],
    bgColor: '#333333',
    textColor: '#ffffff'
  },
  content: {
    title: 'Título de contenido',
    body: '<p>Este es un bloque de contenido. Puedes editarlo para añadir tu propio texto.</p>',
    image: '',
    layout: 'text-image'
  },
  cta: {
    title: 'Llamada a la acción',
    description: 'Descripción de la llamada a la acción',
    buttonText: 'Haz clic aquí',
    buttonUrl: '#',
    bgColor: '#4caf50',
    textColor: '#ffffff'
  },
  externalApi: {
    pageId: 15,
    showTitle: true,
    showIntro: true,
    showVideo: true,
    showCarousel: true
  },
  wagtailBlock: {
    blockType: 'richtext',
    blockId: 'sample-block',
    apiUrl: null,
    mockData: null
  }
};

// Obtener la lista de componentes disponibles para mostrar en el selector
export const getAvailableComponents = () => {
  return Object.keys(componentTypes).map(key => ({
    id: key,
    name: componentTypes[key],
    config: defaultComponentConfig[key]
  }));
};

// Obtener un componente por su tipo
export const getComponentByType = (type) => {
  return componentMap[type] || null;
};

// Obtener la configuración predeterminada para un tipo de componente
export const getDefaultConfigForType = (type) => {
  return defaultComponentConfig[type] || {};
};
