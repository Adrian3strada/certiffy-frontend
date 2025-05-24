export const mockData = {
  // Datos para la sección "Acerca de"
  acercaDe: [
    // Componente 1: Misión - texto a la derecha
    {
      titulo: "MISIÓN",
      descripcion: "Proporcionar herramientas tecnológicas innovadoras que simplifiquen y optimicen los procesos de certificación en la cadena de suministro agroalimentaria, garantizando transparencia, trazabilidad y sostenibilidad en cada etapa del proceso.",
      imagenFondo: "https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?q=80&w=1200&auto=format&fit=crop",
      posicionTexto: "centro-enmarcado",
      alineacionTexto: "derecha",
      colorOverlay: "rgba(25, 32, 71, 0.8)",
      colorSeparador: "amber-6",
      anchoTexto: "100%",
      altura: "280px"
    },
    
    // Componente 2: Misión - texto a la izquierda
    {
      titulo: "MISIÓN",
      descripcion: "Proporcionar herramientas tecnológicas innovadoras que simplifiquen y optimicen los procesos de certificación en la cadena de suministro agroalimentaria, garantizando transparencia, trazabilidad y sostenibilidad en cada etapa del proceso.",
      imagenFondo: "https://images.unsplash.com/photo-1471193945509-9ad0617afabf?q=80&w=1200&auto=format&fit=crop",
      posicionTexto: "centro-enmarcado",
      alineacionTexto: "izquierda",
      colorOverlay: "rgba(0, 0, 0, 0.7)",
      colorSeparador: "amber-6",
      anchoTexto: "100%",
      altura: "280px"
    },
    // Componente 3: Visión - texto a la derecha
    {
      titulo: "VISIÓN",
      descripcion: "Ser reconocidos globalmente como la plataforma líder en soluciones de certificación para el sector agroalimentario, facilitando el cumplimiento normativo internacional y promoviendo prácticas sostenibles que beneficien a productores, consumidores y al planeta.",
      imagenFondo: "https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?q=80&w=1200&auto=format&fit=crop",
      posicionTexto: "centro-enmarcado",
      alineacionTexto: "derecha",
      colorOverlay: "rgba(25, 32, 71, 0.8)",
      colorSeparador: "green-6",
      anchoTexto: "100%",
      altura: "280px"
    },
    // Componente 4: Visión - texto a la izquierda
    {
      titulo: "VISIÓN",
      descripcion: "Ser reconocidos globalmente como la plataforma líder en soluciones de certificación para el sector agroalimentario, facilitando el cumplimiento normativo internacional y promoviendo prácticas sostenibles que beneficien a productores, consumidores y al planeta.",
      imagenFondo: "https://images.unsplash.com/photo-1471193945509-9ad0617afabf?q=80&w=1200&auto=format&fit=crop",
      posicionTexto: "centro-enmarcado",
      alineacionTexto: "izquierda",
      colorOverlay: "rgba(25, 32, 71, 0.8)",
      colorSeparador: "green-6",
      anchoTexto: "100%",
      altura: "280px"
    },
    // Componente 5: Valores - texto centrado
    {
      titulo: "VALORES",
      descripcion: "Integridad, Innovación, Sostenibilidad, Transparencia y Compromiso con la excelencia. Estos principios guían nuestras acciones y decisiones, mientras trabajamos para transformar positivamente la industria agroalimentaria.",
      imagenFondo: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1200&auto=format&fit=crop",
      posicionTexto: "centro-enmarcado",
      alineacionTexto: "centro",
      colorOverlay: "rgba(74, 20, 140, 0.7)",
      colorSeparador: "purple-6",
      anchoTexto: "100%",
      altura: "280px"
    }
  ],
  
  navbar: {
    logoUrl: 'https://placehold.co/200x80/F9A826/000000?text=CERTIFFY',
    navItems: [
      { label: 'INICIO', url: '/' },
      { label: 'ACERCA DE', url: '/acerca-de' },
      { label: 'PLATAFORMA', url: '/plataforma' },
      { label: 'NOTICIAS Y EVENTOS', url: '/noticias-y-eventos' },
      { label: 'PACTO VERDE', url: '/pacto-verde' },
      { label: 'API', url: '/api' },
      { label: 'CONTACTO', url: '/contacto' }
    ]
  },
  
  newsCarousel: {
    title: 'FOTOS EN CARROUSEL SOBRE LAS NOVEDADES DE LA PÁGINA',
    items: [
      {
        title: 'Video Corporativo',
        description: 'Presentamos nuestro nuevo video corporativo donde mostramos las funcionalidades principales de la plataforma CERTIFFY.',
        image: 'https://placehold.co/600x400/e9f6ff/1a73e8?text=Video+Corporativo',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        videoLabel: '(video corporativo)',
        buttonLabel: 'Ver más',
        buttonUrl: '/videos'
      },
      {
        title: 'Nueva Actualización',
        description: 'Lanzamos una nueva actualización con mejoras significativas en el módulo de trazabilidad.',
        image: 'https://placehold.co/600x400/f0fff0/4caf50?text=Actualización',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        videoLabel: '(demostración de funcionalidades)',
        buttonLabel: 'Conocer más',
        buttonUrl: '/actualizaciones'
      },
      {
        title: 'Caso de Éxito',
        description: 'Conoce cómo nuestros clientes han mejorado su gestión de certificaciones con CERTIFFY.',
        image: 'https://placehold.co/600x400/fff6e0/ff9800?text=Caso+de+Éxito',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        videoLabel: '(testimonios)',
        buttonLabel: 'Ver caso',
        buttonUrl: '/casos'
      }
    ]
  },
  
  noticiasEventos: {
    title: 'NOTICIAS Y EVENTOS',
    botonLeerMasTexto: 'Leer más',
    botonVerTodasTexto: 'Ver todas las noticias',
    banner: {
      titulo: "La tecnología blockchain revoluciona la certificación agrícola",
      descripcion: "Las soluciones digitales están transformando la trazabilidad y transparencia en la cadena de suministro agroalimentaria",
      imagenUrl: "https://images.pexels.com/photos/1353938/pexels-photo-1353938.jpeg?auto=compress&cs=tinysrgb&w=1200",
      categoria: "CAFÉ"
    },
    articuloPrincipal: {
      titulo: "Certiffy implementa nuevas soluciones para pequeños productores",
      contenido: "Certiffy ha anunciado hoy el lanzamiento de una nueva plataforma diseñada específicamente para pequeños productores de café, permitiéndoles acceder a certificaciones internacionales a un costo reducido. Esta iniciativa busca democratizar el acceso a mercados premium y garantizar mejores precios para los agricultores locales. La solución incluye herramientas de digitalización simplificadas y asesoramiento técnico continuo.",
      fecha: "22 Mayo 2025"
    },
    imagenSecundaria: {
      imagenUrl: "https://images.pexels.com/photos/1379636/pexels-photo-1379636.jpeg?auto=compress&cs=tinysrgb&w=1200",
      caption: "Productores locales durante la capacitación sobre el uso de la plataforma Certiffy"
    },
    articuloSecundario: {
      titulo: "Alianza estratégica con cooperativas latinoamericanas",
      contenido: "Certiffy ha firmado un acuerdo marco con la Federación de Cooperativas Cafetaleras de América Latina para implementar un sistema de trazabilidad que beneficiará a más de 50,000 agricultores. El sistema permite verificar el origen del café y garantizar que cumple con los estándares de sostenibilidad requeridos por los mercados internacionales."
    },
    imagenTerciaria: {
      imagenUrl: "https://images.pexels.com/photos/1181673/pexels-photo-1181673.jpeg?auto=compress&cs=tinysrgb&w=1200",
      caption: "Ceremonia de firma del acuerdo con representantes de cooperativas latinoamericanas"
    },
    noticiasAdicionales: [
      {
        titulo: "CERTIFFY LANZA APP MÓVIL PARA AGRICULTORES",
        imagenUrl: "https://images.pexels.com/photos/2113566/pexels-photo-2113566.jpeg?auto=compress&cs=tinysrgb&w=1200"
      },
      {
        titulo: "TALLER DE CERTIFICACIÓN ORGÁNICA EN COLOMBIA",
        imagenUrl: "https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=1200"
      },
      {
        titulo: "NUEVOS ESTÁNDARES DE CALIDAD PARA EXPORTACIÓN",
        imagenUrl: "https://images.pexels.com/photos/2113566/pexels-photo-2113566.jpeg?auto=compress&cs=tinysrgb&w=1200"
      }
    ],
    notaInformativa: "Alianza estratégica para mejorar la trazabilidad en la cadena de suministro agrícola",
    noticias: [
      {
        titulo: 'CERTIFFY X AGROJAL',
        descripcion: 'Alianza estratégica para mejorar la trazabilidad en la cadena de suministro agrícola y garantizar la calidad de los productos.',
        imagen: 'https://placehold.co/600x400/eef8ff/2196f3?text=CERTIFFY+X+AGROJAL',
        fecha: '10 de mayo de 2025',
        url: '/noticias/certiffy-agrojal'
      },
      {
        titulo: 'TITULO DE LA NOTICIA',
        descripcion: 'Nueva actualización de nuestra plataforma de certificación con funcionalidades mejoradas para la gestión de documentos.',
        imagen: 'https://placehold.co/600x400/e6f9e6/4caf50?text=NOTICIA',
        fecha: '2 de mayo de 2025',
        url: '/noticias/actualizacion-plataforma'
      },
      {
        titulo: 'TITULO DE LA NOTICIA',
        descripcion: 'Webinar sobre las nuevas normativas europeas de certificación y cómo CERTIFFY puede ayudar a cumplirlas.',
        imagen: 'https://placehold.co/600x400/e6f9e6/4caf50?text=NOTICIA',
        fecha: '28 de abril de 2025',
        url: '/noticias/webinar-normativas'
      }
    ],
    verMasUrl: '/noticias-y-eventos'
  },
  
  testimonials: {
    testimonials: [
      {
        frase: 'CERTIFFY ha transformado nuestra forma de gestionar la trazabilidad de nuestros productos',
        autor: 'Carlos Martínez',
        organizacion: 'Director de Calidad - AgroExport'
      },
      {
        frase: 'Desde que implementamos CERTIFFY, hemos reducido un 40% el tiempo dedicado a gestionar certificaciones',
        autor: 'Laura Gómez',
        organizacion: 'Gerente de Operaciones - FreshFruits'
      },
      {
        frase: 'La plataforma es intuitiva y fácil de usar, lo que ha facilitado su adopción por todo nuestro equipo',
        autor: 'Miguel Sánchez',
        organizacion: 'CEO - Orgánicos del Sur'
      }
    ]
  },
  
  modulosVideo: {
    title: 'Módulos de CERTIFFY',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnailUrl: 'https://placehold.co/800x450/e0f2f1/00796b?text=Video+CERTIFFY',
    placeholderImage: 'https://placehold.co/800x450/e0f2f1/00796b?text=Video+CERTIFFY',
    description: '(Video de generalidades donde se habla sobre los 3 módulos de certiffy)',
    richText: '<p>Con este módulo, puede generar órdenes de corte y gestionar todo el proceso de certificación de manera eficiente. Explore las diferentes funcionalidades disponibles a través de los enlaces a continuación.</p>',
    links: [
      { label: 'Trazabilidad', url: '/trazabilidad' },
      { label: 'Administración', url: '/administracion' },
      { label: 'Certificación', url: '/certificacion' }
    ],
    linksTitle: 'Módulos disponibles'
  },
  
  trazabilidad: {
    banner: {
      titulo: 'TRAZABILIDAD',
      imagenUrl: 'https://images.pexels.com/photos/1286632/pexels-photo-1286632.jpeg'
    },
    seccion1: {
      titulo: '',
      subtitulo: 'TEXTO #1',
      texto: 'La trazabilidad en la cadena alimentaria es un componente esencial para garantizar la seguridad y calidad de los productos. CERTIFFY proporciona herramientas avanzadas para monitorear cada etapa del proceso, desde la producción hasta la distribución, asegurando transparencia y confianza para productores y consumidores.',
      imagenUrl: 'https://images.unsplash.com/photo-1560493676-04071c5f467b?q=80&w=1200&auto=format&fit=crop'
    },
    seccion2: {
      texto: 'Nuestro sistema de trazabilidad utiliza tecnología blockchain para crear registros inmutables y verificables. Esto permite a los participantes de la cadena de suministro acceder a información precisa sobre el origen, procesamiento y distribución de los productos. Con CERTIFFY, puede generar QR codes para cada lote, facilitando el acceso a esta información tanto para distribuidores como para consumidores finales.',
      imagenUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1200&auto=format&fit=crop'
    },
    seccion3: {
      texto: 'La implementación de un sistema robusto de trazabilidad no solo cumple con las normativas internacionales, sino que también añade valor a su marca. Los consumidores actuales valoran la transparencia y están dispuestos a pagar un precio premium por productos cuyo origen y proceso de producción pueden verificar. CERTIFFY le ayuda a destacar en un mercado competitivo, proporcionando las herramientas necesarias para comunicar el valor de sus prácticas sostenibles y éticas.'
    }
  },

  administracion: {
    banner: {
      titulo: 'ADMINISTRACIÓN',
      imagenUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=1200&auto=format&fit=crop'
    },
    seccion1: {
      titulo: 'TITULAR',
      subtitulo: 'TEXTO #1',
      texto: 'El módulo de Administración de CERTIFFY permite gestionar de manera integral todos los aspectos administrativos relacionados con la certificación y trazabilidad de productos. Desde la gestión de usuarios y permisos hasta el control de inventarios y reportes, esta herramienta optimiza los procesos administrativos y reduce la carga de trabajo manual.',
      imagenUrl: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=1200&auto=format&fit=crop'
    },
    seccion2: {
      texto: 'Con el panel de control centralizado, los administradores pueden monitorear en tiempo real el estado de las certificaciones, gestionar documentos y configurar alertas para eventos importantes. La interfaz intuitiva facilita la navegación y reduce la curva de aprendizaje, permitiendo a los usuarios aprovechar todas las funcionalidades desde el primer día.',
      imagenUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop'
    },
    seccion3: {
      texto: 'La seguridad de los datos es una prioridad en el módulo de Administración. Implementamos protocolos de encriptación avanzados y sistemas de respaldo automatizados para garantizar la integridad y disponibilidad de la información. Además, el sistema de auditoría registra todas las acciones realizadas, proporcionando transparencia y trazabilidad en las operaciones administrativas.'
    }
  },

  certificacion: {
    banner: {
      titulo: 'CERTIFICACIÓN',
      imagenUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1200&auto=format&fit=crop'
    },
    seccion1: {
      titulo: 'TITULAR',
      subtitulo: 'TEXTO #1',
      texto: 'El módulo de Certificación de CERTIFFY revoluciona la forma en que se gestionan los procesos de certificación en la industria agroalimentaria. Automatizamos el flujo de trabajo desde la solicitud inicial hasta la emisión del certificado final, reduciendo significativamente los tiempos de procesamiento y los errores humanos.',
      imagenUrl: 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?q=80&w=1200&auto=format&fit=crop'
    },
    seccion2: {
      texto: 'Nuestro sistema de certificación digital permite la verificación inmediata de la autenticidad de los certificados mediante códigos QR y blockchain. Los inspectores pueden utilizar nuestra aplicación móvil para realizar evaluaciones en campo, cargar evidencias y sincronizar la información con la plataforma central, incluso sin conexión a internet.',
      imagenUrl: 'https://images.unsplash.com/photo-1517292987719-0369a794ec0f?q=80&w=1200&auto=format&fit=crop'
    },
    seccion3: {
      texto: 'CERTIFFY se adapta a múltiples estándares de certificación internacional como GlobalG.A.P, Orgánico, Comercio Justo y muchos más. La plataforma permite configurar listas de verificación personalizadas según los requisitos específicos de cada estándar, facilitando el cumplimiento normativo y reduciendo la complejidad del proceso de certificación para productores y exportadores.'
    }
  },
  
  dueDiligence: {
    banner: {
      titulo: 'DUE DILIGENCE',
      imagenUrl: 'https://placehold.co/1200x400/e3f2fd/1e88e5?text=Due+Diligence'
    },
    titular: {
      titulo: 'TITULAR',
      subtitulo: 'TEXTO #1',
      descripcion: 'La Due Diligence es un proceso exhaustivo de evaluación y verificación que las empresas deben realizar para identificar, prevenir, mitigar y responder a los impactos adversos reales y potenciales de sus actividades sobre los derechos humanos y el medio ambiente a lo largo de toda su cadena de valor.',
      imagenUrl: 'https://placehold.co/400x300/e3f2fd/1e88e5?text=Foto+2',
      imagenTitulo: 'FOTO #2'
    },
    galeriaImagenes: {
      titulo: '(TEXTO #2)',
      descripcion: 'El Reglamento de la UE sobre la diligencia debida de las empresas en materia de sostenibilidad establece obligaciones para las grandes empresas en relación con los impactos adversos reales y potenciales sobre los derechos humanos y el medio ambiente, con respecto a sus propias operaciones, las operaciones de sus filiales y sus cadenas de valor.',
      imagenes: [
        { url: 'https://placehold.co/400x300/e3f2fd/1e88e5?text=Foto+4', titulo: 'FOTO #4' },
        { url: 'https://placehold.co/400x300/e3f2fd/1e88e5?text=Foto+5', titulo: 'FOTO #5' },
        { url: 'https://placehold.co/400x300/e3f2fd/1e88e5?text=Foto+6', titulo: 'FOTO #6' }
      ]
    },
    seccionImagen: {
      titulo: '(TEXTO #3)',
      texto: 'Las empresas afectadas deben integrar la diligencia debida en sus políticas, identificar los impactos adversos reales o potenciales, prevenirlos o mitigarlos, establecer y mantener un procedimiento de reclamación, supervisar la eficacia de su política y medidas de diligencia debida, y comunicar públicamente sobre la diligencia debida.',
      imagenUrl: 'https://placehold.co/400x300/e3f2fd/1e88e5?text=Foto+7',
      imagenTitulo: 'FOTO #7',
      reverseLayout: true
    },
    seccionFinal: {
      titulo: '(TEXTO #4)',
      texto: 'CERTIFFY proporciona herramientas especializadas para ayudar a las empresas a cumplir con estos requisitos de Due Diligence, facilitando la documentación, trazabilidad y verificación de todos los procesos de la cadena de suministro. Nuestras soluciones permiten identificar riesgos potenciales, implementar medidas correctivas y generar los informes necesarios para demostrar el cumplimiento ante las autoridades competentes.',
      imagenUrl: 'https://placehold.co/400x300/e3f2fd/1e88e5?text=Foto+8',
      imagenTitulo: 'FOTO #8',
      reverseLayout: true
    }
  },

  unionEuropea: {
    banner: {
      titulo: 'UNIÓN EUROPEA',
      imagenUrl: 'https://images.unsplash.com/photo-1515674447568-09bbb507b96c?q=80&w=1200&auto=format&fit=crop'
    },
    textoDocumentos: {
      titulo: 'Texto',
      descripcion: 'La Unión Europea ha implementado diversas normativas y regulaciones orientadas a garantizar la sostenibilidad y trazabilidad en la cadena de suministro agroalimentaria. Estas iniciativas forman parte del Pacto Verde Europeo, una estrategia integral que busca transformar la economía de la UE hacia un modelo más sostenible y respetuoso con el medio ambiente.',
      documentos: [
        { titulo: 'Reglamento UE 2023/1115', url: '#' },
        { titulo: 'Directiva 2019/1937', url: '#' },
        { titulo: 'Normativa EU Green Deal', url: '#' }
      ]
    },
    galeriaImagenes: {
      titulo: '(TEXTO #1)',
      descripcion: 'El cumplimiento de las normativas europeas es fundamental para garantizar el acceso a los mercados de la Unión Europea. CERTIFFY proporciona herramientas especializadas para facilitar el cumplimiento de estos requisitos, incluyendo módulos específicos para la gestión de documentación, trazabilidad y certificación conforme a los estándares establecidos por la UE.',
      imagenes: [
        { url: 'https://images.unsplash.com/photo-1528396518501-b53b655eb9b3?q=80&w=400&auto=format&fit=crop', titulo: 'FOTO 2' },
        { url: 'https://images.unsplash.com/photo-1496247749665-49cf5b1022e9?q=80&w=400&auto=format&fit=crop', titulo: 'FOTO 3' },
        { url: 'https://images.unsplash.com/photo-1506755594592-349d12a7c52a?q=80&w=400&auto=format&fit=crop', titulo: 'FOTO 4' }
      ]
    },
    seccionFinal: {
      texto: 'La Unión Europea continúa evolucionando su marco regulatorio para responder a los retos globales como el cambio climático, la pérdida de biodiversidad y la seguridad alimentaria. Las empresas del sector agroalimentario deben mantenerse actualizadas sobre estos cambios y adaptar sus procesos para garantizar el cumplimiento normativo. CERTIFFY se mantiene a la vanguardia de estas transformaciones, actualizando constantemente sus herramientas y proporcionando información relevante para ayudar a sus clientes a navegar este complejo entorno regulatorio.'
    },
    masSecciones: {
      titulo: '(TEXTO #2)',
      texto: 'La normativa europea relacionada con el Pacto Verde ha establecido estrictos requisitos de trazabilidad y transparencia para productos agrícolas, especialmente aquellos relacionados con cadenas de suministro que pueden contribuir a la deforestación. Esto incluye cacao, café, soja, aceite de palma, madera y productos derivados. Las empresas deben demostrar que sus productos no provienen de tierras deforestadas después del 31 de diciembre de 2020, lo que requiere sistemas robustos de gestión de información y trazabilidad.',
      imagenUrl: 'https://images.pexels.com/photos/2284170/pexels-photo-2284170.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      imagenTitulo: 'FOTO 5'
    }
  },

  pactoVerde: {
    title: 'PACTO VERDE',
    subtitle: '(ES UN APARTADO DONDE SE HABLA DE LA DUE DILIGENCE Y LA UNIÓN EUROPEA)',
    backgroundImage: 'https://placehold.co/1200x400/e3f2fd/1e88e5?text=Pacto+Verde',
    categories: [
      {
        title: 'UNIÓN EUROPEA',
        description: 'Cumplimiento de las normativas de la Unión Europea relacionadas con la sostenibilidad y la trazabilidad en la cadena de suministro agroalimentaria.',
        url: '/pacto-verde/union-europea',
        buttonText: 'Ver normativas',
        features: [
          'Regulación de deforestación',
          'Pacto Verde Europeo',
          'Estrategia Farm to Fork'
        ]
      },
      {
        title: 'DUE DILIGENCE',
        description: 'Proceso de debida diligencia para asegurar el cumplimiento de las normativas ambientales y sociales en toda la cadena de valor.',
        url: '/pacto-verde/due-diligence',
        buttonText: 'Más información',
        features: [
          'Evaluación de riesgos',
          'Certificación de procesos',
          'Monitoreo continuo'
        ]
      }
    ],
    headerCategories: ['Trazabilidad', 'Administración', 'Certificación'],
    showHeaderCategories: true
  },
  
  partnerLinks: {
    title: 'Titular......seguimos sumando visiones ........',
    links: [
      { text: 'Enlaces web socios y/o aliados', url: '#' },
      { text: 'Enlaces web socios y/o aliados', url: '#' },
      { text: 'Enlaces web socios y/o aliados', url: '#' },
      { text: 'Enlaces web socios y/o aliados', url: '#' }
    ]
  },
  
  footerContact: {
    direccionTitle: 'Dirección',
    direccion: 'Mexico',
    contactoTitle: 'Contacto',
    telefono: 'Teléfono: +52 (433) 822 7028',
    imagenUrl: 'https://placehold.co/400x400/e6f7ff/0288d1?text=CERTIFFY',
    copyrightText: '2025 CERTIFFY. Todos los derechos reservados.',
    redesSociales: [
      { icon: 'mdi-linkedin', url: 'https://www.linkedin.com/', color: 'blue-7' },
      { icon: 'mdi-facebook', url: 'https://www.facebook.com/', color: 'blue-9' },
      { icon: 'mdi-instagram', url: 'https://www.instagram.com/', color: 'purple-5' },
      { icon: 'mdi-twitter', url: 'https://www.twitter.com/', color: 'light-blue-5' }
    ]
  }
};
