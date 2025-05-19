// Datos simulados para la API REST
export const pageTemplates = [
  {
    id: 1,
    name: 'Plantilla Básica',
    description: 'Una plantilla básica con encabezado, contenido y pie de página',
    thumbnail: '/templates/basic.jpg',
    sections: [
      { type: 'header', name: 'Encabezado', editable: true },
      { type: 'content', name: 'Contenido Principal', editable: true },
      { type: 'footer', name: 'Pie de Página', editable: true }
    ]
  },
  {
    id: 2,
    name: 'Plantilla de Marketing',
    description: 'Ideal para campañas de marketing con secciones para CTA',
    thumbnail: '/templates/marketing.jpg',
    sections: [
      { type: 'header', name: 'Encabezado', editable: true },
      { type: 'hero', name: 'Banner Principal', editable: true },
      { type: 'features', name: 'Características', editable: true },
      { type: 'testimonials', name: 'Testimonios', editable: true },
      { type: 'cta', name: 'Llamada a la Acción', editable: true },
      { type: 'footer', name: 'Pie de Página', editable: true }
    ]
  },
  {
    id: 3,
    name: 'Plantilla de Producto',
    description: 'Diseñada para mostrar productos con galerías y especificaciones',
    thumbnail: '/templates/product.jpg',
    sections: [
      { type: 'header', name: 'Encabezado', editable: true },
      { type: 'product-hero', name: 'Producto Principal', editable: true },
      { type: 'product-gallery', name: 'Galería de Imágenes', editable: true },
      { type: 'product-specs', name: 'Especificaciones', editable: true },
      { type: 'related-products', name: 'Productos Relacionados', editable: true },
      { type: 'footer', name: 'Pie de Página', editable: true }
    ]
  }
];

export const pages = [
  {
    id: 1,
    title: 'Página de Inicio',
    slug: 'home',
    templateId: 1,
    status: 'published',
    isHomePage: true,
    createdAt: '2025-05-01T10:00:00Z',
    updatedAt: '2025-05-15T14:30:00Z',
    content: {
      layout: [
        {
          i: 'header-1',
          x: 0,
          y: 0,
          w: 12,
          h: 2,
          type: 'header',
          content: {
            title: 'Mi Sitio Web',
            subtitle: 'Bienvenido a mi página web',
            logo: '/images/logo.png',
            menuItems: [
              { text: 'Inicio', url: '/' },
              { text: 'Acerca de', url: '/about' },
              { text: 'Contacto', url: '/contact' }
            ]
          }
        },
        {
          i: 'content-1',
          x: 0,
          y: 2,
          w: 12,
          h: 4,
          type: 'content',
          content: {
            title: 'Contenido Principal',
            text: '<p>Este es el contenido principal de la página. Aquí puedes escribir todo lo que quieras mostrar a tus visitantes.</p>',
            image: '/images/main.jpg',
            imagePosition: 'right'
          }
        },
        {
          i: 'footer-1',
          x: 0,
          y: 6,
          w: 12,
          h: 2,
          type: 'footer',
          content: {
            copyright: '© 2025 Mi Sitio Web',
            links: [
              { text: 'Política de Privacidad', url: '/privacy' },
              { text: 'Términos y Condiciones', url: '/terms' }
            ],
            socialMedia: [
              { icon: 'mdi-facebook', url: 'https://facebook.com' },
              { icon: 'mdi-twitter', url: 'https://twitter.com' },
              { icon: 'mdi-instagram', url: 'https://instagram.com' }
            ]
          }
        }
      ]
    }
  },
  {
    id: 2,
    title: 'Página de Contacto',
    slug: 'contact',
    templateId: 1,
    status: 'draft',
    isHomePage: false,
    createdAt: '2025-05-10T09:15:00Z',
    updatedAt: '2025-05-16T11:20:00Z',
    content: {
      layout: [
        {
          i: 'header-1',
          x: 0,
          y: 0,
          w: 12,
          h: 2,
          type: 'header',
          content: {
            title: 'Mi Sitio Web',
            subtitle: 'Contáctanos',
            logo: '/images/logo.png',
            menuItems: [
              { text: 'Inicio', url: '/' },
              { text: 'Acerca de', url: '/about' },
              { text: 'Contacto', url: '/contact' }
            ]
          }
        },
        {
          i: 'content-1',
          x: 0,
          y: 2,
          w: 6,
          h: 4,
          type: 'content',
          content: {
            title: 'Información de Contacto',
            text: '<p>Puedes contactarnos a través de los siguientes medios:</p><ul><li>Email: info@misitio.com</li><li>Teléfono: +123 456 7890</li><li>Dirección: Calle Principal 123, Ciudad</li></ul>',
            image: null,
            imagePosition: null
          }
        },
        {
          i: 'content-2',
          x: 6,
          y: 2,
          w: 6,
          h: 4,
          type: 'form',
          content: {
            title: 'Formulario de Contacto',
            fields: [
              { type: 'text', name: 'name', label: 'Nombre', required: true },
              { type: 'email', name: 'email', label: 'Email', required: true },
              { type: 'textarea', name: 'message', label: 'Mensaje', required: true }
            ],
            submitText: 'Enviar'
          }
        },
        {
          i: 'footer-1',
          x: 0,
          y: 6,
          w: 12,
          h: 2,
          type: 'footer',
          content: {
            copyright: '© 2025 Mi Sitio Web',
            links: [
              { text: 'Política de Privacidad', url: '/privacy' },
              { text: 'Términos y Condiciones', url: '/terms' }
            ],
            socialMedia: [
              { icon: 'mdi-facebook', url: 'https://facebook.com' },
              { icon: 'mdi-twitter', url: 'https://twitter.com' },
              { icon: 'mdi-instagram', url: 'https://instagram.com' }
            ]
          }
        }
      ]
    }
  }
];

