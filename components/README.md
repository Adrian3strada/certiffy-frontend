# Estructura de Componentes CMS Marketing Vue

Este directorio contiene los componentes utilizados en la aplicación CMS Marketing Vue. La estructura ha sido reorganizada para mejorar la mantenibilidad y claridad del código.

## Estructura de Carpetas

### `/api`
Contiene todos los componentes que consumen datos de la API de Wagtail.

#### `/api/core`
Componentes centrales del sistema que manejan la carga y renderizado dinámico de páginas:
- `DynamicBlockRenderer.vue` - Componente principal que renderiza los bloques de contenido dinámico
- `DynamicBlockRenderer.vue` - Renderiza bloques complejos dinámicamente
- `ApiContentRenderer.vue` - Renderiza contenido básico como texto, imágenes, etc.

#### `/api/blocks`
Componentes básicos que renderizan bloques individuales de contenido:
- `ApiButtonComponent.vue` - Botones
- `ApiImageComponent.vue` - Imágenes
- `ApiRichTextComponent.vue` - Texto enriquecido
- `ApiHeroBannerComponent.vue` - Banner hero con imagen y texto
- `ApiDocumentComponent.vue` - Archivos descargables
- `ApiGalleryComponent.vue` - Galerías de imágenes
- `ApiModulosVideoComponent.vue` - Módulos con videos

#### `/api/feature-blocks`
Componentes especializados para secciones específicas:
- `ApiCarouselComponent.vue` - Carruseles
- `ApiCardComponent.vue` - Tarjetas
- `ApiTestimonialsComponent.vue` - Testimonios
- `ApiPactoVerdeComponent.vue` - Sección Pacto Verde
- `ApiCardsEDComponent.vue` - Tarjetas específicas
- `ApiMisionComponent.vue` - Componente de misión
- `ApiSociosComponent.vue` - Listado de socios
- `ApiVideoComponent.vue` - Componente de video

#### `/api/layout`
Componentes que forman parte del layout principal:
- `ApiNavbarComponent.vue` - Barra de navegación
- `ApiFooterComponent.vue` - Pie de página

### `/archived`
Contiene componentes y código que ya no se utiliza activamente pero se mantiene como referencia.

## Notas de Uso

- Todos los componentes utilizan exclusivamente el composable `useFetch` de Nuxt para peticiones HTTP, eliminando cualquier dependencia de axios.
- El sistema está diseñado para detectar automáticamente el tipo de página y renderizar los componentes apropiados.
- Los componentes pueden ser reutilizados en cualquier página del sitio gracias al sistema dinámico de carga.
