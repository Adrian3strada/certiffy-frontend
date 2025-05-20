// Registro de componentes disponibles para el constructor de páginas
import HeaderComponent from '../sections/HeaderComponent.vue';
import FooterComponent from '../sections/FooterComponent.vue';
import ContentComponent from '../sections/ContentComponent.vue';
import CtaComponent from '../sections/CtaComponent.vue';
import ExternalApiComponent from '../sections/ExternalApiComponent.vue';

// Componentes de bloques de Wagtail
import WagtailHeadingComponent from '../sections/wagtail/WagtailHeadingComponent.vue';
import WagtailRichTextComponent from '../sections/wagtail/WagtailRichTextComponent.vue';
import WagtailImageComponent from '../sections/wagtail/WagtailImageComponent.vue';
import WagtailVideoComponent from '../sections/wagtail/WagtailVideoComponent.vue';
import WagtailCarouselComponent from '../sections/wagtail/WagtailCarouselComponent.vue';

// Definición de componentes disponibles
export const componentTypes = {
  header: 'Encabezado',
  footer: 'Pie de página',
  content: 'Contenido',
  cta: 'Llamada a la acción',
  externalApi: 'API Externa',
  // Componentes de Wagtail
  wagtailHeading: 'Wagtail - Encabezado',
  wagtailRichText: 'Wagtail - Texto Enriquecido',
  wagtailImage: 'Wagtail - Imagen',
  wagtailVideo: 'Wagtail - Video',
  wagtailCarousel: 'Wagtail - Carrusel'
};

// Mapeo de tipos de componentes a sus componentes Vue
export const componentMap = {
  header: HeaderComponent,
  footer: FooterComponent,
  content: ContentComponent,
  cta: CtaComponent,
  externalApi: ExternalApiComponent,
  // Componentes de Wagtail
  wagtailHeading: WagtailHeadingComponent,
  wagtailRichText: WagtailRichTextComponent,
  wagtailImage: WagtailImageComponent,
  wagtailVideo: WagtailVideoComponent,
  wagtailCarousel: WagtailCarouselComponent
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
  // Configuraciones para componentes de Wagtail
  wagtailHeading: {
    level: 2,
    text: 'Título de ejemplo',
    id: 'heading-sample'
  },
  wagtailRichText: {
    content: '<p>Este es un texto de ejemplo para mostrar cómo se vería un bloque de texto enriquecido.</p>',
    id: 'richtext-sample'
  },
  wagtailImage: {
    url: 'https://via.placeholder.com/800x400',
    alt: 'Imagen de ejemplo',
    caption: 'Esta es una imagen de ejemplo',
    id: 'image-sample'
  },
  wagtailVideo: {
    url: 'https://www.youtube.com/watch?v=X6dM7OjHNsE',
    caption: 'Video de ejemplo',
    id: 'video-sample'
  },
  wagtailCarousel: {
    images: [
      { url: 'https://via.placeholder.com/800x400?text=Slide+1', alt: 'Slide 1' },
      { url: 'https://via.placeholder.com/800x400?text=Slide+2', alt: 'Slide 2' },
      { url: 'https://via.placeholder.com/800x400?text=Slide+3', alt: 'Slide 3' }
    ],
    id: 'carousel-sample'
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