export const components = [
  {
    id: 'header',
    name: 'Encabezado',
    icon: 'mdi-view-headline',
    defaultProps: {
      title: 'Título del Sitio',
      subtitle: 'Subtítulo del sitio',
      logo: null,
      menuItems: []
    },
    defaultSize: { w: 12, h: 2 }
  },
  {
    id: 'hero',
    name: 'Banner Principal',
    icon: 'mdi-image',
    defaultProps: {
      title: 'Título Principal',
      subtitle: 'Subtítulo del banner',
      backgroundImage: null,
      buttonText: 'Saber más',
      buttonUrl: '#'
    },
    defaultSize: { w: 12, h: 4 }
  },
  {
    id: 'content',
    name: 'Bloque de Contenido',
    icon: 'mdi-text-box',
    defaultProps: {
      title: 'Título del Contenido',
      text: '<p>Contenido de ejemplo</p>',
      image: null,
      imagePosition: 'right'
    },
    defaultSize: { w: 6, h: 4 }
  },
  {
    id: 'gallery',
    name: 'Galería de Imágenes',
    icon: 'mdi-image-multiple',
    defaultProps: {
      title: 'Galería',
      images: []
    },
    defaultSize: { w: 12, h: 6 }
  },
  {
    id: 'features',
    name: 'Características',
    icon: 'mdi-star',
    defaultProps: {
      title: 'Nuestras Características',
      items: [
        { title: 'Característica 1', description: 'Descripción 1', icon: 'mdi-check' },
        { title: 'Característica 2', description: 'Descripción 2', icon: 'mdi-check' }
      ]
    },
    defaultSize: { w: 12, h: 4 }
  },
  {
    id: 'testimonials',
    name: 'Testimonios',
    icon: 'mdi-account-voice',
    defaultProps: {
      title: 'Lo que dicen nuestros clientes',
      items: [
        { name: 'Cliente 1', position: 'CEO', text: 'Testimonio 1', avatar: null },
        { name: 'Cliente 2', position: 'Director', text: 'Testimonio 2', avatar: null }
      ]
    },
    defaultSize: { w: 12, h: 4 }
  },
  {
    id: 'cta',
    name: 'Llamada a la Acción',
    icon: 'mdi-bullhorn',
    defaultProps: {
      title: 'Actúa Ahora',
      text: 'No esperes más para comenzar',
      buttonText: 'Comenzar',
      buttonUrl: '#',
      backgroundColor: '#f5f5f5'
    },
    defaultSize: { w: 12, h: 3 }
  },
  {
    id: 'form',
    name: 'Formulario',
    icon: 'mdi-form-select',
    defaultProps: {
      title: 'Formulario',
      fields: [
        { type: 'text', name: 'name', label: 'Nombre', required: true },
        { type: 'email', name: 'email', label: 'Email', required: true }
      ],
      submitText: 'Enviar'
    },
    defaultSize: { w: 6, h: 4 }
  },
  {
    id: 'footer',
    name: 'Pie de Página',
    icon: 'mdi-dock-bottom',
    defaultProps: {
      copyright: '© 2025 Mi Sitio Web',
      links: [],
      socialMedia: []
    },
    defaultSize: { w: 12, h: 2 }
  }
];

export const users = [
  {
    id: 1,
    name: 'Admin Usuario',
    email: 'admin@example.com',
    role: 'admin',
    lastLogin: '2025-05-18T10:30:00Z'
  },
  {
    id: 2,
    name: 'Marketing Usuario',
    email: 'marketing@example.com',
    role: 'editor',
    lastLogin: '2025-05-17T14:45:00Z'
  }
];
