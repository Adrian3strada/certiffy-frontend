# CMS Marketing con Vue

Aplicación web SPA (Single Page Application) headless que consume contenido dinámico desde una API de Wagtail CMS. Desarrollada con Vue.js, Nuxt 3, Quasar y tecnologías modernas, la aplicación renderiza de forma dinámica los bloques y componentes basados en la respuesta de la API.

## Características

- **Renderizado dinámico de componentes**: Renderiza automáticamente los componentes basados en el tipo de bloque recibido de la API
- **Componentes reutilizables**: Encabezados, contenido, galerías, testimonios, carruseles y más
- **Diseño responsivo**: Las páginas se adaptan automáticamente a cualquier dispositivo
- **Rutas dinámicas**: Sistema de rutas que mapea los slugs de la API a páginas en la aplicación
- **Manejo de errores robusto**: Fallbacks y mensajes de error amigables para el usuario
- **Proxying de imágenes**: Sistema que gestiona automáticamente las rutas de imágenes para evitar problemas CORS

## Tecnologías utilizadas

- **Vue.js 3**: Framework JavaScript progresivo con Composition API
- **Nuxt 3**: Framework para aplicaciones Vue.js
- **Quasar**: Framework UI con componentes Vue.js
- **useFetch**: Hook nativo de Nuxt para peticiones HTTP

## Instalación

```bash
# Instalar dependencias
npm install
```

## Desarrollo

```bash
# Iniciar servidor de desarrollo en http://localhost:3000
npm run dev
```

## Estructura del proyecto

```
├── assets/             # Recursos estáticos (imágenes, estilos)
├── components/         # Componentes Vue reutilizables
│   ├── api/             # Componentes para el consumo de API
│   │   └── core/        # Componentes centrales del sistema (DynamicBlockRenderer)
│   │   ├── blocks/      # Componentes básicos (texto, imágenes, botones, hero banners)
│   │   ├── feature-blocks/ # Componentes especializados (carruseles, tarjetas, testimonios)
│   │   ├── layout/      # Componentes de estructura (navbar, footer)
│   │   ├── shared/      # Componentes compartidos
│   │   └── registry.js   # Registro centralizado de componentes
│   └── archived/        # Componentes archivados (no en uso activo)
├── composables/        # Composables de Vue
│   ├── useWagtailApi.js # Composable para interactuar con la API de Wagtail
│   ├── useComponentRegistry.js # Registro dinámico de componentes
│   └── useDynamicPages.js # Manejo de páginas dinámicas
├── layouts/            # Layouts de la aplicación
├── pages/              # Páginas de la aplicación
│   ├── index.vue       # Página principal
│   └── [...slug].vue   # Manejador de rutas dinámicas
├── plugins/            # Plugins de Nuxt
│   ├── api-client.js    # Cliente para API
│   └── apiFetch.js      # Utilidad para useFetch
├── public/             # Archivos públicos estáticos
└── server/             # Endpoints de API del lado del servidor
    └── api/            # API endpoints para proxy y funcionalidades del servidor
```

## Uso

1. Inicia la aplicación con `npm run dev`
2. Accede a http://localhost:3000
3. La aplicación carga dinámicamente el contenido desde la API de Wagtail
4. Navega a otras páginas utilizando los enlaces del menú
5. La aplicación renderiza automáticamente los componentes según los tipos de bloques recibidos

## Configuración de la API

La aplicación requiere una API de Wagtail CMS. Configura la URL base de la API en el archivo `.env`:

```
NUXT_PUBLIC_API_BASE=https://tu-url-de-api-wagtail.com
```

Además, asegúrate de que el servidor Wagtail tenga habilitada la API y que los tipos de bloques correspondan con los componentes registrados en `components/api/registry.js`.

## Producción

```bash
# Construir para producción
npm run build

# Previsualizar la versión de producción
npm run preview
```

Consulta la [documentación de despliegue de Nuxt](https://nuxt.com/docs/getting-started/deployment) para más información.
